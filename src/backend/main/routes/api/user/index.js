const UserRouter = require('express').Router();

// register account
UserRouter.route('/register')
  .post(require('./register.js'));

// auth services
UserRouter.route('/authenticate')
  .post(require('./authenticate.js'));

// account management
UserRouter.route('/:id')
  .get(require('./account.js'))
  .delete(require('./account.js'));

module.exports = UserRouter;
