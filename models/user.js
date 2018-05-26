//数据模型
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    data:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('users',UserSchema);