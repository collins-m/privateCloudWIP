const FileRouter = require('express').Router();

// get user files
FileRouter.route('/')
  .get(require('./userFiles.js'));

// upload new file
FileRouter.route('/upload')
  .post(require('./upload.js'));

// update a file
FileRouter.route('/:id')
  .put(require('./update.js'));

module.exports = FileRouter;
