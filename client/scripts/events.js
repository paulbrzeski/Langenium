/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Events
	This defines the client event handlers
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

socket = io.connect(getUrl());



/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
function getUrl() {
	if (window.location.href.indexOf("langenium") > 0)
	{
		return "http://54.252.102.111:8080";
		
	}
	else {
		return "http://localhost:80";
	}
}
function setEventHandlers() {
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

function detectCollision(source, direction, world_map) {
	var raycaster = new THREE.Raycaster(source, direction.normalize());
	var intersects = raycaster.intersectObjects(world_map);
	return intersects;
}

function moveShip(ship, isPlayer, instruction) {

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