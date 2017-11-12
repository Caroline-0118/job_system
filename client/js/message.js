$(function(){
	/**
	 * 获取未读消息列表
	 * @param  {[type]} flag 0 表示未读消息，1表示已读消息
	 * @return {[type]}      [description]
	 */
	var getMessageList = function(flag){
		var url = '/getMessageList.do'
		var reqData = {
			m_status : 0 
		} 
		
		$.post(url,reqData,function(result){
				// 总消息条数
				$('#msgNo').text(result.noRead)
				$('#msgNumber').text(result.noRead)
				$('#msgRd').text(result.hasRead)
				$(".messageList").empty()
				// 消息列表
				for(var i=0;i<result.data.length;i++){
					var item = result.data[i];
					var li = document.createElement('li');
					// 消息内容
					var content = document.createElement('span');
					content.innerText = item.m_content;
					// 标记为已读
					var read = document.createElement('a');
					read.className = "read"
					read.setAttribute('m_id',item.m_id);
					read.setAttribute('m_status',1);
					read.text = "（标记为已读）"
					// 删除消息
					var del = document.createElement('a');
					del.className = "del"
					del.text = "删除"
					del.setAttribute('m_id',item.m_id);
					li.appendChild(content);
					li.appendChild(read);
					li.appendChild(del);
					$(".messageList").append(li)
				}
			
		})
	
	}
	/**
	 * 获取未读消息列表
	 * @param  {[type]} flag 0 表示未读消息，1表示已读消息
	 * @return {[type]}      [description]
	 */
	var getReadMsgList = function(){
		var url = '/getMessageList.do'
		var reqData = {
			m_status : 1 
		} 
		
		$.post(url,reqData,function(result){
				// 总消息条数
				$('#msgNo').text(result.noRead)
				$('#msgNumber').text(result.noRead)

				$('#msgRd').text(result.hasRead)
				$(".messageReadList").empty()
				// 消息列表
				for(var i=0;i<result.data.length;i++){
					var item = result.data[i];
					var li = document.createElement('li');
					// 消息内容
					var content = document.createElement('span');
					content.innerText = item.m_content;
					// 标记为已读
					var read = document.createElement('a');
					read.className = "read"
					read.setAttribute('m_id',item.m_id);
					read.setAttribute('m_status',0);
					read.text = "（标记为未读）"
					// 删除消息
					var del = document.createElement('a');
					del.className = "del"
					del.text = "删除"
					del.setAttribute('m_id',item.m_id);
					li.appendChild(content);
					li.appendChild(read);
					li.appendChild(del);
					$(".messageReadList").append(li)
				}
			
		})
	
	}
	// 初始化未读消息列表
	getMessageList(0);
	// 检测标记为已读、未读
	$(document).on('click','.read',function(){
		var m_id = $(this).attr('m_id');
		var m_status = $(this).attr('m_status');
		var url = "/changeMsgStatus.do"
		var reqData = {
			list : [m_id],
			m_status : m_status
		}
		$.post(url,reqData,function(data){
			if (data) {
				getMessageList(0);
				getReadMsgList();
			}
		})
	})
	/**
	 * 获取未读消息列表
	 * @param  {[type]} ){		getMessageList(0);	} [description]
	 * @return {[type]}                            [description]
	 */
	$(document).on('click','#unMsg',function(){
		getMessageList();
	})
	/**
	 * 获取已读消息列表
	 * @param  {[type]} ){		getMessageList(0);	} [description]
	 * @return {[type]}                            [description]
	 */
	$(document).on('click','#Msg',function(){
		getReadMsgList();
	})
	/**
	 * 删除消息
	 * @param  {[type]} ){	} [description]
	 * @return {[type]}        [description]
	 */
	$(document).on('click','.del',function(){
        //利用对话框返回的值 （true 或者 false）  
        if (confirm("你确定要删除消息吗？")) {  
            	var m_id = $(this).attr('m_id');
				var url = "/deleteMessage.do"
				var reqData = {
					list : [m_id]
				}
				$.post(url,reqData,function(data){
					if (data) {
						getMessageList(0);
					}
				})
        	} 
	  
	})


})