/*
 * A custom renderer for the Zombie Grinder game,
 * We want to render the actual game as a FBO and then apply a gritty filter on it
 * to get that grindhouse feel of the game.	
 */

ZG.render = {
	ZombieRenderer : function(params) {
		var zombieRenderer = {
			FBOTexture : {},
			FBOWidth : 1024,
			FBOHeight : 1024,
			FBO : {},
			// Shader vars
			sepiaValue : 0.6,
			noiseValue : 0.2,
			scratchValue : 0.3,
			innerVignetting : 1.0,
			outerVignetting : 1.4,
			randomValue : 0.0,
			timeLapse : 0.0,
			// Shader locations
			sepiaLoc : {},
			noiseLoc : {},
			scratchLoc : {},
			innerVignetteLoc : {},
			outerVignetteLoc : {},
			randomLoc : {},
			timeLoc : {},
			positionLoc : {},
			texCoordLoc : {},
			resolutionLoc : {},
			// Clean locations
			c_positionLoc : {},
			c_texCoordLoc : {},
			c_resolutionLoc : {},
			c_noColorLoc : {},
			c_noTextureLoc : {},
			c_colorLoc : {},
			c_imageLoc : {},
			// Buffer objects
			vertexBuffer : {},
			indicesBuffer : {},
			texCoordBuffer : {},

			constructor : function(params) {
				this.sprite = new GSGL.gl.sprite.Sprite({width: 544, height: 544});
				this.sprite.setUV(0, 0, 1, 1);

				this.initRenderer();
				this.initClean();
				this.initFBO();
			},

			initRenderer : function() {
				var program = $shaderManager.getProgram("vintage");

				this.sepiaLoc = gl.getUniformLocation(program, 'u_sepia');
				this.noiseLoc = gl.getUniformLocation(program, 'u_noise');
				this.scratchLoc = gl.getUniformLocation(program, 'u_scratch');
				this.innerVignetteLoc = gl.getUniformLocation(program, 'u_innerVignette');
				this.outerVignetteLoc = gl.getUniformLocation(program, 'u_outerVignette');
				this.randomLoc = gl.getUniformLocation(program, 'u_random');
				this.timeLoc = gl.getUniformLocation(program, 'u_timeLapse');
				this.positionLoc = gl.getUniformLocation(program, 'u_position');
				this.texCoordLoc = gl.getUniformLocation(program, 'u_texCoord');
				this.resolutionLoc = gl.getUniformLocation(program, 'u_resolution');

				this.vertexBuffer = gl.createBuffer();
				this.indicesBuffer = gl.createBuffer();
				this.texCoordBuffer = gl.createBuffer();
			},

			initClean : function() {
				var program = $shaderManager.getProgram("default");

				this.c_positionLoc = gl.getUniformLocation(program, 'u_position');
				this.c_texCoordLoc = gl.getUniformLocation(program, 'u_texCoord');
				this.c_resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
				this.c_imageLoc = gl.getUniformLocation(program, 'u_image');
				this.c_colorLoc = gl.getUniformLocation(program, 'u_color');
				this.c_noColorLoc = gl.getUniformLocation(program, 'no_color');
				this.c_noTextureLoc = gl.getUniformLocation(program, 'no_texture');
			},

			update : function(delta) {
				this.timeLaps += delta;
				this.randomValue = Math.random();
			},

			renderFilter : function() {
				$shaderManager.useProgram("vintage");
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);
				gl.uniform1f(this.sepiaLoc, this.sepiaValue);
				gl.uniform1f(this.noiseLoc, this.noiseValue);
				gl.uniform1f(this.scratchLoc, this.scratchValue);
				gl.uniform1f(this.innerVignetteLoc, this.innerVignetting);
				gl.uniform1f(this.outerVignetteLoc, this.outerVignetting);
				gl.uniform1f(this.randomLoc, this.randomValue);
				gl.uniform1f(this.timeLoc, this.timeLapse);

				//gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);
				gl.uniform2f(this.c_resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				for(key in $renderManager.renderCalls) {
					if($renderManager.renderCalls[key].hasTexture) {
						gl.uniform1i($renderManager.noTextureLoc, 0);
						gl.bindTexture(gl.TEXTURE_2D, $renderManager.renderCalls[key].texture);
					} else {
						gl.uniform1i($renderManager.noTextureLoc, 1);
					}

					if($renderManager.renderCalls[key].hasColor) {
						gl.uniform1i($renderManager.noColorLoc, 0);
						gl.uniform4f($renderManager.colorLoc, $renderManager.renderCalls[key].color[0], $renderManager.renderCalls[key].color[1], $renderManager.renderCalls[key].color[2], $renderManager.renderCalls[key].color[3]); 
					} else {
						gl.uniform1i($renderManager.noColorLoc, 1);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, $renderManager.vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($renderManager.renderCalls[key].vertices), gl.STATIC_DRAW);
					gl.enableVertexAttribArray($renderManager.positionLoc);
					gl.vertexAttribPointer($renderManager.positionLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ARRAY_BUFFER, $renderManager.texCoordBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($renderManager.renderCalls[key].uvs), gl.STATIC_DRAW);
					gl.enableVertexAttribArray($renderManager.texCoordLoc);
					gl.vertexAttribPointer($renderManager.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, $renderManager.indicesBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array($renderManager.renderCalls[key].indices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, $renderManager.renderCalls[key].numIndices, gl.UNSIGNED_SHORT, 0);
				}
			},

			renderClean : function() {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.uniform2f(this.c_resolutionLoc, 1, 1);

				var renderCall = {
					vertices : [0, 0,
					            512, 0,
					            0, 512,
					            512, 512],
					uvs : [0.0, 0.0,
					       1.0, 0.0,
					       0.0, 1.0,
					       1.0, 1.0],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				gl.uniform1i(this.c_noTextureLoc, 0);
				gl.bindTexture(gl.TEXTURE_2D, this.FBO.texture);

				gl.uniform1i(this.c_noColorLoc, 1);
				gl.uniform4f(this.c_colorLoc, 1.0, 1.0, 1.0, 1.0); 

				gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.vertices), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.c_positionLoc);
				gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

				gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderCall.uvs), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.c_texCoordLoc);
				gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indices), gl.STATIC_DRAW);
				
				gl.drawElements(gl.TRIANGLES, renderCall.numIndices, gl.UNSIGNED_SHORT, 0);
			},

			renderC : function() {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				//gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);
				gl.uniform2f(this.c_resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				for(key in $renderManager.renderCalls) {
					if($renderManager.renderCalls[key].hasTexture) {
						gl.uniform1i($renderManager.noTextureLoc, 0);
						gl.bindTexture(gl.TEXTURE_2D, $renderManager.renderCalls[key].texture);
					} else {
						gl.uniform1i($renderManager.noTextureLoc, 1);
					}

					if($renderManager.renderCalls[key].hasColor) {
						gl.uniform1i($renderManager.noColorLoc, 0);
						gl.uniform4f($renderManager.colorLoc, $renderManager.renderCalls[key].color[0], $renderManager.renderCalls[key].color[1], $renderManager.renderCalls[key].color[2], $renderManager.renderCalls[key].color[3]); 
					} else {
						gl.uniform1i($renderManager.noColorLoc, 1);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, $renderManager.vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($renderManager.renderCalls[key].vertices), gl.STATIC_DRAW);
					gl.enableVertexAttribArray($renderManager.positionLoc);
					gl.vertexAttribPointer($renderManager.positionLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ARRAY_BUFFER, $renderManager.texCoordBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($renderManager.renderCalls[key].uvs), gl.STATIC_DRAW);
					gl.enableVertexAttribArray($renderManager.texCoordLoc);
					gl.vertexAttribPointer($renderManager.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, $renderManager.indicesBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array($renderManager.renderCalls[key].indices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, $renderManager.renderCalls[key].numIndices, gl.UNSIGNED_SHORT, 0);
				}
			},

			initFBO : function() {
				var texture, depthBuffer;
				this.FBO = gl.createFramebuffer();

				if(!this.FBO) {
					console.log("Failed to create FBO");
				}

				texture = gl.createTexture();
				if(!texture) {
					console.log("Failed to create texture");
				}

				//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.FBOWidth, this.FBOHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				this.FBO.texture = texture;

				depthBuffer = gl.createRenderbuffer();
				if(!depthBuffer) {
					console.log("Failed to create renderbuffer");
				}

				gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.FBOWidth, this.FBOHeight);

				gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

				var err = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if (gl.FRAMEBUFFER_COMPLETE !== err) {
					console.log('Frame buffer object is incomplete: ' + e.toString());
					return error();
				}

				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				gl.bindTexture(gl.TEXTURE_2D, null);
				gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			},
		};
		zombieRenderer.constructor(params);

		return zombieRenderer;
	},
	
}