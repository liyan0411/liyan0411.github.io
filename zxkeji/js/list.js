$(function(){
	$("#header").load("header.html");
	$("#footer").load("footer.html");

	var i=0;
	$(".waterfall0>li").each(function(){			
		$(this).children("img").attr("src","images/list_img0"+listData.listData00.data.list[i].sysId+".jpg");
		$(this).find(".waterfall_title").html(listData.listData00.data.list[i].title);
		$(this).find(".waterfall_data").html((listData.listData00.data.list[i].creatAt).substr(0,10));
		$(this).find(".waterfall_article").html(listData.listData00.data.list[i].describe);
		i++;
		if(i>=6){
			return false
		}
	})
	i=0;
	$(".waterfall1>li").each(function(){
		$(this).children("img").attr("src","images/list_img0"+listData.listData01.data.list[i].sysId+".jpg");
		$(this).find(".waterfall_title").html(listData.listData01.data.list[i].title);
		$(this).find(".waterfall_data").html((listData.listData01.data.list[i].creatAt).substr(0,10));
		$(this).find(".waterfall_article").html(listData.listData01.data.list[i].describe);
		i++;
		if(i>=6){
			return false
		}
		
	})
	i=0;
	$(".waterfall2>li").each(function(){
		$(this).children("img").attr("src","images/list_img0"+listData.listData01.data.list[i].sysId+".jpg");
		$(this).find(".waterfall_title").html(listData.listData01.data.list[i].title);
		$(this).find(".waterfall_data").html((listData.listData01.data.list[i].creatAt).substr(0,10));
		$(this).find(".waterfall_article").html(listData.listData01.data.list[i].describe);
		i++;
		if(i>=3){
			return false
		}
		
	})
	
	
	
	
//	$(".list_wrap").find("li").on("mouseenter",function(){
//		$(this).stop().animate({"top":"-10px"})
//		alert(1)
//	})
	
	i=1;
	$(".list_prev").on("click",function(){
		i++;
		$(".waterfall0").css("max-height",795*i+"px");
		if(i>2){
			$(this).removeClass("list_prev");
			$(".more_pic").attr("src","images/list_gomore_bg_nomore.jpg")
		}
	})
	
})
