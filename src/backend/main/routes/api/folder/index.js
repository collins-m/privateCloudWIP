const FolderRouter = require('express').Router();

// get all user folders
FolderRouter.route('/')
  .get(require('./userFolders.js'));

// create new folder
FolderRouter.route('/create')
.post(require('./create.js'));

module.exports = FolderRouter;
