const express=require('express');
const router=express.Router();

const homeController=require('../controllers/home_controller');
// console.log('Routes is running');

router.get('/',homeController.home);
router.use('/users',require('./users.js'));
router.use('/postUsers',require('./posts.js'));

router.use('/posts',require('./post'));

module.exports=router;