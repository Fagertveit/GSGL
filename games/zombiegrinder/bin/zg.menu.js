ZG.state.Menu = function(params) {
	var menu = {
		application : {},
		logger : new GSGL.utility.Logger({type: "Zombie Grinder Menu"}),
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

			// Background sprites
			this.menuBackground = new GSGL.gl.sprite.Sprite({width: 544, height: 544, texture: "main"});
			this.menuBackground.setUVPixels(2048, 1024, 1088, 0, 544, 544);

			this.titleFreeBackground = new GSGL.gl.sprite.Sprite({width: 544, height: 544, texture: "main"});
			this.titleFreeBackground.setUVPixels(2048, 1024, 0, 0, 544, 544);

			// Titles
			this.highscoreTitle = new GSGL.gl.sprite.Sprite({width: 416, height: 64, texture: "main"});
			this.highscoreTitle.setUVPixels(2048, 1024, 192, 862, 416, 64);

			this.aboutText = new GSGL.gl.sprite.Sprite({width: 512, height: 64, texture: "main"});
			this.aboutText.setUVPixels(2048, 1024, 384, 768, 512, 64);
			
			// Button Sprites
			this.startBtnActive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.startBtnActive.setUVPixels(2048, 1024, 0, 672, 192, 64);

			this.startBtnInactive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.startBtnInactive.setUVPixels(2048, 1024, 192, 672, 192, 64);

			this.highscoreBtnActive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.highscoreBtnActive.setUVPixels(2048, 1024, 0, 736, 192, 64);

			this.highscoreBtnInactive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.highscoreBtnInactive.setUVPixels(2048, 1024, 192, 736, 192, 64);

			this.aboutBtnActive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.aboutBtnActive.setUVPixels(2048, 1024, 0, 800, 192, 64);

			this.aboutBtnInactive = new GSGL.gl.sprite.Sprite({width: 192, height: 64, texture: "main"});
			this.aboutBtnInactive.setUVPixels(2048, 1024, 192, 800, 192, 64);
			
			this.startBtn = new GSGL.gl.ui.Button({
				callback: function() {
					_this.startGame();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(176, 328),
					width: 192,
					height: 64
				}),
				sprites: [
					this.startBtnInactive,
					this.startBtnActive,
					this.startBtnActive
				],
			});

			this.highscoreBtn = new GSGL.gl.ui.Button({
				callback: function() {
					_this.setState("highscore");
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(176, 392),
					width: 192,
					height: 64
				}),
				sprites: [
					this.highscoreBtnInactive,
					this.highscoreBtnActive,
					this.highscoreBtnActive
				],
			});

			this.aboutBtn = new GSGL.gl.ui.Button({
				callback: function() {
					_this.setState("about");
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(176, 456),
					width: 192,
					height: 64
				}),
				sprites: [
					this.aboutBtnInactive,
					this.aboutBtnActive,
					this.aboutBtnActive
				],
			});
		},

		update : function(delta) {

			switch(this.state) {
				case "main":
					this.startBtn.update();
					this.highscoreBtn.update();
					this.aboutBtn.update();
					break;
				case "highscore":
					if($mouse.CLICK[0]) {
						this.state = "main";
					}
					break;
				case "about":
					if($mouse.CLICK[0]) {
						this.state = "main";
					}
					break;
			}
			
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			switch(this.state) {
				case "main":
					this.menuBackground.render(0, 0);
					this.startBtn.render();
					this.highscoreBtn.render();
					this.aboutBtn.render();
					break;
				case "highscore":
					this.titleFreeBackground.render(0, 0);
					this.highscoreTitle.render(64, 32);
					break;
				case "about":
					this.menuBackground.render(0, 0);
					this.aboutText.render(16, 464);
					break;
			}
			
			$renderManager.render();
		},

		setState : function(state) {
			this.state = state;
		},

		startGame : function() {
			this.application.setState(ZG.state.Game);
		},
	};
	menu.constructor(params);

	return menu;
};