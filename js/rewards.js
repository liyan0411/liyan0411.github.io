(function(){
	var show = false;
	var myRewards = document.getElementById("btn-myRewards");
	var alipay = document.getElementById("alipay");
	var weixin = document.getElementById("weixin");
	var alishow=document.getElementById("alishow");
	var weixinshow=document.getElementById("weixinshow")
	myRewards.onclick=  function(){
		// alert("展示");
		if(show){
			document.getElementById("myRewards").style.width="0px";
			show = false;
		}else{
			document.getElementById("myRewards").style.width="240px";
			show = true;
		}	
	};
	alipay.onclick = function(){
		// alert("alipay");
		this.style.background = '#fff';
		alishow.style.display = "inline-block";
		weixinshow.style.display = "none";
		weixin.style.background="#eee";
	};
	weixin.onclick = function(){
		// alert("weixin");
		this.style.background = '#fff';
		alishow.style.display = "none";
		weixinshow.style.display = "inline-block";
		alipay.style.background="#eee";
	}
}())