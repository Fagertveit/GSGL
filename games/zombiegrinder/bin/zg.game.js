ZG.state.Game = function(params) {
	var game = {
		application : {},
		logger : new GSGL.utility.Logger({type: "Zombie Grinder Menu"}),
		
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
			this.background = new GSGL.gl.sprite.Sprite({width: 544, height: 544, texture: "main"});
			this.background.setUVPixels(2048, 1024, 544, 0, 544, 544);

			// Grinder Frames
			this.grinder = [];
			this.grinder[0] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[0].setUVPixels(2048, 1024, 512, 544, 16, 32);
			this.grinder[1] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[1].setUVPixels(2048, 1024, 528, 544, 16, 32);
			this.grinder[2] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[2].setUVPixels(2048, 1024, 544, 544, 16, 32);
			this.grinder[3] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[3].setUVPixels(2048, 1024, 560, 544, 16, 32);

			this.masher = [];
			this.masher[3] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[3].setUVPixels(2048, 1024, 512, 576, 352, 32);
			this.masher[2] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[2].setUVPixels(2048, 1024, 512, 608, 352, 32);
			this.masher[1] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[1].setUVPixels(2048, 1024, 512, 640, 352, 32);
			this.masher[0] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[0].setUVPixels(2048, 1024, 512, 672, 352, 32);

			this.mashersAnim = [];

			var i = 0;
			var len = 16;

			for(i; i < len; i += 1) {
				this.mashersAnim[i] = new GSGL.gl.sprite.AnimatedSprite({
					frames: [
						this.masher[0],
						this.masher[1],
						this.masher[2],
						this.masher[3],
					],
					loop: false,
					frameTime: 100,
				});
			}

			this.grinderAnim = [];
			this.grinderAnim[0] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
					this.grinder[3],
				],
				loop: true,
				frameTime: 300,
			});
			this.grinderAnim[1] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[2],
					this.grinder[1],
					this.grinder[0],
					this.grinder[3],
				],
				loop: true,
				frameTime: 200,
			});
			this.grinderAnim[2] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[3],
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
				],
				loop: true,
				frameTime: 500,
			});
			this.grinderAnim[3] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[3],
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
				],
				loop: true,
				frameTime: 100,
			});
			// Grinder Animation
		},

		update : function(delta) {
			this.grinderAnim[0].update(delta);
			this.grinderAnim[1].update(delta);
			this.grinderAnim[2].update(delta);
			this.grinderAnim[3].update(delta);
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.background.render(0, 0);
			var i = 0;
			var len = 16;
			var y = 0;

			for(i; i < len; i += 1) {
				this.mashersAnim[i].update(delta);
				this.mashersAnim[i].render(16, y);
				y += 32;
			}
			
			this.renderGrinders();
			
			$renderManager.render();
		},

		renderMashers : function(delta) {
			var i = 0;
			var len = 16;
			var y = 0;

			for(i; i < len; i += 1) {
				this.mashersAnim[i].update(delta);
				this.mashersAnim[i].render(16, y);
				y += 32;
			}
		},

		renderGrinders : function() {
			this.grinderAnim[0].render(32, 512);
			this.grinderAnim[1].render(48, 512);
			this.grinderAnim[2].render(64, 512);
			this.grinderAnim[3].render(80, 512);
			this.grinderAnim[2].render(96, 512);
			this.grinderAnim[0].render(112, 512);
			this.grinderAnim[1].render(128, 512);
			this.grinderAnim[2].render(144, 512);
			this.grinderAnim[3].render(160, 512);
			this.grinderAnim[2].render(176, 512);
			this.grinderAnim[0].render(192, 512);
			this.grinderAnim[1].render(208, 512);
			this.grinderAnim[2].render(224, 512);
			this.grinderAnim[3].render(240, 512);
			this.grinderAnim[2].render(256, 512);
			this.grinderAnim[0].render(272, 512);
			this.grinderAnim[1].render(288, 512);
			this.grinderAnim[2].render(304, 512);
			this.grinderAnim[3].render(320, 512);
			this.grinderAnim[2].render(336, 512);
		},

		renderMashers : function() {

		},
	};
	game.constructor(params);

	return game;
}