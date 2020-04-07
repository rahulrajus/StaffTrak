const path = require('path');
require('dotenv').config();
const db = require('../../db');

const Institution = require('../../models/Institution');
const Department = require('../../models/Department');

function createDepartmentinInstitution(departmentName, institution) {
  newDepartment = {departmentName: departmentName, institution: institution._id}
  department = Department.create(newDepartment);

  institutionUpdate = {$push: {departments: department._id}}
  Institution.findByIdAndUpdate(institution._id, institutionUpdate);
}

var stanford = {
  name: "Stanford",
  timeZone: "America/Los_Angeles",
  registrationForm: {
    url: "https://hipaa.jotform.com/200889003059152",
    name: "q31_name",
    phoneNumber: "q32_phoneNumber",
    departmentName: "q42_department",
    age: "q36_age",
    sex: "q37_sex",
    homeZipCode: "q38_homeZip",
    preexistingRiskConditions: "q35_doYou",
    symptoms: "q28_whatSymptoms",
    temperature: "q30_temperature",
    exposedInLast24h: "q33_exposed",
  },
  responseForm: {
    url: "https://hipaa.jotform.com/200888487359170",
    name: "q31_name",
    phoneNumber: "q32_phoneNumber",
    departmentName: "q46_department",
    symptoms: "q28_whatSymptoms",
    temperature: "q43_temperatureIn",
    exposedInLast24h: "q47_exposed",
  },
  departments: []
};

console.log(stanford)
console.log("hello")
Institution.create(stanford, function (err) {
  if (err) {
    console.log(err)
    return handleError(err);
  }
  console.log("saved!")
})
//
// console.log("hello")
// Institution.findOne({name: 'Sutter Health'}).then(sutterHealth => {
//     console.log(sutterHealth)
//     createDepartmentinInstitution('Psychiatry Residency', sutterHealth);
//     createDepartmentinInstitution('Cardiology Fellowship', sutterHealth);
//     createDepartmentinInstitution('GI Fellowship', sutterHealth);
//     createDepartmentinInstitution('Pulmonary Fellowship', sutterHealth);
//     createDepartmentinInstitution('Endocrine Fellowship', sutterHealth);
// }).catch(err => {
//     console.log(err);
// });

// module.exports = create_departments;
