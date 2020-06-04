const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');

//tell passport to use a new startegy for google login
passport.use(new googleStrategy({
    clientID:env.google_client_ID,
    clientSecret:env.google_clientSecret,
    callbackURL:env.google_callbackURL
    
    //accesstoken is like jwt token we genrated
    //refreshtoken if our accesstoken expires then we use it to get a new token
    //profile is information of user
},function(accessToken,refreshToken,profile,done){
    //find a user 
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){      
        //profile.email[] is array so we fetch its 1 value
        if(err){
            console.log('error in google strategy passport',err);
            return;
        }
        console.log(accessToken,refreshToken);
        console.log(profile);

        if(user){
            //if found set this user as req.user
            return done(null,user);
        }else{
            //if not found create user and set it as req.user(sign-in)
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')   
                //this how crypto works fetching 20 bytes and string in hexadecimal
            },function(err,user){
                if(err){
                    console.log('error in creating user google strategy passport',err);   
                    return;
                }
                return done(null,user);
            })
        }
        
    })
}));

module.exports=passport;