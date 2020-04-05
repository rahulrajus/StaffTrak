const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var responseSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  // fill in here
  // responses: {}
});

var Response = mongoose.model('Response', responseSchema)
module.exports = Response;