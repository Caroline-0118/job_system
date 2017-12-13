//×¢ÈëÀà
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var date_edit=require("./class/date_edit.js");
var nodeExcel = require('excel-export');
var mysqlConnect=require("./class/sqlConnect.js");
//»ñÈ¡»Ø·ÃÁÐ±í
exports.getvisitedlist=function(request,response){
    var c_id=request.query.c_id,
    s_id=request.query.s_id,
    s_name=request.query.s_name,
    u_name=request.query.u_name,
    start_time=request.query.start_time,
    end_time=request.query.end_time;
    var isExport = request.query.isExport || false ;//判断是否是导出
    var fileName = request.query.fileName || "查询结果";
    var option={
        request:request,  //ÇëÇó²ÎÊý
        table:"em_visited,em_student,em_class,em_user",  //²éÑ¯µÄÊý¾Ý±í
        order:"v_id"  //ÅÅÐòÁÐ
    };
    option.limitdata=[];
    option.limitname="WHERE v_s_id=s_id AND v_u_id=u_id AND s_c_id=c_id";

    // 1. 获取登录用户基本信息
    var user_id = request.session.u_id || 0;
    var user_type = request.session.u_type || '04';
    var user_name = request.session.u_name || '人事经理';
    // 判断是否是人事经理或者项目经理
    if(user_type == '04'){
        option.limitname+=" AND c_hr = ?";
        option.limitdata.push(user_name);
    }else if(user_type == '05'){
        option.limitname+=" AND c_manager  = ?";
        option.limitdata.push(user_name);
    }

    if(c_id!=undefined&&c_id!=""&&c_id!=null){
            option.limitname+=" AND c_id=?";
            option.limitdata.push(c_id)
    }
    if(s_id!=undefined&&s_id!=""&&s_id!=null){
        option.limitname+=" AND s_id=?";
        option.limitdata.push(s_id)
    }
    if(s_name!=undefined&&s_name!=""&&s_name!=null){
        option.limitname+=" AND s_name like ?";
        option.limitdata.push("%"+s_name+"%")
    }
    if (u_name) {
        option.limitname += " AND u_name like ?";
        option.limitdata.push("%"+u_name+"%");
    }
    if(start_time!=undefined&&start_time!=""&&start_time!=null){
        option.limitname+=" AND v_time>=?";
        option.limitdata.push(start_time)
    }
    if(end_time!=undefined&&end_time!=""&&end_time!=null){
        option.limitname+=" AND v_time<=?";
        option.limitdata.push(end_time)
    }
    // console.log(option);
    option.success=function(data){  //·µ»ØÊý¾Ý´¦Àíº¯Êý
        for(var i=0;i<data.content.length;i++){
            if(data.content[i].v_time) data.content[i].v_time =date_edit.datetime(data.content[i].v_time);
            else data.content[i].v_time ="";
        }
        // response.send(JSON.stringify(data));
        // 判断是否是导出
        if(!isExport){
            response.send(JSON.stringify(data));
        }else{
            var conf = {}

            // 导出数据
            conf.stylesXmlFile =  __dirname+"/export.xml";
            conf.name = "mysheet";
            conf.cols = [{
                caption:'沟通时间',
                type:'string',
                width:20
            },{
                caption:'沟通方式',
                type:'string',
                width:15
            },{
                caption:'学员班级',
                type:'string',
                width:15
            },{
                caption:'学员姓名',
                type:'string',
                width:20
            },{
                caption:'回访人',
                type:'string',
                width:15
            },{
                caption:'沟通内容',
                type:'string',
                width:20
            },{
                caption:'备注',
                type:'string',
                width:30
            }];
            var rows = [];
            for(var i=0;i<data.content.length;i++){
                var rr = [];


                rr.push(data.content[i].v_time); 
                rr.push(data.content[i].v_type); 
                rr.push(data.content[i].c_name); 
                rr.push(data.content[i].s_name); 
                rr.push(data.content[i].u_name); 
                rr.push(data.content[i].v_content); 
                rr.push(data.content[i].v_remark); 
                rows.push(rr);
            }
            conf.rows = rows;

            var result = nodeExcel.execute(conf);
            response.setHeader('Content-Type', 'application/vnd.openxmlformats');
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            response.end(result, 'binary');
        }
    };
    getlist.getlist(option);
};

//Ìí¼Ó°à¼¶
exports.addvisited=function(request,response){
    request.body.v_u_id=request.session.u_id;
    request.body.v_time=date_edit.datetime(new Date());
    var stu_name = request.body.v_s_name;
    delete request.body.v_s_name;
    add.add({
        request:request,
        table:"em_visited",
        success:function(data){
            if(data.result){
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");  
                var message = time +'，     ' +request.session.u_name + '对'+stu_name+'的就业信息进行了回访。内容为：'+request.body.v_content
                var sql = "insert into em_message values(null,now(),(select c_hr from em_class AS C , em_student  AS S where S.s_c_id = C.c_id  and s_id = ?),?,0,0),(null,now(),(select c_manager from em_class AS C , em_student  AS S where S.s_c_id = C.c_id  and s_id = ?),?,0,0)"
                mysqlConnect.sqlConnect({
                    sql:sql,
                    dataArr : [request.body.v_s_id,message,request.body.v_s_id,message],
                    success:function(data){
                        response.send({
                            result : true
                        });
                    },
                    error: function (e) {console.log(e)}
                })
            }else{
                response.send(data)
            }
        }
    });
};

//É¾³ý»Ø·Ã
exports.delvisited=function(request,response){
    var v_id=request.body.v_id;
    mydelete.dele({
        del_id:v_id,
        table:"em_visited",
        sel_id:"v_id",  //±à¼­ÁÐµÄid¼üÃû
        success:function(data){
            response.send(data);
        }
    });
};