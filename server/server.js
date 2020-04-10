const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const scheduleNotifications = require('./scripts/schedule_notifications');
require('dotenv').config();

const app = express();
const http = require('http').Server(app);
const publicPath = path.resolve(__dirname, '..', 'client', 'build');

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', express.static(path.join(__dirname, '../client/build')));

// initialize routes
const routes = require('./controllers');
app.use('/', routes);

scheduleNotifications();

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

http.listen(process.env.PORT, () => {
    console.log(`Listening on port 80 and looking in folder ${publicPath}`);
});
