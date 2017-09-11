//配置登录人员
(function(){
    getsession({
        getcol:"name",
        success:function(data){
            console.log(document.cookie);
            if(data.length)$("#uname").html(data[0].u_name+"<small>你好！</small>");
            else window.location = "../index.html";
            if(data[0].u_id=="1"){
                $("head").append("<style type='text/css'>.quanxian{display:block !important;}</style>");
            }
        }
    })
})();
//会话超时
$("body")[0].addEventListener('click',function(event){
    getsession({
        getcol:"name",
        success:function(data){
            if(!data.length){
                var e = window.event || event;
                if (e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
                alert("会话超时!");
                window.location = "../index.html";
            }
        }
    })
},true);
//获取session
function getsession(option){
    $.ajax({
        url:"/getsession.do",
        data:{getcol:option.getcol},//获取用户ID getcol:"id" 获取用户姓名 getcol:"name"
        type:"post",
        success:function(data){option.success(data);}
    });
}

//加载首页
$("#w-page").load("../view/index.html");
//返回首页
$("#back_index").click(function () {
    $("#w-page").load("../view/index.html");
    $("#breadcrumb").html("<li><i class='icon-home home-icon'></i> 首页 </li>")
});

//页面跳转
$(".w-menu").click(function(e){
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    var my_menu=this.getElementsByTagName("span")[0].innerHTML;
    //页面跳转
    if(my_menu=="学员基本信息") $("#w-page").load("../view/stuInfo.html");
    if(my_menu=="学员就业信息") $("#w-page").load("../view/stuJob.html");
    if(my_menu=="班级信息") $("#w-page").load("../view/classInfo.html");
    if(my_menu=="面试信息") $("#w-page").load("../view/interviewInfo.html");
    if(my_menu=="面试企业信息") $("#w-page").load("../view/businessInfo.html");
    if(my_menu=="添加面试") $("#w-page").load("../view/addInterview.html");
    if(my_menu=="班级就业进度") $("#w-page").load("../view/census-jobstatus.html");
    if(my_menu=="班级就业统计") $("#w-page").load("../view/census-job.html");
    if(my_menu=="员工推荐统计") $("#w-page").load("../view/census-user.html");
    if(my_menu=="用户管理") $("#w-page").load("../view/userInfo.html");
    if(my_menu=="学员回访信息") $("#w-page").load("../view/stuVisited.html");
    if(my_menu=="添加学员回访") $("#w-page").load("../view/addvisited.html");
    //导航条显示
    if($(this).next().length==0) $("#breadcrumb").html("<li><i class='icon-home home-icon'></i>"+my_menu+"</li>");
    //菜单树标识
    if($(this).parent().parent().hasClass("submenu")){
        for(var i=0;i<$(".submenu .w-menu").length;i++){
            if($(".submenu .w-menu")[i]==this){
                $(this).find("i").css("display","inline-block");
                $(this).css("color","red");
            }else{
                $($(".submenu .w-menu")[i]).find("i").css("display","");
                $($(".submenu .w-menu")[i]).css("color","");
            }
        }
    }
});

//修改密码
$("#change_password").click(function(){
    $("#changepass-form").get(0).reset();
    if($('#changepass-form').data('bootstrapValidator')){//重置
        $("#changepass-form").data('bootstrapValidator').destroy();
        $('#changepass-form').data('bootstrapValidator', null);
    }
    $("#changepass-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            u_password: {
                validators: {
                    remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                        url: '/checkpass.do',//验证地址
                        message: '原密码不正确！',//提示消息
                        type: 'POST'//请求方式
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {message: '密码不能为空！'},
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度必须在6到30之间'
                    },
                    identical: {
                        field: 're_password',
                        message: '两次密码不一致'
                    },
                    different: {
                        field: 'u_password',
                        message: '不能和原密码相同'
                    }

                }
            },
            re_password: {
                validators: {
                    identical: {
                        field: 'password',
                        message: '两次密码不一致'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();//阻止表单默认事件
        $('.close').trigger('click');//关闭弹框
        $.post($(e.target).attr('action'),"u_password="+$("#password").val(), function(data) {
            if(data.result) alertBox({message:"修改成功！"});
            else alertBox({message:"修改失败！"});
        });
    });
});

//退出登录
$("#myquit").click(function () {
    dialogBox({
        message:"您确认要退出本系统？",
        sure: function () {
            $.post("/logout.do",function(data){
                console.log(data.result);
                if(data.result) window.location = "../index.html";
                else alertBox({message:"退出失败！"});
            });
        }
    });
});

//提示框
var alertBox=function(option){
    bootbox.alert({
        buttons: {
            ok: {
                label: '确定',
                className: 'btn-myStyle'
            }
        },
        message:option.message
    });
    if(option.hasOwnProperty('width')==false){option.width="400"}//默认400
    $(".bootbox .modal-content").css({"margin":"0 auto","width":option.width+"px"});
    setTimeout(function(){$("button[data-bb-handler='ok']").trigger("click");},2000);
};
//确认框
var dialogBox= function (option) {
    bootbox.dialog({
        message: option.message,
        buttons: {
            OK: {
                label: "确定",
                className: "btn-primary",
                callback: option.sure
            },
            Cancel: {
                label: "取消",
                className: "btn-default"
            }

        }
    });
    if(option.hasOwnProperty('width')==false){option.width="400"}//默认400
    $(".bootbox .modal-content").css({"margin":"0 auto","width":option.width+"px"});

};
//导出Excel
function ExportToExcel(tableId){ //读取表格中每个单元到EXCEL中
    try{
        var curTbl = document.getElementById(tableId);
        var oXL = new ActiveXObject("Excel.Application");
        //创建AX对象excel
        var oWB = oXL.Workbooks.Add();
        //获取workbook对象
        var oSheet = oWB.ActiveSheet;
        var lenRow = curTbl.rows.length;
        //取得表格行数
        for (i = 0; i < lenRow; i++) {
            var lenCol = curTbl.rows(i).cells.length;
            //取得每行的列数
            for (j = 0; j < lenCol; j++){
                oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
            }
        }
        oXL.Visible = true;
        //设置excel可见属性
    }catch(e){
        dialogBox({message:"请使用IE浏览器进行“导出到EXCEL”操作！IE不能导出，请设置IE的安全级别。具体操作：" +
        "工具 → Internet选项 → 安全 → 自定义级别 → ActiveX 控件和插件 → 对未标记为可安全执行脚本的ActiveX 控件初始化并执行脚本 → 启用 → 确定"});
    }
}