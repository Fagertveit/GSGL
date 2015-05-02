GSGL.gl.sprite = {
	Sprite : function(params) {
		var sprite = {
			uv : [0.0, 0.0, 1.0, 1.0],
			color : [1.0, 1.0, 1.0, 1.0],
			width : 0,
			height : 0,
			texture : "",
			hasColor : false,
			zIndex : 0,
			program : "default",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setUV : function(x0, y0, x1, y1) {
				this.uv = [x0, y0, x1, y1];
			},

			setUVPixels : function(mapWidth, mapHeight, x, y, width, height) {
				this.uv = [(x / mapWidth), (y / mapHeight), ((x + width) / mapWidth), ((y + height) / mapHeight)];
			},

			setColor : function(r, g, b, a) {
				this.color = [r,g,b,a];
			},

			render : function(x, y, returnCall) {
				var renderCall = {
					texture : this.texture,
					vertices : [x, y,
					            x + this.width, y,
					            x, y + this.height,
					            x + this.width, y + this.height],
					uvs : [this.uv[0], this.uv[1],
					       this.uv[2], this.uv[1],
					       this.uv[0], this.uv[3],
					       this.uv[2], this.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				var unique = false;

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderScale : function(x, y, scale) {
				var renderCall = {
					texture : this.texture,
					vertices : [x, y,
								x + (this.width * scale), y,
								x, y + (this.height * scale),
								x + (this.width * scale), y + (this.height * scale)],
					uvs : [this.uv[0], this.uv[1],
						   this.uv[2], this.uv[1],
						   this.uv[0], this.uv[3],
						   this.uv[2], this.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderAngle : function(x, y, angle) {
				var vectors = [];
				var px, py;
				px = x + (this.width / 2);
				py = y + (this.height / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + this.width, y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + this.height);
				vectors[3] = new GSGL.geometry.Vector2D(x + this.width, y + this.height);

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : this.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [this.uv[0], this.uv[1],
						       this.uv[2], this.uv[1],
						       this.uv[0], this.uv[3],
						       this.uv[2], this.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderAngleScale : function(x, y, angle, scale) {
				var vectors = [];
				var px, py;
				px = x + ((this.width * scale) / 2);
				py = y + ((this.height * scale) / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + (this.width * scale), y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + (this.height * scale));
				vectors[3] = new GSGL.geometry.Vector2D(x + (this.width * scale), y + (this.height * scale));

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : this.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [this.uv[0], this.uv[1],
						       this.uv[2], this.uv[1],
						       this.uv[0], this.uv[3],
						       this.uv[2], this.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderSub : function(x, y, subX, subY, subWidth, subHeight, returnCall) {
				var suv = [];
				suv[0] = parseFloat(subX) / parseFloat(this.width);
				suv[1] = parseFloat(subY) / parseFloat(this.height);
				suv[2] = parseFloat(subX + subWidth) / parseFloat(this.width);
				suv[3] = parseFloat(subY + subHeight) / parseFloat(this.height);

				var renderCall = {
						texture : this.texture,
						vertices : [x, y,
						            x + subWidth, y,
						            x, y + subHeight,
						            x + subWidth, y + subHeight],
						uvs : [suv[0], suv[1],
						       suv[2], suv[1],
						       suv[0], suv[3],
						       suv[2], suv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},
		};
		sprite.constructor(params);

		return sprite;
	},
};