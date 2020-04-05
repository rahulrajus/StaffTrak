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

module.exports = db;