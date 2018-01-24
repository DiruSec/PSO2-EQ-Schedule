//各种function

function dayparser(day) //确定行号
{
	if(day.split("水").length - 1 == 1) {
		return 1;
	} else if(day.split("木").length - 1 == 1) {
		return 2;
	} else if(day.split("金").length - 1 == 1) {
		return 3;
	} else if(day.split("土").length - 1 == 1) {
		return 4;
	} else if(day.split("日").length - 1 == 2) {
		return 5;
	} else if(day.split("月").length - 1 == 2) {
		return 6;
	} else if(day.split("火").length - 1 == 1) {
		return 7;
	} else if(day == "期間ブースト") {
		return "boostevent";
	};
}

function timeparser(time) //单纯地把json里面的XX:XX改成纯小时
{
	var output
	if(time.indexOf(30) != -1) {
		output = time.replace(/:30/, "")
	} else {
		output = time.replace(/:00/, "")
	}
	if(zone == "gmt8") {
		output = output - 1
	}
	return parseInt(output);
}

function textinputer(name) //填写紧急日期、最后更新以及其它
{
	//判断是否为日期，进行对应的处理
	if(name == "lastupdate") {
		//用于填写最后更新时间
		//var $lastupdate = $("#lastupdate");
		$("#lastupdate").html("Last Updated At " + timedata.lastupdate);
	} else if(name == "期間ブースト") {
		//console.log(name);
	} else {
		$("#timetable tr:eq(" + tablerows + ") td:eq(0)").html(moment(name).format("M/D(dd)"));
	}
}

function hideBlank() //隐藏空行
{
	var tr = document.getElementsByTagName('th');
	$.each(timestatus, function(no, status) {
		if(status == "off") {
			var i = parseInt(no) + 1; //不知道为什么序号过来是string，需要改成数值才能做加法
			$("#timetable tr th:eq(" + i + ")").hide();
			i++;
			$("#timetable tr td:nth-child(" + i + ")").hide();
		}
	})
}

function resetTable() //重置已加载的所有内容，清空表格
{
	var tr = document.getElementsByTagName('th');
	// $("#boosttable").empty()
	$("#mtnupdatetable").empty()
	// var init = $('<caption>Boost Event Info</caption><thead><tr><th>时间</th><th>任务</th><th style="width: 40%;">BUFF内容</th></tr></thead></tr></thead><tbody></tbody>')
	// init.appendTo($("#boosttable"));
	($('<caption>Maintenance &amp; Update Info</caption>')).appendTo($("#mtnupdatetable"))
	$("#abbr").empty()
	$.each(timestatus, function(no, status) {
		var i = parseInt(no) + 1;
		$("#timetable tr th:eq(" + i + ")").show();
		i++; //不知道为什么序号过来是string，需要改成数值才能做加法
		$("#timetable tr td:nth-child(" + i + ")").show();
		if(status == "on") {
			$("#timetable tr td:nth-child(" + i + ")").empty();
			$("#timetable tr td:nth-child(" + i + ")").removeClass();
			$("#timetable tr td:nth-child(" + i + ")").removeAttr("colspan");
		}
	})

}

function questparser(name) //将json里的紧急全称处理为简称
{
	var output
	$.each(questname, function(quest, value) {
		if(name == quest) {
			if(availablequest.indexOf(name) == -1) {
				availablequest.push(name)
				var span = $('<span class=\"' + value[1] + '\">' + value[0] + '</span>')
				span.appendTo($("#abbr"))
				var content = $("<span>：" + name + "</span><br />")
				content.appendTo("#abbr")
			}
			output = value[0];
			return false; //判断成功后必须跳出，否则会继续循环而只留下json文件最末尾的
		} else {
			output = name;
		}
	})
	return output
}

function casinoparser(name) //输出赌场BUFF机台名
{
	if(name.indexOf("ラッピースロット") >= 0) {
		return "赌场拉比机BUFF"
	} else if(name.indexOf("メセタンシューター") >= 0) {
		return "赌场大炮BUFF"
	} else if(name.indexOf("ブラックニャック") >= 0) {
		return "赌场21点BUFF"
	} else if(name.indexOf("リーリールーレット") >= 0) {
		return "赌场轮盘BUFF"
	} else if(name.indexOf("アークマスロット") >= 0) {
		return "赌场黑熊机BUFF"
	} else {
		return name
	}
}

