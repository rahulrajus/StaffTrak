var port = 80;

var bodyParser = require('body-parser');
var express = require('express');
var multer  = require('multer')
const MongoClient = require("mongodb").MongoClient;

MONGO_URL = "mongodb://127.0.0.1:27017"

MongoClient.connect(
  MONGO_URL,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("staff_trak");
    app.listen(80, function() {
      console.log("listening on 80");
    });
  }
);
var app = express();
var multipart = multer()

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.get('/', (req,res) => {
    res.send("Hello World");
})
app.post('/register', multipart.array(), function(req, res) {
  console.log(req.body)
  data = JSON.parse(req.body.rawRequest)
  console.log(data)
  db.collection('users').update({phone_number: data.q32_phoneNumber},{
      name: data.q31_name.first + " " + data.q31_name.last,
      phone_number: data.q32_phoneNumber,
      department: data.q42_department,
      age: data.q36_age,
      gender: data.q37_gender,
      zipcode: data.q38_homeZip,
      submissions: []
  },{
      upsert: true
  });
  res.send(req.body);
});
app.post('/webhook', multipart.array(), function(req, res) {
  // console.log(req.body)
  // res.send(req.body);

});
//
// app.listen(port);
// console.log('Server started! URL: http://localhost:' + port);
