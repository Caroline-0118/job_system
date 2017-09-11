
var bustype=window.localStorage.bustype,height;
if(bustype) {
    height=200;
    sessionStorage.removeItem('bustype');
}else  height=$(window).height()-313;
//获取班级列表
$("#bus-table").jqGrid({
    url:"/querybuslist.do",
    datatype: "json",
    height: height,
    colNames:['公司ID','公司名称','公司地址','联系人','联系电话','备注'],
    colModel:[
        {name:'b_id',index:'b_id', width:50, sorttype:"text"},
        {name:'b_name',index:'b_name', width:100, sorttype:"text"},
        {name:'b_address',index:'b_address', width:100,sorttype:"text"},
        {name:'b_contactor',index:'b_contactor', width:100, sorttype:"text"},
        {name:'b_contactnum',index:'b_contactnum', width:100, sorttype:"text"},
        {name:'b_remark',index:'b_remark', width:100,  sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#bus-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,
    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "b_id"
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
    autowidth: true
});

//查询
$("#search").click(function(){
    jQuery("#bus-table").jqGrid("setGridParam",{
        url:"/querybuslist.do?b_name="+encodeURIComponent($("#busname-search").val())
    }).trigger("reloadGrid");
});

//添加公司
$("#add-bus").click(function(){
    //重置表单
    $("#bus-form").get(0).reset();
    $("#bus-form").attr('action','/addbus.do');
    formValidator();
});

//    编辑班级
//    判断选择一行
$("#bus-table").click(function () {
    var selrows=$("#bus-table").jqGrid("getGridParam","selarrrow");
    if(selrows.length!=1){
        $("#edit-bus").get(0).href="#"
    }else{
        $("#edit-bus").get(0).href="#modal-form"
    }
});
//编辑企业
$("#edit-bus").click(function () {
    if($("#bus-table").jqGrid('getGridParam','selarrrow').length==1){
        var selrow = $("#bus-table").jqGrid('getGridParam','selrow');
        var seldata = $("#bus-table").jqGrid("getRowData",selrow);
        $("#b_name").val(seldata.b_name);
        $("#b_address").val(seldata.b_address);
        $("#b_contactor").val(seldata.b_contactor);
        $("#b_contactnum").val(seldata.b_contactnum);
        $("#b_remark").val(seldata.b_remark);
        $("#bus-form").attr('action','/editbus.do');
        formValidator();
    }else{
        alertBox({message:"请选择一行进行编辑！"});
    }
});

//表单验证函数
function formValidator(){
    if($('#bus-form').data('bootstrapValidator')){//重置
        $("#bus-form").data('bootstrapValidator').destroy();
        $('#bus-form').data('bootstrapValidator', null);
    }
    $("#bus-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            b_name: {
                validators: {
                    notEmpty: {
                        message: '公司名称不能为空！'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();//阻止表单默认事件
        $('.close').trigger('click');//关闭弹框
        var $form = $(e.target),bv = $form.data('bootstrapValidator'),data;
        if($form.attr('action')=="/addbus.do") data=$form.serialize();
        else data=$form.serialize()+"&b_id="+$("#bus-table").jqGrid('getGridParam','selrow');
        //发送请求
        $.post($form.attr('action'),data, function(data) {
            if($form.attr('action')=="/addbus.do"){
                if(data.result) alertBox({message:"添加成功！"});
                else alertBox({message:"添加失败！"});
            }else{
                if(data.result) alertBox({message:"修改成功！"});
                else alertBox({message:"修改失败！"});
            }
            $("#bus-table").trigger("reloadGrid");
        });
    });
}

//删除班级
$("#del-bus").click(function () {
    var myids = $("#bus-table").jqGrid('getGridParam','selarrrow');
    if(myids.length>=1){
        $.post("/delbus.do","b_id="+myids.join(),function(data){
            if(data.result) alertBox({message:"删除成功！"});
            else alertBox({message:"删除失败！请先删除该公司所有面试和推荐记录！"});
            $("#bus-table").trigger("reloadGrid");
        });
    }else alertBox({message:"请选择需要删除的公司！"});
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