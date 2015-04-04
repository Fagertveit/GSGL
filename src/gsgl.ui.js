GSGL.ui = {
	Button : function(params) {
		var button = {
			shape : {},
			title : "Button",
			states : {
				"inactive" : {
					background: new GSGL.graphics.Color({r: 255, g: 255, b: 255}),
					color: new GSGL.graphics.Color({r: 0, g: 0, b: 0}),
					border: new GSGL.graphics.Color({r: 0, g: 0, b: 0})
				},
				"hover" : {
					background: new GSGL.graphics.Color({r: 200, g: 200, b: 200}),
					color: new GSGL.graphics.Color({r: 0, g: 0, b: 0}),
					border: new GSGL.graphics.Color({r: 255, g: 0, b: 0})
				}
			},
			currentState : "inactive",
			callback : {},
			hover: false,


			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function() {
				var point = new GSGL.geometry.Point($mouse.X, $mouse.Y);

				this.hover = $intersects(point, this.shape);

				if(this.hover) {
					this.currentState = "hover";
					if($mouse.CLICK[0]) {
						if(typeof(this.callback) == 'function') {
							this.callback();
						}
					}
				} else {
					this.currentState = "inactive";
				}
			},

			render : function() {
				$g.save();

				$g.font = "14px Helvetica";
				$g.textAlign = "center";
				$g.textBaseline = "middle";
				$g.fillStyle = this.states[this.currentState].background.getHex();
				$g.strokeStyle = this.states[this.currentState].border.getHex();
				$g.strokeRect(this.shape.getX(), this.shape.getY(), this.shape.getWidth(), this.shape.getHeight());
				$g.fillRect(this.shape.getX(), this.shape.getY(), this.shape.getWidth(), this.shape.getHeight());
				$g.fillStyle = this.states[this.currentState].color.getHex();
				$g.fillText(this.title, this.shape.getX() + this.shape.getWidth() / 2, this.shape.getY() + this.shape.getHeight() / 2);
				
				$g.restore();
			},
		};
		button.constructor(params);

		return button;
	},

	Radio : function(params) {
		var radio = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		radio.constructor(params);

		return radio;
	},

	Checkbox : function(params) {
		var checkbox = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		checkbox.constructor(params);

		return checkbox;
	},
};