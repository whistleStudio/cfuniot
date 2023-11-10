const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  code: String,
  auth: Number,
  authExp: Number,
  genDate: {type: Date, default: new Date()}
})
const AuthCode = mongoose.model('authcode', authSchema)

module.exports = AuthCode