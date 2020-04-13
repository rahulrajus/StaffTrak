const express = require('express');

const Department = require('../../models/Department');

const app = express.Router();

app.get('/department', async function (req, res) {
  const id = req.query.id;
  department = await Department.findById(id);

  res.send(department);
});

module.exports = app;
