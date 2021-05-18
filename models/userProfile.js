const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userProfileSchema = new mongoose.Schema({
    purchased_products:{
        type:Number
    },
    app_visits:Number,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var UserProfileModel = mongoose.model('userProfile', userProfileSchema);
module.exports = UserProfileModel;