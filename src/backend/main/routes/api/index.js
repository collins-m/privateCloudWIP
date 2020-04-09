const ApiRouter = require('express').Router();

// route handlers
ApiRouter.use('/user', require('./user'));
ApiRouter.use('/file', require('./file'));

module.exports = ApiRouter;
