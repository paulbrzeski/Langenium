  /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Editor
	This class defines editor objects
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var editor = function() {
   
   return this;
};

var ray = new THREE.Raycaster();
var projector = new THREE.Projector();

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Functions
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
		
		html.data += "<li><a href='#'>Environmental Objects</a><ul>";
		for (var i in scene.__objects) {

			html.data += "<li><a href='#' onclick='ui.editor.properties.loadProperties("+i+")'>" + scene.__objects[i].name + " (" + i+ ")</a></li>";
		}
		html.data += "</ul></li>";
		
		html.data += "<li><a href='#'>Add</a>";
		html.data += "<ul class='menu'>";
			html.data += "<li><a href='#'>Union</a><ul>";
			html.data += "<li><a href='#'>Platform</a></li>";
			html.data += "</ul></li>";
		html.data += "</ul></li>";
		
		html.data += "</ul><br />";
		
		
		html.data += "<a class='refresh button' href='#' onclick='ui.editor.refresh();' >Refresh editor</a>";
		return html;
};

editor.prototype.refresh = function() {
	
	$("#editor_tools").html(ui.editor.makeControls().data);
	$("#editor_tools .button").button();
	$("#editor_tools .menu").menu();
};

// Helpers





