
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
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');

cloudinary.config({
    cloud_name: 'dxtpcpwwf',
    api_key: '679544638251481',
    api_secret: '-wlVUN0JRZfaNDAZHW6dZMiOYRM'
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: 'auto',
        folder: 'Asan-Dukaan',
        format: async (req, file) => file.originalname.substr(file.originalname.lastIndexOf('.') + 1), // supports promises as well
        public_id: (req, file) => Date.now().toString()
    },
});

const parser = multer({
    storage: storage
});
const router = express.Router();
const productActions = {

    addProduct: asyncMiddleware(async (req, res) => {
        let { id: userId } = req.decoded;
        let { id: storeId } = req.params;
        let user = await UserModel.findById({ _id: userId });
        if (user) {
            let store = await StoreModel.findById({ _id: storeId });
            if (store) {
                if (store._type === 'Service') {
                    let file = req.file.path ? req.file.path : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body.data ? JSON.parse(data) : '';
                    body = {
                        ...body,
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newService = new ProductModel({ ...req.body });
                    let savedService = await newService.save();
                    if (savedService) {
                        res.status(status.success.created).json({
                            message: 'Service added successfully',
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
                if (store._type === 'Shop') {
                    let file = req.file.path ? req.file.path : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body.data ? JSON.parse(data) : '';
                    body = {
                        ...body,
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newService = new ProductModel({ ...req.body });
                    let savedService = await newService.save();
                    if (savedService) {
                        res.status(status.success.created).json({
                            message: 'Service added successfully',
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
                if (store._type === 'Stall') {
                    let file = req.file.path ? req.file.path : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body.data ? JSON.parse(data) : '';
                    body = {
                        ...body,
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newService = new ProductModel({ ...req.body });
                    let savedService = await newService.save();
                    if (savedService) {
                        res.status(status.success.created).json({
                            message: 'Service added successfully',
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
                if (store._type === 'Store') {
                    let file = req.file.path ? req.file.path : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body.data ? JSON.parse(data) : '';
                    body = {
                        ...body,
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newService = new ProductModel({ ...req.body });
                    let savedService = await newService.save();
                    if (savedService) {
                        res.status(status.success.created).json({
                            message: 'Service added successfully',
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
               
            } 
        }
        else {
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
router.post('/', jwt.verifyJwt, parser.single('file'), productActions.addProduct);



module.exports = router;