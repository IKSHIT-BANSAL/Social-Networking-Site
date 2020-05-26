const User=require('../models/user');
const ForgotPass=require('../models/forgot_pass');
const crypto=require('crypto');
const passMailer=require('../mailers/forgotPass_mailer');

module.exports.forgotPassword=async function(req,res){
    try {
        let user=await User.findOne({email:req.body.email});

        if(user){
            let newPassword=await ForgotPass.create({
                user:user.id,
                accessToken:crypto.randomBytes(20).toString('hex'),
                isValid:true
            });
            newPassword=await newPassword.populate('user').execPopulate();
            passMailer.newPass(newPassword);
            req.flash('success','Mail is sent to this email click on link there to change password')
            newPassword.isValid=true;
            newPassword.save();
        }       

        return res.redirect('back');
    } catch (err) {
        if(err){
            console.log('Error',err);
            req.flash('error','Internal server error')
            return res.redirect('back');
        }
    }

}

module.exports.changePass=async function(req,res){
    try {
        let newPass=await ForgotPass.findOne({accessToken:req.params.accessToken});
        if(newPass.isValid){
            console.log(newPass.accessToken);
            let user=await User.findById(newPass.user);
            newPass=await newPass.populate('user').execPopulate();
            if(!user || req.body.password!=req.body.confirm_password){
                req.flash('success','Invalid Username or passwords do not match')
                return res.redirect('back');        
            }
            newPass.isValid=false;
            newPass.save();
            await User.findOneAndUpdate({email:newPass.user.email},{password:req.body.password});
            
            req.flash('success','Password changed successfully!')
            return res.redirect('/users/sign-in');
        }
 
    }catch (err) {
        console.log('Error',err);
        req.flash('error','Internal server error')
        return res.redirect('back');        
    }
}