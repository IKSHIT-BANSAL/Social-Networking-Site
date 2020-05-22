const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=async function(req,res){
// Converting above functioin to asyn Await

    try {
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate:{          //for comments
                path:'likes'
            }
        }).populate('likes');   

        let users=await User.find({});

        return res.render('home',{
            title:"Home",
            posts:posts,
            all_users:users
        });
    } catch (err) {
        console.log('Error',err);
        return;
    }
}