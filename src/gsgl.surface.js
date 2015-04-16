GSGL.surface = {
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
			logger: new GSGL.utility.Logger({type:"3d Surface"}),
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

				this.logger.log("Created 3d Surface", this);

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

			initContext : function() {
				gl = null;
				try {
					gl = this.canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}) || this.canvas.getContext("webgl", {preserveDrawingBuffer: true});
				} catch(e) {
					this.logger.log("Doh!, Something went wrong: " + e);
					return 0;
				}

				this.logger.log("WebGL initialized successfully!");
				gl.clearColor(0.0, 0.0, 0.0, 1.0);
			},

			clear : function() {
    			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			},

			toUrl : function() {
				return this.container.toDataURL("image/png");
			},
		};
		surface3d.constructor(params);

		return surface3d;
	},
};