
var date_edit=require("./class/date_edit.js");
var mysqlConnect=require("./class/sqlConnect.js");
var async=require("../node_modules/async");
var nodeExcel = require('excel-export');
//°à¼¶¾ÍÒµÐÅÏ¢Í³¼Æ
exports.getclassstu= function (request, response) {
    async.waterfall([function(cb) 
        {//Í¬²½ÇëÇó£¬ÏÈ²éÑ¯½áÒµ°à¼¶£¬ÔÚ²éÑ¯¸÷¸ö°à¼¶¾ÍÒµ×´Ì¬
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
                sql:"select c_hr,c_closetime,c_name,c_id,c_endtime,c_status from em_class where c_endtime<=?"+$limit,
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
        },
        function(n, cb) {
            var $getstunum=[];
            if(request.body.type==1){//»ñÈ¡±¾ÖÜ¾ÍÒµÈËÊý
                var week=date_edit.week();
                function bbbb(){//±Õ°üÌí¼Ó´«µÝº¯Êý
                    function func(cb){
                        mysqlConnect.sqlConnect({
                            sql:"SELECT s_name,s_c_id FROM em_student WHERE  s_getjobtime>=?"+
                            " AND s_getjobtime<=?",
                            dataArr:[week[0],week[1]],
                            success:function(data){
                                // var mydata={
                                //     c_name:n[num].c_name,
                                //     c_id:n[num].c_id,
                                //     c_endtime:n[num].c_endtime,
                                //     weeknum:data[0].num
                                // };
                                // 遍历每个学生
                                for(var i=0;i<data.length;i++){
                                    var stu = data[i]
                                    // 遍历每个班级
                                    for(var j=0;j<n.length;j++){
                                        var cla = n[j]
                                        // 找到所在的班级
                                        if(stu.s_c_id == cla.c_id){
                                            cla.weeknum = cla.weeknum++ 
                                            cla.list += stu.s_name
                                        }
                                    }
                                   
                                }
                                for(var k=0;k<n.length;k++){
                                    if(!n[k].weeknum){
                                        n[k].weeknum = 0
                                    }
                                }
                                cb(null,n);
                            },
                            error: function (e) {console.log(e)}
                        })
                    }
                    return func;
                }
                // for(var i=0;i< n.length;i++){
                //     $getstunum.push(bbbb(i));
                // }
                $getstunum.push(bbbb());
            }else{//°à¼¶¾ÍÒµ×´Ì¬ÈËÊýÍ³¼Æ
                function aaaa(){
                    function func(cb){
                        var time1 = new Date();
                        console.log('----------time1:'+time1.valueOf())
                        mysqlConnect.sqlConnect({
                            sql:"  SELECT s_jobstatus ,s_c_id,s_name,s_getjobtime,(SELECT u_name FROM em_user AS U WHERE S.s_u_id = U.u_id) AS recommend FROM em_student AS S",
                            success:function(data){
                                var time2 = new Date();
                                console.log('----------time2:'+time2.valueOf())
                                console.log(time2.valueOf() - time1.valueOf());
                                //遍历每个学生
                                for(var i=0;i<data.length;i++){
                                    var stu = data[i];
                                    //遍历所有班级
                                    for(var j=0;j<n.length;j++){
                                        var cla = n[j]
                                        if(stu.s_c_id == cla.c_id){ //找到所在的班级
                                            if(cla.jobstatus_count && cla.jobstatus_count.length>0){
                                                //判断是否已经包含就业状态
                                                var hasFill = false
                                                cla.jobstatus_count.forEach(function(item){
                                                    if(item.s_jobstatus == stu.s_jobstatus){
                                                        item.list.push(stu)
                                                        hasFill = true
                                                        item.num ++
                                                    }
                                                })
                                                if(!hasFill){
                                                    cla.jobstatus_count.push({
                                                        s_jobstatus : stu.s_jobstatus,
                                                        num : 1,
                                                        list : [stu]
                                                    })
                                                }
                                            }else{ //新增工作状态数组
                                                cla.jobstatus_count = [];   
                                                cla.jobstatus_count.push({
                                                    s_jobstatus : stu.s_jobstatus,
                                                    num : 1,
                                                    list : [stu]
                                                })
                                            }
                                        }
                                    }
                                }
                                for(var k=0;k<n.length;k++){
                                    if(!n[k].jobstatus_count){
                                        n[k].jobstatus_count = []
                                    }
                                }
                                cb(null,n);
                            },
                            error: function (e) {console.log(e)}
                        })
                    }
                    return func;
                }
                $getstunum.push(aaaa());
                // for(var i=0;i< n.length;i++){
                //     $getstunum.push(aaaa(i));
                // }
            }
            //Òì²½ÇëÇó£¬Í¬ÊÂ²éÑ¯¶à¸ö½áÒµ°à¼¶¾ÍÒµ×´Ì¬
            async.series($getstunum,function(err, values){
                cb(null,values[0])
             });
        }],
        function(err, result) {
            // response.send(result);
            var isExport = request.query.isExport || false ;//判断是否是导出
            var fileName = request.query.fileName || "查询结果";
            if(!isExport){
                response.send(result);
            }else{
                var conf = {}
                // 导出数据
                conf.stylesXmlFile =  __dirname+"/export.xml";
                conf.name = "mysheet";
                var rows = [];
                if (request.query.type == '1') {
                     conf.cols = [{caption:'毕业时间',type:'string',width:15
                    },{caption:'班级名称',type:'string',width:15
                    },{caption:'总人数',type:'string',width:20
                    },{caption:'需要推荐人数',type:'string',width:15
                    },{caption:'已就业人数',type:'string',width:20
                    },{caption:'推荐就业人数',type:'string',width:30
                    },{caption:'自主就业人数',type:'string',width:30
                    },{caption:'放弃就业人数',type:'string',width:30
                    },{caption:'推迟就业人数',type:'string',width:30
                    },{caption:'再就业人数',type:'string',width:30
                    },{caption:'本周就业人数',type:'string',width:30
                    },{caption:'剩余人数',type:'string',width:30
                    },{caption:'就业率',type:'string',width:30
                    }];
                    
                    for(var i=0;i<data.content.length;i++){
                        var rr = [];
                        rr.push(data.content[i].c_name); //毕业时间
                        rr.push(data.content[i].s_name); //班级名称
                        rr.push(data.content[i].s_sex); //总人数
                        rr.push(data.content[i].s_sex); //需要推荐人数
                        rr.push(data.content[i].s_phone); //已就业人数
                        rr.push(data.content[i].s_jobstatus); //推荐就业人数
                        rr.push(data.content[i].s_phone); //自主就业人数
                        rr.push(data.content[i].s_english); //放弃就业人数
                        rr.push(data.content[i].s_education); //推迟就业人数
                        rr.push(data.content[i].s_school); //再就业人数
                        rr.push(data.content[i].s_major); //本周就业人数
                        rr.push(data.content[i].s_graduation); //剩余人数
                        rr.push(data.content[i].s_remark); //就业率
                        rows.push(rr);   
                        }
                    }else if(request.query.type == 'stuJob'){
                         conf.cols = [{caption:'班级',type:'string',width:15
                        },{caption:'姓名',type:'string',width:15
                        },{caption:'毕业学校',type:'string',width:30
                        },{caption:'就业状态',type:'string',width:30
                        },{caption:'就业企业',type:'string',width:30
                        },{caption:'试用／实习期工资',type:'string',width:30
                        },{caption:'转正工资',type:'string',width:30
                        },{caption:'备注',type:'string',width:30
                        }];
                        
                        for(var i=0;i<data.content.length;i++){
                            var rr = [];
                            rr.push(data.content[i].c_name); //班级
                            rr.push(data.content[i].s_name); //姓名
                            rr.push(data.content[i].s_school); //毕业学校
                            rr.push(data.content[i].s_jobstatus); //就业状态
                            rr.push(data.content[i].s_jobunit); //就业企业
                            rr.push(data.content[i].s_shixijobpay); //试用／实习期工资
                            rr.push(data.content[i].s_jobpay); //转正工资
                            rr.push(data.content[i].s_remark); //备注
                            rows.push(rr); 
                    }
                }
                
                conf.rows = rows;

                var result = nodeExcel.execute(conf);
                response.setHeader('Content-Type', 'application/vnd.openxmlformats');
                response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                response.end(result, 'binary');
            }
        });
};

