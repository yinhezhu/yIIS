define(function(require, exports, module) {
    var r = require("./touchDateLimit.js");
    $(function() {
        var w = window;
		var oDate = new Date();
		var time = oDate.getTime();
		var endTime = time + 365*24*60*60*1000;
		var startTime = time + 1*24*60*60*1000;
		var oEndTime = new Date();
		var oStartTime = new Date();
		oStartTime.setTime(startTime);
		oEndTime.setTime(endTime);
		var startYear = oStartTime.getFullYear(),
		startMonth = oStartTime.getMonth() + 1,
		startDay = oStartTime.getDate();
		var endYear = oEndTime.getFullYear(),
		endMonth = oEndTime.getMonth() + 1,
		endDay = oEndTime.getDate();
		var z = new r(".js_date",{
				minYear:startYear,
				minMonth:startMonth,
				minDay:startDay,
				maxYear:endYear,
				maxMonth:endMonth,
				maxDay:endDay,
				callBack : function(){
					alert(123);
				}
			});//日期选择实例一
        $(w).on("load", function() {
			$("div.js_date").on("click",function(){
				z.showIn();
				return false;
			});
        })
    })
}); 