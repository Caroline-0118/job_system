
//获取班级列表
$("#stu-table").jqGrid({
    url:"/querystulist.do",
    datatype: "json",
    height: $(window).height()-313,
    colNames:['班级','','姓名','性别','联系电话','就业状态','专业技能评价',"综合素质评价","学历","毕业学校","毕业专业","毕业时间","备注","查看详情"],
    colModel:[
        {name:'c_name',index:'c_name', width:100, sorttype:"text", editable: true},
        {name:'c_id',index:'c_id',hidden : true},
        {name:'s_name',index:'s_name', width:100, sorttype:"text", editable: true},
        {name:'s_sex',index:'s_sex', width:100,editable: true, sorttype:"text"},
        {name:'s_phone',index:'s_phone', width:100, editable: true, sorttype:"text"},
        {name:'s_jobstatus',index:'s_jobstatus', width:100, editable: true,sorttype:"text"},
        {name:'s_skill',index:'s_skill', width:100, editable: true, sorttype:"text"},
        {name:'s_quality',index:'s_quality', width:100, editable: true, sorttype:"text"},
        {name:'s_education',index:'s_education', width:100, editable: true, sorttype:"text"},
        {name:'s_school',index:'s_school', width:100, editable: true, sorttype:"text"},
        {name:'s_major',index:'s_major', width:100, editable: true,sorttype:"text"},
        {name:'s_graduation',index:'s_graduation', width:100, editable: true, sorttype:"text"},
        {name:'s_remark',index:'s_remark', width:100, editable: true, sorttype:"text"},
        {name:'take_detail',index:'take_detail', width:100, editable: true, sorttype:"text"}
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
    gridComplete : function() {
        var $mytds=$("td[aria-describedby='stu-table_take_detail']");
        for(var i=0;i<$mytds.length;i++){
            $mytds[i].innerHTML="<a style='cursor: pointer;' class='take_detail' role='button'> 查看详情 </a>";
        }
        var $skills=$("td[aria-describedby='stu-table_s_skill']");
        var $que=$("td[aria-describedby='stu-table_s_quality']");
        for(var j=0;j<$skills.length;j++){
            switch ($skills[j].innerHTML){
                case "0" : $skills[j].innerHTML="D"; break;
                case "1" : $skills[j].innerHTML="C-"; break;
                case "2" : $skills[j].innerHTML="C"; break;
                case "3" : $skills[j].innerHTML="C+"; break;
                case "4" : $skills[j].innerHTML="B-"; break;
                case "5" : $skills[j].innerHTML="B"; break;
                case "6" : $skills[j].innerHTML="B+"; break;
                case "7" : $skills[j].innerHTML="A-"; break;
                case "8" : $skills[j].innerHTML="A"; break;
                case "9" : $skills[j].innerHTML="A+"; break;
                default : $skills[j].innerHTML=""; break;
            }
            switch ($que[j].innerHTML){
                case "0" : $que[j].innerHTML="D"; break;
                case "1" : $que[j].innerHTML="C-"; break;
                case "2" : $que[j].innerHTML="C"; break;
                case "3" : $que[j].innerHTML="C+"; break;
                case "4" : $que[j].innerHTML="B-"; break;
                case "5" : $que[j].innerHTML="B"; break;
                case "6" : $que[j].innerHTML="B+"; break;
                case "7" : $que[j].innerHTML="A-"; break;
                case "8" : $que[j].innerHTML="A"; break;
                case "9" : $que[j].innerHTML="A+"; break;
                default : $que[j].innerHTML=""; break;
            }
        }
    },
    caption: "学员基本信息列表",
    autowidth: true
});

//查询
$("#search").click(function(){
    var data=$("#form-search").serialize();
    jQuery("#stu-table").jqGrid("setGridParam",{
        url:"/querystulist.do?"+data
    }).trigger("reloadGrid");
    // $("#form-search").css("display","none");
    //if(this.innerHTML.indexOf("导出")>0){}
});
// 导出
$('#down-stu').click(function(){
    var data = $("#form-search").serialize();
    var URL = '/querystulist.do?isExport=true&fileName=studentInfo.xlsx&type=stuInfo&'+data
    window.location = URL

})

//监听回车查询
$("#form-search").on("keydown",'input',function(key){
    if(key.keyCode == 13){
        $("#search").click();
    }
})
//初始化班级下拉菜单
function getclass(){
    $("#calss-search").html("");
    $.ajax({
        url:"/queryclasslist.do",
        success: function (data) {
            var mydata=JSON.parse(data);
            for(var i=0;i<mydata.content.length;i++){
                $("#s_c_id").html($("#s_c_id").html()+"<option value='"+mydata.content[i].c_id+"'>"+
                    mydata.content[i].c_name+"</option>");
            }
            $("#s_c_id").selectpicker();
        }
    });
}

// 毕业状态更改
$("#gradu_state").change(function(){
    var status = $(this).val();
    var time = new Date();
    var dataTime = time.toLocaleDateString();

    if(status == '1'){
        $("#starttime-search").val('');
        $("#endtime-search").val(dataTime);
    }else if(status =='2'){
        $("#starttime-search").val(dataTime);
        $("#endtime-search").val('');
    }
})
$("#starttime-search").click(function(){
    $("#gradu_state").val('0')
})
$("#endtime-search").click(function(){
    $("#gradu_state").val('0')
})
//添加学员
$("#add-stu").click(function(){
    //重置表单
    $("#stu-form").get(0).reset();
    $("#stu-form").attr('action','/addstu.do');
    getclass();
    formValidator();
});

//    编辑学员
//    判断选择一行
$("#stu-table").click(function () {
    var selrows=$("#stu-table").jqGrid("getGridParam","selarrrow");
    if(selrows.length!=1){
        $("#edit-stu").get(0).href="#"
    }else{
        $("#edit-stu").get(0).href="#modal-form"
    }
});
//编辑学员
$("#edit-stu").click(function () {
    getclass();
    if($("#stu-table").jqGrid('getGridParam','selarrrow').length==1){
        var selrow = $("#stu-table").jqGrid('getGridParam','selrow');
        var seldata = $("#stu-table").jqGrid("getRowData",selrow);
        $("#s_name").val(seldata.s_name);
        $("#s_sex").val(seldata.s_sex);
        $("#s_phone").val(seldata.s_phone);
        $("#s_school").val(seldata.s_school);
        $("#s_major").val(seldata.s_major);
        $("#s_graduation").val(seldata.s_graduation);
        $("#s_remark").val(seldata.s_remark);
        setTimeout(function(){$("#s_c_id").val(seldata.c_id);},10);
        for(var i=0;i<$("#s_education option").length;i++){
            if(seldata.s_education==$("#s_education option")[i].innerHTML)
                $("#s_education option")[i].selected=true;
            else $("#s_education option")[i].selected=false;
        }
        $("#stu-form").attr('action','/editstu.do');
        formValidator();
    }else{
        alertBox({message:"请选择一行进行编辑！"});
    }
});

//表单验证函数
function formValidator(){
    if($('#stu-form').data('bootstrapValidator')){//重置
        $("#stu-form").data('bootstrapValidator').destroy();
        $('#stu-form').data('bootstrapValidator', null);
    }
    $("#stu-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            s_name: {
                validators: {
                    notEmpty: {
                        message: '姓名不能为空！'
                    }
                }
            },
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();//阻止表单默认事件
        $('.close').trigger('click');//关闭弹框
        var $form = $(e.target),bv = $form.data('bootstrapValidator'),data;
        //添加数据
        if($form.attr('action')=="/addstu.do") data=$form.serialize()+"&s_jobstatus=1";
        //编辑数据
        else data=$form.serialize()+"&s_id="+$("#stu-table").jqGrid('getGridParam','selrow');
        //发送请求
        $.post($form.attr('action'),data, function(data) {
            if($form.attr('action')=="/addstu.do"){
                if(data.result) alertBox({message:"添加成功！"});
                else alertBox({message:"添加失败！"});
            }else{
                if(data.result) alertBox({message:"修改成功！"});
                else alertBox({message:"修改失败！"});
            }
            $("#stu-table").trigger("reloadGrid");
        });
    });
}

