
//初始化
showtable();

//时间筛选
$("#time-search").click(function () {
    showtable($("#starttime").val(),$("#endtime").val());
});

var studentJobList = [];
//table配置函数
function showtable(start,end){
    var mydata=[];
    if(start!=undefined&&start!=null){mydata.push("start_time="+$("#starttime").val())}
    if(end!=undefined&&end!=null){mydata.push("end_time="+$("#endtime").val())}
    $.post("/getclass.do",mydata.join("&"),function(data){

        //初始化本周数据
        $.post("/getclass.do","type=1&"+mydata.join("&"),function(d){
            var allstu= 0,shouldrecostu= 0,hasjoballstu= 0,hasjobrecostu= 0,hasjobownstu= 0,giveupstu= 0,delaystu= 0,regetjob= 0,thisweekstu= 0,nojobstu=0;
            var allstu1= 0,shouldrecostu1= 0,hasjoballstu1= 0,hasjobrecostu1= 0,hasjobownstu1= 0,giveupstu1= 0,delaystu1= 0,regetjob1= 0,thisweekstu1= 0,nojobstu1=0;
            $("#class-table tbody").html("");
            $("#hasclass-table tbody").html("");
            studentJobList = data;
            for(var k=0;k< d.length;k++){
                for(var i=0;i<data.length;i++){
                    // nojob未就业 hasjob1自主就业 hasjob2推荐就业 giveupjob放弃就业 delayjob推迟就业 rejob再就业
                    var nojob=0,hasjob1= 0,hasjob2=0,giveupjob= 0,delayjob= 0,rejob=0;
                    var nojoblist=[],hasjob1list= [],hasjob2list= [],giveupjoblist= [],delayjoblist = [],rejoblist=[];
                    for(var j=0;j<data[i].jobstatus_count.length;j++){
                        //全部学生
                        switch (data[i].jobstatus_count[j].s_jobstatus){
                            case 1 : 
                                    nojob      =parseInt(data[i].jobstatus_count[j].num); 
                                    nojoblist  = data[i].jobstatus_count[j].list;
                                break;
                            case 2 : 
                                    hasjob1    =parseInt(data[i].jobstatus_count[j].num); 
                                    hasjob1list = data[i].jobstatus_count[j].list;
                                    break;
                            case 3 : 
                                    hasjob2    =parseInt(data[i].jobstatus_count[j].num); 
                                    hasjob2list = data[i].jobstatus_count[j].list;
                                    break;
                            case 4 : 
                                    giveupjob  =parseInt(data[i].jobstatus_count[j].num); 
                                    giveupjoblist = data[i].jobstatus_count[j].list;
                                    break;
                            case 5 : 
                                    delayjob   =parseInt(data[i].jobstatus_count[j].num); 
                                    delayjoblist = data[i].jobstatus_count[j].list;
                                    break;
                            case 6 : 
                                    rejob      =parseInt(data[i].jobstatus_count[j].num); 
                                    rejoblist = data[i].jobstatus_count[j].list;
                                    break;
                        }
                    }
                    var percent=Math.round((hasjob2+hasjob1+rejob)/(hasjob2+hasjob1+rejob+nojob)*100) || 0;
                    if(data[i].c_id==d[k].c_id){
                        var weeknum=d[k].weeknum;
                        if(data[i].c_status!='11'){
                            allstu+=(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob);
                            shouldrecostu+=(hasjob2+hasjob1+nojob+rejob);
                            hasjoballstu+=(hasjob2+hasjob1+rejob);
                            hasjobrecostu+=hasjob2;
                            hasjobownstu+=hasjob1;
                            giveupstu+=giveupjob;
                            delaystu+=delayjob;
                            regetjob+=rejob;
                            thisweekstu+=weeknum;
                            nojobstu+=nojob;
                            var classDOM = "<tr>"+
                            "<td class='center'>"+d[k].c_endtime+"</td>"+
                                "<td class='center'>"+data[i].c_name+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",1,'所有人员')\" >"+(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob)+"</td>"+  //需要推荐人数
                                "<td class='center' onclick=\"showJobDetail("+i+",2,'需要推荐人员')\" >"+(hasjob2+hasjob1+nojob+rejob)+"</td>"+   //已经就业人数
                                "<td class='center' onclick=\"showJobDetail("+i+",3,'已经就业人员')\">"+(hasjob2+hasjob1+rejob)+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",4,'推荐就业人员')\">"+hasjob2+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",5,'自主就业人员')\">"+hasjob1+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",6,'放弃就业人员')\">"+giveupjob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",7,'推迟就业人员')\">"+delayjob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",8,'再就业人员')\">"+rejob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",9,'本周就业人员')\">"+weeknum+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",10,'剩余就业人员')\">"+nojob+"</td>"+
                                "<td class='center'>"+percent+"%</td>";
                                var user = JSON.parse(localStorage.getItem('user') )
                                if (percent == 100) {
                                    if (data[i].c_status == '00') {
                                        if(user && (user.u_type =='03') ){
                                            classDOM += "<td class='center classClose'><button  data-id='"+data[i].c_id+"' data-name='"+data[i].c_name+"'  id='applyClose' data-auth='/applyCloseClass.do'>申请结班</button></td>"
                                        }else{
                                            classDOM += "<td class='center classClose'>待结班</td>"
                                        }
                                        
                                    }else if(data[i].c_status == '01'){
                                        if(user && user.u_name == data[i].c_hr){
                                            classDOM += "<td class='center classClose'><button data-id='"+data[i].c_id+"' data-name='"+data[i].c_name+"' id='approval'>结班审批</button></td>"
                                        }else{
                                            classDOM +="<td class='center'>待审核</td>"
                                        }
                                        
                                    }else if(data[i].c_status == '02'){
                                        if(user && (user.u_type =='03') ){
                                            classDOM += "<td class='center classClose'><button  data-id='"+data[i].c_id+"' data-name='"+data[i].c_name+"'  id='applyClose' data-auth='/applyCloseClass.do'>再次申请结班</button></td>"
                                        }else{
                                            classDOM +="<td class='center'>申请被拒绝</td>"
                                        }
                                        
                                    }else if(data[i].c_status == '11'){
                                        classDOM +="<td class='center'>已结班</td>"
                                    }
                                }else{
                                   classDOM +="<td class='center'> / </td>"
                                }
                                classDOM += "</tr>"
                            $("#class-table tbody").html($("#class-table tbody").html()+ classDOM)
                        }else{
                            allstu1+=(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob);
                            shouldrecostu1+=(hasjob2+hasjob1+nojob+rejob);
                            hasjoballstu1+=(hasjob2+hasjob1+rejob);
                            hasjobrecostu1+=hasjob2;
                            hasjobownstu1+=hasjob1;
                            giveupstu1+=giveupjob;
                            delaystu1+=delayjob;
                            regetjob1+=rejob;
                            thisweekstu1+=weeknum;
                            nojobstu1+=nojob;

                            $("#hasclass-table tbody").html($("#hasclass-table tbody").html()+ 
                                "<tr>"+
                                "<td class='center'>"+d[k].c_endtime+"</td>"+   //结业时间
                                "<td class='center'>"+data[i].c_name+"</td>"+   //班级名称
                                "<td class='center' onclick=\"showJobDetail("+i+",1,'所有人员')\" >"+(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob)+"</td>"+  //需要推荐人数
                                "<td class='center' onclick=\"showJobDetail("+i+",2,'需要推荐人员')\" >"+(hasjob2+hasjob1+nojob+rejob)+"</td>"+   //已经就业人数
                                "<td class='center' onclick=\"showJobDetail("+i+",3,'已经就业人员')\">"+(hasjob2+hasjob1+rejob)+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",4,'推荐就业人员')\">"+hasjob2+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",5,'自主就业人员')\">"+hasjob1+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",6,'放弃就业人员')\">"+giveupjob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",7,'推迟就业人员')\">"+delayjob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",8,'再就业人员')\">"+rejob+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",9,'本周就业人员')\">"+weeknum+"</td>"+
                                "<td class='center' onclick=\"showJobDetail("+i+",10,'剩余就业人员')\">"+nojob+"</td>"+
                                "<td class='center'>"+percent+"%</td>"+
                                "<td class='center'>已结班</td>"+
                                "</tr>" )
                        }
                    }
                }
            }
            var percc = Math.round((hasjoballstu/shouldrecostu)*10000)/100 || 0
            $("#class-table tbody").html($("#class-table tbody").html()+
                "<tr>"+
                "<td class='center'>/</td>"+
                "<td class='center'>总计</td>"+
                "<td class='center'>"+allstu+"</td>"+
                "<td class='center'>"+shouldrecostu+"</td>"+
                "<td class='center'>"+hasjoballstu+"</td>"+
                "<td class='center'>"+hasjobrecostu+"</td>"+
                "<td class='center'>"+hasjobownstu+"</td>"+
                "<td class='center'>"+giveupstu+"</td>"+
                "<td class='center'>"+delaystu+"</td>"+
                "<td class='center'>"+regetjob+"</td>"+
                "<td class='center'>"+thisweekstu+"</td>"+
                "<td class='center'>"+nojobstu+"</td>"+
                "<td class='center'>"+percc+"%</td>"+
                "<td class='center'>/</td>"+
                "</tr>");
            var percd = Math.round((hasjoballstu1/shouldrecostu1)*10000)/100 || 0
            $("#hasclass-table tbody").html($("#hasclass-table tbody").html()+
                "<tr>"+
                "<td class='center'>/</td>"+
                "<td class='center'>总计</td>"+
                "<td class='center'>"+allstu1+"</td>"+
                "<td class='center'>"+shouldrecostu1+"</td>"+
                "<td class='center'>"+hasjoballstu1+"</td>"+
                "<td class='center'>"+hasjobrecostu1+"</td>"+
                "<td class='center'>"+hasjobownstu1+"</td>"+
                "<td class='center'>"+giveupstu1+"</td>"+
                "<td class='center'>"+delaystu1+"</td>"+
                "<td class='center'>"+regetjob1+"</td>"+
                "<td class='center'>"+thisweekstu1+"</td>"+
                "<td class='center'>"+nojobstu1+"</td>"+
                "<td class='center'>"+percd+"%</td>"+
                "<td class='center'>/</td>"+
                "</tr>");
            //配置datatable
            if(start==undefined){
                $('#class-table').dataTable({
                    "lengthMenu": [ 5, 10, 15 ],
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bInfo": true
                });
                $('#hasclass-table').dataTable({
                    "lengthMenu": [ 5, 10, 15 ],
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bInfo": true
                });
            }
        });

    });
}

