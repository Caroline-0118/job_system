
/*
启用mysql
 参数
 option={
 sql:"",  //sql语句
 dataArr:"",  //数据数组
 success:function(data){},  //成功
 error:function(error){}  //失败
 };
 */

//引入mysql模块
var mysql = require("../../node_modules/mysql");

exports.sqlConnect=function(option){
    var myConnect=mysql.createConnection({
        host: "47.94.98.159",
        user: "root",
        password: "mysqlpasswd",
        port: "3306",
        database: "job_system"
    });
    myConnect.connect();//开启数据库
    myConnect.query(option.sql,option.dataArr,function(error,data){
        if(!error) option.success(data);
        else option.error(error);
    });
    myConnect.end();//关闭数据库
};

