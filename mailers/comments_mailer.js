//all comment related mails will be put here

const nodeMailer=require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment=(comment)=>{                   //we can also write like only //module.exports.newComment=function(){}                                                  
    console.log('inside newComment mailer',comment);
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({               //sendMail is an inbuilt function
        from:'ikshitbansal1998@gmail.com',
        to:comment.user.email,
        subject:'New Comment published!!',
        html:htmlString
        // html:'<h1> Yupp your comment is now published! </h1>'
    },(err,info)=> {                                 //info carries about information that is sent
        if(err){
            console.log('Error in sending mail');
            return;
        }
        console.log('Message sent',info);
        return;
    })                              
}
