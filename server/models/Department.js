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
    type: [Date],
  },
  admins: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Administrator' }]
  }
});

var Department = mongoose.model('Department', departmentSchema)
module.exports = Department;