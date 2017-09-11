﻿//获取学员id
var stu_id=window.sessionStorage.s_id;
sessionStorage.removeItem('s_id');
//初始化下拉框
$.ajax({
    url:"/queryclasslist.do",
    success:function(data){
        var $classes=JSON.parse(data).content;
        for(var i=0;i<$classes.length;i++){
            $("#s_c_id").html($("#s_c_id").html()+"<option value='"+$classes[i].c_id+"'>"+$classes[i].c_name+"</option>");
        }
        //初始化推荐人下拉菜单
        $.ajax({
            url:"/queryuserlist.do",
            data:{u_stutas:"1,2"},
            success:function(data){
                var $users=JSON.parse(data).content;
                for(var i=0;i<$users.length;i++){
                    if($users[i].u_name)$("#s_u_id").html($("#s_u_id").html()+"<option value='"+$users[i].u_id+"'>"+$users[i].u_name+"</option>");
                }

                //初始化就业方向下拉菜单
                $.ajax({
                    url: "/queryjobdirelist.do",
                    success: function (data) {

                        var $dire = JSON.parse(data).content;$("#s_j_id").html("<option value='1'> </option>");
                        for (var i = $dire.length-1; i >=0 ; i--) {
                            if($dire[i].j_name!="")$("#s_j_id").html($("#s_j_id").html() + "<option value='" + $dire[i].j_id + "'>" + $dire[i].j_name + "</option>");
                        }

                        //初始化学生信息
                        $.ajax({
                            url:"/querystulist.do",
                            data:{s_id:stu_id},
                            success: function (data) {
                                var $student=JSON.parse(data).content[0];
                                var $input=$("#stu-info input,#stu-info select,#stu-job input,#stu-job select");
                                $input.each(function () {
                                    $(this).attr("disabled",true);
                                    for(var key in $student){
                                        if(this.name==key) $(this).val($student[key]);
                                    }
                                });
                                if($student.s_trueresume)$("#s_trueresume").attr("href","../files/"+$student.s_trueresume).html($student.s_trueresume);
                                if($student.s_falseresume)$("#s_falseresume").attr("href","../files/"+$student.s_falseresume).html($student.s_falseresume);
                                $("#s_education option").each(function(){
                                    if(this.innerHTML==$student.s_education) this.selected=true;
                                    else this.selected=false;
                                });
                                $("#s_jobstatus option").each(function(){
                                    if(this.innerHTML==$student.s_jobstatus) this.selected=true;
                                    else this.selected=false;
                                });
                                $("#s_u_id").selectpicker({noneSelectedText:''});
                                $("button[data-id='s_u_id']").removeClass("btn").removeClass("btn-default").removeClass("dropdown-toggle")
                                    .css({"width":"83.3%","height":"100%"})
                            }
                        });
                    }
                });


            }
        });
    }
});
//初始化面试记录表
$.ajax({
    url:"/queryinterlist.do",
    data:{i_s_id:stu_id},
    success: function (data) {
        var $interviews=JSON.parse(data).content;
        for(var i=0;i<$interviews.length;i++){
            if(!$interviews[i].i_writeresult) $interviews[i].i_writeresult="";
            if(!$interviews[i].i_faceresult) $interviews[i].i_faceresult="";
            if(!$interviews[i].i_retestresult) $interviews[i].i_retestresult="";
            if(!$interviews[i].i_employ) $interviews[i].i_employ="";
            if(!$interviews[i].i_entryresult) $interviews[i].i_entryresult="";
            $("#inter-table tbody").html($("#inter-table tbody").html()+"<tr><td class='center'>"+$interviews[i].i_time+
                "</td><td class='center'>" +$interviews[i].b_name+
                "</td><td class='center'>" +$interviews[i].i_job+
                "</td><td class='center'>" +$interviews[i].i_writeresult+
                "</td><td class='center'>" +$interviews[i].i_faceresult+
                "</td><td class='center'>" +$interviews[i].i_retestresult+
                "</td><td class='center'>" +$interviews[i].i_employ+
                "</td><td class='center'>" +$interviews[i].i_entryresult+
                "</td></tr>");
        }
        $('#inter-table').dataTable({
            //"lengthMenu": [ 5, 10, 15 ],
            //"bPaginate": true,
            "bLengthChange": true,
            "bFilter": false,
            "bInfo": false
        });
        $('#inter-table').prev().remove();
        $('#inter-table').next().remove();
    }
});



//修改学员信息
$(".changeInfo").click(function(){
    var $form=$(this).parent().parent().parent();
    var $input = $($form).find("input,select");
    $input.each(function () {
        $(this).attr("disabled",false);
    });
    $("button[data-id='s_u_id']").removeAttr("aria-disabled").removeClass("disabled");
    $("#s_trueresume").attr("disabled",true);
    $("#s_falseresume").attr("disabled",true);
});

