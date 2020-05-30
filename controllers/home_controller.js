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
        let user;
        if(req.user){
            user = await User.findById(req.user._id)
            .populate({
                path : 'friendship',
                populate : {
                    path : 'from_user',
                },
            })
            .populate({
                path:'friendship',
                populate:{
                    path:'to_user'
                }
            })  
            console.log('User is here',user);
            return res.render('home',{
                title:"Home",
                posts:posts,
                all_users:users,
                user:user
            });         
        }else{
            return res.redirect('/users/sign-in');
        }


    } catch (err) {
        console.log('Error',err);
        return;
    }
}