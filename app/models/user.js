var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var CharacterSchema = require('./character');
var SettingsSchema = require('./settings');
var Clan = require('./clan');

var UserSchema = new mongoose.Schema({
    oauthID: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 16
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
    clan_id: {
        type: mongoose.Schema.ObjectId,
        auto: false,
        required: false
    },
    clanInvite_ids: {
        type: [mongoose.Schema.ObjectId],
        required: false,
    },
    clanRequest_ids: {
        type: [mongoose.Schema.ObjectId],
        required: false,
    },
    characters: {
        type: [mongoose.model('Character').schema],
        required: false
    },
    userSettings: {
        type: [mongoose.model('Settings').schema],
        required: false
    }
});

UserSchema.pre('validate', function(next) {

    //Check that no unlinked clan requests are present.
    if(this.clanRequest_ids.length > 1)
    {
        this.clanRequest_ids.forEach(function(clanRequest_id) {

            Clan.findById(id, function(err, foundClan) {
                if (foundClan && !(foundClan.requestedUser_ids.indexOf(this._id) > -1)) { //If there's a clan, store it.
                    this.clanRequest_ids.splice(this.clanRequest_ids.indexOf(clanRequest_id, 1));
                }
            });

        }, this);
    }
    if(this.clanInvite_ids.length > 1)
    {
        this.clanInvite_ids.forEach(function(clanInvite_id) {

            Clan.findById(id, function(err, foundClan) {
                if (foundClan && !(foundClan.invitedUser_ids.indexOf(this._id) > -1)) { //If there's a clan, store it.
                    this.clanInvite_ids.splice(this.clanInvite_ids.indexOf(clanInvite_id, 1));
                }
            });

        }, this);
    }

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