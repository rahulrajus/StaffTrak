const express = require('express');

const sendSMS = require('../../scripts/send_sms');
const notifications = require('../../scripts/schedule_notifications');

const User = require('../../models/User');
const Institution = require('../../models/Institution');

const app = express.Router();

/* Register a new user */
app.get('/send_notification', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(400).json({ error: "Authentication failed." });
        return;
    }
    const member_id = req.query.member_id;
    user = User.
        findById(member_id).
        populate('department', 'departmentName institution').
        exec(async (err, usr) => {
            if (err) {
                console.log(error);
                res.send({ "success": false });
                return;
            };
            phoneNumber = usr.phoneNumber
            departmentName = usr.department.departmentName
            name = { first: usr.firstName, last: usr.lastName }
            institution = await
                Institution.findById(usr.department.institution)
            url = institution.responseForm.url
            formLink = notifications.generateLink(url, phoneNumber, name, departmentName);
            await sendSMS(formLink, phoneNumber);
            res.send({ "success": true });
        });
});

module.exports = app;