//导出
//$("#myTab4 a").click(function(){
//    console.log(this)
//});

$("#daochu").click(function(){
    var mycheck=$("#myTab4 li.active a").text();
    if(mycheck=="未结业班级") ExportToExcel("class-table");
    else  ExportToExcel("hasclass-table");

// 导出功能尚未完善
    // var data = $("#form-search").serialize();
    // var URL = "/getclass.do?isExport=true&fileName=jobDetail.xlsx&start_time="+$("#starttime").val()+"end_time="+$("#endtime").val()
    // window.location = URL

});

/**
 * 申请结班
 * @param  {[type]} ){                 var url [description]
 * @return {[type]}     [description]
 */
$(document).on('click','#applyClose',function(){
    var url = $(this).attr('data-auth');
    var c_id = $(this).attr('data-id');
    var c_name = $(this).attr('data-name');
    $.ajax({
        url : url,
        data : {c_id:c_id,c_name:c_name},//获取用户ID getcol:"id" 获取用户姓名 getcol:"name"
        type:"post",
        success:function(data){
            if (data.status == 0) {
                alert('处理成功');
           }else{
                alert(data.message);
           }
           $('#time-search').click()
        }
    });
    
})
/**
 * 结班审批
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */
$(document).on('click','#approval',function(){
    $("#myAppModalLabel").html("结班审批")
    $("#c_id").val($(this).data('id'))
    $("#c_name").val($(this).data('name'))
    $('#applyModal').modal('show') 
})
/**
 * 同意或者拒绝
 * @param  {[type]} ){                                      var type [description]
 */
