const User=require('../models/user');
const fs=require('fs');
const path=require('path');
const password=require('../models/forgot_pass');
const Friends=require('../models/friendship');

module.exports.profile=async function(req,res){         //Lets keeep this same as beforeas there is no nesting level
     // res.end('<h1>User Profile </h1>');
     try {
          let user=await User.findById(req.params.id);
          let userSelected=false;
          let friend1=await Friends.findOne({
               from_user:req.params.id,
               to_user:req.user._id
          });
          let friend2=await Friends.findOne({
               to_user:req.params.id,
               from_user:req.user._id
          });
          console.log('********',friend1,friend2);
          if(friend1 || friend2){
               userSelected=true;
          }

          return res.render('users',{
               title:'Users Controller',
               profile_user:user,
               userSelected:userSelected
          });       

     } catch (err) {
          if(err){
               console.log('Error',err);
               return;
          }
          
     }

}
module.exports.update=async function(req,res){
     // if(req.user.id==req.params.id){
     //      User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
     //           req.flash('success','Updated successfully!!');
     //           return res.redirect('back');
     //      });
     // }else{
     //      req.flash('error','You are not access to this');
     //      return res.status(401).send('Unauthorized');
     // }

     if(req.user.id==req.params.id){
          try {
               
               let user=await User.findById(req.params.id);
               User.uploadedAvatar(req,res,function(err){
                    if(err){
                         console.log('******multer Error',err);
                    }
                    console.log(req.file);
                    user.name=req.body.name;
                    user.email=req.body.email;

                    if(req.file){

                         if(user.avatar){
                              fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                         }

                         //this is saving path of uploaded file into into avatar field in the user
                         user.avatar=User.avatarPath+'/'+req.file.filename
                    }
                    user.save();
                    return res.redirect('back');
               })
          } catch (error) {
               if(err){
                    req.flash('error',err);
                    return res.redirect('back');
               }
          }

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
     console.log(req.body);
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

module.exports.forgotPass=function(req,res){
     return res.render('forgot_pass',{
          title:'Forgot Password'
     })
}

module.exports.change=async function(req,res){
     let pass=await password.findOne({accessToken:req.params.id})
     let user=await User.findById(pass.user);
     return res.render('changePassword',{
          title:'Hey change your password here',
          password:pass,
          user:user
     })
}