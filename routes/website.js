exports.index = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('index', { page: 'pages/home' });
};

exports.about = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('index', { page: 'pages/about' });
};

exports.gallery = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('index', { page: 'pages/gallery' });
};

exports.guide = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('index', { page: 'pages/guide' });
};

exports.community = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('index', { page: 'pages/community' });
};
