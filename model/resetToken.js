const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  email: String,
  resetToken : String,
  resetTokenExpiry : Date
});

module.exports = mongoose.model('resetToken', resetTokenSchema);
