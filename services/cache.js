const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = function () {
  console.log('IM ABOUT TO RUN A QUERY'); // To confirm we can hook into/pre exec() call //

  // this - ref to the current query to execute //
  // console.log(this.getFilter());  // use getFilter with upgraded Mongoose; TODO: after course ! //
  console.log(this.getQuery()); // getQuery() is deprecated //
  console.log(this.mongooseCollection.name);  // get Collection name //

  return exec.apply(this, arguments); // The original Mongoose exec() code // 
}