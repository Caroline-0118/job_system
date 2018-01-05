/**
 * 第二版数据库连接，使用了数据库连接池
 * 使用了数据库事物，执行多条SQL语句
 * 更新时间2017年11月10日
 */
var mysql=require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'job_system',
    port: 3306,
    multipleStatements:true
});
var mysql = {
    query : function(sql,arr,callback){
        pool.getConnection(function(err,conn){
            if(err){
                callback(err,null,null);
            }else{
                conn.query(sql,arr,function(qerr,vals,fields){
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr,vals,fields);
                });
            }
        });
    },
    multiQuery : function(sql,arr,fn){

        //    var pool=mysql.createPool(this.config);
           pool.getConnection(function(err,connection){
               if(err){
                   console.log(err)
               }
               connection.query(sql,arr,fn);
               connection.release();// ͷ     
           });
       }   
}

module.exports=mysql;