const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Administrator = require('../../models/Administrator');

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
  passport.authenticate('login', (err, user, info) => {
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
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        res.status(200).send(user);
      });
    }
  })(req, res, next);
});

module.exports = app;