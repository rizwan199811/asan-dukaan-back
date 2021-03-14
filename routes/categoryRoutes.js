
const UserModel = require('../models/user');
const StoreModel = require('../models/store');

const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const jwt = require('../utils/jwt');
const express = require('express');
const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const ProductModel = require('../models/product');
const CategoryModel = require('../models/category');

const SubscriptionModel = require('../models/subscription');

require('dotenv').config()
const router = express.Router();
const categoryActions = {

    getAllCategories: asyncMiddleware(async (req, res) => {
        let { type } = req.params;
        let categories = await CategoryModel.find({ _type: type })
        if (categories.length > 0) {
            res.status(status.success.accepted).json({
                message: 'Categories fetched successfully',
                data: categories,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Categories not found',
                status: 400
            });
        }
    }),


};
router.get('/:type', categoryActions.getAllCategories);



module.exports = router;