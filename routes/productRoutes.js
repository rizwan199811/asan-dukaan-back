
const UserModel = require('../models/user');
const StoreModel = require('../models/store');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const jwt = require('../utils/jwt');
const express = require('express');
const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const ProductModel = require('../models/product');
const OwnerProfileModel = require('../models/ownerProfile');

const CategoryModel = require('../models/category');
const SubscriptionModel = require('../models/subscription');
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
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
        let {picture}=req.body;
        console.log(req.body)
        let user = await UserModel.findById({ _id: userId });
        if (user) {
            let store = await StoreModel.findById({ _id: storeId });
            if (store) {
                console.log(store._type);
                if (store._type === 'Service') {
                    let obj={
                        services_completed:0 
                    }
                    let file = picture ? req.body.picture : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body ? req.body : '';
                    body = {
                        ...body,
                        _type:'service',
                        user: userId,
                        picture: file,
                        store: store._id
                    }

                    var newService = new ProductModel({ ...body });
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
                    let file = picture ? req.body.picture : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body ? req.body : '';
                    body = {
                        ...body,
                        _type:'product',
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newProduct = new ProductModel({ ...body });
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
                }
                if (store._type === 'Stall') {
                    let file = picture ? req.body.picture : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                    let body = req.body? req.body : '';
                    body = {
                        ...body,
                        _type:'product',
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    var newItem = new ProductModel({ ...body });
                    let savedItem = await newItem.save();
                    if (savedItem) {
                        res.status(status.success.created).json({
                            message: 'Item added successfully',
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
                    let file = picture ? req.body.picture : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1616350246/Asaan-Dukaan/ef1963550bd12b567e853a36ff1c5078_t69db3.png';
                
                    let body = req.body ? req.body : '';
                    body = {
                        ...body,
                        _type:'product',
                        user: userId,
                        picture: file,
                        store: store._id
                    }
                    console.log(body);
                    var newItem = new ProductModel({ ...body });
                    let savedItem = await newItem.save();
                    if (savedItem) {
                        res.status(status.success.created).json({
                            message: 'Item added successfully',
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
        let { type } = req.params;
        let products = await ProductModel.find({ _type: type }).populate('store').populate('category');
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
        if (product) {
            res.status(status.success.accepted).json({
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
    deleteProduct: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let { id: userId } = req.decoded;
        let user = await UserModel.findById({ _id: userId });
        if (user) {
            if (user.isShopOnwer) {
                let deletedproduct = await ProductModel.findOneAndDelete({ product: product._id });
                let orders = await OrderModel.find({ product: deletedproduct._id });
                for (let i = 0; i < orders.length; i++) {
                    await OrderModel.findByIdAndDelete({ _id: orders[i]._id })
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
router.post('/:id', jwt.verifyJwt, productActions.addProduct);
router.get('/all/:type', productActions.getAllProducts);
router.get('/single/:id', productActions.getProduct);




module.exports = router;