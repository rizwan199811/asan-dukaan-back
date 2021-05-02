
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
const stripe = require('stripe')('sk_test_51ImfKGC40WRuCQ9azZqAP9XnDYgYa7wMGFM6TOgPyvFG3ZZxHlwOIKZumJlU67ZW4LxrjKcCETj8lAR4LhArgBbz003jiDdti6');
const SubscriptionModel = require('../models/subscription');
require('dotenv').config()
const router = express.Router();
const getExpiryDate = () => {
    var d = new Date(Date.now());
    d.setMonth(d.getMonth() + 9);
    return d.toLocaleDateString();
}
const orderActions = {
    placeOrder: asyncMiddleware(async (req, res) => {
        let { id: userID } = req.decoded;
        let { paymentMethod, cart } = req.body;
        let user = await UserModel.findById({ _id: userID });
        let findCart =await CartModel.findById({_id:cart})
        if (user.role === 'user'&&findCart) {
            if (paymentMethod === "cash") {
                var newOrder = new OrderModel({ ...req.body });
                let savedOrder = await newOrder.save();
                res.status(status.success.accepted).json({
                    message: 'Order placed successfully',
                    data: savedOrder,
                    status: 200
                });
            } else {
                let { stripeToken } = req.body;
                stripe.charges.create({
                    amount: findCart.finalAmount,
                    currency: 'usd',
                    source: stripeToken,
                    capture: false,  // note that capture: false
                })
                    .then(async (charge) => {
                        let charged = await stripe.charges.capture(charge.id)
                        console.log(charged)
                        let newSubscription = new SubscriptionModel({
                            paymentType: paymentMethod,
                            expire_at: getExpiryDate(),
                            stripeId: charged.id
                        });
                        let savedSubscription = await newSubscription.save();
                        // console.log(charge)
                        await UserModel.findOneAndUpdate({ _id: req.decoded.id }, { subscription: savedSubscription._id }, { new: true })
                        res.status(status.success.created).json({
                            message: 'Payment through card done successfully',
                            status: 'success'
                        });
                        // If no error occurs 
                    })
                    .catch((err) => {
                        res.send(err)       // If some error occurs 
                    });
            }
        } 
    }),


};
router.post('/',jwt.verifyJwt, orderActions.placeOrder);





module.exports = router;