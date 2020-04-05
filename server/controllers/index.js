
// libraries
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const path = require('path');
require('dotenv').config()

// local dependencies
// const db = require('../db');

// initialize express app
const app = express();
const publicPath = path.resolve(__dirname, '../../', 'client', 'build');

// set POST request body parser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));

// set up sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: 'false',
  saveUninitialized: 'true',
  cookie: { maxAge: 8 * 60 * 60 * 1000 } // 8 hours
}));

// static server
app.use(express.static('public'));

// routes
app.use(require('./routes/register'));
app.use(require('./routes/checkin'));

// logout
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    if (err) { return next(err); }
    // The response should indicate that the user is no longer authenticated.
    res.sendFile(publicPath + '/index.html');
  });
});

module.exports = app;