function leagueparser(name) //输出AL名
{
	if(name.indexOf("ハイスコア") >= 0) {
		return "排名：飞机(高分)"
	} else if(name.indexOf("エネミー種撃破") >= 0) {
		var text = name.match(/.*?エネミー種撃破：(.*)/)[1];
		return "排名" + (text.length>4?"<br/>":"") + "(" + text + ")"
	} else if(name.indexOf("アイテム収集") >= 0) {
		var text = name.match(/アイテム収集：(.*)/)[1];
        return "排名" + (text.length>4?"<br/>":"") + "(" + text + ")"
	} else if(name.indexOf("指定エネミー撃破") >= 0) {
		var text = name.match(/指定エネミー撃破：(.*)/)[1];
        return "排名" + (text.length>4?"<br/>":"") + "(" + text + ")"
	} else if(name.indexOf("累計スコア") >= 0) {
		return "排名：飞机(累计)"
	}
}

function durationparser(time) //将跨时间的活动输出为纯小时（数组）
{
	var start = time.replace(/( |)～.{4,6}/, "");
	var end = time.replace(/.{4,6}～( |)/, "");
	if (end == "00:00" ){
		end = "24:00"
	} else if(end == "00:30"){
		end = "24:30"
	}
	return [start, end];
}

function statusupdater(time) //确认每小时是否发生紧急，用于隐藏没有紧急的时间
{
	timestatus[time] = "on"
}

function classparser(name) //给每个紧急加上类名来添加颜色
{
	var output
	$.each(questname, function(quest, value) {
		if(name == quest) {
			output = value[1];
			return false; //判断成功后必须跳出，否则会继续循环而只留下json文件最末尾的
		}
	})
	return output
}

function boostparser(content) //处理BUFF内容
{
	var orgname = ""
	var questname = ""
	var exp = ""
	var rd = ""
	var re = ""
	var mst = ""
	var oth = ""
	var bc = ""
	$.each(boostname, function(boost, value) {
		if(content.indexOf(boost) >= 0) {
			orgname = "<br />" + "(" + boost + ")";
			questname = value;
			return false; //判断成功后必须跳出，否则会继续循环而只留下json文件最末尾的
		}
	})
	if(content.indexOf("獲得経験値") >= 0) {
		if(content.indexOf("合計") >= 0) {
			exp = "获得经验值" + content.match(/合計.*?獲得経験値.*?(＋.*?％)/)[1] + "　"
		} else {
			exp = "获得经验值" + content.match(/獲得経験値.*?(＋.*?％)/)[1] + "　"
		}
	}
	if(content.indexOf("レアドロップ") >= 0) {
		if(content.indexOf("合計") >= 0) {
			rd = "稀有掉率" + content.match(/合計.*?レアドロップ.*?(＋.*?％)/)[1] + "　"
		} else {
			rd = "稀有掉率" + content.match(/レアドロップ.*?(＋.*?％)/)[1] + "　"
		}
	}
	if(content.indexOf("レアエネミー出現") >= 0) {
		re = "稀有怪物出现率" + content.match(/レアエネミー出現.*?(＋.*?％)/)[1] + "　"
	}
	if(content.indexOf("獲得メセタ") >= 0) {
		mst = "获得美塞塔" + content.match(/獲得メセタ.*?(＋.*?％)/)[1] + "　"
	}
	if(content.indexOf("獲得バトルコイン") >= 0) {
		bc = "获得BC" + content.match(/獲得バトルコイン.*?(＋.*?％)/)[1] + "　"
	}
	if(exp == "" && rd == "" && re == "" && mst == "" && bc == "") {
		oth = content
	}
	return [questname + orgname, exp + rd + re + mst + bc + oth]
}

// function boostcreator(time, content) //创建BUFF表格
// {
// 	var tr = $("<tr></tr>");
// 	tr.appendTo($("#boosttable"));
// 	var td = $("<td>" + time + "</td>");
// 	var td2 = $("<td>" + content[0] + "</td>");
// 	var td3 = $("<td>" + content[1] + "</td>");
// 	td.appendTo(tr);
// 	td2.appendTo(tr);
// 	td3.appendTo(tr);
// }

function durationhider() {  //将跨时间（如AL）间没有紧急的小时数隐藏
	$.each(durationhide, function(a, b) {
		var col = 1;
		var hide = $("#" + b[0])
		for(var i = b[2]; i < b[3] - 1; i++) {
			if(timestatus[i] == "on") {
				col++;
				hide = hide.next();
				hide.hide();
			}
		}
		$("#" + b[1]).hide();
		$("#" + b[0]).attr("colspan", col);
	})
}

