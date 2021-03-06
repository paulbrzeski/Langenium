var character_test = function() {
	// scene shit here
	L.scenograph.camera_state.zoom = 500;
	L.scenograph.camera.position.set(
		-17, 567, 900
	);	

	L.scenograph.scene_variables.collidables = [];

	var geometry = new THREE.BoxGeometry( 1000000, 1000000, 1000000 );

	var texture_prefix = '/res/textures/epoch-exordium_'
	var textures = [
		texture_prefix + 'right1.png',
		texture_prefix + 'left2.png',
		texture_prefix + 'top3.png',
		texture_prefix + 'bottom4.png',
		texture_prefix + 'front5.png',
		texture_prefix + 'back6.png'
	];

	var textureCube = THREE.ImageUtils.loadTextureCube( textures );
	textureCube.format = THREE.RGBFormat;

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;

	var material = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );

	mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'Space Box';
	L.scenograph.scene.add( mesh );

	var character = this.make_character();
	character.position.y = -30;
	L.scenograph.scene_variables.character = character;
	L.scenograph.scene.add(character);
	L.scenograph.animation_queue.push(character.children[0].animation)

	// Room 1 and lights
	var lightFixture1 = this.make_light(new THREE.Vector3(0,275, 150));
	L.scenograph.scene.add(lightFixture1);

	var lightFixture2 = this.make_light(new THREE.Vector3(0,275, -150));
	L.scenograph.scene.add(lightFixture2);

	var roomMaterial = new THREE.MeshLambertMaterial( { color: 0xCCCCCC, side: THREE.BackSide} ); 
	var room1 = new THREE.Mesh(new THREE.CylinderGeometry( 500, 500, 450, 20, 32, false), roomMaterial);
	room1.position.set(0, 75, 0)
	var room1BSP = new ThreeBSP( room1 );

	// Room 2 and lights
	var lightFixture3 = this.make_light(new THREE.Vector3(1300,275, 150));
	L.scenograph.scene.add(lightFixture3);

	var lightFixture4 = this.make_light(new THREE.Vector3(1300,275, -150));
	L.scenograph.scene.add(lightFixture4);

	var room2 = new THREE.Mesh(new THREE.BoxGeometry(1000, 450, 1000), roomMaterial);
	room2.position.set(1300, 75, 0)
	var room2BSP = new ThreeBSP( room2 );

	// Connect Room 1 to Room 2
	var corridor = new THREE.Mesh(new THREE.BoxGeometry(500, 350, 500), roomMaterial);
	corridor.position.set(600, 25, 0)
	var corridorBSP = new ThreeBSP( corridor );

	// Room 3 and lights
	var lightFixture5 = this.make_light(new THREE.Vector3(-100,275, -1450));
	L.scenograph.scene.add(lightFixture5);

	var lightFixture6 = this.make_light(new THREE.Vector3(-100,275, -1150));
	L.scenograph.scene.add(lightFixture6);
	
	var lightFixture7 = this.make_light(new THREE.Vector3(1100,275, -1450));
	L.scenograph.scene.add(lightFixture7);

	var lightFixture8 = this.make_light(new THREE.Vector3(1100,275, -1150));
	L.scenograph.scene.add(lightFixture8);
	
	var room3 = new THREE.Mesh(new THREE.BoxGeometry(2200, 450, 1000), roomMaterial);
	room3.position.set(500, 75, -1300)
	var room3BSP = new ThreeBSP( room3 );

	// Connect Room 1 to Room 3
	var corridor2 = new THREE.Mesh(new THREE.BoxGeometry(500, 350, 500), roomMaterial);
	corridor2.position.set(0, 25, -600)
	var corridor2BSP = new ThreeBSP( corridor2 );

	// Connect Room 2 to Room 3
	var corridor3 = new THREE.Mesh(new THREE.BoxGeometry(500, 350, 500), roomMaterial);
	corridor3.position.set(800, 25, -600)
	var corridor3BSP = new ThreeBSP( corridor3 );

	var newBSP = room1BSP.union( room2BSP ).union(corridorBSP).union(room3BSP).union(corridor2BSP).union(corridor3BSP);
	var newGeo = newBSP.toGeometry( roomMaterial );

	//var bufferGeo = THREE.BufferGeometryUtils.fromGeometry( newGeo );
	var newMesh = new THREE.Mesh(newGeo, roomMaterial);
	newMesh.position.y = 75;
	L.scenograph.scene.add(newMesh);
	L.scenograph.scene_variables.collidables.push(newMesh);

	var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0x666666 } ); 
	var box1 = new THREE.Mesh(new THREE.BoxGeometry(300, 150, 75), wireframeMaterial);
	box1.name = 'Box 1'
	box1.position.set(-300,-75,-300);
	L.scenograph.scene.add(box1);
	L.scenograph.scene_variables.collidables.push(box1);

	var box2 = new THREE.Mesh(new THREE.BoxGeometry(75, 150, 75), wireframeMaterial);
	box2.name = 'Box 2'
	box2.position.set(300,-75,0);
	L.scenograph.scene.add(box2);
	L.scenograph.scene_variables.collidables.push(box2);
	
	var box3 = new THREE.Mesh(new THREE.BoxGeometry(300, 150, 75), wireframeMaterial);
	box3.name = 'Box 3'
	box3.position.set(0,-75,300);
	L.scenograph.scene.add(box3);
	L.scenograph.scene_variables.collidables.push(box3);

	return this;
};

character_test.prototype._init = function() {
	L.director.character_test = new character_test();
}

