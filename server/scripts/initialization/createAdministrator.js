const path = require('path');
require('dotenv').config();
const db = require('../../db');
const admin = require('./adminInfo');

const Administrator = require('../../models/Administrator');

var adminDoc = {
  firstName: admin.firstName,
  lastName: admin.lastName,
  phone: admin.phone,
  email: admin.email,
  password: "b3atc0r0na",
  departmentId: admin.departmentId,
  usingDefaultPassword: true,
};

Administrator.create(adminDoc, (err, doc) => {
  if (err) {
    console.log(err)
    return handleError(err);
  }
  console.log(doc);
  console.log("saved!")
})
