

/*
    添加通用类
*/

//引入sql连接类
var mysqlConnect=require("./sqlConnect.js");

exports.add=function(option){
    //nameArr所有添加字段名数组  dataArr所有添加字段的值数组
    var nameArr=[],dataArr=[],zhanwei=[],type=option.request.body.type;
    for (var key in option.request.body) {
        nameArr.push(key);
        dataArr.push(option.request.body[key]);
        zhanwei.push("?");
    }
    var addSql="INSERT INTO "+option.table+" ("+nameArr.join()+")" +
        " VALUES("+zhanwei.join()+");";
    //连接数据库
    mysqlConnect.sqlConnect({
        sql:addSql,   //sql语句
        dataArr:dataArr, //查询条件值
        success:function(data){   //成功
            if(type=="0"){ //返回查询id
                option.success({id:data.insertId})
            }
            option.success({result:true});
        },
        error:function(error){  //失败处理
            console.log(error);
            option.success({result:false});
        }
    });
};