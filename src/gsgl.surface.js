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

	RenderManager2D : function(params) {
		var renderManager = {
			renderCalls : [],
			program : {},
			positionLoc : {},
			texCoordLoc : {},
			colorLoc : {},
			noTextureLoc : {},
			resolutionLoc : {},
			texture : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			clearCalls : function() {
				this.renderCalls.splice(0, this.renderCalls.length);
			},

			addRenderCall : function(call) {
				this.renderCalls.push(call);
			},

			render : function() {
				this.drawScene();
				this.clearCalls();
			},

			drawScene : function() {
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				this.resolutionLoc = gl.getUniformLocation(this.program, "u_resolution");
				gl.uniform2f(this.resolutionLoc, 640, 480);

				this.positionLoc = gl.getAttribLocation(this.program, "a_position");
				this.texCoordLoc = gl.getAttribLocation(this.program, "a_texCoord");
				this.colorLoc = gl.getUniformLocation(this.program, "u_color");
				this.noTextureLoc = gl.getUniformLocation(this.program, "no_texture");

				var len = this.renderCalls.length;
				var i = 0;

				for(i; i < len; i += 1) {
					gl.uniform1i(this.noTextureLoc, 0);
					gl.bindTexture(gl.TEXTURE_2D, this.renderCalls[i].texture);
					
					var vertexBuffer = gl.createBuffer();

					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[i].vertices), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.positionLoc);
					gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);
					
					
					var texCoordBuffer = gl.createBuffer();

					gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[i].uvs), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.texCoordLoc);
					gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
					
					var indicesBuffer = gl.createBuffer();

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.renderCalls[i].indices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, this.renderCalls[i].numIndices, gl.UNSIGNED_SHORT, 0);
					
					gl.disableVertexAttribArray(this.positionLoc);
					gl.disableVertexAttribArray(this.texCoordLoc);
				}
				/*
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			GSGL.gl.resolutionLoc = gl.getUniformLocation(this.shaderManager.program, "u_resolution");
			gl.uniform2f(GSGL.gl.resolutionLoc, 640, 480);

			GSGL.gl.positionLoc = gl.getAttribLocation(this.shaderManager.program, "a_position");
			GSGL.gl.texCoordLoc = gl.getAttribLocation(this.shaderManager.program, "a_texCoord");
			GSGL.gl.colorLoc = gl.getUniformLocation(this.shaderManager.program, "u_color");
			GSGL.gl.noTextureLoc = gl.getUniformLocation(this.shaderManager.program, "no_texture");

			gl.uniform1i(GSGL.gl.noTextureLoc, 0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
			
			var vertexBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.vertices), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(GSGL.gl.positionLoc);
			gl.vertexAttribPointer(GSGL.gl.positionLoc, 2, gl.FLOAT, false, 0, 0);
			
			
			var texCoordBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.uvs), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(GSGL.gl.texCoordLoc);
			gl.vertexAttribPointer(GSGL.gl.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
			
			var indicesBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indices), gl.STATIC_DRAW);
			
			gl.drawElements(gl.TRIANGLES, renderCall.numIndices, gl.UNSIGNED_SHORT, 0);
			
			gl.disableVertexAttribArray(GSGL.gl.positionLoc);
			gl.disableVertexAttribArray(GSGL.gl.texCoordLoc);
			*/
			},
		};
		renderManager.constructor(params);

		return renderManager;
	},
};