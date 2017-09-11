
//获取班级列表
$("#class-table").jqGrid({
    url:"/queryclasslist.do",
    datatype: "json",
    height: $(window).height()-313,
    colNames:['班级ID','班级名称','项目经理','人事经理','教室地址',"开班时间","结业时间","QQ群","备注"],
    colModel:[
        {name:'c_id',index:'c_id', width:50, sorttype:"text", editable: true},
        {name:'c_name',index:'c_name', width:100, sorttype:"text", editable: true},
        {name:'c_manager',index:'c_manager', width:100,editable: true, sorttype:"text"},
        {name:'c_hr',index:'c_hr', width:100, editable: true, sorttype:"text"},
        {name:'c_address',index:'c_address', width:100, sortable:false,editable: true,sorttype:"text"},
        {name:'c_begintime',index:'c_begintime', width:100, editable: true, sorttype:"text"},
        {name:'c_endtime',index:'c_endtime', width:100, editable: true, sorttype:"text"},
        {name:'c_qq',index:'c_qq', width:100, editable: true, sorttype:"text"},
        {name:'c_remark',index:'c_remark', width:100, editable: true, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#class-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,

    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "c_id"
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
    caption: "班级列表",
    autowidth: true
});

//查询
$("#search").click(function(){
    jQuery("#class-table").jqGrid("setGridParam",{
        url:"/queryclasslist.do?c_name="+$("#class-search").val()+"&c_endtime="+$("#endtime-search").val()
    }).trigger("reloadGrid");
});

//添加班级
$("#add-class").click(function(){
    //重置表单
    $("#class-form").get(0).reset();
    $("#class-form").attr('action','/addclass.do');
    formValidator();
});

//    编辑班级
//    判断选择一行
$("#class-table").click(function () {
    var selrows=$("#class-table").jqGrid("getGridParam","selarrrow");
    if(selrows.length!=1){
        $("#edit-class").get(0).href="#";
        $("#up-xlsx").get(0).href="#";

    }else{
        $("#edit-class").get(0).href="#modal-form";
        $("#up-xlsx").get(0).href="#modal-form2";
    }
});
//编辑班级
$("#edit-class").click(function () {
    if($("#class-table").jqGrid('getGridParam','selarrrow').length==1){
        var selrow = $("#class-table").jqGrid('getGridParam','selrow');
        var seldata = $("#class-table").jqGrid("getRowData",selrow);
        $("#c_name").val(seldata.c_name);
        $("#c_manager").val(seldata.c_manager);
        $("#c_hr").val(seldata.c_hr);
        $("#c_begintime").val(seldata.c_begintime);
        $("#c_endtime").val(seldata.c_endtime);
        $("#c_address").val(seldata.c_address);
        $("#c_remark").val(seldata.c_remark);
        $("#c_qq").val(seldata.c_qq);
        $("#class-form").attr('action','/editclass.do');
        formValidator();
    }else{
        alertBox({message:"请选择一行进行编辑！"});
    }

});

//表单验证函数
function formValidator(){
    if($('#class-form').data('bootstrapValidator')){//重置
        $("#class-form").data('bootstrapValidator').destroy();
        $('#class-form').data('bootstrapValidator', null);
    }
    $("#class-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            c_name: {
                validators: {
                    notEmpty: {
                        message: '班级名称不能为空！'
                    }
                }
            },
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();//阻止表单默认事件
        $('.close').trigger('click');//关闭弹框
        var $form = $(e.target),bv = $form.data('bootstrapValidator'),data;
        //添加数据
        if($form.attr('action')=="/addclass.do") data=$form.serialize();
        //编辑数据
        else data=$form.serialize()+"&c_id="+$("#class-table").jqGrid('getGridParam','selrow');
        //发送请求
        $.post($form.attr('action'),data, function(data) {
            if($form.attr('action')=="/addclass.do"){
                if(data.result) alertBox({message:"添加成功！"});
                else alertBox({message:"添加失败！"});
            }else{
                if(data.result) alertBox({message:"修改成功！"});
                else alertBox({message:"修改失败！"});
            }
            $("#class-table").trigger("reloadGrid");
        });
    });
}

$("#file").change(function(){
    var name=$("#file").val().split("\\");
    $("#filename").val(name[name.length-1]);
});

$("#up-xlsx").click(function () {
    if($("#class-table").jqGrid('getGridParam','selarrrow').length!=1)alertBox({message:"请选择一个班级导入学生！"});
});

//批量添加学员
$("#up_xlsx").click(function () {
    var a=$("#file").val().split(".");
    if(a[a.length-1]=="xlsx"){
        var data = new FormData();
        var files = $('#file')[0].files;
        if (files) {
            data.append('codecsv',files[0]);
        }
        $.ajax({
            url:'/upstu.do?s_c_id='+$("#class-table").jqGrid('getGridParam','selrow'),
            cache: false,
            type: 'post',
            dataType: 'json',
            data : data,
            contentType: false,
            processData: false,
            success : function (data) {
                $('.close').trigger('click');//关闭弹框
                if(data.result) alertBox({message:"导入成功！"});
                else alertBox({message:"文件解析出错！请检查文件格式!"});
            }
        });
    }else alert("请上传xlsx文件！");
});

//删除班级
$("#del-class").click(function () {
    var myids = $("#class-table").jqGrid('getGridParam','selarrrow');
    if(myids.length>=1){
        $.post("/delclass.do","c_id="+myids.join(),function(data){
            if(data.result) alertBox({message:"删除成功！"});
            else alertBox({message:"删除失败！请先删除该班级的所有学员！"});
            $("#class-table").trigger("reloadGrid");
        });
    }else alertBox({message:"请选择需要删除的班级！"});
});

//时间编辑器
$("#c_begintime,#c_endtime,#endtime-search").datetimepicker({
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