const mongoose = require('mongoose');
var conn = mongoose.Collection;
var orderSchema = new mongoose.Schema({
    address:String,
    paymentMethod:String,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

var OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;