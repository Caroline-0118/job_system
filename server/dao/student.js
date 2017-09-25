//注入类
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var date_edit=require("./class/date_edit.js");
var mysqlConnect=require("./class/sqlConnect.js");
var nodeExcel = require('excel-export');
var fs = require('fs');


//获取学员列表
exports.getstulist=function(request,response){

    //定义数据
    var req={
        query:{
            page:request.query.page,
            rows:request.query.rows
        }
    };
    var isExport = request.query.isExport || false ;//判断是否是导出
    var fileName = request.query.fileName || "查询结果";
    //发送请求项
    var option={
        request:req,  //请求参数
        table:"em_student,em_class",  //查询的数据表
        order:"s_id",  //排序列
        limitdata:[],
        limitname:"WHERE s_c_id=c_id"
    };
    //判断查询项
    if(request.query.s_jobstatus!=undefined){
        for(var key in request.query){
            if(request.query[key]!=""&&key.indexOf("_")>0&&key!="_search"){
                option.limitdata.push(request.query[key]);
                req.query[key]=request.query[key];
                if(key=="c_id") option.limitname+=" AND s_c_id=?";
                if(key=="s_name"){
                    option.limitdata.pop();
                    option.limitname+=" AND s_name LIKE ?";
                    option.limitdata.push("%"+request.query.s_name+"%")
                }
                if(key=="s_sex") option.limitname+=" AND s_sex=?";
                if(key=="s_jobstatus") option.limitname+=" AND s_jobstatus=?";
                if(key=="s_skill") option.limitname+=" AND s_skill>=?";
                if(key=="s_quality") option.limitname+=" AND s_quality>=?";
                if(key=="s_graduate") option.limitname+=" AND s_graduation>?";
                if(key=="s_graduation") option.limitname+=" AND s_graduation<?";
                if(key=="s_education") option.limitname+=" AND s_education>=?";
                if(key=="s_english"){
                    option.limitdata.pop();
                    option.limitname+=" AND s_english LIKE ?";
                    option.limitdata.push("%"+request.query.s_english+"%")
                }
                if(key=="s_starttime") option.limitname+=" AND s_getjobtime>?";
                if(key=="s_overtime") option.limitname+=" AND s_getjobtime<?";
                if(key=="s_school"){
                    option.limitdata.pop();
                    option.limitname+=" AND s_school LIKE ?";
                    option.limitdata.push("%"+request.query.s_school+"%")
                }
                if(key=="s_jobunit"){
                    option.limitdata.pop();
                    option.limitname+=" AND s_jobunit LIKE ?";
                    option.limitdata.push("%"+request.query.s_jobunit+"%")
                }
            }
        }
    }
    //s_id查询单条数据
    if(request.query.s_id!=undefined){
        option.limitname+=" AND s_id=?";
        option.limitdata.push(request.query.s_id);
    }
    //返回数据处理函数
    option.success=function(data){
        for(var i=0;i<data.content.length;i++){

            //毕业时间
            if(data.content[i].s_graduation!="0000-00-00"&&data.content[i].s_graduation!=null)
                data.content[i].s_graduation=date_edit.date(data.content[i].s_graduation);
            else
                data.content[i].s_graduation="";

            //就业时间
            if(data.content[i].s_getjobtime!="0000-00-00"&&data.content[i].s_getjobtime!=null)
                data.content[i].s_getjobtime=date_edit.date(data.content[i].s_getjobtime);
            else
                data.content[i].s_getjobtime="";

            //就业状态
            //1未就业   2已就业(自主就业)  3已就业(推荐就业) 4推迟就业 5放弃就业 6再就业
            switch (data.content[i].s_jobstatus){
                case 1 : data.content[i].s_jobstatus="未就业"; break;
                case 2 : data.content[i].s_jobstatus="已就业(自主就业)"; break;
                case 3 : data.content[i].s_jobstatus="已就业(推荐就业)"; break;
                case 4 : data.content[i].s_jobstatus="推迟就业"; break;
                case 5 : data.content[i].s_jobstatus="放弃就业"; break;
                case 6 : data.content[i].s_jobstatus="再就业"; break;
            }

            //学历
            //1初中 2高中 3中专 4专科 5专科(自考) 6本科 7本科(自考) 8研究生 9博士
            switch (data.content[i].s_education){
                case 0 : data.content[i].s_education=""; break;
                case 1 : data.content[i].s_education="初中"; break;
                case 2 : data.content[i].s_education="高中"; break;
                case 3 : data.content[i].s_education="中专"; break;
                case 4 : data.content[i].s_education="专科"; break;
                case 5 : data.content[i].s_education="专科(自考)"; break;
                case 6 : data.content[i].s_education="本科"; break;
                case 7 : data.content[i].s_education="本科(自考)"; break;
                case 8 : data.content[i].s_education="研究生"; break;
                case 9 : data.content[i].s_education="博士"; break;
            }

            dengji(data.content[i].s_skill);//职业技能等级
            dengji(data.content[i].s_quality);//综合素质等级
        }
        //专业技能和综合素质评定
        //0-9  表示  D,C-,C,C+,B-,B,B+,A-,A,A+
        function dengji(obj){
            switch (obj){
                case "0" : obj="D"; break;
                case "1" : obj="C-"; break;
                case "2" : obj="C"; break;
                case "3" : obj="C+"; break;
                case "4" : obj="B-"; break;
                case "5" : obj="B"; break;
                case "6" : obj="B+"; break;
                case "7" : obj="A-"; break;
                case "8" : obj="A"; break;
                case "9" : obj="A+"; break;
            }
        }
        // 判断是否是导出
        if(!isExport){
            response.send(JSON.stringify(data));
        }else{
            var conf = {}
            // 导出数据
            conf.stylesXmlFile =  __dirname+"/export.xml";
            conf.name = "mysheet";
            var rows = [];
            if (request.query.type == 'stuInfo') {
                 conf.cols = [{caption:'班级',type:'string',width:15
                },{caption:'姓名',type:'string',width:15
                },{caption:'性别',type:'string',width:20
                },{caption:'联系电话',type:'string',width:15
                },{caption:'就业状态',type:'string',width:20
                },{caption:'专业技能评价',type:'string',width:30
                },{caption:'综合素质评价',type:'string',width:30
                },{caption:'学历',type:'string',width:30
                },{caption:'毕业学校',type:'string',width:30
                },{caption:'毕业专业',type:'string',width:30
                },{caption:'毕业时间',type:'string',width:30
                },{caption:'备注',type:'string',width:30
                }];
                
                for(var i=0;i<data.content.length;i++){
                    var rr = [];
                    var skill = ''
                    switch (data.content[i].s_skill.toString()){
                        case "0" : skill="D"; break;
                        case "1" : skill="C-"; break;
                        case "2" : skill="C"; break;
                        case "3" : skill="C+"; break;
                        case "4" : skill="B-"; break;
                        case "5" : skill="B"; break;
                        case "6" : skill="B+"; break;
                        case "7" : skill="A-"; break;
                        case "8" : skill="A"; break;
                        case "9" : skill="A+"; break;
                        default : skill = "暂无"; break;
                    }
                    rr.push(data.content[i].c_name); //班级
                    rr.push(data.content[i].s_name); //姓名
                    rr.push(data.content[i].s_sex); //性别
                    rr.push(data.content[i].s_phone); //联系电话
                    rr.push(data.content[i].s_jobstatus); //就业状态
                    rr.push(skill); //专业技能评价
                    rr.push(data.content[i].s_english); //综合素质评价
                    rr.push(data.content[i].s_education); //学历
                    rr.push(data.content[i].s_school); //毕业学校
                    rr.push(data.content[i].s_major); //毕业专业
                    rr.push(data.content[i].s_graduation); //毕业时间
                    rr.push(data.content[i].s_remark); //备注
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
        // response.send(JSON.stringify(data));
    };
    getlist.getlist(option);

};

//添加学员
exports.addstu=function(request,response){
    if(request.body.s_graduation=="")request.body.s_graduation="0000-00-00";

    add.add({
        request:request,
        table:"em_student",
        success:function(data){
            response.send(data);
        }
    });
};

//编辑学员
exports.editstu=function(request,response){
    if(request.body.s_graduation=="") request.body.s_graduation="0000-00-00";
    if(request.body.s_getjobtime=="") request.body.s_getjobtime="0000-00-00";
    if(request.body.s_u_id=="") request.body.s_u_id==null;
    console.log(request.body);
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

//删除学员
exports.delstu=function(request,response){
    mydelete.dele({
        del_id:request.body.s_id,
        sel_id:"s_id",
        table:"em_student",
        success:function(data){
            response.send(data);
        }
    })
};

//删除学员简历
exports.delsturemuse=function(request,response){
    var $set,s_id=request.body.s_id,
        s_trueresume=request.body.s_trueresume,
        s_falseresume=request.body.s_falseresume;
    if(s_trueresume) $set="s_trueresume=''";
    if(s_falseresume) $set="s_falseresume=''";
    console.log("UPDATE em_student SET"+$set+" WHERE s_id=?");
    mysqlConnect.sqlConnect({
        sql:"UPDATE em_student SET "+$set+" WHERE s_id=?",
        dataArr:[s_id],
        success:function(data){
            response.send({result:true})
        },
        error:function(e){
            console.log(e);
            response.send({result:false})
        }
    })
};

//获取就业方向列表
exports.queryjobdirelist= function (request, response) {
    console.log(1111);
    getlist.getlist({
        request:request,  //请求参数
        table:"em_jobdirection",  //查询的数据表
        order:"j_id",  //排序列
        success:function(data){
            response.send(JSON.stringify(data));
        }
    });
};