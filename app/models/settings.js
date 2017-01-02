var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var SettingsSchema = new mongoose.Schema({
    perspectiveString: {
        type: String,
        enum: ['Scroll', 'Split'],
        default: 'Scroll'
    },
    lobbyDisplayString: {
        type: String,
        enum: ['Unknown', 'None', 'FirstPerson', 'ThirdPerson', 'Shoulder', 'FlyCam', 'Static', 'Follow', 'SceneOverview', 'FreeCam', 'FollowPath'],
        default: 'FirstPerson'
    },
});

module.exports = mongoose.model('Settings', SettingsSchema);