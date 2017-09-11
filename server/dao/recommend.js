//导入类
var getlist=require("./class/getlist.js");
var edit=require("./class/edit.js");
var date_edit=require("./class/date_edit.js");
var mydelete=require("./class/delete.js");
var mysqlConnect=require("./class/sqlConnect.js");

//获取推荐列表
exports.queryreclist=function(request,response){
    //定义数据
    var req={
        query:{
            page:request.query.page,
            rows:request.query.rows
        }
    };
    //发送请求项
    var option={
        request:req,
        table:"em_recommend,em_student,em_class,em_business,em_user",
        order:"r_id",
        limitdata:[],
        limitname:"WHERE s_c_id=c_id AND r_b_id=b_id AND r_s_id=s_id AND r_u_id=u_id",
        //查询返回列数据
        showcol:["r_id","c_name","r_s_id","r_b_id","s_name","s_sex","s_trueresume","s_falseresume","s_phone","r_time","b_name","u_name","r_job","r_remark"]
    };
    //判断查询项
    if(request.query.c_id!=undefined){
        for(var key in request.query){
            if(request.query[key]!=""&&key.indexOf("_")>0&&key!="_search"){
                req.query[key]=request.query[key];
                //查询条件判定
                if(key=="c_id"){
                    option.limitname+=" AND c_id=?";
                    option.limitdata.push(request.query.c_id);
                }
                if(key=="s_name"){
                    option.limitname+=" AND s_name LIKE ?";
                    option.limitdata.push("%"+request.query.s_name+"%")
                }
                if(key=="u_id"){
                    option.limitname+=" AND u_id=?";
                    option.limitdata.push(request.query.u_id);
                }
                if(key=="b_name"){
                    option.limitname+=" AND b_name LIKE ?";
                    option.limitdata.push("%"+request.query.b_name+"%")
                }
                if(key=="i_starttime") {
                    option.limitname+=" AND r_time >?";
                    option.limitdata.push(request.query.i_starttime+" 00:00:00")
                }
                if(key=="i_endtime") {
                    option.limitname+=" AND r_time <?";
                    option.limitdata.push(request.query.i_endtime+" 23:59:59")
                }
            }
        }
    }
    if(request.query.r_id!=undefined){
        option.limitname+=" AND r_id=?";
        option.limitdata.push(request.query.r_id);
    }
    //返回数据处理函数
    option.success=function(data){
        //console.log(data);
        for(var i=0;i<data.content.length;i++){
            console.log(data.content[i]);
            //推荐时间
            data.content[i].r_time=date_edit.datetime(data.content[i].r_time);
        }
        response.send(JSON.stringify(data));
    };
    option.error=function(e){
        response.send(JSON.stringify(e));
    };
    getlist.getlist(option);

};

//添加推荐
exports.addrec=function(request,response){
    var $date=request.body.i_time.split(" "),
        s_ids=request.body.i_s_id.split(","),
        $zhanwei=[],dataArr=[];
    //修改时间格式
    if($date[2]=="PM"){
        var $time=$date[1].split(":");
        $date[1]=parseInt($time[0])+12+":"+$time[1];
    }
    $date[1]+=":00";
    request.body.i_time=$date[0]+" "+$date[1];
    //判定学员个数
    for(var i=0;i<s_ids.length;i++){
        $zhanwei.push("(?,?,?,?,?)");
        dataArr.push(request.body.i_time);
        dataArr.push(request.body.i_b_id);
        dataArr.push(request.body.i_job);
        dataArr.push(request.body.i_u_id);
        dataArr.push(s_ids[i]);
    }
    //sql
    var addSql="INSERT INTO em_recommend (r_time,r_b_id,r_job,r_u_id,r_s_id) VALUES "+$zhanwei.join();
    //连接数据库
    mysqlConnect.sqlConnect({
        sql:addSql,
        dataArr:dataArr,
        success:function(data){
            response.send({result:true});
        },
        error:function(e){console.log(e)}
    });
};

//编辑推荐
exports.editrec=function(request,response){
    if(request.body.s_graduation=="")request.body.s_graduation="0000-00-00";
    var option={
        request:request,
        table:"em_student",
        editid:"s_id",  //编辑列的id键名
        success:function(data){
            response.send(data);
        }
    };
    if(request.body.s_id.split(",").length>1) option.type="many";//同时编辑多列
    edit.edit(option);
};

//删除推荐
exports.delrec=function(request,response){
    mydelete.dele({
        del_id:request.body.r_id,
        sel_id:"r_id",
        table:"em_recommend",
        success:function(data){
            response.send(data);
        }
    })
};