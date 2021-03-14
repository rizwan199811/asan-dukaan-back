const mongoose = require('mongoose');
var conn = mongoose.Collection;
var categorySchema = new mongoose.Schema({
    category:{
        name:String,
        _type:String,//product or store    
    }
    });

var CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;