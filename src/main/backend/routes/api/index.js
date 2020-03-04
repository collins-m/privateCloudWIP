const ApiRouter = require('express').Router();

// route handlers
ApiRouter.use('/user', require('./user'));

module.exports = ApiRouter;
