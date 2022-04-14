const mongoose = require('mongoose')
var hash = require('object-hash')

//role 0-生成用户 1-普通用户 2-老师 3-普通管理员
const userSchema = new mongoose.Schema({
  name: String,
  pwd: String,
  mail: String,
  regDate: {type: Date, default: new Date()},
  logDate: Date,
  authority: {type: Number, default: 1},
  authDate: {type: Date, default: new Date()},
  tel: Number,
  role: {type: Number, default: 1},
  score: Number,
  code: {type: String, default: genCode()},
  avatar: {type: Number, default: 0},
  school: {type: String, default: ""},
  pmail: {type: String, default: ""}
})

function genCode () {
  var reg = /\/|\+|=/g
  var code = new Date()
  var code = hash(code, { algorithm: 'md5', encoding: 'base64' }).replace(reg, '')
  return code
}

const User = mongoose.model('users', userSchema)

module.exports = User