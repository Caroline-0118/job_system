
//引用experss模块
var express = require("./server/node_modules/express");
var app=express();
//引用session模块
var cookieParser = require("./server/node_modules/cookie-parser");
var session = require("./server/node_modules/express-session");

//引入dao层处理文件
var user=require("./server/dao/usermanage.js");//用户
var classroom=require("./server/dao/classroom.js");//班级
var student=require("./server/dao/student.js");//学员
var business=require("./server/dao/business.js");//企业
var interview=require("./server/dao/interview.js");//面试
var recommend=require("./server/dao/recommend.js");//推荐
var visited=require("./server/dao/visited.js");//回访
var load=require("./server/dao/upload.js");//上传下载
var census=require("./server/dao/census.js");//统计
var message=require("./server/dao/message.js");//消息
var auth = require("./server/config/auth.json");  //用户权限控制
app.configure(function(){
    var upload=__dirname.split("\\");
    app.use(cookieParser());//启用cookie模块
    app.use(session({//启用和配置session模块
        secret:"123",
        name:"test",
        cookie:{maxAge:600000},//session存储时间(毫秒)
        resave:false,
        saveUninitialized:true
    }));
    app.use(express.logger('dev'));

    app.use(express.bodyParser({uploadDir:upload.join("\\")+"\\client\\files"}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname+"/client"));
    app.use(express.errorHandler());//打印错误日志
});
app.listen(8866);//设置服务器端口号
console.log("服务器已经从8866端口启动");
//用户模块

app.post("/getAuthInfo.do",user.getAuthInfo);//获取用户权限信息
app.post("/login.do",user.login);//登录
app.post("/logout.do",user.logout);//退出登录
app.post("/getsession.do",user.getsession);//获取session
app.get("/queryuserlist.do",user.getuserlist);//获取用户列表
app.post("/adduser.do",user.adduser);//添加用户
app.post("/edituser.do",user.edituser);//编辑用户
app.post("/changepass.do",user.changepass);//修改密码
app.post("/checkpass.do",user.checkpass);//校正密码

//班级模块
app.get("/queryclasslist.do",classroom.getclassroomlist);//获取班级列表
app.get("/getClassDetail.do",classroom.getClassDetail);//获取班级详情
app.post("/addclass.do",classroom.addclass);//添加班级
app.post("/editclass.do",classroom.editclass);//编辑班级
app.post("/delclass.do",classroom.delclass);//删除班级
app.post("/applyCloseClass.do",classroom.applyCloseClass);//申请结班
app.post("/handleCloseClass.do",classroom.ensureCloseClass);//处理结班申请

//学员模块
app.get("/querystulist.do",student.getstulist);//获取学员列表
app.post("/addstu.do",student.addstu);//添加学员
app.post("/editstu.do",student.editstu);//编辑学员
app.post("/delstu.do",student.delstu);//删除学员
app.post("/delsturemuse.do",student.delsturemuse);//删除学员简历
app.get("/queryjobdirelist.do",student.queryjobdirelist);//获取学员就业方向列表

//企业模块
app.get("/querybuslist.do",business.getbuslist);//获取企业列表
app.post("/addbus.do",business.addbus);//添加企业
app.post("/editbus.do",business.editbus);//编辑企业
app.post("/delbus.do",business.delbus);//删除企业

//面试模块
app.get("/queryinterlist.do",interview.getinterlist);//获取面试列表
app.post("/addinter.do",interview.addinter);//添加面试
app.post("/editinter.do",interview.editinter);//修改面试
app.post("/delinter.do",interview.delinter);//删除面试
app.post("/interresult.do",interview.interresult);//面试结果

//推荐模块
app.get("/queryreclist.do",recommend.queryreclist);//获取推荐列表，导出推荐列表
app.post("/addrec.do",recommend.addrec);//添加推荐
app.post("/editrec.do",recommend.editrec);//修改推荐
app.post("/delreco.do",recommend.delrec);//删除面试

//回访模块
app.get("/getvisitedlist.do",visited.getvisitedlist);//获取回访列表
app.post("/addvisited.do",visited.addvisited);//添加回访
app.post("/delvisited.do",visited.delvisited);//删除回访

//导入导出
app.post("/upstu.do", load.upstu);//导入学员
app.post("/up_semue.do", load.upResume);//上传简历
app.post("/up_avata.do", load.upAvata);//上传头像

//统计
app.post("/getclass.do", census.getclassstu);//班级统计
app.get("/getclass.do", census.getclassstu);//班级统计
app.post("/getReDetail.do",census.getReDetail);//获取推荐人员详情
app.get("/getuserreco.do", census.getuserreco);//用户统计
app.post("/getwaitjobstu.do", census.getwaitjobstu);//待就业班级人数统计
app.post("/getthisweek.do", census.getthisweek);//本周就业人数统计
app.post("/nojoball.do", census.nojoball);//未就业总人数

//消息
app.post("/getMessageList.do", message.getMessageList);//获取消息列表
app.post("/changeMsgStatus.do", message.changeMsgStatus);//消息标记为已读
app.post("/deleteMessage.do", message.deleteMessage);//删除消息
