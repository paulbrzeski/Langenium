/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Startup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var app = require('http').createServer(function (request, response) { if (url.parse(request.url).pathname.indexOf("socket.io") <= 0)  { response.writeHead(301, { 'Location': 'http://langenium.com/play' }); } response.end(); })
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url')
  , db = require("./db.js")
  , events = require("./events.js")
  , THREE = require('three');
  
app.listen(80);

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Socket event handlers
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
io.set('log level', 2);

var 	world_map = [],
			bots = [];

buildWorldMap();
function buildWorldMap(){
	var map_builder = db.getDummyMap();
	map_builder.forEach(function(sceneObj, index){
		var 	type = sceneObj.type,
				object = db.getObject(type),
				scale = sceneObj.scale || object.scale,
				urlPrefix = "http://langenium.com/play/",
				loader =  new THREE.JSONLoader(),
				url = object.url;
				
		loader.load(urlPrefix + url, function(geometry, materials){
			var objMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ) );
			objMesh.geometry.computeBoundingBox();
			
			objMesh.scale = new THREE.Vector3(scale,scale,scale);
			objMesh.position.x = sceneObj.position.x,
			objMesh.position.y = sceneObj.position.y,
			objMesh.position.z = sceneObj.position.z,
			objMesh.matrixAutoUpdate = true;
			objMesh.updateMatrix();
			objMesh.updateMatrixWorld();
			world_map.push(objMesh);
		});	
	});
	
	var bot_builder = db.getDummyEnemies();
	bot_builder.forEach(function(obj, index){
		var 	type = obj.type,
				object = db.getObject(type),
				scale = obj.scale || object.scale,
				//urlPrefix = "http://localhost:8080/",
				urlPrefix = "http://langenium.com/play/",
				loader =  new THREE.JSONLoader(),
				url = object.url;
				
		loader.load(urlPrefix + url, function(geometry, materials){
			var bot = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ) );
			bot.geometry.computeBoundingBox();
			bot.scale = new THREE.Vector3(scale,scale,scale);
			bot.position.x = obj.position.x,
			bot.position.y = obj.position.y,
			bot.position.z = obj.position.z,
			bot.matrixAutoUpdate = true;
			bot.updateMatrix();
			bot.updateMatrixWorld();
			bot.username = obj.id;
			bot.movement_queue = [];
			bots.push(bot);
		});	
	});
}

var 	time = new Date(),
		update_queue = [],	
		counter = 0,
		INTERVAL = 100;

function updateWorld() {
	counter += 15;
	bots.forEach(function(bot, index){
		if (players_online.length > 0) {
			var player = players_online[0];
			var destination = new THREE.Vector3(player.position.x, player.position.y, player.position.z);	
			var 	deltaX = (destination.x - bots[index].position.x),
					deltaY = (destination.y - bots[index].position.y),
					deltaZ = (destination.z - bots[index].position.z);

			var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY) + (deltaZ * deltaZ));
			
			if (bot.movement_queue.length > 0) {
					var movement = bot.movement_queue.shift();
					
					var angle = Math.atan2(-deltaX, deltaZ);
					if (angle < 0) { angle += 2; }
					angle *= 180 / Math.PI;
	
					
					if ((counter >= INTERVAL) && (distance < 2000) && ((angle < 15) && (angle > -15))) {
						counter -= INTERVAL;
						movement.instruction.details.fire = 1;
					}
					bots[index].position.x += movement.instruction.details.pX;
					bots[index].position.y += movement.instruction.details.pY;
					bots[index].position.z += movement.instruction.details.pZ;
					bots[index].rotation.y += movement.instruction.details.rY;
					update_queue.push(movement);
				
			}
			else {
			
				bots[index].movement_queue = events.moveBot(bots[index], destination, distance, world_map);
			}
		}
		else {
			bots[index].movement_queue = [];
		}
	});
	time = new Date();
	players_online.forEach(function(player){
		var 	playerMovement, 
				inputData;
		if (player.inputUpdates.length > 0) {
			inputData = player.inputUpdates.shift();
		}
		else {
			inputData = { d: 0, pZ: 0, pY: 0, rY: 0};
		}
		playerMovement = events.movePlayer(player.velocity, player.position, world_map, inputData);	
		player.position.y += playerMovement.instruction.details.pY;
		player.position.x += playerMovement.instruction.details.pX; 
		player.position.z += playerMovement.instruction.details.pZ;
		player.position.rotationY +=  playerMovement.instruction.details.rY;
		playerMovement.instruction.details.username = player.sessionId;
		update_queue.push(playerMovement);
		if (player.velocity > 0) {
			player.velocity -= .05;
		}
		if (player.velocity < 0) {
			player.velocity += .05;
		}
	});
	var update_buffer = [];
	update_queue.forEach(function(update, index){
		update_buffer.push(update);
		update_queue.splice(index, 1);
	});
	io.sockets.emit("update", update_buffer);
}

