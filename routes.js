const express = require('express')
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


router.use('/user', userRoutes);
router.use('/store', storeRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);
router.use('/category', categoryRoutes);


module.exports=router