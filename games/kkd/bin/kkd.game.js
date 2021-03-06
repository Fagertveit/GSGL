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
		path : new KKD.Map({
			paths: [
				new GSGL.geometry.BSpline({
					points: [
						new GSGL.geometry.Point(173,77),
						new GSGL.geometry.Point(311,75),
						new GSGL.geometry.Point(494,73),
						new GSGL.geometry.Point(517,187),
						new GSGL.geometry.Point(379,245),
						new GSGL.geometry.Point(218,323),
						new GSGL.geometry.Point(255,430),
						new GSGL.geometry.Point(394,422),
						new GSGL.geometry.Point(515,333),
						new GSGL.geometry.Point(599,440),
					]
				}),
			],
			areas: [],
		}),
		player : new KKD.player.Player({name: "Glenn Fagertveit", gold: 200}),
		btns : {},
		state : "neutral", // neutral | add | unit | enemy
		tempUnit : {},
		activeUnit : {},
		activeEnemy : {},
		activeArea : new GSGL.geometry.Rectangle({pos: new GSGL.geometry.Point(216, 14), width: 569, height: 568}),

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
			// Load the main texture
			$textureManager.addTexture("img/ingame_tex01.png", "game");

			// Load some sprites yoh
			this.background = new GSGL.gl.sprite.Sprite({width: 800, height: 600, texture: "game"});
			this.background.setUVPixels(2048, 2048, 0, 0, 800, 600);

			this.map = new GSGL.gl.sprite.Sprite({width: 569, height: 568, texture: "game"});
			this.map.setUVPixels(2048, 2048, 832, 0, 569, 568);

			// Menu btn sprites
			this.bigBtnInactive = new GSGL.gl.sprite.Sprite({width: 128, height: 48, texture: "game"});
			this.bigBtnInactive.setUVPixels(2048, 2048, 0, 640, 128, 48);

			this.bigBtnActive = new GSGL.gl.sprite.Sprite({width: 128, height: 48, texture: "game"});
			this.bigBtnActive.setUVPixels(2048, 2048, 128, 640, 128, 48);

			this.smallBtnInactive = new GSGL.gl.sprite.Sprite({width: 48, height: 48, texture: "game"});
			this.smallBtnInactive.setUVPixels(2048, 2048, 0, 704, 48, 48);

			this.smallBtnActive = new GSGL.gl.sprite.Sprite({width: 48, height: 48, texture: "game"});
			this.smallBtnActive.setUVPixels(2048, 2048, 48, 704, 48, 48);

			this.cult = new KKD.enemies.Cult({
				path: this.path.paths[0],
				texture: "game"
			});

			// Buttons
			this.buttons = {
				pause : new GSGL.gl.ui.Button({
					callback: function() {
						_this.pause();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 480),
						width: 128,
						height: 48
					}),
					sprites: [
						this.bigBtnInactive,
						this.bigBtnActive,
						this.bigBtnActive
					],
					title: "Pause"
				}),
				nextWave : new GSGL.gl.ui.Button({
					callback: function() {
						_this.triggerNextWave();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 420),
						width: 128,
						height: 48
					}),
					sprites: [
						this.bigBtnInactive,
						this.bigBtnActive,
						this.bigBtnActive
					],
					title: "Next Wave!"
				}),
				cancel : new GSGL.gl.ui.Button({
					callback: function() {
						_this.cancelSelection();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 360),
						width: 128,
						height: 48
					}),
					sprites: [
						this.bigBtnInactive,
						this.bigBtnActive,
						this.bigBtnActive
					],
					title: "Cancel"
				}),
			};

			this.unitsButtons = [
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("foresttroll");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "FT"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("mountaintroll");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(62, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "MT"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("vaetir");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(124, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "V"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("huldra");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 300),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "H"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("tomte");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(62, 300),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "T"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.selectUnit("svartalvir");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(124, 300),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "S"
				}),
			];

			this.unitButtons = [
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.upgradeUnit("damage");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "D"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.upgradeUnit("range");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(62, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "R"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.upgradeUnit("speed");
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(124, 240),
						width: 48,
						height: 48
					}),
					sprites: [
						this.smallBtnInactive,
						this.smallBtnActive,
						this.smallBtnActive
					],
					title: "S"
				}),
				new GSGL.gl.ui.Button({
					callback: function() {
						_this.sellUnit();
					},
					shape: new GSGL.geometry.Rectangle({
						pos: new GSGL.geometry.Point(10, 300),
						width: 128,
						height: 48
					}),
					sprites: [
						this.bigBtnInactive,
						this.bigBtnActive,
						this.bigBtnActive
					],
					title: "$ $ $"
				}),
			];

			$font.setColor(0.0, 0.0, 0.0, 1.0);
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

					if($mouse.CLICK[0] && $intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), this.activeArea)) {
						console.log("Checking selection!");
						this.checkSelection(new GSGL.geometry.Point($mouse.X, $mouse.Y));
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
					this.tempUnit.pos.setPosition($mouse.X, $mouse.Y);

					if($intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), this.activeArea)) {
						if($mouse.CLICK[0]) {
							this.player.addUnit(this.tempUnit);
							this.state = "neutral";
						}
					}
					break;
				case "unit":
					var i = 0;
					var len = this.unitButtons.length;

					for(i; i < len; i += 1) {
						this.unitButtons[i].update(delta);
					}
					this.buttons.cancel.update(delta);

					if($mouse.CLICK[0] && $intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), this.activeArea)) {
						this.checkSelection(new GSGL.geometry.Point($mouse.X, $mouse.Y));
					}
					break;
				case "enemy":
					// Update unit btns
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].update(delta);
					}

					if($mouse.CLICK[0] && $intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), this.activeArea)) {
						this.checkSelection(new GSGL.geometry.Point($mouse.X, $mouse.Y));
					}
					break;
				case "pause":
					break;
			}
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.background.render(0, 0);
			this.map.render(216, 14);

			this.cult.render(delta);
			this.player.render(delta);

			this.buttons.pause.render(delta);
			this.buttons.nextWave.render(delta);

			$font.drawString("Gold: " + this.player.gold, 15, 24);
			$font.drawString("Life: " + this.player.health, 95, 24);

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

					this.buttons.cancel.render(delta);

					if($intersects(
						new GSGL.geometry.Point($mouse.X, $mouse.Y), 
						this.activeArea)) {
						this.tempUnit.render();
					}
					break;
				case "unit":
					var i = 0;
					var len = this.unitButtons.length;

					for(i; i < len; i += 1) {
						this.unitButtons[i].render(delta);
					}

					this.activeUnit.renderInfo();

					this.buttons.cancel.render(delta);
					break;
				case "enemy":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}

					this.activeEnemy.renderInfo();
					break;
				case "pause":
					var i = 0;
					var len = this.unitsButtons.length;

					for(i; i < len; i += 1) {
						this.unitsButtons[i].render(delta);
					}
					break;
			}

			$renderManager.render();
			this.collision = false;
		},

		checkSelection : function(pos) {
			// Check Player Units
			var i = 0;
			var len = this.player.units.length;

			for(i; i < len; i += 1) {
				if($intersects(pos, this.player.units[i].shape)) {
					this.selectActiveUnit(this.player.units[i]);
				}
			}

			// Check Enemy Units
			i = 0;
			len = this.cult.members.length;

			for(i; i < len; i += 1) {
				if($intersects(pos, this.cult.members[i].shape)) {
					this.selectEnemy(this.cult.members[i]);
				}
			}
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
				if(christians[i].lifetime >= 0.75) {
					if(christians[i] == this.activeEnemy) {
						this.activeEnemy = {}
						if(this.state == "enemy") {
							this.state = "neutral";
						}
					}
					this.cult.removeMember(i);
					len -= 1;
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
							if(christians[i] == this.activeEnemy) {
								this.activeEnemy = {}
								if(this.state == "enemy") {
									this.state = "neutral";
								}
							}
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
			this.state = "add";

			var obj = KKD.units.UNITS[unit];
			obj['texture'] = "game";

			this.tempUnit = new KKD.units.Unit(obj);
		},

		selectActiveUnit : function(unit) {
			this.activeUnit = unit;
			this.state = "unit";
		},

		selectEnemy : function(enemy) {
			this.activeEnemy = enemy;
			this.state = "enemy";
		},

		upgradeUnit : function(upgrade) {

		},

		triggerNextWave : function() {
			this.cult = new KKD.enemies.Cult({
				path: this.path.paths[0],
				texture: "game"
			});
		},

		cancelSelection : function() {
			this.state = "neutral";
		}
	};
	menu.constructor(params);

	return menu;
};