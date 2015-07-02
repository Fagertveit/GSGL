var images;
var grinder = new Array(2);
var masher = new Array(16);

var btn_newgame, btn_highscore, btn_about;

var aliveblock;
var nextblock;

var cleanRows = new Array(16);
var cleaning = false;

var ready = false;

var loaded = 0;
var resources = 0;
var loading = 0;

var angle = [0, 1.57079, 3.14159, 4.71238];

var gametime = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
var level = 0;
var timer;

var score = 0;
var lines = 0;

var gamearea;

var fall = 0;
var fallscore = 20;

var highscore;

var gameState = 0;

function init() {
	CGL.canvas.createCanvas("canvas", 544, 544);
	document.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).addEventListener("mousemove", CGL.event.handleEventMovement,false);
	document.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).addEventListener("click", CGL.event.handleEventClick,false);
	window.addEventListener("keydown", CGL.event.handleEventKey,false);
	CGL.image.createImageContainer();
	images = new CGL.resource.loadImages("images.xml");
	gamearea = new ZT.game.gamearea();
	gamearea.init();
	highscore = new CGL.highscore.highscore("highscore.php", 10);
	highscore.getHighScore();
	CGL.util.gameTimer();
	setInterval(update, 1000/CGL.canvas.TARGET_FPS);
	aliveblock = new ZT.block.block(ZT.util.randomizer(7));
	nextblock = new ZT.block.block(ZT.util.randomizer(7));
	tempblock = new ZT.block.block();
	timer = gametime[level];
	
	grinder[0] = new CGL.sprite.Sprite(["grinder1", "grinder2", "grinder3", "grinder4"], 100);
	grinder[1] = new CGL.sprite.Sprite(["grinder4", "grinder3", "grinder2", "grinder1"], 100);
	
	btn_newgame = new CGL.ui.Button(["newgame_off", "newgame_on"], -12, 502, 192, 47);
	btn_highscore = new CGL.ui.Button(["highscore_off", "highscore_on"], 198, 502, 192, 47);
	btn_about = new CGL.ui.Button(["about_off", "about_on"], 394, 502, 192, 47);
	
	for(var i = 0; i < masher.length; i++)
	{
		masher[i] = CGL.sprite.Sprite(["masher1", "masher3", "masher4", "masher3", "masher2", "masher1"], 100);
		masher[i].setLoop(false);
	}
	
	for(var i = 0; i < cleanRows.length; i++)
	{
		cleanRows[i] = false;
	}
}
	
function update() {

	if(CGL.util.gameTimer())
	{
		gameLogic();
	}
	

	/* Render function */
	render();
}

function showHighScoreForm() {
	var damp = document.getElementById("dampner");
	var hsform = document.getElementById("hsform");
	var hsscore = document.getElementById("hsscore");
	var hslevel = document.getElementById("hslevel");
	
	damp.style.display = "inline";
	hsform.style.display = "inline";
	hsscore.innerHTML = score;
	hslevel.innerHTML = level;
}

function hideHighScoreForm() {
	var damp = document.getElementById("dampner");
	var hsform = document.getElementById("hsform");
	
	damp.style.display = "none";
	hsform.style.display = "none";
}

function showAjaxIndicator() {
	var damp = document.getElementById("dampner");
	var ajaxindicator = document.getElementById("ajaxindicator");
	
	damp.style.display = "inline";
	ajaxindicator.style.display = "inline";
}

function hideAjaxIndicator() {
	var damp = document.getElementById("dampner");
	var ajaxindicator = document.getElementById("ajaxindicator");
	
	damp.style.display = "none";
	ajaxindicator.style.display = "none";
}

function submitHighScore() {
	var name = document.getElementById("hsname");
	hideHighScoreForm();
	
	highscore.recordHighScore(name.value, level, score);
	
	highscore.reInit();
	highscore.getHighScore();
	gameState = 4;
}

