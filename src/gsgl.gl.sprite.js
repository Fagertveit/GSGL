GSGL.gl.sprite = {
	Sprite : function(params) {
		var sprite = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		sprite.constructor(params);

		return sprite;
	},
};