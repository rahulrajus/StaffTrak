const express = require('express');
const { check, validationResult } = require('express-validator');
const path = require('path');

const Administrator = require('../../models/Administrator');

const app = express.Router();
const publicPath = path.resolve(__dirname, '../../../', 'client', 'build');

app.get('/reset/:resetPasswordToken', (req, res) => {
  var resetPasswordToken = req.params.resetPasswordToken;
  Administrator.findOne({
    resetPasswordToken
  }, (err, admin) => {
    if (admin === null) {
      res.status(403).send('Password reset link is invalid or has expired.');
    } else {
      res.sendFile(publicPath + '/index.html');
    }
  })
});

app.post('/reset/:resetPasswordToken', [
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('Password confirmation is incorrect.');
      } else {
        return true;
      }
    })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  Administrator.findOne({
    resetPasswordToken: req.body.resetPasswordToken,
    // resetPasswordExpires: {
    //   $gte: Date.now()
    // }
  }).then((admin) => {
    if (admin === null) {
      res.status(403).send('Password reset link is invalid or has expired.');
    } else {
      admin.password = req.body.password;
      admin.resetPasswordToken = null;
      admin.resetPasswordExpires = null;
      admin.usingDefaultPassword = false;
      admin.save((err) => {
        if (err) return next(err);
        res.status(200).send({ admin, message: 'Password changed successfully.' });
      });
    }
  });
});

module.exports = app;