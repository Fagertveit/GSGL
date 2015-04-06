/* Game
 * * * *
 * This is the main state of Kvite Krist Defense, this is where the game happens and where we place units to defend the forest from
 * those icky bicky christians.
 *
 * The game has a couple of main states that we need to figure out, these are:
 * * * * * * *
 * * neutral 
 * * * * * * *
 * Everything just runs along, the christians appear at specific times that is specified in the crusader object.
 * The menu only shows the units btns and the pause and next wave buttons.
 * You can click on your own units and enemy units to switch state.
 * * * * *
 * * add 
 * * * * * 
 * The player has selected a unit that he can add by placing it in a valid spot on the map.
 * You cannot click on your own units or enemy units in this state, either you place your unit and return to neutral state
 * or you click on the cancel button to return without placing a unit.
 * * * * * *
 * * unit 
 * * * * * *
 * The player has selected a unit, he will see if he can upgrade the unit somehow, or sell it for a reduced price.
 * Here you will get another menu than the usual unit menu, here you upgrade a specific tower. You can click on both
 * your own units, or on enemy units to switch state, you can also click on the cancel button to return to neautral state.
 * * * * * *
 * * enemy 
 * * * * * *
 * The player has selected an enemy unit, he will get additional info about the enemy in the info screen. The state goes back
 * to neutral if the enemy unit is killed or reaches the church. In this state you can click on your own units or add unit buttons.
 * * * * * *
 * * pause 
 * * * * * *
 * The player has paused the screen. here he can unpause, or give up and return to main menu.
 * A pause menu will show up and you will be unable to do anything but interact with the menu. The game will pause all it's updates
 * in this state.
 * Menu choices:
 * * * * * * * * *
 * * Restart Map
 * * Abandon Game (return to main)
 * * Back (unpause game)
 * * * * * * * *
 * * Game OVer
 * * * * * * * *
 * Well, sometimes it just have to happen, the player dies, this will bring up a version of the pause menu but without the back
 * button, so Restart Map or Main Menu is the stuff.
 *
 */
