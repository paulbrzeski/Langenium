/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Events
	This defines the client event handlers
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var events = function() {
    this.socket = this.setEventHandlers(
            io.connect(this.getUrl())
        );
    return this.socket;
}

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
events.prototype.getUrl = function () {
	if (window.location.href.indexOf("langenium") > 0)
	{
		return "http://54.252.102.111:8080";
		
	}
	else {
		return "http://localhost:80";
	}
}
events.prototype.setEventHandlers = function (socket) {
    socket.emit("login", { username: "Saggy Nuts" });
	socket.on("load", function(data) { 
		for (var objArray in data) {
			data[objArray].forEach(function(instruction, index) {
				loadObject(instruction);
			});
		}
	});
	return socket;
}

events.prototype.detectCollision = function (source, direction, world_map) {
	var raycaster = new THREE.Raycaster(source, direction.normalize());
	var intersects = raycaster.intersectObjects(world_map);
	return intersects;
}

events.prototype.moveShip = function (ship, isPlayer, instruction) {

	var playerMesh = player;
	
	if (instruction.details.pY != 0){
		ship.position.y = instruction.details.pY;
	}
	
	if (instruction.details.pX != 0){
		ship.position.x = instruction.details.pX;
	}
	
	if (instruction.details.pZ != 0) {
		ship.position.z = instruction.details.pZ;
	}
	
	var rotate = instruction.details.rY - ship.rotation.y;
	
	if (rotate > 0){
		if (ship.rotation.z < .5) {
			ship.rotation.z += rotate / 3;
		}
		else {
			ship.rotation.z += rotate / 4;
		}
		ship.rotation.y = instruction.details.rY;
	}
	if (rotate < 0) {
		if (ship.rotation.z > -.5) {
			ship.rotation.z += rotate / 3;
		}
		else {
			ship.rotation.z += rotate / 4;
		}
		ship.rotation.y = instruction.details.rY;
	}

}