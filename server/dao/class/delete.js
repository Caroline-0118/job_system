

/*
 ɾ��ͨ����
 */

//����sql������
var mysqlConnect=require("./sqlConnect.js");

exports.dele=function(option){
    //del_idɾ��ID  tableɾ����
    var ids=option.del_id.split(","),delSql,$where;
    if(ids.length==1)$where=option.sel_id+"=?";
    if(ids.length>1){
        var $zhanwei=[];
        for(var i=0;i<ids.length;i++){$zhanwei.push("?")}
        $where="IN ("+$zhanwei.join()+")";
    }
    delSql="DELETE FROM "+option.table+" WHERE "+$where;
    //�������ݿ�
    mysqlConnect.sqlConnect({
        sql:delSql,   //sql���
        dataArr:ids, //��ѯ����ֵ
        success:function(data){   //�ɹ�
            option.success({result:true});
        },
        error:function(error){  //ʧ�ܴ���
            console.log(error);
            option.success({result:false});
        }
    });
};
