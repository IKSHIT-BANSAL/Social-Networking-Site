const User=require('../models/user');

module.exports.profile=function(req,res){
     // res.end('<h1>User Profile </h1>');

     return res.render('users',{
          title:'Users Controller',
     });
}
//Render Sign Up page
module.exports.signUp=function(req,res){
     return res.render('user_sign_up',{
          title:"Codeial SignUp"
     })
}

//Render Sign In page
module.exports.signIn=function(req,res){
     return res.render('user_sign_in',{
          title:"Codeial SignIn"
     });
};

//get the sign up data
module.exports.create=function(req,res){
     if(req.body.password!=req.body.confirm_password){
          return res.redirect('back');
     }
     User.findOne({email : req.body.email},function(err,user){
          if(err){
               console.log('Error in finding user in signing up');
               return;
          }
          if(!user){
               User.create(req.body,function(err,user){
                    if(err){
                         console.log('Error in creating user while signing up');
                         return;
                    }                    
                    return res.redirect('/users/sign-in');
               })
          }else{
               return res.redirect('back');
          }
     });
}

//get the sign in data
module.exports.createSession=function(req,res){
     //Todo later
}