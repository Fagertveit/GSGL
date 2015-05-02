/* Kvite Krist Defence
 * - - - - - - - - - - -
 * You are the Chieftain of a big area in the nothern realms, and Kvite Krist is trying to assimilate your lands to their nasty
 * all loving believes, this has to stop. So you gather all the creatures of the woods to help you fight the christian threat from
 * the south. Kill the christians with all the good weapons that your creatures have, and take advantage of the nature that you
 * want to save from these monsters.
 * If the churchbell start to chime you will have to see to finding a new place to live deeper in the woodlands.
 * - - - -
 * States
 * - - - -
 * Splash
 * Menu
 * * About
 * * How to play
 * Game
 * * Level Intro
 * * In Game
 * * Game Over / Highscore
 */

KKD.Application = function(params) {
	var application = {
		state : {},
		container : '',
		lastDelta : new Date().getTime(),
		timerId : 0,
		targetFps : 20,
		lastUpdate : 0,
		fps : 30,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface3D({id: "kkd-canvas", width: 800, height: 600}),

		constructor : function(params) {
			this.logger.log("Creating application");

			GSGL.WIDTH = 800;
			GSGL.HEIGHT = 600;

			this.surface.initContext();
			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;
			$ajax = new GSGL.utility.Ajax({});
			$resources = new GSGL.resource.ResourceManager();
			$textureManager = new GSGL.gl.texture.TextureManager();
			$shaderManager = new GSGL.gl.shader.ShaderManager();
			$renderManager = new GSGL.gl.render.RenderManager2D();

			// We need to load an application state before we start the application
			$shaderManager.createProgram("data/2d.fs", "data/2d.vs", "default");
			$shaderManager.useProgram("default");
			$renderManager.initRenderer();
			$font = new GSGL.gl.font.Font({src: "font/font.xml"});

			// We need to load an application state before we start the application
			this.setState('menu');
		},

		step : function() {
			this.update();
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

		update : function() {
			var now = new Date().getTime();
			var delta = now - this.lastDelta;
			this.lastDelta = now;

			var fpsCounter = document.getElementById("fps-counter");

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

			fpsCounter.innerHTML = this.fps;

			$mouse.clearClicks();
		},

		setState : function(state) {
			var _this = this;
			if(this.timerId != 0) {
				this.stop();
			}

			switch(state) {
				case "menu":
					this.state = new KKD.state.Menu({parent: this});
					this.start();
					break;
				case "game":
					this.state = new KKD.state.Game({parent: this});
					this.start();
					break;
				case "editor":
					this.state = new KKD.state.Editor({parent: this});
					this.start();
					break;
				default:
					this.logger.log("No such state, can't start application");
			}
		},
	};
	application.constructor(params);

	return application;
};

var app = new KKD.Application({container: "gsgl-container"});