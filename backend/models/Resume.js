const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  filePath: String,
  extractedText: String,
  uploadDate: Date,
});

module.exports = mongoose.model('Resume', resumeSchema);