$(".sure_change").click(function(){
    var $form=$(this).parent().parent().parent();
    var $value=$form.serializeArray(),$data={};
    for(var i=0;i<$value.length;i++){
        $data[$value[i].name]=$value[i].value;
    }
    $data.s_id=stu_id;
    $.ajax({
        url:"/editstu.do",
        type:"post",
        data:$data,
        success:function(data){
            console.log(data);
            if(data.result){
                alertBox({message:"修改成功！"});
                $($form).find("input,select").each(function () {
                    $(this).attr("disabled",true);
                });
                $("button[data-id='s_u_id']").attr("aria-disabled","true").addClass("disabled");
            }else alertBox({message:"修改失败！"});
        }
    });
});

//删除简历
$(".delresume").click(function(){
    if($(this).prev().html()!="未上传"){
        $.post("/delsturemuse.do","s_id="+stu_id+"&"+$(this).prev().attr("id")+"="+$(this).prev().html(),function(data){
            if(data.result) {
                alertBox({message:"删除成功！"});
                $(this).prev().html("未上传");
            }
            else alertBox({message:"删除失败！"});
        })
    }
});

//初始化回访记录
initVisited();
function initVisited(){
    $.get("/getvisitedlist.do","s_id="+stu_id,function(data){
        var mydata=JSON.parse(data).content;
        $("#visited_list").html("");
        for(var i=0;i<mydata.length;i++){
            $("#visited_list").html($("#visited_list").html()+
                "<div class='itemdiv dialogdiv'>"+
                "<div class='body row'>"+
                "<div class='time'>"+
                "<i class='icon-time'></i>"+
                    "<input type='hidden' id='v_id' value='"+mydata[i].v_id+"'/>"+
                "<span class='green'> "+mydata[i].v_time+"</span>"+
                "</div>"+
                "<div class='name'><a href='#'>"+mydata[i].u_name+"</a></div>"+
                "<div class='text col-xs-11'>&nbsp;&nbsp;"+mydata[i].v_content+"</div>"+
                "<div class='tools'>"+
                "<a role='button' class='btn btn-minier btn-info delete_visited'><i class='icon-remove'></i></a>"+
                "</div>"+
                "</div>"+
                "</div>"
            );
        }
    });
}


//添加回访信息
$("#add_visited").click(function(){
    var v_content=$("#v_content").val();
    if(!v_content)alertBox({message:"请输入回访信息！"});
    else{
        $.post("/addvisited.do","v_s_id="+stu_id+"&v_type="+$("#v_type").val()+"&v_content="+$("#v_content").val(),function(data){
            console.log(data);
            if(data.result)initVisited();
            else alertBox({message:"添加失败！"})
        })
    }
});

//删除回访
$("#visited_list").on("click",".delete_visited",function(){
    $.post("/delvisited.do","v_id="+$("#v_id").val(),function(data){
        if(data.result)initVisited();
        else alertBox({message:"删除失败！"})
    });
});

//配置简历上传按钮
$(' #true-resume').ace_file_input({
    no_file:'请上传真实简历！',
    btn_choose:'Choose',
    btn_change:'Change',
    droppable:false,
    onchange:null,
    thumbnail:false
});
$('#false-resume').ace_file_input({
    no_file:'请上传包装简历！',
    btn_choose:'Choose',
    btn_change:'Change'
});

//上传简历
$("#upload_resume").click(function(){
    var true_sesume=$("#true-resume").val();
    var false_sesume=$("#false-resume").val();
    var hadfile1=false,hadfile2=false;
    var data = new FormData();
    if(true_sesume!=undefined&&true_sesume!=null&&true_sesume!=""){
        hadfile1=true;
        var file1 = $('#true-resume')[0].files;
        data.append('true_sesume',file1[0]);
    }
    if(false_sesume!=undefined&&false_sesume!=null&&false_sesume!=""){
        hadfile2=true;
        var file2 = $('#false-resume')[0].files;
        data.append('false_sesume',file2[0]);
    }
    if(hadfile1||hadfile2){
        $.ajax({
            url:'/up_semue.do?s_id='+stu_id,
            cache: false,
            type: 'post',
            dataType: 'json',
            data : data,
            contentType: false,
            processData: false,
            success : function (data) {
                $('.close').trigger('click');//关闭弹框
                if(data.result) alertBox({message:"上传简历成功！"});
                else alertBox({message:"上传简历失败！"});
            }
        });
    }
});

//时间编辑器
$("#s_getjobtime").datetimepicker({
    format: 'YYYY-MM-DD',
    icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-arrows ',
        clear: 'fa fa-trash',
        close: 'fa fa-times'
    }
});
