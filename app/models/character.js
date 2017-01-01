var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var EmblemSchema = require('./emblem');
var ColorSchema = require('./color');

var CharacterSchema = new mongoose.Schema({
    emblem: {
        type: EmblemSchema,
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
        type: ColorSchema,
        required: true
    },
    armourSecondaryColor: {
        type: ColorSchema,
        required: true
    },
    armourTertiaryColor: {
        type: ColorSchema,
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