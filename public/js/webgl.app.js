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
			$renderManager = new GSGL.surface.RenderManager();

			this.surface.initContext();

			// We need to load an application state before we start the application
			this.shaderManager = new GSGL.gl.shader.ShaderManager({});
			this.shaderManager.initShaders("data/2d.fshader", "data/2d.vshader");

			this.texture = new GSGL.gl.texture.Texture({src: "img/desert.png"});

			console.log($renderManager);

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
			var renderCall = this.sprite.render(100, 100, true);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			GSGL.gl.resolutionLoc = gl.getUniformLocation(this.shaderManager.program, "u_resolution");
			gl.uniform2f(GSGL.gl.resolutionLoc, 640, 480);

			GSGL.gl.positionLoc = gl.getAttribLocation(this.shaderManager.program, "a_position");
			GSGL.gl.texCoordLoc = gl.getAttribLocation(this.shaderManager.program, "a_texCoord");
			GSGL.gl.colorLoc = gl.getUniformLocation(this.shaderManager.program, "u_color");
			GSGL.gl.noTextureLoc = gl.getUniformLocation(this.shaderManager.program, "no_texture");

			gl.uniform1i(GSGL.gl.noTextureLoc, 0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
			
			var vertexBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.vertices), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(GSGL.gl.positionLoc);
			gl.vertexAttribPointer(GSGL.gl.positionLoc, 2, gl.FLOAT, false, 0, 0);
			
			
			var texCoordBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.uvs), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(GSGL.gl.texCoordLoc);
			gl.vertexAttribPointer(GSGL.gl.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
			
			var indicesBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indices), gl.STATIC_DRAW);
			
			gl.drawElements(gl.TRIANGLES, renderCall.numIndices, gl.UNSIGNED_SHORT, 0);
			
			gl.disableVertexAttribArray(GSGL.gl.positionLoc);
			gl.disableVertexAttribArray(GSGL.gl.texCoordLoc);
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});