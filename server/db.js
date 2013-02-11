/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Database
	This class contains functions to interact with the database
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Exports Functions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

module.exports.get = get;


/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Global Variables
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
	
// Database emulator 

var db = {
	objects: [
		// Ships (Bots, Players)
		{ type: "ship", name: "mercenary", details: { url: "assets/mercenary.js?nocache", scale: 10 } },
		{ type: "ship", name: "pirate", details: { url: "assets/pirate.js?nocache" , scale: 10 } },
		
		//Characters (Bots, Players)
		
		// Environment (Instance Objects)
		{ type: "platform", name: "union", details: { url: "assets/union-platform2.js?nocache"  } },
		{ type: "terrain", name: "island", details: { url: "assets/island.js?nocache"  } }
	],
	players: [
		{
			username: "Saggy Nuts",
			instance_id: "master",
			class: "players",
			type: { ship: "mercenary" },
			position: { x: 100, y: 8000, z: 100, rY: 0 }
		}
	],
	instances: [
		{
			instance_id: "master",
			type: "container",
			objects: 	[
								{
									class: "environment",
									type: { platform: "union" },
									position: { x: 2000, y: 3500, z: 100, rY: 0 },
									scale: 1000
								},
								{
									class: "environment",
									type: { terrain: "island" },
									position: { x: 5500, y: -1500, z: -75000, rY: 0 },
									scale: 2800 
								},
								{
									class: "environment",
									type: { terrain: "island" },
									position: { x: 18000, y: -500, z: -65000, rY: 0 },
									scale: 2500 
								},
								{
									class: "environment",
									type: { terrain: "island" },
									position: { x: 50000, y: -1500, z: -25000, rY: 0 },
									scale: 2800 
								}
							]
		}
	]
};

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	Function Definitions
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

function get(path, search_key, search_term) {
	/* 
		Returns the player object from the database
	*/
	for (var i = 0; i < db[path].length; i++) {
		if (search_term == db[path][i][search_key]) { return db[path][i]; } 
	}
}
























