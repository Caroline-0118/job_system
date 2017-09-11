

//获取回访列表
$("#visit-table").jqGrid({
    url:"/getvisitedlist.do",
    datatype: "json",
    height: $(window).height()-313,
    colNames:['沟通时间','沟通方式','学员班级','学员姓名','回访人',"沟通内容","备注"],
    colModel:[
        {name:'v_time',index:'v_time', width:100, sorttype:"text"},
        {name:'v_type',index:'v_type', width:100, sorttype:"text"},
        {name:'c_name',index:'c_name', width:100, sorttype:"text"},
        {name:'s_name',index:'s_name', width:100, sorttype:"text"},
        {name:'u_name',index:'u_name', width:100,sorttype:"text"},
        {name:'v_content',index:'v_content', width:400, sorttype:"text"},
        {name:'v_remark',index:'v_remark', width:100, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,50,100],
    pager : "#visit-pager",
    altRows: true,
    toppager: false,
    multiselect: true,
    multiboxonly: true,

    jsonReader: {
        root:"content",
        total:"totalpage",
        records:"totalcount",
        repeatitems:false,
        id : "v_id"
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
    jQuery("#visit-table").jqGrid("setGridParam",{
        url:"/getvisitedlist.do?c_id="+$("#class-search").val()+"&s_name="+$("#stu-search").val()
        +"&start_time="+$("#start-search").val()+"&end_time="+$("#end-search").val()
    }).trigger("reloadGrid");
});

//初始化班级下拉菜单
$.ajax({
    url:"/queryclasslist.do",
    success: function (data) {
        $("#class-search").html("<option value=''>全部</option>");
        var mydata=JSON.parse(data);
        for(var i=0;i<mydata.content.length;i++){
            $("#class-search").html($("#class-search").html()+"<option value='"+mydata.content[i].c_id+"'>"+
                mydata.content[i].c_name+"</option>");
        }
        $("#class-search").selectpicker();
    }
});

//时间编辑器
$("#start-search,#end-search").datetimepicker({
        format: 'YYYY-MM-DD hh:mm A',
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