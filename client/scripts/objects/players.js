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
		move = true;
		keyboardInput.pY = 1;
	}
	if (keyboard.pressed("shift")){
		move = true;
		keyboardInput.pY = -1;
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
	
	var 		velocityYChange = 60,
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
		if (tile == 0) {
			water[tile].position.x = data.pX;
			water[tile].position.z = data.pZ;
			
			var rotateWater =  data.rY  * -1;

			water[tile].material.map.offset.x-= Math.sin(rotateWater) * velocity / 100000;
			water[tile].material.map.offset.y -= Math.cos(rotateWater) *velocity / 100000;
		}
	}	
	
	sky.position.x = data.pX;
	sky.position.z = data.pZ;
	
	var 	env_scale = (player.position.y) / 10000, 
			sky_scale = 1 + env_scale;
	
	if (env_scale -1 > water.length) {
		env_scale = Math.round(env_scale-1);
		for (var i = 1; i <= env_scale;  i++) {
			water.push(new effects.water.makeWater(M));
			var tile = water[water.length-1];
			scene.add(water[water.length-1]);
			water[i].position.x -= water[0].position.x + M * i;
			water[i].position.z -= water[0].position.y  + M * i;
			console.log(water[0].position);
			console.log(water[1].position);
		}
	}
	
	// set sky scale
	sky.scale.set(sky_scale,sky_scale,sky_scale);
	
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
		
	$("#playerPosition").html("<div><strong>Player</strong><br />pX:&nbsp;"+Math.round(player.position.x)+"<br />pY:&nbsp;"+Math.round(player.position.y)+"<br />pZ:&nbsp;"+Math.round(player.position.z)+"<br />rY:&nbsp;"+Math.round(player.rotation.y)+"<br />d:&nbsp;" + Math.round(data.d * 1000) + "</div>");
}
