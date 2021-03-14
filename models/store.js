const mongoose = require('mongoose');
var conn = mongoose.Collection;
var storeSchema = new mongoose.Schema({
    name:String,
    location:String,
    _type:String,
    rating:Number,
    longitude:Number,
    latitude:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

var StoreModel = mongoose.model('Store', storeSchema);
module.exports = StoreModel;