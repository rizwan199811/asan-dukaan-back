const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    phone:String,
    password:{
        type:String,
        select:false
    }
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;