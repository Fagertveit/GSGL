GSGL.gl.sprite = {
	Sprite : function(params) {
		var sprite = {
			uv : [0.0, 0.0, 1.0, 1.0],
			width : 0,
			height : 0,
			texture : null,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setUV : function(x0, y0, x1, y1) {

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

				if(returnCall) {
					return renderCall;
				} else {
					$renderManager.addRenderCall(renderCall);
				}
			},
		};
		sprite.constructor(params);

		return sprite;
	},
};