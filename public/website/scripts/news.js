$(document).ready(function () {
	$.getJSON('/news', function (data) {
		data.entries.forEach(function (entry) {
			$('#news ul').append("<li></li>");
			$('#news li:last-child').append("<h3></h3>");
			$('#news li:last-child h3').html(entry.published)
			$('#news li:last-child').append(entry.content);
		});
	});
});