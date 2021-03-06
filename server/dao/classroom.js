//×¢ÈëÀà
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var util=require("./class/util.js");
var date_edit=require("./class/date_edit.js");
var mysqlConnect=require("./class/sqlConnect.js");
var mysql=require("./class/newSql.js");
//获取班级列表
exports.getclassroomlist=function(request,response){
    // 1. 获取登录用户基本信息
    var user_id = request.session.u_id || 0;
    var user_type = request.session.u_type || '04';
    var user_name = request.session.u_name || '人事经理';

    var c_name=request.query.c_name,c_endtime=request.query.c_endtime,
        option={
            request:request,  //ÇëÇó²ÎÊý
            table:"em_class",  //²éÑ¯µÄÊý¾Ý±í
            order:"c_id",  //ÅÅÐòÁÐ
            limitname : "WHERE 1 = 1 ",
            limitdata : []
        };
        if(user_type == '04'){
            option.limitname+=" AND c_hr = ?";
            option.limitdata.push(user_name);
        }else if(user_type == '05'){
            option.limitname+=" AND c_manager  = ?";
            option.limitdata.push(user_name);
        }
    if(c_name!=undefined){
        if(c_endtime==""){
            option.limitname +=" AND c_name LIKE ?";
            option.limitdata.push("%"+c_name+"%")
        }else{
            option.limitname +=" AND c_name LIKE ? AND c_endtime>?";
            option.limitdata.push("%"+c_name+"%",c_endtime)
        }
    }
    
    option.success=function(data){  //·µ»ØÊý¾Ý´¦Àíº¯Êý
        for(var i=0;i<data.content.length;i++) {
            //¿ª°àÊ±¼ä
            if(data.content[i].c_begintime!="0000-00-00"&&data.content[i].c_begintime!=null)
                data.content[i].c_begintime=date_edit.date(data.content[i].c_begintime);
            else
                data.content[i].c_begintime="";
            //½áÒµÊ±¼ä
            if(data.content[i].c_endtime!="0000-00-00"&&data.content[i].c_endtime!=null)
                data.content[i].c_endtime=date_edit.date(data.content[i].c_endtime);
            else
                data.content[i].c_endtime="";
        }
        response.send(JSON.stringify(data));
    };
    getlist.getlist(option);
};

// 获取班级详细信息
exports.getClassDetail = function(request,response){
    var startTime = (new Date()).valueOf(); 
    var c_id = request.query.c_id
    var sql1 = "SELECT * FROM em_class WHERE c_id = ?";
    var sql2 = "SELECT s_id,s_name,s_jobstatus,s_education,s_sex FROM em_student WHERE s_c_id=?";
    var sql3 = "SELECT * FROM em_message WHERE m_c_id=?"
    var sql = [sql1,sql2,sql3].join(";");
    var dataArr = [c_id,c_id,c_id];
    mysql.multiQuery(sql,dataArr,function(err,result){
        if(err){
            console.log('ERR : 数据库查询失败___'+err);
            response.send({
                status : -1,
                data: "",
                msg : "数据库查询失败"
            })

        }else{
            var endTime = (new Date()).valueOf(); 
            if(endTime - startTime>500){
                console.log("查询时间："+ (endTime-startTime) );
            }
            console.log('SUCCESS : '+ result);
            var baseInfo = result[0]
            var stuInfo = result[1]
            var approInfo = result[2]
            response.send({
                status : 0,
                data : {
                    baseInfo: baseInfo,
                    stuInfo : stuInfo,
                    approInfo : approInfo
                },
                msg : "查询成功"
            })
            
        }
    })
}
//Ìí¼Ó°à¼¶
exports.addclass=function(request,response){
    add.add({
        request:request,
        table:"em_class",
        success:function(data){
            response.send(data);
        }
    });
};

//±à¼­°à¼¶
exports.editclass=function(request,response){
    edit.edit({
        request:request,
        table:"em_class",
        editid:"c_id",  //±à¼­ÁÐµÄid¼üÃû
        success:function(data){
            console.log(data);
            response.send(data);
        }
    });
};

//É¾³ý°à¼¶
exports.delclass=function(request,response){
    mydelete.dele({
        del_id:request.body.c_id,
        sel_id:"c_id",
        table:"em_class",
        success:function(data){
            response.send(data);
        }
    })
};
// 申请结班
exports.applyCloseClass=function(request,response){
    var user_id = request.session.u_id ;
    var user_name = request.session.u_name ;
    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");  
    var class_id = request.body.c_id;
    var class_name = request.body.c_name;
    // 更改班级数据库状态
    mysqlConnect.sqlConnect({
        sql:"UPDATE em_class SET c_status='01' WHERE c_id = "+class_id,
        success:function(data){
            // 更新消息到message数据库
            var content = time+',     '+user_name+"发起了'"+class_name+"'结班申请"
            var dataArr = [class_id,content]
            mysqlConnect.sqlConnect({
                sql:"insert into em_message values(null,now(),(select c_hr from `em_class` where c_id=?),?,0,0);",
                dataArr : dataArr,
                success:function(data){
                    // 申请成功回调
                    response.send({
                        status : 0,
                        data:"申请成功",
                        msg : ''
                    })
                },
                error: function (e) {console.log(e)}
            })
        },
        error: function (e) {console.log(e)}
    })
};
// 处理结班申请、同意或者拒绝
exports.ensureCloseClass=function(request,response){
    var user_name = request.session.u_name ;
    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");  
var c_id = request.body.c_id
var c_name = request.body.c_name
var c_status = request.body.c_status
var res = (c_status=='11') ? '已经通过' : '被拒绝'
var content = time+',     '+user_name+"对'"+c_name+"'的申请进行了审批，结班申请"+res+"，如有疑问请直接联系本人"

    var sql1 = 'UPDATE em_class SET c_status=? WHERE c_id =?';
    var sql2 = "insert into em_message values(null,now(),?,?,0,?);";
    var sql = sql1 + ';' + sql2
    var dataArr = [c_status,c_id,user_name,content,c_id]
    mysql.multiQuery(sql,dataArr,function(err,result){
        if(err){
            response.send({status:1,message:'审批失败！'})
        }else{
            response.send({status:0})
        }
    });
};
