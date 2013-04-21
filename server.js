/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	LANGENIUM SERVER 
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


var 	// Libs
		express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		fusker = require('fusker')
		io = fusker.socket.listen(server),
		// Modules
		db = require("./db.js"),
		events = require('./events.js'),
		instance = require('./instance.js'),
		//Routes
		website = require('./routes/website.js'),
		game = require('./routes/game.js'),
		connect = require('connect');
		
app.use(fusker.express.check);

fusker.config.dir = __dirname + "/public";
fusker.config.banLength = 1;
fusker.config.silent = true;

fusker.http.detectives.push('csrf', 'xss', 'sqli', 'lfi', '404');

fusker.socket.detectives.push('xss', 'sqli', 'lfi');

// Variables
var 	instances = {},
		client_sessions = [];

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Startup
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
makeUniverse();  
app.configure(function(){
	app.use(connect.compress());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(connect.favicon("public/favicon.ico"));
	app.use(app.router);
	app.use(connect.logger('dev'));
	app.use(connect.static(fusker.config.dir));	
});

// Route bindings
app.get('/', website.index);
app.get('/about', website.about);
app.get('/gallery', website.gallery);
app.get('/guide', website.guide);
app.get('/community', website.community);

app.get('/play', game.play);


server.listen(80);
process.on('SIGINT', function() {
  server.close();
  // calling .shutdown allows your process to exit normally
  toobusy.shutdown();
  process.exit();
});
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
	
	db.get("instance_objects", { instance_id: "master" }, objects);

}


