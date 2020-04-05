var schedule = require('node-schedule');
var sendSMS = require('./send_sms');
var moment = require('moment-timezone');

const Institution = require('../../models/Institution');
const Department = require('../../models/Department');

var generateLink = (url, phoneNumber, name, department) => {
    return `${url}?name[first]=${name.first}&name[last]=${name.last}&phoneNumber=${phoneNumber}&department=${department}`
}

function sendDepartmentNotification(department_id) {
    department = Department.findById(department_id)
    notifTimes = department.notifTimes

    institution_id = department.institution
    institution = Institution.findById(institution_id)
    timeZone = institution.timeZone

    notifTimes.forEach(time => {
        scheduled = moment.tz(time, 'HHmm', timeZone);
        scheduledFormatted = schedule.format();

        // Check if we have already sent this notification
        if (department.timeOfLastNotif == scheduledFormatted) continue;

        // Checks to see if the time is within 1min of the
        // scheduled notification time
        current = moment();
        difference = scheduled.diff(current);
        if(difference < -5 || difference >= 0) continue;

        // Mark this notification as sent
        department.timeOfLastNotif = scheduledFormatted;
        department.save();

        //check if notification has already been sent
        //mark notification as sent
        //sends notification
        url = institution.responseForm.url;
        departmentName = department.departmentName;

        users = department.members;
        users.forEach(user => {
          name = {first: user.firstName, last: user.lastName};
          phoneNumber = user.phoneNumber;
          formLink = generateLink(url, phoneNumber, name, departmentName);
          sendSMS(formLink, phoneNumber);
        })
    });
}

async function scheduleNotifications() {
	schedule.scheduleJob("*/1 * * * *", () => {
    allDepartments = Department.find()
    allDepartments.forEach(department => {
      sendDepartmentNotification(department._id);
    })
	});
}
