// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    name: String, //Primary Key(?)
    password: String, 
    admin: Boolean //Not really necessary at the moment but doesn't matter.
}));