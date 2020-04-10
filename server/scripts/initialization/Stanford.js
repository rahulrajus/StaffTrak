const db = require('../../db');

const mongoose = require('mongoose');
const Institution = require('../../models/Institution');
const Department = require('../../models/Department');

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

async function createDepartmentinInstitution(departmentName, institution) {
  console.log(institution._id)
  newDepartment = {
    departmentName: departmentName,
    institution: mongoose.Types.ObjectId(institution._id)
  }
  department = await Department.create(newDepartment);

  console.log(department)
  institutionUpdate = {$push: {departments: department}}
  await Institution.findByIdAndUpdate(institution._id, institutionUpdate);
}

console.log(stanford._id);
createDepartmentinInstitution('Ob/Gyn Residency', stanford);
createDepartmentinInstitution('General Surgery Residency', stanford);
