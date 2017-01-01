var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var CharacterSchema = require('./character');

var UserSchema = new mongoose.Schema({
    oauthID: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['Player', 'Admin', 'Webmaster'],
        default: 'Player'
    },
    created: {
        type: Date,
        required: true
    },
    characters: {
        type: [CharacterSchema],
        required: false
    }
});

UserSchema.pre('validate', function(next) {
    //A password or oauth id must be present.
    if (!this.password && !this.oauthID) {
        return next(Error('Cant create a user without oauth or a password!'));
    }

    //If there's no profile create date, add one now.
    if (!this.created) {
        this.created = Date.now();
    }

    return next();
});

//Hash password.
UserSchema.pre('save', function(next) {
    var user = this;

    //If there's a password...
    if (this.password) {
        if (this.isModified('password') || this.isNew) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.password, salt, null, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    } else {
        return next();
    }
});

//Compare password.
UserSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);