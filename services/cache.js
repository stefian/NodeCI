const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');   // to use promisify //

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = function () {
  console.log('IM ABOUT TO RUN A QUERY'); // To confirm we can hook into/pre exec() call //

  // this - ref to the current query to execute //
  // console.log(this.getFilter());  // use getFilter with upgraded Mongoose; TODO: after course ! //
  // console.log(this.getQuery()); // getQuery() is deprecated //
  // console.log(this.mongooseCollection.name);  // get Collection name //
  
  // Object.assign - used to *safely* copy properties from one or more Obj to the empty obj {} //
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });  // To get a copy of the query options for building the key //
  // console.log(key); // to stringify the key Obj for use with Redis //

  return exec.apply(this, arguments); // The original Mongoose exec() code // 
}