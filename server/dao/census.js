
var date_edit=require("./class/date_edit.js");
var mysqlConnect=require("./class/sqlConnect.js");
var async=require("../node_modules/async");

//班级就业信息统计
exports.getclassstu= function (request, response) {
    async.waterfall([function(cb) {//同步请求，先查询结业班级，在查询各个班级就业状态
            //var $nowdate=date_edit.date(new Date());
            var dataArr=[date_edit.date(new Date())],$limit='';
            if(request.body.start_time!=undefined&&request.body.start_time!=null&&request.body.start_time!=""){
                dataArr.push(request.body.start_time);
                $limit+=" AND c_endtime >=?"
            }
            if(request.body.end_time!=undefined&&request.body.end_time!=null&&request.body.end_time!=""){
                dataArr.push(request.body.end_time);
                $limit+=" AND c_endtime <=?"
            }
            mysqlConnect.sqlConnect({
                sql:"select c_name,c_id,c_endtime from em_class where c_endtime<=?"+$limit,
                dataArr:dataArr,
                success:function(data){
                    for(var i=0;i<data.length;i++){
                        if(data[i].c_endtime!="0000-00-00"&&data[i].c_endtime!=""&&data[i].c_endtime!=null){
                            data[i].c_endtime=date_edit.date(data[i].c_endtime);
                        }else data[i].c_endtime="";
                    }
                    cb(null,data);
                },
                error: function (e) {console.log(e)}
            })
        },function(n, cb) {
            var $getstunum=[];
            if(request.body.type==1){//获取本周就业人数
                var week=date_edit.week();
                function bbbb(num){//闭包添加传递函数
                    function func(cb){
                        mysqlConnect.sqlConnect({
                            sql:"SELECT COUNT(*) AS num FROM em_student WHERE s_c_id=? AND s_getjobtime>=?"+
                            " AND s_getjobtime<=?",
                            dataArr:[n[num].c_id,week[0],week[1]],
                            success:function(data){
                                var mydata={
                                    c_name:n[num].c_name,
                                    c_id:n[num].c_id,
                                    c_endtime:n[num].c_endtime,
                                    weeknum:data[0].num
                                };
                                cb(null,mydata);
                            },
                            error: function (e) {console.log(e)}
                        })
                    }
                    return func;
                }
                for(var i=0;i< n.length;i++){
                    $getstunum.push(bbbb(i));

                }
            }else{//班级就业状态人数统计
                function aaaa(num){
                    function func(cb){
                        mysqlConnect.sqlConnect({
                            sql:"SELECT s_jobstatus,COUNT(*) AS num FROM em_student WHERE s_c_id=? GROUP BY s_jobstatus",
                            dataArr:[n[num].c_id],
                            success:function(data){
                                var mydata={
                                    c_name:n[num].c_name,
                                    c_id:n[num].c_id,
                                    c_endtime:n[num].c_endtime,
                                    jobstatus_count:data
                                };
                                cb(null,mydata);
                            },
                            error: function (e) {console.log(e)}
                        })
                    }
                    return func;
                }
                for(var i=0;i< n.length;i++){
                    $getstunum.push(aaaa(i));
                }
            }
            //异步请求，同事查询多个结业班级就业状态
            async.series($getstunum,function(err, values){
                cb(null,values)
             });
        }],
        function(err, result) {
            response.send(result);
        });
};

