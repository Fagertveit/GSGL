KKD.units = {
	// Constants
	ATTACK_TYPE : [
		"ground",
		"air",
		"universal"
	],
	ATTACK_SPEED : [
		"extraslow",
		"slow",
		"normal",
		"fast",
		"extrafast",
		"superfast"
	],
	ATTACK_SPEED_COOLDOWN : [
		1000,
		500,
		250,
		100,
		50,
		10,
	],
	UNITS : {
		"foresttroll" : {
			range : 40,
			name : "Forest Troll",
			damage : 2,
			speed : 1,
			type : 0
		},
		"mountaintroll" : {
			range : 60,
			name : "Mountain Troll",
			damage : 10,
			speed : 0,
			type : 0
		},
		"vaetir" : {
			range : 80,
			name : "Vaetir",
			damage : 5,
			speed : 4,
			type : 1,
		},
		"huldra" : {
			range : 60,
			name : "Huldra",
			damage : 5,
			speed : 2,
			type : 2
		},
		"tomte" : {
			range : 80,
			name : "Tompte",
			damage : 8,
			speed : 3,
			type : 2
		},
		"svartalvir" : {
			range : 120,
			name : "Svart Alvir",
			damage : 10,
			speed : 5,
			type : 2
		},
	},

	Unit : function(params) {
		var unit = {
			pos : new GSGL.geometry.Point(200, 50),
			dir : new GSGL.geometry.Vector2D(0.2, -0.5),
			shape : {},
			radius : {},
			name : "Forest Troll",
			damage : 2,
			range : 80,
			speed : 1,
			level : 1,
			lastAttack : 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.init();
			},

			init : function() {
				this.shape = new GSGL.geometry.Circle({
					pos: this.pos,
					radius: 10,
				});
				this.radius = new GSGL.geometry.Circle({
					pos: this.pos,
					radius: this.range,
				});

				this.dir = this.dir.normalize();
			},

			canAttack : function() {
				return this.lastAttack > KKD.units.ATTACK_SPEED_COOLDOWN[this.speed];
			},

			attack : function() {
				this.lastAttack = 0;
				return this.damage;
			},

			update : function(delta) {
				this.lastAttack += delta;
			},

			render : function(delta) {
				this.shape.render();
				this.radius.render();
				var scale = this.dir.scale(20);
				scale.renderDirection(this.pos.x, this.pos.y);
				this.dir.renderArrow(this.pos.x + scale.x, this.pos.y + scale.y);
			},
		};
		unit.constructor(params);

		return unit;
	},
};