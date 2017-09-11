

/*
编辑通用类
 */

//引入sql连接类
var mysqlConnect=require("./sqlConnect.js");

exports.edit=function(option){
    //nameArr所有添加字段名数组  dataArr所有添加字段的值数组
    var nameArr=[],dataArr=[],decide;
    for (var key in option.request.body) {
        if(key!=option.editid) nameArr.push(key+"=?");
        dataArr.push(option.request.body[key]);
    }
    if(option.type=="many"){
        var data=option.request.body.s_id.split(","),$num=[];
        for(var i=0;i<data.length;i++){$num.push("?")}
        decide=" IN ("+$num.join()+")";
        dataArr.pop();
        dataArr=dataArr.concat(data);
    }else{
        decide="=?"
    }
    var editSql="UPDATE "+option.table+" SET "+nameArr.join()+" WHERE "+option.editid+decide;
    //连接数据库
    mysqlConnect.sqlConnect({
        sql:editSql,
        dataArr:dataArr,
        success:function(data){
            option.success({result:true});
        },
        error:function(error){
            console.log(error)
            option.success({result:false});
        }
    });
};
