/*
 * Canvas Game Library
 * 
 * Copyright Astral Orca 2011
 * All rights reserved.
 */

/**
 * @fileOverview The Canvas Game Library is a simple library to make JS gameprogramming a bit less bothersome.
 * It's mostly for the new HTML5 standard working with the <canvas> tag as a graphics container.
 * I will try to make it as whole as possible, it's mostly a training excersise, but I hope to find some future use for it as well.
 * At first I want to write basic implementation for content and asset control, but I also want a good working communication library to handle server page scripts and database queries.
 * I would also like to write a good Entity class to take care of elements of the game as well as basic 2d physics and collision detection.
 * At first I will build this library with the Cthulhu Breaker port in mind, making it a pretty straight forward project as on what tools I need to implement into the library.
 * @todo Image loader class, dynamically load images and store them in a hidden <div>
 * @todo Resource Management through XML and Ajax, Make a resource loader that utilizes ajax function and gets a XML file with asset src and info.
 * @todo Basic Entity class, a class to create and work with game entities.
 * @todo Basic Entity collision detection and controll, a set of functions that checks for and manages collisions.
 * @todo Basic Input event manager, a class to handle input from keyboard and mouse, and ingame events such as Collisions.
 * @todo Sprite management, a class to load and manage sprites, give the different sprites id and in the future manage a AnimateSprite function.
 * @name cgl.0.1.js
 */

/**
 * The CGL global namespace Object.
 * @class CGL
 * @static
 */

var CGL = {};

/**
 * @class CGL.canvas
 * @global DEFAULT_CONTEXT : The Context that the canvas draws on.
 * @global DEFAULT_CANVAS_ID : The DOM id that will be appointed to the canvas element.
 * @global CANVAS_CONTAINER : The container that the canvas will be put into.
 * @global CANVAS_WIDTH : The width of the canvas.
 * @global CANVAS_HEIGHT : The height of the canvas.
 * @global TARGET_FPS : The framerate the canvas will try to target.
 * 
 * The class that controls and creates the canvas where the game graphics will be rendered.
 */
CGL.canvas = {
	DEFAULT_CONTEXT : "2d",
	DEFAULT_CANVAS_ID : "cglcanvas",
	
	CANVAS_CONTAINER : "",
	CANVAS_WIDTH : 300,
	CANVAS_HEIGHT : 200,
	TARGET_FPS : 60,

	setDefault : function(option, value){
		CGL.canvas[option] = value;
	},

	getDefault : function(option){
		return CGL.canvas[option];
	},
	/**
	 *  @method createCanvas(id, width, height)
	 *  @param id : sets the CANVAS_CONTAINER
	 *  @param width : sets the CANVAS_WIDTH
	 *  @param height : sets the CANVAS_HEIGHT
	 *  
	 *  Creates a <canvas> element that will be used as the main graphics container for the game!
	 */
	createCanvas : function(id, width, height){
		
		var canvas = document.createElement("canvas");
		
		CGL.canvas.CANVAS_WIDTH = width;
		CGL.canvas.CANVAS_HEIGHT = height;
		CGL.canvas.CANVAS_CONTAINER = id;
		
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.style.borderColor = "black";
		canvas.style.borderStyle = "solid";
		canvas.style.borderWidth = "1px";
		canvas.setAttribute("id", CGL.canvas.DEFAULT_CANVAS_ID);
		
		document.getElementById(id).appendChild(canvas);
		
		var elem = document.createElement("div");
		elem.setAttribute("id", "status");
		elem.style.width = width + "px";
		elem.style.height = "120px";
		elem.style.overflowY = "scroll";
		elem.style.borderColor = "black";
		elem.style.borderStyle = "solid";
		elem.style.borderWidth = "1px";
		elem.style.color = "black";
		elem.style.backgroundColor = "white";
		elem.style.display = "none";
		document.getElementById(id).appendChild(elem);
	},
	
	/**
	 * @method getContext()
	 * 
	 * Returns the graphic context as chosen by the DEFAULT_CONTEXT global.
	 */
	getContext : function(){
		var canvas = document.getElementById(CGL.canvas.DEFAULT_CANVAS_ID);
		return canvas.getContext(CGL.canvas.DEFAULT_CONTEXT);
	}
};

