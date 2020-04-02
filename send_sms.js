// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
console.log(accountSid, authToken);
const client = require('twilio')(accountSid, authToken);
// client.on('tokenAboutToExpire', function() {
//   // Implement fetchToken() to make a secure request to your backend to retrieve a refreshed access token.
//   // Use an authentication mechanism to prevent token exposure to 3rd parties.
//   fetchToken(function(updatedToken) {
//     client.updateToken(updatedToken);
//   });
// });

function sendSMS(messageBody, recipientPhoneNum) {
    console.log("hellooo");

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