character_test.prototype.make_light = function(position) {
	var light_fixture = new THREE.Mesh(
		new THREE.BoxGeometry(300, 15, 75), 
		new THREE.MeshBasicMaterial( { color: 0xFFFFFF, side: THREE.BackSide} )
	);
	light_fixture.position.set(position.x,275,position.z);

	light_fixture.add(new THREE.PointLight(0xffffff, .15, 0));
	return light_fixture;
}

character_test.prototype.marker = function(position) {
	var material = new THREE.MeshBasicMaterial( {color:0xFF0000, side:THREE.DoubleSide} );
	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 5, 1, 1 ), material );
	sphere.position.set(position.x, position.y, position.z);
	L.scenograph.scene.add(sphere);
}

character_test.prototype.make_character = function() {
	var texture = new THREE.ImageUtils.loadTexture( '/res/exordium-male.png' );
	
	
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, transparent: true, side:THREE.DoubleSide, alphaTest: 0.5 } );

	var characterSprite = new THREE.Sprite(spriteMaterial);
	characterSprite.animation = new this.make_animation( characterSprite, texture, 34, 1, 34, 3400 ); // texture, #horiz, #vert, #total, duration.
	characterSprite.scale.set(128,256);

	var origin = new THREE.Vector3(0,135,-10);
	var arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), origin,40, 0xFFCC00);
	

	var wireframeMaterial = new THREE.MeshBasicMaterial({transparent: true, visible: false }); 
	var characterBox =  new THREE.Mesh(new THREE.BoxGeometry(128, 256, 128), wireframeMaterial);
	characterBox.add(characterSprite);
	characterBox.add(arrow);

	characterBox.add(L.scenograph.camera);

	return characterBox;
}

character_test.prototype.move_character = function(character) {
	// Setup variables
	character.animation.moving = false;
	var stepSize = 5,
		pX = 0,
		pY = 0,
		pZ = 0,
		rY = 0, 
		tZ = 0, 
		radian = (Math.PI / 90);
	
	// Detect keyboard input
	if (L.scenograph.keyboard.pressed("W")) {
		tZ += stepSize;
		character.animation.moving = true;
	}
	if (L.scenograph.keyboard.pressed("S")) {
		tZ -= stepSize;
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
		character.parent.rotation.y += rY;
	}	

	pX = tZ * Math.sin(character.parent.rotation.y);
	pZ = tZ * Math.cos(character.parent.rotation.y);
	// Collision detection!
	var originPoint = character.parent.position.clone();
	var moveVector = new THREE.Vector3(
		originPoint.x + pX,
		0,
		originPoint.z + pZ
	);
			// Rotation 
	
	for (var vertexIndex = 0; vertexIndex < character.parent.geometry.vertices.length; vertexIndex++){
		var localVertex = character.parent.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( character.parent.matrix );

		var axis = new THREE.Vector3( 0, -1, 0 );
		var angle = character.parent.rotation.y;
		var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
		var directionVector = globalVertex.sub(moveVector);
		directionVector.applyMatrix4(matrix)
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var intersects = ray.intersectObjects(L.scenograph.scene_variables.collidables);
		if (intersects.length > 0) {
			var collision = intersects[0]
			if (collision.distance < 90) {
									
				if (collision.point.x - originPoint.x > 0) {
					if (collision.point.x - originPoint.x > collision.point.x - (originPoint.x + pX)) {
						character.parent.rotation.y += collision.distance / 10000;
						pX = 0;
					}
				}
				else {
					if (collision.point.x + originPoint.x < collision.point.x + (originPoint.x - pX)) {
						character.parent.rotation.y -= collision.distance / 10000;
						pX = 0;
					}
				}
				if (collision.point.z - originPoint.z > 0) {
					if (collision.point.z - originPoint.z > collision.point.z - (originPoint.z + pZ)) { 				
						//character.parent.rotation.y -= collision.distance / 10000;
						pZ = 0; 
					}
				}
				else {
					if (collision.point.z + originPoint.z < collision.point.z + (originPoint.z - pZ)) { 				
						//character.parent.rotation.y += collision.distance / 10000;
						pZ = 0; 
					}
				}
				if (rY == 0 && pX == 0 && pZ == 0) {
					character.animation.moving = false;	
				}
				//L.director.marker(collision.point)	
			}				
		}
	}
	
	//Translate character
	if (tZ != 0) {
		character.parent.position.x += pX;
		character.parent.position.z += pZ;
	}

}


character_test.prototype.make_animation = function( character, texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
	var context = this;
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
		L.director.character_test.move_character(character);
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

		var axis = new THREE.Vector3( 0, -1, 0 );
		var angle = character.parent.rotation.y;
		var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
		var vector = character.parent.position.clone();

		var camera_vector = new THREE.Vector3();
		camera_vector.setFromMatrixPosition( L.scenograph.camera.matrixWorld );
	
		var diff = new THREE.Vector3().subVectors(character.parent.position, camera_vector).normalize();
		diff.applyMatrix4(matrix);

		if (diff.z < 0.0 && 
			Math.abs(diff.x) < Math.abs(diff.z)) {
			this.face = 'front';
		}
		if (diff.x > 0 &&
			Math.abs(diff.x) > Math.abs(diff.z)) {
			this.face = 'right';
		}
		if (diff.x < 0 &&
			Math.abs(diff.x) > Math.abs(diff.z)) {
			this.face = 'left';
		}
		if (diff.z > 0.0 && 
			Math.abs(diff.x) < Math.abs(diff.z)) {
			this.face = 'back'
		}
		
		character.scale.y = 256 - Math.abs(diff.y) * 45;			


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

character_test.prototype.animate_character = function(delta) {

}