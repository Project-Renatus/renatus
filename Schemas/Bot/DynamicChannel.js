// Schemas/DynamicChannel.js

const mongoose = require('mongoose')

const DynamicChannelSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  channelId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('DynamicChannel', DynamicChannelSchema)
