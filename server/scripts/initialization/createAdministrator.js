const path = require('path');
require('dotenv').config();
const db = require('../../db');

const Administrator = require('../../models/Administrator');

var admin = {
  firstName: "Shannen",
  lastName: "Wu",
  phone: 6263254856,
  email: "shannen@mit.edu",
  password: "d3fault",
  departmentId: '5e89694f1c9d440000accd6e',
  usingDefaultPassword: true,
};

Administrator.create(admin, (err, doc) => {
  if (err) {
    console.log(err)
    return handleError(err);
  }
  console.log(doc);
  console.log("saved!")
})

