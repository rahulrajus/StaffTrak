const express = require('express');
const Department = require('../../models/Department');

const app = express.Router();

app.get('/department', async function (req, res) {
  if (!req.isAuthenticated()) {
    res.status(400).json({ error: "Authentication failed." })
  } else {
    const id = req.query.id;
    department = await Department.findById(id).populate('members');
    res.send(department);
  }
});

module.exports = app;
