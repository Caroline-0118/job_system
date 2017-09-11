

/*
 删除通用类
 */

//引入sql连接类
var mysqlConnect=require("./sqlConnect.js");

exports.dele=function(option){
    //del_id删除ID  table删除表
    var ids=option.del_id.split(","),delSql,$where;
    if(ids.length==1)$where=option.sel_id+"=?";
    if(ids.length>1){
        var $zhanwei=[];
        for(var i=0;i<ids.length;i++){$zhanwei.push("?")}
        $where="IN ("+$zhanwei.join()+")";
    }
    delSql="DELETE FROM "+option.table+" WHERE "+$where;
    //连接数据库
    mysqlConnect.sqlConnect({
        sql:delSql,   //sql语句
        dataArr:ids, //查询条件值
        success:function(data){   //成功
            option.success({result:true});
        },
        error:function(error){  //失败处理
            console.log(error);
            option.success({result:false});
        }
    });
};
