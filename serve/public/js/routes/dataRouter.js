const express = require('express')
const rt = express.Router()
const client =require('../mqtt/client')
const Device = require('../db/model/Device')
const User = require('../db/model/User')

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
module.exports = rt