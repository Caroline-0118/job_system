//注入类
var mysqlConnect=require("./class/sqlConnect.js");
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var auth = require("../config/auth.json");
var mysql=require("./class/newSql.js");
//用户登录
exports.login=function(request,response){
    var username=request.body.username,password=request.body.password;
    var loginSql="select u_id,u_name,u_type from em_user where u_name=? and u_password=?";
    
    mysqlConnect.sqlConnect({
        sql:loginSql,   //sql语句
        dataArr:[username,password], //查询条件值
        success:function(data){   //成功
            if(data.length>0){
                if(data[0].u_type == '06'){
                    response.send({result: false,msg:"该用户无权限登录"});
                    return false
                }
                //设置session
                request.session.u_id=data[0].u_id;
                request.session.u_name=data[0].u_name;
                request.session.u_type=data[0].u_type;
                response.send({result: true,data:data});
            }else{
                response.send({result: false});
            }
        }
    });
};

//退出登录
exports.logout=function(request,response){
    try{
        request.session.u_id=null;
        request.session.u_name=null;
        response.send({result:true});
    }catch(e){
        console.log(e);
        response.send({result:false});
    }
};
//获取session
exports.getsession=function(request,response){
    var u_id=request.session.u_id,getCol=request.body.getcol;
    var u_name =  request.session.u_name;
    if(getCol=="id") response.send(u_id);//获取登录用户id
    else if(getCol=="name"){//获取登录用户姓名
        var getunameSql="select u_name,u_id,u_type from em_user where u_id="+u_id;
        var msgSql = "SELECT count(*) AS count FROM em_message where m_status=0 AND m_user='"+u_name+"'"
        var sql = getunameSql + ';' + msgSql
        mysql.multiQuery(sql,function(err,result){
            if(err){
                response.send([])
            }else{
                var res = result[0] //登录信息
                var noRead = result[1][0].count //未读消息
                res[0].noRead = noRead 
                response.send(res)
            }
        })
    }
};

//获取session
exports.getAuthInfo=function(request,response){
    if (auth) {
        response.json({
            status:0,
            data:auth,
            message:""
        }) 
    }else{
        response.json({
            status:-1,
            data:"",
            message:"获取权限信息失败"
        })
    }
};
//获取用户列表
exports.getuserlist=function(request,response){
    // 1. 获取登录用户基本信息
    var user_id = request.session.u_id || 0;
    var user_type = request.session.u_type || '04';
    var user_name = request.session.u_name || '人事经理';

    var u_name=request.query.u_name,
        option={
            request:request,  //请求参数
            table:"em_user",  //查询的数据表
            order:"u_id",  //排序列
            success:function(data){  //返回数据处理函数
                response.send(JSON.stringify(data));
            }
        };
    option.limitname="WHERE 1=1";
    option.limitdata=[];
    // if(user_type == '04'||user_type=='05'){
    //     option.limitname += ' AND u_name=?'
    //     option.limitdata=[user_name];
    // }
    if(u_name!=undefined){
        option.limitname+=" AND u_name LIKE ?";
        option.limitdata.push("%"+u_name+"%")
    }
    // 判断用户类型
    if(request.query.u_type){
        option.limitname+=" AND u_type = ?";
        option.limitdata.push(request.query.u_type)
    }
    console.log(request.query.u_stutas);
    if(request.query.u_stutas){
        var u_stutas=request.query.u_stutas.split(","),$zhanwei=[];
        if(u_stutas.length==1)option.limitname+=" AND u_stutas=?";
        if(u_stutas.length>1){
            for(var i=0;i<u_stutas.length;i++){$zhanwei.push("?")}
            option.limitname+=" AND u_stutas IN ("+$zhanwei.join()+")";
        }
        option.limitdata=option.limitdata.concat(u_stutas);
    }

    getlist.getlist(option);
};

//添加用户
exports.adduser=function(request,response){
    add.add({
        request:request,
        table:"em_user",
        success:function(data){
            response.send(data);
        }
    });
};

//编辑用户
exports.edituser=function(request,response){
    edit.edit({
        request:request,
        table:"em_user",
        editid:"u_id",  //编辑列的id键名
        success:function(data){
            response.send(data);
        }
    });
};

//修改密码验证旧密码
exports.checkpass=function(request,response){
    var u_id=request.session.u_id,password=request.body.u_password;
    console.log([u_id,password]);
    var checkSql="select u_id,u_name from em_user where u_id=? and u_password=?";
    mysqlConnect.sqlConnect({
        sql:checkSql,   //sql语句
        dataArr:[u_id,password], //查询条件值
        success:function(data){   //成功
            if(data.length>0){
                response.send({"valid":true});
            }else{
                response.send({"valid":false});
            }
        }
    });
};

//修改密码
exports.changepass=function(request,response){
    request.body.u_id=request.session.u_id;
    edit.edit({
        request:request,
        table:"em_user",
        editid:"u_id",
        success:function(data){
            response.send(data);
        }
    });
};