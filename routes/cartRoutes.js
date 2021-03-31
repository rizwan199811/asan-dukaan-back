
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
const cartActions = {
    getCart: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let cart = await cartModel.findById(id)
        if (cart) {
            res.status(status.success.accepted).json({
                message: 'cart fetched successfully',
                data: cart,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'cart not found',
                status: 400
            });
        }
    }),
    addToCart: asyncMiddleware(async (req, res) => {
        // let { phone } = req.body;
        let { id: userID } = req.params;
        let { storeID, productID } = req.body;
        let user = await UserModel.findById({ _id: userID });
        if (user.role === 'user') {
            let store = await StoreModel.findById({ _id: storeID });
            if (store) {
                let products = await ProductModel.find({ $and: [{ _id: { $in: productID } }, { store: storeID }] })
                req.body = {
                    ...req.body,
                    user: userId,
                    product: products
                }
                var newCart = new CartModel({ ...req.body });
                let savedCart = await newCart.save();
                if (savedCart) {
                    res.status(status.success.created).json({
                        message: 'Cart created successfully',
                        status: 200
                    });
                }
                else {
                    res.status(status.success.created).json({
                        message: 'Something went wrong',
                        status: 400
                    });
                }

            } else {
                res.status(status.success.created).json({
                    message: 'Shop not found',
                    status: 400
                });
            }
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    removeFromCart: asyncMiddleware(async (req, res) => {
        let { id: userID } = req.params;
        let { storeID, productID } = req.body;
        let user = await UserModel.findById({ _id: userID });
        if (user.role === 'user') {
            let store = await StoreModel.findById({ _id: storeID });
            if (store) {
                let product = await ProductModel.findById({ _id: productID })
                let updatedCart = await CartModel.findOneAndUpdate({ _id: cartID }, { $pull: { products: product._id } }, { new: true })
                if (updatedCart) {
                    res.status(status.success.created).json({
                        message: 'Cart updated successfully',
                        status: 200
                    });
                }
                else {
                    res.status(status.success.created).json({
                        message: 'Something went wrong',
                        status: 400
                    });
                }

            } else {
                res.status(status.success.created).json({
                    message: 'Shop not found',
                    status: 400
                });
            }
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    updateCart: asyncMiddleware(async (req, res) => {
        let { id: userID } = req.params;
        let { storeID, productID } = req.body;
        let user = await UserModel.findById({ _id: userID });
        if (user.role === 'user') {
            let store = await StoreModel.findById({ _id: storeID });
            if (store) {
                let product = await ProductModel.findById({ _id: productID })
                let updatedCart = await CartModel.findOneAndUpdate({ _id: cartID }, { $pull: { products: product._id } }, { new: true })
                if (updatedCart) {
                    res.status(status.success.created).json({
                        message: 'Cart updated successfully',
                        status: 200
                    });
                }
                else {
                    res.status(status.success.created).json({
                        message: 'Something went wrong',
                        status: 400
                    });
                }

            } else {
                res.status(status.success.created).json({
                    message: 'Shop not found',
                    status: 400
                });
            }
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),

};
router.get('/:type', cartActions.getCart);
router.get('/:type', cartActions.addToCart);




module.exports = router;