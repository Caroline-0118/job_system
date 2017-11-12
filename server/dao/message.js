//注入类
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var mysql=require("./class/newSql.js");
/**
 * 获取消息列表
 */
exports.getMessageList=function(request,response){
    var m_status = request.body.m_status
    var m_user = request.session.u_name
    var sql1 = "SELECT count(*) AS count FROM em_message where m_status=0 AND m_user=?"
    var sql2 = "SELECT count(*) AS count FROM em_message where m_status=1 AND m_user=?"
    var sql3 = "SELECT * FROM em_message where m_user=? AND m_status=? "
    var sql = sql1 +';'+sql2+";"+sql3
    var dataArr = [m_user,m_user,m_user,m_status]
    mysql.multiQuery(sql,dataArr,function(err,result){
        if(err){
            response.send({
                status:1,
                data : "",
                msg : "数据库查询失败"
            })
        }else{
            response.send({
                status:0,
                noRead : result[0][0].count,
                hasRead : result[1][0].count,
                data : result[2],
                msg : ""
            })
        }
    })
};
/**
 * 消息标记为已读
 */
exports.changeMsgStatus = function(request,response){
    var list = request.body.list || []
    var m_status = request.body.m_status || 0
    if(list.length==0){
        response.send({result:false})
        return false
    }
    var sql = 'UPDATE em_message SET m_status='+m_status+' WHERE m_id IN ('+list.toString()+')'
    mysql.query(sql,function(err,result){
        if(err){
            response.send({result:false})
        }else{
            response.send({result:true})
        }
    });
}
/**
 * 删除消息
 */
exports.deleteMessage=function(request,response){
    var list = request.body.list || []
    if(list.length==0){
        response.send({result:false})
        return false
    }
    var sql = 'DELETE FROM em_message WHERE m_id IN ('+list.toString()+')'
    mysql.query(sql,function(err,result){
        if(err){
            response.send({result:false})
        }else{
            response.send({result:true})
        }
    });
};
