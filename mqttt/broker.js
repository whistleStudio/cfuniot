const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883
const db = require('./db/connect')
const User = require('./db/model/User')
const Device = require('./db/model/Device')
const Topic = require('./db/model/Topic')
const WebSvId = 'cfweb1013'
const WebPwd = 'cfunworld666'
const fs = require("fs")
const http = require("http")

let cityJson 
fs.readFile("city.json", (err, data)=>{
  try {
    if(!err) {cityJson = JSON.parse(data).info}
  } catch(e){console.log(e)}  
})

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})

/* 设备状态：在线 */
aedes.on('clientReady', client => {
  if (client.id !== WebSvId) {
    if (client.connected) {
      changeDevState(client, 1).catch(e => {console.log('clientReady: error')})
    }
  }
})

/* 设备状态：离线(正常主动断开) */
aedes.on('clientDisconnect', client => {
  if (client.id !== WebSvId) {
    if (!client.connected) {
      console.log(`${new Date}: ${client.id} clientDisConnect`)
      changeDevState(client, 0).catch(e => {console.log('clientDisconnect: error')})
    }
  }
})

/* 设备状态：离线(异常心跳包断开) */
aedes.on("keepaliveTimeout", client => {
  if (client.id !== WebSvId) {
    console.log(`${new Date}: ${client.id} keepaliveTimeout`)
  }
})

/* 设备状态： 错误*/
aedes.on("clientError", (client, err) => {
  if (client.id !== WebSvId) {
    console.log(`${new Date}: ${client.id} clientError`)
    console.log("err:", err)
  } 
})


/* 客户端连接时验证（按序）
1 用户名和通讯秘钥匹配
2 用户已注册对应设备
*/
aedes.authenticate = function (client, username, password, callback) {
  var clientInfo = client.id.split('/')
  var auth = false
  if(password) {
    if (client.id === WebSvId && password.toString() === WebPwd) {
      callback(null, true)
      console.log('web connect')
    }  
    else {
      try {
        var name = clientInfo[0], did = clientInfo[1], code = password.toString() 
        ;(async () => {
          let doc = await User.findOne({name, code})
          if (doc) {
            let doc2 = await Device.findOne({user:doc.mail, did:did})
            if (doc2) {
              auth = true
              console.log(`${new Date()}: ${client.id} connected`)
            }
          }
          callback(null, auth)
        })()
      } catch(e) {console.log(e)}
    }
  } else callback(null, auth)
}

/* 发布频率限制 */
aedes.authorizePublish = function (client, packet, cb) {
  if (client.id !== WebSvId) {
    let freq = 900, topType = 1
    ;(async () => {
      let auth = await freqLimit(client.id, topType, freq)
      cb(auth) 
    })().catch(e => {console.log('broker: authorizePublish error')})
  } else cb(null)
}

/* 订阅频率限制 */
aedes.authorizeSubscribe = function (client, sub, cb) {
  if (client.id !== WebSvId) {
    ;(async () => {
      let freq = 900, topType = 2
      let auth = await freqLimit(client.id, topType, freq)
      cb(auth, sub)
    })().catch(e => {console.log('broker: authorizeSubscribe error')})
  } else cb(null, sub)
}


/* 限制客户端发布订阅主题频率
topType: 1表示私有发布，2表示订阅
freq（ms）  
*/
async function freqLimit (client, topType, freq) {
  let doc = await Topic.findOne({client, topType})
  // console.log('publimit',doc)
  if (!doc) {
    Topic.create({client, topType})
    return null
  }else {
    let curDate = new Date()
    let preT = doc.regDate.getTime(), curT = curDate.getTime()
    // console.log(curT, '-', preT, '=', curT-preT)
    if (curT - preT > freq) {
      await Topic.updateOne({client, topType}, {regDate: curDate})
      return null
    }else {
      return 'over pub frequence limit'  
    }
  }
}

/* 更改设备状态 */
async function changeDevState(client, sta) {
  var clientInfo = client.id.split('/')
  try {
    var name = clientInfo[0], did = clientInfo[1]
    let doc = await User.findOne({name})
    if (doc) {
      await Device.updateOne({user: doc.mail, did: did}, {state: sta, Cnum1: [0,0,0,0], Cnum2: [0,0,0,0], Cmsg: "hello cfunworld"})
    }
  } catch(e) {console.log(e)}
}

/* 天气 */
aedes.on('subscribe', (sub, client) => {
  if (client.id !== "cfweb1013") {
    let clientInfo = sub[0].topic.split("/")
    let name = clientInfo[0], did = clientInfo[1], top = clientInfo[2]
    if (top === "CWea") {
      ;(async()=>{
        try {
          let doc = await User.findOne({name}, "loc")
          if (doc) {
            let prov = doc.loc[0], city = doc.loc[1]
            city = modifyCity(cityJson[prov].city[city])
            http.get(`http://flash.weather.com.cn/wmaps/xml/${cityJson[prov].eng}.xml`, res=>{
              let info
              // 开始
              res.on('data', (chunk) => {
                info += chunk;
              });
              // 结束
              res.on('end', () => {
                try {
                  let cityWea = parseWeather(info, city)
                  let weaBuf = pubBuf(cityWea)
                  if (weaBuf) {
                    console.log(weaBuf)
                    setTimeout(()=>{
                    aedes.publish({topic:`${name}/${did}/CWea`, payload:weaBuf, retain:false},err=>{
                      console.log(err)
                    })
                    },500)
                  }
                } catch(e){console.log("weapub error", e)}
              });
            }).on("error", err=>console.log(err))
          }
        } catch(e) {console.log(e);}
      })()
    }
  }
})

/* 修正city */
function modifyCity (city) {
  let reg2 = /(.+)(市|县|盟|镇|区|州|地区)/
  let reg3 = /新区/
  if (city.length > 2) {
    if (reg2.test(city)&&!reg3.test(city)){
      city = city.match(reg2)[1]
    }
  }
  return city
}

/* 解析天气 */
function parseWeather (info,city) {
  let regStr = `cityname="${city}"([\\s\\S]+?)windState`
  let reg = RegExp(regStr)
  info = info.match(reg)[1]
  if (info) {
    let regTem1 = /tem1="(.+?)"/, regTem2 = /tem2="(.+?)"/,
        regStaNum = /state1="(.+?)"/, regTemNow = /temNow="(.+?)"/
    // 当前温度，天气，最低，最高
    let cityWea = [
      parseInt(info.match(regTemNow)[1]),
      parseInt(info.match(regStaNum)[1]),
      parseInt(info.match(regTem2)[1]),
      parseInt(info.match(regTem1)[1]),
    ]
    return cityWea
  } else return false 
} 

/* 转化成可用的publish buffer */
function pubBuf (arr) {
  arr = Buffer.from(new Float32Array(arr).buffer)
  // byteOffset
  let numArr = [].slice.call(new Uint8Array(arr.buffer, arr.byteOffset, arr.length))
  // reset Uint8 ArrayBuffer
  let b = new Uint8Array(numArr).buffer
  // get buffer
  return Buffer.from(b)
  
}