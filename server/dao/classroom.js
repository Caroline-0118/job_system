//ע����
var getlist=require("./class/getlist.js");
var add=require("./class/add.js");
var edit=require("./class/edit.js");
var mydelete=require("./class/delete.js");
var date_edit=require("./class/date_edit.js");

//��ȡ�༶�б�
exports.getclassroomlist=function(request,response){
    var c_name=request.query.c_name,c_endtime=request.query.c_endtime,
        option={
            request:request,  //�������
            table:"em_class",  //��ѯ�����ݱ�
            order:"c_id"  //������
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
    option.success=function(data){  //�������ݴ�����
        for(var i=0;i<data.content.length;i++) {
            //����ʱ��
            if(data.content[i].c_begintime!="0000-00-00"&&data.content[i].c_begintime!=null)
                data.content[i].c_begintime=date_edit.date(data.content[i].c_begintime);
            else
                data.content[i].c_begintime="";
            //��ҵʱ��
            if(data.content[i].c_endtime!="0000-00-00"&&data.content[i].c_endtime!=null)
                data.content[i].c_endtime=date_edit.date(data.content[i].c_endtime);
            else
                data.content[i].c_endtime="";
        }
        response.send(JSON.stringify(data));
    };
    getlist.getlist(option);
};

//��Ӱ༶
exports.addclass=function(request,response){
    add.add({
        request:request,
        table:"em_class",
        success:function(data){
            response.send(data);
        }
    });
};

//�༭�༶
exports.editclass=function(request,response){
    edit.edit({
        request:request,
        table:"em_class",
        editid:"c_id",  //�༭�е�id����
        success:function(data){
            console.log(data);
            response.send(data);
        }
    });
};

//ɾ���༶
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
