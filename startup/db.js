
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  // const db = config.get('dbA') + config.get('dbLogin') + ':' + config.get('dbPassword') + config.get('dbB');
  const db = config.get('db');
  mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
      .then(() => console.info(`Connected to ${db}...`));
};
