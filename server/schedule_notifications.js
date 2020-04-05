schedule = require('node-schedule')
var sendSMS = require('./send_sms');

var generateLink = (url, phoneNumber, name) => {
    return `${url}?name[first]=${name.first}&name[last]=${name.last}&phoneNumber=${phoneNumber}`
}

function sendDepartmentNotification() {
    times = ['0600','1700','2100']
    times.forEach(time => {
        scheduled = moment(time,'HHmm');
        current = moment().tz('America/Los_Angeles');
        difference = scheduled.diff(current);
        if(difference < 0 || difference >= 16) return;
        //check if notification has already been sent
        //mark notification as sent
        //sends notificatioN
        formLink = generateLink(url, phoneNumber, name);
        sendSMS(formLink, phoneNumber)
    });

}
async function scheduleNotifications() {
	schedule.scheduleJob("*/1 * * * *", () => {
        sendDepartmentNotification();
	});
}