CGL.image = {
	
	IMAGE_ID : 0,
	
	DEFAULT_IMAGECONT_ID : "imgcont",
	
	createImageContainer : function() {
		
		var div = document.createElement("div");
		
		div.setAttribute("id", CGL.image.DEFAULT_IMAGECONT_ID);
		div.style.display = "none";
		document.body.appendChild(div);
	},
	
	load : function(src, id){
		var img = document.createElement("img");
		img.setAttribute("src", src);
		img.setAttribute("id", id);
		img.setAttribute("onload", "notifyLoaded(" + id + ")");
		document.getElementById(CGL.image.DEFAULT_IMAGECONT_ID).appendChild(img);
	},
	
	Image : function(source, uid, srcx, srcy){
		var img = {
			id : uid,
			x : srcx,
			y : srcy
		};
		CGL.image.load(source, uid);
		return img;
	},
	
	render : function(ctx, img){
		ctx.drawImage(document.getElementById(img.id), img.x, img.y);
	},
	
	renderAt : function(ctx, imgid, x, y){
		ctx.drawImage(document.getElementById(imgid), x, y);
	},
	
	renderPart : function(ctx, imgid, srcx, srcy, srcwidth, srcheight, destx, desty, destwidth, destheight){
		ctx.drawImage(document.getElementById(imgid), srcx, srcy, srcwidth, srcheight, destx, desty, destwidth, destheight);
	}
};

CGL.sprite = {
	
	Sprite : function(frames, time){
		var sprite = {
			active : true,
			speed : time || 500,
			activeFrame : 0,
			maxFrames : frames.length - 1,
			images : frames,
			timeCount : 0,
			loop : true,
			
			nextFrame : function(){
				sprite.activeFrame += 1;
				
				if(sprite.activeFrame > sprite.maxFrames)
				{
					if(sprite.loop)
					{
						sprite.activeFrame = 0;
					}
					else
					{
						sprite.activeFrame = 0;
						sprite.active = false;
					}
				}
			},
			
			setSpeed : function(time){
				sprite.speed = time;
			},
			
			setLoop : function(looping){
				sprite.loop = looping;
			},
			
			setActiveFrame : function(actFrame){
				sprite.activeFrame = actFrame;
			},
			
			stop : function(){
				sprite.active = false;
			},
			
			start : function(){
				sprite.active = true;
			},
			
			replay : function(){
				sprite.activeFrame = 0;
				sprite.active = true;
			},
			
			update : function(time){
				if(sprite.active)
				{
					sprite.timeCount += time;
				}
					
				if(sprite.timeCount > sprite.speed)
				{
					sprite.nextFrame();
					sprite.timeCount = 0;
				}
			},
			
			render : function(ctx, x, y){
				ctx.drawImage(document.getElementById(sprite.images[sprite.activeFrame]), x, y);
			}
		};
		
		return sprite;
	}

};

CGL.resource = {
		
	RESOURCES : 0,
	
	loadImages : function(xml){
		var image, elem, i;
		var img = new Array();
		var imgsrc, imgid;
		xmlhttp = CGL.ajax._createXHR();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				image = xmlhttp.responseXML.documentElement.getElementsByTagName("image");
				for(i = 0; i < image.length; i++){
					elem = image[i].getElementsByTagName("src");
					try{
						imgsrc = elem[0].firstChild.nodeValue;
					}
					catch(er){
					}
					elem = image[i].getElementsByTagName("id");
					try{
						imgid = elem[0].firstChild.nodeValue;
					}
					catch(er){
					}
					CGL.image.load(imgsrc, imgid);
					img[i] = imgid;
					CGL.resource.RESOURCES++;
					CGL.util.printLn("Loaded Image: " + imgsrc + " With ID: " + imgid);
				}
		  	}
			
		};
		xmlhttp.open("GET",xml,false);
		xmlhttp.send();
		return img;
	}
};

