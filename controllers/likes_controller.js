const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLike=async function(req,res){
    try {
        
        //url will be likes/toggle/?id=abcdef&type=Post_or_Comment
        let likeable;
        let deleted=false;
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exist
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });

        // if a like alrady exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike);  //pull out a like from post or comment
            likeable.save();
            existingLike.remove();
            deleted=true;
        }else{
            //make a new like
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike._id);      //to save in database like of post or comment
            likeable.save();
        }
        return res.json(200,{
            message:'Request successfull',
            data:{
                deleted:deleted
            }
        })

    } catch (err) {
        console.log('******************snjs');
        console.log('err',err);
        return res.json(500,{
            message:'Internal Server error'
        });
    }
}