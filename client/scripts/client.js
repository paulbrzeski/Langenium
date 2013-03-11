/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	LANGENIUM CLIENT 
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

$(document).ready(function(){
	initializeClient();
	animate();
});


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var username = "Saggy Nuts";

/* Game engine */
var 	renderer,
		camera,
		controls;
		
var duration = 100,
	keyframes = 5,
	animOffset = 0,
	interpolation = duration / keyframes,
	lastKeyframe = 0, currentKeyframe = 0;

/* Object definition */
var 	M = 1000000,
			winW = 1024, winH = 768,
			objects = {
							players: [],
							bots: [],
							projectiles: [],
							environment: []
							};


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function Definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var isFiring = false;
$(document).bind("mousedown", function(event) {
    switch (event.which) {
        case 1:
            isFiring = true;
            break;
        case 2:
            //zoom IGNORE
            break;
        case 3:
            //rotate
            break;
    }
});

function initializeClient() {
/*
	Initializes the client... :P
*/
	updateWinSizeVariables();
	renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	
	camera = new THREE.PerspectiveCamera( 45, (winW) / (winH), 10, M );
	camera.position.y = 5;
	camera.position.z = 50;
	
	controls = new THREE.TrackballControls(camera);
	controls.target.set(0, 0, 0);
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.5;
	
	createScene();
	
	renderer.setSize( winW, winH);
	$("#game").append(renderer.domElement);
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function createScene() {
 /* 
	Create basic scene objects - sky, etc
*/
	scene = new THREE.Scene();
	scene.add(camera);
	var skyGeo = new THREE.CubeGeometry(M, M, M);
	var skyMat = new THREE.MeshLambertMaterial({
		shading: THREE.SmoothShading, 
		side: THREE.DoubleSide, 
		 vertexColors: THREE.VertexColors,
		overdraw: true 
	});
	
	for ( var i = 0; i < skyGeo.faces.length; i++ ) 
	{
		face = skyGeo.faces[ i ];

		face.vertexColors[0] =  new THREE.Color( 0x99ffff );
		face.vertexColors[1] =  new THREE.Color( 0x3399FF );
		face.vertexColors[2] =  new THREE.Color( 0x3399FF );
		face.vertexColors[3] =  new THREE.Color( 0x99ffff );
	}
	
	var sky = new THREE.Mesh(skyGeo, skyMat);
	sky.position.y += 10000;
	scene.add(sky);
	
	var geometry = new THREE.PlaneGeometry( M, M, 25, 25 );	
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		geometry.vertices[ i ].y = Math.random() * 1000 - 2000;
	}
	
	var water = THREE.ImageUtils.loadTexture( "assets/water.jpg" );
	water.anisotropy = 1;
	water.wrapS = water.wrapT = THREE.RepeatWrapping;
	water.repeat.set( 16, 16 );
	
	
	var material = new THREE.MeshLambertMaterial( {
		color: 0x0066BB,
		shading: THREE.SmoothShading, 
		side: THREE.DoubleSide, 
		map: water
	} );
			

	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	
	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'assets/cloud10.png');

	var material = new THREE.ShaderMaterial( {
		map: texture,
		transparent: true

	} );

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

	for ( var i = 0; i < 8000; i++ ) {

		plane.position.x = Math.random() * 1000 - 500;
		plane.position.y = - Math.random() * Math.random() * 1200 - 1500;
		plane.position.z = i;
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.scale.y = Math.random() * Math.random() * 150 + 50;

		THREE.GeometryUtils.merge( geometry, plane );

	}

	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = "clouds";
	scene.add( mesh );
	
	
	
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	hemiLight.color.setRGB( 0.9, 0.95, 1 );
	hemiLight.groundColor.setRGB( 0.6, 0.75, 1 );
	hemiLight.position.set( 0, M, 0 );
	scene.add( hemiLight );
}	

function animate() {
	var delta = clock.getDelta();
	
	handleParticles(delta);
	handleBullets(delta);
	var animTime = new Date().getTime() % duration;
	var keyframe = Math.floor( animTime / interpolation ) + animOffset;
	
	TWEEN.update();
	var shipsMoving = false;
	if (player) {
	
		scene.children[1].material.map.offset.y +=  delta / 250;
		scene.children[1].material.map.offset.x +=  delta / 250;
		for ( var i = 0, l = scene.children[1].geometry.vertices.length; i < l; i ++ ) {
			var next = i + 1;
			if (next >= scene.children[1].geometry.vertices.length) { next = 0; }
			scene.children[1].geometry.vertices[i].y += (scene.children[1].geometry.vertices[next].y - scene.children[1].geometry.vertices[i].y) / 10;
		}
		scene.children[1].geometry.verticesNeedUpdate = true;
		if  (player.velocity != 0) {
			player.velocity *= .996;
		}
	
		if ( keyframe != currentKeyframe ) {
			player.morphTargetInfluences[ lastKeyframe ] = 0;
			player.morphTargetInfluences[ currentKeyframe ] = 1;
			player.morphTargetInfluences[ keyframe ] = 0;

			lastKeyframe = currentKeyframe;
			currentKeyframe = keyframe;
		}

		player.morphTargetInfluences[ keyframe ] = ( animTime % interpolation ) / interpolation;
		player.morphTargetInfluences[ lastKeyframe ] = 1 - player.morphTargetInfluences[ keyframe ];
		player.updateMatrix();

		movePlayer(player.velocity / 66, player.position, playerInput(delta));
		if  (player.velocity != 0) {
			player.velocity *= .996;
		}
		if (player.position.y < 50) {
			player.position.y += 3;
		}
	}
	
	ships.forEach(function(ship,index){
		if (ship.position.y < 50) { ship.position.y += 3; }
		if (ship.rotation.z != 0) { ship.rotation.z -= ship.rotation.z / 50; }
	});
	
	bots.forEach(function(bot,index){
		if (player) {
			bots[index].children[0].rotation.x = -bots[index].rotation.x;
			bots[index].children[0].rotation.y = -bots[index].rotation.y + player.rotation.y + player.children[0].rotation.y;
			bots[index].children[0].rotation.z = -bots[index].rotation.z;
		}
		if (bot.position.y < 50) { bot.position.y += 3; }
		if (bot.rotation.z != 0) { bot.rotation.z -= bot.rotation.z / 50; }
	});

	
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();
}

function onWindowResize() {
/*
	Resizes the renderer
*/
	updateWinSizeVariables();
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function updateWinSizeVariables(){
/*
	Update the global window variables
*/
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth ) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	} 
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
}