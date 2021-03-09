const mongoose = require('mongoose');
var conn = mongoose.Collection;
var subscriptionSchema = new mongoose.Schema({
    paymentType:String,
    expireAt:String,
    stripeId:String
});

var SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);
module.exports = SubscriptionModel;