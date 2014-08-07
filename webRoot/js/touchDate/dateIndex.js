define(function(require, exports, module) {
    var t = $;
    var r = require("./touchDate.js");
    t(function() {
        var w = window;
		var z = new r(".js_date_0",{});//日期选择实例一
		var x = new r(".js_date_1",{});//日期选择实例二
		var y = new r(".js_date_2",{});//日期选择实例三
		var n = new r(".js_date_3",{});//日期选择实例四
        t(w).on("load",
        function() {
			$("dd.js_date_0").on("tap click",function(){
				z.showIn();
				return false;
			});
            $("dd.js_date_1").on("tap click",function(){
				x.showIn();
				return false;
			});
			$("dd.js_date_2").on("tap click",function(){
				y.showIn();
				return false;
			});
			$("dd.js_date_3").on("tap click",function(){
				n.showIn();
				return false;
			});
        })
    })
}); 