const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');   // to use promisify //

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

// Preparing the cache() function to be inherited and used as needed //
// on the queries where we want caching //
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ''); // use '' to avoid an undefined hashKey //

  return this;  // to make .cache() a chainable function //
}

// Overwriting the Query.exec() to include caching with Redis //
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));  // To get a copy of the query options & collection name for building the key //

  // See if we have a value for key in redis //
  const cacheValue = await client.hget(this.hashKey, key);

  // If we do, return that //
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    
    // Parsing = Hydrating both Documents and Arrays of Documents 
    // Array.isArray(doc) ? its an array : its a doc;
    return Array.isArray(doc)
      ? doc.map(d => this.model(d))
      : new this.model(doc);
  }

  // Otherwise, issue the query & store the result in redis //
  const result = await exec.apply(this, arguments);

  // Cacheing in Redis with 10 seconds Expiration - Not retro-active! //
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); 

  return result;
}

module.exports = {
  clearHash() {
    
  }
}