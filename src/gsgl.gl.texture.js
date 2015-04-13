GSGL.gl.texture = {
	Texture : function(params) {
		var texture = {
			id : 0,
			image : new Image(),
			logger : new GSGL.utility.Logger('image'),
			width : 0,
			height : 0,
			texture : null,
			isLoaded : false,
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
			},

			loadedHandler : function(event) {
				this.isLoaded = true
				this.width = this.image.width;
				this.height = this.image.height;

				$resources.setLoaded(this.id);

				this.init();
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