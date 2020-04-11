const crypto = require('crypto');
const express = require('express');
const { check, validationResult } = require('express-validator');

const passport = require('../../passport');

const app = express.Router();

app.post('/login', [
  check('email').isEmail().normalizeEmail().withMessage('Enter a valid email.'),
  check('password').not().isEmpty().withMessage('Enter your password.')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  passport.authenticate('login', (err, admin, info) => {
    if (err) {
      console.error(`error ${err}`);
    }
    if (info !== undefined) {
      console.error(info.message);
      if (info.message === 'Unregistered email.') {
        res.status(401).send(info.message);
      } else {
        res.status(403).send(info.message);
      }
    } else {
      req.logIn(admin, (err) => {
        if (err) { return next(err); }
        if (admin.usingDefaultPassword) {
          admin.resetPasswordToken = crypto.randomBytes(20).toString('hex');
          admin.resetPasswordExpires = Date.now() + 360000;
          admin.save();
        }
        res.status(200).send(admin);
      });
    }
  })(req, res, next);
});

module.exports = app;