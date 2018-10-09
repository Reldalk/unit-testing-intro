'use strict';

// Load array of notes
const data = require('./db/notes');
console.log('Hello Noteful!');


// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const logger = require('./middleware/logger');
const app = express();
app.use(logger);

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

const {PORT} = require('./config');

app.listen(PORT, function (){ console.log(`Your app is listening on port ${PORT}`); });