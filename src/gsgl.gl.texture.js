GSGL.gl.texture = {
	/* GL TextureManager
	 * * * * * * * * * * *
	 * Global - $texture
	 * The Texture Manager keeps track of all the active textures used in the application, it stores the webGL textures and
	 * deletes it when not needed anylonger. Sprites use the texture manager to assign textures to specific sprites.
	 */
	TextureManager : function(params) {
		var textureManager = {
			textures : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addTexture : function(src, id) {
				this.textures[id] = new GSGL.gl.texture.Texture({src: src});
			},

			removeTexture : function(id) {
				gl.deleteTexture(this.texture[id].texture);
			},

			getTexture : function(id) {
				return this.textures[id].texture;
			},
		};
		textureManager.constructor(params);

		return textureManager;
	},

	Texture : function(params) {
		var texture = {
			id : 0,
			image : new Image(),
			logger : new GSGL.utility.Logger('image'),
			width : 0,
			height : 0,
			texture : null,
			isLoaded : false,
			isReady : false,
			onLoaded : {},
			src : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				if(this.src != "") {
					this.load(this.src);
				}
			},

			load : function(src) {
				this.texture = gl.createTexture();
				this.id = $resources.addResource("image");
				this.addEventListeners();
				this.image.src = src;
			},

			init : function() {
				gl.bindTexture(gl.TEXTURE_2D, this.texture);

				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

				gl.bindTexture(gl.TEXTURE_2D, null);

				this.isReady = true;
			},

			loadedHandler : function(event) {
				this.isLoaded = true
				this.width = this.image.width;
				this.height = this.image.height;

				$resources.setLoaded(this.id);

				this.init();

				if(typeof(this.onLoaded) == "function") {
					this.onLoaded();
				}	
			},

			errorHandler : function(event) {
				this.logger.log("Failed to load image " + this.image.src);
			},

			addEventListeners : function() {
				var _this = this;

				this.image.addEventListener("load", function(event) {
					_this.loadedHandler(event);
				}, true);

				this.image.addEventListener("error", function(event) {
					_this.errorHandler(event);
				}, true);
			},
		};
		texture.constructor(params);

		return texture;
	},
};