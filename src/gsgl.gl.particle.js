GSGL.gl.particle = {
	Particle : function(params) {
		var particle = {
			pos : {},
			vel : 1,
			dir : {},
			angleVel : 0,
			size : 1,
			startLife : 1000,
			life : 0,
			alpha : 1.0,

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(gravity, wind, growth, delta) {
				this.life -= delta;
				this.size += growth;
				this.dir.y += gravity;
				this.dir.x += wind;
				this.pos = this.pos.add(this.dir.scale(this.vel));
			},

			isDead : function() {
				if(this.life < 0) {
					return true;
				}

				return false;
			}
			
		};
		particle.constructor(params);

		return particle;
	},

	/* ParticleEmitter
	 * * * * * * * * * *
	 * The ParticleEmitter keeps reference to all the particles, and handles rendering of the particles.
	 * You can use different rendering blend modes on the emitter level, so a ParticleSystem can have Emitters with
	 * multiple different blend modes to get desired effects.
	 * The particle emitter has a shader program that it uses in the rendering process, this is specific for particle rendering
	 */
	ParticleEmitter : function(params) {
		var particleEmitter = {
			particles : [],
			texture : {},
			pos : {
				x : 0,
				y : 0,
			},
			dir : {
				max : {
					x : 0,
					y : 0,
				},
				min : {
					x : 0,
					y : 0,
				},
			},
			vel : {
				min : 2,
				max : 5
			},
			startSize : {
				min : 16.0,
				max : 32.0
			},
			constant : false,
			growth : 0.1,
			color : [0.9, 0.5, 0.1, 0.4],
			angularVel : 0,
			gravity : 0,
			wind : 0,
			life : {
				min : 200,
				max : 500
			},
			particlesPerSecond : 100,
			particlesAtStart : 100,
			lifeCycle : 1000,
			currLife : 0,
			shaderManager : {},
			blendSrc : gl.SRC_ALPHA,
			blendDst : gl.ONE,
			program: {},
			vertices: [],
			sizes: [],

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				// Clear last frame
				this.vertices.splice(0, this.vertices.length);
				this.sizes.splice(0, this.sizes.length);

				if(this.constant) {
					var numParticles = Math.ceil((delta / 1000) * this.particlesPerSecond);
					var i = 0;

					for(i; i < numParticles; i += 1) {
						this.addParticle();
					}
				} else {
					this.currLife -= delta;

					if(this.currLife < 0) {
						var i = 0;

						for(i; i < this.particlesAtStart; i += 1) {
							this.addParticle();
						}

						this.currLife = this.lifeCycle;
					}
				}

				i = 0;
				var len = this.particles.length;

				for(i; i < len; i += 1) {
					this.particles[i].update(this.gravity, this.wind, this.growth, delta);

					if(this.particles[i].isDead()) {
						this.particles.splice(i, 1);
						len -= 1;
					} else {
						this.vertices.push(this.particles[i].pos.x);
						this.vertices.push(this.particles[i].pos.y);
						this.sizes.push(this.particles[i].size);
					}
				}
			},

			addParticle : function() {
				var particle = new GSGL.gl.particle.Particle({
					pos : new GSGL.geometry.Vector2D(this.pos.x, this.pos.y),
					vel : this.randomMinMax(this.vel.min, this.vel.max),
					dir : new GSGL.geometry.Vector2D(this.randomMinMax(this.dir.min.x, this.dir.max.x), this.randomMinMax(this.dir.min.y, this.dir.max.y)),
					angle : 0,
					angleVel : this.angleVel,
					size : this.randomMinMax(this.startSize.min, this.startSize.max),
					startLife : this.life,
					life : this.randomMinMax(this.life.min, this.life.max),
					alpha : 1.0,
				});

				this.particles.push(particle);
			},

			randomMinMax : function(min, max) {
				return (Math.random() * (max - min)) + min;
			},

			render : function(delta) {
				gl.useProgram(this.program);
				gl.enable(gl.BLEND);
				gl.blendFunc(this.blendSrc, this.blendDst);

				this.resolutionLoc = gl.getUniformLocation(this.program, "u_resolution");
				gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				this.positionLoc = gl.getAttribLocation(this.program, "a_position");
				this.pointSizeLoc = gl.getAttribLocation(this.program, "a_pointSize");
				this.colorLoc = gl.getUniformLocation(this.program, "u_color");

				gl.bindTexture(gl.TEXTURE_2D, this.texture);

				gl.uniform4f(this.colorLoc, this.color[0], this.color[1], this.color[2], this.color[3]);
				
				var vertexBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.positionLoc);
				gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

				var sizeBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sizes), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.pointSizeLoc);
				gl.vertexAttribPointer(this.pointSizeLoc, 1, gl.FLOAT, false, 0, 0);

				gl.drawArrays(gl.POINTS, 0, this.vertices.length / 2);
				
				gl.disableVertexAttribArray(this.positionLoc);
				gl.disableVertexAttribArray(this.pointSizeLoc);
			},
		};
		particleEmitter.constructor(params);

		return particleEmitter;
	},

	ParticleSystem : function(params) {
		var particleSystem = {
			emitters : [],

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addEmitter : function(emitter) {
				this.emitters.push(emitter);
			},

			removeEmitter : function(emitter) {
				this.emitters.splice(emitter, 1);
			},

			switchEmitter : function(src, target) {
				var tempEmitter = this.emitters[target];

				this.emitters[target] = this.emitters[src];
				this.emitters[src] = tempEmitter;
			},

			getParticleAmount : function() {
				var i = 0;
				var len = this.emitters.length;
				var particles = 0;

				for(i; i < len; i += 1) {
					particles += this.emitters[i].particles.length;
				}

				return particles;
			},

			update : function(delta) {
				var i = 0;
				var len = this.emitters.length;

				for(i; i < len; i += 1) {
					this.emitters[i].update(delta);
				}
			},

			render : function(delta) {
				var i = 0;
				var len = this.emitters.length;

				for(i; i < len; i += 1) {
					this.emitters[i].render(delta);
				}
			}
		};
		particleSystem.constructor(params);

		return particleSystem;
	},
}