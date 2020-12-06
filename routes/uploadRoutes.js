const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpg`;

    s3.getSignedUrl('putObject', {
      Bucket: 'ai-blog-bucket',
      ContentType: 'jpg',
      Key: key
    }, (err, url) => res.send({ key, url }));
  });
};