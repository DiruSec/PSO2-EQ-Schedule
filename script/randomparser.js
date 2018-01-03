pushlist = ["ship1", "ship2", "ship3", "ship4", "ship5", "ship6", "ship7", "ship8", "ship9", "ship10"]
makeloop()
randommain();

function randommain(){
$.getJSON("script/twitter.json", function (data) {
	twitterdata = data;
	$(".pushsetting").hide()
	randominput()
	pushDataInit()
}, "json");
}

function rqparser(name) //将json里的紧急全称处理为简称
{
    var output
    $.each(randomname,function(quest,value) {
        if (name == quest) 
        {
            output = [value[0],value[1]];
            return false; //判断成功后必须跳出，否则会继续循环而只留下json文件最末尾的
        }
        else if (name.indexOf("時") >= 0){
        	output = ["[2小时CD]","none"];
        } else{
            output = [name,""];
        }
    })
    return output
}

function randominput(){
	$.each(twitterdata,function(index,content){
    	var tr=$("<tr></tr>"); 
    	tr.appendTo($("#randomtable tbody"));
    	if (content["lastupdate"]!= null){
    		$("#randomupdate").html("Last Updated At " + content["lastupdate"]);
    	}
    	if (content["text"]!= null){
    		($("<td>"+content["time"]+"时</td>")).appendTo(tr);
		if (content["text"].indexOf("ありません") != -1){
			var noeqtext ="没有紧急"
			if (content["text"].indexOf("予告イベントの影響") != -1){
				noeqtext ="没有紧急（原因：上一时段固定紧急的影响）"
			} else if (content["text"].indexOf("時間前です") != -1){
				noeqtext ="没有紧急，即将开始维护"
			}
			($('<td colspan="10">'+ noeqtext+'</td>')).appendTo(tr);
		} else if ((content["text"].match(/(\d*):(\d*) (.*?)(?:(\n)|(\r)|　)/))!==null){
			var hour = content["text"].match(/(\d*):(?:\d*) (?:.*?)(?:(\n)|(\r)|　)/)[1] - 1;
            if (hour < 0){
                hour = 23;
            }
			var minute = content["text"].match(/(?:\d*):(\d*) (?:.*?)(?:(\n)|(\r)|　)/)[1];
			if (content["text"].indexOf("開催中") != -1){
				statustext = "【固定紧急：上一时段】";
			} else if (content["text"].indexOf("準備中") != -1){
				statustext = "【固定紧急：本时段】";
			} else{
				statustext = "【固定紧急：预报】";
			}
			($('<td colspan="10">'+ statustext +hour+":"+minute+" "+content["text"].match(/(?:\d*):(?:\d*) (.*?)(?:(\n)|(\r)|　)/)[1] +'</td>')).appendTo(tr);
		} else {
			var r1 = rqparser(checkNull(content["text"].match(/01:(.*?)(?:(\n)|　)/)));
			var r2 = rqparser(checkNull(content["text"].match(/02:(.*?)(?:(\n)|　)/)));
			var r3 = rqparser(checkNull(content["text"].match(/03:(.*?)(?:(\n)|　)/)));
			var r4 = rqparser(checkNull(content["text"].match(/04:(.*?)(?:(\n)|　)/)));
			var r5 = rqparser(checkNull(content["text"].match(/05:(.*?)(?:(\n)|　)/)));
			var r6 = rqparser(checkNull(content["text"].match(/06:(.*?)(?:(\n)|　)/)));
			var r7 = rqparser(checkNull(content["text"].match(/07:(.*?)(?:(\n)|　)/)));
			var r8 = rqparser(checkNull(content["text"].match(/08:(.*?)(?:(\n)|　)/)));
			var r9 = rqparser(checkNull(content["text"].match(/09:(.*?)(?:(\n)|　)/)));
			var r10 = rqparser(checkNull(content["text"].match(/10:(.*?)(?:(\n)|　)/)));
			($('<td class="'+r1[1]+'">'+r1[0]+'</td>')).appendTo(tr);
			($('<td class="'+r2[1]+'">'+r2[0]+'</td>')).appendTo(tr);
			($('<td class="'+r3[1]+'">'+r3[0]+'</td>')).appendTo(tr);
			($('<td class="'+r4[1]+'">'+r4[0]+'</td>')).appendTo(tr);
			($('<td class="'+r5[1]+'">'+r5[0]+'</td>')).appendTo(tr);
			($('<td class="'+r6[1]+'">'+r6[0]+'</td>')).appendTo(tr);
			($('<td class="'+r7[1]+'">'+r7[0]+'</td>')).appendTo(tr);
			($('<td class="'+r8[1]+'">'+r8[0]+'</td>')).appendTo(tr);
			($('<td class="'+r9[1]+'">'+r9[0]+'</td>')).appendTo(tr);
			($('<td class="'+r10[1]+'">'+r10[0]+'</td>')).appendTo(tr);
		}
		}
	})
}

