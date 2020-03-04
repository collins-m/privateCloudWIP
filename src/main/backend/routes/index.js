// API list
module.exports = function(app) {
  app.use('/api', require('./api'));
};
