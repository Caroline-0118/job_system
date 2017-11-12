
//获取班级列表
$("#user-table").jqGrid({
    url:"/queryuserlist.do",
    datatype: "json",
    height: $(window).height()-313,
    colNames:['用户ID','用户名','用户密码','用户状态','用户类别'],
    colModel:[
        {name:'u_id',index:'u_id', width:50, sorttype:"text", editable: true},
        {name:'u_name',index:'u_name', width:100, sorttype:"text", editable: true},
        {name:'u_password',index:'u_password', width:100,editable: true, sorttype:"text"},
        {name:'u_stutas',index:'u_stutas', width:100, editable: true, sorttype:"text"},
        {name:'u_type',index:'u_type', width:100, editable: true, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#user-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,

    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "u_id"
    },
    prmNames : {
        page:"page",
        rows:"rows"
    },

    //设置按钮图标
    loadComplete : function() {
        var table = this;
        setTimeout(function updatePagerIcons(table) {
            var replacement =
            {
                'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
                'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
                'ui-icon-seek-next' : 'icon-angle-right bigger-140',
                'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
            };
            $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
                var icon = $(this);
                var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
            })
        }, 0);
    },
    gridComplete : function() {//用户状态判断
        var mytd=$("td[aria-describedby='user-table_u_stutas']");
        for(var i=0;i<mytd.length;i++){
            if(mytd[i].innerHTML=="1")mytd[i].innerHTML="在职";
            if(mytd[i].innerHTML=="2")mytd[i].innerHTML="离职";
        }
        // 用户类型判断
        var typelist=$("td[aria-describedby='user-table_u_type']");
        for(var i=0;i<typelist.length;i++){
            if(typelist[i].innerHTML=="01")typelist[i].innerHTML="超级管理员";
            if(typelist[i].innerHTML=="02")typelist[i].innerHTML="管理员";
            if(typelist[i].innerHTML=="03")typelist[i].innerHTML="普通用户";
            if(typelist[i].innerHTML=="04")typelist[i].innerHTML="人事专员";
            if(typelist[i].innerHTML=="05")typelist[i].innerHTML="推荐人";
        }
    },
    caption: "用户列表",
    autowidth: true
});
//查询
$("#search").click(function(){
    var data=$(".form-search").serialize();
    jQuery("#user-table").jqGrid("setGridParam",{
        url:"/queryuserlist.do?"+data
    }).trigger("reloadGrid");
});
//添加用户
$("#add-user").click(function(){
    //重置表单
    $("#user-form").get(0).reset();
    $("#user-form").attr('action','/adduser.do');
    formValidator();
});

//    编辑班级
//    判断选择一行
$("#user-table").click(function () {
    var selrows=$("#user-table").jqGrid("getGridParam","selarrrow");
    if(selrows.length!=1){
        $("#edit-user").get(0).href="#";

    }else{
        $("#edit-user").get(0).href="#modal-form";
    }
});
//编辑班级
$("#edit-user").click(function () {
    if($("#user-table").jqGrid('getGridParam','selarrrow').length==1){
        var selrow = $("#user-table").jqGrid('getGridParam','selrow');
        var seldata = $("#user-table").jqGrid("getRowData",selrow);
        console.log(seldata);
        $("#u_name").val(seldata.u_name);
        $("#u_password").val(seldata.u_password);
        if(seldata.u_stutas=="在职") $("#u_stutas").val("1");
        if(seldata.u_stutas=="离职") $("#u_stutas").val("2");
        // 用户类型填充
        if(seldata.u_type=="超级管理员") $("#u_type").val("01");
        if(seldata.u_type=="管理员") $("#u_type").val("02");
        if(seldata.u_type=="普通用户") $("#u_type").val("03");
        if(seldata.u_type=="人事专员") $("#u_type").val("04");
        if(seldata.u_type=="推荐人") $("#u_type").val("05");
        $("#user-form").attr('action','/edituser.do');
        formValidator();
    }else{
        alertBox({message:"请选择一行进行编辑！"});
    }

});

//表单验证函数
function formValidator(){
    if($('#user-form').data('bootstrapValidator')){//重置
        $("#user-form").data('bootstrapValidator').destroy();
        $('#user-form').data('bootstrapValidator', null);
    }
    $("#user-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            u_name: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空！'
                    }
                }
            },
            u_password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();//阻止表单默认事件
        $('.close').trigger('click');//关闭弹框
        var $form = $(e.target),bv = $form.data('bootstrapValidator'),data;
        if($form.attr('action')=="/adduser.do") data=$form.serialize();
        else data=$form.serialize()+"&u_id="+$("#user-table").jqGrid('getGridParam','selrow');
        $.post($form.attr('action'),data, function(data) {
            if($form.attr('action')=="/adduser.do"){
                if(data.result) alertBox({message:"添加成功！"});
                else alertBox({message:"添加失败！"});
            }else{
                if(data.result) alertBox({message:"修改成功！"});
                else alertBox({message:"修改失败！"});
            }
            $("#user-table").trigger("reloadGrid");
        });
    });
}
