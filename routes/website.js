exports.index = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('website/index', { page: 'pages/home' });
};

exports.about = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('website/index', { page: 'pages/about', variable: "Some text" });
};

exports.gallery = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('website/index', { page: 'pages/gallery' });
};

exports.guide = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('website/index', { page: 'pages/guide' });
};

exports.community = function(req, res) {
	res.setHeader("Expires", "-1");
	res.setHeader("Cache-Control", "must-revalidate, private");
	res.render('website/index', { page: 'pages/community' });
};
exports.redirect = function(req, res) {
	res.writeHead(302, { 'Location': 'http://127.0.0.1/'  });
	res.end();
};