//引入express模块
let express = require('express');
//引入mongoose模块
const mongoose=require('mongoose');
//引入加密模块
const bcrypt = require('bcrypt');
//引入登录验证模块
const passport=require('passport');
// 引入模型
require("../models/user");
const User=mongoose.model('users');
//实例化一个router
const router=express.Router();
//引入body-parser模块
const bodyParser=require('body-parser');

//bodyparser中间件
let jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//登录和注册页面
router.get("/login",(req,res)=>{
    res.render("users/login");
});
router.get("/register",(req,res)=>{
    res.render("users/register");
});
router.post("/login",urlencodedParser,(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next)
});
router.post("/register",urlencodedParser,(req,res)=>{
    // console.log(req.body);
    // res.send("register")
    let errors=[];
    if(req.body.password!=req.body.password2){
        errors.push({
            text:"两次输入的密码不一致!"
        })
    }
    if(req.body.password.length<4){
        errors.push({
            text:"密码的长度不能小于4位"
        })
    }
    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }else{
       const newUser=new User({
           name:req.body.name,
           email:req.body.email,
           password:req.body.password,
       });
       User.findOne({email:req.body.email}).then((user)=>{
           if (user){
               req.flash("error_msg","邮箱已经存在，请更换邮箱注册");
               res.redirect("/users/register");
           } else {
               const newUser=new User({
                   name:req.body.name,
                   email:req.body.email,
                   password:req.body.password,
               });
               bcrypt.genSalt(10, (err, salt)=>{
                   bcrypt.hash(newUser.password, salt, (err, hash)=>{
                       if(err)throw err;
                       newUser.password=hash;
                       newUser.save().then(user=>{
                           req.flash("success_msg","账号注册成功");
                           res.redirect("/users/login");
                       }).catch((err)=>{
                           req.flash("error_msg","账号注册失败");
                           res.redirect("/users/register");
                       })
                   });
               });
           }
       });
    }
});
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","退出登录成功！");
    res.redirect("/users/login");
});
module.exports=router;