const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = function () {

}