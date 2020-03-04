const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

const app = express();

// port variable
const port = 3000;

// server connection
mongoose.set('useCreateIndex', true);
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// middlewear
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./routes')(app);

// set static folder
app.use(express.static(path.join(__dirname, 'client')));

// index route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// start server
app.listen(port, () => {
  console.log('Server started on port ' + port)
});