function notifyLoaded(id) {
	loaded++;
	CGL.util.printLn("Image: " + id + " finished loading!" + loaded + " of " + CGL.resource.RESOURCES);
	
	if(loaded == CGL.resource.RESOURCES-1)
		ready = true;
}
	
function gameLogic() {
	
	grinder[0].update(100);
	grinder[1].update(100);
	
	for(var i = 0; i < masher.length; i++)
	{
		masher[i].update(100);
	}
	
	if(gameState == 0)
	{
		btn_newgame.update(CGL.event.MOUSEX, CGL.event.MOUSEY, CGL.event.CLICKED);
		btn_highscore.update(CGL.event.MOUSEX, CGL.event.MOUSEY, CGL.event.CLICKED);
		btn_about.update(CGL.event.MOUSEX, CGL.event.MOUSEY, CGL.event.CLICKED);
		
		CGL.event.clearEvents();
		
		if(btn_newgame.activated())
		{
			gameState = 1;
			CGL.event.ACTIVEGAMEKEY = true;
			initGame();
			btn_newgame.deactivate();
		}
		if(btn_highscore.activated())
		{
			gameState = 4;
			btn_highscore.deactivate();
		}
		if(btn_about.activated())
		{
			gameState = 5;
			btn_about.deactivate();
		}
	}
	else if(gameState == 1)
	{
		
		
		/* Alive block dynamics */
		/* User input */
		if(CGL.event.KPAUSE)
		{
			CGL.event.clearEvents();
			gameState = 2;
		}
		if(CGL.event.KLEFT)
		{
			CGL.event.clearEvents();
			tempblock.shape = aliveblock.shape;
			tempblock.posx = aliveblock.posx;
			tempblock.posy = aliveblock.posy;
			
			/* Check if can left */
			if(gamearea.canMoveLeft(tempblock))
			{
				aliveblock.moveLeft();
			}
			/* If so move left */
		}
		if(CGL.event.KRIGHT)
		{
			CGL.event.clearEvents();
			tempblock.shape = aliveblock.shape;
			tempblock.posx = aliveblock.posx;
			tempblock.posy = aliveblock.posy;
			
			/* Check if can right */
			if(gamearea.canMoveRight(tempblock))
			{
				aliveblock.moveRight();
			}
			/* If so move right */
		}
		if(CGL.event.KUP)
		{
			CGL.event.clearEvents();
			tempblock.shape = aliveblock.shape;
			tempblock.posx = aliveblock.posx;
			tempblock.posy = aliveblock.posy;
			
			/* Check if can up */
			if(gamearea.canRotate(tempblock))
			{
				aliveblock.rotate();
			}
			/* If so rotate */
			
		}
		if(CGL.event.KDOWN)
		{
			CGL.event.clearEvents();

			tempblock.shape = aliveblock.shape;
			tempblock.posx = aliveblock.posx;
			tempblock.posy = aliveblock.posy;

			fall = 0;
			do {
				fall++;
			} while (gamearea.canMoveDown(tempblock));

			fall--;

			fallscore = 10;
			for(var i = 0; i < fall; i++)
			{
				aliveblock.moveDown();

				score += 20 + fallscore;
				fallscore += 20;
			}
		}
		if(timer == 0 && !cleaning)
		{
			/* Move down */
			tempblock.shape = aliveblock.shape;
			tempblock.posx = aliveblock.posx;
			tempblock.posy = aliveblock.posy;
			/* Check if can move down */
			if(gamearea.canMoveDown(tempblock))
			{
				aliveblock.moveDown();
				score += 10;
			}
			else
			{
				gamearea.killBlock(aliveblock);
				
				/* Dead brick logic */
				
				var rowscore = 0;
				
				for(var i = 0; i < ZT.game.YCELLS; i++)
				{
					if(gamearea.checkRow(i))
					{
						rowscore++;
						lines++;
						cleanRows[i] = true;
						cleaning = true;
						masher[i].replay();
					}
				}
				
				if(!cleaning)
				{
					spawnBlock();
				}

				level = Math.floor(lines/10);

				if(rowscore > 0)
				{
					if(rowscore == 1)
						score += 400;
					else if(rowscore == 2)
						score += 1000;
					else if(rowscore == 3)
						score += 2000;
					else
						score += 4000;
				}
			}
			if(cleaning)
			{
				timer = 15;
			}
			else
			{
				timer = gametime[level];
			}
		}
		else if(timer == 0 && cleaning)
		{
			for(var i = 0; i < ZT.game.YCELLS; i++)
			{
				if(cleanRows[i])
				{
					gamearea.clearRow(i);
					gamearea.moveRowsAbove(i);
				}
				cleanRows[i] = false;
			}
			spawnBlock();
			cleaning = false;
		}
		else
		{
			timer--;
		}
	}
	else if(gameState == 2)
	{
		if(CGL.event.KPAUSE)
		{
			CGL.event.clearEvents();
			gameState = 1;
		}
	}
	else if(gameState == 3)
	{
		if(CGL.event.CLICKED)
		{
			CGL.event.ACTIVEGAMEKEY = false;
			CGL.event.clearEvents();
			highscore.reInit();
			highscore.getHighScore();
			showHighScoreForm();
		}
	}
	else if(gameState == 4)
	{
		if(CGL.event.CLICKED)
		{
			CGL.event.clearEvents();
			gameState = 0;
		}
	}
	else if(gameState == 5)
	{
		if(CGL.event.CLICKED)
		{
			CGL.event.clearEvents();
			gameState = 0;
		}
		
		if(loading < 100)
		{
			loading += 10;
		}
		else
		{
			loading = 0;
		}
	}
}

