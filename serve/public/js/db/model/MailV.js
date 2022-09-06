const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema({
  mail: String,
  vcode: String,
  tempDate: {type:Date, default: new Date(), expires:60*5}
})

const MailV = mongoose.model('mailV', mailSchema)

module.exports = MailV