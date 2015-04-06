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
		targetFps : 1,
		lastUpdate : 0,
		fps : 30,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface2D({id: "kkd-canvas", width: 640, height: 480}),
		// Creating the basic shapes
		point : new GSGL.geometry.Point(100, 100),
		vector2d : new GSGL.geometry.Vector2D(100, 150),
		line : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(200, 100),
			p1: new GSGL.geometry.Point(200, 150)
		}),
		triangle : new GSGL.geometry.Triangle({
			p0: new GSGL.geometry.Point(325, 100),
			p1: new GSGL.geometry.Point(350, 150),
			p2: new GSGL.geometry.Point(300, 150)
		}),
		rectangle : new GSGL.geometry.Rectangle({
			pos: new GSGL.geometry.Point(400, 100),
			width: 50,
			height: 50
		}),
		circle : new GSGL.geometry.Circle({
			pos: new GSGL.geometry.Point(525, 125),
			radius: 25
		}),
		polygon : new GSGL.geometry.Polygon(
			[
				new GSGL.geometry.Point(110, 200),
				new GSGL.geometry.Point(140, 200),
				new GSGL.geometry.Point(150, 230),
				new GSGL.geometry.Point(125, 250),
				new GSGL.geometry.Point(100, 230)
			]
		),

		pBorder : new GSGL.geometry.Polygon(
			[
				new GSGL.geometry.Point(220, 200),
				new GSGL.geometry.Point(280, 200),
				new GSGL.geometry.Point(300, 260),
				new GSGL.geometry.Point(250, 300),
				new GSGL.geometry.Point(200, 260)
			]
		),
		p1 : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(300, 260),
			p1: new GSGL.geometry.Point(200, 260)
		}),
		p2 : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(200, 260),
			p1: new GSGL.geometry.Point(280, 200)
		}),
		p3 : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(280, 200),
			p1: new GSGL.geometry.Point(250, 300)
		}),
		p4 : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(250, 300),
			p1: new GSGL.geometry.Point(220, 200)
		}),
		p5 : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(220, 200),
			p1: new GSGL.geometry.Point(300, 260)
		}),
		bezier : new GSGL.geometry.Bezier({
			p0: new GSGL.geometry.Vector2D(400, 200),
			p1: new GSGL.geometry.Vector2D(400, 300),
			c0: new GSGL.geometry.Vector2D(450, 250),
			c1: new GSGL.geometry.Vector2D(350, 250)
		}),
		bspline : new GSGL.geometry.BSpline({
			points: [
				new GSGL.geometry.Point(100, 350),
				new GSGL.geometry.Point(150, 420),
				new GSGL.geometry.Point(200, 320),
				new GSGL.geometry.Point(300, 450),
				new GSGL.geometry.Point(500, 250),
				new GSGL.geometry.Point(525, 275),
				new GSGL.geometry.Point(500, 350),
			]
		}),

		constructor : function(params) {
			this.logger.log("Creating application");

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;

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

		},

		render : function(delta) {
			$g = this.surface.getContext();
			$g.fillStyle = "#ffffff";
			$g.fillRect(0, 0, 640, 480);

			this.point.render();
			this.vector2d.render();
			this.line.render();
			this.triangle.render();
			this.rectangle.render();
			this.circle.render();
			this.polygon.render();
			this.bezier.renderEdit();

			this.pBorder.render();
			this.p1.render();
			this.p2.render();
			this.p3.render();
			this.p4.render();
			this.p5.render();

			this.bspline.renderEdit();
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});