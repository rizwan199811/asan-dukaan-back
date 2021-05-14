
const UserModel = require('../models/user');
const StoreModel = require('../models/store');
const CategoryModel = require('../models/category');

const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const jwt = require('../utils/jwt');
const express = require('express');
const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const ProductModel = require('../models/product');

const SubscriptionModel = require('../models/subscription');

require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
var accountSid = process.env.ACCOUNTSID;
var authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
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
const storeActions = {

    addStore: asyncMiddleware(async (req, res) => {   
        let { id: userId } = req.decoded;
        let { _type } = req.body;
        console.log(userId);
        console.log("Total Body",req.body);
        // console.log(req.body['data']);
        console.log("Actual Body",req.body.data);
        // console.log(req.body[0].data);
        // console.log(req.body[1].file);
        console.log("files",req.file);

        let user = await UserModel.findById({ _id: userId });
        if (user) {
        let file = req.file ? req.file.path : 'https://res.cloudinary.com/dxtpcpwwf/image/upload/v1620575539/Asaan-Dukaan/download_rp6avh.png';
        let body = req.body[0].data ? JSON.parse(req.body.data) : '';
            body = {
                ...body,
                image:file,
                user: userId
            }
            var newStore = new StoreModel({ ...body });
            let savedStore = await newStore.save();
            if (savedStore) {
                await UserModel.findByIdAndUpdate({ _id: userId }, { role: "shop_owner" }, { new: true });
                let allStores = await StoreModel.find({}).populate('user').populate('category');
                res.status(status.success.created).json({
                    message: 'Store added successfully',
                    data: allStores,
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
    getNearbyStores: asyncMiddleware(async (req, res) => {
        let { longitude, latitude } = req.body;
        console.log(req.body);
        let storesGreater = await StoreModel.find({
            $and: [{ longitude: { $gte: longitude } },
            { latitude: { $gte: latitude } }]
        }
        ).populate('category');
        console.log(storesGreater)
        storesGreater = storesGreater.slice(0, 5);
        let storesLesser = await StoreModel.find({
            $and: [{ longitude: { $lt: longitude } },
            { latitude: { $lt: latitude } }]
        }).populate('category');
        storesLesser = storesLesser.slice(0, 5);
        let stores = storesGreater.concat(storesLesser);
        if (stores.length > 0) {
            res.status(status.success.accepted).json({
                message: 'Stores fetched successfully',
                data: stores,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Stores not found',
                status: 400
            });
        }
    }),
    updateProfile: asyncMiddleware(async (req, res) => {
        let { id } = req.decoded;
        let store = await storeModel.findById(id);
        if (store) {
            let updatedstore = await storeModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
            if (updatedstore) {
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
                message: 'store not found',
                status: 400
            });
        }
    }),
    getStoreDetails: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let store = await StoreModel.findById(id).populate('category');
        if (store) {
            res.status(status.success.created).json({
                message: 'Store fetched successfully',
                data: store,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'Store not found',
                status: 400
            });
        }
    }),
    deleteStore: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let store = await storeModel.findByIdAndDelete(id);
        if (store) {
            if (store.role === "shop_owner") {
                let deletedStore = await StoreModel.findOneAndDelete({ store: store._id });
                let orders = await OrderModel.find({ store: deletedStore._id });
                for (let i = 0; i < orders.length; i++) {
                    await OrderModel.findByIdAndDelete({ _id: orders[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'store deleted successfully',
                    status: 200
                });
            }
            if (store.role === "store") {
                await SubscriptionModel.findByIdAndDelete({ _id: store.subscription });
                let carts = await CartModel.find({ store: store._id });
                for (let i = 0; i < carts.length; i++) {
                    await CartModel.findByIdAndDelete({ _id: carts[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'Store deleted successfully',
                    status: 200
                });
            }


        } else {
            res.status(status.success.created).json({
                message: 'store not found',
                status: 400
            });
        }
    }),


};
router.post('/', jwt.verifyJwt,parser.single('file'), storeActions.addStore)

router.get('/:id', storeActions.getStoreDetails);

router.put('/', storeActions.updateProfile);
router.post('/nearby', storeActions.getNearbyStores);



module.exports = router;