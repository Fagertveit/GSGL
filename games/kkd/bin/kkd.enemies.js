KKD.enemies = {
	// Constants
	SPEED : [
		"slow",
		"normal",
		"fast",
		"extrafast"
	],
	TYPE : [
		"ground",
		"air"
	],
	SPEED_INCR : [
		0.00001,
		0.00003,
		0.00006,
		0.00009,
	],
	ENEMIES : {
		"monk": {
			name: "Monk",
			health: 10,
			speed: 0,
			type: 0,
			value: 5,
			lifetime: 0.2,
		},
		"priest" : {
			name : "Priest",
			health : 15,
			speed : 1,
			type : 0,
			value : 7,
			lifetime : 0.2
		},
		"cardinal" : {
			name : "Cardinal",
			health : 20,
			speed : 1,
			type : 0,
			value : 7,
			lifetime : 0.2
		},
		"angel" : {
			name : "Angel",
			health : 40,
			speed : 2,
			type : 1,
			value : 15,
			lifetime : 0.2
		},
		"archangel" : {
			name : "Arch Angel",
			health : 100,
			speed : 3,
			type : 1,
			value : 40,
			lifetime : 0.2
		}
	},
	/* Class Christian
	 * * * * * * * * * *
	 * The Christian is a horrible person that wants to install the churchbell into the newly built churchtower
	 * We need to stop this.
	 * The christian is composed of a set of parameters that will set the difficulty on stopping it.
	 */
	Christian : function(params) {
		var christian = {
			name: "Monk",
			health: 10,
			maxHealth: 10,
			speed: 0,
			type: 0,
			value: 5,
			lifetime : 0.20,
			lastPos : {},
			pos : new GSGL.geometry.Point(),
			dir :{},
			shape : {},
			path : {},
			sprite : {},
			texture : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.maxHealth = this.health;
				this.sprite = new GSGL.gl.sprite.Sprite({width: this.shape.radius * 2, height: this.shape.radius * 2, texture: this.texture, color: [0.8, 0.0, 0.0, 0.8], hasColor: true});
				this.sprite.setUVPixels(2048, 2048, 0, 768, 256, 256);
			},

			damage : function(damage) {
				this.health -= damage;
			},

			isDead : function() {
				return this.health <= 0;
			},

			update : function(delta) {
				this.lifetime += KKD.enemies.SPEED_INCR[this.speed] * delta;
				var v0 = new GSGL.geometry.Vector2D(this.pos.x, this.pos.y);
				this.pos = this.path.getPoint(this.lifetime);
				var v1 = new GSGL.geometry.Vector2D(this.pos.x, this.pos.y);
				this.dir = v1.subtract(v0).normalize();
				this.shape.setPosition(this.pos.x, this.pos.y);
			},

			render : function(delta) {
				this.sprite.render(this.pos.x - this.shape.radius, this.pos.y - this.shape.radius);
			},

			renderInfo : function(delta) {
				$font.setAlign("left");
				$font.drawString(this.name, 15, 60);
				$font.drawString("Health: " + this.health + "/" + this.maxHealth, 15, 80);
				$font.drawString("Speed: " + KKD.enemies.SPEED[this.speed], 15, 100);
				$font.drawString("Type: " + KKD.enemies.TYPE[this.type], 15, 120);
				$font.drawString("Value: " + this.value, 15, 140);
			},
		};
		christian.constructor(params);

		return christian;
	},

	/* Class Cult
	 * * * * * * *
	 * A Cult is a collection of equalminded christians that will come in a group during a crusade.
	 */
	Cult : function(params) {
		var cult = {
			members : [],
			padding : 1000,
			size : 10,
			type : "cardinal",
			lastMember : 0.0,
			path : {},
			texture : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				if(this.size > 0) {
					this.lastMember -= delta;
				}

				if(this.lastMember <= 0.0 && this.size > 0) {
					this.addMember();
					this.lastMember = this.padding;
				}

				var len = this.members.length;
				var i = 0;

				for(i; i < len; i += 1) {
					this.members[i].update(delta);
				}
			},

			render : function(delta) {
				var len = this.members.length;
				var i = 0;

				for(i; i < len; i += 1) {
					this.members[i].render(delta);
				}
			},

			addMember : function() {
				var obj = KKD.enemies.ENEMIES[this.type];
				obj.path = this.path;
				obj.shape = new GSGL.geometry.Circle({
					pos: new GSGL.geometry.Point(this.path.points[0].x, this.path.points[0].y),
					radius: 32,
				});
				obj.texture = this.texture;

				var member = new KKD.enemies.Christian(obj);

				this.members.push(member);
				this.size -= 1;
			},

			removeMember : function(member) {
				this.members.splice(member, 1);
			},
		};
		cult.constructor(params);

		return cult;
	},

	/* Class - Crusade
	 * * * * * * * * * *
	 * A Crusade is a wave of christians that are coming to install a church in the area.
	 * The crusade is composed of an array of groups that will appear at a specific time mark
	 * during the crusade.
	 */
	Crusade : function(params) {
		var crusade = {
			cults : [],
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		crusade.constructor(params);

		return crusade;
	}
};