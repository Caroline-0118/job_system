
var fs = require('fs');
var path = require('../node_modules/path');
var xlsx=require("../node_modules/node-xlsx");
var mysqlConnect=require("./class/sqlConnect.js");
var mysql = require("../node_modules/mysql/index");

//导入学员
exports.upstu=function(req, response) {
    if (req.files && req.files.codecsv != 'undefined') {
        var temp_path = req.files.codecsv.path;//获取文件保存路径
        if (temp_path) {
            var upxlsx = xlsx.parse(temp_path),$zhanwei=[],$dataArr=[];
            if(upxlsx[0].data.length>1){//是否有数据
                var title=upxlsx[0].data[0];
                for(var j=1;j<upxlsx[0].data.length;j++){
                    if(upxlsx[0].data[j].length>0){//该行有数据
                        var $data=upxlsx[0].data[j];
                        $zhanwei.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                        //学历插入
                        switch ($data[5]){
                            case "初中" : $data[5]=1; break;
                            case "高中" : $data[5]=2; break;
                            case "中专" : $data[5]=3; break;
                            case "专科" : $data[5]=4; break;
                            case "专科(自考)" : $data[5]=5; break;
                            case "本科" : $data[5]=6; break;
                            case "本科(自考)" : $data[5]=7; break;
                            case "研究生" : $data[5]=8; break;
                            case "博士" : $data[5]=9; break;
                            default :$data[5]=0; break;
                        }
                        //专业技能和综合素质评定
                        //0-9  表示  D,C-,C,C+,B-,B,B+,A-,A,A+
                        switch ($data[13]){
                            case "C-" : $data[13]=1; break;
                            case "C" : $data[13]=2; break;
                            case "C+" : $data[13]=3; break;
                            case "B-" : $data[13]=4; break;
                            case "B" : $data[13]=5; break;
                            case "B+" : $data[13]=6; break;
                            case "A-" : $data[13]=7; break;
                            case "A" : $data[13]=8; break;
                            case "A+" : $data[13]=9; break;
                            default : $data[13]=-1; break;
                        }
                        switch ($data[14]){
                            case undefined : $data[14]=-1; break;
                            case "D" : $data[14]=0; break;
                            case "C-" : $data[14]=1; break;
                            case "C" : $data[14]=2; break;
                            case "C+" : $data[14]=3; break;
                            case "B-" : $data[14]=4; break;
                            case "B" : $data[14]=5; break;
                            case "B+" : $data[14]=6; break;
                            case "A-" : $data[14]=7; break;
                            case "A" : $data[14]=8; break;
                            case "A+" : $data[14]=9; break;
                            default : $data[14]=-1; break;
                        }
                        //
                        switch ($data[10]){
                            case "" : $data[10]=1; break;case "JAVA" : $data[10]=2; break;
                            case "WEB前端" : $data[10]=3; break;case "UI" : $data[10]=4; break;
                            case "Android" : $data[10]=5; break;case ".net" : $data[10]=6; break;
                            case "PHP" : $data[10]=7; break;case "美工" : $data[10]=8; break;
                            case "大数据" : $data[10]=9; break;case "云计算" : $data[10]=10; break;
                            case "C/C++" : $data[10]=11; break;case "测试工程师" : $data[10]=12; break;
                            case "技术支持" : $data[10]=13; break;case "软件实施" : $data[10]=14; break;
                            case "网络工程师" : $data[10]=15; break;case "运维工程师" : $data[10]=16; break;
                            case "数据库工程师" : $data[10]=17; break;case "电子商务" : $data[10]=18; break;
                            case "网络编辑" : $data[10]=19; break;case "网络推广" : $data[10]=20; break;
                            case "新媒体运营" : $data[10]=21; break;case "客服" : $data[10]=22; break;
                            case "销售" : $data[10]=23; break;case "行政" : $data[10]=24; break;
                            default : $data[10]=25; break;
                        }
                        for(var s=0;s<=15;s++){
                            if($data[s]==undefined) $data[s]="";
                        }
                        console.log($data[6]);
                        if($data[6]=="") $data[6]="0000-00-00";
                        //else $data[6]=new Date(1900, 0, $data[6]);
                        $data.push(req.query.s_c_id);
                        $dataArr = $dataArr.concat($data);
                        //console.log($data[6]);
                    }
                }
                //sql
                var addSql="INSERT INTO em_student " +
                    "(s_name,s_sex,s_idcard,s_school,s_major,s_education,s_graduation,s_phone,s_qq,s_email,s_j_id,s_teamnum,s_english,s_quality,s_skill,s_remark,s_c_id)" +
                    " VALUES "+$zhanwei.join();
                mysqlConnect.sqlConnect({
                    sql:addSql,
                    dataArr:$dataArr,
                    success:function(data){
                        console.log(data);
                        response.send({result:true});
                    },
                    error: function(error){console.log(error)}
                });
            }else {
                response.send({result:false})
            }
            // 删除临时文件
            fs.unlink(temp_path);
        }
    }
};

////导出学员
//exports.downstu=function(req, res, next) {
//    console.log("123123123123");
//    var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
//    var buffer = xlsx.build([{name: "mySheetName", data: data}]);
//    fs.writeFileSync('b.xlsx', buffer, 'binary')
//};

//上传简历
exports.upResume=function(req, response) {
    var resume_address={
        true_resume:"",
        false_resume:""
    };
    if (req.files && req.files.true_sesume != undefined) {
        console.log(req.files.true_sesume.path);
        var path1= req.files.true_sesume.path;
        if(path1){
            var true_path =path1.split("\\");//获取文件保存路径
            resume_address.true_resume=true_path[true_path.length-1];
        }
    }
    console.log(typeof req.files.false_sesume);
    console.log(req.files.false_sesume);
    if (req.files && req.files.false_sesume != undefined) {
        var path2=req.files.false_sesume.path;
        console.log();
        if(path2){
            var false_path = path2.split("\\");//获取文件保存路径
            resume_address.false_resume=false_path[false_path.length-1];
        }
    }
    if(resume_address.false_resume!=""||resume_address.true_resume!=""){
        var update_resume=[],dataArr=[];
        if(resume_address.true_resume!=""){
            update_resume.push("s_trueresume=?");
            dataArr.push(resume_address.true_resume);
        }
        if(resume_address.false_resume!=""){
            update_resume.push("s_falseresume=?");
            dataArr.push(resume_address.false_resume);
        }
        dataArr.push(req.query.s_id);
    }
    console.log(update_resume)
    console.log(dataArr)
    if(update_resume.length>0){
        var upresumeSql="UPDATE em_student SET "+update_resume.join()+" WHERE s_id=? ";
        mysqlConnect.sqlConnect({
            sql:upresumeSql,
            dataArr:dataArr,
            success:function(data){
                console.log(data);
                response.send({result:true});
            },
            error: function(error){
                console.log(error);
                response.send({result:false});
            }
        });
    }

};