// 【START】 计算时间差，自动在每小时特定时间点推紧急通知，用setTimeout方法 

function makeloop(){ 
	intervalcalc();
	var randomrefresh=setTimeout(function(){
	$("#randomtable tbody").empty();
	randommain();
	setTimeout(function(){
		makepush()
	},5000);
	makeloop();
	},refreshinterval);
}

function checkNull(object){
	if (object !== null){
		return object[1]
	} else{
		return "―"
	}
}
	
function intervalcalc(){
    var date=new Date();
	var m=date.getMinutes();
	var s=date.getSeconds();
	if (m > 7){
		refreshinterval = (67 - m)*60000;
	} else if (m < 7){
		refreshinterval = (7 - m)*60000;
	} else {
		refreshinterval = 3600000;
	}
}

// 【END】
    
function refreshbutton(){
	$("#randomtable tbody").empty();
	$("#refresh").prop("disabled",true)
	$("#refresh").html("正在刷新…")
	setTimeout(function(){
		randommain();
		$("#refresh").prop("disabled",false)
		$("#refresh").html("手动刷新")
	 },1500)
}

function pushSettingsbutton(){
	if($("#pushsetbtn").val() == "on") {
		$(".pushsetting").hide();
		$("#pushsetbtn").val("off");
		$("#pushsetbtn").html("打开通知设定");
	} else {
		$(".pushsetting").show();
		if (Notification.permission != "denied"){
			$("#permissiondenied").hide();
		}
		if (Notification.permission != "denied" && Notification.permission != "granted") {
			Notification.requestPermission(function (permission) {
			titletext = "新功能：桌面通知"
			shiptext = "每当下一小时的随机紧急情报发布时，会像这样弹出一个通知提醒你。\n要获取通知，你必须保持这个页面处于打开状态。最小化本页面不会影响通知的推送。"
			showPush()
			});
		}
		$("#pushsetbtn").val("on");
		$("#pushsetbtn").html("关闭通知设定");
	}

}

function pushDataInit(){
	shiptext = ""
	titletext = "紧急预报"
	interval = 0
	content = twitterdata[1]["text"]
	if (content.indexOf("ありません") != -1){
		shiptext ="然而并没有紧急…"
	if (content.indexOf("予告イベントの影響") != -1){
		shiptext ="然而并没有紧急…（原因：上一时段固定紧急的影响）"
	} else if (content.indexOf("時間前です") != -1){
		shiptext ="然而并没有紧急…即将开始维护"
		}
	}
	else if ((content.match(/(\d*):(\d*) (.*?)(?:(\n)|(\r)|　)/))!==null){
		var hour = content.match(/(\d*):(?:\d*) (?:.*?)(?:(\n)|(\r)|　)/)[1] - 1;
		if (hour < 0){
			hour = 23;
		}
		var minute = content.match(/(?:\d*):(\d*) (?:.*?)(?:(\n)|(\r)|　)/)[1];
		if (content.indexOf("開催中") != -1){
			shiptext = "【固定紧急：正在进行】";
			titletext = "固定紧急正在进行…"
		} else if (content.indexOf("準備中") != -1){
			shiptext = "【固定紧急：下一小时】";
			titletext = "请等待固定紧急…"
		} else {
			shiptext = "【固定紧急：预报】";
			titletext = "请等待固定紧急…"
		}
		
	shiptext = shiptext +hour+":"+minute+" "+content.match(/(?:\d*):(?:\d*) (.*?)(?:(\n)|(\r)|　)/)[1]
} else {
	interval = 1
	ship1 = "1船：" + rqparser(checkNull(content.match(/01:(.*?)(?:(\n)|　)/)))[0];
	ship2 = "2船：" + rqparser(checkNull(content.match(/02:(.*?)(?:(\n)|　)/)))[0];
	ship3 = "3船：" + rqparser(checkNull(content.match(/03:(.*?)(?:(\n)|　)/)))[0];
	ship4 = "4船：" + rqparser(checkNull(content.match(/04:(.*?)(?:(\n)|　)/)))[0];
	ship5 = "5船：" + rqparser(checkNull(content.match(/05:(.*?)(?:(\n)|　)/)))[0];
	ship6 = "6船：" + rqparser(checkNull(content.match(/06:(.*?)(?:(\n)|　)/)))[0];
	ship7 = "7船：" + rqparser(checkNull(content.match(/07:(.*?)(?:(\n)|　)/)))[0];
	ship8 = "8船：" + rqparser(checkNull(content.match(/08:(.*?)(?:(\n)|　)/)))[0];
	ship9 = "9船：" + rqparser(checkNull(content.match(/09:(.*?)(?:(\n)|　)/)))[0];
	ship10 = "10船：" + rqparser(checkNull(content.match(/10:(.*?)(?:(\n)|　)/)))[0];
	titletext = "下一整点紧急"
	}
}

