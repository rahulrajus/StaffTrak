// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const senderPhoneNum = process.env.PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);
async function sendSMS(messageBody, recipientPhoneNum) {
    client.messages
        .create({
            body: messageBody,
            from: '+1' + senderPhoneNum,
            to: '+1' + recipientPhoneNum
        })
        .then(message => {
            console.log(message);
            return true;
        }).catch(err => {
            console.log(err);
            return false;
        });

}
module.exports = sendSMS;