var tick = setInterval(updateWorld, 1000 / 66);

io.sockets.on('connection', function (socket) {
	socket.emit("ping", { time: new Date().getTime(), latency: 0});
	socket.on("pong", function(data){
		var time = new Date().getTime(); 
		var latency = time - data.time;
		socket.emit("ping", { time: new Date().getTime(), latency: latency});
	});
	
	socket.on("login", function(data){
		var player = loginPlayer(socket.id, data.username);
		if (player.username.length > 0) {
			socket.emit('load', { instructions: initializeClient(player) });
			
			var ship = cloneObject(player);
			ship.type = {ship: "ship"}
			
			socket.broadcast.emit('load', { instructions: [ {name: "load", username: ship.username, type: ship.type, url: ship.url, position: ship.position, scale: ship.position.scale, rotationY: ship.position.rotationY} ] });
		}
		else {
			console.log("Login failure");
		}
	});
	socket.on("disconnect" , function ()  {
		players_online.forEach(function(player, index){
			if (player.sessionId == socket.id) {
				socket.broadcast.emit('playerDisconnected', { username: player.username }); // change to sessionID later
				players_online.splice(index, 1);
			}		
		});
		delete socket;
	});
	
	socket.on('move', function(data){
		players_online.forEach(function(player, index){
			if (player.sessionId == socket.id) {
				
				if ((data.pZ > 0)&&(player.velocity > -6)){ 
					player.velocity -= 15 * data.d; 
				} 			
				if  ((data.pZ < 0)&&(player.velocity < 3)) { 
					player.velocity  += 7.5 * data.d; 
				}			
				player.inputUpdates.push(data);
			}
		});
	});
}); 

// ENGINE VARIABLES
var players_online = [];
var players = [ 
		{ username: "Mercenary", id: "1", type: { ship: "player" }, url: "assets/mercenary.js", position: { x: -8500, y: 5000, z: -1740 , scale: 10, rotationY: 0 }},
		//{ username: "Pirate", uid: "2", type: "player", url: "assets/pirate.js", position: { x: -1000, y: 3000, z: 5500 , scale: 10, rotationY: 0 }}
		{ username: "Pirate", id: "2", type: { ship: "player" }, url: "assets/pirate.js", position: { x: 0, y: 0, z: 0 , scale: 10, rotationY: 0 }}
	];
	
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// w//////////////////////
	Client Events
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function loginPlayer(sessionId, username) {
	var retval;
	players.forEach(function(player){
		if (player.username == username) {
			var online_player = cloneObject(player);
			online_player.inputUpdates = []; 
			online_player.username = sessionId; 
			online_player.sessionId = sessionId;
			online_player.velocity = 0;
			online_player.velocityChange = 0;
			players_online.push(online_player);
			players_online[players_online.length-1].sessionId = sessionId;
			retval = online_player;
		}
	});
	return retval;
}

function initializeClient(activePlayer) {
	var initial_instructions = [];
	
	db.getLoadInstructions("map").forEach(function(instruction){ instruction.name = "load"; initial_instructions.push(instruction);});
	db.getLoadInstructions("bots").forEach(function(instruction){ 
		instruction.name = "load"; 
		if (bots.length > 0) {
			bots.forEach(function(bot, index) {
				if (bot.username == instruction.id) {
					instruction.position.x = bots[index].position.x;
					instruction.position.y = bots[index].position.y;
					instruction.position.z = bots[index].position.z;
					instruction.position.rotationY = bots[index].rotation.y;
				}
			});
		}
		initial_instructions.push(instruction);
	});
	
	//getLoadInstructions("ships").forEach(function(instruction){initial_instructions.push(instruction);});

	players_online.forEach(function(player, index){
		if (player.username != activePlayer.username) {		
			// had to do this to de-reference player so that changing .type didn't override 
			var ship = cloneObject(player);
			ship.type = { ship: "ship" };
			initial_instructions.push({name: "load", username: ship.username, type: ship.type, url: ship.url, position: ship.position, scale: ship.position.scale, rotationY: ship.position.rotationY});
		}
		else {
			initial_instructions.push({name: "load", username: player.username, type: player.type, url: player.url, position: player.position, scale: player.position.scale, rotationY: player.position.rotationY});
		}
	});
	return initial_instructions;
}

function cloneObject(obj) {
        var clone = {};
        for(var i in obj) {
            if(typeof(obj[i])=="object")
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Utility functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

function spawn(uid, position) {
	position.scale = 10;
	return { name: "load", details: { uid: uid, type: "monster", url: "assets/pirate.js", position: position}};
}