//弹出查询
// $("#showSearch").click(function () {
    // 默认展示查询信息
    $("#form-search").css({"display":"block","width":$(".alert-block").width()+30+"px"});
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

//查看详情
$("#stu-table").on("click",".take_detail",function(){
    //取消选中行
    var myids = $("#stu-table").jqGrid('getGridParam','selarrrow');
    var idStr=JSON.stringify(myids);
    var newids=JSON.parse(idStr);
    for(var i=0;i<newids.length;i++){
        $("#stu-table").jqGrid('setSelection',newids[i]);
    }
    $(this).parent().parent().trigger("click");
    //页面跳转
    var selid = $("#stu-table").jqGrid('getGridParam','selrow');
    window.sessionStorage.s_id=selid;
    $("#w-page").load("../view/student_information.html");
});

//删除学员
$("#del-stu").click(function () {
    var myids = $("#stu-table").jqGrid('getGridParam','selarrrow');
    if(myids.length>=1){
        $.post("/delstu.do","s_id="+myids.join(),function(data){
            if(data.result) alertBox({message:"删除成功！"});
            else alertBox({message:"删除失败！请先删除该学员的回访、面试和推荐记录！"});
            $("#stu-table").trigger("reloadGrid");
        });
    }else alertBox({message:"请选择需要删除的学员！"});
});

//时间编辑器
$("#s_graduation,#starttime-search").datetimepicker({
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
$("#s_graduation,#endtime-search").datetimepicker({
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