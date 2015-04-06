KKD.state.Menu = function(params) {
	var menu = {
		parent : {},
		logger : new GSGL.utility.Logger({type: "KKD Menu"}),
		surface : {},
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

			// Create the menu buttons
			this.menuBtns = {
				start : new GSGL.ui.Button({
					title: "Start Game",
					callback: function(){
						_this.startGame();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 150),
						width: 200,
						height: 30
					}),
				}),
				editor : new GSGL.ui.Button({
					title: "Editor",
					callback: function() {
						_this.startEditor();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 200),
						width: 200,
						height: 30
					}),
				}),
				about : new GSGL.ui.Button({
					title: "About",
					callback: function() {
						_this.changeState("about");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 250),
						width: 200,
						height: 30
					}),
				}),
				help : new GSGL.ui.Button({
					title: "Help",
					callback: function() {
						_this.changeState("help");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 300),
						width: 200,
						height: 30
					}),
				}),
			};

			// Create the About buttons
			this.aboutBtns = {
				back : new GSGL.ui.Button({
					title: "Back to main",
					callback: function() {
						_this.changeState("main");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 430),
						width: 200,
						height: 30
					}),
				}),
			};

			// Create the Help buttons
			this.helpBtns = {
				back : new GSGL.ui.Button({
					title: "Back to main",
					callback: function() {
						_this.changeState("main");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(220, 430),
						width: 200,
						height: 30
					}),
				}),
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
			this.surface.clear("#ffffff");
			$g = this.surface.getContext();

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
		},

		renderMain : function(delta) {
			$g.save();
			$g.font = "48px Helvetica";
			$g.textAlign = "center";
			$g.fillText("Kvite Krist Defense", 320 , 50);
			$g.restore();

			this.menuBtns.start.render();
			this.menuBtns.editor.render();
			this.menuBtns.about.render();
			this.menuBtns.help.render();
		},

		updateMain : function(delta) {
			this.menuBtns.start.update();
			this.menuBtns.editor.update();
			this.menuBtns.about.update();
			this.menuBtns.help.update();
		},

		renderAbout : function(delta) {
			$g.save();
			$g.font = "48px Helvetica";
			$g.textAlign = "center";
			$g.fillText("About", 320 , 50);
			$g.restore();

			this.aboutBtns.back.render();
		},

		updateAbout : function(delta) {
			this.aboutBtns.back.update();
		},

		renderHelp : function(delta) {
			$g.save();
			$g.font = "48px Helvetica";
			$g.textAlign = "center";
			$g.fillText("Help", 320 , 50);
			$g.restore();

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
			this.parent.setState("game");
		},

		startEditor : function() {
			console.log("Starting Editor");
			this.parent.setState("editor");
		},
	};
	menu.constructor(params);

	return menu;
};