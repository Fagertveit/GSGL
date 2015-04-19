GSGL.gl.render = {
	RenderManager2D : function(params) {
		var renderManager2d = {
			renderCalls : [],
			program : {},
			positionLoc : {},
			texCoordLoc : {},
			colorLoc : {},
			noTextureLoc : {},
			noColorLoc : {},
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
				gl.useProgram(this.program);
				gl.blendFunc(gl.ONE, gl.ONE);
				//gl.blendFunc(gl.DST_COLOR, gl.DST_COLOR);

				//(GL_ZERO, GL_SRC_COLOR)GL_DST_COLOR, GL_ONE_MINUS_SRC_ALPHA

				this.resolutionLoc = gl.getUniformLocation(this.program, "u_resolution");
				gl.uniform2f(this.resolutionLoc, 640, 480);

				this.positionLoc = gl.getAttribLocation(this.program, "a_position");
				this.texCoordLoc = gl.getAttribLocation(this.program, "a_texCoord");
				this.colorLoc = gl.getUniformLocation(this.program, "u_color");
				this.noTextureLoc = gl.getUniformLocation(this.program, "no_texture");
				this.noColorLoc = gl.getUniformLocation(this.program, "no_color");

				var len = this.renderCalls.length;
				var i = 0;

				for(i; i < len; i += 1) {
					gl.uniform1i(this.noTextureLoc, 0);
					gl.bindTexture(gl.TEXTURE_2D, this.renderCalls[i].texture);

					if(this.renderCalls[i].hasColor) {
						gl.uniform1i(this.noColorLoc, 0);
						gl.uniform4f(this.colorLoc, this.renderCalls[i].color[0], this.renderCalls[i].color[1], this.renderCalls[i].color[2], this.renderCalls[i].color[3]); 
					} else {
						gl.uniform1i(this.noColorLoc, 1);
					}
					
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
			},
		};
		renderManager2d.constructor(params);

		return renderManager2d;
	}
}