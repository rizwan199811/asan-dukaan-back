const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    phone:String,
    location:String,
    role:String,
    password:{
        type:String,
        select:false
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    }
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;