exports.play = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('play', { });
};
