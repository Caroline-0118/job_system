var gridType=1;//1面试列表 2推荐列表

//获取面试列表
$("#inter-table").jqGrid({
    url:"/queryinterlist.do",
    datatype: "json",
    height: $(window).height()-316,
        colNames:['面试反馈','班级','学员ID','姓名','面试时间','面试企业','推荐人',"推荐人ID",'笔试',"面试","复试","录用","入职","试用薪资","正式薪资","备注"],
    colModel:[
        {name:'i_employ',index:'i_employ', width:100, sorttype:"text"},
        {name:'c_name',index:'c_name', width:100, sorttype:"text"},
        {name:'i_s_id',index:'i_s_id', hidden:true},
        {name:'s_name',index:'s_name', width:100, sorttype:"text"},
        {name:'i_time',index:'i_time', width:100, sorttype:"text"},
        {name:'b_name',index:'b_name', width:100, sorttype:"text"},
        {name:'u_name',index:'u_name', width:100, sorttype:"text"},
        {name:'i_u_id',index:'i_u_id', hidden:true},
        {name:'i_writeresult',index:'i_writeresult', width:100, sorttype:"text"},
        {name:'i_faceresult',index:'i_faceresult', width:100, sorttype:"text"},
        {name:'i_retestresult',index:'i_retestresult', width:100, sorttype:"text"},
        {name:'i_employ',index:'i_employ', width:100, sorttype:"text"},
        {name:'i_entryresult',index:'i_entryresult', width:100, sorttype:"text"},
        {name:'i_xishijobpay',index:'i_xishijobpay', width:100, sorttype:"text"},
        {name:'i_jobpay',index:'i_jobpay', width:100, sorttype:"text"},
        {name:'i_remark',index:'i_remark', width:100, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#inter-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,

    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "i_id"
    },
    prmNames : {
        page:"page",
        rows:"rows"
    },
    loadComplete : function() {
        var table = this;
        setTimeout(function updatePagerIcons(table) {
            var replacement ={
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
    gridComplete : function() {//反馈判断
        var mytd=$("tr[tabindex='-1'] td:nth-of-type(2)");
        for(var i=0;i<mytd.length;i++){
            if(mytd[i].innerText==" "){
                var operate="<a style='cursor: pointer;color:red' class='edit-fankui' href='#modal-form' role='button' data-toggle='modal'> 未反馈 </a>";
            }else var operate="<a style='cursor: pointer;' class='edit-fankui' href='#modal-form' role='button' data-toggle='modal'> 已反馈 </a>";
            operate+="<a style='cursor: pointer;' class='delete' role='button'> 删除 </a>";
            mytd[i].innerHTML=operate;
        }
    },
    autowidth: true
});

//获取推荐列表
$("#myTab4 a").click(function () {
    if(this.innerHTML=="推荐列表"){
        if($("#reco-table").html()==""){
            setTimeout(function(){
                $("#reco-table").jqGrid({
                    url:"/queryreclist.do",
                    datatype: "json",
                    height: $(window).height()-316,
                    colNames:['推荐时间','班级','学员ID','姓名','面试企业','推荐人',"推荐职位","备注","添加面试"],
                    colModel:[
                        {name:'r_time',index:'r_time', width:100, sorttype:"text"},
                        {name:'c_name',index:'c_name', width:100, sorttype:"text"},
                        {name:'r_s_id',index:'r_s_id', hidden:true},
                        {name:'s_name',index:'s_name', width:100, sorttype:"text"},
                        {name:'b_name',index:'b_name', width:100, sorttype:"text"},
                        {name:'u_name',index:'u_name', width:100, sorttype:"text"},
                        {name:'r_job',index:'r_job', width:100, sorttype:"text"},
                        {name:'r_remark',index:'r_remark', width:100, sorttype:"text"},
                        {name:'getinter',index:'getinter', width:100, sorttype:"text"}
                    ],
                    viewrecords : true,
                    rowNum:10,
                    rowList:[10,20,50,100],
                    pager : "#reco-pager",
                    altRows: true,
                    toppager: false,
                    multiselect: true,
                    multiboxonly: true,
                    jsonReader: {
                        root:"content",
                        total:"totalpage",
                        records:"totalcount",
                        repeatitems:false,
                        id : "r_id"
                    },
                    prmNames : {
                        page:"page",
                        rows:"rows"
                    },
                    loadComplete : function() {
                        var table = this;
                        setTimeout(function updatePagerIcons(table) {
                            var replacement ={
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
                    gridComplete : function() {//反馈判断
                        var mytd=$("td[aria-describedby='reco-table_getinter']");
                        console.log(mytd);
                        for(var i=0;i<mytd.length;i++){
                            mytd[i].innerHTML="<a style='cursor: pointer;color:#337ab7' class='createInter' role='button'> 生成面试信息 </a>"+
                                "<a style='cursor: pointer;' class='delete' role='button'> 删除 </a>";
                        }
                    },
                    autowidth: true
                });
            },10);
        }
        //禁用
        $("#mianshifankui,#edit-unemploy").css("display","none");
        $("#mianshifankui select").attr("disabled",true);
        $(".interType").html("推荐");
        gridType=2;
    }else{
        $("#mianshifankui,#edit-unemploy").css("display","inline-block");
        $("#mianshifankui select").attr("disabled",false);
        $(".interType").html("面试");
        gridType=1;
    }
});

//查询
//
$("#search").click(function(){
    var data=$("#form-search").serialize();
    if(gridType==1)jQuery("#inter-table").jqGrid("setGridParam",{url:"/queryinterlist.do?"+data}).trigger("reloadGrid");
    if(gridType==2)jQuery("#reco-table").jqGrid("setGridParam",{url:"/queryreclist.do?"+data}).trigger("reloadGrid");
    // $("#form-search").css("display","none");
});
//监听回车查询
$(".form-search").on("keydown",'input',function(key){
    if(key.keyCode == 13){
        $("#search").click();
    }
})
//录用薪资输入
$("#i_employ").change(function(){
    if($("#i_employ").val()=="1"){
        $("#s_jobpay").attr("disabled",false);
        $("#s_shixijobpay").attr("disabled",false);
    }else{
        $("#s_jobpay").attr("disabled",true);
        $("#s_shixijobpay").attr("disabled",true);
    }
});

//    修改面试结果
$("#inter-table").on("click",".edit-fankui",function(){
    //取消选中行
    var myids = $("#inter-table").jqGrid('getGridParam','selarrrow');
    var idStr=JSON.stringify(myids);
    var newids=JSON.parse(idStr);
    for(var i=0;i<newids.length;i++){
        $("#inter-table").jqGrid('setSelection',newids[i]);
    }
    $(this).parent().parent().trigger("click");
    //初始化弹框
    $("#interview-form").get(0).reset();
    var selrow = $("#inter-table").jqGrid('getGridParam','selrow');
    var seldata = $("#inter-table").jqGrid("getRowData",selrow);
    if(seldata.i_writeresult=="失败")$("#i_writeresult").val("0");
    if(seldata.i_writeresult=="成功")$("#i_writeresult").val("1");
    if(seldata.i_faceresult=="失败")$("#i_faceresult").val("0");
    if(seldata.i_faceresult=="成功")$("#i_faceresult").val("1");
    if(seldata.i_retestresult=="失败")$("#i_retestresult").val("0");
    if(seldata.i_retestresult=="成功")$("#i_retestresult").val("1");
    if(seldata.i_employ=="失败")$("#i_employ").val("0");
    if(seldata.i_employ=="成功")$("#i_employ").val("1");
    if(seldata.i_entryresult=="失败")$("#i_entryresult").val("0");
    if(seldata.i_entryresult=="成功")$("#i_entryresult").val("1");
    $("#s_shixijobpay").attr("disabled",true);
    $("#s_jobpay").attr("disabled",true);

    //表单验证函数
    if($('#interview-form').data('bootstrapValidator')){//重置
        $("#interview-form").data('bootstrapValidator').destroy();
        $('#interview-form').data('bootstrapValidator', null);
    }
    $("#interview-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'icon-ok',
            invalid: 'icon-remove',
            validating: 'icon-refresh'
        },
        fields: {
            i_employ: {
                validators: {
                    notEmpty: {
                        message: '录用信息不能为空！'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//验证通过后提交表单
        e.preventDefault();
        $('.close').trigger('click');
        var $form = $(e.target),bv = $form.data('bootstrapValidator');
        var i_id=$("#inter-table").jqGrid('getGridParam','selrow');

        var seldata = $("#inter-table").jqGrid("getRowData",i_id);
        console.log(seldata);
        $.post($form.attr('action'),$form.serialize()+"&i_id="+i_id+"&i_u_id="+seldata.i_u_id+"&b_name="+seldata.b_name, function(data) {
            if(data.result) alertBox({message:"修改成功！"});
            else alertBox({message:"修改失败！"});
            $("#inter-table").trigger("reloadGrid");
        });
    });
});

//标记为未录用
$("#edit-unemploy").click(function(){
    var myids = $("#inter-table").jqGrid('getGridParam','selarrrow');
    for(var i=0;i<myids.length;i++){
        var seldata = $("#inter-table").jqGrid("getRowData",myids[i]);
        if(seldata.i_employ=="失败"||seldata.i_employ=="成功"){
            alertBox({message:"选中行含有已反馈行！请重新选择！"});
            return;
        }
    }
    $.ajax({
        url:"/interresult.do",
        type:"post",
        data:{
            i_id:myids.join(),
            type:"1"
        },
        success: function(data){
            if(data.result) alertBox({message:"修改成功！"});
            else alertBox({message:"修改失败！"});
            $("#inter-table").trigger("reloadGrid");
        }
    })
});

//弹出查询
// $("#showSearch").click(function () {
    $("#form-search").css("display","block");
    //初始化下拉菜单
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
    $.ajax({
        url:"/queryuserlist.do",
        success: function (data) {
            $("#user-search").html("<option value=''>全部</option>");
            var mydata=JSON.parse(data);
            for(var i=0;i<mydata.content.length;i++){
                $("#user-search").html($("#user-search").html()+"<option value='"+mydata.content[i].u_id+"'>"+
                    mydata.content[i].u_name+"</option>");
            }
        }
    });
// })

//导出
$("#daochu").click(function(){
    // window.open('/daochu.do');
     if(gridType==1)jQuery("#inter-table").jqGrid("setGridParam",{url:"/queryinterlist.do?"+data}).trigger("reloadGrid");
    if(gridType==2)jQuery("#reco-table").jqGrid("setGridParam",{url:"/queryreclist.do?"+data}).trigger("reloadGrid");
     var data=$("#form-search").serialize();
     var URL = ''
     if (gridType==1) {
        URL = "/queryinterlist.do?"+data
     }else if (gridType == 2) {
        URL = "/queryreclist.do?"+data
     }
     URL += '&isExport=true&fileName=studentRecommend.xlsx'
     window.location = URL
});

//推荐生成面试
$("#reco-table").on("click",".createInter",function(){
    //取消选中行
    var myids = $("#reco-table").jqGrid('getGridParam','selarrrow');
    var idStr=JSON.stringify(myids);
    var newids=JSON.parse(idStr);
    for(var i=0;i<newids.length;i++){
        $("#reco-table").jqGrid('setSelection',newids[i]);
    }
    $(this).parent().parent().trigger("click");
    //获取选中行
    var selid = $("#reco-table").jqGrid('getGridParam','selrow');
    window.sessionStorage.recoId=selid;
    $("#w-page").load("../view/addInterview.html");
    $("#breadcrumb").html("<li><i class='icon-home home-icon'></i>添加面试</li>");
});

//删除面试和推荐
$(".tab-content").on("click",".delete", function () {
    if(gridType==1){
        //取消选中行
        var myids = $("#inter-table").jqGrid('getGridParam','selarrrow');
        var idStr=JSON.stringify(myids);
        var newids=JSON.parse(idStr);
        for(var i=0;i<newids.length;i++){
            $("#inter-table").jqGrid('setSelection',newids[i]);
        }
        $(this).parent().parent().trigger("click");
        //获取选中行
        var selid = $("#inter-table").jqGrid('getGridParam','selrow');
        $.post("/delinter.do","i_id="+selid,function(data){
            if(data.result) alertBox({message:"删除成功！"});
            else alertBox({message:"删除失败！"});
            $("#inter-table").trigger("reloadGrid");
        });
    }else{
        //取消选中行
        var myids = $("#reco-table").jqGrid('getGridParam','selarrrow');
        var idStr=JSON.stringify(myids);
        var newids=JSON.parse(idStr);
        for(var i=0;i<newids.length;i++){
            $("#reco-table").jqGrid('setSelection',newids[i]);
        }
        $(this).parent().parent().trigger("click");
        //获取选中行
        var selid = $("#reco-table").jqGrid('getGridParam','selrow');
        $.post("/delreco.do","r_id="+selid,function(data){
            if(data.result) alertBox({message:"删除成功！"});
            else alertBox({message:"删除失败！"});
            $("#reco-table").trigger("reloadGrid");
        });
    }
});

//时间编辑器
$("#starttime-search,#endtime-search").datetimepicker({
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

