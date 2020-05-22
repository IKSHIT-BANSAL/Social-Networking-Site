const Comment=require('../models/comment');
const Post=require('../models/post');
const commentMailer=require('../mailers/comments_mailer');
const commentEmailWorker=require('../workers/comment_email_worker');
const queue=require('../config/kue');
const Like=require('../models/like');

module.exports.create=async function(req,res){
    try {
        let post =await Post.findById(req.body.post);
        if(post){
            let comment=await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            });
        
            post.comments.push(comment);    //Update of comments in array present 
            post.save();        //To be saved in the database
            comment=await comment.populate('user','name email').execPopulate();
            // commentMailer.newComment(comment);

            //save function to save it in database
            let job=queue.create('emails',comment).save(function(err){      //here creation of queue emails
                if(err){                                             //comment is here which is send in email
                    console.log('Error in creating to queue',err);
                    return;
                }
                console.log('job enqueued',job.id);
            });

            if(req.xhr){
                
                return res.status(200).json({
                    data:{
                        comment:comment,
                        post:post
                    },
                    message:'Comment created!'
                })
            }

            req.flash('success','Comment added successfully!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',err);
        return;
    }
}

module.exports.destroy=async function(req,res){  
    try {

        let comment=await Comment.findById(req.params.id);
        if(comment.user == req.user.id || post.user){

            let postId=comment.post;
            comment.remove();
            
            await Post.findByIdAndUpdate(postId, {$pull :{ comments:req.params.id}});
            
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted !!"
                });
            }

            req.flash('success','Comment deleted successfull!');
            return res.redirect('back');
            }else{
            req.flash('error','you cant delete this comment');
            return res.redirect('back');
        }
    } catch (err) {
    req.flash('error',err);
    return;
    }
}