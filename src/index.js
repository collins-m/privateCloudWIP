const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./backend/main/config/database');

const app = express();

// port variable
const port = 3000;

// database connection
mongoose.set('useCreateIndex', true);
mongoose
  .connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected on ' + config.database))
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
const server = app.listen(port, () => {
  console.log('Node server started on port ' + port)
});

module.exports = server;