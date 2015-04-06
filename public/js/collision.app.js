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
		surface : new GSGL.surface.Surface2D({id: "gsgl-canvas", width: 640, height: 480}),
		// Creating the basic shapes
		shape : new GSGL.geometry.Point(100, 100),

		line : new GSGL.geometry.Line({
			p0: new GSGL.geometry.Point(225, 100),
			p1: new GSGL.geometry.Point(225, 150)
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
				new GSGL.geometry.Point(110, 100),
				new GSGL.geometry.Point(140, 100),
				new GSGL.geometry.Point(150, 130),
				new GSGL.geometry.Point(125, 150),
				new GSGL.geometry.Point(100, 130)
			]
		),
		

		constructor : function(params) {
			this.logger.log("Creating application");
			var _this = this;

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;
			this.btn = {
				point: new GSGL.ui.Button({
					title: "Point",
					callback: function() {
						_this.changeShape("point");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(25, 430),
						width: 80,
						height: 25
					})
				}),
				line: new GSGL.ui.Button({
					title: "Line",
					callback: function() {
						_this.changeShape("line");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(125, 430),
						width: 80,
						height: 25
					})
				}),
				triangle: new GSGL.ui.Button({
					title: "Triangle",
					callback: function() {
						_this.changeShape("triangle");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(225, 430),
						width: 80,
						height: 25
					})
				}),
				rectangle: new GSGL.ui.Button({
					title: "Rectangle",
					callback: function() {
						_this.changeShape("rectangle");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(325, 430),
						width: 80,
						height: 25
					})
				}),
				circle: new GSGL.ui.Button({
					title: "Circle",
					callback: function() {
						_this.changeShape("circle");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(425, 430),
						width: 80,
						height: 25
					})
				}),
				polygon: new GSGL.ui.Button({
					title: "Polygon",
					callback: function() {
						_this.changeShape("polygon");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(525, 430),
						width: 80,
						height: 25
					})
				})
			},


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
			this.btn.point.update();
			this.btn.line.update();
			this.btn.triangle.update();
			this.btn.rectangle.update();
			this.btn.circle.update();
			this.btn.polygon.update();

			this.shape.setPosition($mouse.X, $mouse.Y);

			// Checking for collisions
			this.collide = $intersects(this.circle, this.shape);
		},

		render : function(delta) {
			$g = this.surface.getContext();
			$g.fillStyle = "#ffffff";
			$g.fillRect(0, 0, 640, 480);

			$g.fillStyle = "#000000";
			this.line.render();
			this.triangle.render();
			this.rectangle.render();
			this.circle.render();
			this.polygon.render();

			this.btn.point.render();
			this.btn.line.render();
			this.btn.triangle.render();
			this.btn.rectangle.render();
			this.btn.circle.render();
			this.btn.polygon.render();

			if(this.collide) {
				$g.strokeStyle = "#ff0000";
			}

			this.shape.render();

			$g.strokeStyle = "#000000";
		},

		changeShape : function(shape) {
			switch(shape) {
				case "point":
					this.shape = new GSGL.geometry.Point($mouse.X, $mouse.Y);
					break;
				case "circle":
					this.shape = new GSGL.geometry.Circle({
						pos: new GSGL.geometry.Point($mouse.X, $mouse.Y),
						radius: 25
					});
					break;
				case "rectangle":
					this.shape = new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point($mouse.X, $mouse.Y),
						width: 25,
						height: 25
					});
					break;
				default:
			};
		}
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});