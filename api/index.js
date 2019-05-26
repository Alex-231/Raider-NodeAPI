// Grab packages
import configureRoutes from './routes';

const express = require('express');

const app = express(); // Instance express (?)
const mongoose = require('mongoose'); // Mongo Connection
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

// Get POSTS with body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log requests.
app.use(morgan('dev'));

// Initialize passport.
app.use(passport.initialize());

// Connect to db
mongoose.connect(process.env.DATABASE_URI);

// Require routes.
configureRoutes(app);

app.listen(process.env.PORT, process.env.HOST);
console.log('Server running.');
