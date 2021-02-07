const express = require('express');
const stories = require('../routes/stories');
const infoPages = require('../routes/infoPages');
const auth = require('../routes/auth');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/stories', stories);
  app.use('/api/infoPages', infoPages);
  app.use('/api/auth', auth);
};