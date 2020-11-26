const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);
  
// Factory function to return a sessionString and sig - session signature //
module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };
  const session = Buffer.from(
    JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);  // session= + - is how the Cookie lib is doing this //

  return { session, sig };  // equivalen to : return { session: session, sig: sig };
};