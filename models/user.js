const mongoose=require('mongoose');

//import multer
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));   //Will reach to users path in uploads
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())       //Data.now() fetches in milisec
                                                        //file.fieldname fetch avatar as name in database
    }
  });

//static methods

userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');   //it is a function uploadedAvatar
userSchema.statics.avatarPath=AVATAR_PATH;


const User=mongoose.model('User',userSchema);
module.exports=User;