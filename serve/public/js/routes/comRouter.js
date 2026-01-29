const express = require('express')
const rt = express.Router()
const Weather = require('../db/model/Weather')
const https = require("https")
const {permitMapCode} = require("./adcodeMap")
const cors = require("cors")
const zlib = require('zlib');

console.log(permitMapCode["320100"])
/*
策略说明（实现要点）：
- 小时窗口按“整点到下一个整点”对齐（例如 14:00:00 到 15:00:00）。
- 每次 /weather?adcode=XXX 请求时：
  1) 检查数据库中是否存在该 adcode 在当前小时窗口已有的记录（通过 fetchedHour 字段）。
  2) 若有，则直接返回数据库记录（避免调用第三方）。
  3) 若没有，则对该 adcode 发起一次外部天气请求（支持先和风、失败再高德回退），将结果存入数据库并返回。
- 为防止短时间内对同一 adcode 发起重复的并行请求，使用内存中的 pendingFetches 去重并发请求。
- 若外部请求失败且数据库已有历史记录（即使不是当前小时），会返回该历史记录作为降级；若都没有则返回错误。
*/

// 配置与全局状态
const WEAKEY = "efe6b93d1cba049b9dc582fb9f37e255" // 高德（回退用）
const YourPrivateKey = `` // 和风私钥（若使用和风，需要在 privateInfo.md 或环境变量里填充）
const HostApi = "https://nh6apvw8ee.re.qweatherapi.com" // 和风 API 主机（可替换）


// pendingFetches 用于合并并发请求，key = `${adcode}_${hourISO}`
const pendingFetches = new Map()

function getCurrentHourISO() {
  const d = new Date()
  d.setMinutes(0, 0, 0, 0)
  return d.toISOString()
}

// promisified https GET that returns Buffer
function httpsGetBuffer(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        const buf = Buffer.concat(chunks)
        resolve({ res, buffer: buf })
      })
    })
    req.on('error', (e) => reject(e))
    // in case options.timeout is set
    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        req.abort()
        reject(new Error('Request timeout'))
      })
    }
  })
}

function gunzipAsync(buffer) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (err, decoded) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

// 将和风的响应解析为统一的对象，如果失败抛错
async function fetchHfWeather(adcode) {
  if (!YourPrivateKey) throw new Error('Hf private key not configured')
  const token = await genHfWeaToken()
  const options = { headers: { 'Authorization': `Bearer ${token}` } }
  // permitMapCode maps adcode -> [location, ...], 使用 permitMapCode 中的 location
  const location = permitMapCode[adcode] && permitMapCode[adcode][0]
  if (!location) throw new Error(`No location mapping for adcode ${adcode}`)
  const url = `${HostApi}/v7/weather/now?location=${location}`

  const { res, buffer } = await httpsGetBuffer(url, options)
  const encoding = res.headers['content-encoding']
  let bodyBuf = buffer
  if (encoding === 'gzip') {
    bodyBuf = await gunzipAsync(buffer)
  }
  const txt = bodyBuf.toString()
  const result = JSON.parse(txt)
  console.log("Hf weather response:", result)
  if (!result || !result.now) throw new Error('Invalid Hf response')
  const { text, temp, humidity, windScale, windDir, obsTime } = result.now
  console.log("result.now:", result.now)
  const windDirClean = (windDir || '').replace(/风/g, "")
  return {
    prov: '', // 和风不一定返回省名在 now 段
    city: permitMapCode[adcode][1] || '', // 使用映射表中的城市名
    adcode,
    wea: text,
    temp,
    hum: humidity,
    windpower: windScale,
    winddir: windDirClean,
    reporttime: obsTime
  }
}

