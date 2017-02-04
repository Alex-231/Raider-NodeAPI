var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/main');

//Authentication Routes

//Register new user.
router.post('/register', function(req, res) {
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
router.post('/login', function(req, res) {
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
                    var token = jwt.sign({data: user.username}, 
                        config.secret, { expiresIn: '1d'}
                    );

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

// router.get('/github',
//     passport.authenticate('github'),
//     function(req, res) {});
// router.get('/auth/github/callback',
//     passport.authenticate('github', { failureRedirect: '/', session: false }),
//     function(req, res) {
//     var token = jwt.sign({data: req.username}, 
//         config.secret, { expiresIn: '1d'}
//     );
//         res.json({ success: true, token: 'JWT ' + token });
//     });

// router.get('/google',
//     passport.authenticate('google', {
//         scope: [
//             'https://www.googleapis.com/auth/plus.login',
//             'https://www.googleapis.com/auth/plus.profile.emails.read',
//             'email',
//             'profile'
//         ]
//     }));
// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: '/', session: false }),
//     function(req, res) {
//         //Create a token and respond.
//         var token = jwt.sign(req.user, config.secret, {
//             expiresIn: '1440m'
//         });
//         res.json({ success: true, token: 'JWT ' + token });
//     });

module.exports = router;