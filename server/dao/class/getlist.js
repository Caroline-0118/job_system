
/*
��ȡ�б�ͨ��
 */

//����sql������
var mysqlConnect=require("./sqlConnect.js");

exports.getlist=function(option){
    var dataArr,limit,fenye,
        page=parseInt(option.request.query.page),
        rows=parseInt(option.request.query.rows);

    //�ж��Ƿ���Ҫ��ҳ
    if(!page) fenye="";
    else fenye="LIMIT ?,?";

    //�ж��Ƿ�����������У�Ĭ��Ϊ*
    if(!option.showcol) option.showcol="*";

    //�ж��Ƿ���ڲ�ѯ����
    if(!option.limitname) {
        limit="";
        dataArr=[(page-1)*rows,rows];
    }else{
        limit=option.limitname;
        dataArr=option.limitdata.concat(option.limitdata);
        dataArr.push((page-1)*rows);
        dataArr.push(rows);
    }

    //sql���ƴ��
    var querySql="SELECT "+option.showcol+",(SELECT COUNT(*) FROM "+option.table+
        " "+limit+") AS totalcount FROM "+option.table+
        " "+limit+" ORDER BY "+option.order+
        " DESC "+fenye;
    console.log(querySql)
    console.log(dataArr)
    //dataArr
    mysqlConnect.sqlConnect({
        sql:querySql,             //sql���
        dataArr:dataArr, //��ѯ����ֵ
        success:function(data){   //��ѯ�ɹ�������
            var totalcount,totalpage;
            for(var i=0;i<data.length;i++){
                totalcount=data[i].totalcount;
            }
            totalpage=Math.ceil(totalcount/rows);
            var result={
                content:data,
                totalpage:totalpage,//��ҳ��
                totalcount:totalcount//������
            };
            option.success(result);
        },
        error:function(error){console.log(error)} //��ѯʧ��
    });
};

