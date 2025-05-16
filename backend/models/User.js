const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  email: { type: String, unique: true },
  name: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
