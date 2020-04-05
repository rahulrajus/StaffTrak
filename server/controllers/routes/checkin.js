const express = require('express');
const multer = require('multer');

const app = express.Router();
const multipart = multer();
const Response = require('../../models/Response')
const User = require('../../models/User')

app.post('/checkin', multipart.array(), function (req, res) {
  data = JSON.parse(req.body.rawRequest)
  db.collection('responses').insertOne({
    name: data.q31_name.first + " " + data.q31_name.last,
    phone_number: data.q32_phoneNumber,
    department: data.q44_department,
    symptoms: data.q28_whatSymptoms,
    temperature: data.q43_temperatureIn,
    exposed_in_last_24h: data.q33_inThe
  }).then(doc => {
    response_id = doc.insertedId;
    query = { phone_number: data.q32_phoneNumber }
    update = { $push: { responses: response_id } }
    db.collection('users').findOneAndUpdate(query, update).then(user => {
      user_id = user.value._id;
      query = { _id: new ObjectID(response_id) }
      update = { $set: { user_id: user_id } }
      db.collection('responses').updateOne(query, update);
    })
  });
});

module.exports = app;
