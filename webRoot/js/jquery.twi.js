(function ($){
    $.fn.asTwi=function (){
        this.each(function (){
            var $this=$(this);

            $this.ali='';
            $this.arrSpic=[];
            $this.arrBpic=[];
            $this.str=$this.html();

            $this.find('.l_twi_img').each(function (){
                $this.arrSpic.push($(this).attr('src'));
                $this.arrBpic.push($(this).attr('_src'));
            });

            for(var i=0;i<$this.arrSpic.length;i++){
                $this.ali+='<li><img src="'+$this.arrSpic[i]+'" alt="小图" /></li>';
            }

            $this.on('click','.l_twi_img',function (){                
                $this.src=$(this).attr('_src');
                $this.idx=$(this).index();
                $this.wid=58*$this.arrSpic.length+1;

                $this.html(
                    '<div class="l_twi_wrap">' +
                    '<p class="l_twi_item cf">' +
                    '<i class="left l_twi_pull"></i>' +
                    '<a class="js_pull_back left" href="javascript:;">收起</a>' +
                    '<span class="l_twi_ver left">|</span>' +
                    '<i class="left l_twi_ori"></i>' +
                    '<a class="js_look_ori left" href="'+$this.src+'" target="_blank">查看原图</a>' +
                    '</p>' +
                    '<div class="l_twi_main"><img class="js_pic_cur" src="'+$this.src+'" alt="大图" /></div>' +
                    '<div class="l_twi_mask cf">' +
                    '<a class="js_twi_l left" href="javascript:;"></a>' +
                    '<a class="js_twi_c left" href="javascript:;"></a>' +
                    '<a class="js_twi_r left" href="javascript:;"></a>' +
                    '</div>' +
                    '<div class="js_twi_ulwrap">' +
                    '<div class="js_swi_wrap"><ul class="js_twi_switch cf">'+$this.ali+'</ul></div>' +
                    '<i class="js_to_left"></i><i class="js_to_right"></i>' +
                    '</div>' +
                    '<div>'
                    );

                //只有一张图时隐藏ul
                if($this.arrBpic.length===1){
                    $this.find('.js_twi_ulwrap,.js_twi_l,.js_twi_r').hide();
                    $this.find('.js_twi_c').width(440);
                }

                $this.find('.js_twi_switch').width($this.wid)
                    .find('li').eq($this.idx).addClass('active');

                setTimeout(function (){
                    $this.find('.l_twi_mask').height($this.find('.l_twi_main').height());
                },200);

                $this.find('.js_pull_back,.js_twi_c').on('click',function (){
                    $this.html($this.str);
                    return false;
                });

                //单个切换
                /*
                   IE11以下在不加背景色时出错
                   $this.find('.js_twi_r').on('click',function (){
                   $this.idx++;
                   if($this.idx>=$this.arrBpic.length)return;
                   $this.goTo($this.idx);
                   });
                   */

                $this.find('.js_twi_r').on('click',function (){
                    $this.idx++;
                    if($this.idx>=$this.arrBpic.length){
                        $this.idx=$this.arrBpic.length-1;
                        return;
                    }
                    $this.goTo($this.idx);
                });

                $this.find('.js_twi_l').on('click',function (){
                    $this.idx--;
                    if($this.idx<0){
                        $this.idx=0;
                        return;
                    }
                    $this.goTo($this.idx);
                });

                $this.goTo=function (idx){
                    //图片切换
                    $this.find('.js_look_ori').attr('href',$this.arrBpic[idx]);
                    $this.find('.js_pic_cur').fadeOut(function (){
                        $(this).attr('src',$this.arrBpic[idx]).fadeIn(function (){
                            //高度自适应
                            $this.find('.l_twi_mask').height($this.find('.l_twi_main').height());
                        });
                    });
                    $this.find('.js_twi_switch li').eq(idx).addClass('active')
                        .siblings().removeClass('active');

                    //下边联动
                    $this.lft=180-58*idx-6;
                    if($this.lft>0)$this.lft=0;
                    if($this.lft<412-$this.wid)$this.lft=406-$this.wid;
                    $this.find('.js_twi_switch').animate({
                        left:$this.lft
                    });
                };

                //多个切换
                $this.lft=$this.find('.js_twi_switch').position().left;

                $this.find('.js_to_left').on('click',function (){
                    $this.lft+=406;
                    if($this.lft>0){
                        $this.lft=0;
                    }

                    $this.find('.js_twi_switch').animate({
                        left:$this.lft
                    });
                });

                $this.find('.js_to_right').on('click',function (){
                    $this.lft-=406;
                    if($this.lft<412-$this.wid){
                        $this.lft=406-$this.wid;
                    }

                    $this.find('.js_twi_switch').animate({
                        left:$this.lft
                    });
                });

                //点击li切换
                $this.find('.js_twi_switch').on('click','li',function (){
                    $this.goTo($(this).index());
                });
            }); 
        });
    };
})(jQuery);
