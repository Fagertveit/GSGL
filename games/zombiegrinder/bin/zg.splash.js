ZG.state.Splash = function(params) {
	var splash = {
		application : {},
		logger : new GSGL.utility.Logger({type: "Zombie Grinder Menu"}),
		percent : 0,

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
			
			$shaderManager.createProgram("data/2d.fs", "data/2d.vs", "default");
			$shaderManager.useProgram("default");

			$renderManager.initRenderer();

			// Load the main texture
			$textureManager.addTexture("img/loading.png", "splash");

			this.splash = new GSGL.gl.sprite.Sprite({width: 512, height: 288, texture: "splash"});
			this.splash.setUVPixels(512, 512, 0, 0, 512, 288);

			this.loading = new GSGL.gl.sprite.Sprite({width: 448, height: 96, texture: "splash"});
			this.loading.setUVPixels(512, 512, 32, 288, 448, 96);

			this.chainBack = new GSGL.gl.sprite.Sprite({width: 256, height: 64, texture: "splash"});
			this.chainBack.setUVPixels(512, 512, 0, 384, 256, 64);

			this.chainMiddle = new GSGL.gl.sprite.Sprite({width: 256, height: 64, texture: "splash"});
			this.chainMiddle.setUVPixels(512, 512, 256, 384, 256, 64);

			this.chainFront = new GSGL.gl.sprite.Sprite({width: 256, height: 64, texture: "splash"});
			this.chainFront.setUVPixels(512, 512, 0, 448, 256, 64);

			$textureManager.addTexture("img/texture.png", "main");
		},

		update : function(delta) {
			this.percent = $resources.checkProgress().percent;

			if(this.percent >= 100) {
				this.application.setState(ZG.state.Menu);
			}

			this.setLoadSprite(this.percent);
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.splash.render(16, 196);
			this.loading.render(48, 32);

			this.chainBack.render(128, 316);
			this.chainMiddle.render(128, 316);

			$renderManager.render();
		},

		setLoadSprite : function(percent) {
			var pixels = 256 * (percent/100);

			this.chainMiddle.width = pixels;
			this.chainMiddle.setUVPixels(512, 512, 256, 384, pixels, 64);
		},
	};
	splash.constructor(params);

	return splash;
};