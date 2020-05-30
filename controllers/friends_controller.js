const friends=require('../models/friendship');
const User=require('../models/user');

module.exports.addFriends=async function(req,res){
    try {
        let userSelected=false;
        
        //check if friend is already present
        let existingFriend=await friends.findOne({
            from_user:req.user,
            to_user:req.query.id
        });
        let user=await User.findById(req.user._id);

        if(existingFriend){
            //then remove from it delete
            user.friendship.pull(existingFriend._id);
            user.save();
            existingFriend.remove();
            
            console.log('Im existing')

        }else{
            //create a friend or send the request 
            let newFriend=await friends.create({
                from_user:req.user._id,
                to_user:req.query.id
            })
            user.friendship.push(newFriend);
            user.save();
            console.log('Im neww 2',user.friendship.length)
            userSelected=true;
        }
        if(req.xhr){
            return res.json(200,{
                message:'Request successfull!',
                data:{
                    userSelected:userSelected,
                    user:user
                }
            })
        }
        return res.redirect('back');

        
    } catch (err) {
        console.log('Error',err);
        return res.json(500,{
            message:'Intenal Server Error'
        });
    }
}