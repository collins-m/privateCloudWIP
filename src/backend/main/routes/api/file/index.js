const FileRouter = require('express').Router();

// upload new file
FileRouter.route('/upload')
  .post(require('./upload.js'));

module.exports = FileRouter;
