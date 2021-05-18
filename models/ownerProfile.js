const mongoose = require('mongoose');
var conn = mongoose.Collection;
var ownerProfileSchema = new mongoose.Schema({
    sold_products:{
        type:Number,
        default:0
    },
    services_completed:{
        type:Number,
        default:0
    },
    inventory_available:[Object],
    app_visits:Number,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var OwnerModel = mongoose.model('ownerProfile', ownerProfileSchema);
module.exports = OwnerModel;