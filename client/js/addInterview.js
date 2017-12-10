
//获取学员列表
$("#stu-table").jqGrid({
    url:"/querystulist.do",
    datatype: "json",
    height: 200,
    colNames:['班级','','姓名','性别','联系电话','就业状态','','','专业技能评价',"综合素质评价","学历","毕业学校","毕业专业","毕业时间","备注"],
    colModel:[
        {name:'c_name',index:'c_name', width:100, sorttype:"text", editable: true},
        {name:'c_id',index:'c_id',hidden : true},
        {name:'s_name',index:'s_name', width:100, sorttype:"text", editable: true},
        {name:'s_sex',index:'s_sex', width:100,editable: true, sorttype:"text"},
        {name:'s_phone',index:'s_phone', width:100, editable: true, sorttype:"text"},
        {name:'s_jobstatus',index:'s_jobstatus', width:100, editable: true,sorttype:"text"},
        {name:'s_trueresume',index:'s_trueresume', hidden:true},
        {name:'s_falseresume',index:'s_falseresume',hidden:true},
        {name:'s_skill',index:'s_skill', width:100, editable: true, sorttype:"text"},
        {name:'s_quality',index:'s_quality', width:100, editable: true, sorttype:"text"},
        {name:'s_education',index:'s_education', width:100, editable: true, sorttype:"text"},
        {name:'s_school',index:'s_school', width:100, editable: true, sorttype:"text"},
        {name:'s_major',index:'s_major', width:100, editable: true,sorttype:"text"},
        {name:'s_graduation',index:'s_graduation', width:100, editable: true, sorttype:"text"},
        {name:'s_remark',index:'s_remark', width:100, editable: true, sorttype:"text"}
    ],
    viewrecords : true,
    rowNum:10,
    rowList:[10,20,30],
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
    autowidth: true
});

//推荐人选择
$('#i_u_id').change(function(item){
    if ($(this).val() == 'addUserBtn') {
        var name=prompt("请输入推荐人的名字","");
        if (name) {
            var reqData = {
                u_name : name,
                u_password : '123456',
                u_stutas : 1,
                u_type : '06'
            }
            var url = "/adduser.do"
            $.post(url,reqData,function(data){
                if (data.result) {
                        
                        alert("添加成功,请重新点击添加面试");
                        $('#i_u_id').val('')
                    }else{
                        alertBox({message:"添加失败"});
                    }
            })
        }else{
            $(this).val('')
        }
    }
})

//加载公司列表
$("#gongsi").click(function(){
    window.localStorage.bustype="1";
    setTimeout(function () {
        $("#buss").load("../view/businessInfo.html");
    },0);
});

//查询学员
$("#mysearch").click(function(){
    var data=$("#form-search").serialize();
    jQuery("#stu-table").jqGrid("setGridParam",{
        url:"/querystulist.do?"+data
    }).trigger("reloadGrid");
});
//监听回车查询
$(".form-search").on("keydown",'input',function(key){
    if(key.keyCode == 13){
        $("#mysearch").click();
    }
})
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
//初始化推荐人
$.ajax({
    url:"/queryuserlist.do",
    success: function (data) {
        var mydata=JSON.parse(data);
        for(var i=0;i<mydata.content.length;i++){
            $("#i_u_id").html($("#i_u_id").html()+"<option value='"+mydata.content[i].u_id+"'>"+
                mydata.content[i].u_name+"</option>");
        }
    }
});

//面试企业信息展示
$("#buss").on("click","#bus-table tr",function(){
    var selid = $("#bus-table").jqGrid('getGridParam','selrow');
    var seldata = $("#bus-table").jqGrid("getRowData",selid);
    console.log(seldata.b_id);
    $("#bus_id").val(seldata.b_id);
    $("#bus_name").val(seldata.b_name);
    $("#bus_contactor").val(seldata.b_contactor);
    $("#bus_contactnum").val(seldata.b_contactnum);
    $("#bus_remark").val(seldata.b_remark);
    $("#bus_address").val(seldata.b_address);
});


//添加学员
$("#addinterstu").click(function () {
    var selids=$("#stu-table").jqGrid('getGridParam','selarrrow'),hasids=[];
    for(var j=0;j<$(".stu_id").length;j++){hasids.push($(".stu_id")[j].innerText);}
    if(hasids.length>0){
        for(var a=0;a<hasids.length;a++){
            for(var k=0;k<selids.length;k++){
                if(hasids[a]==selids[k]){
                    selids.splice(k,1);
                    k--;
                }
            }
        }
    }
    for(var i=0;i<selids.length;i++){
        var seldata = $("#stu-table").jqGrid("getRowData",selids[i]);
        var resume="";
        // 更改简历名称
        if(seldata.s_trueresume){
            var typeArr = seldata.s_trueresume.split('.');
            var type = typeArr[typeArr.length-1]
            var s_trueresume = seldata.s_name + seldata.s_phone+'.'+type
            resume+="<a style='color: #0092ef' href='../files/"+seldata.s_trueresume+"' download="+s_trueresume+">真实简历 </a>";
        }
        if(seldata.s_falseresume){
            var typeArr = seldata.s_falseresume.split('.');
            var type = typeArr[typeArr.length-1]
            var s_falseresume = seldata.s_name +'-'+ seldata.s_phone +'.'+type
            resume+="<a style='color: #0092ef' href='../files/"+seldata.s_falseresume+"' download="+s_falseresume+">包装简历 </a>";
        }
        $("#hasselect>tbody").html($("#hasselect>tbody").html()+"<tr><td class='stu_id'>"+selids[i]
            +"</td><td class='stu_name'>"+seldata.s_name+"</td><td>"+seldata.c_name+"</td><td>"+seldata.s_sex+"</td><td>"+seldata.s_phone+
            "</td><td>"+resume+"</td><td><a href='#' role='button' class='delstu'>删除</a></td></tr>");
    }
});

