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
			//this.shaderManager = new GSGL.gl.shader.ShaderManager({});
			//this.shaderManager.initShaders("data/2d.fshader", "data/2d.vshader");
			//$renderManager = new GSGL.gl.render.RenderManager2D({program: this.shaderManager.program});

			this.texture = new GSGL.gl.texture.Texture({src: "img/tiles.png"});
			this.font = new GSGL.gl.font.Font({src: "font/default.xml"});
			this.particleTexture = new GSGL.gl.texture.Texture({src: "img/alpha_particle.png"});

			particleProgram = new GSGL.gl.shader.ShaderManager({});
			particleProgram.initShaders("data/2dParticle.fshader", "data/2dParticle.vshader");

			this.particleEmitter = new GSGL.gl.particle.ParticleEmitter({
				texture: this.particleTexture.texture,
				program: particleProgram.program,
				pos: {x: 320, y: 360},
			});

			this.particleEmitter2 = new GSGL.gl.particle.ParticleEmitter({
				texture: this.particleTexture.texture,
				program: particleProgram.program,
				color: [1.0, 0.8, 0.0, 1.0],
				pos: {x: 320, y: 360},
				life: 800,
				startSize : {
					min : 4.0,
					max : 8.0
				},
				blendSrc: gl.SRC_ALPHA,
				blendTarget: gl.ONE,
			});

			this.particleEmitter3 = new GSGL.gl.particle.ParticleEmitter({
				texture: this.particleTexture.texture,
				program: particleProgram.program,
				color: [0.2, 0.2, 0.2, 1.0],
				pos: {x: 320, y: 360},
				life: 1500,
				startSize : {
					min : 16.0,
					max : 22.0
				},
				blendSrc: gl.SRC_ALPHA,
				blendTarget: gl.ONE_MINUS_SRC_ALPHA,
			});

			//this.sprite = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles = [];
			this.tiles[0] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture, hasColor: true});
			this.tiles[0].setUVPixels(256, 256, 0, 0, 32, 32);
			this.tiles[1] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture, hasColor: false});
			this.tiles[1].setUVPixels(256, 256, 32, 0, 32, 32);
			this.tiles[2] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[2].setUVPixels(256, 256, 64, 0, 32, 32);
			this.tiles[3] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[3].setUVPixels(256, 256, 96, 0, 32, 32);
			this.tiles[4] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[4].setUVPixels(256, 256, 128, 0, 32, 32);
			this.tiles[5] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[5].setUVPixels(256, 256, 160, 0, 32, 32);
			this.tiles[6] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[6].setUVPixels(256, 256, 192, 0, 32, 32);
			this.tiles[7] = new GSGL.gl.sprite.Sprite({width: 64, height: 64, texture: _this.texture.texture});
			this.tiles[7].setUVPixels(256, 256, 224, 0, 32, 32);

			this.start();
		},

		step : function() {
			this.loop();
		},

		start : function() {
			var _this = this;
			if($resources.isLoaded()) {
				this.timerId = window.setInterval(function() {
					_this.loop();
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
			if(this.scale > 4) {
				this.scaleUp = false;
			} else if(this.scale < 0.2) {
				this.scaleUp = true;
			}

			if(this.scaleUp) {
				this.scale += 0.01;
			} else {
				this.scale -= 0.01;
			}

			this.angle += 5;
			if(this.angle >= 360) {
				this.angle = 0;
			}

			this.particleEmitter.update(delta);
			this.particleEmitter2.update(delta);
			this.particleEmitter3.update(delta);
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);
			//this.sprite.render(100, 100);

			//this.sprite.renderAngleScale(50, 50, this.angle, this.scale);
			
			//this.sprite.renderAngleScale(350, 350, this.angle, -this.scale)
			/*
			this.tiles[0].render(100, 100);
			this.tiles[1].render(164, 100);
			this.tiles[2].render(100, 164);
			this.tiles[3].render(164, 164);
			this.tiles[4].render(100, 228);
			this.tiles[5].render(164, 228);
			this.tiles[6].render(228, 164);
			
			this.font.drawString("Testar litet!", 100, 100);
			*/

			//this.particleSprite.renderScale(this.x, this.y, 3);

			//this.particleEmitter3.render();
			this.particleEmitter.render();
			this.particleEmitter2.render();
			//$renderManager.render();
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});