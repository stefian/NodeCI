const mongoose = require('mongoose');
const User = mongoose.model('User');

// Create a new user in MongoDB //
module.exports = () => {
  return new User({}).save();
};