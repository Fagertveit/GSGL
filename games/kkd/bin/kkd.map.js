/* Map
 * * * * *
 * The Map class holds information about the path where the creeps travel as well as the areas wherin the player
 * can place "tower" units.
 * The Map will be loaded at the start of a level and the it will be treated with creep waves that the player will have
 * to defeat to complete the level.
 * The Creep waves is seperated from the map and is registered in it's own class.
 */
KKD.Map = function(params) {
	var map = {
		paths : [], // Array of paths that the creeps can take
		areas : [], // Array of areas where the player can place towers
		background : {}, // Background image for the level

		constructor : function(params) {
			for(key in params) {
				if(this[key] != undefined) {
					this[key] = params[key];
				}
			}

			//this.init();
		},

		init : function() {
			var i = 0;
			var len = this.paths.length;

			for(i; i < len; i += 1) {
				this.paths[i].reparametrizeByArcLength(100);
			}
		},

		render : function() {
			this.renderPaths();
			this.renderAreas();
		},

		renderPaths : function() {
			var len = this.paths.length;
			var i = 0;
			$g.save();
			$g.strokeStyle = "#990000";
			for(i; i < len; i += 1) {
				this.paths[i].renderEdit();
			}
			$g.restore();
		},

		renderAreas : function() {
			var len = this.areas.length;
			var i = 0;
			$g.save();
			$g.strokeStyle = "#009900";
			for(i; i < len; i += 1) {
				this.areas[i].render();
			}
			$g.restore();
		}
	};
	map.constructor(params);

	return map;
};