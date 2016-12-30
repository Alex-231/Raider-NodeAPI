//Grab packages
var express = require('express');
app = express(); //Instance express (?)
var mongoose = require('mongoose'); //Mongo Connection
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('./config/main');
var User = require('./app/models/user');
var port = 8080;

//Get POSTS with body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log requests.
app.use(morgan('dev'));

//Initialize passport.
app.use(passport.initialize());

//Connect to db
mongoose.connect(config.database);

//I probably don't need to pass in app right?
require('./app/routes')(app);

app.listen(port);
console.log('Server running on ' + port);