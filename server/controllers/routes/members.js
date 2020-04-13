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

  memberResponse = { members: [] }

  administrator_id = req.query.administrator_id
  query_date = moment(req.query.date)
  console.log(administrator_id)
  // get array of members based on administrator_id
  admin = await Administrator.findById(administrator_id);
  department_id = admin.departmentId;
  department = await Department.findById(department_id).populate('members')
  members = department.members
  // for each member:
  // console.log(members)
  memberResponse.members = await Promise.all(members.map(member => {

    thisMember = {
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
        sortedResponses = sortedResponses.filter(response => {
          return moment(response.updatedAt).diff(moment(query_date)) < 0
        })
        thisMember.temperatures = sortedResponses.map(response => {
          return {
            "date": response.updatedAt,
            "temp": response.temperature
          }
        })
        lastResponse = sortedResponses[0]
        thisMember.timeOfLastCheckIn = lastResponse.createdAt
        thisMember.exposedInLast24h = lastResponse.exposedInLast24h
        thisMember.symptoms = lastResponse.symptoms
        thisMember.checkedInToday = true
        return thisMember
      })
    return updatedMem;
  }));
  res.send(memberResponse)

});

module.exports = app;
