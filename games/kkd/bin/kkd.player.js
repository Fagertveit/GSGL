KKD.player = {
	Player : function(params) {
		var player = {
			name : "John Doe",
			gold : 100,
			units : [],
			health : 10,
			
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addUnit : function(unit) {
				this.units.push(unit);
			},

			damage : function(damage) {
				this.health -= damage;
			},

			getGold : function(gold) {
				this.gold += gold;
			},

			isDead : function() {
				return this.health <= 0;
			},

			update : function(delta) {
				var i = 0;
				var len = this.units.length;

				for(i; i < len; i += 1) {
					this.units[i].update(delta);
				}
			},

			render : function(delta) {
				var i = 0;
				var len = this.units.length;

				for(i; i < len; i += 1) {
					this.units[i].render(delta);
				}
			},
		};
		player.constructor(params);

		return player;
	},
}