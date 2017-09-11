//注入类
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var date_edit=require("./class/date_edit.js");

//获取班级列表
exports.getclassroomlist=function(request,response){
    var c_name=request.query.c_name,c_endtime=request.query.c_endtime,
        option={
            request:request,  //请求参数
            table:"em_class",  //查询的数据表
            order:"c_id"  //排序列
        };
    if(c_name!=undefined){
        if(c_endtime==""){
            option.limitname="WHERE c_name LIKE ?";
            option.limitdata=["%"+c_name+"%"]
        }else{
            option.limitname="WHERE c_name LIKE ? AND c_endtime>?";
            option.limitdata=["%"+c_name+"%",c_endtime]
        }
    }
    option.success=function(data){  //返回数据处理函数
        for(var i=0;i<data.content.length;i++) {
            //开班时间
            if(data.content[i].c_begintime!="0000-00-00"&&data.content[i].c_begintime!=null)
                data.content[i].c_begintime=date_edit.date(data.content[i].c_begintime);
            else
                data.content[i].c_begintime="";
            //结业时间
            if(data.content[i].c_endtime!="0000-00-00"&&data.content[i].c_endtime!=null)
                data.content[i].c_endtime=date_edit.date(data.content[i].c_endtime);
            else
                data.content[i].c_endtime="";
        }
        response.send(JSON.stringify(data));
    };
    getlist.getlist(option);
};

//添加班级
exports.addclass=function(request,response){
    add.add({
        request:request,
        table:"em_class",
        success:function(data){
            response.send(data);
        }
    });
};

//编辑班级
exports.editclass=function(request,response){
    edit.edit({
        request:request,
        table:"em_class",
        editid:"c_id",  //编辑列的id键名
        success:function(data){
            console.log(data);
            response.send(data);
        }
    });
};

//删除班级
exports.delclass=function(request,response){
    mydelete.dele({
        del_id:request.body.c_id,
        sel_id:"c_id",
        table:"em_class",
        success:function(data){
            response.send(data);
        }
    })
};
