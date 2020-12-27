const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    email:String,
    password:String
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;