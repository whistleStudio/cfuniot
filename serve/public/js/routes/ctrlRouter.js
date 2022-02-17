const express = require('express')
const rt = express.Router()
const client =require('../mqtt/client')


/* 处理按钮请求 */
rt.post('/btnVal', (req, res) =>  {
  let {did,btnArr,user} = req.body
  console.log(req.body)
  res.json({err:0})
  let btnBuf = Buffer.from(new Float32Array(btnArr).buffer)
  // byteOffset
  let numArr = [].slice.call(new Uint8Array(btnBuf.buffer, btnBuf.byteOffset, btnBuf.length))
  // reset Uint8 ArrayBuffer
  let b = new Uint8Array(numArr).buffer
  // get buffer
  btnBuf = Buffer.from(b)
  try {
    console.log(user, '-btnBuf: ', btnBuf)
    // username/did/Cbtn  message: buffer  8unit 16bytelength
    client.publish(`${user}/${did}/Cbtn`, btnBuf, {retain:false})
  }catch(e){console.log(new Date(), e)}
})

/* 处理滑杆请求 */
rt.post('/rangeVal', (req, res) => {
  let {did,ranArr,user} = req.body
  res.json({err:0})
  let ranBuf = Buffer.from(new Float32Array(ranArr).buffer)
  ranArr = [].slice.call(new Uint8Array(ranBuf.buffer, ranBuf.byteOffset, ranBuf.length))
  let b = new Uint8Array(ranArr).buffer
  ranBuf = Buffer.from(b)
  try {
    console.log(user, '-ranBuf: ', ranBuf)
    // username/did/Cran message: buffer 8unit 12bytelength
    client.publish(`${user}/${did}/Cran`, ranBuf, {retain:false})
  }catch(e){console.log(new Date(), e)}
})

/* 处理发送会话请求 */
rt.post('/pubMsgW', (req, res) => {
  let {did, msgW, user} = req.body
  res.json({err:0})
  try {
    console.log(user, '-msgW: ', msgW)
    client.publish(`${user}/${did}/CmsgW`, msgW, {retain:false})
  }catch(e){console.log(new Date(), e)}
})


module.exports = rt