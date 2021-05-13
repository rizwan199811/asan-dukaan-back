const mongoose = require('mongoose');
var conn = mongoose.Collection;
var userProfileSchema = new mongoose.Schema({
    email: String,
    name: String,
    phone: String,
    location: String,
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616176827/Asaan-Dukaan/default-avatar-profile-icon-vector-18942381_hytaov.jpg'
    },
    role: {
        type: String,
        default: "user"
    }
    ,//user or shop_owner or service_provider
    password: {
        type: String,
        select: false
    },
    codeGenerated: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    }
});

var UserModel = mongoose.model('User', userProfileSchema);
module.exports = UserModel;