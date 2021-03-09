const mongoose = require('mongoose');
var conn = mongoose.Collection;
var verificationSchema = new mongoose.Schema({
    code:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

var VerificationModel = mongoose.model('verification', verificationSchema);
module.exports = VerificationModel;