
const UserModel = require('../models/user');
const VerificationModel = require('../models/verification');

const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const express = require('express');
const router = express.Router();
var accountSid = 'ACe31308e7e2555c536776794faec19cec'; // Your Account SID from www.twilio.com/console
var authToken = 'e6020870dd1fcc6adb280d969f3e7267';
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

    allUsers: asyncMiddleware(async (req, res) => {
        let user = await UserModel.find({})
        if (user) {
            let verified = await passwordUtils.comparePassword(password, user.password);
            // comparing user password

            if (verified) {
                let loggedUser = user.toObject();
                delete loggedUser.password;
                res.status(status.success.accepted).json({
                    message: 'Logged In Successfully',
                    data: loggedUser,
                    token: 'Bearer ' + await jwt.signJwt({ id: user.id }),
                    status: 200
                });


            } else {
                res.status(status.success.created).json({
                    message: 'Wrong Password',
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
router.post('/', userActions.signUp)
router.post('/login', userActions.login);
router.get('/', userActions.allUsers);

// User

module.exports = router;