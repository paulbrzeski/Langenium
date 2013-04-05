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

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// Main

	$("#editor_tools input[name='scene_objects']").live("click", function(e){
		$("#editor_tools").html(ui.editor.makeControls().data);
		$("#editor_tools").append(ui.editor.getProperties(this.value));
	});

editor.prototype.makeControls = function () {
		var html = { width: 450, alignX: "left", alignY: "top", data: "" };
		
		html.data += "<a href='#' onclick='ui.editor.refresh();'>Refresh editor</a>";
		for (var i in scene.__objects) {
			html.data += "<br><input type='radio' name='scene_objects' id='et_" + scene.__objects[i].name + i + "' value='"+i+"'>";
			html.data += "<label for='et_" + scene.__objects[i].name + i + "'>" + scene.__objects[i].name + "</label>";
		}
		
		return html;
};
editor.prototype.refresh = function() {
	
	$("#editor_tools").html(ui.editor.makeControls().data);

};

// Helpers

editor.prototype.getProperties = function(id) {
	var html = "<ul>";
	for (var i in scene.__objects[id]) {
		var val = scene.__objects[id][i];
		if ((typeof(val) != "object")&&(typeof(val) != "function")) {
			html += "<li>" + i + ": " + val +"</li>";
		}
		else {
			if (typeof(val) == "object") {
				html += "<li>" +i + "<ul>";
				for (var j in val) {
					var jval = val[j];
					if ((typeof(jval) != "object")&&(typeof(jval) != "function")) {
						if ((typeof(jval) == "string")&&(jval.length > 150)) {
							html += "<li>" + j + ": " + jval.substring(0,100)+"</li>";
						}
						else {
							html += "<li>" + j + ": " + jval +"</li>";
						}
					}
				}
				html += "</ul></li>";
			}
		}
	}
	html += "</ul>";
	return html;
};
var ray = new THREE.Raycaster();
	var projector = new THREE.Projector();
editor.prototype.onClick = function ( event ) {

	event.preventDefault();

				var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * M, - ( event.clientY / window.innerHeight ) * M , 0.5 );
				projector.unprojectVector( vector, camera );

				var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

				var intersects = raycaster.intersectObjects( scene.__objects );

				if ( intersects.length > 0 ) {
					
						console.log(intersects[0].object.name);
				
					
	
					
				}

			
	};


