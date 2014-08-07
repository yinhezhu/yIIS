define(function(require, exports, module) {
    var r = require("./touchDateLimit.js");
    $(function() {
        var w = window;
		var oDate = new Date();
		var time = oDate.getTime();
		var endTime = time + 90*24*60*60*1000;
		var startTime = time + 1*24*60*60*1000 * 365 ;
		var oEndTime = new Date();
		var oStartTime = new Date();
		oStartTime.setTime(startTime);
		oEndTime.setTime(endTime);
		var startYear = 2004,
		startMonth = oStartTime.getMonth() + 1,
		startDay = oStartTime.getDate();
		var endYear = oEndTime.getFullYear(),
		endMonth = oEndTime.getMonth() + 1,
		endDay = oEndTime.getDate();
		var oneYear = time - 364*24*60*60*1000;
		var oneDate = new Date();
		oneDate.setTime(oneYear);
		var oneFullYear = oneDate.getFullYear();
		var oneMonth = oneDate.getMonth() + 1;
		var oneDay = oneDate.getDate();
		var z = new r(".js_date_1",{
			minYear:oneFullYear,
			minMonth:oneMonth,
			minDay:oneDay,
			maxYear:oDate.getFullYear(),
			maxMonth:oDate.getMonth() + 1,
			maxDay:oDate.getDate(),
			callBack : function(){
				var _this = this;
				$("dd.js_date_1").html(_this.year + "-"+ _this.month +"-"+ _this.day);
			}
		});//日期选择实例一
		/*var o = new r(".js_date_2",{
			minYear:startYear,
			minMonth:startMonth,
			minDay:startDay,
			maxYear:endYear,
			maxMonth:endMonth,
			maxDay:endDay,
			callBack : function(){
				var _this = this;
				$("dd.js_date_2").html(_this.year + "-"+ _this.month +"-"+ _this.day);
			}
		});*///日期选择实例二
		$(w).on("load", function() {
			$("dd.js_date_1").on("click",function(){
				z.showIn();
				return false;
			});
			$("dd.js_date_2").on("click",function(){
				o.showIn();
				return false;
			});
        })
    })
}); 