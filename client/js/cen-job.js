//初始化
var color=["purple","pink","yellow","inverse","success"];
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
        var percent=allstu/(allstu+nostu)*100;
        if(percent<100){
            $("#showclassjob").html($("#showclassjob").html()+
                "<div class='row'>" +
                    "<div class='col-xs-3'>" +
                        "<p class='class_name'>"+data[i].c_name+"：</p>" +
                    "</div>" +
                    "<div class='col-xs-4'>" +
                        "<div class='progress progress-striped' data-percent='"+Math.round(percent*100)/100+"%'>" +
                            "<div class='progress-bar progress-bar-"+color[num]+"' style='width: "+percent+"%'></div>" +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-3'>" +
                        "<p style='font-size: 18px;text-align: center'>"+nostu+"</p>" +
                    "</div>" +
                "</div>")
        }
    }
});