function spawnBlock()
{
	aliveblock = nextblock;

	nextblock = new ZT.block.block(ZT.util.randomizer(7));
	
	tempblock.shape = nextblock.shape;
	tempblock.posx = nextblock.posx;
	tempblock.posy = nextblock.posy;
	
	if(!gamearea.canMoveDown(tempblock))
	{
		gameState = 3;
	}
}

function initGame()
{
	gamearea = new ZT.game.gamearea();
	gamearea.init();

	score = 0;
	level = 0;
	lines = 0;

	aliveblock = new ZT.block.block(ZT.util.randomizer(7));
	nextblock = new ZT.block.block(ZT.util.randomizer(7));
	tempblock = new ZT.block.block();
	timer = gametime[level];
}

function render() {
	var ctx = CGL.canvas.getContext();                            // Get GFX Context
	ctx.clearRect(0,0,544,544);                                   // Clear the Viewport
	
	if(!ready)
	{
		CGL.image.renderAt(ctx, "splatt", 0, 256);
		CGL.image.renderAt(ctx, "loadingtxt", 48, 128);
		CGL.image.renderAt(ctx, "loading1", 160, 372);
		CGL.image.renderPart(ctx, "loading2", 0, 0, (224/CGL.resource.RESOURCES-1)*loaded, 49, 160, 372, (224/CGL.resource.RESOURCES-1)*loaded, 49);
	}
	else
	{
		

		if(gameState == 0)
		{
			CGL.image.renderAt(ctx, "title", 0, 0);
			
			btn_newgame.render(ctx);
			btn_highscore.render(ctx);
			btn_about.render(ctx);
		}
		else if(gameState > 0 && gameState < 4)
		{
			/* Background and UI */

			CGL.image.renderAt(ctx, images[0], 0, 0);

			/* Text elements */
			
			ctx.font = "Bold 18px Verdana";
			ctx.fillStyle = "#951919";
			ctx.textAlign = "right";
			ctx.fillText(score, 512, 250);
			ctx.textAlign = "center";
			ctx.fillText(level, 496, 292);
			ctx.fillText(lines, 496, 332);

			/* Alive block */


				for(var j = 0; j < aliveblock.shape.length; j++)
				{
					for(var k = 0; k < aliveblock.shape[j].length; k++)
					{
						if(aliveblock.shape[j][k] > 0)
						{
							ctx.save();
							ctx.translate(32*(aliveblock.posx+j)+48, 32*(aliveblock.posy+k)+16);

							ctx.rotate(angle[aliveblock.rot]);
							CGL.image.renderAt(ctx, "block" + aliveblock.type + aliveblock.shape[j][k], -16, -16);
							ctx.restore();
						}
					}
				}

			/* Next block */
			
			for(var j = 0; j < nextblock.shape.length; j++)
			{
				for(var k = 0; k < nextblock.shape[j].length; k++)
				{
					if(nextblock.shape[j][k] > 0)
					{
						ctx.save();
						if(nextblock.shape.length == 2)
						{
							ctx.translate(32*j+444, 32*k+96);
						}
						else if(nextblock.shape.length == 3)
						{
							if(nextblock.type == 1 || nextblock.type == 2)
							{
								ctx.translate(32*j+444, 32*k+80);
							}
							else
							{
								ctx.translate(32*j+428, 32*k+64);
							}
						}
						else
						{
							ctx.translate(32*j+428, 32*k+64);
						}
						ctx.rotate(angle[nextblock.rot]);
						CGL.image.renderAt(ctx, "block" + nextblock.type + nextblock.shape[j][k], -16, -16);
						ctx.restore();
					}
				}
			}

			/* Gamearea Cells w. Graphics */

			for(var l = 0; l < ZT.game.XCELLS; l++)
			{
				for(var m = 0; m < ZT.game.YCELLS; m++)
				{
					if(gamearea.checkTile(l,m) > 0)
					{
						ctx.save();
						ctx.translate(32*(l) + 48, 32*(m)+16);

						ctx.rotate(angle[gamearea.getAngle(l,m)]);
						
						CGL.image.renderAt(ctx, "block" + gamearea.getType(l,m) + gamearea.checkTile(l,m), -16, -16);
						ctx.restore();
					}
				}
			}
			
			for(var n = 0; n < 10; n++)
			{
				grinder[0].render(ctx, n*32+32, 512);
				grinder[1].render(ctx, n*32+48, 512);
			}
			
			for(var p = 0; p < 16; p++)
			{
				masher[p].render(ctx, 16, p*32)
			}	
			
			if(gameState == 2)
			{
				CGL.image.renderAt(ctx, "splatt", 0, 128);
				CGL.image.renderAt(ctx, "paused", 128, 242);
			}
			
			if(gameState == 3)
			{
				CGL.image.renderAt(ctx, "splatt", 0, 128);
				CGL.image.renderAt(ctx, "gameover", 128, 242);
			}
		}
		else if(gameState == 4)
		{
			CGL.image.renderAt(ctx, "aboutscr", 0, 0);
			CGL.image.renderAt(ctx, "highscore", 72, 28);
			
			ctx.font = "Bold 18px Verdana";
			ctx.fillStyle = "Yellow";
			ctx.textAlign = "left";
			
			ctx.fillText("Name", 92, 158);
			ctx.fillText("Level", 282, 158);
			ctx.textAlign = "right";
			ctx.fillText("Score", 448, 158);
			
			for(var i = 0; i < highscore.size; i++ )
			{
				ctx.textAlign = "left";
				ctx.fillText(highscore.name[i], 92, i * 32 + 192);
				ctx.fillText(highscore.level[i], 306, i * 32 + 192);
				ctx.textAlign = "right";
				ctx.fillText(highscore.score[i], 448, i * 32 + 192);
			}
		}
		else if(gameState == 5)
		{
			CGL.image.renderAt(ctx, "title", 0, 0);
			CGL.image.renderAt(ctx, "credits", 28, 448);
		}
		
	}
}