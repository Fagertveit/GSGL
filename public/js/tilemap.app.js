/* GSGL - Geometry
 * - - - - - - - - - - -
 * Here we showcase and test out the geometry classes and objects.
 */

Tilemap = function(params) {
	var application = {
		application : {},
		logger : new GSGL.utility.Logger({type: "Application"}),

		constructor : function(params) {
			var _this = this;
			this.logger.log("Creating application");

			GSGL.WIDTH = 320;
			GSGL.HEIGHT = 240;

			// We need to load an application state before we start the application
			$shaderManager.createProgram("data/2d.fshader", "data/2d.vshader", "default");
			$shaderManager.useProgram("default");
			$renderManager.initRenderer();

			this.font = new GSGL.gl.font.Font({src: "font/default.xml"});
	
			this.tilemap = new GSGL.tilemap.Tilemap();
			this.tilemap.loadTiledMap('./data/basic.json');
		},

		update : function(delta) {
			
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.tilemap.render(0, 0);

			$renderManager.render();
		},
	};
	application.constructor(params);

	return application;
};

var app = new GSGL.gl.Application({container: "gsgl-container", width: 320, height: 240});
app.setState(Tilemap);