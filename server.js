//File originally retrieved on 29/12/16 from https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
//Modified for Raider by Alex231

// packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
    
// configuration 
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// routes
require('./app/routes')(app, User, jwt, express);

// start the server
app.listen(port);
console.log('Magic happens at http://localhost:' + port);