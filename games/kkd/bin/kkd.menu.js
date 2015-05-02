KKD.state.Menu = function(params) {
	var menu = {
		application : {},
		logger : new GSGL.utility.Logger({type: "KKD Menu"}),
		menuBtns : {},
		aboutBtns : {},
		helpBtns : {},
		state : "main",

		constructor : function(params) {
			for(key in params) {
				if(this[key] != undefined) {
					this[key] = params[key];
				}
			}
			this.init();
		},

		init : function() {
			var _this = this;
			$font = new GSGL.gl.font.Font({src: "font/font.xml"});
			$shaderManager.createProgram("data/2d.fs", "data/2d.vs", "default");
			$shaderManager.useProgram("default");

			$renderManager.initRenderer();

			// Load the main texture
			$textureManager.addTexture("img/menu_tex01.png", "menu");

			// Load some sprites yoh
			this.background = new GSGL.gl.sprite.Sprite({width: 800, height: 600, texture: "menu"});
			this.background.setUVPixels(1024, 1024, 0, 0, 800, 600);

			// Menu btn sprites
			var startBtnInactive = new GSGL.gl.sprite.Sprite({width: 128, height: 48, texture: "menu"});
			startBtnInactive.setUVPixels(1024, 1024, 0, 640, 128, 48);

			var startBtnActive = new GSGL.gl.sprite.Sprite({width: 128, height: 48, texture: "menu"});
			startBtnActive.setUVPixels(1024, 1024, 128, 640, 128, 48);

			this.menuBtns = {
				start : new GSGL.gl.ui.Button({
					callback: function() {
						_this.startGame();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(336, 300),
						width: 128,
						height: 48
					}),
					sprites: [
						startBtnInactive,
						startBtnActive,
						startBtnActive
					],
					title: "Start"
				}),
				about : new GSGL.gl.ui.Button({
					callback: function() {
						_this.changeState("about");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(336, 364),
						width: 128,
						height: 48
					}),
					sprites: [
						startBtnInactive,
						startBtnActive,
						startBtnActive
					],
					title: "About"
				}),
				help : new GSGL.gl.ui.Button({
					callback: function() {
						_this.changeState("help");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(336, 428),
						width: 128,
						height: 48
					}),
					sprites: [
						startBtnInactive,
						startBtnActive,
						startBtnActive
					],
					title: "Help"
				})
			};

			// Create the About buttons
			this.aboutBtns = {
				back : new GSGL.gl.ui.Button({
					callback: function() {
						_this.changeState("main");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 542),
						width: 128,
						height: 48
					}),
					sprites: [
						startBtnInactive,
						startBtnActive,
						startBtnActive
					],
					title: "<- Back"
				})
			};

			// Create the Help buttons
			this.helpBtns = {
				back : new GSGL.gl.ui.Button({
					callback: function() {
						_this.changeState("main");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 542),
						width: 128,
						height: 48
					}),
					sprites: [
						startBtnInactive,
						startBtnActive,
						startBtnActive
					],
					title: "<- Back"
				})
			};
		},

		update : function(delta) {
			switch(this.state) {
				case "main":
					this.updateMain(delta);
					break;
				case "about":
					this.updateAbout(delta);
					break;
				case "help":
					this.updateHelp(delta);
					break;
				default:
					this.updateMain(delta);
			}
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			switch(this.state) {
				case "main":
					this.renderMain(delta);
					break;
				case "about":
					this.renderAbout(delta);
					break;
				case "help":
					this.renderHelp(delta);
					break;
				default:
					this.renderMain(delta);
			}

			$renderManager.render();
		},

		updateMain : function(delta) {
			this.menuBtns.start.update(delta);
			this.menuBtns.about.update();
			this.menuBtns.help.update();
		},

		renderMain : function(delta) {
			this.background.render(0, 0);

			this.menuBtns.start.render();
			this.menuBtns.about.render();
			this.menuBtns.help.render();
		},

		renderAbout : function(delta) {
			this.background.render(0, 0);

			this.aboutBtns.back.render();
		},

		updateAbout : function(delta) {
			this.aboutBtns.back.update();
		},

		renderHelp : function(delta) {
			this.background.render(0, 0);

			this.helpBtns.back.render();
		},

		updateHelp : function(delta) {
			this.helpBtns.back.update();
		},

		changeState : function(state) {
			console.log("Change state to: " + state);
			this.state = state;
		},

		startGame : function() {
			console.log("Starting Game");
			this.application.setState(KKD.state.Game);
		},

		startEditor : function() {
			console.log("Starting Editor");
			this.application.setState(KKD.state.Editor);
		},
	};
	menu.constructor(params);

	return menu;
};