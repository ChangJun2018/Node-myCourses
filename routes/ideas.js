//引入express模块
let express = require('express');
//引入mongoose模块
const mongoose=require('mongoose');
//引入body-parser模块
const bodyParser=require('body-parser');
const {ensureAuthenticated}=require("../helpers/auth");
//实例化一个router
const router=express.Router();
// 引入模型
require("../models/idea");
const Idea=mongoose.model('ideas');
//bodyparser中间件
let jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
//添加课程
router.get("/add",ensureAuthenticated,(req,res)=>{
    res.render("ideas/add");
});
//编辑课程
router.get("/edit/:id",ensureAuthenticated,(req,res)=>{
    //根据拿到的id查找数据库，将查找的数据在返回给编辑页面
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        if(idea.user!=req.user.id){
            req.flash("error_msg","非法操作！您在干什么呢？");
            res.redirect("/ideas");
        }else{
            res.render("ideas/edit",{
                idea:idea
            });
        }
    })
});
//编辑提交
router.put("/:id",urlencodedParser,(req,res)=>{
    //根据id查找数据
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        //找到之后将提交上来的title和details赋给查找返回的数据
        idea.title=req.body.title;
        idea.details=req.body.details;
        //进行保存，保存之后重定向会课程展示页面
        idea.save().then(idea=>{
            req.flash("success_msg","数据编辑成功");
            res.redirect("/ideas")
        })
    })
});
//展示课程
router.get("/",ensureAuthenticated,(req,res)=>{
    //在moongo中查找数据，并对其按照时间降序排列，然后拿到的数据渲染出来
    Idea.find({user:req.user.id}).sort({date:"desc"}).then(ideas=>{
        res.render("ideas/index",{
            ideas:ideas
        });
    })
});
//删除课程
router.delete("/:id",ensureAuthenticated,(req,res)=>{
    Idea.remove({
        _id:req.params.id
    }).then(()=>{
        req.flash("success_msg","数据删除成功");
        res.redirect("/ideas")
    });
});
//Post添加课程
//后台的验证
router.post("/",urlencodedParser,(req,res)=>{
    // console.log(req.body);
    //后台的验证
    let errors=[];
    if(!req.body.title){
        errors.push({text:"请输入标题!"})
    }
    if(!req.body.details){
        errors.push({text:"请输入详情!"})
    }
    if(errors.length>0){
        //如果错误数组的长度大于0,将数据返还回去
        res.render("ideas/add",{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else {
        //数据存储
        const newUser={
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        };
        //按照数据模型存储提交的数据，重定向到课程展示页面
        new Idea(newUser).save().then(idea=>{
            req.flash("success_msg","课程添加成功");
            res.redirect('/ideas')
        })
    }
});
module.exports=router;