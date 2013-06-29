var url = window.location.href;
if (url.indexOf("langenium") > 0)
{
	url = "http://54.252.102.111";
	//url = "langenium.ap01.aws.af.cm";
}
else {
	url = "http://localhost:80";
}
socket = io.connect(url);

var 	playerLatency = new TimeSeries(),
		chart = new SmoothieChart();

chart.addTimeSeries(playerLatency, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 1 });
chart.streamTo(document.getElementById("latencyBox"), 500);

var setEventHandlers = function() {
	socket.emit("login", { username: username });
	socket.on("update", function(data) {
		data.forEach(function(updateData, index) {
			updateClient(updateData);
		});
	});
	socket.on("load", loadInstructions);
	socket.on("playerDisconnected", removeShip);
	socket.on("ping", function(data){
		if (player) {
			player.latency = data.latency;
		}
		playerLatency.append(new Date().getTime(), data.latency);
		$("#latencyLabel").html("<h3>&nbsp;" + data.latency + "ms</h3>");
		socket.emit("pong", data);
	});
	return socket;  
};


function updateClient(data) {
	if (data.instruction.name == "load") {
		loadObject(data.instruction);
	}
	if (data.instruction.name == "kill") {
		if (data.instruction.type == "bot") {
			$("#botList").html("");
			bots.forEach(function(bot, index){
				if (bot.id == data.instruction.id) {
					teleportEffect(bot.position);
					scene.remove(bots[index]);
					bots.splice(index, 1);
				}
				else {
					$("#botList").append("<li>" + bot.id + "</li>");
				}
			});
			$("#bots h2").html("Enemies detected (" + bots.length + ")");
		}
		if (data.instruction.type == "ship") {
			ships.forEach(function(ship, index){
				if (ship.username == data.instruction.username) {
					teleportEffect(ship.position);
				}
			});
		}
	}
	
	if (data.instruction.name == "hit") {
		if (data.instruction.type == "ship") {
			ships.forEach(function(ship, index){
				if (ship.username == data.instruction.username) {
					bulletEffect(ship.position);
				}
			});
		}
		if (data.instruction.type == "bot") {
			bots.forEach(function(bot, index){
				if (bot.id == data.instruction.id) {
					bulletEffect(bot.position);
				}
			});
		}
	}
	if (data.instruction.name == "move") {
		if (data.instruction.details.username == socket.socket.sessionid) {
			if (player) {
				var health = data.instruction.details.health / 500;
				$("#stats .ship.info li span.ship-health").css("width", health * 95);
					
				player.velocity = Math.round(data.instruction.details.velocity * 66);
				if (data.instruction.details.fire == 1) {
						addBullet(player); 
				}
				player.position.x = data.instruction.details.pX;
				player.position.y = data.instruction.details.pY;
				player.position.z = data.instruction.details.pZ;
				player.rotation.y = data.instruction.details.rY;
				
				if (data.instruction.details.velocity < 0) { data.instruction.details.velocity *= -1; }
				$("#heading").rotate({animateTo: (-player.rotation.y * 180 / Math.PI)});
				
				$("#speed").html(Math.round(data.instruction.details.velocity * 66) + "<span>KM/H</span>");
				$("#altitude").html(Math.round(player.position.y)+ "m");
			}
		}
		else {
			ships.forEach(function(ship,index){
				if (data.instruction.details.username == ship.username) {
					if (data.instruction.details.fire == 1) {
						addBullet(ships[index]); 
					}
					moveShip(ships[index], false, data.instruction);
				}
			});
			bots.forEach(function(bot,index){
				if (data.instruction.details.id == bot.id) {
					bots[index].health = data.instruction.details.health;
					if (data.instruction.details.fire == 1) {
						addBullet(bots[index]); 
					}
					moveShip(bots[index], false, data.instruction);
				}
			});
		}
	}
}
function detectCollision(source, direction, world_map) {
	var raycaster = new THREE.Raycaster(source, direction.normalize());
	var intersects = raycaster.intersectObjects(world_map);
	return intersects;
}
function removeShip(data) {
	$("#playerList").html("");
	ships.forEach(function(ship, index){
		if (ship.username == data.username) {
			scene.remove(ships[index]);
			ships.splice(index, 1);
		}
		else {
			$("#playerList").append("<li>" + ship.username + "</li>");
		}
	});
	$("#players h2").html("Players online (" + ships.length + ")");
}