const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// connect to database
const mongoURL = process.env.MONGO_SRV;
// const mongoURL = "mongodb+srv://admin:admin123@cluster0-mqziw.mongodb.net/test?retryWrites=true&w=majority"
const options = { useNewUrlParser: true, useUnifiedTopology: true };
console.log(mongoURL);
mongoose.connect(mongoURL, options);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
