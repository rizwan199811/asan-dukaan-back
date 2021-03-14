
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
var accountSid = process.env.ACCOUNTSID;
var authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const productActions = {

    addProduct: asyncMiddleware(async (req, res) => {
        // let { phone } = req.body;
        let { id:categoryId } = req.params;
        let { userId } = req.body;
        let user = await CategoryModel.findById({ _id: userId });
        if (user) {
            let product = await productModel.findById({ _id: id });
            if (product) {
                res.status(status.success.accepted).json({
                    message: 'product already exists',
                    status: 400
                });
            } else {
                req.body = {
                    ...req.body,
                    user: userId
                }
                var newproduct = new productModel({ ...req.body });
                let savedproduct = await newproduct.save();
                if (savedproduct) {
                    res.status(status.success.created).json({
                        message: 'product added successfully',
                        status: 200
                    });
                }
                else {
                    res.status(status.success.created).json({
                        message: 'Something went wrong',
                        status: 400
                    });
                }

            }
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    getProducts: asyncMiddleware(async (req, res) => {
        let { longitude, latitude } = req.body;
        let productsGreater = await productModel.find({
            $and: [{ longitude: { $gte: longitude } },
            { latitude: { $gte: latitude } }]
        });
        productsGreater = productsGreater.slice(0, 5);
        let productsLesser = await productModel.find({
            $and: [{ longitude: { $lt: longitude } },
            { latitude: { $lt: latitude } }]
        });
        productsLesser = productsLesser.slice(0, 5);
        let products = productsGreater.concat(productsLesser);
        if (products.length>0) {
            res.status(status.success.accepted).json({
                message: 'products fetched successfully',
                data: products,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'products not found',
                status: 400
            });
        }
    }),
    updateProfile: asyncMiddleware(async (req, res) => {
        let { id } = req.decoded;
        let product = await productModel.findById(id);
        if (product) {
            let updatedproduct = await productModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
            if (updatedproduct) {
                res.status(status.success.accepted).json({
                    message: 'Email already exists',
                    status: 400
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
                message: 'product not found',
                status: 400
            });
        }
    }),
    getproduct: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let product = await ProductModel.findById(id)
        if (product) {
            res.status(status.success.created).json({
                message: 'Product fetched successfully',
                data: product,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Product not found',
                status: 400
            });
        }
    }),
    deleteproduct: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let product = await productModel.findByIdAndDelete(id);
        if (product) {
            if (product.role === "shop_owner") {
                let deletedproduct = await productModel.findOneAndDelete({ product: product._id });
                let orders = await OrderModel.find({ product: deletedproduct._id });
                for (let i = 0; i < orders.length; i++) {
                    await OrderModel.findByIdAndDelete({ _id: orders[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'product deleted successfully',
                    status: 200
                });
            }
            if (product.role === "product") {
                await SubscriptionModel.findByIdAndDelete({ _id: product.subscription });
                let carts = await CartModel.find({ product: product._id });
                for (let i = 0; i < carts.length; i++) {
                    await CartModel.findByIdAndDelete({ _id: carts[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'Product deleted successfully',
                    status: 200
                });
            }


        } else {
            res.status(status.success.created).json({
                message: 'Product not found',
                status: 400
            });
        }
    }),
};
router.post('/', productActions.addProduct)


router.put('/', productActions.updateProfile);



module.exports = router;