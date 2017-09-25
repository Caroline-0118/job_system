
//初始化
$.get("/getuserreco.do",function(data){
    showtable(data);
    $('#user-table').dataTable({
        "lengthMenu": [ 5, 10, 15 ],
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true
    });
});

//时间筛选
$("#time-search").click(function () {
    $.get("/getuserreco.do","start="+$("#starttime").val()+"&end="+$("#endtime").val(),function(data){showtable(data);});
});
// 导出
$('#export').click(function(){
    var data = $("#form-search").serialize();
    var URL = "/getuserreco.do?isExport=true&fileName=staffPicks.xlsx&start="+$("#starttime").val()+"&end="+$("#endtime").val()
    window.location = URL
})
//table配置函数
function showtable(data){
    $("#user-table tbody").html("");
    var reco= 0,inter=0,employ=0,getjob=0;
    for(var i=0;i<data.length;i++){
        reco+=parseInt(data[i].recoNum);
        inter+=parseInt(data[i].interNum);
        employ+=parseInt(data[i].employNum);
        getjob+=parseInt(data[i].getjobNum);
        var percent=(parseInt(data[i].getjobNum)/parseInt(data[i].interNum))*100;
        $("#user-table tbody").html($("#user-table tbody").html()+
            "<tr>"+
            "<td class='center'>"+data[i].u_name+"</td>"+
            "<td class='center'>"+data[i].recoNum+"</td>"+
            "<td class='center'>"+data[i].interNum+"</td>"+
            "<td class='center'>"+data[i].employNum+"</td>"+
            "<td class='center'>"+data[i].getjobNum+"</td>"+
            "<td class='center'>"+Math.round(percent*100)/100+"%</td>"+
            "</tr>");
    }
    $("#user-table tbody").html($("#user-table tbody").html()+
        "<tr>"+
        "<td class='center'>-总计</td>"+
        "<td class='center'>"+reco+"</td>"+
        "<td class='center'>"+inter+"</td>"+
        "<td class='center'>"+employ+"</td>"+
        "<td class='center'>"+getjob+"</td>"+
        "<td class='center'>"+Math.round(getjob/inter*10000)/100+"%</td>"+
        "</tr>");
}

//时间控件
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
