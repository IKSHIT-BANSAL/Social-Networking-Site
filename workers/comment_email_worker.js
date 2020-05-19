const queue=require('../config/kue');
const commentsMailer=require('../mailers/comments_mailer');      //as we to mail required people who commented

//process function tells every worker to add task to this queue whenever a new task enters
queue.process('emails',function(job,done){      //emails is name of queue as 1st argument here
    console.log('emails worker is processing a job',job.data);
    commentsMailer.newComment(job.data);
    done();
})