
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
const productActions = {

    addProduct: asyncMiddleware(async (req, res) => {
        let { id: userId } = req.decoded;
        let user = await UserModel.findById({ _id: userId });
        if (user) {
            req.body = {
                ...req.body,
                user: userId
            }
            var newProduct = new ProductModel({ ...req.body });
            let savedProduct = await newProduct.save();
            if (savedProduct) {
                res.status(status.success.created).json({
                    message: 'Product added successfully',
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
                message: 'User not found',
                status: 400
            });
        }
    }),
    getAllProducts: asyncMiddleware(async (req, res) => {
        let products = await ProductModel.find({}).populate('store').populate('category');
        if (products.length > 0) {
            res.status(status.success.accepted).json({
                message: 'Products fetched successfully',
                data: products,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Products not found',
                status: 400
            });
        }
    }),
    getProduct: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let product = await ProductModel.findById(id).populate('store').populate('category');
        if (product.length > 0) {
            res.status(status.success.accepted).json({
                message: 'Product fetched successfully',
                data: product,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Products not found',
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
router.post('/', productActions.addProduct);



module.exports = router;