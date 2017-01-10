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


    //Health route for OpenShift monitoring.
    app.get("/health", function(req, res) {
        res.json({ success: true, message: 'success' });
    });

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

    // apiRoutes.put('/user', passport.authenticate('jwt', { session: false }), function(req, res) {
    //     //Allowing users to put their user data in here is a concern, 
    //     //However, the mongoose validation should keep this safe.
    //     //Mostly.

    //     //Todo: remove levels and EXP. In the future, the API will recieve match stats and level up players appropriately.
    //     //That is, if all players provide the same stats when expected.
    //     //Security will be a concern there too...

    //     if (!req.body.user) {
    //         res.send({ success: false, message: 'No user data was sent.' });
    //     }
    //     var userJson = JSON.parse(req.body.user);
    //     req.user = new User({ userJson });
    //     req.user.save(function(err) {
    //         if (err) {
    //             res.send({ success: false, message: err });
    //         } else {
    //             res.send({ success: true, message: 'Successfully updated user data' });
    //         }
    //     });
    // });

    apiRoutes.get('/user', passport.authenticate('jwt', { session: false }), function(req, res) {
        res.send({ success: true, user: req.user });
    });

    apiRoutes.put('/user/username', passport.authenticate('jwt', { session: false }), function(req, res) {
        if (!req.body.username) {
            res.send({ success: false, message: 'No username recieved' });
        }

        User.findOne({
            username: req.body.username
        }, function(err, user) {
            if (err.message) {
                res.send({ success: false, message: err.message });
            }

            if (!user) {
                req.user.username = req.body.username;
                req.user.save(function(err) {
                    if (err) {
                        res.send({ success: false, message: err });
                    }
                });
                res.send({ success: true, message: 'Updated username.' })
            } else {
                res.send({ success: false, message: 'User ' + req.body.username + ' already exists.' })
            }
        });

        res.send({ success: true, characters: req.user.characters });
    });

    apiRoutes.put('/user/settings', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.settings) {
            res.send({ success: false, message: 'No settings were sent.' });
        }
        var settingsJson = JSON.parse(req.body.settings);
        req.user.settings = new Settings({ settingsJson });
        req.user.save(function(err) {
            if (err.message) {
                res.send({ success: false, message: err.message });
            } else {
                res.send({ success: true, message: 'Successfully updated user settings.' });
            }
        });
    });

    apiRoutes.get('/user/characters', passport.authenticate('jwt', { session: false }), function(req, res) {
        if (!req.user.characters) {
            res.send({ success: false, message: 'No characters found.' });
        }
        res.send({ success: true, characters: req.user.characters });
    });

    apiRoutes.put('/user/characters', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters.push(new Character(characterJson));
        req.user.save(function(err) {
            if (err.message) {
                res.send({ success: false, message: err.message });
            }
        });
        res.send({ success: true, message: 'Successfully added character to the user.' });
    });

    apiRoutes.post('/user/characters/new', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters.push(new Character(characterJson));
        req.user.save(function(err) {
            if (err.message) {
                res.send({ success: false, message: err.message });
            }
        });
        res.send({ success: true, message: 'Successfully added character' });
    });

    apiRoutes.put('/user/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters[req.params.slot] = new Character(characterJson);
        req.user.save(function(err) {
            if (err.message) {
                res.send({ success: false, message: err.message });
            }
        });
        res.send({ success: true, message: 'Successfully edited character' });
    });

    apiRoutes.get('/user/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (!req.user.characters[req.params.slot]) {
            res.send({ success: false, message: 'No character found at slot ' + req.params.slot });
        }

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        res.send({ success: true, character: req.user.characters[req.params.slot] });
    });

    apiRoutes.delete('/user/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false }), function(req, res) {

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        req.user.characters.splice(req.params.slot, 1);
        req.user.save(function(err) {
            if (err.message) {
                res.send({ success: false, message: err.message });
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