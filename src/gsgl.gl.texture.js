GSGL.gl.texture = {
	Texture : function(params) {
		var texture = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		texture.constructor(params);

		return texture;
	},
};