function durationEqParser(origtime, questname){ // 处理在持续事件中的紧急
	isDurationEq = 0
	var durationStart = influenceDuration[0]
	var durationEnd = influenceDuration[1]
	if (durationEnd !== null && time >= durationStart && time <= durationEnd){
		if (isAddNewRow == 0){
			$("#timetable tr:eq(" + tablerows + ")").after("<tr id='t"+tablerows+"'></tr>")
			$("#timetable tr:eq(" + tablerows + ")").children().attr("rowspan",2)
			addedRows.push((tablerows+1))
			isAddNewRow = 1
		}
		$("#timetable tr:eq(" + tablerows + ") td:eq(" + (durationStart+1) + ")").attr("rowspan",1)
		while (durationStart < time){
			$("#t"+tablerows).append("<td></td>")
			durationStart ++
		}
		if (origtime.indexOf("30") != -1){
			$("#t"+tablerows).append("<td class='"+classparser(questname)+"'>("+time+":30)<br/>"+questparser(questname) +"</td>")
		} else{
			$("#t"+tablerows).append("<td class='"+classparser(questname)+"'>"+questparser(questname) +"</td>")			
		}
		while ((durationEnd-1) > time){
			$("#t"+tablerows).append("<td></td>")
			durationEnd --
		}
		isDurationEq = 1
	}
}

function checkIsAddRows(row){ //确认是否是用于合并的行
	while (addedRows.indexOf(row) != -1){
		row --
	}
	return row
}

