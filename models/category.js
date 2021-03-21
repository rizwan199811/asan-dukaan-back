const mongoose = require('mongoose');
var conn = mongoose.Collection;
var categorySchema = new mongoose.Schema({

    name: String,
    _type: String,//product or store    
});

var CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;