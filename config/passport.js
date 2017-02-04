var JwtStrategy = require('passport-jwt').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../app/models/user');
var config = require('../config/main');
var oauthConfig = require('../config/oauth');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret; //That's it, that's it, that's it.

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({ username: jwt_payload.data }, function(err, user) {
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

    passport.use(new GoogleStrategy({
            clientID: oauthConfig.google.clientID,
            clientSecret: oauthConfig.google.clientSecret,
            callbackURL: oauthConfig.google.callbackURL
        },
        function(request, accessToken, refreshToken, profile, done) {
            User.findOne({ oauthID: profile.id }, function(err, user) {
                if (err) {
                    console.log(err); // handle errors!
                    return done({ success: false, message: err });
                }
                if (user !== null) {
                    done(null, user);
                } else {
                    user = new User({
                        oauthID: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        created: Date.now()
                    });
                    user.save(function(err) {
                        if (err) {
                            console.log(err); // handle errors!
                        } else {
                            console.log("saving user ...");
                            done(null, user);
                        }
                    });
                }
            });
        }
    ));

    passport.use(new GithubStrategy({
            clientID: oauthConfig.github.clientID,
            clientSecret: oauthConfig.github.clientSecret,
            callbackURL: oauthConfig.github.callbackURL,
            scope: 'user:email'
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ oauthID: profile.id }, function(err, user) {
                if (err) {
                    console.log(err); // handle errors!
                    return done({ success: false, message: err });
                }
                if (user !== null) {
                    done(null, user);
                } else {
                    user = new User({
                        oauthID: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        created: Date.now()
                    });
                    user.save(function(err) {
                        if (err) {
                            console.log(err); // handle errors!
                        } else {
                            console.log("saving user ...");
                            done(null, user);
                        }
                    });
                }
            });
        }
    ));
};