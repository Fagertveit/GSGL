/** 
 * Zombie Tetris javascript library
 * 
 * This is the javascript library for the game Zombie Tetris! This is going to be great fun to make, but it does
 * have a couple of hard nuts I need to crack!
 * First of I need to make the basic mechanics to work out like I want them, and after that I can start
 * polishing this bastard up and make it mucho shiny!
 * I need to make a game area at first, this will be a tilemap thing where each tile can be open or closed.
 * If a line of tiles are closed this will be cleared and give the player score!
 * there will always be a live block that will fall from the top, when the block gets stuck a new block will be spawned.
 * The block will check each tile that is before it and if it's open the block will fall one tile next round.
 * let's start with this okay?
*/

var ZT = {}; /* namespace */

ZT.game = {
	
	XCELLS : 10,
	YCELLS : 16,

	gamearea : function() {
		var gamearea = {
				
			area : new Array(ZT.game.XCELLS),
				
			init : function() {
				
				for(var i = 0; i < ZT.game.XCELLS; i++)
					gamearea.area[i] = new Array(ZT.game.YCELLS);
				
				for(var i = 0; i < ZT.game.XCELLS; i++)
				{
					for(var j = 0; j < ZT.game.YCELLS; j++)
					{
						gamearea.area[i][j] = new Array(3);
						gamearea.area[i][j][0] = 0;
						gamearea.area[i][j][1] = 0;
						gamearea.area[i][j][2] = 0;
					}
				}
			},
			
			checkTile : function(x, y) {
				return gamearea.area[x][y][0];
			},
			
			getType : function(x, y) {
				return gamearea.area[x][y][1];
			},
			
			getAngle : function(x, y) {
				return gamearea.area[x][y][2];
			},
			
			setTile : function(x, y, t, a, ty) {
				gamearea.area[x][y][0] = t;
				gamearea.area[x][y][1] = ty;
				gamearea.area[x][y][2] = a;
			},
			
			checkRow : function(row) {
				var rowFilled = true;
				
				for(var i = 0; i < ZT.game.XCELLS; i++)
				{
					if(gamearea.area[i][row][0] == 0)
						rowFilled = false;
				}
				return rowFilled;
			},
			
			clearRow : function(row) {
				for(var i = 0; i < ZT.game.XCELLS; i++)
				{
					gamearea.area[i][row][0] = 0;
					gamearea.area[i][row][1] = 0;
					gamearea.area[i][row][2] = 0;
				}
			},
			
			moveRowsAbove : function(row) {
				var r = row;
				for(var i = 0; i < ZT.game.XCELLS; i++)
				{
					for(;r > 0; r--)
					{
						gamearea.area[i][r][0] = gamearea.area[i][r-1][0];
						gamearea.area[i][r][1] = gamearea.area[i][r-1][1];
						gamearea.area[i][r][2] = gamearea.area[i][r-1][2];
						gamearea.area[i][r-1][0] = 0;
						gamearea.area[i][r-1][1] = 0;
						gamearea.area[i][r-1][2] = 0;
					}
					r = row;
				}
			},
			
			killBlock : function(block) {
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						if(block.shape[i][j] > 0)
						{
							gamearea.setTile(i+block.posx, j+block.posy, block.shape[i][j], block.rot, block.type);
							CGL.util.printLn("Dead tile type: " + gamearea.getType(i+block.posx, j+block.posy) + " Angle: " + gamearea.getAngle(i+block.posx, j+block.posy) + " Tile: " + gamearea.checkTile(i+block.posx, j+block.posy));
						}
					}
				}
			},
			
			canMoveLeft : function(block) {
				var can = true;
				block.moveLeft();
				
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						if(block.shape[i][j] > 0)
						{
							if(i + block.posx < 0)
								can = false;
							else if(gamearea.area[i+block.posx][j+block.posy][0] > 0)
								can = false;
						}
					}
				}
				return can;
			},
			
			canMoveRight : function(block) {
				var can = true;
				block.moveRight();
				
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						if(block.shape[i][j] > 0)
						{
							if(i + block.posx > 9)
								can = false;
							else if(gamearea.area[i+block.posx][j+block.posy][0] > 0)
								can = false;
						}
					}
				}
				return can;
			},
			
			canMoveDown : function(block) {
				var can = true;
				block.moveDown();
				
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						if(block.shape[i][j] > 0)
						{
							if(j+block.posy > 15)
								can = false;
							else if(gamearea.area[i+block.posx][j+block.posy][0] > 0)
								can = false;
						}
					}
				}
				return can;
			},
			
			canRotate : function(block) {
				var can = true;
				block.rotate();
				
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						if(block.shape[i][j] > 0)
						{
							if(i+block.posx > 9 || i+block.posx < 0 || j+block.posy > 15)
								can = false;
							else if(gamearea.area[i+block.posx][j+block.posy][0] > 0)
								can = false;
						}
					}
				}
				return can;
			}
		};
		return gamearea;
	}
};

ZT.block = {
		
	BLOCK_ID : 0,
	
	TYPE : [[[1,3],
	        [2,4]],
	       [[1,2,3],
	        [0,0,4],
	        [0,0,0]],
	       [[0,0,4],
	        [1,2,3],
	        [0,0,0]],
	       [[0,0,1],
	        [0,3,2],
	        [0,4,0]],
	       [[0,1,0],
	        [0,2,3],
	        [0,0,4]],
	       [[0,0,2],
	        [0,1,3],
	        [0,0,4]],
	       [[0,0,0,0],
	        [1,2,3,4],
	        [0,0,0,0],
	        [0,0,0,0]]],
	
	block : function(t) {
		var block = {
			id : ZT.block.BLOCK_ID,
			posx : 4,
			posy : 0,
			rot : 0,
			alive : true,
			type : t || 0,
			shape : ZT.block.TYPE[t] || ZT.block.TYPE[0],
			
			moveDown : function() {
				block.posy++;
			},
			
			moveUp : function() {
				block.posy--;
			},
			
			moveLeft : function() {
				block.posx--;
			},
			
			moveRight : function() {
				block.posx++;
			},
			
			rotate : function() {
				var x = block.shape.length, y = 0;
				var tempshape = new Array(x);
				for(var k = 0; k < x; k++)
					tempshape[k] = new Array(x);
				
				for(var i = 0; i < block.shape.length; i++)
				{
					for(var j = 0; j < block.shape[i].length; j++)
					{
						tempshape[i][j] = block.shape[x-1][y];
						x--;
					}
					y++;
					x = block.shape.length;
				}
				block.shape = tempshape;
				if(block.rot != 0)
				{
					block.rot--;
				}
				else
				{
					block.rot = 3;
				}
			}
		};
		ZT.block.BLOCK_ID++;
		return block;
	}
};

ZT.util = {
	
	randomizer : function(i) {
		return Math.floor(Math.random() * i);
	}
};