KKD.state.Game = function(params) {
	var menu = {
		parent : {},
		logger : new GSGL.utility.Logger({type: "KKD Game"}),
		surface : {},
		map : new KKD.Map({
			paths: [
				new GSGL.geometry.BSpline({
					points: [
						new GSGL.geometry.Point(170, 100),
						new GSGL.geometry.Point(400, 125),
						new GSGL.geometry.Point(450, 225),
						new GSGL.geometry.Point(300, 200),
						new GSGL.geometry.Point(200, 225),
						new GSGL.geometry.Point(225, 350),
						new GSGL.geometry.Point(400, 300),
						new GSGL.geometry.Point(400, 425),
					]
				}),
			],
			areas: [],
		}),
		player : new KKD.player.Player({name: "Glenn Fagertveit", gold: 200}),
		btns : {},
		state : "neutral", // neutral | add | unit | enemy 

		constructor : function(params) {
			for(key in params) {
				if(this[key] != undefined) {
					this[key] = params[key];
				}
			}
			this.init();
		},

		init : function() {
			var _this = this;
			// Add a cult!
			this.cult = new KKD.enemies.Cult({
				path: this.map.paths[0]
			});

			// Add some test units
			this.player.addUnit(
				new KKD.units.Unit({
					pos: new GSGL.geometry.Point(260, 270),
					dir: new GSGL.geometry.Vector2D(-0.5, 0.5)
				})
			);
			this.player.addUnit(
				new KKD.units.Unit({
					pos: new GSGL.geometry.Point(300, 80),
					dir: new GSGL.geometry.Vector2D(1.0, 0.0)
				})
			);

			// Buttons
			this.buttons = {
				pause : new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 440),
						width: 150,
						height: 30
					}),
					title: "Pause",
					callback: function() {
						_this.pause();
					}
				}),
				nextWave : new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 400),
						width: 150,
						height: 30
					}),
					title: "Next Wave!",
					callback: function() {
						_this.triggerNextWave();
					}
				}),
				cancel : new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(114, 346),
						width: 46,
						height: 46
					}),
					title: "X",
					callback: function() {
						_this.cancelSelection();
					}
				})
			};

			// Units buttons
			this.unitsButtons = [
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 200),
						width: 46,
						height: 46
					}),
					title: "FT",
					callback: function() {
						_this.selectUnit("foresttroll");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(62, 200),
						width: 46,
						height: 46
					}),
					title: "MT",
					callback: function() {
						_this.selectUnit("mountaintroll");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(114, 200),
						width: 46,
						height: 46
					}),
					title: "V",
					callback: function() {
						_this.selectUnit("vaetir");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 254),
						width: 46,
						height: 46
					}),
					title: "H",
					callback: function() {
						_this.selectUnit("huldra");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(62, 254),
						width: 46,
						height: 46
					}),
					title: "T",
					callback: function() {
						_this.selectUnit("tompte");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(114, 254),
						width: 46,
						height: 46
					}),
					title: "S",
					callback: function() {
						_this.selectUnit("svartalvir");
					}
				}),
			];

			// Unit buttons
			this.unitButtons = [
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 200),
						width: 46,
						height: 46
					}),
					title: "D",
					callback: function() {
						_this.upgradeUnit("damage");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(62, 200),
						width: 46,
						height: 46
					}),
					title: "R",
					callback: function() {
						_this.upgradeUnit("range");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(114, 200),
						width: 46,
						height: 46
					}),
					title: "S",
					callback: function() {
						_this.upgradeUnit("speed");
					}
				}),
				new GSGL.ui.Button({
					shape : new GSGL.geometry.Rectangle({
						pos : new GSGL.geometry.Point(10, 254),
						width: 150,
						height: 46
					}),
					title: "$ $ $",
					callback: function() {
						_this.sellUnit();
					}
				}),
			];
		},

		update : function(delta) {
			if(this.state != "pause") {
				// Update Crusade
				this.cult.update(delta);
				// Update Player
				this.player.update(delta);

				// Let's see if any of the christians collide with any of the towers!
				this.checkProximity();

				// Now let's check if any christan has reached the church grounds
				this.checkChurchgoers();

				this.buttons.nextWave.update(delta);
				this.buttons.pause.update(delta);
			}

			// Update states
			switch(this.state) {
				case "neutral":
					// Update unit btns
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].update(delta);
					}

					break;
				case "add":
					// Update unit btns
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].update(delta);
					}

					this.buttons.cancel.update(delta);
					break;
				case "unit":
					var i = 0;
					var len = this.unitButtons.length;

					for(i; i < len; i += 1) {
						this.unitButtons[i].update(delta);
					}
					this.buttons.cancel.update(delta);
					break;
				case "enemy":
					// Update unit btns
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitButtons[i].update(delta);
					}

					break;
				case "pause":
					break;
			}


		},

		render : function(delta) {
			this.surface.clear("#ffffff");
			$g = this.surface.getContext();

			// Map cliping
			$g.save();

			$g.beginPath();
			$g.moveTo(170, 10);
			$g.lineTo(630, 10);
			$g.lineTo(630, 470);
			$g.lineTo(170, 470);
			$g.closePath();

			$g.clip();

			this.map.render(delta);
			this.cult.render(delta);
			this.player.render(delta);

			$g.restore();
			// Map frame
			$g.strokeRect(170, 10, 460, 460);

			// Current gold
			$g.strokeRect(10, 10, 70, 20);
			$g.fillText("Gold: " + this.player.gold, 15, 24);
			// Current Life
			$g.strokeRect(90, 10, 70, 20);
			$g.fillText("Life: " + this.player.health, 95, 24);

			// Info screen
			$g.strokeRect(10, 40, 150, 150);
			//$g.fillText("Info", 15, 54);

			// Render Buttons
			this.buttons.pause.render(delta);
			this.buttons.nextWave.render(delta);

			// Render unit btns
			switch(this.state) {
				case "neutral":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}
					break;
				case "add":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}

					this.renderUnitInfo();

					this.btns.cancel.render(delta);
					break;
				case "unit":
					var i = 0;
					var len = this.unitButtons.length;

					for(i; i < len; i += 1) {
						this.unitButtons[i].render(delta);
					}

					this.renderActiveUnitInfo();

					this.btns.cancel.render(delta);
					break;
				case "enemy":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}

					this.renderEnemyInfo();
					break;
				case "pause":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}


					break;
			}

			this.collision = false;
		},

		renderUnitInfo : function() {

		},

		renderActiveUnitInfo : function() {

		},

		renderEnemyInfo : function() {

		},

		checkProximity : function() {
			var i = 0;
			var len = this.player.units.length;

			for(i; i < len; i += 1) {
				this.rangeCollision(this.player.units[i]);
			}
		},

		checkChurchgoers : function() {
			var christians = this.cult.members;
			i = 0;
			len = christians.length;

			for(i; i < len; i += 1) {
				if(christians[i].lifetime >= 1) {
					this.cult.removeMember(i);
					this.player.damage(1);

					if(this.player.isDead()) {
						console.log("Game Over Man!");
					}
				}
			}
		},

		rangeCollision : function(unit) {
			var christians = this.cult.members;

			var len = christians.length;
			var i = 0;

			for(i; i < len; i += 1) {
				if($intersects(christians[i].shape, unit.radius)) {
					// Get directional vector
					var v0 = new GSGL.geometry.Vector2D(christians[i].pos.x, christians[i].pos.y);
					var v1 = new GSGL.geometry.Vector2D(unit.pos.x, unit.pos.y);

					unit.dir = v0.subtract(v1).normalize();

					if(unit.canAttack()) {
						christians[i].damage(unit.attack());
						if(christians[i].isDead()) {
							this.player.getGold(christians[i].value);
							this.cult.removeMember(i);
						}
					}

					break;
				}
			}
		},

		pause : function() {
			console.log("Pause Game");
		},

		selectUnit : function(unit) {
			console.log("Selecting " + unit);
		},

		selectActiveUnit : function(unit) {

		},

		selectEnemy : function(enemy) {

		},

		upgradeUnit : function(upgrade) {

		},

		triggerNextWave : function() {

		},
	};
	menu.constructor(params);

	return menu;
};