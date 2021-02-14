
const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const express = require('express');
const router = express.Router();


const userActions = {
    signUp: asyncMiddleware(async (req, res) => {
        let { email, password } = req.body;
        let user = await UserModel.findOne({ email: email });
        if (user) {
            res.status(status.success.accepted).json({
                message: 'Email already exists',
                status: 400
            });
        } else {
            req.body.password = await passwordUtils.hashPassword(password);

            var newUser = new UserModel({ ...req.body });
            let savedUser = await newUser.save();
            if (savedUser) {
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
        let { email,password } = req.body;
        let user = await UserModel.findOne({ email: email }).select('+password');
        console.log(user)
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
// User

module.exports = router;