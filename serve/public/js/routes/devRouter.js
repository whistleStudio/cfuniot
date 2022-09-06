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
// rt.get('/ownDev', (req, res) => {
//   let user = req.userx.name
//   Device.find({user}, (err, list) => {
//     res.json({err:0, count:list.length})
//   })
// })

// rt.get('/olDev', (req, res) => {
//   let user = req.userx.name
//   Device.find({user:user, state:1}, (err, list) => {
//     res.json({err:0, count:list.length})
//   })
// })

module.exports = rt