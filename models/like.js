const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId
    },
    //this defines objectID of the liked object
    likeable:{           
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'onModel'       //gives path on which type like is done
    },
    //this way it is done
    //this field is used for defining type of liked object since this is a dynamic process
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;