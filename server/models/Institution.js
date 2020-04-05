const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var institutionSchema = new mongoose.Schema({
  name: String,
  registrationForm: {
    url: String,
    name: {
      type: String,
      required: 'name is required'
    },
    phoneNumber: String,
    departmentName: String,
    age: String,
    sex: String,
    homeZipCode: String,
    preexistingRiskConditions: String,
    symptoms: String,
    temperature: String,
    exposedInLast24h: String
  },
  responseForm: {
    url: String,
    name: String,
    phoneNumber: String,
    departmentName: String,
    symptoms: String,
    temperature: String,
    exposedInLast24h: String
  },
  departments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Department' }]
  }
});

var Institution = mongoose.model('Institution', institutionSchema)
module.exports = Institution;
