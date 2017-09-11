/*
时间格式转化类
 */

//输出 YYYY-MM-DD
exports.date=function(time){
    return time.getFullYear()+"-"+(parseInt(time.getMonth())+1)+"-"+time.getDate();
};

//输出 YYYY-MM-DD HH:MM:SS
exports.datetime=function(time){
    return time.getFullYear()+"-"+(parseInt(time.getMonth())+1)+"-"+time.getDate()+
        " "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
};

//获取本周第一天和最后一天
exports.week=function(){
    var now = new Date;
    var day = now.getDay ();
    var week = "7123456";
    var first = 0 - week.indexOf (day);
    var f = new Date;
    f.setDate (f.getDate () + first);
    var last = 6 - week.indexOf (day);
    var l = new Date;
    l.setDate (l.getDate () + last);
    return [
        f.getFullYear()+"-"+(parseInt(f.getMonth())+1)+"-"+f.getDate(),
        l.getFullYear()+"-"+(parseInt(l.getMonth())+1)+"-"+l.getDate()
    ];
};
