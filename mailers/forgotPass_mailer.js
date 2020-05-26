const nodemailer=require('../config/nodemailer');

module.exports.newPass=function(password){
    console.log('Inside New Password mailer',password);
    let htmlString=nodemailer.renderTemplate({password:password},'/updatePassword/new_pass.ejs')
    nodemailer.transporter.sendMail({
        from:'ikshitbansal1998@gmail.com',
        to:password.user.email,
        subject:'Want to change your password',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending email');
            return;
        }
        console.log('Messege sent',info);
        return;
    })
}