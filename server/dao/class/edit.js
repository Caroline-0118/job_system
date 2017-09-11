

/*
�༭ͨ����
 */

//����sql������
var mysqlConnect=require("./sqlConnect.js");

exports.edit=function(option){
    //nameArr��������ֶ�������  dataArr��������ֶε�ֵ����
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
    //�������ݿ�
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
