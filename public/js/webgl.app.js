/* GSGL - Geometry
 * - - - - - - - - - - -
 * Here we showcase and test out the geometry classes and objects.
 */



Application = function(params) {
	var application = {
		state : {},
		container : '',
		lastDelta : 0,
		timerId : 0,
		targetFps : 30,
		lastUpdate : 0,
		fps : 30,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface3D({id: "gsgl-canvas", width: 640, height: 480}),
		// Creating the basic shapes

		constructor : function(params) {
			var _this = this;
			this.logger.log("Creating application");

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;
			$ajax = new GSGL.utility.Ajax({});
			$resources = new GSGL.resource.ResourceManager();
			//$renderManager = new GSGL.surface.RenderManager();

			this.surface.initContext();

			// We need to load an application state before we start the application
			this.shaderManager = new GSGL.gl.shader.ShaderManager({});
			this.shaderManager.initShaders("data/2d.fshader", "data/2d.vshader");
			$renderManager = new GSGL.surface.RenderManager2D({program: this.shaderManager.program});

			this.texture = new GSGL.gl.texture.Texture({src: "img/desert.png"});

			window.setTimeout(function() {
				_this.sprite = new GSGL.gl.sprite.Sprite({width: 256, height: 256, texture: _this.texture.texture});
				_this.renderCall = _this.sprite.render(100, 100, this);

				console.log(_this.renderCall);

				_this.start();
			}, 1000);
		},

		step : function() {
			this.loop();
		},

		start : function() {
			var _this = this;
			this.timerId = window.setInterval(function(){
				_this.loop();
			}, (1000/_this.targetFps));
		},

		stop : function() {
			window.clearInterval(this.timerId);
		},

		loop : function() {
			var now = new Date().getTime();
			var delta = now - this.lastDelta;
			this.lastDelta = now;

			this.update(delta);
			this.render(delta);

			// Check if the user wants to render the FPS
			if(this.showFps) {
				this.renderFps();
			}

			if(now - this.lastUpdate > 1000) {
				this.fps = this.frames;
				this.frames = 0;
				this.lastUpdate = now;
			} else {
				this.frames += 1;
			}

			$mouse.clearClicks();
		},

		update : function(delta) {

		},

		render : function(delta) {
			this.sprite.render(100, 100);

			this.sprite.render(356, 100);
			
			$renderManager.render();
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});