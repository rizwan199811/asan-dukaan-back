
const UserModel = require('../models/user');
const VerificationModel = require('../models/verification');
const StoreModel = require('../models/store');

const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const express = require('express');
const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const ProductModel = require('../models/product');
const SubscriptionModel = require('../models/subscription');

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
require('dotenv').config()
const router = express.Router();
var accountSid = process.env.ACCOUNTSID;
var authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const userActions = {
    signUp: asyncMiddleware(async (req, res) => {
        let { phone } = req.body;
        let user = await UserModel.findOne({ phone: phone });
        if (user) {
            if (user.codeGenerated === true) {
                res.status(status.success.created).json({
                    message: 'User logged in successfully',
                    token: 'Bearer ' + await jwt.signJwt({ id: user._id }),
                    data: user,
                    status: 200
                });
            }
            else {
                res.status(status.success.created).json({
                    message: 'User is unauthorized',
                    status: 400
                });
            }
        } else {
            console.log(req.body);
            var newUser = new UserModel({ ...req.body });
            let savedUser = await newUser.save();
            if (savedUser) {
                let random = Math.floor(100000 + Math.random() * 900000);
                await client.messages
                    .create({
                        to: phone,
                        from: '+15005550006',
                        body: `Your 6 digit verification code is ${random}`,
                    })
                let obj = {
                    code: random,
                    user: savedUser._id
                }
                let newVerification = new VerificationModel({ ...obj });
                await newVerification.save();
                await UserModel.findByIdAndUpdate(savedUser._id, { codeGenerated: true }, { new: true });
                res.status(status.success.created).json({
                    message: 'User added successfully',
                    token: 'Bearer ' + await jwt.signJwt({ id: savedUser._id }),
                    data: savedUser,
                    status: 200
                });
            }
            else {
                res.status(status.success.created).json({
                    message: 'Something went wrong',
                    status: 200
                });
            }

        }
    }),
    updateProfile: asyncMiddleware(async (req, res) => {
        let { id } = req.decoded;
        // console.log(req.decoded)
        let file = req.file ? req.file : '';
        let body = JSON.parse(req.body.data)
        // console.log(body.password);
        console.log(file);
        let user = await UserModel.findById(id);
        if (user) {
            if (body.name) {
                body = {
                    ...body
                }
            }
            if (file !== '') {
                body = {
                    ...body,
                    image: file.path,
                   
                }
            }
            if (body.password) {
                let password = await passwordUtils.hashPassword(body.password);
                body.password = password;
            }

            let updatedUser = await UserModel.findByIdAndUpdate({ _id: id }, { ...body }, { new: true });
            if (updatedUser) {
                res.status(status.success.accepted).json({
                    message: 'User updated successfully',
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
    getUser: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let user = await UserModel.findById(id)
        if (user) {
            res.status(status.success.created).json({
                message: 'User fetched successfully',
                data: user,
                status: 200
            });
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),

    deleteUser: asyncMiddleware(async (req, res) => {
        let { id } = req.params;
        let user = await UserModel.findByIdAndDelete(id);
        if (user) {
            if (user.role === "shop_owner") {
                let deletedStore = await StoreModel.findOneAndDelete({ user: user._id });
                let orders = await OrderModel.find({ store: deletedStore._id });
                for (let i = 0; i < orders.length; i++) {
                    await OrderModel.findByIdAndDelete({ _id: orders[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'User deleted successfully',
                    status: 200
                });
            }
            if (user.role === "user") {
                await SubscriptionModel.findByIdAndDelete({ _id: user.subscription });
                let carts = await CartModel.find({ user: user._id });
                for (let i = 0; i < carts.length; i++) {
                    await CartModel.findByIdAndDelete({ _id: carts[i]._id })
                }
                res.status(status.success.created).json({
                    message: 'User deleted successfully',
                    status: 200
                });
            }


        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    codeVerification: asyncMiddleware(async (req, res) => {
        let { code } = req.body;
        let { id: userId } = req.decoded;
        let verify = await VerificationModel.findOne({ user: userId });
        if (verify) {
            if (verify.code === code) {
                await VerificationModel.findByIdAndDelete(verify._id);
                res.status(status.success.created).json({
                    message: 'Code verified successfully',
                    token: 'Bearer ' + await jwt.signJwt({ id: userId }),
                    status: 200
                });

            } else {
                res.status(status.success.created).json({
                    message: 'Code not matched',
                    status: 400
                });
            }
        }
        else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    resendCode: asyncMiddleware(async (req, res) => {
        let { id: userId } = req.decoded;
        let verify = await VerificationModel.findOne({ user: userId });
        if (verify) {
            let user = await UserModel.findById(userId);
            let random = Math.floor(100000 + Math.random() * 900000);
            await client.messages
                .create({
                    to: user.phone,
                    from: '+12138949103',
                    body: `Your 6 digit verification code is ${random}`,
                })
            let obj = {
                code: random
            }
            await VerificationModel.findByIdAndUpdate(verify._id, { ...obj }, { new: true });
            res.status(status.success.created).json({
                message: 'Code re-send successfully',
                status: 200
            });


        }
        else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),

};
router.post('/', userActions.signUp)
router.post('/profile', jwt.verifyJwt, parser.single('file'), userActions.updateProfile);
router.get('/', jwt.verifyJwt, userActions.resendCode);
router.delete('/:id', userActions.deleteUser);
router.post('/verify', jwt.verifyJwt, userActions.codeVerification);

// User

module.exports = router;