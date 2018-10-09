'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');


// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();

const {PORT} = require('./config');

app.listen(PORT, function (){ console.log(`Your app is listening on port ${PORT}`); });