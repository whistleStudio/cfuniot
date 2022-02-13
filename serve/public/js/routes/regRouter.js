const express = require('express')
const nodemailer = require('nodemailer')
const rt = express.Router()
const MailV = require('../db/model/MailV')
const User = require('../db/model/User')
const hash = require('object-hash')


rt.stp = ''

rt.get('/', (req, res) => {
	res.sendFile(`${rt.stp}/public/page/register.html`)
})

rt.get('/checkVal', (req, res) => {
  let {key, val} = req.query
  let search = {}
  search[key] = val
  User.findOne(search, (err, doc) => {
    if(!err) {
      if(doc) res.json({err:1, msg:'already exsist'})
      else res.json({err:0})
    } else {
      res.json({err:2, msg:'database error'})
    }
  })
})

rt.get('/sendMail', (req, res) => {
  let {mail} = req.query
  let vcode = hash(new Date()).slice(0,6)
  MailV.create({mail, vcode}, (err, doc) => {
    if(err) console.log(err)
  })
  sendMail(mail, vcode).catch(console.error)
  res.json({err:0})
})

rt.post('/regSubmit', (req, res) => {
  let {name, pwd, mail, vcode} = req.body
  ;(async () => {
    let v0 = await MailV.findOne({mail, vcode})
    if(v0) {
      let v1 = await User.findOne({name})
      let v2 = await User.findOne({mail})
      if(!(v1||v2)) {
        await User.create({name, pwd, mail})
        res.json({err:0, msg:'注册成功, 页面将在3秒后跳转'})
      }
      else res.json({err:1, msg:'用户名或邮箱已存在，请更换'})      
    }else {
      res.json({err:2, msg:'验证码输入错误'})
    }
  })().catch(e => {
    res.json({err:3, msg:'database error'})
  })
})

rt.get('/resetPassword', (req, res) => {
  res.sendFile(`${rt.stp}/public/page/resetPwd.html`)
})

rt.get('/checkVCode', (req, res) => {
  console.log('sss')
  let {mail, vcode} = req.query
  ;(async () => {
    let doc = await MailV.findOne({mail, vcode})
    if (doc) {
      // res.json({err:0})
      res.sendFile(`${rt.stp}/public/page/resetPwd2.html`)
    }
    else res.status(403).json({err:1, msg:'验证码输入错误'})
  })().catch(e => res.status(500).json({err:2, msg:'database error'}))
})

rt.post('/changePassword', (req, res) => {
  let {mail, pwd} = req.body
  ;(async () => {
    let q = await User.updateOne({mail}, {pwd})
    // console.log(q)
    if (q.modifiedCount > 0) {
      res.clearCookie('token')
      res.json({err: 0, msg:'密码修改成功，页面即将跳转'})
    } else res.json({err:1, msg:'未查找到对应用户，请先注册'})
  })().catch(e => res.status(500).json({err:2, msg:'database error'}))
  
})

async function sendMail(targetMail, vcode) {
  // let testAccount = await nodemailer.createTestAccount()
  let transporter = nodemailer.createTransport({
    host: "smtp.126.com",
    // secureConnection: true,
    port: 465,
    secure: true, 
    auth: {
      user: 'wshttttt@126.com', // generated ethereal user
      pass: 'SXKICATSMFQCIHUU', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"whistle" <wshttttt@126.com>', // sender address
    to: targetMail, // list of receivers
    subject: "CFuniot_创趣物联平台注册", // Subject line
    // text: "Hello email", // plain text body
    html: `<span>您的验证码为：</span><br><b>${vcode}</b>`, // html body
  });

}


module.exports = rt