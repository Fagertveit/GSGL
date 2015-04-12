GSGL.gl.font = {
	Font : function(params) {
		var font = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		font.constructor(params);

		return font;
	},
};