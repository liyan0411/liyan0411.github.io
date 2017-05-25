
;(function($,window,document,undefined){
    var pluginName="slide";
    //参数对象
    var defaults={
        cricleBtn :true,    //是否显示---底部圆点切换---按钮 （默认显示）
        toggleBtn :true,    //是否显示----左右切换-----按钮（默认显示）
        auto:true,          //是否自动播放（默认显示）
        hoverPause:false,      //鼠标悬停时是否暂停播放状态（默认false不暂停）
        speed:3000,         //自动播放速度（默认3秒）
        cricleBtn_w_h:20,   //底部小圆点宽高（默认20px）
        toggleBtn_w_h:20    //左右按钮大小（默认宽高20px）

    };
    //传递两个对象element是当前元素对象  options为参数对象
    var Plugin=function(element,options){
        this.element=element;
        this.options = $.extend({},defaults,options)
        this.name=pluginName;
        this.init();
        this.showLR();
        this.cricleList();
        this.prevCtrl();
        this.nextCtrl()
        this.autoPlay();
        this.idxBig();
        this.hoverPause();
    }
    Plugin.prototype={
        //初始化  获取固定的
        init:function(){
            this.$ele=$(this.element).addClass("carsouel")
            this.$ul=this.$ele.find("ul")
            this.$ul_li=this.$ele.find("ul>li")
            this.$len=this.$ele.find("ul>li").length;
            this.$maxStep=this.$ele.find("ul>li").size();
            this.idx();
        },
        //显示左右点击切换按钮
        showLR:function(){
            if(!this.options.toggleBtn){
                this.$ul.before( $("<p class='prev z-index'> < </p>")).after($("<p class='next z-index'> > </p>"));
            }else{
                this.$ul.before( $("<p class='prev'> < </p>")).after($("<p class='next'> > </p>"));
            }
        },
        //生成底部的圆点序列按钮
        cricleList : function(){
            if(!this.options.cricleBtn)return;
            this.$cricleArr = $("<ol></ol>");
            //此时遍历   不能用each   ----bug？
            for(var i=0;i<this.$ul_li.length;i++){
                this.$cricleArr.append("<li class='"+(!i?"current":"")+"'><a href='#'></a></li>");
            }
            this.$cricleArr.addClass("cricle-arr");
            this.$ele.append(this.$cricleArr);
            $(".cricle-arr li").css({"width":this.options.cricleBtn_w_h+"px","height":this.options.cricleBtn_w_h+"px"})
        },
//                改变显示顺序
        idx:function(){
            var self=this;
            $.each(self.$ul_li,function(i){
                self.$ul_li.eq(i++).css({"z-index":self.$len--});
                self.$ul_li.eq(0).addClass("current");
                if(i!=0){
                    self.$ul_li.eq(i).hide()
                }
            })
        },
//                下一张按钮
        nextCtrl:function(){
            this.$next=this.$ele.find(".next")
            var self=this;
            this.$next.on("click",function(){
                var $curr=self.$ul_li.filter(".current");
                var $index=$curr.index();//当前带有current类的li的下标
                if($index<self.$maxStep){
                    self.$ul_li.eq($index+1).fadeIn(500).addClass("current").siblings().fadeOut(500).removeClass("current")
                    self.$ol_li.eq($index+1).addClass("current").siblings().removeClass("current")
                    if($index+1==self.$maxStep){
                        self.$ul_li.eq(0).fadeIn(500).addClass("current").siblings().fadeOut(500).removeClass("current")
                        self.$ol_li.eq(0).addClass("current").siblings().removeClass("current")
                    }
                }
            })
        },
//                上一张按钮
        prevCtrl:function(){
            this.$prev=this.$ele.find(".prev")
            this.$ol_li=this.$ele.find("ol>li")
            var self=this;
            this.$prev.on("click",function(){
                var $curr=self.$ul_li.filter(".current");
                var $index=$curr.index();//当前带有current类的li的下标
                if($index-1>=0){
                    self.$ul_li.eq($index-1).fadeIn(500).addClass("current").siblings().fadeOut(500).removeClass("current")
                    self.$ol_li.eq($index-1).addClass("current").siblings().removeClass("current")
                }
                if($index==0){
                    self.$ul_li.eq(self.$maxStep-1).fadeIn(500).addClass("current").siblings().fadeOut(500).removeClass("current")
                    self.$ol_li.eq(self.$maxStep-1).addClass("current").siblings().removeClass("current")
                }
            })
        },
        autoPlay:function(){
            //                自动轮流播放
            if(!this.options.auto)return;
            var self=this;
            timer=setInterval(function(){
                self.$next.trigger("click")
            },self.options.speed)
        },
        //                鼠标放在图上时停止轮播
        hoverPause:function(){
            var self=this;
            if(!this.options.hoverPause)return;
            this.$ele.hover(function(){
                clearInterval(timer);
            },function(){
                timer=  setInterval(function(){
                    self.$next.trigger("click")
                },self.options.speed)
            })
        },
        //点击序列号对应大图
        idxBig:function(){
            var self=this;
            self.$ol_li.on("click",function(){
                var $clk_i=$(this).index();
                self.$ul_li.eq($clk_i).fadeIn(500).addClass("current").siblings().fadeOut(500).removeClass("current")
                self.$ol_li.eq($clk_i).addClass("current").siblings().removeClass("current")
            })
        }
    }
    $.fn[pluginName]=function (options) {
        // 遍历轮播使用的次数    防止耦合
        return this.each(function(){
            if(!$.data(this,'plugin_'+pluginName)){
                $.data(this,'plugin_'+pluginName,new Plugin(this,options))
            }
        })
    }
})(jQuery,window,document)
