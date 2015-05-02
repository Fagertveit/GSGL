GSGL.gl.shader = {
	ShaderManager : function(params) {
		var shaderManager = {
			programs : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			createProgram : function(fShader, vShader, id) {
				this.programs[id] = new GSGL.gl.shader.Program();
				this.programs[id].initShaders(fShader, vShader);
			},

			getProgram : function(id) {
				return this.programs[id].getProgram();
			},

			useProgram : function(id) {
				gl.useProgram(this.programs[id].getProgram());
			},
		};
		shaderManager.constructor(params);

		return shaderManager;
	},

	Program : function(params) {
		var program = {
			vShader : {},
			fShader : {},
			program : {},
			logger : new GSGL.utility.Logger("shader"),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			loadShader : function(type, shader) {
				var shaderScript = shader;

				if(type == GSGL.gl.VERTEX_SHADER) {
					this.vShader = this.compileShader(type, shader);
				} else {
					this.fShader = this.compileShader(type, shader);
				}
			},

			compileShader : function(type, shaderSrc) {
				var shader;

				if(type == GSGL.gl.VERTEX_SHADER) {
					shader = gl.createShader(gl.VERTEX_SHADER);
				} else if(type == GSGL.gl.FRAGMENT_SHADER) {
					shader = gl.createShader(gl.FRAGMENT_SHADER);
				} else {
					this.logger.log("No valid shader type specified");
					return 0;
				}

				gl.shaderSource(shader, shaderSrc);
				gl.compileShader(shader);

				if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					this.logger.log(gl.getShaderInfoLog(shader));
					return 0;
				} else {
					this.logger.log("Shader compiled correctly.");
					return shader;
				}
			},

			initShaders : function(fShaderSrc, vShaderSrc) {
				var _this = this;

				$ajax.load(fShaderSrc, function(data) {
					_this.loadShader(GSGL.gl.FRAGMENT_SHADER, data.responseText);
				});
				$ajax.load(vShaderSrc, function(data) {
					_this.loadShader(GSGL.gl.VERTEX_SHADER, data.responseText);
				});

				this.program = gl.createProgram();

				gl.attachShader(this.program, this.vShader);
				gl.attachShader(this.program, this.fShader);
				gl.linkProgram(this.program);

				if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
					this.logger.log("Unable to initialize the shader program.");
				} else {
					this.logger.log("Shader program initialized without error.");
					gl.useProgram(this.program);
				}
			},

			getProgram : function() {
				return this.program;
			},
		};
		program.constructor(params);

		return program;
	},
};