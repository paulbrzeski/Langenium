  /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Editor
	This class defines editor objects
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Globals
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

var transform = function() {
   this.mouseover = false;
   return this;
};


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// Events

$("#transform").live("mouseover",function(e){
	ui.editor.transform.mouseover = true;
	controls.enabled = false;
});
$("#transform").live("mouseout",function(e){
	ui.editor.transform.mouseover = false;
	controls.enabled = true;
});

// Helpers
transform.prototype.makeControls = function () {
	var html = { width: 500, alignX: "right", alignY: "bottom", data: "" };
	
	html.data += "<div class='controls'>";
	html.data += "<h3>Position</h3>";
	html.data += "<h4>X</h4><input type='text' class='position x textbox' value='0' /><span class='position x slider-control'>0</span>";
	html.data += "<h4>Y</h4><input type='text' class='position y textbox' value='0' /><span class='position y slider-control'>0</span>";
	html.data += "<h4>Z</h4><input type='text' class='position z textbox' value='0' /><span class='position z slider-control'>0</span>";
	html.data += "<h3>Rotation</h3>";
	html.data += "<h4>X</h4><input type='text' class='rotation x textbox' value='0' /><span class='rotation x slider-control'>0</span>";
	html.data += "<h4>Y</h4><input type='text' class='rotation y textbox' value='0' /><span class='rotation y slider-control'>0</span>";
	html.data += "<h4>Z</h4><input type='text' class='rotation z textbox' value='0' /><span class='rotation z slider-control'>0</span>";
	html.data += "<h3>Scale</h3>";
	html.data += "<input type='text' class='scale textbox' value='0' /><span class='scale slider-control'>0</span>";
	html.data += "</div>";
	
	return html;
};

transform.prototype.loadProperties = function(id) {
	// clears and populates the transform window
	var object;
	for (var i in scene.__objects) {
		if (scene.__objects[i].id == id) {
			object = scene.__objects[i];
		}
	};
	$("#transform .controls .position.x.textbox").val(object.position.x);
	$("#transform .controls .position.y.textbox").val(object.position.y);
	$("#transform .controls .position.z.textbox").val(object.position.z);
	
	$("#transform .controls .position.x.slider-control").slider( "option", "value", object.position.x );
	$("#transform .controls .position.y.slider-control").slider( "option", "value", object.position.y );
	$("#transform .controls .position.z.slider-control").slider( "option", "value", object.position.z );
	
	$("#transform .controls .rotation.x.textbox").val(object.rotation.x);
	$("#transform .controls .rotation.y.textbox").val(object.rotation.y);
	$("#transform .controls .rotation.z.textbox").val(object.rotation.z);
	
	$("#transform .controls .rotation.x.slider-control").slider( "option", "value", object.rotation.x );
	$("#transform .controls .rotation.y.slider-control").slider( "option", "value", object.rotation.y );
	$("#transform .controls .rotation.z.slider-control").slider( "option", "value", object.rotation.z );
	
	$("#transform .controls .scale.textbox").val(object.scale.x);
	
	$("#transform .controls .scale.slider-control").slider( "option", "value", object.scale.x );
};

transform.prototype.setProperty = function(property, value) {
	property = value;
};

transform.prototype.refresh = function() {
	var scale = M / 8;
	$( "#transform  .position.slider-control" ).each(function() {
		 var value = parseInt( $( this ).text(), 10 );
		 $( this ).empty().slider({
			value: value,
			min: -scale,
			max: scale,
			animate: true
		});
	});
	$( "#transform  .rotation.slider-control" ).each(function() {
		 var value = parseInt( $( this ).text(), 10 );
		 $( this ).empty().slider({
			value: value,
			min: -5,
			max: 5,
			animate: true
		});
	});
	$( "#transform  .scale.slider-control" ).each(function() {
		 var value = parseInt( $( this ).text(), 10 );
		 $( this ).empty().slider({
			value: value,
			min: 0,
			max: 10000,
			animate: true
		});
	});
};