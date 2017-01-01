var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Float = require('mongoose-float').loadType(mongoose);

var ColorSchema = new mongoose.Schema({
    r: {
        type: Float,
        default: 0,
        required: true
    },
    g: {
        type: Float,
        default: 0,
        required: true
    },
    b: {
        type: Float,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Color', ColorSchema);