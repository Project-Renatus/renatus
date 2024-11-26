const mongoose = require('mongoose');

const userXPSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  dailyMessageCount: { type: Number, default: 0 },
  lastMessageTimestamp: { type: Date, default: null },
});

module.exports = mongoose.model('UserXPData', userXPSchema);