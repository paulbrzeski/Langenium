$(document).ready(function () {
	$('#slideshow').append('<ul class="controls"></ul>');

	$('#slideshow .slides').each(function () {
		$('#slideshow ul.controls').append('<li></li>');
		$('#slideshow ul.controls li:last-child').append('<a href="#"></a>');
	});
	$('#slideshow .slides').each(function () {
		$('#slideshow ul.controls').append('<li></li>');
		$('#slideshow ul.controls li:last-child').append('<a href="#"></a>');
	});
	$('#slideshow .slides').cycle({
		fx: 'fade',
		delay: 100,
		pause: 1
	});


});
$(window).load(function () {
	// load Youtube Player API
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	var player;
});

function onYouTubePlayerAPIReady() {
	$('.video').each(function () {
		var id = $(this).attr('href').replace('http://www.youtube.com/watch?v=', '');
		$(this).parent().append('<div id="' + id + '"></div>');
		player = new YT.Player(id, {
			height: '315',
			width: '420',
			videoId: id,
			events: {
				"onStateChange": pauseSlideshow()
			}
		});
		$(this).remove();
	});
}
function pauseSlideshow() {
	if (this.getPlayerState > 0) {
		$('#slideshow .slides').cycle('pause');
		console.log('Slideshow paused');
	}
	
}
