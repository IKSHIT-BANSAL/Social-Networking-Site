const mongoose=require('mongoose');

const reset_pass=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    accessToken:{
        type:String,
        required:true
    },
    isValid:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
});

const Reset=mongoose.model('Reset',reset_pass);
module.exports=Reset;