/* GSGL - Geometry
 * - - - - - - - - - - -
 * Here we showcase and test out the geometry classes and objects.
 */



Application = function(params) {
	var application = {
		state : {},
		container : '',
		lastDelta : new Date().getTime(),
		timerId : 0,
		targetFps : 60,
		lastUpdate : 0,
		fps : 60,
		frames : 0,
		logger : new GSGL.utility.Logger({type: "Application"}),
		surface : new GSGL.surface.Surface3D({id: "gsgl-canvas", width: 380, height: 380}),
		// Creating the basic shapes
		system : {},
		activeEmitter : 0,

		constructor : function(params) {
			var _this = this;
			this.logger.log("Creating application");
			GSGL.WIDTH = 380;
			GSGL.HEIGHT = 380;

			// Let's init general Input and give them a global scope to play with
			$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID});
			$keyboard = new GSGL.event.KeyboardManager();
			// Global collision detection, takes to shapes and checks if they intersects.
			$ajax = new GSGL.utility.Ajax({});
			$resources = new GSGL.resource.ResourceManager();
			//$renderManager = new GSGL.surface.RenderManager();

			this.surface.initContext();

			this.particleTexture = new GSGL.gl.texture.Texture({src: "img/alpha_particle.png"});

			this.particleProgram = new GSGL.gl.shader.ShaderManager({});
			this.particleProgram.initShaders("data/2dParticle.fs", "data/2dParticle.vs");

			this.system = new GSGL.gl.particle.ParticleSystem({});

			this.addEmitterHandler();

			this.generateEmitterList();
			this.editEmitterHandler();


			this.addEventListeners();
			this.start();
		},

		step : function() {
			this.loop();
		},

		start : function() {
			var _this = this;
			if($resources.isLoaded()) {
				this.timerId = window.setInterval(function() {
					_this.loop();
				}, (1000/_this.targetFps));
			} else {
				window.setTimeout(function() {
					_this.start();
				}, 100)
			}
		},

		stop : function() {
			window.clearInterval(this.timerId);
		},

		loop : function() {
			var now = new Date().getTime();
			var delta = now - this.lastDelta;
			this.lastDelta = now;

			this.update(delta);
			this.render(delta);

			// Check if the user wants to render the FPS
			if(this.showFps) {
				this.renderFps();
			}

			if(now - this.lastUpdate > 1000) {
				this.fps = this.frames;
				this.frames = 0;
				this.lastUpdate = now;
			} else {
				this.frames += 1;
			}

			$mouse.clearClicks();
		},

		update : function(delta) {
			this.updateStatus();
			this.system.update(delta);
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.system.render();
		},

		updateStatus : function() {
			var fps = document.getElementById("fps-counter");
			var particles = document.getElementById("particle-count");

			fps.innerHTML = this.fps;
			particles.innerHTML = this.system.getParticleAmount();
		},

		validInt : function(val) {
			return Number(val) === val && val % 1 === 0;
		},

		validFloat : function(val) {
			return val === Number(val);
		},

		generateEmitterList : function() {
			var i = 0;
			var len = this.system.emitters.length;
			var _this = this;

			var list = document.getElementById("emitter-list");
			// Clear current list
			list.innerHTML = "";

			for(i; i < len; i += 1) {
				var item = document.createElement('li');
				var title = document.createElement('span');
				var downBtn = document.createElement('button');
				var upBtn = document.createElement('button');
				var editBtn = document.createElement('button');
				var removeBtn = document.createElement('button');

				item.appendChild(title);
				item.appendChild(downBtn);
				item.appendChild(upBtn);
				item.appendChild(editBtn);
				item.appendChild(removeBtn);

				editBtn.setAttribute("data-id", i);
				removeBtn.setAttribute("data-id", i);
				downBtn.setAttribute("data-id", i);
				upBtn.setAttribute("data-id", i);

				editBtn.addEventListener('click', function(event) {
					var emitter = parseInt(event.target.getAttribute("data-id"));

					_this.activeEmitter = emitter;
					_this.editEmitterHandler();
				});

				removeBtn.addEventListener('click', function(event) {
					var emitter = parseInt(event.target.getAttribute("data-id"));

					_this.system.removeEmitter(emitter);
					_this.activeEmitter = 0;
					_this.generateEmitterList();
					_this.editEmitterHandler();
				});

				upBtn.addEventListener('click', function(event) {
					var emitter = parseInt(event.target.getAttribute("data-id"));

					if(emitter != 0) {
						_this.system.switchEmitter(emitter, emitter - 1);
						_this.activeEmitter = emitter - 1;
						_this.generateEmitterList();
						_this.editEmitterHandler();
					}
				});

				downBtn.addEventListener('click', function(event) {
					var emitter = parseInt(event.target.getAttribute("data-id"));

					if(emitter < _this.system.emitters.length - 1) {
						_this.system.switchEmitter(emitter, emitter + 1);
						_this.activeEmitter = emitter + 1;
						_this.generateEmitterList();
						_this.editEmitterHandler();
					}
				});

				title.innerHTML = "Emitter " + i;
				downBtn.innerHTML = "Down";
				upBtn.innerHTML = "Up";
				editBtn.innerHTML = "Edit";
				removeBtn.innerHTML = "Remove";

				list.appendChild(item);
			}
		},

		addEmitterHandler : function() {
			var emitter = new GSGL.gl.particle.ParticleEmitter({
				texture: this.particleTexture.texture,
				program: this.particleProgram.program,
				pos: {x: 200, y: 350},
			});

			this.system.addEmitter(emitter);

			this.activeEmitter = this.system.emitters.length - 1;

			this.generateEmitterList();
			this.editEmitterHandler();
		},

		editEmitterHandler : function() {
			var list = document.getElementById('emitter-list');

			if(list.getElementsByClassName('active').length != 0) {
				list.getElementsByClassName('active')[0].classList.remove('active');
			}
			
			list.childNodes[this.activeEmitter].classList.add('active');

			document.getElementById('position_x').value = this.system.emitters[this.activeEmitter].pos.x;
			document.getElementById('position_y').value = this.system.emitters[this.activeEmitter].pos.y;

			document.getElementById('max_size').value = this.system.emitters[this.activeEmitter].startSize.max;
			document.getElementById('min_size').value = this.system.emitters[this.activeEmitter].startSize.min;

			document.getElementById('velocity_x_max').value = this.system.emitters[this.activeEmitter].vel.max.x;
			document.getElementById('velocity_x_min').value = this.system.emitters[this.activeEmitter].vel.min.x;
			document.getElementById('velocity_y_max').value = this.system.emitters[this.activeEmitter].vel.max.y;
			document.getElementById('velocity_y_min').value = this.system.emitters[this.activeEmitter].vel.min.y;

			document.getElementById('growth').value = this.system.emitters[this.activeEmitter].growth;

			document.getElementById('angular_velocity').value = this.system.emitters[this.activeEmitter].angularVel;

			document.getElementById('gravitation').value = this.system.emitters[this.activeEmitter].gravitation;

			document.getElementById('wind').value = this.system.emitters[this.activeEmitter].wind;

			document.getElementById('life').value = this.system.emitters[this.activeEmitter].life;

			document.getElementById('particles_per_second').value = this.system.emitters[this.activeEmitter].particlesPerSecond;

			document.getElementById('start_color_red').value = this.system.emitters[this.activeEmitter].color[0];
			document.getElementById('start_color_green').value = this.system.emitters[this.activeEmitter].color[1];
			document.getElementById('start_color_blue').value = this.system.emitters[this.activeEmitter].color[2];
			document.getElementById('start_color_alpha').value = this.system.emitters[this.activeEmitter].color[3];

			document.getElementById('end_color_red').value = this.system.emitters[this.activeEmitter].color[0];
			document.getElementById('end_color_green').value = this.system.emitters[this.activeEmitter].color[1];
			document.getElementById('end_color_blue').value = this.system.emitters[this.activeEmitter].color[2];
			document.getElementById('end_color_alpha').value = this.system.emitters[this.activeEmitter].color[3];

			document.getElementById('blend_src').value = this.system.emitters[this.activeEmitter].blendSrc;

			document.getElementById('blend_dst').value = this.system.emitters[this.activeEmitter].blendDst;
		},

		removeEmitterHandler : function() {

		},

		valPosXHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].pos.x = value;
			}
		},

		valPosYHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].pos.y = value;
			}
		},

		valSizeMaxHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].startSize.max = value;
			}
		},

		valSizeMinHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].startSize.min = value;
			}
		},

		valVelXMaxHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].vel.max.x = value;
			}
		},

		valVelXMinHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].vel.min.x = value;
			}
		},

		valVelYMaxHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].vel.max.y = value;
			}
		},

		valVelYMinHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].vel.min.y = value;
			}
		},

		valGrowthHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].growth = value;
			}
		},

		valAngularVelHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].angularVel = value;
			}
		},

		valGravitationHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].gravitation = value;
			}
		},

		valWindHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].wind = value;
			}
		},

		valLifeHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].life = value;
			}
		},

		valParticlesHandler : function(event) {
			var value = parseInt(event.target.value);

			if(this.validInt(value)) {
				this.system.emitters[this.activeEmitter].particlesPerSecond = value;
			}
		},

		valStartColorRedHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].color[0] = value;
			}
		},

		valStartColorGreenHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].color[1] = value;
			}
		},

		valStartColorBlueHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].color[2] = value;
			}
		},

		valStartColorAlphaHandler : function(event) {
			var value = parseFloat(event.target.value);

			if(this.validFloat(value)) {
				this.system.emitters[this.activeEmitter].color[3] = value;
			}
		},

		valEndColorRedHandler : function() {

		},

		valEndColorGreenHandler : function() {

		},

		valEndColorBlueHandler : function() {

		},

		valEndColorAlphaHandler : function() {

		},

		valBlendSrcHandler : function(event) {
			var value = parseInt(event.target.value);

			console.log("Value is: " + value);

			this.system.emitters[this.activeEmitter].blendSrc = value;
		},

		valBlendDstHandler : function() {
			var value = parseInt(event.target.value);

			console.log("Value is: " + value);

			this.system.emitters[this.activeEmitter].blendDst = value;
		},

		addEventListeners : function() {
			var _this = this;

			document.getElementById('add').addEventListener('click', function(event) {
				_this.addEmitterHandler();
			});

			document.getElementById('position_x').addEventListener('keyup',function(event) {
				_this.valPosXHandler(event);
			}, false);

			document.getElementById('position_y').addEventListener('keyup',function(event) {
				_this.valPosYHandler(event);
			}, false);

			document.getElementById('max_size').addEventListener('keyup',function(event) {
				_this.valSizeMaxHandler(event);
			}, false);

			document.getElementById('min_size').addEventListener('keyup',function(event) {
				_this.valSizeMinHandler(event);
			}, false);

			document.getElementById('velocity_x_max').addEventListener('keyup',function(event) {
				_this.valVelXMaxHandler(event);
			}, false);

			document.getElementById('velocity_x_min').addEventListener('keyup',function(event) {
				_this.valVelXMinHandler(event);
			}, false);

			document.getElementById('velocity_y_max').addEventListener('keyup',function(event) {
				_this.valVelYMaxHandler(event);
			}, false);

			document.getElementById('velocity_y_min').addEventListener('keyup',function(event) {
				_this.valVelYMinHandler(event);
			}, false);

			document.getElementById('growth').addEventListener('keyup',function(event) {
				_this.valGrowthHandler(event);
			}, false);

			document.getElementById('angular_velocity').addEventListener('keyup',function(event) {
				_this.valAngularVelHandler(event);
			}, false);

			document.getElementById('gravitation').addEventListener('keyup',function(event) {
				_this.valGravitationHandler(event);
			}, false);

			document.getElementById('wind').addEventListener('keyup',function(event) {
				_this.valWindHandler(event);
			}, false);

			document.getElementById('life').addEventListener('keyup',function(event) {
				_this.valLifeHandler(event);
			}, false);

			document.getElementById('particles_per_second').addEventListener('keyup',function(event) {
				_this.valParticlesHandler(event);
			}, false);

			document.getElementById('start_color_red').addEventListener('keyup',function(event) {
				_this.valStartColorRedHandler(event);
			}, false);

			document.getElementById('start_color_green').addEventListener('keyup',function(event) {
				_this.valStartColorGreenHandler(event);
			}, false);

			document.getElementById('start_color_blue').addEventListener('keyup',function(event) {
				_this.valStartColorBlueHandler(event);
			}, false);

			document.getElementById('start_color_alpha').addEventListener('keyup',function(event) {
				_this.valStartColorAlphaHandler(event);
			}, false);

			document.getElementById('end_color_red').addEventListener('keyup',function(event) {
				
			}, false);

			document.getElementById('end_color_green').addEventListener('keyup',function(event) {
				
			}, false);

			document.getElementById('end_color_blue').addEventListener('keyup',function(event) {
				
			}, false);

			document.getElementById('end_color_alpha').addEventListener('keyup',function(event) {
				
			}, false);

			document.getElementById('blend_src').addEventListener('change',function(event) {
				_this.valBlendSrcHandler(event);
			}, false);

			document.getElementById('blend_dst').addEventListener('change',function(event) {
				_this.valBlendDstHandler(event);
			}, false);
		},
	};
	application.constructor(params);

	return application;
};

var app = new Application({container: "gsgl-container"});