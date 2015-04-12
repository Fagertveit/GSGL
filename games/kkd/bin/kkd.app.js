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
		targetFps : 60,
		lastUpdate : 0,
		fps : 30,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface2D({id: "kkd-canvas", width: 640, height: 480}),

		constructor : function(params) {
			this.logger.log("Creating application");

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$intersects = GSGL.physics.intersects;

			// We need to load an application state before we start the application
			this.setState('menu');
		},

		step : function() {
			this.update();
		},

		start : function() {
			var _this = this;
			this.timerId = window.setInterval(function(){
				_this.update();
			}, (1000/_this.targetFps));
		},

		stop : function() {
			window.clearInterval(this.timerId);
		},

		update : function() {
			var now = new Date().getTime();
			var delta = now - this.lastDelta;
			this.lastDelta = now;

			var fpsCounter = document.getElementById("fps-counter");
			//var deltaCounter = document.getElementById("delta-counter");

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
			//deltaCounter.innerHTML = delta;

			$mouse.clearClicks();
		},

		setState : function(state) {
			var _this = this;
			if(this.timerId != 0) {
				this.stop();
			}

			switch(state) {
				case "menu":
					this.state = new KKD.state.Menu({parent: this, surface: this.surface});
					this.start();
					break;
				case "game":
					this.state = new KKD.state.Game({parent: this, surface: this.surface});
					this.start();
					break;
				case "editor":
					this.state = new KKD.state.Editor({parent: this, surface: this.surface});
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