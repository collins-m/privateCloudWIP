const FileRouter = require('express').Router();

// get user files
FileRouter.route('/')
  .get(require('./userFiles.js'));

// upload new file
FileRouter.route('/upload')
  .post(require('./upload.js'));

// update a file
FileRouter.route('/:id')
  .put(require('./update.js'))
  .delete(require('./delete.js'))

// download a file
FileRouter.route('/:id/download')
  .post(require('./download.js'));

// share a file
FileRouter.route('/:id/share')
  .put(require('./share.js'));

module.exports = FileRouter;
