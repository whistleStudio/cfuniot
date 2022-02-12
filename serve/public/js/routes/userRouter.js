const express = require('express')
const rt = express.Router()
const client = require('../mqtt/client')
const User = require('../db/model/User')
const AuthCode = require('../db/model/AuthCode')
var hash = require('object-hash')


let dataShow = new Array(4)

rt.stp = ''||__dirname+`/../../..`

rt.get('/',  (req,res) => {
  if(!req.userx.cert) {res.sendStatus(401)}
  res.sendFile(`${rt.stp}/public/page/user.html`)
})
rt.get('/changeMain', (req, res) => {
  let idx = req.query.idx
  res.sendFile(`${rt.stp}/public/page/u${idx}.html`)
})
rt.get('/getUserInfo', (req, res) => {
  let mail = req.userx.name
  User.findOne({mail}, (err, doc) => {
    let {name, mail, publicTop, authority, avatar, subPublicTop, publicData} = doc
    res.json({name, mail, publicTop, authority, avatar, subPublicTop, publicData})
  })
})

rt.get('/reqAvatar', (req, res) => {
  let mail = req.userx.name
  let {avatar} = req.query
  avatar = parseInt(avatar)
  User.updateOne({mail}, {avatar}, (err, que) => {
    if(err) res.json({err: 5, msg: 'database error'})
    else res.json({err: 0})
  })
})
rt.get('/changeName', (req, res) => {
  let mail = req.userx.name
  let {name} = req.query
  ;(async () => {
    let doc = await User.findOne({name})
    if (doc) res.json({err:1, msg:'name already exsists'})
    else {
      await User.updateOne({mail}, {name})
      res.json({err:0})
    }
  })().catch(e => res.json({err:5, msg:'database error'}))
})
/* 获取权限等级 */
rt.get('/reqLvl', (req, res) => {
  ;(async () => {
    let mail = req.userx.name
    let curT = new Date().getTime()
    let doc = await User.findOne({mail})
    if (doc) {
      let authT = doc.authDate.getTime()
      if (curT>authT) {
        doc = await User.findOneAndUpdate({mail}, {authority: 1}, {new: true})
        console.log('auth changed')
      }
      res.json({err:0, auth: doc.authority, authDate: doc.authDate})
    }
  })().catch(e => {res.json({err: 5, msg:'database error'}); console.log(e)})
})
/* 升级权限等级 */
rt.get('/actLvl', (req, res) => {
  console.log('actLvl')
  let mail = req.userx.name
  let {code} = req.query 
  ;(async () => {
    let authDoc = await AuthCode.findOneAndRemove({code})
    if (!authDoc) {res.json({err: 1, msg: '无效激活码'});return 0}
    let authority = authDoc.auth, authDate = new Date()
    authDate.setDate(authDate.getDate()+authDoc.authExp)
    console.log(typeof authDate)
    let q = await User.updateOne({mail}, {authority, authDate})
    console.log('update')
    if (q.modifiedCount) {res.json({err:0, msg: `激活成功，当前权限为等级${authority}`, auth: authority, authDate: authDate}); return 0}
    else {res.json({err: 2, msg: '无效用户'}); return 0} 
  })().catch(e => {res.json({err: 5, msg: 'database error'}); console.log(e)})
})

/* 更改可发布/订阅的公开主题 */
rt.get('/createNewTop', (req, res) => {
  let mail = req.userx.name
  let {publicTop} = req.query
  ;(async () => {
    let q = await User.updateOne({mail}, {publicTop})
    if (q.modifiedCount) {res.send({err:0, msg:'主题更新成功', publicTop:publicTop})}
    else res.send({err:1, msg:'主题更新失败'})
  })().catch(e => res.send({err:5, msg:'database error'}))
})

/* 更改已订阅的公开主题 */
rt.get('/setSubPublicTop', (req, res) => {
  let mail = req.userx.name, {subPublicTop} = req.query
  ;(async () => {
    let q = await User.updateOne({mail}, {subPublicTop})
    if (q.modifiedCount>0) res.send({err:0, msg:"公开主题订阅成功"})
    else res.send({err:1, msg:'公开主题订阅失败'})
  })().catch(e => res.send({err:5, msg:'database error'}))
})



/* 获取通讯密钥 */
rt.get('/getCode', (req, res) => {
  let mail = req.userx.name
  let {i} = req.query
  if (parseInt(i)) {
    let code = genCode()
    User.findOneAndUpdate({mail}, {code}, {new:true}, (err, doc) => {
      res.json({err:0, code:doc.code})
    })
  }else {
    User.findOne({mail}, (err, doc) => {
      res.json({err:0, code:doc.code})
    })
  }
})
/* 生成通讯密钥 */
function genCode () {
  var reg = /\/|\+|=/g
  var code = new Date()
  var code = hash(code, { algorithm: 'md5', encoding: 'base64' }).replace(reg, '')
  return code.slice(0,10)
}



module.exports = rt