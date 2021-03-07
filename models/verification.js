const mongoose = require('mongoose');
var conn = mongoose.Collection;
var verificationSchema = new mongoose.Schema({
    code:Number,
    phone:String
});

var userModel = mongoose.model('verification', verificationSchema);
module.exports = userModel;