var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var EmblemSchema = require('./emblem');
var ColorSchema = require('./color').ColorSchema;

var CharacterSchema = new mongoose.Schema({
    emblem: {
        type: mongoose.model('Emblem').schema,
        required: true
    },
    race: {
        type: String,
        enum: ['X', 'Y'],
        default: 'X',
        required: true,
    },
    guild: {
        type: String,
        required: true
    },
    armourPrimaryColor: {
        type: mongoose.model('Color').schema,
        required: true
    },
    armourSecondaryColor: {
        type: mongoose.model('Color').schema,
        required: true
    },
    armourTertiaryColor: {
        type: mongoose.model('Color').schema,
        required: true
    },
    shoulderArmour: {
        type: String,
        enum: ['X', 'Y'],
        default: 'X',
        required: true,
    },
    helmetArmour: {
        type: String,
        enum: ['X', 'Y'],
        default: 'X',
        required: true,
    },
    chestArmour: {
        type: String,
        enum: ['X', 'Y'],
        default: 'X',
        required: true,
    },
    level: {
        type: Number,
        default: 0,
        required: true
    },
    exp: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Character', CharacterSchema);