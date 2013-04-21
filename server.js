/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	LANGENIUM SERVER 
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// Modules
var 	http = require('http'),
		app = http.createServer(function (request, response) { 
			www.route(request, response);
		}),
		fileServer = http.createServer(function (request, response) { 
			www.getFile(request, response);
			
		}),
		db = require("./db.js"),
		io = require('socket.io').listen(app),
		fs = require('fs'),
		events = require('./events.js'),
		instance = require('./instance.js'),
		www = require('./www.js');
	
// Variables
var 	instances = {},
		client_sessions = [];

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Startup
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
makeUniverse();  
app.listen(80);
fileServer.listen(8080);
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


