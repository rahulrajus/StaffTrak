var port = 80;

var bodyParser = require('body-parser');
var express = require('express');
var multer  = require('multer');
require('dotenv').config();
var sendSMS = require('./send_sms');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID; 
var moment = require('moment');
var departments = require('./departments')

// sendSMS('https://hipaa.jotform.com/200887837659171', '5712260277');

MONGO_URL = "mongodb://127.0.0.1:27017"

MongoClient.connect(
  MONGO_URL,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("staff_trak");
    /* Add code to call Jotform API and refresh data
    in case things changed while the server was down. */

//6am 5pm, way for supervisor to adjust notification times
    app.listen(80, function() {
      console.log("listening on 80");
    });
  }
);


var app = express();
var multipart = multer();

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.get('/', (req,res) => {
    res.send("Hello World");
})
app.post('/test_register', async function(req,res) {
    data = req.body
    response = await db.collection('test-users').findOneAndUpdate({phone_number: data.phoneNumber},{$set: {
        name: data.name,
    }},{
        upsert: true
    }).then(user => {
        console.log(user.value._id)

    }).catch(err => {
        console.log(err);
    });
    console.log(response)
    res.send("ok!")
})
app.post('/register', multipart.array(), async function(req, res) {
  console.log(req.body)
  data = JSON.parse(req.body.rawRequest)
  console.log(data)
  sendSMS('Thank you for registering!', data.q32_phoneNumber);

  await db.collection('users').findOneAndUpdate(
    {phone_number: data.q32_phoneNumber},
    {
        $set: {
            name: data.q31_name.first + " " + data.q31_name.last,
            phone_number: data.q32_phoneNumber,
            department: data.q42_department,
            age: data.q36_age,
            gender: data.q37_gender,
            home_zipcode: data.q38_homeZip,
            preexisting_conditions: data.q35_doYou,
            submissions: []
        }
    },
    {
        upsert: true
    }).then(user => {
      id = user.value._id;
      db.collection('responses').insertOne({
          symptoms: data.q28_whatSymptoms,
          temperature: data.q30_whatIs,
          exposed_in_last_24h: data.q33_inThe
      })

  });
  res.send(req.body);
});
app.post('/checkin', multipart.array(), function(req, res) {
  // console.log(req.body)
  // res.send(req.body);
  data = JSON.parse(req.body.rawRequest)
  console.log(data)

  db.collection('responses').update({phone_number: data.q32_phoneNumber},{
      name: data.q31_name.first + " " + data.q31_name.last,
      phone_number: data.q32_phoneNumber,
      department: data.q44_department,
      symptoms: data.q28_whatSymptoms,
      temperature: data.q43_temperatureIn,
      exposed_in_last_24h: data.q33_inThe,
  },{
      upsert: true
  });
});
