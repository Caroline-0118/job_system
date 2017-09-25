
//获取班级列表
$("#stu-table").jqGrid({
    url:"/querystulist.do",
    datatype: "json",
    height: $(window).height()-313,
    colNames:['班级','','姓名',"毕业学校",'就业状态','就业时间','就业企业','实习/试用工资',"转正工资","备注"],
    colModel:[
        {name:'c_name',index:'c_name', width:100, sorttype:"text", editable: true},
        {name:'c_id',index:'c_id',hidden : true},
        {name:'s_name',index:'s_name', width:100, sorttype:"text", editable: true},
        {name:'s_school',index:'s_school', width:100, editable: true, sorttype:"text"},
        {name:'s_jobstatus',index:'s_jobstatus', width:100, editable: true,sorttype:"text"},
        {name:'s_getjobtime',index:'s_getjobtime', width:100,editable: true, sorttype:"text"},
        {name:'s_jobunit',index:'s_jobunit', width:100, editable: true, sorttype:"text"},
        {name:'s_shixijobpay',index:'s_shixijobpay', width:100, editable: true, sorttype:"text"},
        {name:'s_jobpay',index:'s_jobpay', width:100, editable: true, sorttype:"text"},
        {name:'s_remark',index:'s_remark', width:100, editable: true, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#stu-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,

    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "s_id"
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
    caption: "学员就业信息列表",
    autowidth: true
});

//查询
$("#search").click(function(){
    var data=$("#form-search").serialize();
    jQuery("#stu-table").jqGrid("setGridParam",{
        url:"/querystulist.do?"+data
    }).trigger("reloadGrid");
    // $("#form-search").css("display","none");
});

$('#export').click(function(){
    var data = $("#form-search").serialize();
    var URL = '/querystulist.do?isExport=true&fileName=studentInfo.xlsx&type=stuJob&'+data
    window.location = URL
})
//监听回车查询
$("#form-search").on("keydown",'input',function(key){
    if(key.keyCode == 13){
        $("#search").click();
    }
})
//    编辑学员
//    判断选择一行
$("#stu-table").click(function () {
    var selrows=$("#stu-table").jqGrid("getGridParam","selarrrow");
    if(selrows.length==0){
        $("#edit-stu").get(0).href="#"
    }else{
        $("#edit-stu").get(0).href="#modal-form"
    }
});
//选择就业状态
$("#s_jobstatus").change(function () {
    if($("#s_jobstatus").val()==2||$("#s_jobstatus").val()==3){
        for(var i=0;i<$("#stuJob-form input").length;i++){
            $("#stuJob-form input").eq(i).attr({"disabled":false,"placeholder":"请输入！"});
        }
    }else{
        for(var j=0;j<$("#stuJob-form input").length;j++){
            $("#stuJob-form input").eq(j).attr({"disabled":true,"placeholder":""});
        }
    }
});
//编辑学员
$("#edit-stu").click(function () {
    if($("#stu-table").jqGrid('getGridParam','selarrrow').length==0)alertBox({message:"请选择一行或者多行进行编辑！"});
});
$("#stuJob-form").submit(function(e){
    e.preventDefault();
    $('.close').trigger('click');
    var selrows = $("#stu-table").jqGrid('getGridParam','selarrrow'),$form = $(e.target);
    //发送请求
    $.post($form.attr('action'),$form.serialize()+"&s_id="+selrows.join(), function(data) {
        if(data.result) alertBox({message:"修改成功！"});
        else alertBox({message:"修改失败！"});
        $("#stu-table").trigger("reloadGrid");
    });
});

//弹出查询
// $("#showSearch").click(function () {
    $("#form-search").css("display","block");
    $.ajax({
        url:"/queryclasslist.do",
        success: function (data) {
            $("#calss-search").html("<option value=''>全部</option>");
            var mydata=JSON.parse(data);
            for(var i=0;i<mydata.content.length;i++){
                $("#calss-search").html($("#calss-search").html()+"<option value='"+mydata.content[i].c_id+"'>"+
                    mydata.content[i].c_name+"</option>");
            }
            $("#calss-search").selectpicker();
        }
    });
// });
//时间编辑器
$("#starttime-search,#overtime-search,#s_getjobtime").datetimepicker({
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