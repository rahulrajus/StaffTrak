const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var responseSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  symptoms: {
    type: [String],
    required: true
  },
  temperature: {
    type: Number
  },
  exposedInLast24h: {
    type: String,
    required: true
  }
},{timestamps: true} );

var Response = mongoose.model('Response', responseSchema)
module.exports = Response;
