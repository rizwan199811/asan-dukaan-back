const mongoose = require('mongoose');
var conn = mongoose.Collection;
const Double = require('@mongoosejs/double');
var storeSchema = new mongoose.Schema({
    name:String,
    _type:String,//Service,Store,Shop,Stall
    rating:{
      type:Number,
      default:0
    },
    longitude: Double,
    latitude: Double,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

});

var StoreModel = mongoose.model('Store', storeSchema);
module.exports = StoreModel;