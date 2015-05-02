/* GSGL - Geometry
 * - - - - - - - - - - -
 * Here we showcase and test out the geometry classes and objects.
 */

Application = function(params) {
	var application = {
		state : {},
		container : '',
		lastDelta : new Date().getTime(),
		timerId : 0,
		targetFps : 20,
		lastUpdate : 0,
		fps : 60,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface3D({id: "gsgl-canvas", width: 640, height: 480}),
		// Creating the basic shapes
		scaleUp : true,
		scale : 1,
		angle : 0,

		x : 100,
		y : 100,

		constructor : function(params) {
			var _this = this;
			this.logger.log("Creating application");

			GSGL.WIDTH = 640;
			GSGL.HEIGHT = 480;

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
			$shaderManager.createProgram("data/2d.fshader", "data/2d.vshader", "default");
			$shaderManager.useProgram("default");
			$renderManager.initRenderer();

			$textureManager.addTexture("img/tiles.png", "tiles");

			this.font = new GSGL.gl.font.Font({src: "font/default.xml"});
			//this.particleTexture = new GSGL.gl.texture.Texture({src: "img/alpha_particle.png"});


			//this.sprite = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles = [];
			this.tiles[0] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles", hasColor: true});
			this.tiles[0].setUVPixels(256, 256, 0, 0, 32, 32);
			this.tiles[1] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles", hasColor: false});
			this.tiles[1].setUVPixels(256, 256, 32, 0, 32, 32);
			this.tiles[2] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[2].setUVPixels(256, 256, 64, 0, 32, 32);
			this.tiles[3] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[3].setUVPixels(256, 256, 96, 0, 32, 32);
			this.tiles[4] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[4].setUVPixels(256, 256, 128, 0, 32, 32);
			this.tiles[5] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[5].setUVPixels(256, 256, 160, 0, 32, 32);
			this.tiles[6] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[6].setUVPixels(256, 256, 192, 0, 32, 32);
			this.tiles[7] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: "tiles"});
			this.tiles[7].setUVPixels(256, 256, 224, 0, 32, 32);

			this.start();
		},

		step : function() {
			this.loop();
		},

		start : function() {
			var _this = this;
			if($resources.isLoaded()) {
				/*
				this.timerId = window.setInterval(function() {
					_this.loop();
				}, (1000/_this.targetFps));
				*/
				this.step();
			} else {
				window.setTimeout(function() {
					_this.start();
				}, 100)
			}
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
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.tiles[0].render(100, 100);
			this.tiles[1].render(164, 100);
			this.tiles[2].render(100, 164);
			this.tiles[3].render(164, 164);
			this.tiles[4].render(100, 228);
			this.tiles[5].render(164, 228);
			this.tiles[6].render(228, 100);
			this.tiles[6].render(228, 164);
			this.tiles[6].render(228, 228);

			this.tiles[0].render(100+228, 100);
			this.tiles[1].render(164+228, 100);
			this.tiles[2].render(100+228, 164);
			this.tiles[3].render(164+228, 164);
			this.tiles[4].render(100+228, 228);
			this.tiles[5].render(164+228, 228);
			this.tiles[6].render(228+228, 100);
			this.tiles[6].render(228+228, 164);
			this.tiles[6].render(228+228, 228);

			this.font.drawString("Testing some string action!", 100, 400);

			$renderManager.render();
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});