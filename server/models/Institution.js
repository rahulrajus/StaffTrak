const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var institutionSchema = new mongoose.Schema({
  formLink: String,
  registrationForm: {
    name: {
      type: String,
      required: 'name is required'
    },
    phoneNumber: String,
    departmentName: String,
    symptoms: String,
    temperature: String,
    exposedInLast24h: String,
  },
  responseForm: {
    symptoms: String,
    temperature: String,
    exposedInLast24h: String,
  },
  departments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Department' }]
  }
});

var Institution = mongoose.model('Institution', institutionSchema)
module.exports = Institution;
