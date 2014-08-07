$(function(){	
	//车险查询 car.html ：保单号查询/车牌号查询   切换
	//我的保单 mine.html ：官网保单/其他保单   切换
	//两个页面公用同一段脚本:
	(function(){
		$(".butt_wrap h3").on("tap click",function(){
			$(this).addClass("current").siblings("h3").removeClass("current");
			$(".tab_div").eq($(this).index()).addClass("show_div").siblings("div").removeClass("show_div");
		});
	})();
	
	//回到顶部   几乎每个页面都用到
	(function(){
		var $button = $(".top_icon");
		$(window).scroll(function(){
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollTop > 20){//滚动距离大于50的时候 显示出来
				$button.show();
			}else{
				$button.hide();
			}
		});	
		$button.on("tap click",function(){
			document.documentElement.scrollTop = document.body.scrollTop = 0 ;
			return false ;
		});	
	})();
	

	(function(){
		$("div.top").on("click",function(){
			history.go(-1);
		});
	})();
	
	//页面最小高度控制，防止过小高度下，页尾不居底
	(function(){
		var maxHeight = null;
		var width = $(window).width();
		var height = $(window).height();
		var $main = $("body").children("div.main");
		var $pc_main = $("body").children("div.pc_main");
		maxHeight = Math.max(parseInt(width),parseInt(height));
		if($main.size()){
			$main.css("minHeight",maxHeight - 108 - 127);
		}
		if($pc_main.size()){
			$pc_main.css("minHeight",maxHeight - 43 - 127);
		}
	})();
	
	(function(){
		$("input").on("focus",function(){
			$("div.top").css("position","absolute");
		}).on("blur",function(){
			$("div.top").css("position","fixed");
		});
	})();

});

//只允许输入字母和数字的函数
function onlyNumChar(obj){
	obj.timer = setInterval(replaceChar,100);
	function replaceChar(){
		obj.value = obj.value.replace(/[^\w]/ig,"");
	}
}

//禁止输入非法字符的函数
function replaceSpeChar(obj){
	obj.timer = setInterval(replaceChar,100);
	function replaceChar(){
		obj.value = obj.value.replace(/[^\u4e00-\u9fa5\w]/g,"");
	}
}

//停止输入框定时检测的函数
function stopCheck(obj){
	clearInterval(obj.timer);
}