/* WebGL Renderer
 * * * * * * * * * * *
 * We need to render things in the right order with the right texture and shader program and blending.
 * We need to push things into batches as often as we can, so we need to identify a global routine for rendering
 * everything in the rendering loop. Let's try to push the particle batch into this as well.
 * These are the things we need to setup each batch
 * * Z-Order
 * * Texture
 * * Shader Program
 * * Blender
 * Let's figure out how to sort rendercalls in a natural and optimized way:
 * * Z-Index
 * * * Program
 * * * * Texture
 * * * * Blendning
 */
var Renderer2D = {
	Renderer : function(params) {
		var renderer = {
			uid : 0,
			renderCalls : {},
			// Shader Attributes
			positionLoc : {},
			texCoordLoc : {},
			// Shader Uniforms
			colorLoc : {},
			noTextureLoc : {},
			noColorLoc : {},
			resolutionLoc : {},
			// Buffer objects
			vertexBuffer : {},
			indicesBuffer : {},
			texCoordBuffer : {},
			
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			initRenderer : function() {
				var program = $shaderManager.getProgram("renderer2d");

				this.resolutionLoc = gl.getUniformLocation(program, "u_resolution");
				this.positionLoc = gl.getAttribLocation(program, "a_position");
				this.texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
				this.colorLoc = gl.getUniformLocation(program, "u_color");
				this.noTextureLoc = gl.getUniformLocation(program, "no_texture");
				this.noColorLoc = gl.getUniformLocation(program, "no_color");

				this.vertexBuffer = gl.createBuffer();
				this.indicesBuffer = gl.createBuffer();
				this.texCoordBuffer = gl.createBuffer();
			},

			clearCalls : function() {
				this.renderCalls = {};
			},

			addToCall : function(texture, renderCall) {
				var id = texture;
				if(renderCall.hasColor) {
					id += ";r" + renderCall.color[0] + ";g" + renderCall.color[1] + ";b" + renderCall.color[2] + ";a" + renderCall.color[3];
				} 

				if(this.renderCalls[id] == undefined) {
					this.renderCalls[id] = new Renderer2D.RenderCall({
						texture: texture,
						zIndex: zIndex
					});
				}

				this.renderCalls[id].add(renderCall);
			},

			render : function(entity, x, y, color) {
				var renderCall = {
					texture : entity.texture,
					vertices : [x, y,
					            x + entity.width, y,
					            x, y + entity.height,
					            x + entity.width, y + entity.height],
					uvs : [entity.uv[0], entity.uv[1],
					       entity.uv[2], entity.uv[1],
					       entity.uv[0], entity.uv[3],
					       entity.uv[2], entity.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				if(color) {
					renderCall.hasColor = true;
					renderCall.color = color;
				}

				this.addToCall(entity.texture, renderCall);
			},

			renderScale : function(entity, x, y, scale, color) {
				var renderCall = {
					texture : entity.texture,
					vertices : [x, y,
								x + (entity.width * scale), y,
								x, y + (entity.height * scale),
								x + (entity.width * scale), y + (entity.height * scale)],
					uvs : [entity.uv[0], entity.uv[1],
						   entity.uv[2], entity.uv[1],
						   entity.uv[0], entity.uv[3],
						   entity.uv[2], entity.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				if(color) {
					renderCall.hasColor = true;
					renderCall.color = color;
				}

				this.addToCall(entity.texture, renderCall);
			},

			renderAngle : function(entity, x, y, angle, color) {
				var vectors = [];
				var px, py;
				px = x + (entity.width / 2);
				py = y + (entity.height / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + entity.width, y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + entity.height);
				vectors[3] = new GSGL.geometry.Vector2D(x + entity.width, y + entity.height);

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : entity.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [entity.uv[0], entity.uv[1],
						       entity.uv[2], entity.uv[1],
						       entity.uv[0], entity.uv[3],
						       entity.uv[2], entity.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(color) {
					renderCall.hasColor = true;
					renderCall.color = color;
				}

				this.addToCall(entity.texture, renderCall);
			},

			renderAngleScale : function(entity, x, y, angle, scale, color) {
				var vectors = [];
				var px, py;
				px = x + ((entity.width * scale) / 2);
				py = y + ((entity.height * scale) / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + (entity.width * scale), y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + (entity.height * scale));
				vectors[3] = new GSGL.geometry.Vector2D(x + (entity.width * scale), y + (entity.height * scale));

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : entity.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [entity.uv[0], entity.uv[1],
						       entity.uv[2], entity.uv[1],
						       entity.uv[0], entity.uv[3],
						       entity.uv[2], entity.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(color) {
					renderCall.hasColor = true;
					renderCall.color = color;
				}

				this.addToCall(entity.texture, renderCall);
			},

			renderSub : function(entity, x, y, subX, subY, subWidth, subHeight, color) {
				var suv = [];
				suv[0] = parseFloat(subX) / parseFloat(entity.width);
				suv[1] = parseFloat(subY) / parseFloat(entity.height);
				suv[2] = parseFloat(subX + subWidth) / parseFloat(entity.width);
				suv[3] = parseFloat(subY + subHeight) / parseFloat(entity.height);

				var renderCall = {
						texture : entity.texture,
						vertices : [x, y,
						            x + subWidth, y,
						            x, y + subHeight,
						            x + subWidth, y + subHeight],
						uvs : [suv[0], suv[1],
						       suv[2], suv[1],
						       suv[0], suv[3],
						       suv[2], suv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(color) {
					renderCall.hasColor = true;
					renderCall.color = color;
				}

				this.addToCall(entity.texture, renderCall);
			},

			execute : function() {
				this.flush();
				this.clearCalls();
			},

			flush : function() {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				for(key in this.renderCalls) {
					if(this.renderCalls[key].hasTexture) {
						gl.uniform1i(this.noTextureLoc, 0);
						gl.bindTexture(gl.TEXTURE_2D, $textureManager.getTexture(this.renderCalls[key].texture));
					} else {
						gl.uniform1i(this.noTextureLoc, 1);
					}

					if(this.renderCalls[key].hasColor) {
						gl.uniform1i(this.noColorLoc, 0);
						gl.uniform4f(this.colorLoc, this.renderCalls[key].color[0], this.renderCalls[key].color[1], this.renderCalls[key].color[2], this.renderCalls[key].color[3]); 
					} else {
						gl.uniform1i(this.noColorLoc, 1);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[key].vertices), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.positionLoc);
					gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[key].uvs), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.texCoordLoc);
					gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.renderCalls[key].indices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, this.renderCalls[key].numIndices, gl.UNSIGNED_SHORT, 0);
				}
			},
		};
		renderer.constructor(params);

		return renderer;
	},

	/* RenderCall
	 * * * * * * * *
	 * A RenderCall is a collection of renderable objects that uses the same general resources, thus being able to 
	 * push these through the GPU at the same time. The rendercalls are divided using the following parameters:
	 * * Z-Index
	 * * Shader
	 * * Texture
	 * * Blend Mode
	 * The rendercall contains the following information:
	 * * Texture
	 * * Program
	 * * Blend Mode
	 * * Vertices
	 * * Vertex Indices
	 * * UV coords
	 */
	RenderCall : function(params) {
		var renderCall = {
			vertices: [],
			indices: [],
			uvs: [],
			index: 0,
			numIndices: 0,
			texture: {},
			program: {},
			zIndex: 0,
			color: [0.0, 0.0, 0.0, 1.0],
			hasColor: false,
			hasTexture: true,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			add : function(renderCall) {
				this.vertices = this.vertices.concat(renderCall.vertices);
				this.uvs = this.uvs.concat(renderCall.uvs);

				var i = 0;
				var len = renderCall.indices.length;

				for(i; i < len; i += 1) {
					this.indices.push(renderCall.indices[i] + this.index);
				}

				this.index += this.findMaxIndex(renderCall.indices);

				this.numIndices += renderCall.numIndices;

				if(renderCall.hasColor) {
					this.hasColor = true;
					this.color = renderCall.color;
				}
			},

			findMaxIndex : function(indices) {
				var i = 0;
				var len = indices.length;
				var max = 0;

				for(i; i < len; i += 1) {
					if(indices[i] > max) {
						max = indices[i];
					}
				}

				max += 1;

				return max;
			},

			flush : function() {
				this.vertices = [];
				this.indices = [];
				this.uvs = [];
				this.index = 0;
				this.numIndices = 0;
			},

			setProgram : function(program) {
				this.program = program;
			},

			setTexture : function(texture) {
				this.texture = texture;
			},

			setZIndex : function(zIndex) {
				this.zIndex = zIndex;
			}
		};
		renderCall.constructor(params);

		return renderCall;
	}
};