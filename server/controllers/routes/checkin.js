const express = require('express');
const multer = require('multer');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');
const Administrator = require('../../models/Administrator');

const app = express.Router();
const multipart = multer();
const sendSMS = require('../../scripts/send_sms');
const mongoose = require('mongoose')
app.post('/checkin', multipart.array(), async function (req, res) {
  formId = req.body.formID
  data = JSON.parse(req.body.rawRequest)
  institution = await Institution.findOne({ "responseForm.url": `https://hipaa.jotform.com/${formId}` });
  responseKeys = institution.responseForm

  department_id = await Department.findOne({ name: data[responseKeys.departmentName] })._id;
  user = await User.findOne({"phoneNumber":data[responseKeys.phoneNumber]})

  newResponse = {
    user: user._id,
    symptoms: data[responseKeys.symptoms],
    temperature: data[responseKeys.temperature],
    exposedInLast24h: data[responseKeys.exposedInLast24h]
  }
  response = await Response.create(newResponse);
  pushResponses = { $push: { responses: response._id } }
  await User.findByIdAndUpdate(user._id, pushResponses);
  if(data[responseKeys.temperature] > 100.4) {
      data[responseKeys.symptoms].push("Fever")
  }
  symptoms = data[responseKeys.symptoms].filter(x => !(x.includes("no symptoms")))
  if(symptoms.length > 0) {
        Administrator.find({
            'departmentId._id': department_id,
            supervisor: true
        }).exec((err, admins) => {
            admins.forEach(admin => {
                phoneNumber = admin.phone
                temperature = data[responseKeys.temperature]
                name = `${user.firstName} ${user.lastName}`
                adminName = admin.firstName
                tempMsg = temperature ? ` Their last reported temperature was ${temperature}\u00B0F.`: ""
                msg = `Hi, ${adminName}. Your member, ${name}, has reported the following symptoms: ${symptoms.join(', ')}.${tempMsg}`
                sendSMS(msg, phoneNumber);
            })
        })

    }

});

module.exports = app;
