$(function(){
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			$('.cometop').fadeIn();
		} else {
			$('.cometop').fadeOut(0);
		}
		
		$('.cometop_one').click(function () {
		$(this).parent().hide();
		$('body,html').animate({
			scrollTop: 0
		}, 0);
	});
	});
})
