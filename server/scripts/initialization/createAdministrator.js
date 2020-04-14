const path = require('path');
require('dotenv').config();
const db = require('../../db');

const Administrator = require('../../models/Administrator');

var admin = {
  firstName: "Shannen",
  lastName: "Wu",
  phone: 6263254856,
  email: "shannenwu99@gmail.com",
  password: "d3fault",
  departmentId: '5e8d47444d8227419d3ddd45',
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

