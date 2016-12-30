var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var config = require('../config/main');

module.exports = function(app) {

    //Import passport strat.
    require('../config/passport')(passport);

    //API routes.
    var apiRoutes = express.Router();

    //Register new user.
    apiRoutes.post('/register', function(req, res) {
        if (!req.body.email || !req.body.password) {
            res.json({ success: false, message: 'Please enter an email and password.' });

        } else {
            var newUser = new User({
                email: req.body.email,
                password: req.body.password
            });

            //Attempt to save the new user.
            newUser.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: 'Email address already exists.' });
                }
                res.json({ success: true, message: 'Successfully created new user.' });
            });
        }
    });

    //Authenticate the user and get a token (yay!)
    apiRoutes.post('/authenticate', function(req, res) {
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({ success: false, message: 'Authentication fail. User not found.' });
            } else {
                //Check if password matches.
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        //Create the token!
                        var token = jwt.sign(user, config.secret, {
                            expiresIn: '1440m'
                        });
                        res.json({ success: true, token: 'JWT ' + token });
                    } else //Password doesn't match
                    {
                        //Maybe I shouldn't be giving the user this much information.
                        res.send({ success: false, message: 'Authentication failed. Passwords did not match' });
                    }
                });
            }
        });
    });

    //Protect dashboard route with jwt,
    apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.send('It worked! User id is: ' + req.user._id + '.');
    });

    //Set url for API group routes.
    app.use('/api', apiRoutes);

    //Should probably move this later.
    //Home route
    app.get('/', function(req, res) {
        res.send('Homepage route.')
    })
}