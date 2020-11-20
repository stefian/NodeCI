const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');   // to use promisify //

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = function () {
  console.log('IM ABOUT TO RUN A QUERY'); 
  
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });  // To get a copy of the query options & collection name for building the key //

  // See if we have a value for key in redis //

  // If we do, return that //

  // Otherwise, issue the query & store the result in redis //


  return exec.apply(this, arguments); // The original Mongoose exec() code // 
}