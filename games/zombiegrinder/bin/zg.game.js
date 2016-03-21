ZG.state.Game = function(params) {
	var game = {
		application : {},
		logger : new GSGL.utility.Logger({type: "Zombie Grinder Menu"}),
		levelSpeed : [2000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
		timer : 0,
		level : 0,
		score : 0,
		lines : 0,
		cleanRows : new Array(16),
		angles : [0, 90, 180, 270],
		
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

			// Background sprites
			this.background = new GSGL.gl.sprite.Sprite({width: 544, height: 544, texture: "main"});
			this.background.setUVPixels(2048, 1024, 544, 0, 544, 544);

			// Grinder Frames
			this.grinder = [];
			this.grinder[0] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[0].setUVPixels(2048, 1024, 512, 544, 16, 32);
			this.grinder[1] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[1].setUVPixels(2048, 1024, 528, 544, 16, 32);
			this.grinder[2] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[2].setUVPixels(2048, 1024, 544, 544, 16, 32);
			this.grinder[3] = new GSGL.gl.sprite.Sprite({width: 16, height: 32, texture: "main"});
			this.grinder[3].setUVPixels(2048, 1024, 560, 544, 16, 32);

			this.masher = [];
			this.masher[3] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[3].setUVPixels(2048, 1024, 512, 576, 352, 32);
			this.masher[2] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[2].setUVPixels(2048, 1024, 512, 608, 352, 32);
			this.masher[1] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[1].setUVPixels(2048, 1024, 512, 640, 352, 32);
			this.masher[0] = new GSGL.gl.sprite.Sprite({width: 352, height: 32, texture: "main"});
			this.masher[0].setUVPixels(2048, 1024, 512, 672, 352, 32);

			this.block = new Array(7);
			// J Block
			this.block[0] = new Array(4);
			this.block[0][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[0][0].setUVPixels(2048, 1024, 32, 544, 32, 32);
			this.block[0][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[0][1].setUVPixels(2048, 1024, 32, 576, 32, 32);
			this.block[0][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[0][2].setUVPixels(2048, 1024, 32, 602, 32, 32);
			this.block[0][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[0][3].setUVPixels(2048, 1024, 0, 602, 32, 32);
			// L Block
			this.block[1] = new Array(4);
			this.block[1][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[1][0].setUVPixels(2048, 1024, 64, 544, 32, 32);
			this.block[1][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[1][1].setUVPixels(2048, 1024, 64, 576, 32, 32);
			this.block[1][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[1][2].setUVPixels(2048, 1024, 64, 602, 32, 32);
			this.block[1][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[1][3].setUVPixels(2048, 1024, 96, 602, 32, 32);
			// I Block
			this.block[2] = new Array(4);
			this.block[2][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[2][0].setUVPixels(2048, 1024, 128, 544, 32, 32);
			this.block[2][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[2][1].setUVPixels(2048, 1024, 128, 576, 32, 32);
			this.block[2][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[2][2].setUVPixels(2048, 1024, 128, 602, 32, 32);
			this.block[2][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[2][3].setUVPixels(2048, 1024, 128, 634, 32, 32);
			// O Block
			this.block[3] = new Array(4);
			this.block[3][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[3][0].setUVPixels(2048, 1024, 160, 544, 32, 32);
			this.block[3][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[3][1].setUVPixels(2048, 1024, 192, 544, 32, 32);
			this.block[3][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[3][2].setUVPixels(2048, 1024, 160, 576, 32, 32);
			this.block[3][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[3][3].setUVPixels(2048, 1024, 192, 576, 32, 32);
			// S Block
			this.block[6] = new Array(4);
			this.block[6][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[6][0].setUVPixels(2048, 1024, 224, 576, 32, 32);
			this.block[6][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[6][1].setUVPixels(2048, 1024, 256, 576, 32, 32);
			this.block[6][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[6][2].setUVPixels(2048, 1024, 256, 544, 32, 32);
			this.block[6][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[6][3].setUVPixels(2048, 1024, 288, 544, 32, 32);
			// T Block
			this.block[5] = new Array(4);
			this.block[5][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[5][0].setUVPixels(2048, 1024, 320, 576, 32, 32);
			this.block[5][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[5][1].setUVPixels(2048, 1024, 352, 576, 32, 32);
			this.block[5][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[5][2].setUVPixels(2048, 1024, 384, 576, 32, 32);
			this.block[5][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[5][3].setUVPixels(2048, 1024, 352, 544, 32, 32);
			// Z Block
			this.block[4] = new Array(4);
			this.block[4][0] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[4][0].setUVPixels(2048, 1024, 416, 544, 32, 32);
			this.block[4][1] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[4][1].setUVPixels(2048, 1024, 448, 544, 32, 32);
			this.block[4][2] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[4][2].setUVPixels(2048, 1024, 448, 576, 32, 32);
			this.block[4][3] = new GSGL.gl.sprite.Sprite({width: 32, height: 32, texture: "main"});
			this.block[4][3].setUVPixels(2048, 1024, 480, 576, 32, 32);

			this.mashersAnim = [];

			var i = 0;
			var len = 16;

			for(i; i < len; i += 1) {
				this.mashersAnim[i] = new GSGL.gl.sprite.AnimatedSprite({
					frames: [
						this.masher[0],
						this.masher[1],
						this.masher[2],
						this.masher[3],
					],
					loop: false,
					frameTime: 100,
				});
			}

			this.grinderAnim = [];
			this.grinderAnim[0] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
					this.grinder[3],
				],
				loop: true,
				frameTime: 300,
			});
			this.grinderAnim[1] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[2],
					this.grinder[1],
					this.grinder[0],
					this.grinder[3],
				],
				loop: true,
				frameTime: 200,
			});
			this.grinderAnim[2] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[3],
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
				],
				loop: true,
				frameTime: 500,
			});
			this.grinderAnim[3] = new GSGL.gl.sprite.AnimatedSprite({
				frames: [
					this.grinder[3],
					this.grinder[0],
					this.grinder[1],
					this.grinder[2],
				],
				loop: true,
				frameTime: 100,
			});
			// Grinder Animation

			this.nextBlock = new ZG.blocks.Block();
			this.aliveBlock = new ZG.blocks.Block();

			this.blockManager = new ZG.blocks.BlockManager();
			this.keyManager = new GSGL.event.KeyboardManager();
			this.timer = this.levelSpeed[this.level];
		},

		update : function(delta) {
			this.handleInput(delta);
			this.timer -= delta;

			if(this.timer < 0) {
				var tempBlock = new ZG.blocks.Block();
				tempBlock.shape = this.aliveBlock.shape;
				tempBlock.pos.x = new Number(this.aliveBlock.pos.x);
				tempBlock.pos.y = new Number(this.aliveBlock.pos.y);

				if(this.blockManager.canMoveDown(tempBlock)) {
					this.aliveBlock.moveDown();
					this.score += 10;
				} else {
					this.blockManager.killBlock(this.aliveBlock);

					this.handleKill();
					this.spawnBlock();
				}

				this.timer = this.levelSpeed[this.level];
			}
		},

		spawnBlock : function() {
			this.aliveBlock = this.nextBlock;
			this.nextBlock = new ZG.blocks.Block();

			var tempBlock = new ZG.blocks.Block();
			tempBlock.shape = this.aliveBlock.shape;
			tempBlock.pos = this.aliveBlock.pos;

			if(!this.blockManager.canMoveDown(tempBlock)) {
				// Game over man!
			}
		},

		handleKill : function() {
			var rowScore = 0;
			var cleaning = false;

			for(var i = 0; i < ZG.blocks.YCELLS; i++) {
				if(this.blockManager.checkRow(i)) {
					rowScore++;
					this.lines++;
					this.cleanRows[i] = true;
					cleaning = true;
					this.mashersAnim[i].play();
				}
			}

			this.level = Math.floor(this.lines / 10);

			if(rowScore != 0) {
				switch(rowScore) {
					case 1:
						this.score += 400;
						break;
					case 2:
						this.score += 1000;
						break;
					case 3:
						this.score += 2000;
						break;
					case 4:
						this.score += 4000;
						break;
				}
			}

			if(cleaning) {
				for(var i = 0; i < ZG.blocks.YCELLS; i++) {
					if(this.cleanRows[i]) {
						this.blockManager.clearRow(i);
						this.blockManager.moveRowsAbove(i);
					}
					this.cleanRows[i] = false;
				}
			}
		},

		handleInput : function(delta) {
			var tempBlock = new ZG.blocks.Block();
			tempBlock.shape = this.aliveBlock.shape;
			tempBlock.pos.x = new Number(this.aliveBlock.pos.x);
			tempBlock.pos.y = new Number(this.aliveBlock.pos.y);

			if(this.keyManager.KEYS[GSGL.event.KEY["LEFT"]]) {
				// Handle Left key
				if(this.blockManager.canMoveLeft(tempBlock)) {
					this.aliveBlock.moveLeft();
				}
			}

			if(this.keyManager.KEYS[GSGL.event.KEY["RIGHT"]]) {
				// Handle Right key
				if(this.blockManager.canMoveRight(tempBlock)) {
					this.aliveBlock.moveRight();
				}
			}

			if(this.keyManager.KEYS[GSGL.event.KEY["UP"]]) {
				// Handle Rotate
				if(this.blockManager.canRotate(tempBlock)) {
					this.aliveBlock.rotate();
				}
			}

			if(this.keyManager.KEYS[GSGL.event.KEY["DOWN"]]) {
				// Handle Fall
				var fallRange = 0;

				do {
					fallRange++;
				} while (this.blockManager.canMoveDown(tempBlock));

				fallRange--;

				var fallScore = 10;
				for(var i = 0; i < fallRange; i++) {
					this.aliveBlock.moveDown();
					this.score += 20 + fallScore;
					fallScore += 20;
				}
			}

			// Reset all keys
			this.keyManager.clearKeys();
		},

		render : function(delta) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.BLEND);

			this.background.render(0, 0);
			
			this.renderBlocks();
			this.renderMashers(delta);
			this.renderGrinders(delta);

			$font.drawString(String(this.score), 395, 236);
			$font.drawString(String(this.level), 485, 276);
			$font.drawString(String(this.lines), 485, 318);
			
			$renderManager.render();
		},

		renderBlocks : function() {
			// Render Next Block
			for(var i = 0; i < this.nextBlock.shape.length; i++) {
				for(var j = 0; j < this.nextBlock.shape[i].length; j++) {
					if(this.nextBlock.shape[i][j] > 0) {
						this.block[this.nextBlock.getType()][this.nextBlock.shape[i][j] - 1].render(32 * i + 444, 32 * j + 96);
					}
				}
			}
			
			// Render Alive Block
			for(var i = 0; i < this.aliveBlock.shape.length; i++) {
				for(var j = 0; j < this.aliveBlock.shape[i].length; j++) {
					if(this.aliveBlock.shape[i][j] > 0) {
						this.block[this.aliveBlock.getType()][this.aliveBlock.shape[i][j] - 1].renderAngle(32 * (i + this.aliveBlock.getPosX()) + 32, 32 * (j + this.aliveBlock.getPosY()), this.angles[this.aliveBlock.getAngle()]);
					}
				}
			}

			// Render Dead blocks
			for(var i = 0; i < ZG.blocks.XCELLS; i++) {
				for(var j = 0; j < ZG.blocks.YCELLS; j++) {
					if(this.blockManager.checkTile(i, j) > 0) {
						this.block[this.blockManager.getType(i, j)][this.blockManager.checkTile(i, j) - 1].renderAngle(32 * i + 32, 32 * j, this.angles[this.blockManager.getAngle(i, j)]);
					}
				}
			}
		},

		renderMashers : function(delta) {
			var i = 0;
			var len = 16;
			var y = 0;

			for(i; i < len; i += 1) {
				this.mashersAnim[i].update(delta);
				this.mashersAnim[i].render(16, y);
				y += 32;
			}
		},

		renderGrinders : function(delta) {
			this.grinderAnim[0].update(delta);
			this.grinderAnim[1].update(delta);
			this.grinderAnim[2].update(delta);
			this.grinderAnim[3].update(delta);

			this.grinderAnim[0].render(32, 512);
			this.grinderAnim[1].render(48, 512);
			this.grinderAnim[2].render(64, 512);
			this.grinderAnim[3].render(80, 512);
			this.grinderAnim[2].render(96, 512);
			this.grinderAnim[0].render(112, 512);
			this.grinderAnim[1].render(128, 512);
			this.grinderAnim[2].render(144, 512);
			this.grinderAnim[3].render(160, 512);
			this.grinderAnim[2].render(176, 512);
			this.grinderAnim[0].render(192, 512);
			this.grinderAnim[1].render(208, 512);
			this.grinderAnim[2].render(224, 512);
			this.grinderAnim[3].render(240, 512);
			this.grinderAnim[2].render(256, 512);
			this.grinderAnim[0].render(272, 512);
			this.grinderAnim[1].render(288, 512);
			this.grinderAnim[2].render(304, 512);
			this.grinderAnim[3].render(320, 512);
			this.grinderAnim[2].render(336, 512);
		}
	};
	game.constructor(params);

	return game;
}