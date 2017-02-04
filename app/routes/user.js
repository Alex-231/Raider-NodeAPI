var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Character = require('../models/character');
var Settings = require('../models/settings');

    router.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {
        res.send({ success: true, user: req.user });
    });

    router.put('/username', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {
        if (!req.body.username) {
            res.send({ success: false, message: 'No username recieved' });
        }

        User.findOne({
            username: req.body.username
        }, function(err, user) {
            if (err) {
                res.send({ success: false, message: err });
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

    router.put('/settings', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if (!req.body.settings) {
            res.send({ success: false, message: 'No settings were sent.' });
        }
        var settingsJson = JSON.parse(req.body.settings);
        req.user.settings = new Settings({ settingsJson });
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            } else {
                res.send({ success: true, message: 'Successfully updated user settings.' });
            }
        });
    });

    router.get('/characters', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {
        if (!req.user.characters) {
            res.send({ success: false, message: 'No characters found.' });
        }
        res.send({ success: true, characters: req.user.characters });
    });

    router.put('/characters', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

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

    router.post('/characters/new', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

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
        res.send({ success: true, message: 'Successfully added character' });
    });

    router.put('/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if (!req.body.character) {
            res.send({ success: false, message: 'No character was sent.' });
        }

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        var characterJson = JSON.parse(req.body.character);
        req.user.characters[req.params.slot] = new Character(characterJson);
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });
        res.send({ success: true, message: 'Successfully edited character' });
    });

    router.get('/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if (!req.user.characters[req.params.slot]) {
            res.send({ success: false, message: 'No character found at slot ' + req.params.slot });
        }

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        res.send({ success: true, character: req.user.characters[req.params.slot] });
    });

    router.delete('/characters/:slot(\\d+)', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        req.user.characters.splice(req.params.slot, 1);
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });

        res.send({ success: true, message: 'Successfully deleted the character at ' + req.params.slot });
    });

module.exports = router;