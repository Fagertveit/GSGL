GSGL.gl.particle = {
	Particle : function(params) {
		var particle = {
			pos : {
				x : 0,
				y : 0,
			},
			vel : {
				x : 0.1,
				y : -0.1,
			},
			angle : 0,
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
				//this.vel.y += (gravity * delta);
				//this.vel.x += (wind * delta);
				this.pos.x += (this.vel.x);
				this.pos.y += (this.vel.y);
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

	ParticleEmitter : function(params) {
		var particleEmitter = {
			particles : [],
			sprite : {},
			pos : {
				x : 0,
				y : 0,
			},
			vel : {
				max : {
					x : 0.8,
					y : -3,
				},
				min : {
					x : -0.8,
					y : -5,
				},
			},
			startSize : {
				min : 0.5,
				max : 3.0
			},
			growth : 4,
			color : {},
			angleVel : 0,
			gravitation : 0,
			wind : 0,
			life : 1000,
			particlesPerSecond : 150,
			timeTillNext : 0,

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				this.timeTillNext -= delta;

				if(this.timeTillNext < 0) {
					this.addParticle();
					this.timeTillNext = Math.ceil(1000 / this.particlesPerSecond);
				}

				var i = 0;
				var len = this.particles.length;

				for(i; i < len; i += 1) {
					this.particles[i].update(this.gravitation, this.wind, this.growth, delta);

					if(this.particles[i].isDead()) {
						this.particles.splice(i, 1);
						len -= 1;
					}
				}
			},

			addParticle : function() {
				var particle = new GSGL.gl.particle.Particle({
					pos : {x : this.pos.x, y : this.pos.y},
					vel : {x : this.randomMinMax(this.vel.min.x, this.vel.max.x), y : this.randomMinMax(this.vel.min.y, this.vel.max.y)},
					angle : 0,
					angleVel : this.angleVel,
					size : this.randomMinMax(this.startSize.min, this.startSize.max),
					startLife : this.life,
					life : this.life,
					alpha : 1.0,
				});

				this.particles.push(particle);
			},

			randomMinMax : function(min, max) {
				return (Math.random() * (max - min)) + min;
			},

			render : function(delta) {
				
				var i = 0;
				var len = this.particles.length;

				for(i; i < len; i += 1) {
					this.sprite.render(this.particles[i].pos.x, this.particles[i].pos.y);
				}
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

			update : function(delta) {
				var i = 0;
				var len = this.emitters.length;

				for(i; i < len; i += 1) {
					this.emitters[i].update(delta);
				}
			},

			render : function(delta) {
				var i = 0;
				var len = 0;

				for(i; i < len; i += 1) {
					this.emitters[i].render(delta);
				}
			}
		};
		particleSystem.constructor(params);

		return particleSystem;
	},
}