const FolderRouter = require('express').Router();

// get all user folders
FolderRouter.route('/')
  .get(require('./userFolders.js'));

// update a folder
FolderRouter.route('/:id')
  .put(require('./update.js'))
  .delete(require('./delete.js'));

// share a folder
FolderRouter.route('/:id/share')
  .put(require('./share.js'));

// create new folder
FolderRouter.route('/create')
  .post(require('./create.js'));

module.exports = FolderRouter;
