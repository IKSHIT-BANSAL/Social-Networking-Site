const Post=require('../models/post');
const Comment=require('../models/comment');
const Like=require('../models/like');

module.exports.create=async function(req,res){
    try {
        let post =await Post.create({
            content:req.body.content,
            user:req.user._id,
        });

        if(req.xhr){
            post=await post.populate('user').execPopulate();
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created!!"
            })
        }

        req.flash('success','Post published!')
        return res.redirect('back');   

    } catch (err) {
        // console.log('Error',err);
        req.flash('error',err);
        return res.redirect('back');
    }
}

module.exports.destroy=async function(req,res){
    try {
        let post=await Post.findById(req.params.id);
      
        // .id means converting the object id into string
        if(post.user==req.user.id){         //checking if user deleting is one who written that post

            // deleting all likes of post and comment here
            await Like.deleteMany({likeable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});

            post.remove();      //remove that post from database
        
            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:'Post deleted',
                    
                    
                })
            }
            
            req.flash('success','Post and associated comments are deleted');

            return res.redirect('back');
        }else{
            req.flash('error','You cant delete this post');
            return res.redirect('back');
        }        
    }catch (err) {
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
};