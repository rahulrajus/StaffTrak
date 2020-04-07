const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator/check');

const sendSMS = require('../../scripts/send_sms');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');

const mongoose = require('mongoose');

const app = express.Router();
const multipart = multer();

/* Register a new user */
app.post('/register', multipart.array(), async function (req, res) {
  formId = req.body.formID
  data = JSON.parse(req.body.rawRequest)

  institution = await Institution.findOne({"registrationForm.url": `https://hipaa.jotform.com/${formId}`});
  registrationKeys = institution.registrationForm
  // console.log(formId);
  // console.log(institution);
  console.log('input ' + data[registrationKeys.departmentName]);
  department = await Department.findOne({departmentName: data[registrationKeys.departmentName]});
  console.log('department ' + department + " " + department.departmentName);
  department_id = department._id

  // Text a confirmation message
  sendSMS('Thank you for registering!', data[registrationKeys.phoneNumber]);

  // Update the User collection with the new user
  query = {phoneNumber: data[registrationKeys.phoneNumber]}
  userUpdate = {$set: {
      firstName: data[registrationKeys.name].first,
      lastName: data[registrationKeys.name].last,
      phoneNumber: data[registrationKeys.phoneNumber],
      department: mongoose.Types.ObjectId(department._id),
      age: data[registrationKeys.age],
      sex: data[registrationKeys.sex],
      homeZipCode: data[registrationKeys.homeZipCode],
      preexistingRiskCondition: data[registrationKeys.preexistingRiskCondition]
  }}
  user = await User.findOneAndUpdate(query, userUpdate, {upsert: true, "new": true})
  user_id = user._id

  // Update the Response collection with the new response
  newResponse = {
    user: user_id,
    symptoms: data[registrationKeys.symptoms],
    temperature: data[registrationKeys.temperature],
    exposedInLast24h: data[registrationKeys.exposedInLast24h]
  }
  response = await Response.create(newResponse);

  // Update the User collection with the ID of the new response
  pushResponses = { $push: { responses: response._id } }
  await User.findByIdAndUpdate(user._id, pushResponses);

  // Update the Department collection with the ID of the new user
  pushMembers = { $push: { members: user_id } }
  await Department.findByIdAndUpdate(department_id, pushMembers);
  console.log("updated department" + department_id + " " + user_id)
  res.send(req.body);

});

module.exports = app;
