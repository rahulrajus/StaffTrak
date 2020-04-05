const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
require('dotenv').config();
const sendSMS = require('./send_sms');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const departments = require('./scripts/departments')
const mongoose = require('mongoose');

// connect to database
const mongoURL = process.env.MONGO_SRV;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongoURL, options);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
const http = require('http').Server(app);
const publicPath = path.resolve(__dirname, '..', 'client', 'build');

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', express.static(path.join(__dirname, '../client/build')));

// initialize routes
const routes = require('./controllers');
app.use('/', routes);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.post('/test_register', async function (req, res) {
    data = req.body
    response = await db.collection('test-users').findOneAndUpdate({
        phone_number: data.phoneNumber
    }, {
        $set: {
            name: data.name
        }
    }, { upsert: true }).catch(err => {
        console.log(err);
    });
    res.send("ok!")
})

http.listen(process.env.PORT, () => {
    console.log(`Listening on port 80 and looking in folder ${publicPath}`);
});
