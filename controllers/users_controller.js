const User=require('../models/user');

module.exports.profile=function(req,res){         //Lets keeep this same as beforeas there is no nesting level
     // res.end('<h1>User Profile </h1>');

     User.findById(req.params.id,function(err,user){
          return res.render('users',{
               title:'Users Controller',
               profile_user:user
          });
     })


}
module.exports.update=function(req,res){
     if(req.user.id==req.params.id){
          User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
               req.flash('success','Updated successfully!!');
               return res.redirect('back');
          });
     }else{
          req.flash('error','You are not access to this');
          return res.status(401).send('Unauthorized');
     }
}

//Render Sign Up page
module.exports.signUp=function(req,res){
     if(req.isAuthenticated()){
         return res.redirect('/users/profile');
     }

     return res.render('user_sign_up',{
          title:"Codeial SignUp"
     })
}

//Render Sign In page
module.exports.signIn=function(req,res){
     if(req.isAuthenticated()){
         return res.redirect('/users/profile');
     }

     return res.render('user_sign_in',{
          title:"Codeial SignIn"
     });
};

//get the sign up data
module.exports.create=function(req,res){
     if(req.body.password!=req.body.confirm_password){
          req.flash('success','Passwords did not match');
          return res.redirect('back');
     }
     User.findOne({email : req.body.email},function(err,user){
          if(err){
                req.flash('error','User not found');
               // console.log('Error in finding user in signing up');
               return;
          }
          if(!user){
               User.create(req.body,function(err,user){
                    if(err){
                         // console.log('Error in creating user while signing up');
                         req.flash('error','err');
                         return;
                    }                    
                    req.flash('success','User created successfully');
                    return res.redirect('/users/sign-in');                    
               })
          }else{
               req.flash('success','User already present');
               return res.redirect('back');
          }
     });
}

//sign in and create a session for the user
module.exports.createSession=function(req,res){
     req.flash('success','Logged in Successfully');
     return res.redirect('/');
}

module.exports.destroySession=function(req,res){
     req.logout();
     req.flash('success','You have Logged out');     
     return res.redirect('/');
}