CGL.highscore = {
		
	highscore : function(url, posts) {
		var highScore = {
			name : new Array(posts),
			score : new Array(posts),
			level : new Array(posts),
			size : posts,
			
			getHighScore : function() {
				highScore.size = 10;
				xmlhttp = CGL.ajax._createXHR();
				xmlhttp.onreadystatechange = function()
				{
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
					{
						var string = xmlhttp.responseText;
						var list = eval( "(" + string + ")" );
						
						for(i = 0; i < list.length; i++){
							highScore.name[i] = list[i].name;
							highScore.score[i] = list[i].score;
							highScore.level[i] = list[i].level;
						}
						highScore.size = list.length;
				  	}
				}
				xmlhttp.open("GET",url + "?action=get&posts=" + highScore.size ,false);
				xmlhttp.send();
			},
		
			recordHighScore : function(name, level, score) {
				xmlhttp = CGL.ajax._createXHR();
				xmlhttp.onreadystatechange = function()
				{
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
					{
						CGL.util.printLn(xmlhttp.responseText);
				  	}
				}
				xmlhttp.open("GET",url + "?action=put&name=" + name + "&score=" + score + "&level=" + level ,false);
				xmlhttp.send();
			},
			
			reInit : function() {
				for(var i = 0; i < highScore.size; i++)
				{
					delete highScore.name[highScore.size-i];
					delete highScore.score[highScore.size-i];
					delete highScore.level[highScore.size-i];
				}
			}
		};
		return highScore;
	}
};

CGL.ajax = {
		
	_createXHR : function() { 
    
		try { return new XMLHttpRequest(); } catch(e) {}
    	try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
    	try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
    	try { return new ActiveXObject("Msxml2.XMLHTTP"); } 	  catch (e) {}
    	try { return new ActiveXObject("Microsoft.XMLHTTP"); }  catch (e) {}
						  	           
    	return null;
	}
};

CGL.util = {
	
	MESSAGE_ID : 0,
	LASTUPDATE : 0,
	UPDATE_RPS : 40,
	
	
	printLn : function(message) {
		var elem = document.createElement("p");
		elem.setAttribute("id", CGL.util.MESSAGE_ID);
		document.getElementById("status").appendChild(elem);
		document.getElementById(CGL.util.MESSAGE_ID).innerHTML = CGL.util.MESSAGE_ID + " : " + message;
		CGL.util.MESSAGE_ID++;
	},
	
	gameTimer : function() {
		delta = new Date();
		if(delta.getTime() > CGL.util.LASTUPDATE + 1000/CGL.util.UPDATE_RPS)
		{
			CGL.util.LASTUPDATE = delta.getTime();
			return true;
		}
		else
			return false;
	},
};

CGL.math = {
	
	Vector2 : function(vx, vy) {
		var Vector2 = {
				x : vx || 0.0,
				y : vy || 0.0,
		
			interpolate : function(a_vec, b_vec, a_f){
				return a_vec.mul(a_f).add(b_vec.mul(1-a_f));	
			},
		
			mul : function(other){
				Vector2.x *= other.x;
				Vector2.y *= other.y;
			},
		
			mulScale : function(scale) {
				Vector2.x *= scale;
				Vector2.y *= scale;
			},
		
			sub : function(other) {
				Vector2.x -= other.x;
				Vector2.y -= other.y;
			},
		
			add : function(other) {
				Vector2.x += other.x;
				Vector2.y += other.y;
			},
		
			div : function(other) {
				Vector2.x /= other.x;
				Vector2.y /= other.x;
			},
		
			divScale : function(scale) {
				Vector2.x /= scale;
				Vector2.y /= scale;
			},
		
			scale : function(a_f, a_g){
				return new CGL.math.Vector2d(a_f * Vector2d.m_x, a_g * Vector2d.m_y);	
			},
		
			dot : function(other) {
				return ((Vector2.x * other.x) + (Vector2.y * other.y));
			},
		
			neg : function() {
				return new CGL.math.Vector2(-Vector2.x, -Vector2.y);
			},
		
			normalize : function() {
				var l = Vector2.length();
			
				if(l == 0){
					return;
				}
			
				Vector2.x /= l;
				Vector2.y /= l;
			},
		
			lengthSquared : function() {
				return (Vector2.x * Vector2.x) + (Vector2.y * Vector2.y);
			},
		
			length : function() {
				return Math.sqrt(Vector2.lengthSquared());
			},
	
			toString : function() {
				return "[Vector (" + Vector2.x + ", " + Vector2.y + ")]";
			},
		
			copy : function(other) {
				Vector2.x = other.x;
				Vector2.y = other.y;
			},
		
			draw : function(ctx) {
			/* Convert to Local space */
			var lx, ly;
			if(Vector2.x < 0.0) {
				lx = (-Vector2.x * -50) + 200; 
			} else {
				lx = (Vector2.x * 50) + 200;
			}
			
			if(Vector2.y > 0.0) {
				ly = (Vector2.y * -50) + 200; 
			} else {
				ly = (-Vector2.y * 50) + 200;
			}
			
			ctx.beginPath();
			ctx.arc(lx, ly, 2, 0, Math.PI*2, true); // Outer circle
			ctx.fill();
			}
		};
		return Vector2;
	},

	getNormal : function(vx, vy) {
		var n = new CGL.math.Vector2(vy.x, vy.y);
		n.sub(vx);
	
		n = new CGL.math.Vector2(n.y, -n.x);
		n.normalize();
	
		return n;
	}
};

