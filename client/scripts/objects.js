/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Objects
	This defines object methods and proxies the sub class functions 
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var	cache = [],
		world_map = [];

function loadObject(instruction) {
	var loader = new THREE.JSONLoader();
	var cacheIndex = -1;
	cache.forEach(function(cachedObject, index){ if (instruction.url == cachedObject.url) { cacheIndex = index;} });

	var  x = instruction.position.x,
		y = instruction.position.y,
		z = instruction.position.z,
		scale = instruction.scale, 
		type = instruction["class"]; 
	
	if (cacheIndex >= 0) {
		var cachedObject = cache[cacheIndex];
		mesh = makeObjectMesh(type, cachedObject.geometry, cachedObject.materials, x, y, z , scale);
		renderObject(mesh, type, instruction);
	}
	else {
		loader.load(instruction.url, function(geometry, materials) {
			mesh = makeObjectMesh(type, geometry, materials, x, y, z , scale);
			var cachedObject = { url: instruction.url, geometry: geometry, materials: materials};
			cache.push(cachedObject);	
			renderObject(mesh, type, instruction);
		});
	}
}
function makeObjectMesh(objectType, geometry, materials, x, y, z, scale) {
	var useVertexOverrides = false;
	if ((objectType != "ship")&&(objectType != "player")&&(objectType != "bot")) {
		useVertexOverrides = true;
	}
	materials.forEach(function(material, index){

		if (material.name == "Metal") {
				materials[index].vertexColors = THREE.VertexColors;
		}
		if (material.name == "Light-Metal") {
				materials[index].vertexColors = THREE.VertexColors;
		}
		if (material.name == "Red-Metal") {
				materials[index].vertexColors = THREE.VertexColors;
		}
		if (material.name == "Glass") {
				materials[index].transparent = true;
				materials[index].opacity = 0.8;
	
				materials[index].color.r = .1;
				materials[index].color.g =  .5; 
				materials[index].color.b =  .9;
		
				materials[index].vertexColors = THREE.VertexColors;

		}
		if (material.name == "Dark-Glass") {
			materials[index].shading = THREE.FlatShading;
			materials[index].transparent = true;
			materials[index].opacity = 0.95;

			materials[index].vertexColors = THREE.VertexColors;
			
		}
	});
	geometry.faces.forEach(function(face,index){
		if ((materials[face.materialIndex].name == "Red-Metal")&&(useVertexOverrides == true)) {
			face.vertexColors[0] =  new THREE.Color( 0x440000 );
			face.vertexColors[1] =  new THREE.Color( 0x440000 );
			face.vertexColors[2] =  new THREE.Color( 0x550000);
			face.vertexColors[3] =  new THREE.Color( 0x440000 );
		}
		if ((materials[face.materialIndex].name == "Metal")&&(useVertexOverrides == true)) {
			face.vertexColors[0] =  new THREE.Color( 0x333333 );
			face.vertexColors[1] =  new THREE.Color( 0x222222 );
			face.vertexColors[2] =  new THREE.Color( 0x333333);
			face.vertexColors[3] =  new THREE.Color( 0x333333 );
		}
		if ((materials[face.materialIndex].name == "Light-Metal")&&(useVertexOverrides == true)) {
			face.vertexColors[0] =  new THREE.Color( 0x666666 );
			face.vertexColors[1] =  new THREE.Color( 0x444444 );
			face.vertexColors[2] =  new THREE.Color( 0x666666);
			face.vertexColors[3] =  new THREE.Color( 0x666666 );
		}
		if ((materials[face.materialIndex].name == "Dark-Glass")&&(useVertexOverrides == true)) {
			face.vertexColors[0] =  new THREE.Color( 0x112233 );
			face.vertexColors[1] =  new THREE.Color( 0x112233 );
			face.vertexColors[2] =  new THREE.Color( 0x116699);
			face.vertexColors[3] =  new THREE.Color( 0x113355 );
		}
	});
	object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ) );
	object.geometry.computeBoundingBox();
	object.name = objectType;
	object.position.set(x, y, z);
	object.scale.set(scale, scale, scale);
	object.matrixAutoUpdate = true;
	object.updateMatrix();
	object.geometry.colorsNeedUpdate = true;
	return object;
}
function renderObject(mesh, type, instruction) {
	mesh.uid = instruction.id;
	var  x = instruction.position.x,
			y = instruction.position.y,
			z = instruction.position.z,
			scale = instruction.scale;

	if (type == "environment") { 
		world_map.push(mesh);
		scene.add(world_map[world_map.length-1]);
	}
	if (type == "players") {
		player = mesh;
		player.bullets = [];
		player.moveInterval = new Date().getTime();
		player.username = instruction.username;
		player.rotation.y = instruction.position.rotationY;
		player.material.materials.forEach(function(material,index){
			player.material.materials[index].morphTargets = true;
		});
		
		player.velocity = 0;
		
		player.add(camera);
		scene.add(player);
		ships.push(player);

	}
	if (type == "bot") {
		var bot = mesh;
		bot.bullets = [];
		bot.id = instruction.id;
		bot.type = instruction.shipType;
		bot.rotation.y = instruction.position.rotationY;
		bot.add(botScope());
		bots.push(bot);
		scene.add(bots[bots.length-1]);
	}
}