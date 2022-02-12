const mqtt = require('mqtt')
const brokerPort = 1883
// 服务器clientId可以复杂点
var client  = mqtt.connect(`mqtt://localhost:${brokerPort}`, {clientId: 'cfweb1013', username:'cfunworld', password:'cfunworld666'})
// var client  = mqtt.connect(`mqtt://localhost:${brokerPort}`, {clientId: 'whistle/1', username:'whistle', password:'fnjd4Pc8Fx'})

const Device = require('../db/model/Device')
const User = require('../db/model/User')



client.on('connect', function () {
  console.log('aedes connect')
  // username/did/Cnum
  client.subscribe('+/+/Cnum1', (err, message) => {
    if (!err) console.log('Cnum1 top subscribe success')
    else console.log('Cnum1 top subscribe fail')
  })
  // username/did/Cnum2
  client.subscribe('+/+/Cnum2', (err, message) => {
    if (!err) console.log('Cnum2 top subscribe success')
    else console.log('Cnum2 top subscribe fail')
  })
  // username/did/Cmsg
  client.subscribe('+/+/Cmsg', (err, message) => {
    if (!err) console.log('Cmsg top subscribe success')
    else console.log('Cmsg top subscribe fail')
  })
})

client.on('message', function (topic, message) {
  let topInfo = topic.split('/')
  console.log(topInfo)
  // reg1,3 数值数据主题
  let reg1 = /.+\/.+\/Cnum1/
  let reg3 = /.+\/.+\/Cnum2/
  // reg2 字符串数据主题
  let reg2 = /.+\/.+\/Cmsg/
  let name=topInfo[0], did=topInfo[1], cn = 1
  if (reg1.test(topic) || reg3.test(topic)) {
    if (reg1.test(topic)) {console.log('get Cnum1 top:', topic); cn = 1}
    else {console.log('get Cnum2 top:', topic); cn = 2}
    ;(async () => {
      let numArr = [].slice.call(new Uint8Array(message.buffer, message.byteOffset, message.length))
      let b = new Uint8Array(numArr).buffer
      console.log(b)
      numArr = [].slice.call(new Float32Array(Buffer.from(b).buffer))
      console.log(numArr)
      // 无限转换
      // console.log('message: ', message, message.byteOffset, message.length)
      // console.log('msg.buffer: ', message.buffer)
      // console.log(numArr, b)
      // console.log(Buffer.from(b))
      // console.log([].slice.call(new Float32Array(Buffer.from(b).buffer)))

      // 数据库操作
      if (numArr.length === 4) {
        let doc = await User.findOne({name})
        if (doc) {
          if (cn === 1)
            await Device.updateOne({user:doc.mail, did:did}, {Cnum1: numArr})
          else
            await Device.updateOne({user:doc.mail, did:did}, {Cnum2: numArr})
        } else console.log(`user:${name} not reg`)
      }   
    })().catch(e => console.log('client.js: Cnum db error', e))
  }
  if (reg2.test(topic)) {
    console.log('get Cmsg top:', topic)
    ;(async () => {
      let msg = message.toString()
      console.log(msg)
      let doc = await User.findOne({name})
      if (doc) {
        await Device.updateOne({user:doc.mail, did:did}, {Cmsg: msg})
      } else console.log(`user:${name} not reg`)
    })().catch(e => console.log('client.js: Cmsg db error', e)) 
  }

})

module.exports = client