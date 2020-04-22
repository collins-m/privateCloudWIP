const FolderRouter = require('express').Router();

// create new folder
FolderRouter.route('/create')
  .post(require('./create.js'));

module.exports = FolderRouter;
