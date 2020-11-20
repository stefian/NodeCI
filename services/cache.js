const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');   // to use promisify //

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = async function () {
  // console.log('IM ABOUT TO RUN A QUERY'); //
  
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));  // To get a copy of the query options & collection name for building the key //

  // See if we have a value for key in redis //
  const cacheValue = await client.get(key);

  // If we do, return that //
  if (cacheValue) {
    console.log(cacheValue);

    return JSON.parse(cacheValue);  // transforming cacheValue/string back in JSON //
  }

  // Otherwise, issue the query & store the result in redis //
  const result = await exec.apply(this, arguments);

  client.set(key, JSON.stringify(result)); // because redis stores strings //

  return result;
}