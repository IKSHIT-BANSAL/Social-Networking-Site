const express=require('express');
const router=express.Router();
const passport=require('passport');

const userController=require('../controllers/users_controller');
const forgotPass=require('../controllers/forgot_pass');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);

router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);

router.get('/forgotPassword',userController.forgotPass);
router.get('/changePassword/:id',userController.change);

router.post('/newPassword',forgotPass.forgotPassword);
router.post('/changePassword/:accessToken',forgotPass.changePass);

router.post('/create',userController.create);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),userController.createSession)

router.get('/sign-out',userController.destroySession);

//request we r passing to the google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']})); 
//scope is info we r trying to fetch as email is not part of profile

//request we r getting back from google database
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);



module.exports=router;