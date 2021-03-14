
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
            res.status(status.success.accepted).json({
                message: 'Email already exists',
                status: 400
            });
        } else {
            //req.body.name:name
            // req.body.password = await passwordUtils.hashPassword(password);

            var newUser = new UserModel({ ...req.body });
            let savedUser = await newUser.save();
            if (savedUser) {
                let random = Math.floor(100000 + Math.random() * 900000);
                await client.messages
                    .create({
                        to: phone,
                        from: '+12138949103',
                        body: `Your 6 digit verification code is ${random}`,
                    })
                let obj = {
                    code: random,
                    phone: phone
                }
                let newVerification = new VerificationModel({ ...obj });
                await newVerification.save();


                res.status(status.success.created).json({
                    message: 'User added successfully',
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
    login: asyncMiddleware(async (req, res) => {
        let { phone } = req.body;
        let user = await UserModel.findOne({ phone: phone }).select('+password');
        console.log(user)
        if (user) {
            // let verified = await passwordUtils.comparePassword(password, user.password);
            // comparing user password

            // if (verified) {
            let loggedUser = user.toObject();
            delete loggedUser.password;
            res.status(status.success.accepted).json({
                message: 'Logged In Successfully',
                data: loggedUser,
                token: 'Bearer ' + await jwt.signJwt({ id: user.id }),
                status: 200
            });


            // } else {
            //     res.status(status.success.created).json({
            //         message: 'Wrong Password',
            //         status: 400
            //     });
            // }
        } else {
            res.status(status.success.created).json({
                message: 'User not found',
                status: 400
            });
        }
    }),
    updateProfile: asyncMiddleware(async (req, res) => {
        let { id } = req.decoded;
        let user = await UserModel.findById(id);
        if (user) {
            let updatedUser = await UserModel.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
            if (updatedUser) {
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


};
router.post('/', userActions.signUp)
router.post('/login', userActions.login);

router.put('/', userActions.updateProfile);
router.get('/:id', userActions.deleteUser);

// User

module.exports = router;