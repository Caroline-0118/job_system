$(function(){
	/*
	*  获取班级详细信息
	*/
	var getClassDetail = function(id){
		var url = "/getClassDetail.do?c_id=24"
		$.get(url,function(data){
			if (data.status == 0) {
				// 1. 填充基本信息
				var baseInfo = data.data.baseInfo[0]
				$('#c_id').text(baseInfo.c_id)
				$('#c_name').text(baseInfo.c_name)
				$('#c_hr').text(baseInfo.c_hr)
				$('#c_manager').text(baseInfo.c_manager)
				$('#c_begintime').text(baseInfo.c_begintime)
				$('#c_endtime').text(baseInfo.c_endtime)
				$('#c_address').text(baseInfo.c_address)
				$('#c_remark').text(baseInfo.c_remark)
				$('#c_qq').text(baseInfo.c_qq)
				$('#c_status').text(baseInfo.c_status)
				$('#c_closetime').text(baseInfo.c_closetime)
			}else{
				alert(data.msg);
			}
		})
	}
	getClassDetail();


})