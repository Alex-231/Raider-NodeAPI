var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../app/models/user');
var config = require('../config/main');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret; //That's it, that's it, that's it.
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({ id: jwt_payload.id }, function(err, user) {
            if (err) { //If there's an error, return it.
                return done(err, false);
            }
            if (user) { //If there's a user, return it.
                done(null, user);
            } else { //If there's no user, return false.
                done(null, false);
            }
        });
    }));
};