//用户推荐统计
exports.getuserreco=function(request,response){
    async.waterfall([function(cb){//请求在职用户
        mysqlConnect.sqlConnect({
            sql:"select u_id,u_name from em_user where u_stutas=1",
            dataArr:[],
            success:function(data){
                cb(null,data);
            },
            error: function (e) {console.log(e)}
        })
    },function(n,cb){
        //异步请求用户推荐，安排面试，录用和就业人数
        async.series([
            function (cb) {//请求用户推荐人次
                //$dataArr 数据库限制条件值 $timeLimit限制条件
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //推荐开始时间
                if(request.body.start){
                    $dataArr.push(request.body.start+" 00:00:00");
                    $timeLimit.push(" AND r_time>=?")
                }
                //推荐结束时间
                if(request.body.end){
                    $dataArr.push(request.body.end+" 23:59:59");
                    $timeLimit.push("AND r_time<=?")
                }
                //连接数据库
                mysqlConnect.sqlConnect({
                    sql:"SELECT r_u_id,COUNT(*) AS recoNum FROM em_recommend WHERE r_u_id IN ("+$zhanwei+")"+$timeLimit.join(" ")+" GROUP BY r_u_id",
                    dataArr:$dataArr,
                    success:function(data){
                        cb(null,data);
                    },
                    error: function (e) {console.log(e)}
                })
            },function (cb) {//请求用户安排面试人次
                //$dataArr 数据库限制条件值 $timeLimit限制条件
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //开始时间
                if(request.body.start){
                    $dataArr.push(request.body.start);
                    $timeLimit.push(" AND i_addtime>=?")
                }
                //结束时间
                if(request.body.end){
                    $dataArr.push(request.body.end);
                    $timeLimit.push("AND i_addtime<=?")
                }
                mysqlConnect.sqlConnect({
                    sql:"SELECT i_u_id,COUNT(*) AS interNum FROM em_interview WHERE i_u_id IN ("+$zhanwei+")"+$timeLimit.join(" ")+" GROUP BY i_u_id",
                    dataArr:$dataArr,
                    success:function(data){
                        cb(null,data);
                    },
                    error: function (e) {console.log(e)}
                })
            },function (cb) {//请求录用人次
                //$dataArr 数据库限制条件值 $timeLimit限制条件
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //推荐开始时间
                if(request.body.start){
                    $dataArr.push(request.body.start);
                    $timeLimit.push(" AND i_employtime>=?")
                }
                //推荐结束时间
                if(request.body.end){
                    $dataArr.push(request.body.end);
                    $timeLimit.push("AND i_employtime<=?")
                }
                mysqlConnect.sqlConnect({
                    sql:"SELECT i_u_id,COUNT(*) AS employNum FROM em_interview WHERE i_employ=1 AND i_u_id IN ("+$zhanwei+")"+$timeLimit.join(" ")+" GROUP BY i_u_id",
                    dataArr:$dataArr,
                    success:function(data){
                        cb(null,data);
                    },
                    error: function (e) {console.log(e)}
                })
            },function (cb) {//请求就业人次
                //$dataArr 数据库限制条件值 $timeLimit限制条件
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //开始时间
                if(request.body.start){
                    $dataArr.push(request.body.start);
                    $timeLimit.push(" AND s_getjobtime>=?")
                }
                //结束时间
                if(request.body.end){
                    $dataArr.push(request.body.end);
                    $timeLimit.push("AND s_getjobtime<=?")
                }
                mysqlConnect.sqlConnect({
                    sql:"SELECT s_u_id,COUNT(*) AS getjobNum FROM em_student WHERE s_u_id IN ("+$zhanwei+")"+$timeLimit.join(" ")+" GROUP BY s_u_id",
                    dataArr:$dataArr,
                    success:function(data){
                        cb(null,data);
                    },
                    error: function (e) {console.log(e)}
                })
            }
        ],function(err, values){
            revalue(0,"r_u_id","recoNum");
            revalue(1,"i_u_id","interNum");
            revalue(2,"i_u_id","employNum");
            revalue(3,"s_u_id","getjobNum");

            //数据解析
            function revalue(num,id,name){
                for(var b=0;b< n.length;b++){
                    for(var a=0;a<values[num].length;a++){
                        if(n[b].u_id==values[num][a][id])n[b][name]=values[num][a][name];
                    }
                    if(n[b][name]==undefined){n[b][name]=0}
                }
            }

            cb(null,n);
        });
    }],function(err, result) {
        response.send(result);
    })
};

//未结业班级待就业人数
exports.getwaitjobstu= function (request, response) {
    var c_id=request.body.c_id.split(","),$zhanwei=[];
    for(var i=0;i<c_id.length;i++){$zhanwei.push("?");}
    mysqlConnect.sqlConnect({
        sql:"SELECT s_c_id,COUNT(*) AS stuNum FROM em_student WHERE s_c_id IN ("+$zhanwei.join()+") AND s_jobstatus=1 GROUP BY s_c_id",
        dataArr:c_id,
        success:function(data){
            response.send(data)
        },
        error: function (e) {console.log(e)}
    })
};

//本周就业数据
exports.getthisweek=function(request,response){
    var this_week=date_edit.week();//获取本周时间段
    mysqlConnect.sqlConnect({
        sql:"SELECT s_jobstatus,COUNT(*) AS stuNum FROM em_student WHERE s_getjobtime>=? AND s_getjobtime<=? AND s_jobstatus IN (2,3,6) GROUP BY s_jobstatus",
        dataArr:this_week,
        success:function(data){
            response.send(data)
        },
        error: function (e) {console.log(e)}
    })
};

//未就业总人数
exports.nojoball=function(request,response){
    mysqlConnect.sqlConnect({
        sql:"SELECT COUNT(*) AS nojobNum FROM em_student,em_class WHERE c_id=s_c_id AND s_jobstatus=1 AND c_endtime<?",
        dataArr:[date_edit.date(new Date())],
        success:function(data){
            response.send(data)
        },
        error: function (e) {console.log(e)}
    })
};