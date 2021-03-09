const mongoose = require('mongoose');
var conn = mongoose.Collection;
var storeSchema = new mongoose.Schema({
    name:String,
    location:String,
    _type:String,
    rating:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var StoreModel = mongoose.model('Store', storeSchema);
module.exports = StoreModel;