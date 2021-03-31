var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var errorLogSchema = new Schema({
    message: String,
    timeStamp: String,
    apiPath: String,
    apiMethod: String,
    apiHost: String
}, { versionKey: false, capped: { max: 1000 }, timestamps: true });

var ErrlogModel = mongoose.model('ErrorLog', errorLogSchema);
module.exports = ErrlogModel