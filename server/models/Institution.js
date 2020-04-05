const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var institutionSchema = new mongoose.Schema({
  JotForm_Link: String
  Registration_Form: {
    name: String,
    phone_number: String,
    department_name: String,
    symptoms: String,
    temperature: String,
    exposed_in_last_24h: String,
  },
  Response_form: {
    symptoms: String,
    temperature: String,
    exposed_in_last_24h: String,
  },
  Departments: [department_id, department_id]
});

var Institution = mongoose.model('Institution', institutionSchema)
module.exports = Institution;




	
