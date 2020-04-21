const FileRouter = require('express').Router();

// upload new file
FileRouter.route('/upload')
  .post(require('./upload.js'));

// download a file
FileRouter.route('/download')
  .post(require('./download.js'));

module.exports = FileRouter;
