const express = require('express')
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');


router.use('/user', userRoutes);
router.use('/store', storeRoutes);


module.exports=router