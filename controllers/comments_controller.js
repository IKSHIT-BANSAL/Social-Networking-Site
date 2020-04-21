const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },function(err,comment){
                if(err){
                    console.log('Error in adding comment');
                    return;
                }
                post.comments.push(comment);    //Update of comments in array present 
                post.save();        //To be saved in the database
                return res.redirect('back');
            });
        }
    });

}