if (window.Notification) {
		var button = document.getElementById('notitest');

		function makepush(){
			if (interval != 0){
				for (index in pushlist){
					if ($("#p"+pushlist[index]).prop("checked")){
						if (interval%3 == 0){
							shiptext = shiptext + eval(pushlist[index]) + "\r"
						} else {
							shiptext = shiptext + eval(pushlist[index]) + "｜"
						}
						interval = interval + 1
					}
				}
			}
			
			if ($("input[name='pushswitch']:checked").val() == "on") {
				if (Notification.permission == "granted") {
					showPush();
				} else if (Notification.permission != "denied") {
					Notification.requestPermission(function (permission) {
					showPush();
					});
				}
			}
		}
		
		function showPush() {
		// $('#notifyaudio').html('<audio autoplay="autoplay"><source src="image/notify.mp3" type="audio/mpeg"/></audio>');
		// $('audio').prop("volume",0.1)
			if (Notification.permission == "granted") {
				if (shiptext.length == 0){
					shiptext = "没有勾选任何船……"
				}
				var notification = new Notification(titletext, {
					body: shiptext,
					icon: '../image/logo.png',
					tag: 'randompush'
				});
			}
			pushDataInit()
		}
}

// 
// Cookie Area
// 

$(function() {
	pushSettingInit();
	$("#allcheck").prop("checked",$('input[name="pushship"]').length == $("input[name='pushship']:checked").length ? true : false);

	$("input[name=pushship],input[name=pushswitch],#allcheck").on("change", function() {
		setCookie();
		$("#allcheck").prop("checked",$('input[name="pushship"]').length == $("input[name='pushship']:checked").length ? true : false);
	});

	$("#allcheck").click(function() {
		$('input[name="pushship"]').prop("checked",this.checked); 
	});
	
	if (!window.Notification){
		$("#pushsetbtn").attr("disabled",true);
		$("#pushsetbtn").text("浏览器不支持通知功能");
	}
})

function pushSettingInit(){
	if (getCookie("pushswitch") == "off"){
		$("input[name='pushswitch'][value='off']").prop("checked", true)
	}
	for (index in pushlist){
		if (getCookie(pushlist[index]) == "false"){
			$("#p"+pushlist[index]).prop("checked", false)
		}
	}
	setCookie()
}

function getCookie(c_name) {
    if (document.cookie.length>0) { 
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1) {
            c_start=c_start + c_name.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        } 
    }
return ""
}

function setCookie(){
	for (index in pushlist){
	document.cookie = pushlist[index] + "=" + $("#p"+pushlist[index]).prop("checked") + "; "
					+ "expires=" +  new Date(new Date()-0+30*86400000).toGMTString();
	};
	document.cookie = "pushswitch=" + $("input[name='pushswitch']:checked").val() + "; " 
					+ "expires=" +  new Date(new Date()-0+30*86400000).toGMTString();
}