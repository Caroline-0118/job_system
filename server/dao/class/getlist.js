
/*
获取列表通类
 */

//引入sql连接类
var mysqlConnect=require("./sqlConnect.js");

exports.getlist=function(option){
    var dataArr,limit,fenye,
        page=parseInt(option.request.query.page),
        rows=parseInt(option.request.query.rows);

    //判断是否需要分页
    if(!page) fenye="";
    else fenye="LIMIT ?,?";

    //判定是否定义输出数据列，默认为*
    if(!option.showcol) option.showcol="*";

    //判断是否存在查询条件
    if(!option.limitname) {
        limit="";
        dataArr=[(page-1)*rows,rows];
    }else{
        limit=option.limitname;
        dataArr=option.limitdata.concat(option.limitdata);
        dataArr.push((page-1)*rows);
        dataArr.push(rows);
    }

    //sql语句拼接
    var querySql="SELECT "+option.showcol+",(SELECT COUNT(*) FROM "+option.table+
        " "+limit+") AS totalcount FROM "+option.table+
        " "+limit+" ORDER BY "+option.order+
        " DESC "+fenye;
    console.log(querySql)
    console.log(dataArr)
    //dataArr
    mysqlConnect.sqlConnect({
        sql:querySql,             //sql语句
        dataArr:dataArr, //查询条件值
        success:function(data){   //查询成功处理函数
            var totalcount,totalpage;
            for(var i=0;i<data.length;i++){
                totalcount=data[i].totalcount;
            }
            totalpage=Math.ceil(totalcount/rows);
            var result={
                content:data,
                totalpage:totalpage,//总页数
                totalcount:totalcount//总条数
            };
            option.success(result);
        },
        error:function(error){console.log(error)} //查询失败
    });
};

