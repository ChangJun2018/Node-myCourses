//引入express模块
let express = require('express');
//引入express-handlebars模块
const exphbs = require('express-handlebars');
const path=require('path');
//引入body-parser模块
const bodyParser=require('body-parser');
//引入mongoose模块
const mongoose=require('mongoose');
//引入express-session模块
const session = require('express-session');
//引入express-flash模块
const flash=require('connect-flash');
//引入method-override模块
const methodOverride = require('method-override');
const passport=require("passport");
//实例化一个express对象
const app = express();
const ideas=require('./routes/ideas');
const users=require('./routes/users');
require("./config/passport")(passport);
const db=require("./config/database");
//使用静态文件
app.use(express.static(path.join(__dirname,'public')));
//session和flash中间件儿
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//连接数据库
mongoose.connect(db.mongoURL).then(()=>{
    console.log("连接成功")
}).catch(err=>{
    console.log(err)
});
// 引入模型
require("./models/idea");
const Idea=mongoose.model('ideas');
//配置全局变量
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user||null;
    next();
});
//bodyparser中间件
let jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
//method-override的中间儿件
app.use(methodOverride('_method'));
//handlebars的中间件儿
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//首页
app.get("/", (req, res) => {
    const title="大家好，我是常峻！";
    res.render("index",{
        title:title
    });
});

// 关于我们
app.get("/about", (req, res) => {
    res.render("about");
});

//端口号
const port = process.env.PORT||5000;

//使用routes
app.use("/ideas",ideas);
app.use("/users",users);



//监听端口号
app.listen(port, () => {
    console.log(`server started on ${port}`)
});


