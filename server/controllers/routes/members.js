const express = require('express');
const multer = require('multer');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');

const moment = require('moment-timezone');
const mongoose = require('mongoose');

const app = express.Router();
const multipart = multer();

/* Endpoint for populating the members table */
app.get('/members', async function (req, res) {

  response = {members: []}

  administrator_id = req.query.administrator_id
  query_date = moment(req.query.date)

  // get array of members based on administrator_id
  admin = await Administrator.findById(administrator_id);
  department_id = admin.departmentId;
  members = Department.findById(department_id).members;

  // for each member:
  members.forEach(member => {

    thisMember = {
      member_id: None,
      name: None,
      temperatures: [],
      checkedInToday: None,
      timeOfLastCheckIn: None,
      exposedInLast24h: None,
      symptoms: None
    }

    name = {
      first: member.firstName,
      last: member.lastName
    }

    thisMember.name = name;
    thisMember.member_id = member._id;


    thisMember.responses.forEach()

    response.members.push(thisMember);

  })
  // name = member.name
  // memberid = member id
  // link to array of responses to get all temperatures
  // checked in today?
  //    if not, populate the rest of the stuff w none and return
  //    if so, get time_of_last_checkin, exposed_in_last_24h, symptoms
  // get the latest checkin time for that date, return none otherwise

  res.send(req.body);

});

module.exports = app;
