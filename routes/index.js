const express=require('express');
const router=express.Router();

const homeController=require('../controllers/home_controller');
// console.log('Routes is running');

router.get('/',homeController.home);
router.use('/users',require('./users.js'));
router.use('/postUsers',require('./posts.js'));

router.use('/posts',require('./post'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
router.use('/friendship',require('./friendship'));

router.use('/api',require('./api'));


module.exports=router;