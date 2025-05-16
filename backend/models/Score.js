const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  score: Number,
  skills: [{
    name: String,
    value: Number
  }],
  lastUpdated: Date,
});

module.exports = mongoose.model('Score', scoreSchema);
