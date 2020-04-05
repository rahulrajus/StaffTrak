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
  departmentName: {
    type: String,
    required: true,
  },
  departmentId: {
    type: Schema.Types.ObjectId, ref: 'Department',
    required: true
  },
  gender: {
    type: String,
    trim: true,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true
  },
  preExistingConditions: {
    type: String,
    trim: true,
  },
  responses: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Response' }],
  },
  lastNotifTime: {
    type: Date
  },
  nextScheduled: {
    type: Date
  },
  lastResponse: {
    type: Date
  }
});

var User = mongoose.model('User', userSchema)
module.exports = User;