//ÓÃ»§ÍÆ¼öÍ³¼Æ
exports.getuserreco=function(request,response){
    async.waterfall([function(cb){//ÇëÇóÔÚÖ°ÓÃ»§
        mysqlConnect.sqlConnect({
            sql:"select u_id,u_name from em_user where u_stutas=1",
            dataArr:[],
            success:function(data){
                cb(null,data);
            },
            error: function (e) {console.log(e)}
        })
    },function(n,cb){
        //Òì²½ÇëÇóÓÃ»§ÍÆ¼ö£¬°²ÅÅÃæÊÔ£¬Â¼ÓÃºÍ¾ÍÒµÈËÊý
        async.series([
            function (cb) {//ÇëÇóÓÃ»§ÍÆ¼öÈË´Î
                //$dataArr Êý¾Ý¿âÏÞÖÆÌõ¼þÖµ $timeLimitÏÞÖÆÌõ¼þ
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //ÍÆ¼ö¿ªÊ¼Ê±¼ä
                if(request.body.start){
                    $dataArr.push(request.body.start+" 00:00:00");
                    $timeLimit.push(" AND r_time>=?")
                }
                //ÍÆ¼ö½áÊøÊ±¼ä
                if(request.body.end){
                    $dataArr.push(request.body.end+" 23:59:59");
                    $timeLimit.push("AND r_time<=?")
                }
                //Á¬½ÓÊý¾Ý¿â
                mysqlConnect.sqlConnect({
                    sql:"SELECT r_u_id,COUNT(*) AS recoNum FROM em_recommend WHERE r_u_id IN ("+$zhanwei+")"+$timeLimit.join(" ")+" GROUP BY r_u_id",
                    dataArr:$dataArr,
                    success:function(data){
                        cb(null,data);
                    },
                    error: function (e) {console.log(e)}
                })
            },function (cb) {//ÇëÇóÓÃ»§°²ÅÅÃæÊÔÈË´Î
                //$dataArr Êý¾Ý¿âÏÞÖÆÌõ¼þÖµ $timeLimitÏÞÖÆÌõ¼þ
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //¿ªÊ¼Ê±¼ä
                if(request.query.start){
                    $dataArr.push(request.query.start);
                    $timeLimit.push(" AND i_addtime>=?")
                }
                //½áÊøÊ±¼ä
                if(request.query.end){
                    $dataArr.push(request.query.end);
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
            },function (cb) {//ÇëÇóÂ¼ÓÃÈË´Î
                //$dataArr Êý¾Ý¿âÏÞÖÆÌõ¼þÖµ $timeLimitÏÞÖÆÌõ¼þ
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //ÍÆ¼ö¿ªÊ¼Ê±¼ä
                if(request.query.start){
                    $dataArr.push(request.query.start);
                    $timeLimit.push(" AND i_employtime>=?")
                }
                //ÍÆ¼ö½áÊøÊ±¼ä
                if(request.query.end){
                    $dataArr.push(request.query.end);
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
            },function (cb) {//ÇëÇó¾ÍÒµÈË´Î
                //$dataArr Êý¾Ý¿âÏÞÖÆÌõ¼þÖµ $timeLimitÏÞÖÆÌõ¼þ
                var $dataArr=[],$zhanwei=[],$timeLimit=[],$where;
                for(var i=0;i< n.length;i++){
                    $dataArr.push(n[i].u_id);
                    $zhanwei.push("?");
                }
                //¿ªÊ¼Ê±¼ä
                if(request.query.start){
                    $dataArr.push(request.query.start);
                    $timeLimit.push(" AND s_getjobtime>=?")
                }
                //½áÊøÊ±¼ä
                if(request.query.end){
                    $dataArr.push(request.query.end);
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

            //Êý¾Ý½âÎö
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
        // response.send(result);
        // 判断是否是导出
        var isExport = request.query.isExport || false ;//判断是否是导出
        var fileName = request.query.fileName || "查询结果";
        if(!isExport){
            response.send(result);
        }else{
            var conf = {}

            // 导出数据
            conf.stylesXmlFile =  __dirname+"/export.xml";
            conf.name = "mysheet";
            conf.cols = [{
                caption:'员工姓名',
                type:'string',
                width:20
            },{
                caption:'推荐人次',
                type:'number',
                width:15
            },{
                caption:'安排面试人次',
                type:'number',
                width:15
            },{
                caption:'录用人次',
                type:'number',
                width:20
            },{
                caption:'就业人次',
                type:'number',
                width:15
            },{
                caption:'推荐成功率',
                type:'string',
                width:20
            }];
            var rows = [];
            for(var i=0;i<result.length;i++){
                var rr = [];
                rr.push(result[i].u_name); 
                rr.push(result[i].recoNum); 
                rr.push(result[i].interNum); 
                rr.push(result[i].employNum); 
                rr.push(result[i].getjobNum); 
                rr.push(result[i].getjobNum/result[i].interNum*100 + '%'); 
                rows.push(rr);
            }
            conf.rows = rows;

            var result = nodeExcel.execute(conf);
            response.setHeader('Content-Type', 'application/vnd.openxmlformats');
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            response.end(result, 'binary');
        }
    })
};

//Î´½áÒµ°à¼¶´ý¾ÍÒµÈËÊý
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

//±¾ÖÜ¾ÍÒµÊý¾Ý
exports.getthisweek=function(request,response){
    var this_week=date_edit.week();//»ñÈ¡±¾ÖÜÊ±¼ä¶Î
    mysqlConnect.sqlConnect({
        sql:"SELECT s_jobstatus,COUNT(*) AS stuNum FROM em_student WHERE s_getjobtime>=? AND s_getjobtime<=? AND s_jobstatus IN (2,3,6) GROUP BY s_jobstatus",
        dataArr:this_week,
        success:function(data){
            response.send(data)
        },
        error: function (e) {console.log(e)}
    })
};

//Î´¾ÍÒµ×ÜÈËÊý
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