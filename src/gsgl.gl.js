GSGL.gl = {
	VERTEX_SHADER : 0,
	FRAGMENT_SHADER : 1,

	Application : function(params) {
		var application = {
			container : '',
			lastDelta : new Date().getTime(),
			timerId : 0,
			targetFps : 20,
			lastUpdate : 0,
			fps : 30,
			frames : 0,
			width : 640,
			height : 480,
			canvasId : "",
			logger : new GSGL.utility.Logger({type: "WebGL Application"}),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.initGlobals();
			},

			initGlobals : function() {
				$surface = new GSGL.surface.Surface3D({id: this.canvasId, width: this.width, height: this.height});
				$surface.initContext();

				GSGL.WIDTH = this.width;
				GSGL.HEIGHT = this.height;

				var realWidth = $surface.canvas.clientWidth;
				var realHeight = $surface.canvas.clientHeight;

				$resolution = new GSGL.utility.Resolution({WIDTH: GSGL.WIDTH, HEIGHT: GSGL.HEIGHT, REAL_WIDTH: realWidth, REAL_HEIGHT: realHeight});
				// Global mouse, touch and keyboard event handelers.
				$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID,});
				$mouse.RESOLUTION = true;
				$touch = new GSGL.event.TouchManager({target: GSGL.CONTAINER_ID,});
				$touch.RESOLUTION = true;
				$keyboard = new GSGL.event.KeyboardManager();
				// Global collision detection, takes to shapes and checks if they intersects.
				$intersects = GSGL.physics.intersects;
				// General AJAX helper class
				$ajax = new GSGL.utility.Ajax({});
				// Resource manager, keeps track so that everything is loaded right
				$resources = new GSGL.resource.ResourceManager();
				// Texture manager keeps track on active textures
				$textureManager = new GSGL.gl.texture.TextureManager();
				// Shader manager keeps track on all shader programs and loading/compiling of shaders
				$shaderManager = new GSGL.gl.shader.ShaderManager();
				// Render manager handles all rendercalls and optimize GPU communication
				$renderManager = new GSGL.gl.render.RenderManager2D();
			},

			start : function() {
				var _this = this;

				if($resources.isLoaded()) {
					this.timerId = window.setInterval(function() {
						_this.step();
					}, (1000/_this.targetFps));
				} else {
					window.setTimeout(function() {
						_this.start();
					}, 100)
				}
			},

			stop : function() {
				window.clearInterval(this.timerId);
			},

			step : function() {
				this.update();
			},

			update : function() {
				var now = new Date().getTime();
				var delta = now - this.lastDelta;
				this.lastDelta = now;

				this.state.update(delta);
				this.state.render(delta);

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

			/* Set State
			 * * * * * * *
			 * This is were we init the application or it's childstates, we do this by stopping current state
			 * and init the new state, then we call the start method that checks if everything is loaded before
			 * it start the state loop. We can add functionality here so that we run the splash/loading screen
			 * betwixt states, and at the start of the application.
			 *
			 * The state always keeps a reference to this class as it needs it for global application
			 * commands as well as state changes.
			 *
			 * ToDo: Write a general purpose Splash/Loader for state changes.
			 */
			setState : function(state) {
				var _this = this;
				this.stop();
				this.state = new state({application: _this});
				this.start();
			},
		};
		application.constructor(params);

		return application;
	},
};