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
			this.logger.log("Creating application");

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;
			$ajax = new GSGL.utility.Ajax({});

			this.surface.initContext();

			// We need to load an application state before we start the application
			this.shaderManager = new GSGL.gl.shader.ShaderManager({});
			this.shaderManager.initShaders("data/default.fshader", "data/default.vshader");

			this.positionLocation = gl.getAttribLocation(this.shaderManager.program, "a_position");
			this.colorLocation = gl.getAttribLocation(this.shaderManager.program, "a_color");

			this.squareVerticesBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
			  
			this.vertices = [
			    0.0,  0.8,  0.0,
			    0.8, -0.8,  0.0,
			    -0.8,  -0.8, 0.0,
			    -0.8, 0.8, 0.0
			];

			this.indices = [
				0, 1, 2, 3, 0
			];

			this.colors = [
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0
			];
			  
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

			this.start();
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
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.positionLocation);
			gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);

			var colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.colorLocation);
			gl.vertexAttribPointer(this.colorLocation, 4, gl.FLOAT, false, 0, 0);

			var indicesBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
					
  			gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});