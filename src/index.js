const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const constants = require('./constants');

const app = express();

// database connection
mongoose.set('useCreateIndex', true);
mongoose
  .connect(constants.databaseName, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected on ' + constants.databaseName))
  .catch(err => console.log(err));

// middlewear
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./backend/main/config/passport')(passport);
require('./backend/main/routes')(app);

// set static folder
app.use(express.static(path.join(__dirname, 'client')));

// index route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// start server
const server = app.listen(constants.port, () => {
  console.log('Node server started on port ' + constants.port)
});

module.exports = server;