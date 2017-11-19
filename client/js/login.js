//页面加载完成时
$(document).ready(function(){
    $('#username').focus();//自动聚焦
});

//    获取屏幕高度
setInterval(function () {
    var screen=$(window).height();
    $("#header").css({height:0.18*screen+"px",padding:0.04*screen+"px"});
    $("#logo_image").css("height",0.1*screen+"px");
    $("#main").css("height",0.7*screen+"px");
    $(".item").css("height",0.7*screen+"px");
    $("#footer").css("height",0.12*screen+"px");
    $("#contain").css("margin-top",(0.7*screen-383)/2+"px");
    $(".item").find("img").css({"marginTop":0.2*screen/2+"px","height":0.5*screen+"px"});
    //$(".item")[0].getElementsByTagName("img")[0].style.marginTop=(0.7*screen-383)/2+"px";
    //$(".item")[1].getElementsByTagName("img")[0].style.marginTop=(0.7*screen-324)/2+"px";
},10);


//    登录验证
$("#login").click(function () {
    var username=$("#username").val();
    var password=$("#password").val();
    //       后台账户密码验证
    $.ajax({
        url:"/login.do",
        type:"post",
        data:{
            username:username,
            password:password
        },
        success:function(data){
            //登录失败动态更新页面
            if(data.result){
                var user = JSON.stringify(data.data[0])
                localStorage.setItem('user',user);
                window.location = "view/home.html";
            }else{
                $("#warning").html("用户名或密码错误！");
            }
        }
    })
});
