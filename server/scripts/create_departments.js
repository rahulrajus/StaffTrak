const Institution = require('../../models/Institution');
const Department = require('../../models/Department');

function createDepartmentinInstitution(departmentName, institution) {
  newDepartment = {name: departmentName, institution: institution._id}
  await department = Department.create(newDepartment);

  institutionUpdate = {$push: {departments: department._id}}
  await Institution.findByIdAndUpdate(institution._id, institutionUpdate);
}

sutterHealth = Institution.findOne({name: 'Sutter Health'});

createDepartmentinInstitution('Internal Medicine Residency', sutterHealth);
createDepartmentinInstitution('Psychiatry Residency', sutterHealth);
createDepartmentinInstitution('Cardiology Fellowship', sutterHealth);
createDepartmentinInstitution('GI Fellowship', sutterHealth);
createDepartmentinInstitution('Pulmonary Fellowship', sutterHealth);
createDepartmentinInstitution('Endocrine Fellowship', sutterHealth);

module.exports = create_departments;
