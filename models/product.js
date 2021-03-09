const mongoose = require('mongoose');
var conn = mongoose.Collection;
var productSchema = new mongoose.Schema({
    name:String,
    description:String,
    _type:String,
    price:Number,
    stock:Boolean,
    rating:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

var ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;