function main() //主要处理函数
{
	tablerows = 0;
	hideweek = 0;
	maximumrows = 20;
	isDurationEq = 0;
	addedRows = []
	moment.locale(navigator.language)
	$.each(timedata, function(name, content) {
		isAddNewRow = 0
		influenceDuration = [null,null]
		// 时间冲突插入新行一次开关
		if(typeof content != "string" && /\d/gi.test(name)) {
			tablerows++; //确定行号
		}
		if(tablerows > Math.ceil(maximumrows/2)) {
			$(".week2").show()
			$(".weekswitch").show()
		}
		if(tablerows == (Math.ceil(maximumrows/2)+1)) {
			if(moment(name).format("MMDD") > moment().format("MMDD")) {
				hideweek = 2;
			} else {
				hideweek = 1;
			}
		}
		textinputer(name)
		//判断是否为string，防止错误处理
		if(typeof content != "string") {
			if(moment(name).format("MMDD") == moment().format("MMDD")) {
				$("#timetable tr:eq(" + tablerows + ")").css("background", "#ACF39D");
			}
			$.each(content, function(n, value) {
				if(value[1] == "緊急" && value[0].indexOf(30) == -1) {
					time = timeparser(value[0])
					if(zone == "gmt8" && time < 0) {
						var table = $("#timetable tr:eq(" + checkIsAddRows((tablerows-1)) + ") td:eq(" + 24 + ")")
						statusupdater(23)
					} else {
						var table = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (time + 1) + ")")
						statusupdater(time)
					}
				durationEqParser(value[0], value[2])
				if (isDurationEq != 1){
					table.html(questparser(value[2]));
					table.attr("class", classparser(value[2]));

					}
				}
				if(value[1] == "緊急" && value[0].indexOf(30) != -1) {
					time = timeparser(value[0])
					if(zone == "gmt8" && time < 0) {
						var table = $("#timetable tr:eq(" + checkIsAddRows((tablerows-1)) + ") td:eq(" + 24 + ")")
						statusupdater(23)
					} else {
						var table = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (time + 1) + ")")
						statusupdater(time)
					}
					durationEqParser(value[0], value[2])
					if(livestage == true) {
                        if(zone == "gmt8" && time < 0) {
                            table.html("演唱会" + "<br />" + "(23:30)" + "<br />" + questparser(value[2]));
                            table.attr("class", classparser(value[2]));
                            livestage = false;
                        } else {
                            table.html("演唱会" + "<br />" + "(" + time + ":30)" + "<br />" + questparser(value[2]));
                            table.attr("class", classparser(value[2]));
                            livestage = false;
                        }
					} else {
						if (isDurationEq != 1){
							table.html("(" + time + ":30)" + "<br />" + questparser(value[2]));
							table.attr("class", classparser(value[2]));
						}
					}
				}
				if(value[1] == "カジノイベント") {
					//分出来之后可能还用得到
					var start = timeparser(durationparser(value[0])[0]);
					var end = timeparser(durationparser(value[0])[1]);
					if(end - start > 1) {
						var startid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (start + 1) + ")").attr("id")
						var endid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + end + ")").attr("id")
						$("#" + startid).html(start + "时～" + end + "时" + "<br />" + casinoparser(value[2]));
						$("#" + startid).attr("class", "casino");
						var push = [startid, endid, start, end]
						durationhide.push(push)
					}
					if(end - start == 1) {
						var startid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (start + 1) + ")").attr("id")
						$("#" + startid).html(start + "时～" + end + "时" + "<br />" + casinoparser(value[2]));
						$("#" + startid).attr("class", "casino");
					}
					statusupdater(start);
					statusupdater(end - 1);
				}
				if(value[1] == "アークスリーグ") {
					showTime = ""
					//分出来之后可能还用得到
                    var prevDay = false
					var start = timeparser(durationparser(value[0])[0]);
					var end = timeparser(durationparser(value[0])[1]);
					if (start<0){
						prevDay = true;
						start = 24 + start
						if (end === 0){
							end = 24
						}
					}
					//确认是否30分结束
					if (durationparser(value[0])[1].indexOf(30)!= -1){
						end = end + 1
					}
					//确认是否30分开始
					if (durationparser(value[0])[0].indexOf(30)!= -1 || durationparser(value[0])[0].indexOf(30)!= -1){
						showTime = start + ((durationparser(value[0])[0].indexOf(30) != -1)? ":30":":00") + "~" + end + ((durationparser(value[0])[1].indexOf(30) != -1)? ":30":":00") + "<br/>"
					}
					if(end - start > 1) {
						var startid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (start + 1) + ")").attr("id")
						var endid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + end + ")").attr("id")
						$("#" + startid).html(showTime+leagueparser(value[2]));
						$("#" + startid).attr("class", "ranking");
						var push = [startid, endid, start, end]
						durationhide.push(push)
					}
					if(end - start == 1) {
                        // var startid = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (start + 1) + ")").attr("id")
						var startid = $("#timetable tr:eq(" + (tablerows + (prevDay===true?-1:0)) + ") td:eq(" + (start + 1) + ")").attr("id")
						$("#" + startid).html(showTime+leagueparser(value[2]));
						$("#" + startid).attr("class", "ranking");
					}
					statusupdater(start);
					statusupdater(end - 1);
					influenceDuration = [start, end]
				}
				// if(name != "期間ブースト" && value[1] == "ブースト") {
				// 	var table = $("#timetable tr:eq(" + tablerows + ") td:eq(" + 25 + ")")
				// 	table.html(value[2]);
				// }
				// if(name == "期間ブースト" && value[1] == "ブースト") {
				// 	boostcreator(value[0], boostparser(value[2]))
				// };
				// if(name == "期間ブースト" && value[1] == "イベント報酬") {
				// 	boostcreator(value[0], boostparser(value[2]))
				// };
				if(value[1] == "ライブ" && value[0].indexOf(30) == -1) {
					livestage = true;
				}
				if(value[1] == "ライブ" && value[0].indexOf(30) != -1) {
					time = timeparser(value[0])
					if(zone == "gmt8" && time < 0) {
						var table = $("#timetable tr:eq(" + (tablerows - 1) + ") td:eq(" + 24 + ")")
						table.html("(23:30)" + "<br />" + "演唱会");
						statusupdater(23)
					} else {
						var table = $("#timetable tr:eq(" + tablerows + ") td:eq(" + (time + 1) + ")")
						table.html("(" + time + ":30)" + "<br />" + "演唱会");
						statusupdater(time)
					}
				}
			});
		}
		if (isAddNewRow != 0){
			tablerows ++
			maximumrows = maximumrows + 2
		}
	});
	durationhider();
	hideBlank();
	if(hideweek == 2) {
		btnweek2()
	} else if(hideweek == 1) {
		btnweek1()
	}
}

