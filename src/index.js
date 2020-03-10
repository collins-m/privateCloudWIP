const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');

const config = require('./backend/main/config/database');

const options = {
  key: fs.readFileSync('./backend/main/config/keys/93275509_xdrive.key'),
  cert: fs.readFileSync('./backend/main/config/keys/93275509_xdrive.cert'),
  dhparam: fs.readFileSync('./backend/main/config/keys/privateKey.key')
}

const app = express();

// database connection
mongoose.set('useCreateIndex', true);
mongoose
  .connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => console.log(err));

// middlewear
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

require('./backend/main/config/passport')(passport);
require('./backend/main/routes')(app);

// set static folder
app.use(express.static(path.join(__dirname, 'client')));

// index route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// start server
const server = app.listen(8000);
https.createServer(options, app).listen(8080);

module.exports = server;