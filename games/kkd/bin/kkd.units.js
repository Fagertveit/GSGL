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
		750,
		500,
		400,
		300,
		200,
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
			type : 0,
			level : 1,
			lastAttack : 0,
			sprite : {},
			rangeSprite : {},
			texture : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.init();

				this.sprite = new GSGL.gl.sprite.Sprite({width: this.shape.radius * 2, height: this.shape.radius * 2, texture: this.texture, color: [0.0, 0.8, 0.0, 1.0], hasColor: true});
				this.sprite.setUVPixels(2048, 2048, 0, 768, 256, 256);

				this.rangeSprite = new GSGL.gl.sprite.Sprite({width: this.range + this.range, height: this.range + this.range, texture: this.texture, color: [0.0, 0.8, 0.0, 0.8], hasColor: true});
				this.rangeSprite.setUVPixels(2048, 2048, 0, 768, 256, 256);
			},

			init : function() {
				this.shape = new GSGL.geometry.Circle({
					pos: this.pos,
					radius: 32,
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
				this.rangeSprite.render(this.pos.x - this.range, this.pos.y - this.range);
				this.sprite.render(this.pos.x - this.shape.radius, this.pos.y - this.shape.radius);
			},

			renderInfo : function(delta) {
				$font.setAlign("left");
				$font.drawString(this.name, 15, 60);
				$font.drawString("Damage: " + this.damage, 15, 80);
				$font.drawString("Range: " + this.range, 15, 100);
				$font.drawString("Speed: " + KKD.units.ATTACK_SPEED[this.speed], 15, 120);
				$font.drawString("Attack Type: " + KKD.units.ATTACK_TYPE[this.type], 15, 140);
			},
		};
		unit.constructor(params);

		return unit;
	},
};