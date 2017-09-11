
//初始化未就业数据
$.post("/getclass.do",function(data){
    for(var i=0;i<data.length;i++){
        var allstu=0,nostu= 0,num=parseInt(Math.random()*5);
        for(var j=0;j<data[i].jobstatus_count.length;j++){
            //已就业学生
            if(data[i].jobstatus_count[j].s_jobstatus==2||data[i].jobstatus_count[j].s_jobstatus==3||data[i].jobstatus_count[j].s_jobstatus==6){
                allstu+=parseInt(data[i].jobstatus_count[j].num);
            }
            //未就业学生
            if(data[i].jobstatus_count[j].s_jobstatus==1){
                nostu+=parseInt(data[i].jobstatus_count[j].num);
            }
        }
        var percent=allstu/(allstu+nostu)*100,$baojing;
        if(percent<100){
            if(data[i].c_endtime){
                if(GetDateDiff(data[i].c_endtime)>60) $baojing="<td class='center' style='color: #eb360c'>紧急</td>";
                if(GetDateDiff(data[i].c_endtime)<=60) $baojing="<td class='center' style='color: #d8dc6e'>重要</td>";
                if(GetDateDiff(data[i].c_endtime)<=30) $baojing="<td class='center' style='color: blue'>普通</td>";
            }else  $baojing="<td class='center'></td>";
            $("#hasnojob tbody").html($("#hasnojob tbody").html()+"<tr>" +
                "<td class='center'>"+Math.ceil(GetDateDiff(data[i].c_endtime))+"</td>"+$baojing+
                "<td class='center'>"+data[i].c_name+"</td>"+
                "<td class='center'>"+nostu+"</td>"+
                "<td class='center'>"+data[i].c_endtime+"</td>"+
                "<td class='center'>"+Math.round(percent*100)/100+"%</td>"+
                "</tr>");
        }
    }
    $('#hasnojob').dataTable({
        "lengthMenu": [ 5, 10, 15 ],
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true
    });
    $('#hasnojob').prev().remove();
    $('#hasnojob').next().remove();
});

//初始化计划就业数据
var date=new Date(),mydate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
$.get("/queryclasslist.do","c_name=&c_endtime="+mydate,function(data){
    var mydata=JSON.parse(data).content,c_ids=[];
    for(var i=0;i<mydata.length;i++){
        c_ids.push(mydata[i].c_id);
        $("#waitjobclass tbody").html($("#waitjobclass tbody").html()+"<tr>" +
            "<td class='center'>"+mydata[i].c_endtime+"</td>"+
            "<td class='center'>"+mydata[i].c_name+"</td>"+
            "<td class='center stuNum'>0</td>"+
            "</tr>");
    }
    //获取班级人数
    $.post("/getwaitjobstu.do","c_id="+c_ids.join(),function(d){
        var allstu=0;
        for(var j=0;j<mydata.length;j++){
            for(var k=0;k<d.length;k++){
                if(mydata[j].c_id== d[k].s_c_id){
                    $(".stuNum").get(j).innerHTML=d[k].stuNum;
                    allstu+=d[k].stuNum;
                }
            }
        }
        $("#waitjobclass tbody").html($("#waitjobclass tbody").html()+"<tr>" +
            "<td class='center'>待就业总人数</td><td></td>"+
            "<td class='center stuNum'>"+allstu+"</td>"+
            "</tr>");
        $('#waitjobclass').dataTable({
            "bPaginate": true,
            "bLengthChange": true,
            "bFilter": true
        });
        $('#waitjobclass').prev().remove();
        $('#waitjobclass').next().remove();
    })
});

//本周就业人数  图表
require(
    [
        'echarts',
        'echarts/chart/bar'
    ],function(ec){
        $.post("/getthisweek.do",function(data){//获取本周就业数据
            var this_week = ec.init(document.getElementById('this_week')),mydata=[0,0,0];
            for(var i=0;i<data.length;i++){
                if(data[i].s_jobstatus==2)mydata[1]=parseInt(data[i].stuNum);
                if(data[i].s_jobstatus==3)mydata[0]=parseInt(data[i].stuNum);
            }
            mydata[2]=mydata[1]+mydata[0];
            $.post("/nojoball.do",function(d){
                //console.log(d)
                this_week.setOption({//配置echarts
                    title : {
                        text: '未就业总人数:'+d[0].nojobNum,
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : false,
                    xAxis : [
                        {
                            type : 'value',
                            axisLine:{show:true}
                        }
                    ],
                    grid: {x: 80,x2:20},//左右间距
                    yAxis ://Y轴
                    {
                        type : 'category',
                        data : ['推荐就业人数','自主就业人数','本周就业人数'],
                        axisLabel:{
                            interval:0,//横轴信息全部显示
                            rotate:30//-30度角倾斜显示
                        }
                    }
                    ,
                    series : [//数据
                        {
                            name:'就业人数',
                            type:'bar',
                            data:mydata,
                            itemStyle:{
                                normal:{
                                    color:function (params) {
                                        var colorList = [ '#f39c11', '#06c7a8', '#e26c60'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                });
                this_week.resize();
            });

        });


    });
//至今天数
function GetDateDiff(startDate){
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
    var endTime = new Date().getTime();
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    return  dates;
}