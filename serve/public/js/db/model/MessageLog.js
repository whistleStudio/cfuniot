const mongoose = require('mongoose')

// 每个文档对应一个 user + did + topic 的消息集合
// messages: [[timeString, payloadString], ...]
// timeString 格式: 'YYYY-MM-DD HH:mm:ss'
const msgSchema = new mongoose.Schema({
  user: String,      // user mail (device owner)
  did: String,       // device id
  topic: String,     // topic short (third segment)
  messages: { type: Array, default: [] }, // 存储 [[time, payload], ...]
  updatedAt: { type: Date, default: Date.now }
})

// 索引便于按 user/did/topic 查询
msgSchema.index({ user: 1, did: 1, topic: 1 })

msgSchema.set('versionKey', false)

const MessageLog = mongoose.model('messagelogs', msgSchema)

module.exports = MessageLog