const express = require('express')
const rt = express.Router()
const User = require('../db/model/User')
const setToken = require('../validate/tokenVerify')

rt.post('/', (req, res) => {
  console.log(new Date(), "log")
  let {mail, pwd} = req.body
  User.findOne({mail, pwd}, (err, doc) => {
    if (doc) {
      doc.logDate = new Date()
      doc.save()
      // console.log(doc)
      let us = mail
      let usid = pwd + doc.logDate.toString()
      setToken.setToken(us,usid).then((data)=>{
        // maxAge(ms)
        res.cookie('token',data,{maxAge: 3600000*24, httpOnly: true})
        res.json({ err:0, tkid: data, tk:mail});
      })
    }else {
      console.log(new Date(), err)
      res.json({err:1, msg:'用户名或密码错误请重新登录'})
    }
  })
  
  
})

module.exports = rt