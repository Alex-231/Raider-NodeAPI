var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ColorSchema = require('./color');

var EmblemSchema = new mongoose.Schema({
    layer2Color: {
        type: ColorSchema.Schema,
        required: true,
    },
    layer1Color: {
        type: ColorSchema,
        required: true,
    },
    layer0Color: {
        type: ColorSchema,
        required: true,
    },
    layer2: {
        type: Number,
        required: true,
    },
    layer1: {
        type: Number,
        required: true,
    },
    layer0: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model('Emblem', EmblemSchema);