function mtnupdate() {  //维护、更新通知处理
	if(mtndata["hasupdate"] == "true") {
		var tr = $("<tr></tr>");
		tr.appendTo($("#mtnupdatetable"));
		var td = $("<td>更新补丁发布</td>");
		var td2 = $("<td>时间：" + mtndata["updatetime"] + "<br />" + "大小：" + mtndata["updatesize"] + "（PC版）</td>");
		td.appendTo(tr);
		td2.appendTo(tr);
	}
	if(mtndata["ismtnchanged"] == "true") {
		var starthour = mtndata["mtnstart"].split(":")[0];
		var startminute = mtndata["mtnstart"].split(":")[1];
		var endhour = mtndata["mtnend"].split(":")[0];
		var endminute = mtndata["mtnend"].split(":")[1];
		if(zone == "gmt8") {
			starthour--;
			endhour--;
		}
		var tr = $("<tr></tr>");
		tr.appendTo($("#mtnupdatetable"));
		var td = $("<td>定期维护时间变更</td>");
		var td2 = $("<td>时间：" + mtndata["mtndate"] + " " + starthour + ":" + startminute + "~" + endhour + ":" + endminute + "</td>");
		td.appendTo(tr);
		td2.appendTo(tr);
	}
	if(mtndata["ismtnchanged"] == "false" && mtndata["ismtncancelled"] == "false") {
		var tr = $("<tr></tr>");
		tr.appendTo($("#mtnupdatetable"));
		var td = $("<td>定期维护正常进行</td>");
		if(zone == "gmt8") {
			var td2 = $("<td>时间：每周三 10:00~16:00</td>");
		} else {
			var td2 = $("<td>时间：每周三 11:00~17:00</td>");
		}
		td.appendTo(tr);
		td2.appendTo(tr);
	}
	if(mtndata["ismtncancelled"] == "true") {
		var tr = $("<tr></tr>");
		tr.appendTo($("#mtnupdatetable"));
		var td = $("<td>定期维护取消</td>");
		var td2 = $("<td>时间：" + mtndata["mtncanceldate"] + "</td>");
		td.appendTo(tr);
		td2.appendTo(tr);
	}
}

function btnweek1() {
	if($("#btnw1").val() == "on") {
		$(".week1").hide();
		$("#btnw1").val("off");
		$("#btnw1").html("显示第一周紧急");
	} else {
		$(".week1").show();
		$("#btnw1").val("on");
		$("#btnw1").html("隐藏第一周紧急");
	}
}

function btnweek2() {
	if($("#btnw2").val() == "on") {
		$(".week2").hide();
		$("#btnw2").val("off");
		$("#btnw2").html("显示第二周紧急");
	} else {
		$(".week2").show();
		$("#btnw2").val("on");
		$("#btnw2").html("隐藏第二周紧急");
	}
}

// 正片 
//初始化一下时间开关
var timestatus = {
	0: "off",
	1: "off",
	2: "off",
	3: "off",
	4: "off",
	5: "off",
	6: "off",
	7: "off",
	8: "off",
	9: "off",
	10: "off",
	11: "off",
	12: "off",
	13: "off",
	14: "off",
	15: "off",
	16: "off",
	17: "off",
	18: "off",
	19: "off",
	20: "off",
	21: "off",
	22: "off",
	23: "off"
};
var availablequest = []
var durationhide = []
// var questname = {}
// var boostname = {}
var timedata = {}
var livestage = false
var showNotice

 //关闭AJAX缓存
$.ajaxSetup ({
cache: false
});

//时区转换用，转换时区时得先重置表格再重做一次填充…
$(document).ready(function() {
	$("input[name=timezone]").on("change", function() {
		resetTable()
		availablequest = []
		durationhide = []
		timestatus = {
			0: "off",
			1: "off",
			2: "off",
			3: "off",
			4: "off",
			5: "off",
			6: "off",
			7: "off",
			8: "off",
			9: "off",
			10: "off",
			11: "off",
			12: "off",
			13: "off",
			14: "off",
			15: "off",
			16: "off",
			17: "off",
			18: "off",
			19: "off",
			20: "off",
			21: "off",
			22: "off",
			23: "off"
		};
		zone = $("input[name='timezone']:checked").val();
		main();
		mtnupdate();
	});
	if ((document.cookie).indexOf("showNotice=false") == -1){
		$(".notice").css("display","block")
		$(".notice").on("click", function(){
			$(this).css("display","none")
			document.cookie = "showNotice = false; " + "expires=" +  new Date(new Date()-0+30*86400000).toGMTString();
		})
	}
})

// 按顺序读取三个json，确保全部读取成功
$.getJSON("script/schedule.json", function(data) { //时间表内容
	timedata = data;
	// $.getJSON("script/boost.json", function(data) { //BUFF对象名称替换
	// 	boostname = data;
	// 	$.getJSON("script/questreplace.json", function(data) { //紧急缩写替换
	// 		questname = data;
			zone = $("input[name='timezone']:checked").val();
			main();
	// 	}, "json");
	// }, "json");
}, "json");

$.getJSON("script/mtnupdate.json", function(data) {
	mtndata = data;
	zone = $("input[name='timezone']:checked").val();
	mtnupdate();
}, "json");