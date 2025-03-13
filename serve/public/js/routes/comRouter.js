const express = require('express')
const rt = express.Router()
const Weather = require('../db/model/Weather')
const https = require("https")
const adcodeMap = require("./adcodeMap")
const cors = require("cors")

/* --- 天气 --- */
// 处理客户端天气请求
rt.get('/weather', cors(), (req, res) => {
  let { adcode } = req.query
  Weather.findOne({adcode}, (err, doc) => {
    if (!err) {
      if (doc) {
        let {city, wea, temp, hum, windpower, winddir} = doc
        res.json({err:0, city, wea, temp, hum, winddir, windpower})
      } else res.json({err: 1, msg: "city info err"})
    } else res.json({err: 5, msg: "database err"})
  })  
})

// 高德天气轮询, 每小时
setInterval(() => {
  getAmapWea()
}, 1000*3600)

function getAmapWea () {
  const WEAKEY = "efe6b93d1cba049b9dc582fb9f37e255" //每日30万次
  let cityCount = 0
  for (let v of adcodeMap) {
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
          await Weather.findOneAndUpdate(
            {adcode: v}, 
            {prov: province, city, adcode, wea: weather, temp: temperature, hum: humidity, windpower, winddir: winddirection, reporttime},
            {new: true, upsert: true}
          )
        } catch (e) {console.log(e)}
      })
    }).on("error", err => console.log(err))
  }
  console.log(`total ${cityCount} cities update`)
}



/* --- 时间 --- */
rt.get("/time", cors(), (req, res) => {
  let timezone = parseInt(req.query.timezone)
  if (timezone >= -12 && timezone <= 12) {
    res.json({err: 0, time: getTimeByTimeZone(timezone)})
  } else res.json({err: 2, msg: "offset err"})
})

function getTimeByTimeZone(offset) {
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

  // 返回格式化的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = rt