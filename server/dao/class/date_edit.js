/*
ʱ���ʽת����
 */

//��� YYYY-MM-DD
exports.date=function(time){
    return time.getFullYear()+"-"+(parseInt(time.getMonth())+1)+"-"+time.getDate();
};

//��� YYYY-MM-DD HH:MM:SS
exports.datetime=function(time){
    return time.getFullYear()+"-"+(parseInt(time.getMonth())+1)+"-"+time.getDate()+
        " "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
};

//��ȡ���ܵ�һ������һ��
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
