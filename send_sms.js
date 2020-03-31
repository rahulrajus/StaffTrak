// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACf9fe1076b61476a33193f4c8cef44cf6';
const authToken = '794fdfb6bbbf7853aeacaa26fba34ce1';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'https://hipaa.jotform.com/200887837659171',
     from: '+16625544151',
     to: '+14085822132'
   })
  .then(message => console.log(message.sid));