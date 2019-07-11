$(function(){
	$("#header").load("header.html");
	$("#footer").load("footer.html")
	
	var hrefurl=location.href;
	var urlkey=hrefurl.substring(hrefurl.indexOf("type")+5);	

	
	$(".article>h1").html(articleData[urlkey].data.typeTitle);
	$(".article>h2").html(articleData[urlkey].data.typeEntitle);
	$(".article>h3").html(articleData[urlkey].data.title);
	$(".article>h4").html(articleData[urlkey].data.updateAt+" 管理员");
	$(".article>.changepic").attr("src",articleData[urlkey].data.coverImg);
	
	$(".loveone").on("click",function(){
		
		$(this).animate({"background-position-y":"73px"})
	})
})
