const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');

let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',      //for port 587
    port:587,
    secure:false,
    auth:{              //from user mails are sent to other
        user:'ikshitbansal1998@gmail.com',
        pass:'ikshit1998'
    }
});

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