// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();

function sendSMS(messageBody, recipientPhoneNum) {
    console.log("hellooo");
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    console.log(accountSid, authToken, messageBody);
    console.log('+1' + recipientPhoneNum);
    client.messages
    .create({
        body: messageBody,
        from: '+16625544151',
        to: '+1' + recipientPhoneNum
    })
    .then(message => console.log(message.sid)).catch(err => {
        console.log(err);
    });

}
module.exports = sendSMS;
