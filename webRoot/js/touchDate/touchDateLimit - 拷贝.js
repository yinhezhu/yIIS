/**
 * @touchDate组件 时间选择器
 * @author yinhezhu@chinasofti.com (尹鹤珠)
*/
define(function(require,exports,module){
	$.touchDate = function(container,options){
		if(!container) return null;
		this.container = $('div' +container).eq(0);
		if(!this.container.size()) this.container = $('dd' +container).eq(0);
		$.extend(this,{
			wrap : null,  //弹出框选择区域
			handles : null,  //触发层，此层感应用户手势操作
			steps : 38,  //步长，单格滑动的距离
			year : 0, //当前年份
			month : 0, //当前月份
			day : 0, //当前日子
			isRN : false, //当前年是否为闰年
			isFeb : false, //当前月是否为二月
			isBig : false,//当前月为大月
			isSmall : false,//当前月为小月
			cycle : [],//记录用户手指移动速度
			target : null,//记录用户操作的为年还是月还是日
			top : null,//记录操作对象的上下位置
			twoYear : false,//记录是否跨年
			minYear : 1900,//最小年份
			minMonth : 1,//最小月份
			minDay : 1,//最小日期
			maxYear : 2100,//最大年份
			maxMonth : 12,//最大月份
			maxDay : 31,//最大日期
			isMinYear : false,//是否为最小年 
			isMaxYear　: false,//是否为最大年月
			isMinMonth : false,//是否为最小月
			isMaxMonth : false,//是否为最大月
			isBetween : false,//系统时间是否在最小年份和最大年份之间
			moving : false,//是否某个滚轮在运动
			callBack : null//回调函数
		},options);
		this.findEl(); 
	}
	$.extend($.touchDate.prototype,{
		reset : function(options){
			$.extend(this,options || {});
			this.init();
		},
		showIn : function(){
			var that = this;
			that.wrap.show()
			this.mask.show();
			this.init() && this.increaseEvent() && this.yearList.css("top",'38px');
			this.year = this.minYear;
			this.checkYear();
			this.initMonth();
			this.initDay1();
			this.month = this.minMonth;
			this.day = this.minDay;
			this.initHtml();
		},
		findEl : function(){//寻找对象中各个对应元素
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
		init : function(){//初始化日期内容
			var minDate = this.minYear + ",0,1,0,0,0"
			var oMinDate = new Date(this.minYear,this.minMonth - 1,this.minDay,0,0,0);
			var oMaxDate = new Date(this.maxYear,this.maxMonth - 1,this.maxDay,0,0,0);
			var oDate = new Date();
			if(oDate.getTime() >= oMinDate.getTime() && oDate.getTime() <= oMaxDate.getTime()){
				this.isBetween = true;
			}
			if(this.isBetween){
				this.year = oDate.getFullYear();
				this.month = oDate.getMonth() + 1;
				this.day = oDate.getDate();
			}else{
				this.year = this.minYear;
				this.month = this.minMonth;;
				this.day = this.minDay;
			}
			this.initYear();
			this.initMonth();
			this.initDay1();
			
			//年月日设置初始位置
			this.yearTop = (this.minYear - this.year + 1)*this.steps;
			this.monthTop = this.steps;
			this.dayTop = this.steps;
			this.yearList.css("top",this.yearTop +'px');
			this.monthList.css("top",this.monthTop + 'px');
			this.dayList.css("top",this.dayTop + 'px');
			return this;
		},
		initYear : function(){//初始化年份
			this.yearList.html("");
			for(var i = this.minYear;i<=this.maxYear;i++){
				var $span = $("<span>" + i +"</span>");
				$span.appendTo(this.yearList);
			}
			this.yearLength = this.maxYear - this.minYear + 1;//年份数量
			this.yearMin = (2 - this.yearLength)*this.steps;//年份最小能移动到的距离
			this.checkYear();
		},
		initMonth : function(){//初始化月份
			this.monthList.html("");
			if(this.isMinYear && this.isMaxYear){//当又是最大年又是最小年的时候
				for(var i = this.minMonth;i <= this.maxMonth;i++){
					var $span = $("<span>" + i +"</span>");
					$span.appendTo(this.monthList);
				}
				this.monthLength = this.maxMonth - this.minMonth + 1;//月份数量
				this.monthList.css("top",38);
				this.monthTop = 38;
				this.month = this.minMonth;
				
			}else if(this.isMinYear && !this.isMaxYear){//是最小年但不是最大年
				for(var i = this.minMonth;i <= 12;i++){
					var $span = $("<span>" + i +"</span>");
					$span.appendTo(this.monthList);
				}
				this.monthLength = 12 - this.minMonth + 1;//月份数
				this.monthList.css("top",38);
				this.monthTop = 38;
				this.month = this.minMonth;
				this.month = this.minMonth;
			}else if(!this.isMinYear && this.isMaxYear){//不是最小年是最大年
				for(var i = 1;i <= this.maxMonth;i++){
					
					var $span = $("<span>" + i +"</span>");
					$span.appendTo(this.monthList);
				}
				this.monthLength = this.maxMonth - 1 + 1;//月份数
				this.monthList.css("top",38);
				this.monthTop = 38;
				this.month = 1;
			}else if(!this.isMinYear && !this.isMaxYear){//当既不是最小年又不是最大年
				for(var i = 1;i <= 12;i++){
					var $span = $("<span>" + i +"</span>");
					$span.appendTo(this.monthList);
				}
				this.monthLength = 12;//月份数
				this.month = 1;
			}
			this.checkMonth();
			this.monthMin = (2 - this.monthLength)*this.steps;//月份最小能移动到的距离
		},
		checkYear : function(){
			this.isMaxYear = false;
			this.isMinYear = false;
			if(this.year == this.maxYear){
				this.isMaxYear = true;
			}
			if(this.year == this.minYear){
				this.isMinYear = true;
			}
		},
		checkMonth : function(){
			this.isMaxMonth = this.isMinMonth = false;
			if(this.month == this.minMonth){
				this.isMinMonth = true;
			}
			if(this.month == this.maxMonth){
				this.isMaxMonth = true;
			}
		},
		initDay1 : function(){//初始化日期
			this.dayList.html("");
			//最小年最小月最大年最大
			if(this.isMinYear && this.isMinMonth && this.isMaxYear && this.isMaxMonth){
				//alert(111);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = this.minDay;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - this.minDay + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = this.minDay;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - this.minDay + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = this.minDay;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - this.minDay + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = this.minDay;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - this.minDay + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
				
			}
			//最小年最小月最大年非最大月
			if(this.isMinYear && this.isMinMonth && this.isMaxYear && !this.isMaxMonth){
				//alert(222);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = this.minDay;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - this.minDay + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = this.minDay;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - this.minDay + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = this.minDay;i <= 31;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - this.minDay + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = this.minDay;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - this.minDay + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			//最小年最小月非最大年非最大月
			if(this.isMinYear && this.isMinMonth && !this.isMaxYear && !this.isMaxMonth){
				//alert(333);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = this.minDay;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - this.minDay + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = this.minDay;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - this.minDay + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = this.minDay;i <= 31;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - this.minDay + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = this.minDay;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - this.minDay + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			
			}
			//最小年非最小月非最大年非最大月
			if(this.isMinYear && !this.isMinMonth && !this.isMaxYear && !this.isMaxMonth){
				//alert(444);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			
			}
			//非最小年非最小月非最大年非最大月
			if(!this.isMinYear && !this.isMinMonth && !this.isMaxYear && !this.isMaxMonth){
				//alert(555);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			//非最小年非最小月最大年最大月
			if(!this.isMinYear && !this.isMinMonth && this.isMaxYear && this.isMaxMonth){
				//alert(666);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			
			}
			//非最小年非最小月非最大年最大月
			if(!this.isMinYear && !this.isMinMonth && !this.isMaxYear && this.isMaxMonth){
				//alert(777);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//非最小年最小月最大年最大月
			if(!this.isMinYear && this.isMinMonth && !this.isMaxYear && this.isMaxMonth){
				//alert(888);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//最小年非最小月最大年最大月
			if(this.isMinYear && !this.isMinMonth && this.isMaxYear && this.isMaxMonth){
				//alert(999);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//非最小年最小月非最大年非最大月
			if(!this.isMinYear && this.isMinMonth && !this.isMaxYear && !this.isMaxMonth){
				//alert(101010);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//非最小年非最小月最大年非最大月
			if(!this.isMinYear && !this.isMinMonth && this.isMaxYear && !this.isMaxMonth){
				//alert(111111);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//最小年非最小月最大年非最大月
			if(this.isMinYear && !this.isMinMonth && this.isMaxYear && !this.isMaxMonth){
				//alert(121212);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			
			//非最小年最小月最大年非最大月
			if(!this.isMinYear && this.isMinMonth && this.isMaxYear && !this.isMaxMonth){
				//alert(131313);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			this.dayMin = ( 2 - this.dayLength)*this.steps;
			
			//最小年非最小月非最大年最大月
			if(this.isMinYear && !this.isMinMonth && !this.isMaxYear && this.isMaxMonth){
				//alert(141414);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29 - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28 - 1 + 1;
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
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			this.dayMin = ( 2 - this.dayLength)*this.steps;
			
			//非最小年最小月最大年最大月
			if(!this.isMinYear && this.isMinMonth && this.isMaxYear && this.isMaxMonth){
				//alert(151515);
				if(this.year%4 == 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = 1;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - 1 + 1;
				}else{
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = 1;i <= this.maxDay;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = this.maxDay - 1 + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
			}
			//最小年最小月非最大年最小月
			if(this.isMinYear && this.isMinMonth && !this.isMaxYear && this.isMaxMonth){
				//alert(161616);
				//alert("moon");
				if(this.year%4 == 0 && this.month == 2){
					for(var i = this.minDay;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - this.minDay + 1;
				}else if(this.year%4 != 0 && this.month == 2){
					for(var i = this.minDay;i <= this.maxDay;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = this.maxDay - this.minDay + 1;
				}else{
					//alert(this.month);
					switch(this.month){
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							for(var i = this.minDay;i <= 31;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 31 - this.minDay + 1;
							break;
						case 2:
						case 4:
						case 6:
						case 9:
						case 11:
							for(var i = this.minDay;i <= 30;i++){
								var $span = $("<span>" + i +"</span>");
								$span.appendTo(this.dayList);
							}
							this.dayLength = 30 - this.minDay + 1;
							break;
					}
				}
				this.dayTop = 38;
				this.dayList.css("top",this.dayTop);
				
			}
			this.dayMin = ( 2 - this.dayLength)*this.steps;
		},
		changeDay : function(){
			if(this.isRN && this.isFeb){//闰年闰月
				if(this.dayLength != 29){
					this.dayList.html("");
					for(var i = 1;i <= 29;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 29;
					this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
					if(this.dayTop < this.dayMin){
						this.day = 29;
						this.dayTop = this.dayMin;
						this.dayList.css("top",this.dayMin);
					}
				}
				this.isRN = false;
				this.isFeb = false;
			}
			if(!this.isRN && this.isFeb){//非闰年 二月
				if(this.dayLength != 28){
					this.dayList.html("");
					for(var i = 1;i <= 28;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 28;
					this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
					if(this.dayTop < this.dayMin){
						this.day = 28;
						this.dayTop = this.dayMin;
						this.dayList.css("top",this.dayMin);
					}
				}
				this.isRN = false;
				this.isFeb = false;
			}
			if(this.isBig){//大月
				if(this.dayLength != 31){
					this.dayList.html("");
					for(var i = 1;i <= 31;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 31;
					this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
				}
				this.isBig = false;
			}
			if(this.isSmall){//小月
				if(this.dayLength != 30){
					this.dayList.html("");
					for(var i = 1;i <= 30;i++){
						var $span = $("<span>" + i +"</span>");
						$span.appendTo(this.dayList);
					}
					this.dayLength = 30;
					this.dayMin = -(this.dayLength - 2)*this.steps;//月份最小能移动到的距离
					if(this.dayTop < this.dayMin){
						this.day = 30;
						this.dayTop = this.dayMin;
						this.dayList.css("top",this.dayMin);
					}
				}
				this.isSmall = false;
			}
			return this;
		},
		increaseEvent : function(){//绑定事件
			var that = this,
			handleYear = that.handleYear[0].parentNode,
			handleMonth = that.handleMonth[0].parentNode,
			handleDay = that.handleDay[0].parentNode;
			if(handleYear.addEventListener){
				handleYear.addEventListener('touchstart', that, false);
				handleYear.addEventListener('touchmove', that, false);
				handleYear.addEventListener('touchend', that, false);
				handleYear.addEventListener('touchcancel', that, false);
			}
			if(handleMonth.addEventListener){
				handleMonth.addEventListener('touchstart', that, false);
				handleMonth.addEventListener('touchmove', that, false);
				handleMonth.addEventListener('touchend', that, false);
				handleMonth.addEventListener('touchcancel', that, false);
			}
			if(handleDay.addEventListener){
				handleDay.addEventListener('touchstart', that, false);
				handleDay.addEventListener('touchmove', that, false);
				handleDay.addEventListener('touchend', that, false);
				handleDay.addEventListener('touchcancel', that, false);
			}
			
			this.cancel.off().on('tap click',function(){that.remove();});
			this.enter.off().on("tap click",function(){that.enterIn()})
			
			return this;
		},
		handleEvent : function(e){//处理事件
			switch(e.type){
				case 'touchstart':
					this.start(e);break;
				case 'touchmove':
					this.move(e);break;
				case 'touchend':
				case 'touchcancel':
					this.end(e);break;
			}
		},
		start : function(e){  //触摸开始
			if(this.moving){
				return;
			}
			var et = e.touches[0];
			e.preventDefault();
			this._disY = 0;
			this._coord = {
				x : et.pageX , 
				y : et.pageY
			};
			this._startP = {
				y : this.yearTop,
				m : this.monthTop,
				d : this.dayTop
			}
			this.cycle = [];
			switch(e.target.className){
				case "handle_1" :
					clearInterval(this.yearTimer);
					this.target = this.yearList;
					break;
				case "handle_2" :
					clearInterval(this.monthTimer);
					this.target =  this.monthList;
					break;
				case "handle_3" :
					clearInterval(this.dayTimer);
					this.target =  this.dayList;
					break;
			}
			return this;
		},
		move : function(e){//触摸滑动
			if(this.moving){
				return;
			}
			if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
			e.preventDefault();
			var et = e.touches[0],
			disY = this._disY = et.pageY - this._coord.y;
			
			this.cycle.push(et.pageY);//记录用户手指移动速度
			switch(this.target){
				case  this.yearList :
					this.top = this._startP.y;
					var tmtop = this.top + disY;
					break;
				case this.monthList :
				 	this.top =  this._startP.m;
					var tmtop = this.top + disY;
					break;
				case this.dayList :
					this.top =  this._startP.d;
					var tmtop = this.top + disY;
					break;
			}
			if(tmtop >= 70){
				tmtop = 70; 
			}
			switch(this.target){
				case  this.yearList :
					if(tmtop <= this.yearMin - 30){
						tmtop = this.yearMin - 30;
					}
					break;
				case this.monthList :
				 	if(tmtop <= this.monthMin - 30){
						tmtop = this.monthMin - 30;
					}
					break;
				case this.dayList :
					if(tmtop <= this.dayMin - 30){
						tmtop = this.dayMin - 30;
					}
					break;
			}
			this.setCoord(tmtop);//设置年月日的位置
			return this;
		},
		end : function(e){	//触摸结束
			e.preventDefault();
			var distance = this.cycle[this.cycle.length - 1] - this.cycle[this.cycle.length - 2];
			if(Math.abs(distance) <=3 || this.cycle.length == 0){//代表缓慢选择或者单击操作
				switch(this.target){
					case  this.yearList :
						var top = parseInt(this.yearList.css("top"));
						var witch = Math.round(top / 38);
						this.yearTop = witch * 38;
						this.yearTop = this.yearTop < this.yearMin ? this.yearMin : this.yearTop;
						this.yearTop = this.yearTop > 38 ? 38 : this.yearTop;
						this.setCoord(this.yearTop);//设置年月日位置
						break;
					case this.monthList :
						var top = parseInt(this.monthList.css("top"));
						var witch = Math.round(top / 38);
						this.monthTop = witch * 38;
						this.monthTop = this.monthTop < this.monthMin ? this.monthMin : this.monthTop;
						this.monthTop = this.monthTop > 38 ? 38 : this.monthTop;
						this.setCoord(this.monthTop);//设置年月日位置
						break;
					case this.dayList :
						var top = parseInt(this.dayList.css("top"));
						var witch = Math.round(top / 38);
						this.dayTop = witch * 38;
						this.dayTop = this.dayTop < this.dayMin ? this.dayMin : this.dayTop;
						this.dayTop = this.dayTop > 38 ? 38 : this.dayTop;
						this.setCoord(this.dayTop);//设置年月日位置
						break;
				}
				
				
				this.setResult();
				if(this.target == this.yearList){ 
					this.checkYear();
					this.initMonth();
					this.initDay1();
					
				}
				if(this.target == this.monthList){
					this.checkMonth();
					this.initDay1();
				}
				this.setResult();
				this.initHtml();
				this.cycle = [];
				return this;
			}
			if(Math.abs(distance) > 3){//代表上下滑动
				switch(this.target){
					case  this.yearList :
						this.slideTo(this.yearList,distance);//开始运动
						break;
					case this.monthList :
						this.slideTo(this.monthList,distance*3);//开始运动
						break;
					case this.dayList :
						this.slideTo(this.dayList,distance*3);//开始运动
						break;
				}
				this.cycle = [];
			}
		},
		setCoord : function(x){//运动到的位置
			this.target.css("top",x +'px');
			var yearTop = parseInt(this.yearList.css("top")),
			monthTop = parseInt(this.monthList.css("top"));
			this.yearTop = yearTop;
			this.monthTop = monthTop;
			var dayTop = parseInt(this.dayList.css("top"));
			this.dayTop = dayTop;
			//this.setResult();//设置年月日，初始化天数量
			return this;
		},
		slideTo : function(obj,speed){//自动运动
			var target = obj,
			isZheng = speed > 0 ? true : false, 
			speed = Math.abs(speed) >=30 ? 30 : Math.abs(speed);
			speed = isZheng ? speed : -speed;
			speed *=20;
			switch(target){
				case  this.yearList :
					this.startMove(this.yearList,speed);
					break;
				case this.monthList :
					this.startMove(this.monthList,speed/5);
					break;
				case this.dayList :
					this.startMove(this.dayList,speed/4);
					break;
			}
			return this;
		},
		startMove : function(obj,speed){//运动动画函数
			var that = this,
			speed = speed || 40;
			switch(obj){
				case  this.yearList :
					this.yearTimer = setInterval(function(){
						that.moving = true;
						speed *=0.76;
						var top = that.yearList[0].offsetTop + speed;
						that.yearList.css("top",top);
						that.yearTop = parseInt(that.yearList.css("top"));
						if(Math.abs(speed) <=1){
							var witch = Math.round(top/38)*38;	
							that.yearList.css("top",witch);
							that.yearTop = parseInt(that.yearList.css("top"));
							that.setResult();
							that.checkYear();
							that.initMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.yearTimer);
						}
						if(top >= 38){
							that.yearList.css("top",38);
							that.yearTop = parseInt(that.yearList.css("top"));
							that.setResult();
							that.checkYear();
							that.initMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.yearTimer);
						}
						if(top <= that.yearMin){
							that.yearList.css("top",that.yearMin);
							that.yearTop = parseInt(that.yearList.css("top"));
							that.setResult();
							that.checkYear();
							that.initMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.yearTimer);
						}
					},20);
					break;
				case this.monthList :
					this.monthTimer = setInterval(function(){
						that.moving = true;
						speed *= 0.76;
						var top = that.monthList[0].offsetTop + speed;
						that.monthList.css("top",top);
						that.monthTop = parseInt(that.monthList.css("top"));
						if(Math.abs(speed) <=1){
							var witch = Math.round(top/38)*38;	
							that.monthList.css("top",witch);
							that.monthTop = parseInt(that.monthList.css("top"));
							that.setResult();
							that.checkMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.monthTimer);
						}
						if(top >= 38){
							that.monthList.css("top",38);
							that.monthTop = parseInt(that.monthList.css("top"));
							that.setResult();
							that.checkMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.monthTimer);
						}
						if(top <= that.monthMin){
							that.monthList.css("top",that.monthMin);
							that.monthTop = parseInt(that.monthList.css("top"));
							that.setResult();
							that.checkMonth();
							that.initDay1();
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.monthTimer);
						}
					},20);
					break;
				case this.dayList :
					this.dayTimer = setInterval(function(){
						that.moving = true;
						speed *= 0.76;
						var top = that.dayList[0].offsetTop + speed;
						that.dayList.css("top",top);
						that.dayTop = parseInt(that.dayList.css("top"));
						if(Math.abs(speed) <=1){
							var witch = Math.round(top/38)*38;	
							that.dayList.css("top",witch);
							that.dayTop = parseInt(that.dayList.css("top"));
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.dayTimer);
						}
						if(top >= 38){
							that.dayList.css("top",38);
							that.dayTop = parseInt(that.dayList.css("top"));
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.dayTimer);
						}
						if(top <= that.dayMin){
							that.dayList.css("top",that.dayMin);
							that.dayTop = parseInt(that.dayList.css("top"));
							that.setResult();
							that.initHtml();
							that.moving = false;
							clearInterval(that.dayTimer);
						}
						
					},20);
					break;
			}
			return this;
		},
		setResult : function(){//设置选择结果;
			this.year = typeof(this.yearTop) === "number" ? Math.round((38 - this.yearTop)/38 + this.minYear) : this.year;
			this.month = typeof(this.monthTop) === "number" ? Math.round((38 - this.monthTop)/38 + 1) : this.month;
			if(this.monthLength != 12){
				this.month = parseInt(this.monthList.children().first().text()) + Math.round((38 - this.monthTop)/38);
			}
			this.day = typeof(this.dayTop) === "number" ? Math.round((38 - this.dayTop)/38 + 1) : this.day;
			//alert(this.dayLength);
			if(parseInt(this.dayList.children().first().text())!=1){
				this.day = parseInt(this.dayList.children().first().text()) + Math.round((38 - this.dayTop)/38);
			}
			this.year = this.year < this.minYear ? this.minYear : this.year;
			this.month = this.month <= 0 ? 1 : this.month;
			this.day = this.day <= 0 ? 1 : this.day; 
			this.year = this.year > this.yearLength + this.minYear ? this.yearLength + this.minYear : this.year;
			this.month = this.month > 12 ? 12: this.month;
			if(this.year%4 == 0 && this.month == 2){//闰年 闰月
				this.isRN = true;
				this.isFeb = true;
			}else if(this.year%4 != 0 && this.month == 2){//非闰年，二月
				this.isRN = false;
				this.isFeb = true;
			}else{
				switch(this.month){
					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10:
					case 12:
						this.isBig = true;//大月
						break;
					case 2:
					case 4:
					case 6:
					case 9:
					case 11:
						this.isSmall = true;//小月
						break;
				}
			}
			return this;
		},
		initHtml : function(){ //向h2写入日期
			//alert(this.day);
			this.result.html(this.year + "-" + this.month + "-" + this.day);
		},
		remove : function(){
			this.mask.hide();
			this.wrap.hide();
			this.destroy();
		},
		enterIn : function(){ //按确定写日期
			this.mask.hide();
			this.wrap.hide();
			this.container.children("span").eq(0).html(this.year + "年");
			this.container.children("span").eq(1).html(this.month + "月" + this.day + "日");
			if(this.callBack){
				this.callBack.call(this);
			}
			this.destroy();
		},
		destroy : function(){ //摧毁对象
			var that = this,
			handleYear = that.handleYear[0].parentNode,
			handleMonth = that.handleMonth[0].parentNode,
			handleDay = that.handleDay[0].parentNode;
			if(handleYear.removeEventListener){
				handleYear.removeEventListener('touchstart', that, false);
				handleYear.removeEventListener('touchmove', that, false);
				handleYear.removeEventListener('touchend', that, false);
				handleYear.removeEventListener('touchcancel', that, false);
			}
			if(handleMonth.removeEventListener){
				handleMonth.removeEventListener('touchstart', that, false);
				handleMonth.removeEventListener('touchmove', that, false);
				handleMonth.removeEventListener('touchend', that, false);
				handleMonth.removeEventListener('touchcancel', that, false);
			}
			if(handleDay.removeEventListener){
				handleDay.removeEventListener('touchstart', that, false);
				handleDay.removeEventListener('touchmove', that, false);
				handleDay.removeEventListener('touchend', that, false);
				handleDay.removeEventListener('touchcancel', that, false);
			}
			
			this.cancel.off()
			this.enter.off()
			return this;
		}
	});
	return $.touchDate;
});