//删除学员
$("#hasselect").on("click",".delstu",function(){
    $(this).parent().parent().remove();
});

//配置添加面试表单
$("#addinter").click(function(){
    $("#interInfo").submit();
});
$("#interInfo").bootstrapValidator({
    fields: {
        i_time: {
            validators: {
                notEmpty: {
                    message: '面试时间不能为空！'
                }
            }
        },
        i_job: {
            validators: {
                notEmpty: {
                    message: '面试岗位不能为空！'
                }
            }
        },
        i_u_id: {
            validators: {
                notEmpty: {
                    message: '推荐人不能为空！'
                }
            }
        }
    }
}).on('success.form.bv', function(e) {
        if($("#bus_id").val()){
            e.preventDefault();
            var hasids=[];
            for(var j=0;j<$(".stu_id").length;j++){hasids.push($(".stu_id")[j].innerText);}
            if(hasids.length>0){
                $.ajax({
                    url:$(e.target).attr("action"),
                    type:"post",
                    data:{
                        i_time:$("#i_time").val(),
                        i_b_id:$("#bus_id").val(),
                        i_job:$("#i_job").val(),
                        i_s_id:hasids.join(),
                        i_u_id:$("#i_u_id").val()
                    },
                    success:function(data){
                        if($("input[name='change_reco']:checked").val()==0){//添加面试提示
                            if(data.result){
                                dialogBox({
                                    message:"添加面试成功！确认生成面试通知？",
                                    sure:function(){
                                        var hasinames=[];
                                        for(var i=0;i<$(".stu_name").length;i++){hasinames.push($(".stu_name")[i].innerText);}
                                        var tongzhi=
                                            $("#mytongzhi").html("<strong>面试通知：</strong>" +
                                                "</br><strong>面试公司：</strong>"+$("#bus_name").val()+
                                                "</br><strong>面试岗位：</strong>"+$("#i_job").val()+
                                                "</br><strong>面试时间：</strong>"+$("#i_time").val()+
                                                "</br><strong>面试地址：</strong>"+$("#bus_address").val()+
                                                "</br><strong>面试联系人：</strong>"+$("#bus_contactor").val()+
                                                "</br><strong>联系电话：</strong>"+$("#bus_contactnum").val()+
                                                "</br><strong>面试人员：</strong>"+hasinames.join()+
                                                "</br><strong>备注：</strong>"+$("#bus_remark").val());
                                        $("#intertongzhi").trigger("click");
                                    }
                                });
                            }else alertBox({message:"添加面试失败！"});
                        }else{//添加推荐提示
                            if(data.result)alertBox({message:"添加推荐成功！"});
                            else alertBox({message:"添加推荐失败！"});
                        }
                    }
                });
            }else alertBox({message:"请选择学员！"});
        }else alertBox({message:"请选择面试公司！"});

    }
);


//添加推荐信息
setTimeout(function () {
    var recoId=window.sessionStorage.recoId;
    if(recoId==undefined)return;
    sessionStorage.removeItem('recoId');
    $.ajax({
        url:"/queryreclist.do?r_id="+recoId,
        success:function(data){
            data=JSON.parse(data);
            $("#bus_id").val(data.content[0].r_b_id);
            $("#i_job").val(data.content[0].r_job);
            var resume="";
            if(data.content[0].s_trueresume)resume+="<a style='color: #0092ef' href='../files/"+data.content[0].s_trueresume+"'>真实简历 </a>";
            if(data.content[0].s_trueresume)resume+="<a style='color: #0092ef' href='../files/"+data.content[0].s_falseresume+"'> 包装简历</a>";
            $("#hasselect>tbody").html($("#hasselect>tbody").html()+"<tr><td class='stu_id'>"+data.content[0].r_s_id
                +"</td><td class='stu_name'>"+data.content[0].s_name+"</td><td>"+data.content[0].c_name+"</td><td>"
                +data.content[0].s_sex+"</td><td>"+data.content[0].s_phone+
                "</td><td>"+resume+"</td><td><a href='#' role='button' class='delstu'>删除</a></td></tr>");
                    debugger
            $.ajax({
                url:"/querybuslist.do?b_id="+data.content[0].r_b_id,
                success: function (data) {
                    var mydata=JSON.parse(data);

                    $("#bus_contactor").val(mydata.content[0].b_contactor);
                    $("#bus_contactnum").val(mydata.content[0].b_contactnum);
                    $("#bus_name").val(mydata.content[0].b_name);
                    
                    $("#bus_remark").val(mydata.content[0].b_remark);
                    $("#bus_address").val(mydata.content[0].b_address);
                }
            })
        }
    })
},10);

//添加新推荐
$("input[name='change_reco']").click(function () {
    var $checked=$("input[name='change_reco']:checked").val();
    if($checked==1){
        $(".chang_name").text("推荐");
        $("#interInfo").attr("action","/addrec.do");
    }else{
        $(".chang_name").text("面试");
        $("#interInfo").attr("action","/addinter.do");
    }
});

//时间编辑器
$("#i_time").datetimepicker({
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
$("#endtime-search").datetimepicker({
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