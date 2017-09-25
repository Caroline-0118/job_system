//导入类
var getlist=require("./class/getlist.js");
var edit=require("./class/edit.js");
var date_edit=require("./class/date_edit.js");
var mydelete=require("./class/delete.js");
var mysqlConnect=require("./class/sqlConnect.js");
var async=require("../node_modules/async");
var nodeExcel = require('excel-export');
//获取面试列表
exports.getinterlist=function(request,response){
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
        table:"em_interview,em_student,em_class,em_business,em_user",
        order:"i_id",
        limitdata:[],
        limitname:"WHERE s_c_id=c_id AND i_b_id=b_id AND i_s_id=s_id AND i_u_id=u_id",
        //查询返回列数据
        showcol:["i_id","c_name","i_s_id","s_name","i_time","b_name","u_name","i_writeresult","i_u_id",
            "i_faceresult","i_retestresult","i_employ","i_entryresult","i_job","i_remark","i_jobpay","i_xishijobpay"
        ]
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
                    option.limitname+=" AND i_time >?";
                    option.limitdata.push(request.query.i_starttime+" 00:00:00")
                }
                if(key=="i_endtime") {
                    option.limitname+=" AND i_time <?";
                    option.limitdata.push(request.query.i_endtime+" 23:59:59")
                }
            }
        }
    }
    //获取某个学生面试记录
    if(request.query.i_s_id!=undefined){
        option.limitname+=" AND i_s_id=?";
        option.limitdata.push(request.query.i_s_id);
    }
    //返回数据处理函数
    option.success=function(data){
        for(var i=0;i<data.content.length;i++){
            //面试时间
            data.content[i].i_time=date_edit.datetime(data.content[i].i_time);

            //笔试结果 0失败 1成功
            switch (data.content[i].i_writeresult){
                case 0 : data.content[i].i_writeresult="失败"; break;
                case 1 : data.content[i].i_writeresult="成功"; break;
            }
            //面试结果
            switch (data.content[i].i_faceresult){
                case 0 : data.content[i].i_faceresult="失败"; break;
                case 1 : data.content[i].i_faceresult="成功"; break;
            }
            //复试结果
            switch (data.content[i].i_retestresult){
                case 0 : data.content[i].i_retestresult="失败"; break;
                case 1 : data.content[i].i_retestresult="成功"; break;
            }
            //录用结果
            switch (data.content[i].i_employ){
                case -1 : data.content[i].i_employ=""; break;
                case 0 : data.content[i].i_employ="失败"; break;
                case 1 : data.content[i].i_employ="成功"; break;
            }
            //入职结果
            switch (data.content[i].i_entryresult){
                case 0 : data.content[i].i_entryresult="失败"; break;
                case 1 : data.content[i].i_entryresult="成功"; break;
            }
        }
        // 判断是否是导出
        var isExport = request.query.isExport || false ;//判断是否是导出
        var fileName = request.query.fileName || "查询结果";
        if(!isExport){
            response.send(JSON.stringify(data));
        }else{
            var conf = {}

            // 导出数据
            conf.stylesXmlFile =  __dirname+"/export.xml";
            conf.name = "mysheet";
            conf.cols = [{
                caption:'面试反馈',
                type:'string',
                width:20
            },{
                caption:'班级',
                type:'string',
                width:15
            },{
                caption:'姓名',
                type:'string',
                width:15
            },{
                caption:'面试时间',
                type:'string',
                width:20
            },{
                caption:'面试企业',
                type:'string',
                width:15
            },{
                caption:'推荐人',
                type:'string',
                width:20
            },{
                caption:'笔试',
                type:'string',
                width:30
            },{
                caption:'面试',
                type:'string',
                width:30
            },{
                caption:'复试',
                type:'string',
                width:30
            },{
                caption:'录用',
                type:'string',
                width:30
            },{
                caption:'入职',
                type:'string',
                width:30
            },{
                caption:'试用薪资',
                type:'string',
                width:30
            },{
                caption:'正式薪资',
                type:'string',
                width:30
            },{
                caption:'备注',
                type:'string',
                width:30
            }];
            var rows = [];
            for(var i=0;i<data.content.length;i++){
                var rr = [];
                rr.push(data.content[i].i_employ ? '已反馈' : '未反馈' ); 
                rr.push(data.content[i].c_name); 
                rr.push(data.content[i].s_name); 
                rr.push(data.content[i].i_time); 
                rr.push(data.content[i].b_name); 
                rr.push(data.content[i].u_name); 
                rr.push(data.content[i].i_writeresult); 
                rr.push(data.content[i].i_faceresult); 
                rr.push(data.content[i].i_retestresult); 
                rr.push(data.content[i].i_employ); 
                rr.push(data.content[i].i_entryresult); 
                rr.push(data.content[i].i_xishijobpay); 
                rr.push(data.content[i].i_jobpay); 
                rr.push(data.content[i].i_remark); 


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

//添加面试
exports.addinter=function(request,response){
    var $date=request.body.i_time.split(" "),
        s_ids=request.body.i_s_id.split(","),
        $zhanwei=[],dataArr=[];
    var addtime=date_edit.date(new Date());
    //修改时间格式
    if($date[2]=="PM"){
        var $time=$date[1].split(":");
        $date[1]=parseInt($time[0])+12+":"+$time[1];
    }
    $date[1]+=":00";
    request.body.i_time=$date[0]+" "+$date[1];
    //判定学员个数
    for(var i=0;i<s_ids.length;i++){
        $zhanwei.push("(?,?,?,?,?,?)");
        dataArr.push(request.body.i_time);
        dataArr.push(request.body.i_b_id);
        dataArr.push(request.body.i_job);
        dataArr.push(request.body.i_u_id);
        dataArr.push(s_ids[i]);
        dataArr.push(addtime);
    }

    //sql
    var addSql="INSERT INTO em_interview (i_time,i_b_id,i_job,i_u_id,i_s_id,i_addtime) VALUES "+$zhanwei.join();
    console.log(addSql);
    console.log(dataArr);
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

//编辑面试
exports.editinter=function(request,response){
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

//删除面试
exports.delinter=function(request,response){
    mydelete.dele({
        del_id:request.body.i_id,
        sel_id:"i_id",
        table:"em_interview",
        success:function(data){
            response.send(data);
        }
    })
};

//修改面试结果
exports.interresult=function(request,response){
    var editSql,dataArr;
    var employtime=date_edit.date(new  Date());
    if(request.body.type=="1"){
        var $zhanwei=[];
        dataArr=request.body.i_id.split(",");
        for(var i=0;i<dataArr.length;i++){
            $zhanwei.push("?");
        }
        editSql="UPDATE em_interview SET i_employ=0 WHERE i_id IN ("+$zhanwei.join()+")";
        //连接数据库
        mysqlConnect.sqlConnect({
            sql:editSql,
            dataArr:dataArr,
            success:function(data){
                response.send({result:true});
            },
            error: function (e) {
                response.send({result:false});
            }
        });

    }else{
        //异步修改面试表和学生表
        async.series([
            function(cb){//添加面试结果
                var $set=["i_employ=?"];
                dataArr=[request.body.i_employ];
                //判断修改项
                if(request.body.i_writeresult!=""){
                    $set.push("i_writeresult=?");
                    dataArr.push(request.body.i_writeresult)
                }
                if(request.body.i_faceresult!=""){
                    $set.push("i_faceresult=?");
                    dataArr.push(request.body.i_faceresult)
                }
                if(request.body.i_retestresult!=""){
                    $set.push("i_retestresult=?");
                    dataArr.push(request.body.i_retestresult)
                }
                if(request.body.i_entryresult!=""){
                    $set.push("i_entryresult=?");
                    dataArr.push(request.body.i_entryresult)
                }
                if(request.body.s_shixijobpay!=""){
                    $set.push("i_xishijobpay=?");
                    dataArr.push(request.body.s_shixijobpay)
                }
                if(request.body.s_jobpay!=""){
                    $set.push("i_jobpay=?");
                    dataArr.push(request.body.s_jobpay)
                }
                dataArr.push(request.body.i_id);
                editSql="UPDATE em_interview SET "+$set.join()+" WHERE i_id=?";
                //连接数据库
                mysqlConnect.sqlConnect({
                    sql:editSql,
                    dataArr:dataArr,
                    success:function(data){
                        cb(null,true);
                    },
                    error: function (e) {
                        cb(null,false)
                    }
                });
            },function(cb){//添加学员薪酬
                if(request.body.i_entryresult!=1)cb(null,true);
                else{
                    console.log();
                    var limit=[],dataArr=[];
                    //添加修改项
                    if(request.body.s_shixijobpay){
                        limit.push("s_shixijobpay=?");
                        dataArr.push(request.body.s_shixijobpay);
                    }
                    if(request.body.s_jobpay){
                        limit.push("s_jobpay=?");
                        dataArr.push(request.body.s_jobpay);
                    }
                    limit.push("s_getjobtime=?");
                    dataArr.push(employtime);
                    limit.push("s_u_id=?");
                    dataArr.push(request.body.i_u_id);
                    dataArr.push(request.body.i_id);
                    mysqlConnect.sqlConnect({
                        sql:"UPDATE em_student,em_interview SET "+limit.join()+" WHERE s_id=i_s_id AND i_id=?",
                        dataArr:dataArr,
                        success:function(data){
                            cb(null,true);
                        },
                        error: function (e) {
                            console.log(e);
                            cb(null,false)
                        }
                    });
                }
            }
        ],function(err, values){
            if(values[0]&&values[1]) response.send({result:true});
            else response.send({result:false});
        });
    }
};
