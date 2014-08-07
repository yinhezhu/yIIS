$(function (){

	(function(){
		divShow(".link2","#delete_layer");
		divShow(".link1","#group_layer");
		
		divShow("#phone","#phone_layer");
		divShow("#psw","#psw_layer");
		
		divShow(".layer_btn1","#group_layer2");
		divShow(".layer_btn2","#group_layer3");
		divShow(".link3","#delete_layer2");
		//lmx
        
		/*divShow("#service_btn1","#service1");
		divShow("#service_btn2","#service2");
		divShow("#service_btn3","#service3");
		
		
		divShow("#serv_btn1","#group_layer1");
		divShow("#serv_btn2","#group_layer2");
		divShow("#serv_btn3","#group_layer3");
		
		divShow("#serveCheck1","#group_layer1");
		divShow("#serveCheck2","#group_layer2");
		divShow("#serveCheck3","#group_layer3");*/
		
		$('body').css('min-height','854px');
		
		function divShow(button,layer){
			var $oMark = $(".mask");
			var $Close = $(".close");

			$(button).click(function(){

				$oMark.css('opacity',0);
				$("div.layer").hide();
				$(layer).show();

				var maxH=$('body').height()-$(layer).outerHeight();

				$(layer).css('margin-top',0);

				iTop=$(parent.document).scrollTop();

				if(iTop>maxH){
				
					iTop=maxH;
				}

				$(layer).css("top",iTop);

				if($oMark.size()){
					$oMark.show().css("position","fixed");
					
				}else{
					$oMark.appendTo($("body"));
					$oMark.css("position","fixed");
				}
			});
			// 窗口大小改变时，弹出层的位置也相应改变
			$(window).on("resize",function(){
				$oMark.css({
					width : Math.max($('body').width(),$(window).width()) + 'px' ,
					height: Math.max($('body').height(),$(window).height()) + 'px'
				});
				$(layer).css({
					marginTop: -$(layer).height()/2 + 'px' , 
					marginLeft: -$(layer).width()/2 + 'px'  
				});
			});
			//关闭弹框
			$Close.click(function(){
				$oMark.hide();
				$(layer).hide();	
			});
			$oMark.click(function(){
				$(this).hide();
				$(layer).hide();	
			});
		}
	})();

})

//我的房产图片轮播插件
$.fn.extend({
	imgScroll : function(){
		var $left = this.find("span.prev_arrow"),
			$right = this.find("span.next_arrow"),
			$lis = this.find("li"),
			$ul = this.find("ul"),
			size = $lis.size(),
			iNow = $lis.eq(1),
			isMove = false,
			leftJson = {
				"left": 0,
				"z-index": 100,
				"height":"217px",
				"width":"272px",
				"top":"36px"
			},
			centerJson = {
				"left": "130px",
				"height":"272px",
				"width":"340px",
				"top":"5px"
			},
			rightJson = {
				"left": 328,
				"z-index": 100,
				"height":"217px",
				"width":"272px",
				"top":"36px"
			},
			hideJson = {
				"left":244,
				"top":91,
				"height":100,
				"width":125,					
			};
		if(size === 3){
			var $newLi = $lis.eq(0).clone(true);
			var $newLi1 = $lis.eq(size-1).clone(true);
			$newLi.removeAttr("style");
			$newLi1.removeAttr("style");
			$newLi.appendTo($ul);
			$newLi1.appendTo($ul);
			$lis = $ul.find("li");
			size = $lis.size();
		}
		$left.on("click",function(){
			var $next = iNow.next().size() ? iNow.next() : $lis.eq(0),
				$next_next = $next.next().size() ? $next.next() : $lis.eq(0),
				$prev = iNow.prev().size() ? iNow.prev() : $lis.eq(size-1);
			if(!isMove){
				isMove = true;
				iNow.animate(leftJson,500,function(){
						iNow.removeClass("active");
						
						$prev.removeAttr("style");
						if(iNow !== $next){
							iNow = $next;
						};
						//console.log(iNow);
						isMove = false;
				});
				$prev.animate(hideJson,400,function(){
						$prev.removeAttr("style");
					}
				);
				$next.css("zIndex",10000).animate(centerJson,500,function(){
						$next.addClass("active").removeAttr("style");
				});
				$next_next.css(hideJson).animate(rightJson ,400);
				
			}		   
		});
		$right.on("click",function(){
			var $next = iNow.next().size() ? iNow.next() : $lis.eq(0),
				$prev = iNow.prev().size() ? iNow.prev() : $lis.eq(size-1),
				$next_next = $prev.prev().size() ? $prev.prev() : $lis.eq(size-1);
			
			if(!isMove){
				isMove = true;
				iNow.animate(rightJson,500,function(){
						iNow.removeClass("active");
						isMove = false;
				});
				$prev.css("zIndex",10000).animate(centerJson,500,function(){
						$prev.removeAttr("style").addClass("active");
						if(iNow !== $prev){
							iNow = $prev;
						};
					}
				);
				$next.animate(hideJson,500,function(){
						$next.removeAttr("style");
				});
				$next_next.css(hideJson).animate({
						"left": 0,
						"height":"217px",
						"width":"272px",
						"top":"36px"
					}
				,400);
				
			}		   
		});
		
		$lis.on("click",function(){
			var $next = $(this).next().size() ? $(this).next() : $lis.eq(0),
				$prev = $(this).prev().size() ? $(this).prev() : $lis.eq(size-1);
			if($next.index() === iNow.index()){
				$right.trigger("click");
				return false;
			}
			if($prev.index() === iNow.index()){
				$left.trigger("click");
				return false;
			}
			
		});
	}
});
