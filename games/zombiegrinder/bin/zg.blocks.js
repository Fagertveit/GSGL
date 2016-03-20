ZG.blocks = {
	BLUEPRINT : {
		"T" : [
			[0, 4, 0],
			[1, 2, 3],
			[0, 0, 0]
		],
		"O" : [
			[1, 2],
			[3, 4],
		],
		"I" : [
			[0, 1, 0, 0],
			[0, 2, 0, 0],
			[0, 3, 0, 0],
			[0, 4, 0, 0],
		],
		"S" : [
			[0, 3, 4],
			[1, 2, 0],
			[0, 0, 0],
		],
		"Z" : [
			[1, 2, 0],
			[0, 3, 4],
			[0, 0, 0],
		],
		"L" : [
			[0, 1, 0],
			[0, 2, 0],
			[0, 3, 4],
		],
		"J" : [
			[0, 1, 0],
			[0, 2, 0],
			[4, 3, 0],
		]
	},

	BLOCK : ["J", "L", "I", "O", "S", "T", "Z"],

	XCELLS : 10,
	YCELLS : 16,

	BLOCK_ID : 0,

	BlockManager : function(params) {
		var blockManager = {
			cells : new Array(ZG.blocks.XCELLS),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.init();
			},

			init : function() {
				for(var i = 0; i < ZG.blocks.XCELLS; i++) {
					this.cells[i] = new Array(ZG.blocks.YCELLS);
				}

				for(var i = 0; i < ZG.blocks.XCELLS; i++) {
					for(var j = 0; j < ZG.blocks.YCELLS; j++) {
						this.cells[i][j] = new Array(3);
						this.cells[i][j][0] = 0;
						this.cells[i][j][1] = 0;
						this.cells[i][j][2] = 0;
					}
				}
			},

			checkTile : function(x, y) {
				return this.cells[x][y][0];
			},

			getType : function(x, y) {
				return this.cells[x][y][1];
			},

			getAngle : function(x, y) {
				return this.cells[x][y][2];
			},

			setTile : function(x, y, t, a, ty) {
				this.cells[x][y][0] = t;
				this.cells[x][y][1] = ty;
				this.cells[x][y][2] = a;
			},

			checkRow : function(row) {
				for(var i = 0; i < ZG.blocks.XCELLS; i++) {
					if(this.cells[i][row][0] === 0) {
						return false;
					}
				}
				return true;
			},

			clearRow : function(row) {
				for(var i = 0; i < ZG.blocks.XCELLS; i++) {
					this.cells[i][row][0] = 0;
					this.cells[i][row][1] = 0;
					this.cells[i][row][2] = 0;
				}
			},

			moveRowsAbove : function(row) {
				var r = row;

				for(var i = 0; i < ZG.blocks.XCELLS; i++) {
					for(; r > 0; r--) {
						this.cells[i][r][0] = this.cells[i][r-1][0];
						this.cells[i][r][1] = this.cells[i][r-1][1];
						this.cells[i][r][2] = this.cells[i][r-1][2];
						this.cells[i][r-1][0] = 0;
						this.cells[i][r-1][1] = 0;
						this.cells[i][r-1][2] = 0;
					}
					r = row;
				}
			},

			killBlock : function(block) {
				for(var i = 0; i < block.shape.length; i++) {
					for(var j = 0; j < block.shape[i].length; j++) {
						if(block.shape[i][j] > 0) {
							this.setTile(i + block.pos.x, j + block.pos.y, block.shape[i][j], block.angle, block.type);
						}
					}
				}
			},

			canMoveLeft : function(block) {
				block.moveLeft();

				for(var i = 0; i < block.shape.length; i++) {
					for(var j = 0; j < block.shape[i].length; j++) {
						if(block.shape[i][j] > 0) {
							if(i + block.pos.x < 0) {
								return false;
							}

							if(this.cells[i + block.pos.x][j + block.pos.y][0] > 0) {
								return false;
							}
						}
					}
				}

				return true;
			},

			canMoveRight : function(block) {
				block.moveRight();

				for(var i = 0; i < block.shape.length; i++) {
					for(var j = 0; j < block.shape[i].length; j++) {
						if(block.shape[i][j] > 0) {
							if(i + block.pos.x > 9) {
								return false;
							}

							if(this.cells[i + block.pos.x][j + block.pos.y][0] > 0) {
								return false;
							}
						}
					}
				}
				
				return true;
			},

			canMoveDown : function(block) {
				block.moveLeft();

				for(var i = 0; i < block.shape.length; i++) {
					for(var j = 0; j < block.shape[i].length; j++) {
						if(block.shape[i][j] > 0) {
							if(j + block.pos.y > 15) {
								return false;
							}

							if(this.cells[i + block.pos.x][j + block.pos.y][0] > 0) {
								return false;
							}
						}
					}
				}
				
				return true;
			},

			canRotate : function(block) {
				block.rotate();

				for(var i = 0; i < block.shape.length; i++) {
					for(var j = 0; j < block.shape[i].length; j++) {
						if(block.shape[i][j] > 0) {
							if(i + block.pos.x > 9 || i + block.pos.x < 0 || j + block.pos.y > 15) {
								return false;
							}

							if(this.cells[i + block.pos.x][j + block.pos.y][0] > 0) {
								return false;
							}
						}
					}
				}
				
				return true;
			}
		};
		blockManager.constructor(params);

		return blockManager;
	},

	Block : function(params) {
		var block = {
			id : ZG.blocks.BLOCK_ID,
			pos : {
				x : 4,
				y : 0
			},
			angle : 0,
			alive : true,
			type : 0,
			shape : [],

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.type = Math.floor(Math.random() * 7);
				this.shape = ZG.blocks.BLUEPRINT[ZG.blocks.BLOCK[this.type]];
				ZG.blocks.BLOCK_ID++;
			},

			getType : function() {
				return this.type;
			},

			getPosX : function() {
				return this.pos.x;
			},

			getPosY : function() {
				return this.pos.y;
			},

			moveDown : function() {
				this.pos.y += 1;
			},

			moveUp : function() {
				this.pos.y -= 1;
			},

			moveLeft : function() {
				this.pos.x -= 1;
			},

			moveRight : function() {
				this.pos.x += 1;
			},

			rotate : function() {
				var x = block.shape.length;
				var y = 0;
				var tempShape = new Array(x);

				for(var i = 0; i < x; i++) {
					tempShape[i] = new Array(x);
				}

				for(var i = 0; i < this.shape.length; i++) {
					for(var j = 0; j < this.shape[i].length; j++) {
						tempShape[i][j] = this.shape[x-1][y];
						x -= 1;
					}
					y += 1;
					x = this.shape.length;
				}

				this.shape = tempShape;

				if(this.angle != 0) {
					this.angle -= 1;
				} else {
					this.angle += 1;
				}
			}
		};
		block.constructor(params);

		return block;
	},
}