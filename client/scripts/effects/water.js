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

water.prototype.makeWater = function(M) {
	
	var water_res = 100;
	if (water) { water_res = 1; }
	
	var geometry = new THREE.PlaneGeometry( M, M , water_res, water_res );	
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	
	var waterTexture = THREE.ImageUtils.loadTexture( "assets/water.jpg" );
	waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
	waterTexture.repeat.set( 12, 12 );
	
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

water.prototype.update = function() {
	var 	env_scale = Math.round(((player.position.y) / 10000)-1),
			water_length = water.length,
			scale_multiplier = env_scale - 1, // to account for the coordinates in the excel sheet when multiplying the tiles and check previous scale
			expected_tile_count = 1;
			

	for (var scale = 1; scale < env_scale; scale++) {
		expected_tile_count += scale * 8;
	}
	
	//console.log("exp: " + expected_tile_count + " env_scale: " + env_scale);
	
	if (water.length < expected_tile_count) { 
		effects.water.addTiles(env_scale, expected_tile_count);
	}
}
 
 water.prototype.addTiles = function(env_scale, expected_tile_count){
	var tile_array = [];
	var 	log =  "Scale: " + env_scale + "<br>";
	log += "Previous Water # " + water.length + "<br>";
	log += "Expected # "+ expected_tile_count + "<br>";
	log += "Diff to next # "+ expected_tile_count + "<br>";
	log += "Tiles per side # " + (env_scale * 2) + "<br>";
	
	 for (var side = 0; side < 4; side++) {
		log += "-- Side: " + side + "<br>";
		for (var tile_index = 0; tile_index < (env_scale * 2) - 2; tile_index++) {
			log += "---- Adding tile" + tile_index + "<br>";
			var	x = water[0].position.x,
					z = water[0].position.z,
					x_mod = M, 
					z_mod =M;
			
			if (side == 0) { x_mod *= -1; }
			if (side == 1) { }
			if (side == 2) { z_mod *= -1; }
			if (side == 3) {  x_mod *= -1; z_mod *= -1; }
			
			x_mod = x_mod * tile_index;
			z_mod = z_mod * tile_index;
			
			var tile = new effects.water.makeWater(M);
			
			tile.position.x =  x + x_mod;
			tile.position.z = z + z_mod;
			tile_array.push(tile);
		}
	 }
	log += "Added " + tile_array.length + " tiles<br>";
	
	tile_array.forEach(function(tile){
		water.push(tile);
		scene.add(water[water.length-1]);
	});
	log += "New Water # " + water.length + " tiles";
	$("#voda").html(log);
 };