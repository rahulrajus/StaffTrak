const express = require('express');
const multer = require('multer');

const sendSMS = require('../../scripts/send_sms');
const notifications = require('../../scripts/schedule_notifications');

const User = require('../../models/User');
const Response = require('../../models/Response');
const Department = require('../../models/Department');
const Institution = require('../../models/Institution');

const mongoose = require('mongoose');

const app = express.Router();
const multipart = multer();

/* Register a new user */
app.get('/send_notification', async function (req, res) {
    if(!req.isAuthenticated()) {
        res.status(400).json({ error: "Authentication failed."})
    }
    member_id = req.query.member_id
    console.log(member_id)
    user = await User.findById(member_id)
    console.log(user.created_at)
    user = User.
            findById(member_id).
            populate('departmentId').
            exec(async (err, usr) => {
                if(err) console.log(err);
                phoneNumber = usr.phoneNumber
                departmentName = usr.departmentId.departmentName
                name = {first: usr.firstName, last: usr.lastName}
                institution = await
                Institution.findById(usr.departmentId.institution)
                url = institution.responseForm.url
                formLink = notifications.generateLink(url, phoneNumber, name, departmentName);
                sendSMS(formLink, phoneNumber);
            })
    // console.log(user.createdAt)
    res.send({"success": true})
});

module.exports = app;
