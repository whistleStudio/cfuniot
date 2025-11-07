const express = require('express')
const rt = express.Router()
const Device = require('../db/model/Device')
const User = require('../db/model/User')

rt.get('/getDevList', (req, res) => {
  let user = req.userx.name
  Device.find({user}, (err, doc) => {
    res.json({err:0, data:doc})
  })  
})

rt.get('/getCurDev', (req, res) => {
  let user = req.userx.name
  let {name} = req.query
  Device.findOne({user, name}, (err, doc) => {
    if(!err) res.json({err:0, data:doc})
    else res.json({err: 1})
  }) 
})


rt.post('/regDev', (req, res) => {
  let user = req.userx.name
  let {name, did, auth} = req.body
  if (name&&did) {
    ;(async function () {
      let devList = await Device.find({user})
      if (devList.length < auth+1) {
        await Device.create({user, name, did, regDate: new Date()})
        res.json({err: 0})
      } else res.json({err:2, val: `当前用户可注册${auth+1}个设备`})
    })()
  }
})

rt.get('/delDev', (req, res) => {
  let user = req.userx.name
  let {did} = req.query
  Device.deleteOne({user, did}, (err, doc) => {
    if(doc) res.json({err:0})
    else res.json({err:1})
  })
})

rt.post('/changeDevInfo', (req, res) => {
  let user = req.userx.name
  let {preDid, newName, newDid} = req.body
  ;(async () => {
    try {
      let q = await Device.updateOne({user:user, did:preDid}, {name:newName, did:newDid})
      if (q.modifiedCount > 0) res.json({err:0, msg: "设备编辑成功"})
      else res.json({err:1, msg:'no devInfo updated'})      
    } catch (e) {console.log(new Date(), e); res.json({err:5, msg:"database error"})}
  })()
})

/* =========== 新增：按设备获取/更新发布主题 pubTopics =========== */
/* 获取指定设备的发布主题 */
rt.get('/getPubTopics', (req, res) => {
  let user = req.userx.name
  let { did } = req.query
  if (!did) return res.json({err:2, msg:'missing did'})
  Device.findOne({user, did}, 'pubTopics', (err, doc) => {
    if (!err && doc) {
      const pts = Array.isArray(doc.pubTopics) && doc.pubTopics.length ? doc.pubTopics : ['CmsgW']
      res.json({err:0, pubTopics: pts})
    } else {
      res.json({err:1, pubTopics: ['CmsgW']})
    }
  })
})

/* 更新指定设备的发布主题（body: {did, pubTopics: []}） */
rt.post('/updatePubTopics', (req, res) => {
  let user = req.userx.name
  let { did, pubTopics } = req.body
  if (!did) return res.json({err:2, msg:'missing did'})
  if (!Array.isArray(pubTopics)) return res.json({err:3, msg:'pubTopics must be array'})
  // 限制最少1，最多5
  const cleaned = pubTopics.map(s => (s||'').toString().trim()).filter(s => s !== '')
  if (cleaned.length < 1 || cleaned.length > 5) return res.json({err:4, msg:'pubTopics length must be between 1 and 5 and non-empty'})
  Device.updateOne({user, did}, {pubTopics: cleaned}, (err, q) => {
    if (!err) {
      if (q.modifiedCount > 0) res.json({err:0, msg:'更新成功', pubTopics: cleaned})
      else res.json({err:0, msg:'无变更', pubTopics: cleaned})
    } else res.json({err:5, msg:'database error'})
  })
})

/* =========== 新增：按设备获取/更新订阅主题 subTopics =========== */

/* 获取指定设备的订阅主题 */
rt.get('/getSubTopics', (req, res) => {
  let user = req.userx.name
  let { did } = req.query
  if (!did) return res.json({err:2, msg:'missing did'})
  Device.findOne({user, did}, 'subTopics', (err, doc) => {
    if (!err && doc) {
      const pts = Array.isArray(doc.subTopics) && doc.subTopics.length ? doc.subTopics : ['Cmsg']
      res.json({err:0, subTopics: pts})
    } else {
      res.json({err:1, subTopics: ['Cmsg']})
    }
  })
})

/* 更新指定设备的订阅主题（body: {did, subTopics: []}） */
rt.post('/updateSubTopics', (req, res) => {
  let user = req.userx.name
  let { did, subTopics } = req.body
  if (!did) return res.json({err:2, msg:'missing did'})
  if (!Array.isArray(subTopics)) return res.json({err:3, msg:'subTopics must be array'})
  // 限制最少1，最多5
  const cleaned = subTopics.map(s => (s||'').toString().trim()).filter(s => s !== '')
  if (cleaned.length < 1 || cleaned.length > 5) return res.json({err:4, msg:'subTopics length must be between 1 and 5 and non-empty'})
  Device.updateOne({user, did}, {subTopics: cleaned}, (err, q) => {
    if (!err) {
      if (q.modifiedCount > 0) res.json({err:0, msg:'更新成功', subTopics: cleaned})
      else res.json({err:0, msg:'无变更', subTopics: cleaned})
    } else res.json({err:5, msg:'database error'})
  })
})

/* ================================================================ */


module.exports = rt