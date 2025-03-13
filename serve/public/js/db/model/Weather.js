const mongoose = require('mongoose')

const weaSchema = new mongoose.Schema({
  prov: String,
  city: String,
  adcode: String,
  wea: String,
  temp: String,
  hum: String,
  windpower: String,
  winddir: String,
  reporttime: String
})

const Weather = mongoose.model('weathers', weaSchema)

module.exports = Weather