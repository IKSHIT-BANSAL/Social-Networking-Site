const Post=require('../models/post');
const User=require('../models/user');

// module.exports.home=function(req,res){

//     console.log(req.cookies);
//     res.cookie('user_id',25);
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comments',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(function(err,posts){
//         User.find({},function(err,users){
//             return res.render('home',{
//                 title:"Home",
//                 posts:posts,
//                 all_users:users
//             });
//         })


//     });
// }

// Converting above functioin to asyn Await

try {
    module.exports.home=async function(req,res){
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });

        let users=await User.find({});

        return res.render('home',{
            title:"Home",
            posts:posts,
            all_users:users
        });
    }
} catch (err) {
    console.log('Error',err);
    return;
}