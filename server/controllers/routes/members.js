const express = require('express');
const multer = require('multer');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');
const Administrator = require('../../models/Administrator');

const moment = require('moment-timezone');
const mongoose = require('mongoose');

const app = express.Router();
const multipart = multer();

/* Endpoint for populating the members table */
app.get('/members', async function (req, res) {

  // Authentication
  if (!req.isAuthenticated()) {
    res.status(400).json({ error: "Authentication failed." })
    return;
  }

  // Get array of members based on administrator_id
  administrator_id = req.query.administrator_id
  query_date = moment(req.query.date)
  admin = await Administrator.findById(administrator_id);
  department_id = admin.departmentId;
  department = await Department.findById(department_id).populate('members')
  institution = await Institution.findById(department.institution)
  timeZone = institution.timeZone
  members = department.members

  // Populate response json with list of members
  memberResponse = { members: [] }
  memberResponse.members = await Promise.all(members.map(member => {
    var thisMember = {
      member_id: null,
      name: null,
      temperatures: [],
      checkedInToday: null,
      timeOfLastCheckIn: null,
      exposedInLast24h: null,
      symptoms: null
    }

    name = {
      first: member.firstName,
      last: member.lastName
    }

    thisMember.name = name;
    thisMember.member_id = member._id;
    updatedMem = Response.find({ "user": thisMember.member_id })
      .sort({ "createdAt": -1 })
      .then((sortedResponses) => {
        lastResponse = null
        tempResponses = sortedResponses.filter(response => {
          responseTime = moment(response.createdAt).tz(timeZone)
          queryTime = moment(query_date).tz(timeZone)

          return responseTime.get('date') <= queryTime.get('date') &&
            responseTime.get('month') <= queryTime.get('month') &&
            responseTime.get('year') <= queryTime.get('year');

        }) // gives you all data until the query date
        thisMember.temperatures = tempResponses.map((val, index, array) => {
          return {
            "date": array[array.length - 1 - index].createdAt,
            "temp": array[array.length - 1 - index].temperature
          }
        })

        // Get response from the query date
        sortedResponses = tempResponses.filter(response => {
          responseTime = moment(response.createdAt).tz(timeZone)
          queryTime = moment(query_date).tz(timeZone)
          return responseTime.get('date') == queryTime.get('date') &&
            responseTime.get('month') == queryTime.get('month') &&
            responseTime.get('year') == queryTime.get('year');
        });

        if (sortedResponses.length == 0) {
          thisMember.checkedInToday = false;
          return thisMember;
        }

        lastResponse = sortedResponses[0];
        thisMember.checkedInToday = true;
        thisMember.timeOfLastCheckIn = lastResponse.createdAt;
        thisMember.exposedInLast24h = lastResponse.exposedInLast24h;
        thisMember.symptoms = lastResponse.symptoms;
        return thisMember;

      })
    return updatedMem;
  }));

  checkedInMembers = memberResponse.members.filter(item => item.checkedInToday)
  notYetResponded = memberResponse.members.filter(item => !item.checkedInToday)

  res.send({members: checkedInMembers, notYetResponded: notYetResponded})

  //filteredMembers = memberResponse.members.filter(item => item != null)
  //res.send({ members: filteredMembers})

});

module.exports = app;
