$(function(){
	$("#header").load('header.html');
	$("#footer").load("footer.html")
	//header
	var i=0;
	function timebanner(){
	$(".banner_font2").eq(i).show();
	$(".banner_pic").eq(i).find(".banner_font2").addClass("animated bounceInRight");
	}
	var t=setTimeout(timebanner,500)
	
	function movebanner(){
		$(".iconactive").removeClass("iconactive");
		$(".prev_box_icon").eq(i).addClass("iconactive");
		$(".banner_pic").eq(i).fadeIn();
		setTimeout(timebanner,500)
	}
	function del(){
		$(".banner_pic").eq(i).hide().find(".banner_font2").removeClass("animated bounceInRight")
		$(".banner_font2").eq(i).hide();
	}
	$(".prev_box_clk").eq(1).on("click",function(){
		del();
		i++;
		if(i>2){i=0};
		movebanner();
	});
	$(".prev_box_clk").eq(0).on("click",function(){
		del();
		i--;if(i<0){i=2};
		movebanner()
	});
$(".prev_box_clk").hover(function(){
	$(this).addClass('animated rubberBand')
},function(){
	$(this).removeClass('animated rubberBand')
})
$(".prev_box_icon").on("click",function(){
	del();
	i=$(this).index();	
	move();
	
})//banner
var j=0;
$(".lbtn").hover(function(){
	$(this).addClass('animated rubberBand')
},function(){
	$(this).removeClass('animated rubberBand')
})

$(".rbtn").hover(function(){
	$(this).addClass('animated rubberBand')
},function(){
	$(this).removeClass('animated rubberBand')
})
$(".lbtn").on("click",function(){
	j--;
	if(j<0){j=5};
	$(".worksnav").eq(j).addClass("animated slideInRight").siblings().removeClass("animated slideInRighteft")
	move()
})
$(".rbtn").on("click",function(){
	j++;
	if(j>5){j=0};
	$(".worksnav").eq(j).addClass("animated slideInLeft").siblings().removeClass("animated slideInLeft");
	move()
})
$(".listbox li").on("click",function(){
	var clkindex=$(".listactive").attr("index");
	j=$(this).index();
	if(clkindex>j){$(".worksnav").eq(j).addClass("animated slideInLeft").siblings().removeClass("animated slideInLeft");}
	else{$(".worksnav").eq(j).addClass("animated slideInRight").siblings().removeClass("animated slideInRight")}
	move()
})
function move(){
	
	$(".listbox li").eq(j).addClass("listactive").removeClass("aa").siblings().removeClass("listactive").addClass("aa");
	$(".worksnav").eq(j).show().siblings(".worksnav").hide();
}
//business
$(".businessmain_li_five").hover(function(){
	$(this).addClass("animated tada");
},function(){
	$(this).removeClass("animated tada");
})
$(".businessmain_li_three").hover(function(){
	$(this).addClass("animated tada");
},function(){
	$(this).removeClass("animated tada");
})
$(".businessmain_li_five").on("click",function(){	
	
		$(this).toggleClass("businessactive").parent().siblings("ul").find(".businessmain_li_five").addClass("businessactive")
		$(this).siblings(".businessmain_bottom").slideToggle().parent().siblings().find(".businessmain_bottom").slideUp()		
	
})
$(".businessmain_li_three").on("click",function(){			
		$(this).parent().siblings(".businessmain_bottom").slideToggle().parent().siblings().find(".businessmain_bottom").slideUp()		
	
})
//team
$(".headimgbox").hover(function(){
	$(this).find(".headimgshadow").fadeIn();
},function(){
	$(this).find(".headimgshadow").fadeOut();
})
var teambtn_active_index=0;
function teammove(){
	$(".team_movebox").stop(false,true).animate({left:"200px"},"slow",function(){
		teambtn_active_index++;
		if(teambtn_active_index>2){teambtn_active_index=0}
		$(".teambtn_m").children("li").eq(teambtn_active_index).addClass("teambtn_active").siblings().removeClass("teambtn_active");
		$(".team_movebox").stop(true,true).animate({left:"-1100px"},"slow",function(){
			$(".team_movebox").children("li").eq(0).appendTo(".team_movebox");
			$(".team_movebox").css("left",0);
		})
	})
}

function teammove_r(){
	teambtn_active_index--;		
	if(teambtn_active_index<0){teambtn_active_index=2}
	$(".teambtn_m").children("li").eq(teambtn_active_index).addClass("teambtn_active").siblings().removeClass("teambtn_active")
	$(".team_movebox").children("li").last().prependTo(".team_movebox");
	$(".team_movebox").css("left","-1100px");
	$(".team_movebox").stop().animate({left:0})
}
var teammove_t=setInterval(teammove,5000);
$(".teambtn_r").on("click",function(){
	clearInterval(teammove_t);	
	teammove();
	teammove_t=setInterval(teammove,5000);
})
$(".teambtn_l").on("click",function(){
	clearInterval(teammove_t);	
	teammove_r();
	teammove_t=setInterval(teammove,5000);
})


})//window onload