CGL.ui = {
		
	Button : function(imgs, srcx, srcy, srcwidth, srcheight) {
		var button = {
			images : imgs,
			x : srcx,
			y : srcy,
			width : srcwidth,
			height : srcheight,
			active : false,
			clicked : false,
		
			update : function(mx, my, mb) {
				if(mx > button.x && mx < button.x + button.width && my > button.y && my < button.y + button.height)
				{
					button.active = true;
				}
				else
				{
					button.active = false;
				}
				if(button.active && mb)
				{
					button.clicked = true;
				}
			},
			
			activated : function() {
				return button.clicked;
			},
			
			deactivate : function() {
				button.clicked = false;
			},
			
			render : function(ctx) {
				if(!button.active)
				{
					ctx.drawImage(document.getElementById(button.images[0]), button.x, button.y);
				}
				else
				{
					ctx.drawImage(document.getElementById(button.images[1]), button.x, button.y);
				}
			}
		};
		return button;
	}
};

CGL.event = {
	
	MOUSEX : 0,
	MOUSEY : 0,
	
	KLEFT : false,
	KRIGHT : false,
	KDOWN : false,
	KUP : false,
	KSPACE : false,
	KPAUSE : false,
	
	CLICKED : false,
	
	ACTIVEGAMEKEY : true,
	
	handleEventMovement : function(e) {
		CGL.event.getCursorPosition(e);
	},
	
	handleEventClick : function(e) {
		CGL.event.CLICKED = true;
	},
	
	clearEvents : function() {
		CGL.event.KLEFT = false;
		CGL.event.KRIGHT = false;
		CGL.event.KDOWN = false;
		CGL.event.KUP = false;
		CGL.event.KSPACE = false;
		CGL.event.KPAUSE = false;
		CGL.event.CLICKED = false;
	},
	
	handleEventKey : function(e) {
		
		if(CGL.event.ACTIVEGAMEKEY)
		{
			e.stopPropagation();
			e.preventDefault();
		}
		
		switch(e.keyCode) {
		case 19:
			CGL.event.KPAUSE = true;
			break;
		case 32:
			CGL.event.SPACE = true;
			CGL.util.printLn("Space was triggered!");
			break;
		case 37:
			CGL.event.KLEFT = true;
			break;
		case 38:
			CGL.event.KUP = true;
			break;
		case 39:
			CGL.event.KRIGHT = true;
			break;
		case 40:
			CGL.event.KDOWN = true;
			break;
		case 65:
			CGL.event.KLEFT = true;
			CGL.util.printLn("Left was triggered!");
			break;
		case 87:
			CGL.event.KUP = true;
			CGL.util.printLn("Up was triggered!");
			break;
		case 68:
			CGL.event.KRIGHT = true;
			CGL.util.printLn("Right was triggered!");
			break;
		case 80:
			CGL.event.KPAUSE = true;
			break;
		case 83:
			CGL.event.KDOWN = true;
			CGL.util.printLn("Down was triggered!");
			break;
		default:
			break;
		
		
		};
	},

	getCursorPosition : function(e) {
	    if (e.pageX != undefined && e.pageY != undefined) {
	    	CGL.event.MOUSEX = e.pageX;
	    	CGL.event.MOUSEY = e.pageY;
	    }
	    else {
	    	CGL.event.MOUSEX = e.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
	    	CGL.event.MOUSEY = e.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	    }
	    
	    CGL.event.MOUSEX -= document.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).offsetLeft;
	    CGL.event.MOUSEY -= document.getElementById(CGL.canvas.DEFAULT_CANVAS_ID).offsetTop;
	}
};