const { clearCache } = require('../services/cache');

module.exports = async (req, res, next) => {
  await next(); // execute the function after the route handler //
  

};