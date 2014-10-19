/*
	editor.js
*/

var app = function () {
	
    $('.ui.sidebar').sidebar('attach events', '.launch.button');

    $('.ui.dropdown').dropdown();

	console.log('[ Editor started ]');

	L.director.options.activeScene = "MMO";
	L.scenograph.animate();

	return this;
};

app.prototype._init = function() {
	L.app = new app();
}

app.prototype._destroy = function() {
	L.director.options.paused = true;
	
}