const express = require('express')
const rt = express.Router()
const client =require('../mqtt/client')
const Device = require('../db/model/Device')
// const User = require('../db/model/User')
const MessageLog = require('../db/model/MessageLog')

/* 私有 */
rt.post('/reqData', (req, res) => {
  // let user = req.userx.name
  let {_id, i} = req.body
  console.log(_id)
  // let datax = `data${i}`
  Device.findOne({_id}, (err, doc) => {
    if(!err&&doc) {
      if (i < 4) res.json({err:0, val:doc.Cnum1})
      else res.json({err:0, val:doc.Cnum2})
    }
    else res.json({err:1})
  })
})

rt.post('/reqMsg', (req, res) => {
  console.log(req.body)
  // let user = req.userx.name
  let {_id} = req.body
  Device.findOne({_id}, (err, doc) => {
    if(!err&&doc) res.json({err:0, val:doc.Cmsg})
    else res.json({err:1})
  })
})

rt.get('/devNote', (req, res) => {
  let user = req.userx.name
  let {did} = req.query
  Device.findOne({user, did}, (err, doc) => {
    if (!err&&doc) res.json({err:0, val:doc.comment})
    else {
      console.log(new Date(), err, doc)
      res.json({err:5})}
  })
})

rt.post('/changeNote', (req, res) => {
  let user = req.userx.name
  let {did, comment} = req.body
  Device.updateOne({user, did}, {comment}, (err, q) => {
    if (!err&&q) {
      if (q.modifiedCount > 0) res.json({err: 0})
      else res.json({err:1})
    } else res.json({err:5})
  })
})

/* 新增：请求某设备某订阅主题的最新消息（前端轮询使用） */
rt.post('/reqSubMsg', async (req, res) => {
  try {
    let {_id, topic} = req.body
    if (!_id || !topic) return res.json({err:2, msg:'missing params'})
    let dev = await Device.findOne({_id})
    if (!dev) return res.json({err:3, msg:'no device'})
    // 找到最近一条 MessageLog
    let logs = await MessageLog.findOne({user: dev.user, did: dev.did.toString(), topic})
    let msgLen = logs?.messages?.length || 0
    if (msgLen === 0) return res.json({err:0, val: null})
    let last = logs.messages[msgLen - 1] // [time, payload]
    if (last) res.json({err:0, val: last[1], time: last[0]})
    else res.json({err:0, val: null})
  } catch (e) {
    console.log('reqSubMsg error', e)
    res.json({err:5})
  }
})

/* 新增：按设备/主题下载日志（可传 start/end 时间戳，否则默认近24小时） */
rt.post('/downloadLog', async (req, res) => {
  try {
    let user = req.userx.name
    let { did, subTopics } = req.body
    if (!did) return res.json({err:2, msg:'missing params'})
    if (!Array.isArray(subTopics) || subTopics.length === 0) return res.json({err:3, msg:'missing subTopics'})
    const logArr = []
    for (let topic of subTopics) {
      if (!topic || topic.toString().trim() === '') continue
      let logs = await MessageLog.findOne({ user, did: did.toString(), topic })
      if (logs?.messages?.length > 0) {
        logArr.push({ topic, msgs: logs.messages })
      }
    }
    if (logArr.length > 0) {
      res.json({err:0, logArr})
    } else {
      res.json({err:1, msg:'当前记录为空'})
    }
  } catch (e) {
    console.log('downloadLog error', e)
    res.json({err:5})
  }
})



module.exports = rt