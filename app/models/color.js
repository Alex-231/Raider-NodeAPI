var mongoose = require('mongoose');

var ColorSchema = new mongoose.Schema({
    r: {
        type: Number,
        default: 0,
        required: true
    },
    g: {
        type: Number,
        default: 0,
        required: true
    },
    b: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Color', ColorSchema);