// 高德回退请求，解析为统一对象
async function fetchAmapWeather(adcode) {
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${WEAKEY}`
  const { res, buffer } = await httpsGetBuffer(url)
  const txt = buffer.toString()
  const data = JSON.parse(txt)
  if (!data || !data.lives || !data.lives[0]) throw new Error('Invalid Amap response')
  let { province, city, adcode: ac, weather, temperature, humidity, windpower, winddirection, reporttime } = data.lives[0]
  windpower = (windpower || '').replace(/≤/g, "").replace(/≥/g, "")
  return {
    prov: province,
    city,
    adcode: ac || adcode,
    wea: weather,
    temp: temperature,
    hum: humidity,
    windpower,
    winddir: winddirection,
    reporttime
  }
}

// 对外暴露的按需获取函数：尝试和风 -> 高德回退，成功后写入数据库（包含 fetchedHour 字段）
async function fetchAndSaveWeatherForAdcode(adcode) {
  adcode = adcode.trim()
  // 先尝试和风（若配置），失败再用高德回退
  let data = null
  try {
    if (YourPrivateKey) data = await fetchHfWeather(adcode)
      console.log(data)
  } catch (e) {
    console.warn('Hf fetch failed, fallback to Amap:', e)
    try {
      data = await fetchAmapWeather(adcode)
    } catch (e2) {
      // both failed
      throw new Error(`All providers failed for ${adcode}: ${e2.message || e2}`)
    }
  }
  

  // 保存到数据库，增添 fetchedHour（按整点对齐）
  const fetchedHour = getCurrentHourISO()
  const update = {
    ...data,
    fetchedHour
  }
  const doc = await Weather.findOneAndUpdate(
    { adcode },
    update,
    { new: true, upsert: true }
  )
  return doc
}

// Route: 返回天气，按需拉取并缓存（小时对齐）
rt.get('/weather', cors(), async (req, res) => {
  try {
    const { adcode } = req.query
    if (!adcode) return res.status(400).json({ err: "2", msg: "missing adcode" })

    const currentHour = getCurrentHourISO()

    // 查数据库：优先返回当前小时内已有结果
    const existing = await Weather.findOne({ adcode })
    if (existing && existing.fetchedHour === currentHour) {
      // 已有当前小时数据，直接返回
      const { city, wea, temp, hum, windpower, winddir } = existing
      return res.json({ err: "0", city, wea, temp, hum, winddir, windpower })
    }

    // 若已有并不是当前小时的旧数据，我们仍然尝试去获取新的（以保证数据时效）。
    // 为避免并发时重复请求，使用 pendingFetches 合并
    const key = `${adcode}_${currentHour}`
    if (pendingFetches.has(key)) {
      // 等待已存在的请求
      const doc = await pendingFetches.get(key)
      const { city, wea, temp, hum, windpower, winddir } = doc
      return res.json({ err: "0", city, wea, temp, hum, winddir, windpower })
    }

    // 创建一个 fetch Promise 并放入 pendingFetches
    const fetchPromise = (async () => {
      try {
        const doc = await fetchAndSaveWeatherForAdcode(adcode)
        return doc
      } catch (e) {
        // 若获取失败，但数据库有旧数据，降级返回旧数据；否则抛错
        if (existing) return existing
        throw e
      } finally {
        // 注意：不能在这里删除 map，因为外层 await 需要拿到结果。
      }
    })()

    pendingFetches.set(key, fetchPromise)

    try {
      const doc = await fetchPromise
      const { city, wea, temp, hum, windpower, winddir } = doc
      return res.json({ err: "0", city, wea, temp, hum, winddir, windpower })
    } catch (e) {
      console.error('Fetch weather error:', e)
      return res.status(500).json({ err: "4", msg: "external api error", detail: e.message })
    } finally {
      // 清理 pendingFetches
      pendingFetches.delete(key)
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ err: "5", msg: "internal error" })
  }
})

// 生成和风天气的 JWT token
async function genHfWeaToken () {
  // 动态导入 jose
  const { SignJWT, importPKCS8 } = await import('jose')
  const privateKey = await importPKCS8(YourPrivateKey, 'EdDSA')
  const iat = Math.floor(Date.now() / 1000) - 30
  const exp = iat + 60 * 5 // 5分钟有效期
  const token = await new SignJWT({
    sub: '4MDWN3CX58',
    iat,
    exp
  })
    .setProtectedHeader({ alg: 'EdDSA', kid: 'CHB3UJ8CWV' })
    .sign(privateKey)
  return token
}



/* --- 时间 --- */
rt.get("/time", cors(), (req, res) => {
  console.log(`${new Date()}: \n${JSON.stringify(req.headers)} \n${JSON.stringify(req.baseUrl)}`)
  let timezone = parseInt(req.query.timezone)
  if (timezone >= -12 && timezone <= 12) {
    res.json({err: "0", time: getTimeByTimeZone(timezone)})
  } else res.json({err: "2", msg: "offset err"})
})

const weekdayCH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getTimeByTimeZone(offset, isWeekday=false) {
  // 获取当前时间
  const currentDate = new Date();

  // 获取 UTC 时间
  const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000);

  // 根据时区偏移量计算目标时间
  const targetDate = new Date(utc + (3600 * 1000 * offset));

  // 获取年、月、日、时、分
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = String(targetDate.getDate()).padStart(2, '0');
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const weekday = targetDate.getDay(); // 0（周日）到 6（周六）
  // 返回格式化的字符串
  if (isWeekday) return weekdayCH[weekday];
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

rt.get("/time/weekday", cors(), (req, res) => { // 获取周几
  let timezone = parseInt(req.query.timezone)
  if (timezone >= -12 && timezone <= 12) {
    res.json({err: "0", weekday: getTimeByTimeZone(timezone, true)})
  } else res.json({err: "2", msg: "offset err"})
})

/* RFC1123时间 */
rt.get("/rfctime", cors(), (req, res) => {
  res.json({err: "0", time: new Date().toUTCString()})
})
  

module.exports = rt