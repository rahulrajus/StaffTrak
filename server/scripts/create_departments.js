const Institution = require('../models/Institution');
const Department = require('../models/Department');

async function createDepartmentinInstitution(departmentName, institution) {
  console.log("bitch")
  newDepartment = {departmentName: departmentName, institution: institution._id}
  department = await Department.create(newDepartment);

  institutionUpdate = {$push: {departments: department._id}}
  await Institution.findByIdAndUpdate(institution._id, institutionUpdate);
}

Institution.findOne({name: 'Sutter Health'}).then(sutterHealth => {
    console.log(sutterHealth)
    createDepartmentinInstitution('Psychiatry Residency', sutterHealth);
    createDepartmentinInstitution('Cardiology Fellowship', sutterHealth);
    createDepartmentinInstitution('GI Fellowship', sutterHealth);
    createDepartmentinInstitution('Pulmonary Fellowship', sutterHealth);
    createDepartmentinInstitution('Endocrine Fellowship', sutterHealth);
}).catch(err => {
    console.log(err);
});
// console.log("BITCH")
// console.log(sutterHealth)
// createDepartmentinInstitution('Internal Medicine Residency', sutterHealth);


// module.exports = create_departments;