$(document).on('click','.handler',function(){
    var type = $(this).attr('data-type');
    var c_id = $("#c_id").val();
    var c_name = $("#c_name").val();
    var url = '/handleCloseClass.do'
    var reason = $('#reason').val()
    var reqData = {
        c_id:c_id,
        c_name:c_name,
        c_status:type,
        reason : reason
    }
    $.ajax({
        url : url,
        data : reqData,//获取用户ID getcol:"id" 获取用户姓名 getcol:"name"
        type:"post",
        success:function(data){
            if (data.status == 0) {
                alert('处理成功');
                $('#applyModal').modal('hide') 
                $('#time-search').click()
           }else{
                alert(data.message);
           }
        }
    });
})
/**
 * 展示详情
 * @param  {[type]} i     [description]
 * @param  {[type]} type  [description]
 * @param  {[type]} title [description]
 * @return {[type]}       [description]
 */
var showJobDetail = function(i,type,title){
    var userlist = ""
    var data = studentJobList
    var nojoblist=[],hasjob1list= [],hasjob2list= [],giveupjoblist= [],delayjoblist = [],rejoblist=[];
    for(var j=0;j<data[i].jobstatus_count.length;j++){
        //全部学生
        switch (data[i].jobstatus_count[j].s_jobstatus){
            case 1 : 
                    nojob      =parseInt(data[i].jobstatus_count[j].num); 
                    nojoblist  = data[i].jobstatus_count[j].list;
                break;
            case 2 : 
                    hasjob1    =parseInt(data[i].jobstatus_count[j].num); 
                    hasjob1list = data[i].jobstatus_count[j].list;
                    break;
            case 3 : 
                    hasjob2    =parseInt(data[i].jobstatus_count[j].num); 
                    hasjob2list = data[i].jobstatus_count[j].list;
                    break;
            case 4 : 
                    giveupjob  =parseInt(data[i].jobstatus_count[j].num); 
                    giveupjoblist = data[i].jobstatus_count[j].list;
                    break;
            case 5 : 
                    delayjob   =parseInt(data[i].jobstatus_count[j].num); 
                    delayjoblist = data[i].jobstatus_count[j].list;
                    break;
            case 6 : 
                    rejob      =parseInt(data[i].jobstatus_count[j].num); 
                    rejoblist = data[i].jobstatus_count[j].list;
                    break;
        }
    }

    switch(type){
        case 1: userlist = hasjob2list.concat(hasjob1list).concat(rejoblist).concat(nojoblist).concat(giveupjoblist).concat(delayjoblist) ;
                break;
        case 2 : userlist = hasjob2list.concat(hasjob1list).concat(nojoblist).concat(rejoblist);
                break;
        case 3 : userlist = hasjob2list.concat(hasjob1list).concat(rejoblist)
                break;
        case 4 : userlist = hasjob2list
                break;
        case 5 : userlist = hasjob1list
                break;
        case 6 : userlist = giveupjoblist
                break;
        case 7 : userlist = delayjoblist
                break;
        case 8 : userlist = rejoblist
                break;
        case 9 : userlist = weeknum
                break;
        case 10 : userlist = nojoblist
                break;
    }


    var userTable = "<table style='width:100%'><th>学员姓名</th><th>推荐人</th><th>就业时间</th>"
    for(var i=0;i<userlist.length;i++){
        var recommend = userlist[i].recommend || ' '
        var s_getjobtime = userlist[i].s_getjobtime ? (new Date(userlist[i].s_getjobtime)).toLocaleDateString() : ''
        userTable = userTable + '<tr style="width:33%"><td>'+userlist[i].s_name+'</td><td>'+recommend+'</td><td>'+s_getjobtime+'</td></tr>'
    }
    userTable += '</table>'
    $("#myModalLabel").html(title)
    $(".modal-body").html(userTable)
    $('#myModal').modal('show') 
}

//时间编辑器
$("#starttime,#endtime").datetimepicker({
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