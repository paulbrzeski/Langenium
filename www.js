/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	WWW
	This class contains functions that serve the website and game client files
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Exports Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

module.exports.route = route;
module.exports.getFile = getFile;


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Global Variables
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var		path = require("path"),
		fs = require("fs"),
		url = require('url'),
		jade = require("jade"),
		mime = require("mime"),
		static = require("node-static"),
		file = new(static.Server)('./www', {
			cache: 600,
			headers: {}
		});
		
/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function Definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

function route(request, response) {
	response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
	if ((request.url == "")||(request.url == "/")) {
		response.end(getTemplate( "index.jade", { page: 'pages/home' } ));
	}
	if (	(request.url =="/about/")||
			(request.url == "/gallery/")||
			(request.url == "/guide/")||
			(request.url == "/community/")) {
			var page_text = pretendDatabaseResult();
			response.end(getTemplate( "index.jade", { page: 'pages' + request.url , variable: page_text } ));
	}
	else {
		if ((request.url == "/play/")||(request.url == "/play")) { 
			response.end(getTemplate("play.jade",{}));
		}
	}

}
function pretendDatabaseResult() {
	return "Some text";
}

function getTemplate(layout, locals) {
	var 	path = __dirname + "/www/templates/" + layout,
			template = fs.readFileSync(path, "utf8"),
			options = { filename: path, pretty: true },
			fn = jade.compile(template, options);
			return fn(locals);
}

function getFile(request, response) {
	var 	uri = url.parse(request.url).pathname,
			filename = path.resolve(path.join(process.cwd(), "/www/",uri)),
			type = mime.lookup(filename),
			body = '';
    
    // Append the chunk to body
    request.addListener('data', function (chunk) { 
      body += chunk; 
    });
	request.addListener('end', function () {
	
		file.serve(request, response, function(err, result) {
			if (err) {
				console.error('Error serving %s - %s', request.url, err.message);
				if (err.status === 404 || err.status === 500) {
					file.serveFile(util.format('/%d.html', err.status), err.status, {}, request, response);
				}
				else {
					response.writeHead(err.status, err.headers);
					response.end();
				}
			}
			else {
				response.writeHead(200, {
					"Content-Type": type + "; charset=utf-8"
				});
				response.end(body, 'utf-8');
			}
		});
	});
}
