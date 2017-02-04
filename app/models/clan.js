var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user');

var ClanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    creator_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: true
    },
    open: {
        type: Boolean,
        required: true,
        default: false,
    },
    requestedUser_ids: {
        type: [mongoose.Schema.ObjectId],
        required: false,
    },
    invitedUser_ids: {
        type: [mongoose.Schema.ObjectId],
        required: false,
    }
});

ClanSchema.pre('validate', function(next) {

    //Check that no unlinked clan requests are present.
    if(this.requestedUser_ids.length > 1)
    {
        this.requestedUser_ids.forEach(function(requestedUser_id) {

            User.findById(id, function(err, foundUser) {
                if (foundUser && !(foundUser.clanRequest_ids.indexOf(this._id) > -1)) { //If there's a clan, store it.
                    this.requestedUser_ids.splice(this.requestedUser_ids.indexOf(requestedUser_id, 1));
                }
            });

        }, this);
    }
    if(this.invitedUser_ids.length > 1)
    {
        this.invitedUser_ids.forEach(function(invitedUser_id) {

            User.findById(id, function(err, foundUser) {
                if (foundUser && !(foundUser.clanInvite_ids.indexOf(this._id) > -1)) { //If there's a clan, store it.
                    this.requestedUser_ids.splice(this.requestedUser_ids.indexOf(invitedUser_id, 1));
                }
            });

        }, this);
    }

    return next();
});

module.exports = mongoose.model('Clan', ClanSchema);