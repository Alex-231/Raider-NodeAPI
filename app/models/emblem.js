var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ColorSchema = require('./color');

var EmblemSchema = new mongoose.Schema({
    layer2Color: {
        type: mongoose.model('Color').schema,
        required: true,
    },
    layer1Color: {
        type: mongoose.model('Color').schema,
        required: true,
    },
    layer0Color: {
        type: mongoose.model('Color').schema,
        required: true,
    },
    layer2: {
        type: Boolean,
        required: true,
    },
    layer1: {
        type: Number,
        required: true,
    },
    layer0: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Emblem', EmblemSchema);