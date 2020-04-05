const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

const app = express.Router();
const multipart = multer();

// MODIFY TO MONGOOSE
app.post('/register', multipart.array(), async function (req, res) {
  data = JSON.parse(req.body.rawRequest)
  sendSMS('Thank you for registering!', data.q32_phoneNumber);

  await db.collection('users').findOneAndUpdate({
    phone_number: data.q32_phoneNumber
  }, {
    $set: {
      name: data.q31_name.first + " " + data.q31_name.last,
      phone_number: data.q32_phoneNumber,
      department: data.q42_department,
      age: data.q36_age,
      gender: data.q37_gender,
      home_zipcode: data.q38_homeZip,
      preexisting_conditions: data.q35_doYou,
      responses: []
    }
  }, { upsert: true }).then(async user => {
    user_id = user.value ? user.value._id : user.lastErrorObject.upserted;
    await db.collection('responses').insertOne(
      {
        symptoms: data.q28_whatSymptoms,
        temperature: data.q30_whatIs,
        exposed_in_last_24h: data.q33_inThe,
        user_id: user_id
      }
    ).then(result => {
      response_id = result.insertedId
      userQuery = { _id: new ObjectID(user_id) }
      pushResponses = { $push: { responses: response_id } }
      db.collection('users').updateOne(userQuery, pushResponses);
    });
    departmentQuery = { name: data.q42_department }
    pushMembersUpdate = { $push: { members: user_id } }
    await db.collection('departments').updateOne(
      departmentQuery, pushMembersUpdate
    );
  });
  res.send(req.body);
});


module.exports = app;