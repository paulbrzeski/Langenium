  /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Water
	This class defines the water
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var water = function() {
   
   return this;
};

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// Main

water.prototype.makeWater = function(M, pos) {
	
	var 	water_res = 100,
			water_texture = 12;
	if (water.length > 0) { water_res = 1; }
	
	var geometry = new THREE.PlaneGeometry( M, M , water_res, water_res );	
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	
	var waterTexture = THREE.ImageUtils.loadTexture( "assets/water.jpg" );
	waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
	waterTexture.repeat.set( water_texture, water_texture );
	
	var material = new THREE.MeshLambertMaterial( {
		color: 0x006699,
		shading: THREE.SmoothShading, 
		side: THREE.DoubleSide, 
		map: waterTexture,
		transparent: true,
		opacity: 0.75,
		fog: true
	} );

	var plane = new THREE.Mesh( geometry, material );
	plane.name = "ocean";
	return plane;
};

function makeEnvScale() {
	var env_scale = 1;
	
	if (player) {
		env_scale = new THREE.Vector3().getPositionFromMatrix(player.matrixWorld).y;
	}

	env_scale = Math.floor(env_scale / 10000);
	
	$("#log").html(env_scale);
	
	return env_scale;
}

water.prototype.update = function() {
	
	var 	env_scale = makeEnvScale(),
			water_length = water.length,
			scale_multiplier = env_scale - 1, // to account for the coordinates in the excel sheet when multiplying the tiles and check previous scale
			expected_tile_count = 1;

	for (var scale = 1; scale < env_scale; scale++) {
		expected_tile_count += scale * 8;
	}
	
	//console.log("exp: " + expected_tile_count + " env_scale: " + env_scale);
	
	if (water.length < expected_tile_count) { 
		effects.water.addTiles(env_scale -1, expected_tile_count);
	}
}
 
 water.prototype.addTiles = function(env_scale, expected_tile_count){
	var pos = new THREE.Vector3(0,0,0);
	
	if (water.length > 0) {
		pos = new THREE.Vector3().getPositionFromMatrix(player.matrixWorld);
	}
	
	var 	tile_array = [],
			tile_count = (env_scale * 2),
			x =  pos.x,
			z = pos.z;
			
	var 	log =  "Scale: " + env_scale + "<br>";
	log += "Previous Water # " + water.length + "<br>";
	log += "Expected # "+ expected_tile_count + "<br>";
	log += "Diff to next # "+ tile_count * 4 + "<br>";
	log += "Tiles per side # " + tile_count + "<br>";
	
	 for (var side = 1; side <= 4; side++) {
		log += "-- Side: " + side + "<br>";
		for (var tile_index = 1; tile_index <= tile_count; tile_index++) {
			log += "---- Adding tile " + tile_index + "<br>";
			var	x_mod = M, 
					z_mod =M;
			
			if (side == 1) { 
				if (tile_index <= tile_count / 2) {
					x_mod *= tile_index - 1;
					z_mod *= env_scale;
				}
				else {
					x_mod *= env_scale;
					z_mod *= tile_index - env_scale;
				}
			}
			if (side == 2) {
				if (tile_index <= tile_count / 2) {
					x_mod *= env_scale;
					z_mod *= -tile_index + 1;
				}
				else {
					x_mod *= tile_index - env_scale;
					z_mod *= -env_scale;
				}
			}
			if (side == 3) {
				if (tile_index <= tile_count / 2) {
					x_mod *= -tile_index + 1;
					z_mod *= -env_scale;
				}
				else {
					x_mod *= -env_scale;
					z_mod *= -(tile_index - env_scale);
				}
			}
			if (side == 4) {  
				if (tile_index <= tile_count / 2) {
					x_mod *= -env_scale;
					z_mod *= tile_index - 1;
				}
				else {
					x_mod *= -(tile_index - env_scale);
					z_mod *= env_scale;
				}
			}
			
			var tile = new effects.water.makeWater(M, pos);
			tile.position.x =  x_mod; 
			 tile.position.z =  z_mod;
	
			
			log += "-------- x: " + Math.floor(tile.position.x) + "<br>";
			log += "-------- z: " + Math.floor(tile.position.z) + "<br>";
			
			tile_array.push(tile);
		}
	 }
	log += "Added " + tile_array.length + " tiles<br>";
	
	tile_array.forEach(function(tile){
		water.push(tile);
		scene.add(water[water.length-1]);
	});
	log += "New Water # " + water.length + " tiles";
	//$("#log").html(log);
 };