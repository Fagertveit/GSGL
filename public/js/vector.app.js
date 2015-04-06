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
		targetFps : 60,
		lastUpdate : 0,
		fps : 30,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface2D({id: "kkd-canvas", width: 640, height: 480}),
		// Creating the basic shapes
		dirVector : new GSGL.geometry.Vector2D(-0.3, 0.5),
		posVector : new GSGL.geometry.Vector2D(200, 200),

		constructor : function(params) {
			this.logger.log("Creating application");

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;

			this.scaleVector = this.dirVector.scale(30);

			// We need to load an application state before we start the application
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
			this.dirVector = this.dirVector.rotate(GSGL.utility.degreeToRadian(1));
			this.scaleVector = this.dirVector.scale(30);
		},

		render : function(delta) {
			$g = this.surface.getContext();
			$g.fillStyle = "#ffffff";
			$g.fillRect(0, 0, 640, 480);
			$g.fillStyle = "#ff0000";

			this.dirVector.renderArrow(200 + this.scaleVector.x, 200 + this.scaleVector.y);
			this.scaleVector.renderDirection(200, 200);
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});