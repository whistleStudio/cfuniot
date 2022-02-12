const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema({
  // user: String,
  mail: String,
  vcode: String,
  tempDate: {type:Date, default: new Date(), expires:60*3}
})

const MailV = mongoose.model('mailV', mailSchema)

// MailV.createIndexes(mailSchema.index({tempDate:1},{expires:10}))

// var m = new MailV({user: 'www'})

// m.save()
module.exports = MailV