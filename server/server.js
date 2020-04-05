var port = 80;

var bodyParser = require('body-parser');
var express = require('express');
var multer = require('multer');
require('dotenv').config();
var sendSMS = require('./send_sms');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var departments = require('./departments')


MONGO_URL = "mongodb://127.0.0.1:27017"

MongoClient.connect(MONGO_URL, (err, client) => {
    if (err)
        return console.log(err);
    db = client.db("staff_trak");
    /* Add code to call Jotform API and refresh data
    in case things changed while the server was down. */

    app.listen(80, function() {
        console.log("listening on 80");
    });
});

var app = express();
var multipart = multer();

app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.get('/', (req, res) => {
    res.send("Hello World");
})
app.post('/test_register', async function(req, res) {
    data = req.body
    response = await db.collection('test-users').findOneAndUpdate({
        phone_number: data.phoneNumber
    }, {
        $set: {
            name: data.name
        }
    }, {upsert: true}).catch(err => {
        console.log(err);
    });
    res.send("ok!")
})

app.post('/register', multipart.array(), async function(req, res) {
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
    }, {upsert: true}).then(async user => {
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
            userQuery = {_id: new ObjectID(user_id)}
            pushResponses = {$push: {responses: response_id}}
            db.collection('users').updateOne(userQuery,pushResponses);
        });
        departmentQuery = {name: data.q42_department}
        pushMembersUpdate = {$push: {members: user_id}}
        await db.collection('departments').updateOne(
            departmentQuery,pushMembersUpdate
        );
    });
    res.send(req.body);
});
app.post('/checkin', multipart.array(), function(req, res) {
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
        query = {phone_number: data.q32_phoneNumber}
        update = {$push: {responses: response_id}}
        db.collection('users').findOneAndUpdate(query,update).then(user => {
            user_id = user.value._id;
            query = {_id: new ObjectID(response_id)}
            update = {$set: {user_id: user_id}}
            db.collection('responses').updateOne(query,update);
        })
    });
});
