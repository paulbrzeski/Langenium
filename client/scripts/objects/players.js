  /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Players
	This class defines player objects
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// This object
var players = function() {
    return this;
}

players.prototype.playerInput = function (delta){
	var keyboardInput = { d: delta, pZ: 0, pY: 0, rY: 0, fire: isFiring },
			move = false;
	
	if (keyboard.pressed("W")){
		if (player.velocity > -150) { player.velocity -= 25; }
		move = true;
		keyboardInput.pZ = 1;
	}
	if (keyboard.pressed("S")){
		if (player.velocity < 75) { player.velocity += 25; }
		move = true;
		keyboardInput.pZ = -1;
	}
	// rotate left/right
	if (keyboard.pressed("A")) {
		move = true;
		keyboardInput.rY = 1;
	}
	if (keyboard.pressed("D")) {
		move = true;
		keyboardInput.rY = -1;
	}
	if (keyboard.pressed(" ")) {
		if (player.position.y < 100000){														// <--------- these rules will need to go to the server
			move = true;																				// <--------- these rules will need to go to the server
			keyboardInput.pY = 1;																// <--------- these rules will need to go to the server
		}
	}
	if (keyboard.pressed("shift")){
		if (player.position.y > -100000){ 														// <--------- these rules will need to go to the server
			move = true;																				// <--------- these rules will need to go to the server
			keyboardInput.pY = -1;																// <--------- these rules will need to go to the server
		}
	}
	if (isFiring == true) {
		move = true;
	}
	
	if (move == true) {
		e.socket.emit('move', keyboardInput);
	}
	return keyboardInput;
}

players.prototype.movePlayer = function (velocity, playerPosition, data) {
	
	var 		velocityYChange = 120, //60,
				rotateAngle = 0.01744444444444444444444444444444 * 100 * data.d;

	if (data.rY > 0) { data.rY = rotateAngle; }						// left
	if (data.rY < 0) { data.rY = -rotateAngle; }						// right
	data.rY = (data.rY + data.rY * Math.PI / 180);
	
	if (data.pY > 0) { data.pY = velocityYChange; } 			// up
	if (data.pY < 0) { data.pY = -(velocityYChange); } 		// down

	data.rY += player.rotation.y;
	data.pY += player.position.y;
	
	var 	diffX = velocity * Math.sin(player.rotation.y),
			diffZ = velocity * Math.cos(player.rotation.y);

	data.pX = playerPosition.x + diffX;
	data.pZ = playerPosition.z + diffZ;
	
	// moves the water tiles position 
	
	for (var tile = 0; tile < water.length; tile++) {
		
			water[tile].position.x += diffX;
			water[tile].position.z += diffZ;
			
			var rotateWater =  data.rY  * -1;

			water[tile].material.map.offset.x-= Math.sin(rotateWater) * velocity / 100000;
			water[tile].material.map.offset.y -= Math.cos(rotateWater) *velocity / 100000;
		
	}	
	
	var height_diff = 5000 + 2000 * (water.length-1);
	
	sky.position.x = data.pX;
	
	var ySkyDiff =  (
		(new THREE.Vector3().getPositionFromMatrix(player.matrixWorld).y) + 1000 * makeEnvScale()  + (water.length - 1)
	);
	//console.log(ySkyDiff);
	sky.position.y =  16000 * (1 + (player.position.y / 20000));
	sky.position.z = data.pZ;
	
	var 	sky_scale = 1 + (player.position.y / 20000);
	
	effects.water.update();
	
	// set sky scale
	if (player.position.y > 0) { sky.scale.set(sky_scale,sky_scale,sky_scale); }
	
	sky.updateMatrixWorld();
	
	var moveVector = new THREE.Vector3(data.pX, data.pY, data.pZ);
	var playerPositionVector = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
	
	var collisions = e.detectCollision(playerPositionVector, moveVector, o.world_map);
	
	if (collisions.length > 0) {
		collisions.forEach(function(collision, index){
			if (collision.distance < 90) {
		
				if (collision.point.x > playerPosition.x) 
					{ data.rY -= collision.distance / 10000; }
				if (collision.point.x < playerPosition.x) 
					{ data.rY += collision.distance / 10000; }
				
				if (data.pX != 0) {
					data.pX  = player.position.x + data.pX * -.001;
				}
				if (data.pY != 0) {
					data.pY = player.position.y;
				}
				if (data.pZ != 0) {
					data.pZ  = player.position.z + data.pZ * -.001;
				}
			}
		}); 
	}
	
		
	e.moveShip(player, true, { name: "move", type: "player", details: data });
	var 		html = 		"<div><strong>";
				html +=	"<strong>Player</strong><br />pX:&nbsp;"+Math.round(player.position.x)+"<br />pY:&nbsp;"+Math.round(player.position.y)+"<br />pZ:&nbsp;"+Math.round(player.position.z);
				html += 	"<br />rY:&nbsp;"+Math.round(player.rotation.y)+"<br />d:&nbsp;" + Math.round(data.d * 1000) + "</div>";
	$("#playerPosition").html(html);
}
