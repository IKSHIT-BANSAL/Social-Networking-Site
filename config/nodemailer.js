const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');

let transporter=nodemailer.createTransport(env.smtp);

let renderTemplate=(data,relativePath) => {
    let mailHTML;           //variable use to store HTML mails to be sent
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),   //relative path is path from where this function is called
        data,       //context to be filled like name
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}