L.scenograph.director.character_test = function() {
	// scene shit here
	console.log('Character test started')

	L.scenograph.director.camera_state.zoom = 500;
	L.scenograph.director.camera.position.set(
		0, 
		0,
		L.scenograph.director.camera_state.zoom
	);	
	var character = L.scenograph.director.make_character();
	character.position.y = -25;
	this.scene.add(character);
	this.animation_queue.push(character.animation)

	// direction (normalized), origin, length, color(hex)
	var origin = new THREE.Vector3(0,-130,0);
	var arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), origin,100, 0xFFCC00);
	this.scene.add(arrow);

	var gridXZ = new THREE.GridHelper(1000, 80);
	gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridXZ.position.set( 0,-150,0 );
	this.scene.add(gridXZ);
	var gridXY = new THREE.GridHelper(1000, 80);
	gridXY.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridXY.rotation.z = Math.PI/2;
	gridXY.position.set( 1000,850,0 );
	this.scene.add(gridXY);
	var gridZY = new THREE.GridHelper(1000, 80);
	gridZY.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridZY.rotation.x = Math.PI/2;
	gridZY.position.set( 0,850,1000 );
	this.scene.add(gridZY);

	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x666600, wireframe: true, transparent: true } ); 
	var box1 = new THREE.Mesh(new THREE.BoxGeometry(150, 75, 75), wireframeMaterial);
	box1.position.set(300,-110,300);
	this.scene.add(box1);
	var box2 = new THREE.Mesh(new THREE.BoxGeometry(150, 75, 75), wireframeMaterial);
	box2.position.set(300,-110,400);
	this.scene.add(box2);
	var box3 = new THREE.Mesh(new THREE.BoxGeometry(150, 75, 75), wireframeMaterial);
	box3.position.set(300,-35,300);
	this.scene.add(box3);
};

L.scenograph.director.make_character = function() {
	var texture = new THREE.ImageUtils.loadTexture( '/assets/exordium-male.png' );
	
	var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side:THREE.DoubleSide, alphaTest: 0.5 } );
	var geometry = new THREE.PlaneGeometry(12.5, 30.4);

	var new_character = new THREE.Mesh(geometry, material);
	new_character.world_rotation = 0;
	new_character.animation = new L.scenograph.director.make_animation( new_character, texture, 34, 1, 34, 3400 ); // texture, #horiz, #vert, #total, duration.
	new_character.scale.set(10,10,10);

	return new_character;
}

L.scenograph.director.move_character = function(character) {
	character.animation.moving = false;
	var rY = 0, tZ = 0, radian = (Math.PI / 180);
	if (L.scenograph.keyboard.pressed("W")) {
		tZ += 1.25;
		character.animation.moving = true;
	}
	if (L.scenograph.keyboard.pressed("S")) {
		tZ -= 1.25;
		character.animation.moving = true;
	}
	if (L.scenograph.keyboard.pressed("A")) {
		rY += radian;
		character.animation.moving = true;
	}
	if (L.scenograph.keyboard.pressed("D")) {
		rY -= radian;
		character.animation.moving = true;		
	}
	if (rY != 0) {
		character.world_rotation += rY;
	}
	if (tZ != 0) {
		character.position.x += tZ * Math.sin(character.world_rotation);
		character.position.z += tZ * Math.cos(character.world_rotation);
	}
}


L.scenograph.director.make_animation = function( character, texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
	this.face = 'front';
	this.last_face = 'front';
	this.moving = true;
	// take in some variables to create a sprite object
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;

	this.animate = function(delta) {
		L.scenograph.director.move_character(character);
		var tile_start = 0, tile_end = 7;
		switch(this.face) {
			case 'front':
				tile_start = 0;
				tile_end = 6;
				break;
			case 'back':
				tile_start = 8;
				tile_end = 14;
				break;
			case 'left':
				tile_start = 25;
				tile_end = 32;
				break;
			case 'right':
				tile_start = 16;
				tile_end = 23;
				break;
		}
		if (this.face != this.last_face) {
			this.currentTile = tile_start;
			this.last_face = this.face;
		}

		character.lookAt(L.scenograph.director.camera.position);
		var axis = new THREE.Vector3( 0, -1, 0 );
		var angle = character.world_rotation;
		var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
		var vector = character.position.clone();
		
		var diff = new THREE.Vector3().subVectors(character.position, L.scenograph.director.camera.position).normalize();
		diff.applyMatrix4(matrix);

		if (diff.x < 0.6  && diff.x > -0.6 && diff.z <= 0.0) {
			this.face = 'front';
		}
		if (diff.x > 0.5 && diff.x < 0.8) {
			this.face = 'right';
		}
		if (diff.x < -0.5 && diff.x > -0.8) {
			this.face = 'left';
		}
		if (diff.z > 0.8) {
			this.face = 'back'
		}
		if (this.moving == true) {
			this.currentDisplayTime += delta * 25;
			while (this.currentDisplayTime > this.tileDisplayDuration)
			{
				this.currentDisplayTime -= this.tileDisplayDuration;
				
				if (this.currentTile >= tile_end) {
					this.currentTile = tile_start;
				}
				else {
					this.currentTile++;
				}
				var currentColumn = this.currentTile % this.tilesHorizontal;
				texture.offset.x = currentColumn / this.tilesHorizontal;
				var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
				texture.offset.y = currentRow / this.tilesVertical;
			}
		}
		else {
			this.currentTile = tile_start + 1;
			var currentColumn = this.currentTile % this.tilesHorizontal;
				texture.offset.x = currentColumn / this.tilesHorizontal;
				var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
				texture.offset.y = currentRow / this.tilesVertical;
		}
		
		

	}
}

L.scenograph.director.animate_character = function(delta) {

}