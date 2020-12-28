
const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');
const express = require('express');
const router = express.Router();


const newsActions = {
    signUp: asyncMiddleware(async (req, res) => {
        let user = new UserModel({...req.body});
        newUser =await user.save();
        console.log(newUser)
       if(newUser){
        res.status(status.success.created).json({
            message: 'User data saved successfully',
            data: newUser,
            token: 'Bearer ' + await jwt.signJwt({ id: user.id }),
            status: 200
        });
        
    }
    else{
        res.status(status.success.created).json({
            message: 'Something went wrong',
            status: 400
        });
    }
    }),
    getNews: asyncMiddleware(async (req, res) => {
        let news = await UserModel.find({});
       if(news){
        res.status(status.success.created).json({
            message: 'News data fetched successfully',
            data: news,
            status: 200
        });
        
    }
    else{
        res.status(status.success.created).json({
            message: 'Something went wrong',
            status: 400
        });
    }
    }),

    
    

};
router.post('/sign-up' , newsActions.signUp)
router.get('/get-news' , newsActions.getNews)
// User

module.exports = router;