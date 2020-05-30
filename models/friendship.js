const mongoose=require('mongoose');

const FriendshipSchema=mongoose.Schema({
    //the user who sent the request (sender)
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //the user who accepted the request (receiver)
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const Friendship=mongoose.model('Friendship',FriendshipSchema);
module.exports=Friendship;