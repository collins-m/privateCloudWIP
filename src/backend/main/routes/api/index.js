const ApiRouter = require('express').Router();

// route handlers
ApiRouter.use('/user', require('./user'));
ApiRouter.use('/file', require('./file'));
ApiRouter.use('/folder', require('./folder'));

module.exports = ApiRouter;
