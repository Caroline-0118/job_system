$(function(){
	/*
	*  获取班级详细信息
	*/
	var getClassDetail = function(id){
		var class_id = sessionStorage.getItem("class_id");
		var url = "/getClassDetail.do?c_id="+class_id
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
				var statusObj = {
					'00' : '未结班',
					'01' : '正在申请结班',
					'02' : '结业申请被拒绝',
					'11' : '已结班'
				}
				$('#c_status').text(statusObj[baseInfo.c_status])
				$('#c_closetime').text(baseInfo.c_closetime)
				// 2. 填充班级学生信息
				var mail = 0 ; //男生人数
				var femail = 0 ; //女生人数
				var stuInfo = data.data.stuInfo
				var jobStuArr = [[],[],[],[],[],[],[]] //分别存放工作状态  分别存放 无工作， 自主就业，推荐就业，放弃工作，推迟就业，拒绝就业
				var educateArr = [[],[],[],[],[],[],[],[],[],[]] //，1初中，2高中、中专，4专科，6本科，8研究生，9博士
				stuInfo.forEach(function(stu){
					stu.s_sex == '男' ? mail++ : femail++
					jobStuArr[stu.s_jobstatus].push(stu.s_name)//就业状态
					educateArr[stu.s_education].push(stu.s_name)//学历状况
				})
				var total = mail+femail 
				$('#c_total').text(total+"人")//总人数
				$('#c_sex').text("男生："+mail+"人，女生"+femail+"人")
				// 拼接学历状况
				var eduStr = ""
				var eduObj = {
					"1":"初中" ,
					"2":"高中" ,
					"3":"中专",
					"4":"专科" ,
					"5":"专科(自考)",
					"6":"本科" ,
					"7":"本科(自考)",
					"8":"研究生" ,
					"9":"博士" 
				}
				educateArr.forEach(function(edu,index){
					if (edu.length>0) {
						eduStr += "其中 "+eduObj[index]+edu.length+"人，"
					}
				})
				$('#s_education').text(eduStr) 
				// 拼接工作状况
				// var eduObj = {
				// 	"1":"无工作" ,
				// 	"2":"自主就业" ,
				// 	"3":"推荐就业" ,
				// 	"4":"放弃工作" ,
				// 	"5":"推迟就业" ,
				// 	"6":"拒绝就业" 
				// }
				jobStuArr[1].length > 0 ? $('#self_job').text("无工作"+jobStuArr[1].length+"人，"+jobStuArr[1].toString()) :  $('#self_job').hide()
				jobStuArr[2].length > 0 ? $('#self_job').text("自主就业"+jobStuArr[2].length+"人，"+jobStuArr[2].toString()) :  $('#self_job').hide()
				jobStuArr[3].length > 0 ? $('#recom_job').text("推荐就业"+jobStuArr[3].length+"人，"+jobStuArr[3].toString()) :  $('#recom_job').hide()
				jobStuArr[4].length > 0 ? $('#giveupjob').text("放弃就业"+jobStuArr[4].length+"人，"+jobStuArr[4].toString()) : $('#giveupjob').hide()
				jobStuArr[5].length > 0 ? $('#delayjob').text("推迟就业"+jobStuArr[5].length+"人，"+jobStuArr[5].toString()) :  $('#delayjob').hide()
				jobStuArr[6].length > 0 ? $('#rejob').text("再就业"+jobStuArr[6].length+"人，"+jobStuArr[6].toString()) :  $('#rejob').hide()
				
				var shouldrecostu =jobStuArr[3].length+jobStuArr[2].length+jobStuArr[1].length+jobStuArr[6].length;
				var hasjoballstu =jobStuArr[3].length+jobStuArr[2].length+jobStuArr[6].length;
				var percent = (hasjoballstu / shouldrecostu).toFixed(2);
				$("#c_percent").text("就业率："+percent*100+"%");
				// 3. 填充最近动态
				$(".approInfo").empty();
				var approInfo = data.data.approInfo
				approInfo.forEach(function(app){
					var time  = (new Date(app.m_time)).toLocaleString()
					var li = document.createElement('li');
					var tt = document.createElement('strong');
					tt.setAttribute('class','class-title');
					tt.innerText = '消息内容：';

					var content = document.createElement('span');
					content.innerText = time + " , "+app.m_content ;
					li.appendChild(tt);
					li.appendChild(content);
					$(".approInfo").append(li);
				})

			}else{
				alert(data.msg);
			}
		})
	}
	getClassDetail();


})