import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/User';

export default (passport) => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET,
  }, ((jwtPayload, done) => {
    User.findOne({ username: jwtPayload.data }, (err, user) => {
      if (err) { // If there's an error, return it.
        return done(err, false);
      }
      if (user) { // If there's a user, return it.
        done(null, user);
      } else { // If there's no user, return false.
        done(null, false);
      }
    });
  })));

  passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_GOOGLE_CLIENTID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENTSECRET,
    callbackURL: process.env.OAUTH_GOOGLE_CLIENTURL,
  },
  ((request, accessToken, refreshToken, profile, done) => {
    User.findOne({ oauthID: profile.id }, (err, user) => {
      if (err) {
        console.log(err); // handle errors!
        return done({ success: false, message: err });
      }
      if (user !== null) {
        done(null, user);
      } else {
        const updatedUser = new User({
          oauthID: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          created: Date.now(),
        });
        updatedUser.save((saveErr) => {
          if (saveErr) {
            console.log(saveErr); // handle errors!
          } else {
            console.log('saving user ...');
            done(null, user);
          }
        });
      }
    });
  })));

  passport.use(new GithubStrategy({
    clientID: process.env.OAUTH_GITHUB_CLIENTID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENTSECRET,
    callbackURL: process.env.OAUTH_GITHUB_CLIENTURL,
    scope: 'user:email',
  },
  ((accessToken, refreshToken, profile, done) => {
    User.findOne({ oauthID: profile.id }, (err, user) => {
      if (err) {
        console.log(err); // handle errors!
        return done({ success: false, message: err });
      }
      if (user !== null) {
        done(null, user);
      } else {
        const updatedUser = new User({
          oauthID: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          created: Date.now(),
        });
        updatedUser.save((saveErr) => {
          if (saveErr) {
            console.log(saveErr); // handle errors!
          } else {
            console.log('saving user ...');
            done(null, user);
          }
        });
      }
    });
  })));
};
