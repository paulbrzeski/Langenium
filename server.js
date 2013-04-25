/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	LANGENIUM SERVER 
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


var 	// Libs
		connect = require('connect'),
		express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		// Modules
		db = require("./db.js"),
		events = require('./events.js'),
		instance = require('./instance.js'),
		//Routes
		website = require('./routes/website.js'),
		game = require('./routes/game.js');



// Variables
var 	instances = {},
		client_sessions = [];

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Startup
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
makeUniverse();
app.configure(function () {
	app.use(connect.compress());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {pretty: true});
	app.use(connect.favicon("public/favicon.ico"));
	app.use(app.router);
	app.use(connect.logger('dev'));
	app.use(connect.static(__dirname + '/public'));
});

// Route bindings
app.get('/', website.index);
app.get('/news', website.news);
app.get('/about', website.about);
app.get('/gallery', website.gallery);
app.get('/guide', website.guide);
app.get('/community', website.community);

app.get('/play', game.play);

app.get('/wiki/*', website.redirect);

server.listen(80);

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function Definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
io.set('log level', 2); // supresses the console output
io.sockets.on('connection', function (socket) {
	// Ping and Pong
	socket.emit("ping", { time: new Date().getTime(), latency: 0 }); 
	socket.on("pong", function(data){ events.pong(socket, data); });

	// Player
	socket.on("login", function(data){ events.login(socket, data, db, instances, client_sessions); });
	socket.on("disconnect" , function ()  { events.logout(socket, db, instances, client_sessions); });
	socket.on("move",function(data){ });
});

function makeUniverse() {
/*
	Sets up the main map
*/
	// Create container and first object 
	instances.master = instance.make("container", false);
	instances.master.instances.push(
		instance.make("world", false)
	);
	
	// Check the database for any objects that belong to this instance and add them
	var objects = function(result) { 
		result.forEach(function(object){
			instances.master.addObjectToContainer(object, instances.master);
		}); 
	};
	
	db.queryClientDB("instance_objects", { instance_id: "master" }, objects);

}


