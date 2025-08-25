const express = require('express')
const rt = express.Router()
const Weather = require('../db/model/Weather')
const https = require("https")
const {adcodeMap, permitMapCode} = require("./adcodeMap")
const cors = require("cors")
const zlib = require('zlib');

/* --- 天气 --- */
// 处理客户端天气请求
rt.get('/weather', cors(), (req, res) => {
  // console.log(`${new Date()}: \n${JSON.stringify(req.headers)} \n${JSON.stringify(req.baseUrl)}`)
  let { adcode } = req.query
  Weather.findOne({adcode}, (err, doc) => {
    if (!err) {
      if (doc) {
        let {city, wea, temp, hum, windpower, winddir} = doc
        res.json({err: "0", city, wea, temp, hum, winddir, windpower})
      } else res.json({err: "1", msg: "city info err"})
    } else res.json({err: "5", msg: "database err"})
  })  
})

/* 高德天气 */

// 轮询每3小时，每日30万次（已调整） -> 每月5000次
setInterval(() => {
  getAmapWea()
}, 1000*3600*3)

function getAmapWea () {
  const WEAKEY = "efe6b93d1cba049b9dc582fb9f37e255"
  let cityCount = 0
  for (let v of adcodeMap) {
    if (Object.keys(permitMapCode).indexOf(v)<0) continue // 只更新许可的城市
    cityCount += 1
    https.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${v}&key=${WEAKEY}`, res => {
      let info = ""
      // 开始
      res.on('data', (chunk) => {
        info += chunk;
      }); 
      // 结束
      res.on("end", async () => {
        try {
          const data = JSON.parse(info)
          // console.log(data)
          let {province, city, adcode, weather, temperature, humidity, windpower, winddirection, reporttime} = data.lives[0]
          // 去除windpower中的"≤"和"≥"
          windpower = windpower.replace(/≤/g, "").replace(/≥/g, "")
          await Weather.findOneAndUpdate(
            {adcode: v}, 
            {prov: province, city, adcode, wea: weather, temp: temperature, hum: humidity, windpower, winddir: winddirection, reporttime},
            {new: true, upsert: true}
          )
        } catch (e) {console.log(e)}
      })
    }).on("error", err => console.log(err))
  }
  console.log(`AmapWea total ${cityCount} cities update`)
}

/* 和风天气 */
const YourPrivateKey = `` // privateInfo.md
const HostApi = "https://nh6apvw8ee.re.qweatherapi.com"

// 和风天气轮询, 每小时，每月30000次
setInterval(() => { 
  getHfWea()
}, 1000*3600)

async function getHfWea () {
  try {
    let token = await genHfWeaToken()
    const options = {
      headers: { 'Authorization': `Bearer ${token}` }
    }
    // console.log('Generated token:', token)
    // 遍历对象permitMapCode
    let cityCount = 0
    for (let adcode of Object.keys(permitMapCode)) {
      const url = `${HostApi}/v7/weather/now?location=${permitMapCode[adcode][0]}`
      getHfWeaOnce(adcode, url, options)
      cityCount += 1 
    }
    console.log(`HfWea total ${cityCount} cities update`)
  } catch (e) { console.error('Error generating token:', e) }
}
// 和风天气单次查询+数据库更新
function getHfWeaOnce (adcode, url, options) {
  https.get(url, options, (res) => {
    let data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
      try {
        const buffer = Buffer.concat(data);
        const encoding = res.headers['content-encoding'];
        // 和风返回是gzip压缩的
        if (encoding === 'gzip') {
          zlib.gunzip(buffer, async (err, decoded) => {
            if (err) {
              console.error('Decompression error:', err);
            } else {
              try {
                const result = JSON.parse(decoded.toString());
                let {text, temp, humidity, windScale, windDir, obsTime} = result.now
                // 去除windDir中的"风"字
                windDir = windDir.replace(/风/g, "")
                await Weather.findOneAndUpdate( 
                  {adcode}, 
                  {adcode, wea: text, temp, hum: humidity, windpower: windScale, winddir: windDir, reporttime: obsTime},
                  {new: true, upsert: true}
                )  
                // console.log(`HfWea ${adcode} update success:`, result)               
              } catch (e) { console.error('hf update db error:', e); }
            }
          });
        }
      } catch (e) { console.error('JSON parse error:', e) }
    });
  }).on('error', err => { console.error('Request error:', err) });
}

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
  if (isWeekday) return weekday;
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