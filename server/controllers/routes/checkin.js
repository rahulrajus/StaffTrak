const express = require('express');
const multer = require('multer');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');

const app = express.Router();
const multipart = multer();


app.post('/checkin', multipart.array(), async function (req, res) {
  formId = req.body.formID
  data = JSON.parse(req.body.rawRequest)
  institution = await Institution.findOne({ "responseForm.url": `https://hipaa.jotform.com/${formId}` });
  responseKeys = institution.responseForm

  department_id = await Department.findOne({ name: data[responseKeys.departmentName] })._id;
  user = await User.findOne({"phoneNumber":data[responseKeys.phoneNumber]})
  console.log(user)

  newResponse = {
    user: user._id,
    symptoms: data[responseKeys.symptoms],
    temperature: data[responseKeys.temperature],
    exposedInLast24h: data[responseKeys.exposedInLast24h]
  }
  response = await Response.create(newResponse);
  pushResponses = { $push: { responses: response._id } }
  await User.findByIdAndUpdate(user._id, pushResponses);

});

module.exports = app;
