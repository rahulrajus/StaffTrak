var schedule = require('node-schedule');
var sendSMS = require('./send_sms');
var moment = require('moment-timezone');
var mongoose = require('mongoose');

const Institution = require('../models/Institution');
const Department = require('../models/Department');
const User = require('../models/User');

var generateLink = (url, phoneNumber, name, department) => {
    departmentFormatted = department.split(" ").join("%20");
    return `${url}?name[first]=${name.first}&name[last]=${name.last}&phoneNumber=${phoneNumber}&department=${departmentFormatted}`
}

function sendDepartmentNotification(department) {

    notifTimes = department.notifTimes

    institution_id = department.institution
    Institution.findById(institution_id).then(institution => {
        timeZone = institution.timeZone

        for(var i = 0; i<department.notifTimes.length;i++) {
            var time = department.notifTimes[i]

            scheduled = moment.tz(time, 'HHmm', timeZone);
            scheduledFormatted = scheduled.format();

            // Check if we have already sent this notification
            if (department.timeOfLastNotif == scheduledFormatted) continue;

            // Checks to see if the time is within 1min of the
            // scheduled notification time
            current = moment();
            difference = scheduled.diff(current, "minute");

            if(difference != 0) continue;

            // Mark this notification as sent
            // department.timeOfLastNotif = scheduledFormatted;
            Department.findByIdAndUpdate(department._id, {
                $set: {
                    timeOfLastNotif: scheduledFormatted
                }
            }).then(console.log(department.timeOfLastNotif));
            //check if notification has already been sent
            //mark notification as sent
            //sends notification
            url = institution.responseForm.url;
            departmentName = department.departmentName;

            users = department.members;
            users.forEach(async user_id => {
              user = await User.findById(user_id);
              name = {first: user.firstName, last: user.lastName};
              phoneNumber = user.phoneNumber;
              formLink = generateLink(url, phoneNumber, name, departmentName);
              sendSMS(formLink, phoneNumber);
            })
        }
    })
}

async function scheduleNotifications() {
	schedule.scheduleJob("*/12 * * * * *", async () => {
        allDepartments = await Department.find({});
        allDepartments.forEach(department => {
            sendDepartmentNotification(department);
        });
	});
}

module.exports = scheduleNotifications;
