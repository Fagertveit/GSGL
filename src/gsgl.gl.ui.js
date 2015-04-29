GSGL.gl.ui = {
	Button : function(params) {
		var button = {
			states : ["INACTIVE","HOVER","ACTIVE"],
			sprites : [],
			shape : {},
			state : 0,
			callback : {},
			title : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				var point = new GSGL.geometry.Point($mouse.X, $mouse.Y);

				if($intersects(point, this.shape)) {
					this.state = 1;

					if($mouse.CLICK[0]) {
						this.state = 2
						if(typeof(this.callback) == 'function') {
							this.callback();
						}
					}

					if($mouse.MB[0]) {
						this.state = 2
					}
				} else {
					this.state = 0;
				}
			},

			render : function(delta) {
				this.sprites[this.state].render(this.shape.pos.x, this.shape.pos.y);

				if(this.title != "") {
					var oldAlign = $font.getAlign();
					$font.setAlign("center");
					var y = this.shape.pos.y + (this.shape.height / 2) - ($font.getLineHeight() / 2);

					$font.drawString(this.title, this.shape.pos.x + (this.shape.width / 2), y);
				}
			},
		};
		button.constructor(params);

		return button;
	},
};