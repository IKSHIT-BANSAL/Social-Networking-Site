const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;    //To extract header from JWT

const User=require('../models/user');

let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken,      //fetching a bearer key in header
    secretOrKey:'codeial'       //a token will be generated using this key
}

passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id,function(err,user){
        if(err){
            console.log('Error in finding user in jwt');
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    })
}))

module.exports=passport;