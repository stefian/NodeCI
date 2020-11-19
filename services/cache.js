const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = function () {
  console.log('IM ABOUT TO RUN A QUERY'); // To confirm we can hook into/pre exec() call //

  return exec.apply(this, arguments); // The original Mongoose exec() code // 
}