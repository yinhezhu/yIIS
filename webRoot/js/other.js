$(function(){
	//头部用户名弹层
	(function(){
		$(".top_select").mouseover(function(){
			var $this=$(this);
			var child=$this.children("ul");
				child.show();
		}).mouseout(function(){
			$(this).children("ul").hide();
		})
	})();
	//头部调用下拉选框     
    $('div.selectWrap').lcSelect({
        sc : 'cur',
        hc : 'act'      
    }); 
	//头部搜索切换
	$(".search_nav li").off().on("click",function(){
		var index = $(this).index();
		$(".search_nav li").removeClass("active");	
		$(this).addClass("active");	
		$(".s_dis").hide();
		$(".s_dis").eq(index).show();
		
	});
	//头部切换城市
	(function(){
		$(".change_city").off().on("click",function(){
			
			if($(this).hasClass("city_on")){
				$(this).removeClass("city_on");	
				return;
			}
			$(this).addClass("city_on");
			/*var w = $(window).width();
			var left = -($(window).width() - 980)/2 + "px";
			$(".city_box").css({"width":w+"px","left":left});*/
			
		}).on("mouseleave",function(){
			var $this = $(this);
			setTimeout(function(){
				$this.removeClass("city_on");
			},500);
		});
		$(".city_box a").off().on("click",function(){
			var $oSpan = $(".change_city p").find("span");
			$oSpan.text($(this).text());
			$(this).parents("div.change_city").removeClass("city_on");
			return false;
			
		});
	})();
	//悬浮菜单伸缩
	(function(){
		$("#menu").off().on("click",function(){
			var $this = $(this);
			if($this.attr("class")=="m_icon_1"){
				$this.attr("class","m_icon_1_on");
				$this.parent().siblings().hide();
			}else{
				$this.attr("class","m_icon_1");
				$this.parent().siblings().show();
			}
		});
		//二维码
		$(".menu_list li:last a").on("click",function(){
			var $img = $(this).next("img");
			if($img.attr("class")=="show"){
				$(this).css("backgroundColor","#c9e8f6");
				$img.removeClass("show");
			}else{
				$(this).css("backgroundColor","#8ed8fa");
				$img.addClass("show");
			}
			
		});
		
	})();
	// 弹框
	(function(){
		divShow("#delete","#delete_layer");
		divShow("#group","#group_layer");		
		divShow("#phone","#phone_layer");
		divShow("#psw","#psw_layer");
		window.divShow=divShow;
		
		function divShow(button,layer){
			var $oMark = $(".mask");
			var $Close = $(".close");
			$(button).click(function(){
				$(layer).show();
				$(layer).css({marginTop:-$(layer).height()/2,marginLeft:-$(layer).width()/2,zIndex:200});
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
				$oMark.hide();
				$(layer).hide();	
			});
		}
	})();

})

//下拉选框插件
$.fn.extend({
        
    lcSelect:function (json){

        var oP=this.find('p'),
			oUl=this.find('ul');

		oP.append('<input type="hidden" value="" name="" />');

        $(document).click(function (){
			
			oUl.hide()
			.prev().prop('onOff',false)
			.parent().css('z-index',0);
		});
		
		oP.click(function (ev){

			if(!$(this).prop('onOff')) {

				var oS=$(this).children('span');
			
				$(document).trigger('click');

				$(this).prop('onOff',true)
				.parent().css('z-index',10)
				.children('ul').show()
				.children('li').removeClass(json.hc).each(function (){
					
					if($(this).text()===oS.text()){
					
						$(this).addClass(json.sc);

					}else{
					
						$(this).removeClass(json.sc);
					}
				});

				ev.stopPropagation();
			}
		});

		oUl.delegate('li','click',function(){

			var iTxt=$(this).text();

			$(this).parent().prev().children('span').text(iTxt)
			.siblings('input').attr('value',iTxt);

		})
		
		.delegate('li','mouseover',function (){

			if( $(this).text()!==$(this).parent().prev().find('span').text() ) $(this).addClass(json.hc);
		})

		.delegate('li','mouseout',function (ev){

			if( $(this).text()!==$(this).parent().prev().find('span').text() ) $(this).removeClass(json.hc);	
		});

        return this;
    },
	
	linkSelect:function (json){

		var 
			oP=this.children('p'),
			oUl=this.children('ul'),
			idArr=json.id,
			daArr=json.da,
			idl=idArr.length,
			dal=daArr.length;

		oP.append('<input type="hidden" value="" name="" />');

		(function linkage(idx,arr,key){

			var len=arr.length;

			$(idArr[idx]).find('span').html(arr[key].dad)
			.parent().next().html('');

			for(var i=0;i<len;i++){
			
				$(idArr[idx]).children('ul').append('<li>'+arr[i].dad+'</li>');
			}

			if( !arr[key].son || idx>=idl ) return;

			linkage(++idx,arr[key].son,key);
			
			window.linkage=linkage;

		})(0,daArr,0); //数据联动初始化

		$(document).click(function (){
			
			oUl.hide()
			.prev().prop('onOff',false)
			.parent().css('z-index',0);
		});

		oP.click(function (ev){

			if(!$(this).prop('onOff')) {

				var oS=$(this).children('span');
			
				$(document).trigger('click');

				$(this).prop('onOff',true)
				.parent().css('z-index',10)
				.children('ul').show()
				.children('li').removeClass(json.hc).each(function (){
					
					if($(this).text()===oS.text()){
					
						$(this).addClass(json.sc);

					}else{
					
						$(this).removeClass(json.sc);
					}
				});

				ev.stopPropagation();
			}
		});

		oUl.delegate('li','click',function(){

			var 
				iTxt=$(this).text(),
				iEq=$(this).index(),
				thisId='#'+$(this).parent().parent().attr('id');

			$(this).parent().prev().children('span').text(iTxt)
			.siblings('input').attr('value',iTxt);

			(function (){

				var 
					idx=0,
					json={};

				for(var i=0;i<idl;i++){
					
					if(idArr[i]===thisId){
						
						idx=i;
					}
				}

				(function wmi(arr){
				
					if(arr[iEq].dad===iTxt){
						
						json=arr[iEq];
						
					}else{

						for(var i=0;i<arr.length;i++){
							
							if(!arr[i].son)continue;
							wmi(arr[i].son);
						}
					}
				})(daArr); //看数组的第iEq个是不是当前的dad

				if(!json.son) return;

				linkage(idx+1,json.son,0);

			})(); //数据联动点击触发

		}).delegate('li','mouseover',function (){

			if( $(this).text()!==$(this).parent().prev().find('span').text() ) $(this).addClass(json.hc);
		})

		.delegate('li','mouseout',function (ev){

			if( $(this).text()!==$(this).parent().prev().find('span').text() ) $(this).removeClass(json.hc);	
		});

		return this;
	}
});

//自动聚焦
function focusBlur(obj){
	var oldV=obj.value;
	obj.onfocus=function(){
				if(obj.value==oldV){
				obj.value='';
				};
		}
		obj.onblur=function(){
			if(obj.value==""){
				obj.value=oldV;
			}
		}
	
}
		
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
