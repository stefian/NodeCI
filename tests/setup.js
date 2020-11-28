jest.setTimeout(30000); // wait 30secs before failing any test //

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;  // Use global NodeJS Promise //
mongoose.connect(keys.mongoURI,
  { useMongoClient: true }
);