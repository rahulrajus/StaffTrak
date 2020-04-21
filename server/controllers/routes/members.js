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
  if (!req.isAuthenticated()) {
    res.status(400).json({ error: "Authentication failed." })
    return;
  }
  memberResponse = { members: [] }

  administrator_id = req.query.administrator_id
  query_date = moment(req.query.date)
  // get array of members based on administrator_id
  admin = await Administrator.findById(administrator_id);
  department_id = admin.departmentId;
  department = await Department.findById(department_id).populate('members')
  institution = await Institution.findById(department.institution)
  timeZone = institution.timeZone
  members = department.members
  // for each member:
  // console.log(members)
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
          // return responseTime.diff(queryTime) <= 0

        })
        thisMember.temperatures = tempResponses.map((val, index, array) => {
          return {
            "date": array[array.length - 1 - index].createdAt,
            "temp": array[array.length - 1 - index].temperature
          }
        })
        sortedResponses = tempResponses.filter(response => {
          responseTime = moment(response.createdAt).tz(timeZone)
          queryTime = moment(query_date).tz(timeZone)
          return responseTime.get('date') == queryTime.get('date') &&
            responseTime.get('month') == queryTime.get('month') &&
            responseTime.get('year') == queryTime.get('year');
        });
        if (sortedResponses.length == 0) {
          return null;
        }

        lastResponse = sortedResponses[0]
        thisMember.timeOfLastCheckIn = lastResponse.createdAt
        thisMember.exposedInLast24h = lastResponse.exposedInLast24h
        thisMember.symptoms = lastResponse.symptoms
        thisMember.checkedInToday = true
        return thisMember
      })

    return updatedMem;
  }));
  filteredMembers = memberResponse.members.filter(item => item != null)
  res.send({ members: filteredMembers })

});

module.exports = app;
