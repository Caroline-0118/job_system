//×¢ÈëÀà
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var date_edit=require("./class/date_edit.js");

//»ñÈ¡»Ø·ÃÁÐ±í
exports.getvisitedlist=function(request,response){
    var c_id=request.query.c_id,
    s_id=request.query.s_id,
    s_name=request.query.s_name,
    u_name=request.query.u_name,
    start_time=request.query.start_time,
    end_time=request.query.end_time;
    var option={
        request:request,  //ÇëÇó²ÎÊý
        table:"em_visited,em_student,em_class,em_user",  //²éÑ¯µÄÊý¾Ý±í
        order:"v_id"  //ÅÅÐòÁÐ
    };
    option.limitdata=[];
    option.limitname="WHERE v_s_id=s_id AND v_u_id=u_id AND s_c_id=c_id";
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
        response.send(JSON.stringify(data));
    };
    getlist.getlist(option);
};

//Ìí¼Ó°à¼¶
exports.addvisited=function(request,response){
    request.body.v_u_id=request.session.u_id;
    request.body.v_time=date_edit.datetime(new Date());
    add.add({
        request:request,
        table:"em_visited",
        success:function(data){
            response.send(data);
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