

/*
    ���ͨ����
*/

//����sql������
var mysqlConnect=require("./sqlConnect.js");

exports.add=function(option){
    //nameArr��������ֶ�������  dataArr��������ֶε�ֵ����
    var nameArr=[],dataArr=[],zhanwei=[],type=option.request.body.type;
    for (var key in option.request.body) {
        nameArr.push(key);
        dataArr.push(option.request.body[key]);
        zhanwei.push("?");
    }
    var addSql="INSERT INTO "+option.table+" ("+nameArr.join()+")" +
        " VALUES("+zhanwei.join()+");";
    //�������ݿ�
    mysqlConnect.sqlConnect({
        sql:addSql,   //sql���
        dataArr:dataArr, //��ѯ����ֵ
        success:function(data){   //�ɹ�
            if(type=="0"){ //���ز�ѯid
                option.success({id:data.insertId})
            }
            option.success({result:true});
        },
        error:function(error){  //ʧ�ܴ���
            console.log(error);
            option.success({result:false});
        }
    });
};