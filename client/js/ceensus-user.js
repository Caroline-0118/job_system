
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
            "<tr >"+
            "<td class='center'>"+data[i].u_name+"</td>"+
            "<td class='center' onclick='getReDetail("+data[i].u_id+",1)'  >"+data[i].recoNum+"</td>"+
            "<td class='center' onclick='getReDetail("+data[i].u_id+",2)'  >"+data[i].interNum+"</td>"+
            "<td class='center' onclick='getReDetail("+data[i].u_id+",3)'  >"+data[i].employNum+"</td>"+
            "<td class='center' onclick='getReDetail("+data[i].u_id+",4)'  >"+data[i].getjobNum+"</td>"+
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
/**
 * 获取推荐详情
 * @return {[type]} [description]
 */
var getReDetail =  function(u_id,type){
    var url = '/getReDetail.do'
    var reqData = {
        u_id : u_id,
        type : type
    }
    $.post(url,reqData,function(result){
        if (result.status ==0) {
            if (result.data.length>0) {
                if (type ==1) {
                    var userTable = "<table style='width:100%' class='ceensus_info'><th>学员姓名</th><th>推荐时间</th><th>公司名称</th><th>就业状态</th>"
                    for(var i=0;i<result.data.length;i++){
                        var item = result.data[i]
                        var r_time = item.r_time ? (new Date(item.r_time)).toLocaleDateString() : ''
                        var jobStatusArr = ['','无工作','自主就业','推荐就业','放弃就业','推迟就业','拒绝就业'] 
                        var jobStatus = jobStatusArr[item.s_jobstatus]
                        userTable = userTable + '<tr style="width:25%"><td>'+item.s_name+'</td><td>'+r_time+'</td><td>'+item.b_name+'</td><td>'+jobStatus+'</td></tr>'
                    }
                    userTable += '</table>'
                    $("#myModalLabel").html("推荐人员列表")
                }else if(type==2){
                    var userTable = "<table style='width:100%' class='ceensus_info'><th>学员姓名</th><th>推荐时间</th><th>公司名称</th><th>就业状态</th>"
                    for(var i=0;i<result.data.length;i++){
                        var item = result.data[i]
                        var i_time = item.i_time ? (new Date(item.i_time)).toLocaleDateString() : ''
                        var jobStatusArr = ['','无工作','自主就业','推荐就业','放弃就业','推迟就业','拒绝就业'] 
                        var jobStatus = jobStatusArr[item.s_jobstatus]
                        userTable = userTable + '<tr style="width:25%"><td>'+item.s_name+'</td><td>'+i_time+'</td><td>'+item.b_name+'</td><td>'+jobStatus+'</td></tr>'
                    }
                    userTable += '</table>'
                    $("#myModalLabel").html("安排面试人员列表")   
                }else if(type==3){
                    var userTable = "<table style='width:100%' class='ceensus_info'><th>学员姓名</th><th>推荐时间</th><th>公司名称</th><th>就业状态</th>"
                    for(var i=0;i<result.data.length;i++){
                        var item = result.data[i]
                        var i_time = item.i_time ? (new Date(item.i_time)).toLocaleDateString() : ''
                        var jobStatusArr = ['','无工作','自主就业','推荐就业','放弃就业','推迟就业','拒绝就业'] 
                        var jobStatus = jobStatusArr[item.s_jobstatus]
                        userTable = userTable + '<tr style="width:25%"><td>'+item.s_name+'</td><td>'+i_time+'</td><td>'+item.b_name+'</td><td>'+jobStatus+'</td></tr>'
                    }
                    userTable += '</table>'
                    $("#myModalLabel").html("录用人员列表")   
                }else if(type==4){
                    var userTable = "<table style='width:100%' class='ceensus_info'><th>学员姓名</th><th>班级名称</th><th>就业时间</th><th>就业状态</th>"
                    for(var i=0;i<result.data.length;i++){
                        var item = result.data[i]
                        var s_getjobtime = item.s_getjobtime ? (new Date(item.s_getjobtime)).toLocaleDateString() : ''
                        var jobStatusArr = ['','无工作','自主就业','推荐就业','放弃就业','推迟就业','拒绝就业'] 
                        var jobStatus = jobStatusArr[item.s_jobstatus]
                        userTable = userTable + '<tr style="width:25%"><td>'+item.s_name+'</td><td>'+item.c_name+'</td><td>'+s_getjobtime+'</td><td>'+jobStatus+'</td></tr>'
                    }
                    userTable += '</table>'
                    $("#myModalLabel").html("就业人员列表")   
                }
                
                
            }else{
                var userTable = '<h4 style="text-align:center">暂无数据</h4>'
            }
            
            $(".modal-body").html(userTable)
            $('#myModal').modal('show') 

        }

    })
}
