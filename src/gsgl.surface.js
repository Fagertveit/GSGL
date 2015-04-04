GSGL.surface = {
	RenderingEngine : function(params) {
		var renderingEngine = {

		};
		renderingEngine.constructor(params);

		return renderingEngine;
	},

	Surface2D : function(params) {
		var surface2d = {
			logger: new GSGL.utility.Logger({type:"2d Surface"}),
			width: 640,
			height: 360,
			pos: {
				x: 0,
				y: 0,
				z: 1,
			},
			id: "",
			canvas : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.logger.log("Created 2d Surface", this);

				this.generateCanvas();
			},

			generateCanvas : function() {
				var container = document.getElementById(GSGL.CONTAINER_ID);
				this.canvas = document.createElement("canvas");

				this.canvas.setAttribute('id', this.id);
				this.canvas.setAttribute('width', this.width);
				this.canvas.setAttribute('height', this.height);

				this.canvas.style.position = "absolute";
				this.canvas.style.top = this.pos.y;
				this.canvas.style.left = this.pos.x;
				this.canvas.style.zIndex = this.pos.z;

				container.appendChild(this.canvas);
			},

			getContext : function() {
				return this.canvas.getContext("2d");
			},

			clear : function(color) {
				var ctx = this.getContext();
				ctx.clearRect(0, 0, this.width, this.height);
				if(color != undefined) {
					ctx.save();
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, this.width, this.height);
					ctx.restore();
				}
			},

			toDataUrl : function() {
				return this.canvas.toDataUrl('image/png');
			},

			setPos : function(x, y, z) {
				this.pos.x = x;
				this.pos.y = y;
				this.pos.z = z;
			},

			setPosZ : function(z) {
				this.pos.z = z;
			}
		};
		surface2d.constructor(params);

		return surface2d;
	},

	Surface3D : function(params) {
		var surface3d = {

		};
		surface3d.constructor(params);

		return surface3d;
	},
};