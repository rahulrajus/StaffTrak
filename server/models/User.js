const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: 'first name is required'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'last name is required'
  },
  phoneNumber: {
    type: Number,
    required: 'phone number is required'
  },
  department: {
    type: Schema.Types.ObjectId, ref: 'Department',
    required: true
  },
  age: {
    type: Number
  },
  sex: {
    type: String,
    trim: true
  },
  homeZipCode: {
    type: Number
  },
  preexistingRiskCondition: {
    type: Boolean
  },
  responses: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Response' }],
    default: []
  }
},{timestamps: true});

var User = mongoose.model('User', userSchema)
module.exports = User;
