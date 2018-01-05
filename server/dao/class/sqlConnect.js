
/*
����mysql
 ����
 option={
 sql:"",  //sql���
 dataArr:"",  //��������
 success:function(data){},  //�ɹ�
 error:function(error){}  //ʧ��
 };
 */

//����mysqlģ��
var mysql = require("../../node_modules/mysql");

exports.sqlConnect=function(option){
    var myConnect=mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123456",
        port: "3306",
        database: "job_system",
        multipleStatements:true
    });
    myConnect.connect();//�������ݿ�
    myConnect.query(option.sql,option.dataArr,function(error,data){
        if(!error) option.success(data);
        else option.error(error);
    });
    myConnect.end();//�ر����ݿ�
};
