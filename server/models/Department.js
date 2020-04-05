const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  notifTimes: {
    type: [String],
    default: ['0600', '1700']
  },
  admins: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Administrator' }]
  },
  institution: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Institution' }]
  }
});

var Department = mongoose.model('Department', departmentSchema)
module.exports = Department;