var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var Character = require('./models/character');
var config = require('../config/main');

module.exports = function(app) {

    //Import passport strat.
    require('../config/passport')(passport);

    //API routes.
    var apiRoutes = express.Router();

    //Register new user.
    apiRoutes.post('/auth/register', function(req, res) {
        if (!req.body.email || !req.body.password) {
            res.json({ success: false, message: 'Please enter an email and password.' });

        } else if (!req.body.username) {
            res.json({ success: false, message: 'Please enter a Username.' });
        } else {
            var user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            //Attempt to save the new user.
            user.save(function(err) {
                if (err) {
                    Console.Log(err);
                    return res.json({ success: false, message: 'Username or Email Address already exists.' });
                }
                res.json({ success: true, message: 'Successfully created new user.' });
            });
        }
    });

    //Authenticate the user and get a token (yay!)
    apiRoutes.post('/auth/login', function(req, res) {
        User.findOne({
            username: req.body.username
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

    // apiRoutes.get('/auth/github',
    //     passport.authenticate('github'),
    //     function(req, res) {});
    // apiRoutes.get('/auth/github/callback',
    //     passport.authenticate('github', { failureRedirect: '/', session: false }),
    //     function(req, res) {
    //         var token = jwt.sign(req.user, config.secret, {
    //             expiresIn: '1440m'
    //         });
    //         res.json({ success: true, token: 'JWT ' + token });
    //     });

    // apiRoutes.get('/auth/google',
    //     passport.authenticate('google', {
    //         scope: [
    //             'https://www.googleapis.com/auth/plus.login',
    //             'https://www.googleapis.com/auth/plus.profile.emails.read',
    //             'email',
    //             'profile'
    //         ]
    //     }));
    // apiRoutes.get('/auth/google/callback',
    //     passport.authenticate('google', { failureRedirect: '/', session: false }),
    //     function(req, res) {
    //         //Create a token and respond.
    //         var token = jwt.sign(req.user, config.secret, {
    //             expiresIn: '1440m'
    //         });
    //         res.json({ success: true, token: 'JWT ' + token });
    //     });

    //Protect dashboard route with jwt,
    apiRoutes.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.send('It worked! User id is: ' + req.user._id + '.');
    });

    apiRoutes.get('/user', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.send({ success: true, user: req.user });
    });

    apiRoutes.get('/user/characters', passport.authenticate('jwt', { session: false }), function(req, res) {
        if (!req.characters) {
            res.send({ success: false, message: 'No characters found.' });
        }
        res.send({ success: true, user: req.characters });
    });

    apiRoutes.put('/user/characters', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters.push(new Character(characterJson));
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });
        res.send({ success: true, message: 'Successfully added character to the user.' });
    });

    apiRoutes.put('/user/characters/:slot', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters[req.params.slot] = new Character(characterJson);
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });
        res.send({ success: true, message: 'Successfully added character to the user.' });
    });

    apiRoutes.get('/user/characters/:slot', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!res.user.characters[req.params.slot]) {
            res.send({ success: false, message: 'No character found at slot ' + req.params.slot });
        }
        res.send({ success: true, character: req.user.characters[req.params.slot] });
    });

    apiRoutes.delete('/user/characters/:slot', passport.authenticate('jwt', { session: false }), function(req, res) {

        req.user.characters.splice(req.params.slot, 1);
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });

        res.send({ success: true, message: 'Successfully deleted the character at ' + req.params.slot });
    });



    //Set url for API group routes.
    app.use('/api', apiRoutes);

    //Should probably move this later.
    //Home route
    // app.get('/', function(req, res) {
    //     res.send('Homepage route.')
    // })
};