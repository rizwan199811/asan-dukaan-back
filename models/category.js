const mongoose = require('mongoose');
var conn = mongoose.Collection;
var categorySchema = new mongoose.Schema({
    name:String
});

var CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;