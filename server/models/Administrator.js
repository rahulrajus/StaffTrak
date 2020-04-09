const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

var administratorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: 'first name is required'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'last name is required'
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'email is required'
  },
  password: {
    type: String,
    required: 'password is required'
  },
  departmentId: {
    type: Schema.Types.ObjectId, ref: 'Department',
    required: true
  },
});

// Mongoose methods cannot use arrow functions because they prevent binding this.
administratorSchema.pre('save', function (next) {
  var administrator = this;
  if (this.isModified('password')) {
    // hash password with salt
    bcrypt.hash(administrator.password, BCRYPT_SALT_ROUNDS, function (err, hash) {
      if (err) return next(err);
      // rewrite password as hashed password
      administrator.password = hash;
      next();
    })
  } else {
    next();
  }
});

administratorSchema.methods.validPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  })
}

administratorSchema.statics.authenticate = function (email, password, cb) {
  Administrator.findOne({
    email: email
  }, (err, administrator) => {
    if (err) {
      console.log(err.message);
      err = new Error('An unknown error has occured.')
      return cb(err);
    }
    if (!administrator) {
      var err = new Error('There is no account with that email address.');
      err.status = 401;
      return cb(err);
    }
    bcrypt.compare(password, administrator.password, function (err, result) {
      if (result === true) {
        return cb(null, administrator);
      } else {
        var err = new Error('Incorrect password.')
        err.status = 401;
        return cb(err);
      }
    })
  })
}

var Administrator = mongoose.model('Administrator', administratorSchema)
module.exports = Administrator;