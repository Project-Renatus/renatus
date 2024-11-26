const mongoose = require('mongoose');

const userWorkDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  lastWorked: { type: Date, default: () => Date.now() - 1000 * 60 * 16 },
  lastAmount: { type: Number, default: 0 },
  workTimes: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserWorkData', userWorkDataSchema);