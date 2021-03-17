const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    phone:String,
    location:String,
    role:String,//user or shop_owner or service_provider
    password:{
        type:String,
        select:false
    },
    codeGenerated:{
        type:Boolean,
        default:false
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    }
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;