const FileRouter = require('express').Router();

// get user files
FileRouter.route('/')
  .get(require('./userFiles.js'));

// upload new file
FileRouter.route('/upload')
  .post(require('./upload.js'));

// move a file
FileRouter.route('/:id')
  .put(require('./move.js'));

module.exports = FileRouter;
