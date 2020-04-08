const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Administrator = require('./models/Administrator.js');

// This file defines the passport strategies that authenticate the administrator.

passport.use(
  'login',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
    (username, password, done) => {
      try {
        Administrator.findOne({
          email: username,
        }).then((user) => {
          if (user === null) {
            return done(null, false, {
              message: 'Unregistered email.',
            });
          }
          user.validPassword(password, (err, isMatch) => {
            if (!isMatch) {
              return done(null, false, {
                message: 'Incorrect password.'
              });
            } else {
              return done(null, user);
            }
          });
        });
      } catch (err) {
        done(err);
      }
    }),
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  Administrator.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;