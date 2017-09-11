
//初始化
showtable();

//时间筛选
$("#time-search").click(function () {
    showtable($("#starttime").val(),$("#endtime").val());
});

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
            for(var k=0;k< d.length;k++){
                for(var i=0;i<data.length;i++){
                    // nojob未就业 hasjob1自主就业 hasjob2推荐就业 giveupjob放弃就业 delayjob推迟就业 rejob再就业
                    var nojob=0,hasjob1= 0,hasjob2=0,giveupjob= 0,delayjob= 0,rejob=0;
                    for(var j=0;j<data[i].jobstatus_count.length;j++){
                        //全部学生
                        switch (data[i].jobstatus_count[j].s_jobstatus){
                            case 1 : nojob=parseInt(data[i].jobstatus_count[j].num); break;
                            case 2 : hasjob1=parseInt(data[i].jobstatus_count[j].num); break;
                            case 3 : hasjob2=parseInt(data[i].jobstatus_count[j].num); break;
                            case 4 : giveupjob=parseInt(data[i].jobstatus_count[j].num); break;
                            case 5 : delayjob=parseInt(data[i].jobstatus_count[j].num); break;
                            case 6 : rejob=parseInt(data[i].jobstatus_count[j].num); break;
                        }
                    }
                    var percent=(hasjob2+hasjob1+rejob)/(hasjob2+hasjob1+rejob+nojob)*100;
                    if(data[i].c_id==d[k].c_id){
                        var weeknum=d[k].weeknum;
                        if(percent<100){
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
                            $("#class-table tbody").html($("#class-table tbody").html()+
                                "<tr>"+
                                "<td class='center'>"+d[k].c_endtime+"</td>"+
                                "<td class='center'>"+data[i].c_name+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob)+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+nojob+rejob)+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+rejob)+"</td>"+
                                "<td class='center'>"+hasjob2+"</td>"+
                                "<td class='center'>"+hasjob1+"</td>"+
                                "<td class='center'>"+giveupjob+"</td>"+
                                "<td class='center'>"+delayjob+"</td>"+
                                "<td class='center'>"+rejob+"</td>"+
                                "<td class='center'>"+weeknum+"</td>"+
                                "<td class='center'>"+nojob+"</td>"+
                                "<td class='center'>"+Math.round(percent*100)/100+"%</td>"+
                                "</tr>")
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
                                "<td class='center'>"+d[k].c_endtime+"</td>"+
                                "<td class='center'>"+data[i].c_name+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+rejob+nojob+giveupjob+delayjob)+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+nojob+rejob)+"</td>"+
                                "<td class='center'>"+(hasjob2+hasjob1+rejob)+"</td>"+
                                "<td class='center'>"+hasjob2+"</td>"+
                                "<td class='center'>"+hasjob1+"</td>"+
                                "<td class='center'>"+giveupjob+"</td>"+
                                "<td class='center'>"+delayjob+"</td>"+
                                "<td class='center'>"+rejob+"</td>"+
                                "<td class='center'>"+weeknum+"</td>"+
                                "<td class='center'>"+nojob+"</td>"+
                                "<td class='center'>"+Math.round(percent*100)/100+"%</td>"+
                                "</tr>")
                        }
                    }
                }
            }

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
                "<td class='center'>"+Math.round((hasjoballstu/shouldrecostu)*10000)/100+"%</td>"+
                "</tr>");
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
                "<td class='center'>"+Math.round((hasjoballstu1/shouldrecostu1)*10000)/100+"%</td>"+
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
});

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