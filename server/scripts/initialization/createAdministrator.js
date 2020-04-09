const path = require('path');
require('dotenv').config();
const db = require('../../db');

const Administrator = require('../../models/Administrator');

var admin = {
  firstName: "Ben",
  lastName: "Bitbiddle",
  phone: 6263254856,
  email: "shannen@mit.edu",
  password: "d3fault",
  departmentId: '5e89519fa0f056d49784b3c3',
};

Administrator.create(admin, (err, doc) => {
  if (err) {
    console.log(err)
    return handleError(err);
  }
  console.log(doc);
  console.log("saved!")
})

