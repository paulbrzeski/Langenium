
requirejs.config(config);
require(["App", "ember"], function(App, Ember){
	var app_name = config.app_name || "App";
	root[app_name] = App = Ember.Application.create(App);
});
