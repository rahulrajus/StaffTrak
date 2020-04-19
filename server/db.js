const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// connect to database
const mongoURL = process.env.MONGO_SRV;
console.log(process.env.DATABASE_NAME)
const options = { dbName: process.env.DATABASE_NAME, useNewUrlParser: true, useUnifiedTopology: true };
console.log(mongoURL)
mongoose.connect(mongoURL, options);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
