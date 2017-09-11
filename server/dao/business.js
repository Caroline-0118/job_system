//注入类
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");

//获取班级列表
exports.getbuslist=function(request,response){
    var b_name=request.query.b_name,b_id=request.query.b_id,
        option={
            request:request,  //请求参数
            table:"em_business",  //查询的数据表
            order:"b_id",  //排序列
            success:function(data){  //返回数据处理函数
                response.send(JSON.stringify(data));
            }
        };
    if(b_name!=undefined){
        option.limitname="WHERE b_name LIKE ?";
        option.limitdata=["%"+b_name+"%"]
    }
    if(b_id!=undefined){
        option.limitname="WHERE b_id=?";
        option.limitdata=[b_id]
    }
    getlist.getlist(option);
};

//添加班级
exports.addbus=function(request,response){
    add.add({
        request:request,
        table:"em_business",
        success:function(data){
            response.send(data);
        }
    });
};

//编辑企业
exports.editbus=function(request,response){
    edit.edit({
        request:request,
        table:"em_business",
        editid:"b_id",  //编辑列的id键名
        success:function(data){
            response.send(data);
        }
    });
};

//删除企业
exports.delbus=function(request,response){
    mydelete.dele({
        del_id:request.body.b_id,
        sel_id:"b_id",
        table:"em_business",
        success:function(data){
            response.send(data);
        }
    })
};

