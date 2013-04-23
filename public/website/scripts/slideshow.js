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
		fx:    'fade', 
		delay: 100,
		pause: 1
	});

});

