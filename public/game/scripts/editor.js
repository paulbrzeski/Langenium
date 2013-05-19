  /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Editor
	This class defines editor objects
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// editor object is on document as this is a whole new interface

var ray = new THREE.Raycaster();
var projector = new THREE.Projector();

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Initialize editor
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var editor = function() {
   
	this.sky_camera_active = false;

	this.camera = new THREE.PerspectiveCamera( 45, (client.winW / client.winH), 1, M * 2 );
	this.camera.position.y = 5000;
	this.camera.rotation.x = -.85;

	return this;
};


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Helper Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// Events

$("#editors_tools").live("mouseenter",function(e){
	controls.enabled = false;
});
$("#editors_tools").live("mouseout",function(e){
	controls.enabled = true;
});

$("#editor_tools input[name='scene_objects']").live("click", function(e){
	$("#editor_tools").html(ui.editor.makeControls().data);
	$("#editor_tools").append(ui.editor.getProperties(this.value));
});

// Helpers

editor.prototype.makeControls = function () {

	var html = { width: 250, alignX: "left", alignY: "top", data: "" };
		
	
		html.data += "<h3>Tools</h3>";
		html.data += "<ul class='menu'>";
		
		html.data += "<li><a href='#'>Scene Objects</a><ul>";
		if (scene) {
			for (var i in scene.__objects) {

				html.data += "<li><a href='#' onclick='editor.properties.loadProperties("+i+")'>" + scene.__objects[i].name + " (" + scene.__objects[i].id + ")</a></li>";
			}
		}
		html.data += "</ul></li>";
		
		html.data += "<li><a href='#'>Add</a>";
		html.data += "<ul class='menu'>";
			html.data += "<li><a href='#'>Union</a><ul>";
			html.data += "<li><a href='#'>Platform</a></li>";
			html.data += "</ul></li>";
		html.data += "</ul></li>";

		html.data += "<li><a href='#'>Camera</a>";
		html.data += "<ul class='menu'>";
			html.data += "<li><a href='#' onclick='editor.toggleCamera();'>Ship</a></li>";
			html.data += "<li><a href='#' onclick='editor.toggleCamera();'>Bird's eye</a></li>";
		html.data += "</ul>";
		html.data += "</ul><br />";
		
		
		html.data += "<a class='refresh button' href='#' onclick='editor.refresh();' >Refresh editor</a>";
	

	return html;
};

editor.prototype.refresh = function() {
	
	$("#editor_tools").html(editor.makeControls().data);
	$("#editor_tools .button").button();
	$("#editor_tools .menu").menu();
};

editor.prototype.toggleCamera = function() {

	if (editor.sky_camera_active == true) {
		player.remove(editor.camera);
		client.camera = controls.flight.camera;
		player.add(controls.flight.camera);
		editor.sky_camera_active = false;
	}
	else {
		player.remove(controls.flight.camera);
		client.camera = editor.camera;
		player.add(editor.camera);
		editor.sky_camera_active = true;

	}

}






