const mongoose = require('mongoose');
var conn = mongoose.Collection;
var cartSchema = new mongoose.Schema({
    finalAmount:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

var CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;