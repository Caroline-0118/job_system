
//获取班级列表
$("#stu-table").jqGrid({
    url:"/querystulist.do",
    datatype: "json",
    height: 250,
    colNames:['班级','','姓名','性别','联系电话',"学历","备注"],
    colModel:[
        {name:'c_name',index:'c_name', width:100, sorttype:"text", editable: true},
        {name:'c_id',index:'c_id',hidden : true},
        {name:'s_name',index:'s_name', width:100, sorttype:"text", editable: true},
        {name:'s_sex',index:'s_sex', width:100,editable: true, sorttype:"text"},
        {name:'s_phone',index:'s_phone', width:100, editable: true, sorttype:"text"},
        {name:'s_education',index:'s_education', width:100, editable: true, sorttype:"text"},
        {name:'s_remark',index:'s_remark', width:100, editable: true, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#stu-pager",
    altRows: true,
    toppager: false,
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
    gridComplete : function() {//查看详情
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
$("#search,#down-stu").click(function(){
    var data=$("#form-search").serialize();
    jQuery("#stu-table").jqGrid("setGridParam",{
        url:"/querystulist.do?s_jobstatus=&"+data
    }).trigger("reloadGrid");
});

//初始化班级下拉菜单
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

//选择学生添加回访
$("#stu-table").click(function(){
    setTimeout(function(){
        var selid = $("#stu-table").jqGrid('getGridParam','selrow');
        window.sessionStorage.s_id=selid;
        $("#stu_xiangxi").load("../view/student_information.html");
    },5);

});