var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

    router.put('/user', passport.authenticate('jwt', { session: false }), function(req, res) {
        //Allowing users to put their user data in here is a concern, 
        //However, the mongoose validation should keep this safe.
        //Mostly.

        //Todo: remove levels and EXP. In the future, the API will recieve match stats and level up players appropriately.
        //That is, if all players provide the same stats when expected.
        //Security will be a concern there too...

        if (!req.body.user) {
            res.send({ success: false, message: 'No user data was sent.' });
        }
        var userJson = JSON.parse(req.body.user);
        req.user = new User({ userJson });
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            } else {
                res.send({ success: true, message: 'Successfully updated user data' });
            }
        });
    });

    module.exports = router;