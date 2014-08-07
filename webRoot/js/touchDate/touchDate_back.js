/**
 * @touchDate组件
 * 依赖css3.js
 * @author yinhezhu@chinasofti.com (尹鹤珠)
 * 支持translate3d
*/
define(function(require,exports,module){
	var css3 = require('../slide/css3'),
	isAndroid = (/android/gi).test(navigator.appVersion),
	has3d = css3.has3d(),
	hasTransform = css3.hasTransform(),
	
	gv1 = has3d ? 'translate3d(' : 'translate(',
	gv2 = has3d ? ',0)' : ')';
	$.touchDate = function(container,options){
		if(!container) return null;
		if(options) options.container = container; //container会覆盖options内的container
		else options = typeof container == 'string' ? {'container' : container} : container;
		$.extend(this,{
			wrap : null,  //弹出框选择区域
			handles : null,  //触发层，此层感应用户手势操作
			steps : 38,  //步长，单格滑动的距离
			year : 0, //当前年份
			month : 0, //当前月份
			day : 0, //当前日子
			useTransform : !isAndroid, //以translate方式动画
			isRN : false, //当前年是否为闰年
			isFeb : false, //当前月是否为二月
			cycle : [],//记录用户手指移动速度
			target : null,//记录用户操作的为年还是月还是日
			top : null//记录操作对象的上下位置
		},options);
		
		this.findEl() && this.init() && this.increaseEvent();
	}
	$.extend($.touchDate.prototype,{
		reset : function(options){
			$.extend(this,options || {});
			this.init();
		},
		showIn : function(){
			var that = this;
			this.wrap.css({'-webkit-transform':'translate3d(0,0,0)','display':'block'});
			this.wrap[0].style.webkitTransitionDuration = "300ms";
			setTimeout(function(){that.wrap.css({'-webkit-transform':'translate3d(0,-254px,0)'});},10);
			this.mask.show();
			this.init() && this.increaseEvent() && this.setResult();
		},
		findEl : function(){
			var container = this.container;
			this.wrap = $(".data_layer");
			if(!this.wrap.length){return null;}
			this.mask = $("<div style='position:fixed;z-index:20;width:100%;height:100%;background:rgba(0,0,0,0.2);top:0px;left:0px; display:none;'></div>");
			this.handleYear = this.wrap.find("div.handle_1");//年份控制手柄
			this.handleMonth = this.wrap.find("div.handle_2");//月份控制手柄
			this.handleDay = this.wrap.find("div.handle_3");//日期控制手柄
			if(!this.handleYear.length || !this.handleMonth.length || !this.handleDay){return null;}
			
			var $lists = this.wrap.find("ul.data_list").children("li").children("div.move_list");
			this.parent = this.wrap.find("ul.data_list");
			this.yearList = $lists.eq(0);//年份滚动容器
			this.monthList = $lists.eq(1);//月份滚动容器
			this.dayList = $lists.eq(2);//日期滚动容器
			this.enter = this.wrap.children("p").find("button").eq(0);//确定按钮
			this.cancel = this.wrap.children("p").find("button").eq(1);//取消按钮
			this.result = this.wrap.children("h2");//日期最终选择显示内容
			this.mask.appendTo($("body"));
			
			return this;
		},
		init : function(){
			var useTransform = this.useTransform = hasTransform ? this.useTransform : false;  //不支持直接false,android默认false
			var oDate = new Date();
			this.year = oDate.getFullYear();
			this.month = oDate.getMonth() + 1;
			this.day = oDate.getDate();
			this.yearList.html("");
			this.dayList.html("");
			for(var i = 1950;i<=this.year;i++){
				var $span = $("<span>" + i +"</span>");
				$span.css({'-webkit-transform':gv1+'0,0'+gv2});
				$span.appendTo(this.handleYear);
				$span.appendTo(this.yearList);
			}
			this.monthList.find("span").css({'-webkit-transform':gv1+'0,0'+gv2});
			this.yearLength = this.year - 1950;//年份数量
			this.yearMin = -(this.yearLength - 1)*this.steps;//年份最小能移动到的距离
			this.monthMin = -380;//月份最小能移动到的距离
			if(useTransform){
				this.parent.children("li").css({'-webkit-transform':'translate3d(0,0,0)'});
			}
			if(this.year%4 == 0 && this.month == 2){
				for(var i = 1;i <= 29;i++){
					var $span = $("<span>" + i +"</span>");
					$span.css({'-webkit-transform':gv1+'0,0'+gv2});
					$span.appendTo(this.dayList);
				}
				this.dayLength = 29;
				this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
			}else if(this.year%4 != 0 && this.month == 2){
				for(var i = 1;i <= 28;i++){
					var $span = $("<span>" + i +"</span>");
					$span.css({'-webkit-transform':gv1+'0,0'+gv2});
					$span.appendTo(this.dayList);
				}
				this.dayLength = 28;
				this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
			}else{
				switch(this.month){
					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10:
					case 12:
						for(var i = 1;i <= 31;i++){
							var $span = $("<span>" + i +"</span>");
							$span.css({'-webkit-transform':gv1+'0,0'+gv2});
							$span.appendTo(this.dayList);
						}
						this.dayLength = 31;
						this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
						break;
					case 2:
					case 4:
					case 6:
					case 9:
					case 11:
						for(var i = 1;i <= 30;i++){
							var $span = $("<span>" + i +"</span>");
							$span.css({'-webkit-transform':gv1+'0,0'+gv2});
							$span.appendTo(this.dayList);
						}
						this.dayLength = 30;
						this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
						break;
				}
			}
			
			//年月日设置初始位置
			this.yearList.css("-webkit-transform",gv1+'0,-'+ (this.yearLength - 1)*this.steps +'px' + gv2);
			this.yearTop = - (this.yearLength - 1)*this.steps;
			this.monthList.css("-webkit-transform",gv1+'0,-'+(this.month - 2)*this.steps +'px' + gv2);
			this.monthTop = - (this.month - 2)*this.steps;
			this.dayList.css("-webkit-transform",gv1+'0,-'+(this.day - 2)*this.steps +'px' + gv2);
			this.dayTop = -(this.day - 2)*this.steps;
			return this;
		},
		increaseEvent : function(){
			var that = this,
			handleYear = that.handleYear[0].parentNode,
			handleMonth = that.handleMonth[0].parentNode,
			handleDay = that.handleDay[0].parentNode;
			if(handleYear.addEventListener){
				handleYear.addEventListener('touchstart', that, false);
				handleYear.addEventListener('touchmove', that, false);
				handleYear.addEventListener('touchend', that, false);
				handleYear.addEventListener('webkitTransitionEnd', that, false);
				handleYear.addEventListener('msTransitionEnd', that, false);
				handleYear.addEventListener('oTransitionEnd', that, false);
				handleYear.addEventListener('transitionend', that, false);
			}
			if(handleMonth.addEventListener){
				handleMonth.addEventListener('touchstart', that, false);
				handleMonth.addEventListener('touchmove', that, false);
				handleMonth.addEventListener('touchend', that, false);
				handleMonth.addEventListener('webkitTransitionEnd', that, false);
				handleMonth.addEventListener('msTransitionEnd', that, false);
				handleMonth.addEventListener('oTransitionEnd', that, false);
				handleMonth.addEventListener('transitionend', that, false);
			}
			if(handleDay.addEventListener){
				handleDay.addEventListener('touchstart', that, false);
				handleDay.addEventListener('touchmove', that, false);
				handleDay.addEventListener('touchend', that, false);
				handleDay.addEventListener('webkitTransitionEnd', that, false);
				handleDay.addEventListener('msTransitionEnd', that, false);
				handleDay.addEventListener('oTransitionEnd', that, false);
				handleDay.addEventListener('transitionend', that, false);
			}
			
		},
		handleEvent : function(e){
			switch(e.type){
				case 'touchstart':
					this.start(e);break;
				case 'touchmove':
					this.move(e);break;
				case 'touchend':
				case 'touchcancel':
					this.end(e);break;
				case 'webkitTransitionEnd':
				case 'msTransitionEnd':
				case 'oTransitionEnd':
				case 'transitionend': 
					this.transitionEnd(e); break;
			}
		},
		
		
		start : function(e){  //触摸开始
			var et = e.touches[0];
			//if(this._isScroll){return;}  //滑动未停止，则返回
			this._movestart = undefined;
			this._disY = 0;
			this._coord = {
				x : et.pageX , 
				y : et.pageY
			};
			switch(e.target.className){
				case "handle_1" :
					this.target = this.yearList;
					var target = this.target,
					style = target[0].style;
					style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0 + 'ms';
					break;
				case "handle_2" :
					this.target =  this.monthList;
					break;
				case "handle_3" :
					this.target =  this.dayList;
					break;
			}
		},
		move : function(e){
			if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
			var et = e.touches[0],
			disY = this._disY = et.pageY - this._coord.y;
			this.cycle.push(et.pageY);//记录用户手指移动速度
			
			switch(this.target){
				case  this.yearList :
					this.top = this.yearTop;
					break;
				case this.monthList :
				 	this.top =  this.monthTop;
					break;
				case this.dayList :
					this.top =  this.dayTop;
					break;
			}
			this._movestart = true;
			e.preventDefault();
			var tmtop = this.top + disY;
			this.setCoord(tmtop);
			this._disY = disY;
		},
		end : function(e){
			if(this._movestart){  //如果执行了move
				
				var distance = this.cycle[this.cycle.length - 1] - this.cycle[this.cycle.length - 2];
				if(Math.abs(distance) <=1){
					var duration = 0.5;
					switch(this.target){
						case  this.yearList :
							var top = parseInt(this.yearList.css("-webkit-transform").split(",")[1]);
							var witch = Math.round(top / 38);
							this.yearTop = witch * 38;
							this.yearTop = this.yearTop < this.yearMin ? this.yearMin : this.yearTop;
							this.yearTop = this.yearTop > 38 ? 38 : this.yearTop;
							this.slideTo(this.yearTop,duration);
							break;
						case this.monthList :
							var top = parseInt(this.monthList.css("-webkit-transform").split(",")[1]);
							var witch = Math.round(top / 38);
							this.monthTop = witch * 38;
							this.monthTop = this.monthTop < this.monthMin ? this.monthMin : this.monthTop;
							this.monthTop = this.monthTop > 38 ? 38 : this.monthTop;
							this.slideTo(this.monthTop,duration);
							break;
						case this.dayList :
							var top = parseInt(this.dayList.css("-webkit-transform").split(",")[1]);
							var witch = Math.round(top / 38);
							this.dayTop = witch * 38;
							this.dayTop = this.dayTop < this.dayMin ? this.dayMin : this.dayTop;
							this.dayTop = this.dayTop > 38 ? 38 : this.dayTop;
							this.slideTo(this.dayTop,duration);
							break;
					}
					this.cycle = [];
					return;
				}
				if(distance > 1){//代表向下滑动
					var speed = Math.abs(distance);
					switch(this.target){
						case  this.yearList :
							var top = parseInt(this.yearList.css("-webkit-transform").split(",")[1]);
							var disY = 38 - top;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.yearTop = 38;
							this.slideTo(38,duration*10);
							break;
						case this.monthList :
							var top = parseInt(this.monthList.css("-webkit-transform").split(",")[1]);
							var disY = 38 - top;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.monthTop = 38;
							this.slideTo(38,duration*10);
							break;
						case this.dayList :
							var top = parseInt(this.dayList.css("-webkit-transform").split(",")[1]);
							var disY = 38 - top;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.dayTop = 38;
							this.slideTo(38,duration*10);
							break;
					}
					this.cycle = [];
				}else if(distance < -1){//代表向上滑动
					var speed = Math.abs(distance);
					switch(this.target){
						case  this.yearList :
							var top = parseInt(this.yearList.css("-webkit-transform").split(",")[1]);
							var disY = top - this.yearMin;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.yearTop = this.yearMin;
							this.slideTo(this.yearMin,duration*10);
							break;
						case this.monthList :
							var top = parseInt(this.monthList.css("-webkit-transform").split(",")[1]);
							var disY = top - this.monthMin;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.monthTop = this.monthMin;
							this.slideTo(this.monthMin,duration*10);
							break;
						case this.dayList :
							var top = parseInt(this.dayList.css("-webkit-transform").split(",")[1]);
							var disY = top - this.dayMin;//将要运动的距离
							var duration = Math.ceil(disY / speed);
							this.dayTop = this.dayMin;
							this.slideTo(this.dayMin,duration*10);
							break;
					}
					this.cycle = [];
				}
				this._movestart = false;
			}
			
		},
		setCoord : function(x){
			this.target.css("-webkit-transform",gv1 +'0,' + x +'px' + gv2);
		},
		slideTo : function(positonTop,duration){
			var target = this.target,
			style = target[0].style;
			style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';
			if(this.target == this.yearList){
				this.yearAnimation = true;
			}
			this.setCoord(positonTop)
			
		},
		transitionEnd : function(){
			var target = this.target,
			style = target[0].style;
			
			style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0 + "ms";
			this.target = null;
		},
		update : function(){
			var title = document.title;
			document.title = this.curIndex,document.title = title;
			var triggers = this.triggers,
			cls = this.activeTriggerCls,
			curIndex = this.curIndex;
			if(triggers && triggers[curIndex]){
				this.triggerSel && (this.triggerSel.className = '');
				triggers[curIndex].className = cls;
				this.triggerSel = triggers[curIndex];
			}
		},
		
		
		destroy : function(){
			var that = this,
			_panel = that.wrap[0],
			prev = that.prev,
			next = that.next,
			triggers = that.triggers;
			if(_panel.removeEventListener){
				_panel.removeEventListener('touchstart', that, false);
				_panel.removeEventListener('touchmove', that, false);
				_panel.removeEventListener('touchend', that, false);
				_panel.removeEventListener('webkitTransitionEnd', that, false);
				_panel.removeEventListener('msTransitionEnd', that, false);
				_panel.removeEventListener('oTransitionEnd', that, false);
				_panel.removeEventListener('transitionend', that, false);
			}
			if(prev && prev.length) prev.off('click');
			if(next && next.length) next.off('click');
			if(that.hasTrigger && triggers){
				triggers.each(function(n,item){
					$(item).off('click');
				});
			}
		}
	});
	$.touchDate.cache = [];
	$.fn.touchDate = function(options){
		return this.each(function(n,item){
			if(!item.getAttribute('l')){
				item.setAttribute('l',true);
				$.touchDate.cache.push(new $.touchDate(item,options));
			}
		});
	}
	$.touchDate.destroy = function(){
		var cache = $.touchDate.cache,
		len = cache.length;
		if(len < 1){return;}
		for(var i=0;i<len;i++){
			cache[i].destroy();
		}
		$.touchDate.cache = [];
	}
	return $.touchDate;
});
