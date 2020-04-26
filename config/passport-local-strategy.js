const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');


//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},function(req,email,password,done){
    //find user and establesh identity
    User.findOne({email:email},function(err,user){
        if(err){
            // console.log('Error in finding user --> Passport');
            req.flash('error',err);
            return done(err);
        }
        if(!user || user.password!=password){
            // console.log('Invalid Username /password');
            req.flash('error','Invalid username/password')
            return done(null,false);
        }
        return done(null,user);
    })
}))

//Serializing the user to decide which user to kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
})

//deserializing the user from key in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user');
            return done(err);
        }
        return done(null,user);
    })
});

//check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if user is sign in then pass on req to the next function which is my controller action
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
    //req.user contains current signed in user from sign in cookies and we just sending it for locals for the views
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;