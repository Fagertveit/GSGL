/* GameSaw GameLibrary
 * - - - - - - - - - - -
 * Main class and entry point for the GameSaw GameLibrary
 */

var GSGL = {
	/* Global settings */
	CONTAINER_ID : "gsgl-container",
	WIDTH : 640,
	HEIGHT : 480,
};
GSGL.event = {
	KEY : {
		"BACKSPACE" : 8, "TAB" : 9, "ENTER" : 13, "SHIFT" : 16, "CTRL" : 17,
		"ALT" : 18, "PAUSE" : 19, "CAPS" : 20, "ESCAPE" : 27, "PAGEUP" : 33,
		"PAGEDOWN" : 34, "END" : 35, "HOME" : 36,
		"LEFT" : 37, "UP" : 38, "RIGHT" : 39, "DOWN" : 40, "INSERT" : 45, "DELETE" : 46,
		"0" : 48, "1" : 49, "2" : 50, "3" : 51, "4" : 52, "5" : 53, "6" : 54,
		"7" : 55, "8" : 56, "9" : 57,
		"A" : 65, "B" : 66, "C" : 67, "D" : 68, "E" : 69, "F" : 70, "G" : 71,
		"H" : 72, "I" : 73, "J" : 74, "K" : 75, "L" : 76, "M" : 77, "N" : 78,
		"O" : 79, "P" : 80, "Q" : 81, "R" : 82, "S" : 83, "T" : 84, "U" : 85,
		"V" : 86, "W" : 87, "Y" : 88, "X" : 89, "Z" : 90,
		"LEFTSUPER" : 91, "RIGHTSUPER" : 92, "SELECT" : 93,
		"NUM0" : 96, "NUM1" : 97, "NUM2" : 98, "NUM3" : 99, "NUM4" : 100,
		"NUM5" : 101,"NUM6" : 102, "NUM7" : 103, "NUM8" : 104, "NUM9" : 105,
		"MULTIPLY" : 106, "ADD" : 107, "SUBSTRACT" : 108, "DECIMAL" : 110,
		"DIVIDE" : 111, "F1" : 112, "F2" : 113, "F3" : 114, "F4" : 115, "F5" : 116,
		"F7" : 118, "F8" : 119, "F9" : 120, "F10" : 121, "F11" : 122, "F12" : 123,
		"NUMLOCK" : 144, "SCROLLLOCK" : 145, "SEMICOLON" : 186, "EQUAL" : 187,
		"COMMA" : 188, "DASH" : 189, "PERIOD" : 190, "FORWARDSLASH" : 191,
		"GRAVEACCENT" : 192, "OPENBRACKET" : 219, "BACKSLASH" : 220, "CLOSEBRAKET" : 221,
		"SINGLEQUOTE" : 222
	},

	GLYPH : {
		8: "BACKSPACE", 9: "TAB", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSE", 
		20: "CAPS", 27: "ESCAPE", 33: "PAGEUP", 34: "PAGEDOWN", 35: "END", 36: "HOME", 37: "LEFT", 
		38: "UP", 39: "RIGHT", 40: "DOWN", 45: "INSERT", 46: "DELETE", 48: "0", 49: "1", 50: "2", 
		51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "A", 66: "B", 67: "C", 
		68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 
		78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 
		88: "Y", 89: "X", 90: "Z", 91: "LEFTSUPER", 92: "RIGHTSUPER", 93: "SELECT", 96: "NUM0", 
		97: "NUM1", 98: "NUM2", 99: "NUM3", 100: "NUM4", 101: "NUM5", 102: "NUM6", 103: "NUM7", 
		104: "NUM8", 105: "NUM9", 106: "MULTIPLY", 107: "ADD", 108: "SUBSTRACT", 110: "DECIMAL", 
		111: "DIVIDE", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 118: "F7", 119: "F8", 
		120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NUMLOCK", 145: "SCROLLLOCK", 
		186: "SEMICOLON", 187: "EQUAL", 188: "COMMA", 189: "DASH", 190: "PERIOD", 
		191: "FORWARDSLASH", 192: "GRAVEACCENT", 219: "OPENBRACKET", 220: "BACKSLASH", 
		221: "CLOSEBRAKET", 222: "SINGLEQUOTE"
	},

	MouseManager : function(params) {
		var mouseManager = {
			X : 0,
			Y : 0,
			MB : [3],
			CLICK : [3],
			PREVENT_DEFAULT : true,
			STOP_PROPAGATION : true,
			LOGEVENTS : false,
			RESOLUTION : false,
			logger : new GSGL.utility.Logger({type: "Mouse Manager"}),
			container : {},
			
			constructor : function(params) {
				var _this = this;
				this.container = document.getElementById(params.target);

				this.MB[0] = false;
				this.MB[1] = false;
				this.MB[2] = false;

				this.CLICK[0] = false;
				this.CLICK[1] = false;
				this.CLICK[2] = false;

				this.container.addEventListener("click", function(event) {
					_this.setMouseClick(event);
				}, true);

				this.container.addEventListener("mousemove", function(event) {
					_this.setMousePosition(event);
				}, true);

				this.container.addEventListener("mousedown", function(event) {
					_this.setMouseDown(event);
				}, true);
				
				this.container.addEventListener("mouseup", function(event) {
					_this.setMouseUp(event);
				}, true);
			},
			
			setMouseDown : function(event) {
				if(this.PREVENT_DEFAULT) {
					event.preventDefault();
				}

				if(this.STOP_PROPAGATION) {
					event.stopPropagation();
				}

				if(this.LOGEVENTS) {
					this.logger.log("Mouse down at x: " + this.X + " y: " + this.Y);
				}

				this.MB[event.button] = true;
			},
			
			setMouseUp : function(event) {
				if(this.PREVENT_DEFAULT) {
					event.preventDefault();
				}

				if(this.STOP_PROPAGATION) {
					event.stopPropagation();
				}

				if(this.LOGEVENTS) {
					this.logger.log("Mouse up at x: " + this.X + " y: " + this.Y);
				}

				this.MB[event.button] = false;
			},

			setMouseClick : function(event) {
				if(this.PREVENT_DEFAULT) {
					event.preventDefault();
				}

				if(this.STOP_PROPAGATION) {
					event.stopPropagation();
				}

				if(this.LOGEVENTS) {
					this.logger.log("Clicked at x: " + this.X + " y: " + this.Y);
				}

				this.CLICK[event.button] = true;
			},

			clearClicks : function() {
				this.CLICK[0] = false;
				this.CLICK[1] = false;
				this.CLICK[2] = false;
			},
		
			setMousePosition : function(event) {
				if (event.pageX != undefined && event.pageY != undefined) {
			    	this.X = event.pageX;
			    	this.Y = event.pageY;
			    } else {
			    	this.X = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			    	this.Y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			    }
			    
			    this.X -= this.container.offsetLeft;
			    this.Y -= this.container.offsetTop;

			    if(this.RESOLUTION) {
			    	this.X = $resolution.getX(this.X);
			    	this.Y = $resolution.getY(this.Y);
			    }
			}
		};
		mouseManager.constructor(params);
		
		return mouseManager;
	},

	KeyboardManager : function() {
		var keyboardManager = {
			KEYS : [256],
			PREVENT_DEFAULT : false,
			STOP_PROPAGATION : false,
			KEY_LOGGER : false,
			logger : new GSGL.utility.Logger({type: "Keyboard Manager"}),
			
			constructor : function() {
				var _this = this;
				
				window.addEventListener("keydown", function(event) {
					_this.setKeyDown(event);
				}, true);
				
				window.addEventListener("keyup", function(event) {
					_this.setKeyUp(event);
				}, true);
			},
			
			setKeyDown : function(event) {
				if(this.PREVENT_DEFAULT) {
					event.preventDefault();
				}
				
				if(this.STOP_PROPAGATION) {
					event.stopPropagation();
				}
				
				if(this.KEY_LOGGER) {
					this.logger.log("Pressed key: " + GSGL.event.GLYPH[event.keyCode] + " keycode: " + event.keyCode, "Event");
				}
				
				this.KEYS[event.keyCode] = true;
			},
			
			setKeyUp : function(event) {
				if(this.PREVENT_DEFAULT) {
					event.preventDefault();
				}
				
				if(this.STOP_PROPAGATION) {
					event.stopPropagation();
				}
				
				if(this.KEY_LOGGER) {
					this.logger.log("Released key: " + event.keyCode, "Event");
				}
				this.KEYS[event.keyCode] = false;
			},

			clearKeys : function() {
				for(var key in this.KEYS) {
					this.KEYS[key] = false;
				}
			}
		};
		keyboardManager.constructor();
		
		return keyboardManager;
	},

	TouchManager : function(params) {
		var touchManager = {
			SWIPE_LEFT : false,
			SWIPE_RIGHT : false,
			SWIPE_UP : false,
			SWIPE_DOWN : false,
			X : 0,
			Y : 0,
			LOGEVENTS : false,
			RESOLUTION : false,
			logger : new GSGL.utility.Logger({type: "Touch Manager"}),
			container : {},
			activeTouchStart : {},

			constructor : function(params) {
				var _this = this;
				this.container = document.getElementById(params.target);

				this.container.addEventListener("touchstart", function(event) {
					_this.setTouchStart(event);
				}, true);

				this.container.addEventListener("touchend", function(event) {
					_this.setTouchEnd(event);
				}, true);

				this.container.addEventListener("touchcancel", function(event) {
					_this.setTouchCancel(event);
				}, true);

				this.container.addEventListener("touchmove", function(event) {
					_this.setTouchPosition(event);
				}, true);
			},

			setTouchStart : function(event) {
				if(this.LOGEVENTS) {
					this.logger.log('We got a touch event, saving for future calculations', event);
				}
				
				this.activeTouchStart = event;
			},

			setTouchEnd : function(event) {
				if(this.LOGEVENTS) {
					this.logger.log('A touch ended, calculating swipe', event);
				}

				this.clearSwipes();
				this.checkSwipe(event);
				this.activeTouchStart = {};
			},

			setTouchCancel : function(event) {
				if(this.LOGEVENTS) {
					this.logger.log('Touch cancelled');
				}
			},

			setTouchPosition : function(event) {
				if (event.touches[0].pageX != undefined && event.touches[0].pageY != undefined) {
			    	this.X = event.touches[0].pageX;
			    	this.Y = event.touches[0].pageY;
			    } else {
			    	this.X = event.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			    	this.Y = event.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop;
			    }
			    
			    this.X -= this.container.offsetLeft;
			    this.Y -= this.container.offsetTop;

			    if(this.RESOLUTION) {
			    	this.X = $resolution.getX(this.X);
			    	this.Y = $resolution.getY(this.Y);
			    }
			},

			checkSwipe : function(event) {
				var startTime = this.activeTouchStart.timeStamp;
				var endTime = event.timeStamp;

				if(this.LOGEVENTS) {
					this.logger.log('Touch started at: ' + startTime + ' and ended at: ' + endTime);
				}

				if(endTime - startTime < 1000 && endTime - startTime > 100) {
					if(this.LOGEVENTS) {
						this.logger.log('Action is inside swipe time range, calculating direction');
					}

					var startX = this.activeTouchStart.touches[0].pageX;
					var startY = this.activeTouchStart.touches[0].pageY;

					var endX = event.changedTouches[0].pageX;
					var endY = event.changedTouches[0].pageY;

					var horizontalDist = Math.abs(endX - startX);
					var verticalDist = Math.abs(endY - startY);

					if(this.LOGEVENTS) {
						this.logger.log('Swipe stats, startX: ' + startX + ' startY: ' + startY + 
							'endX: ' + endX + ' endY: ' + endY + ' Horizontal Distance: ' + horizontalDist +
							' Vertical Distance: ' + verticalDist);
					}

					if(horizontalDist > verticalDist) {
						if(endX - startX < 0) {
							this.SWIPE_LEFT = true;
							if(this.LOGEVENTS) {
								this.logger.log('Swiping Left');
							}
						} else {
							this.SWIPE_RIGHT = true;
							if(this.LOGEVENTS) {
								this.logger.log('Swiping Right');
							}
						}
					} else {
						if(endY - startY < 0) {
							this.SWIPE_UP = true;
							if(this.LOGEVENTS) {
								this.logger.log('Swiping Up');
							}
						} else {
							this.SWIPE_DOWN = true;
							if(this.LOGEVENTS) {
								this.logger.log('Swiping Down');
							}
						}
					}
				}
			},

			clearSwipes : function() {
				this.SWIPE_RIGHT = false;
				this.SWIPE_LEFT = false;
				this.SWIPE_UP = false;
				this.SWIPE_DOWN = false;
			}

		};
		touchManager.constructor(params);

		return touchManager;
	},
};
GSGL.geometry = {
	Vector2D : function(x, y) {
		var vector2d = {
			x : 0.0,
			y : 0.0,
			type : "vector2d",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setX : function(x) {
				this.x = x;
			},

			getX : function() {
				return this.x;
			},

			setY : function(y) {
				this.y = y;
			},

			getY : function() {
				return this.y;
			},

			setPosition : function(x, y) {
				this.x = x;
				this.y = y;
			},

			getPosition : function() {
				return {x: this.x, y: this.y};
			},

			add : function(vec2d) {
				return new GSGL.geometry.Vector2D(this.x + vec2d.x, this.y + vec2d.y);
			},

			subtract : function(vec2d) {
				return new GSGL.geometry.Vector2D(this.x - vec2d.x, this.y - vec2d.y);
			},

			invert : function() {
				return new GSGL.geometry.Vector2D(-this.x, -this.y);
			},

			scale : function(scalar) {
				return new GSGL.geometry.Vector2D(this.x * scalar, this.y * scalar);
			},

			dot : function(vec2d) {
				return ((this.x * vec2d.x) + (this.y * vec2d.y));
			},

			cross : function(vec2d) {
				return ((this.x * vec2d.y) - (this.y * vec2d.x));
			},

			length : function() {
				return Math.sqrt(this.lengthSquared());
			},

			lengthSquared : function() {
				return (this.x * this.x) + (this.y * this.y);
			},

			normalize : function() {
				var length = this.length();

				if(length == 0) {
					return new GSGL.geometry.Vector2D(0.0, 0.0);
				}

				return new GSGL.geometry.Vector2D(this.x / length, this.y / length);
			},

			project : function(vec2d) {
				var dot, length;
				dot = this.dot(vec2d);
				length = this.lengthSquared();

				return new  GSGL.geometry.Vector2D((dot / length) * this.x, (dot / length) * this.y);
			},

			angle : function() {
				return Math.atan2(this.x, -this.y);
			},

			distanceTo : function(vec) {
				var tmp = this.subtract(vec);

				return tmp.length();
			},

			rotate : function(radian) {
				// Must fix a utility class!
				if(this.x == 0) {
					this.x += GSGL.utility.EPSILON;
				}

				if(this.y == 0) {
					this.y += GSGL.utility.EPSILON;
				}

				return new  GSGL.geometry.Vector2D(Math.cos(radian) * this.x - Math.sin(radian) * this.y,
					Math.sin(radian) * this.x + Math.cos(radian) * this.y);
			},

			rotatePivot : function(x, y, radian) {
				if(this.x == 0) {
					this.x += GSGL.utility.EPSILON;
				}
				if(this.y == 0) {
					this.y += GSGL.utility.EPSILON;
				}

				var x, y;
				srcX = this.x;
				srcY = this.y;

				srcX -= x;
				srcY -= y;

				return new  GSGL.geometry.Vector2D((Math.cos(radian) * srcX - Math.sin(radian) * srcY) + x,
					(Math.sin(radian) * srcX + Math.cos(radian) * srcY) + y);
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.x, this.y, 1.0, 0, Math.PI * 2);
				$g.fill();
			},

			renderDirection : function(x, y) {
				$g.beginPath();
				$g.moveTo(x, y);
				$g.lineTo(x + this.x, y + this.y);
				$g.closePath();
				$g.stroke();
			},

			renderArrow : function(x, y) {
				var temp;

				this.renderDirection(x, y);

				temp = new GSGL.geometry.Vector2D(this.x, this.y);

				temp = temp.normalize();
				temp = temp.rotate(GSGL.utility.degreeToRadian(30));

				$g.beginPath();
				$g.moveTo(x + this.x, y + this.y);
				$g.lineTo((x + this.x) - (temp.x * 10), (y + this.y) - (temp.y * 10));
				$g.closePath();
				$g.stroke();

				temp = temp.rotate(GSGL.utility.degreeToRadian(-60));

				$g.beginPath();
				$g.moveTo(x + this.x, y + this.x);
				$g.lineTo((x + this.x) - (temp.x * 10), (y + this.y) - (temp.y * 10));
				$g.closePath();
				$g.stroke();
			},

			renderDestination : function(x, y) {
				$g.beginPath();
				$g.arc(x + this.x, y + this.y, 2, 0, Math.PI * 2, true);
				$g.fill();
			}
		};
		vector2d.constructor({x: x, y: y});

		return vector2d;
	},
	
	Vector3D : function(x, y, z) {
		var vector3d = {
			x : 0.0,
			y : 0.0,
			z : 0.0,
			type : "vector3d",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		vector3d.constructor({x: x, y: y, z: z});

		return vector3d;
	},

	Point : function(x, y) {
		var point = {
			x : 0.0,
			y : 0.0,
			type : "point",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.x += x;
				this.y += y;
			},

			setPosition : function(x, y) {
				this.x = x;
				this.y = y;
			},

			getPosition : function() {
				return {x : this.x, y : this.y};
			},

			setX : function(x) {
				this.x = x;
			},

			getX : function() {
				return this.x;
			},

			setY : function(y) {
				this.y = y;
			},

			getY : function() {
				return this.y;
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.x, this.y, 1.0, 0, Math.PI * 2);
				$g.fill();
			}
		};
		point.constructor({x: x, y: y});

		return point;
	},

	Line : function(params) {
		var line = {
			p0 : new GSGL.geometry.Point(0.0, 0.0),
			p1 : new GSGL.geometry.Point(1.0, 1.0),
			type : "line",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.p0.transform(x, y);
				this.p1.transform(x, y);
			},

			transformStart : function(x, y) {
				this.p0.transform(x, y);
			},

			transformEnd : function(x, y) {
				this.p1.transform(x, y);
			},

			setPosition : function(x0, y0, x1, y1) {
				this.p0.setPosition(x0, y0);
				this.p1.setPosition(x1, y1);
			},

			render : function() {
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
			}
		};
		line.constructor(params);

		return line;
	},

	Triangle : function(params) {
		var triangle = {
			p0 : new GSGL.geometry.Point(1.0, 0.0),
			p1 : new GSGL.geometry.Point(1.0, 1.0),
			p2 : new GSGL.geometry.Point(0.0, 1.0),
			type : "triangle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.p0.transform(x, y);
				this.p1.transform(x, y);
				this.p2.transform(x, y);
			},

			setPosition : function(point, x, y) {
				this['p' + point].setPosition(x, y);
			},

			render : function() {
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.p1.x, this.p1.y);
				$g.lineTo(this.p2.x, this.p2.y);
				$g.lineTo(this.p0.x, this.p0.y);
				$g.stroke();
			}
		};
		triangle.constructor(params);

		return triangle;
	},

	Rectangle : function(params) {
		var rectangle = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			width : 1.0,
			height : 1.0,
			type : "rectangle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setWidth : function(width) {
				this.width = width;
			},

			getX : function() {
				return this.pos.getX();
			},

			getY : function() {
				return this.pos.getY();
			},

			getWidth : function() {
				return this.width;
			},

			setHeight : function(height) {
				this.height = height;
			},

			getHeight : function() {
				return this.height;
			},

			render : function() {
				$g.strokeRect(this.pos.x, this.pos.y, this.width, this.height)
			}
		};
		rectangle.constructor(params);

		return rectangle;
	},

	AABB : function(params) {
		var aabb = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			hWidth : 1.0,
			hHeight : 1.0,
			type : "aabb",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setHalfWidth : function(hWidth) {
				this.hWidth = hWidth;
			},

			getHalfWidth : function() {
				return this.hWidth;
			},

			setHalfHeight : function(hHeight) {
				this.hHeight = hHeight;
			},

			getHalfHeight : function() {
				return this.hHeight;
			},

			render : function() {
				$g.strokeRect(this.pos.x - this.hWidth, this.pos.y - this.hHeight, this.hWidth * 2, this.hHeight * 2);
			}
		};
		aabb.constructor(params);

		return aabb;
	},

	Plane : function(params) {
		var plane = {
			type : "plane",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		plane.constructor(params);

		return plane;
	},

	Circle : function(params) {
		var circle = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			radius : 1.0,
			type : "circle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setX : function(x) {
				this.pos.setX(x);
			},

			getX : function() {
				return this.pos.getX();
			},

			setY : function(y) {
				this.pos.setY(y);
			},

			getY : function() {
				return this.pos.getY();
			},

			setRadius : function(radius) {
				this.radius = radius;
			},

			getRadius : function() {
				return this.radius;
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
				$g.stroke();
			}
		};
		circle.constructor(params);

		return circle;
	},

	Polygon : function(params) {
		var polygon = {
			points : [],
			type : "polygon",

			constructor : function(params) {
				var i, len;
				i = 0;
				len = params.length;

				for(i; i < len; i += 1) {
					this.addPoint(params[i]);
				}
			},

			addPoint : function(point) {
				this.points.push(point);
			},

			removePoint : function(i) {
				this.points.slice(i, 1);
			},

			removeFirst : function() {
				this.points.shift();
			},

			removeLast : function() {
				this.points.pop();
			},

			render : function() {
				var len, i;
				i = 1;
				len = this.points.length;

				if(len < 3) {
					return 0;
				}

				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);
				for(i; i < len; i += 1) {
					$g.lineTo(this.points[i].x, this.points[i].y);
				}
				$g.lineTo(this.points[0].x, this.points[0].y)
				$g.stroke();
			}
		};
		polygon.constructor(params);

		return polygon;
	},

	Bezier : function(params) {
		var bezier = {
			p0 : new GSGL.geometry.Vector2D(0.0, 0.0),
			p1 : new GSGL.geometry.Vector2D(0.0, 1.0),
			c0 : new GSGL.geometry.Vector2D(1.0, 0.0),
			c1 : new GSGL.geometry.Vector2D(1.0, 1.0),
			render_step : 0.01,
			type : "bezier",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			getPoint : function(t) {
				if(t != 0) {
					var u, t, uu, uuu, ttt, p;
					u = 1 - t;
					tt = t * t;
					uu = u * u;
					uuu = uu * u;
					ttt = tt * t;
					
					p = this.p0.scale(uuu);
					p = p.add(this.c0.scale(3 * uu * t));
					p = p.add(this.c1.scale(3 * u * tt));
					p = p.add(this.p1.scale(ttt));
				} else {
					p = this.p0;
				}
				
				return p;
			},
			
			setStartPoint : function(x, y) {
				this.p0.setPosition(x, y);
			},
			
			setEndPoint : function(x, y) {
				this.p1.setPosition(x, y);
			},
			
			setControlPoint : function(controlpoint, x, y) {
				this["c" + controlpoint].setPosition(x, y);
			},
			
			setRenderStep : function(value) {
				this.render_step = value;
			},
			
			render : function() {
				var i, length;
				
				i = 0;
				length = 1 / this.render_step;
				
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				for(i; i < length; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
			},
			
			renderEdit : function() {
				var i, length;
				
				i = 0;
				length = 1 / this.render_step;
				
				// Render the bezier curve
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				for(i; i < length; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
				
				$g.save();
				$g.lineWidth = 1;
				// Render control points
				$g.beginPath();
				$g.arc(this.c0.x, this.c0.y, 4, 2 * Math.PI, false);
				$g.stroke();
				
				$g.beginPath();
				$g.arc(this.c1.x, this.c1.y, 4, 2 * Math.PI, false);
				$g.stroke();
				
				// Lines
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.c0.x, this.c0.y);
				$g.stroke();

				$g.beginPath();
				$g.moveTo(this.p1.x, this.p1.y);
				$g.lineTo(this.c1.x, this.c1.y);
				$g.stroke();
				$g.restore();

				// Render start and end points.
				$g.fillRect(this.p0.x - 3, this.p0.y - 3, 6, 6);
				$g.fillRect(this.p1.x - 3, this.p1.y - 3, 6, 6);
			}
		};
		bezier.constructor(params);

		return bezier;
	},

	/* B-Spline primitive
	 * * * * * * * * * * * *
	 * Code based on BSpline by Tagussan licenced under The MIT Licence
	 * https://github.com/Tagussan/BSpline
	 */
	BSpline : function(params) {
		var bSpline = {
			points : [],
			degree : 2,
			range : 2,
			render_step: 0.01,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addPoint : function(point) {
				this.points.push(point);
			},

			removePoint : function(i) {
				this.points.splice(i, 1);
			},

			removeFirst : function() {
				this.points.shift();
			},

			removeLast : function() {
				this.points.pop();
			},

			setDegree : function(degree) {
				if(typeof(degree) == "number" && degree >= 2 && degree <= 5) {
					this.degree = degree;
				}

				if(this.degree == 2 || this.degree == 3) {
					this.range = 2;
				} else {
					this.range = 3;
				}
			},

			basisDeg2 : function(x) {
			    if(-0.5 <= x && x < 0.5) {
			        return 0.75 - x * x;
			    } else if(0.5 <= x && x <= 1.5) {
			        return 1.125 + (-1.5 + x / 2.0) * x;
			    } else if(-1.5 <= x && x < -0.5) {
			        return 1.125 + (1.5 + x / 2.0) * x;
			    } else {
			        return 0;
			    }
			},

			basisDeg3 : function(x) {
			    if(-1 <= x && x < 0) {
			        return 2.0 / 3.0 + (-1.0 - x / 2.0) * x * x;
			    } else if(1 <= x && x <= 2) {
			        return 4.0 / 3.0 + x * (-2.0 + (1.0 - x / 6.0) * x);
			    } else if(-2 <= x && x < -1) {
			        return 4.0 / 3.0 + x *(2.0 + (1.0 + x / 6.0) * x);
			    } else if(0 <= x && x < 1) {
			        return 2.0 / 3.0 + (-1.0 + x / 2.0) * x * x;
			    } else {
			        return 0;
			    }
			},

			basisDeg4 : function(x) {
			    if(-1.5 <= x && x < -0.5) {
			        return 55.0 / 96.0 + x * (-(5.0 / 24.0) + x * (-(5.0 / 4.0) + (-(5.0 / 6.0) - x / 6.0) * x));
			    } else if(0.5 <= x && x < 1.5) {
			        return 55.0 / 96.0 + x * (5.0 / 24.0 + x * (-(5.0 / 4.0) + (5.0 / 6.0 - x / 6.0) * x));
			    } else if(1.5 <= x && x <= 2.5) {
			        return 625.0 / 384.0 + x * (-(125.0 / 48.0) + x * (25.0 / 16.0 + (-(5.0 / 12.0) + x / 24.0) * x));
			    } else if(-2.5 <= x && x <= -1.5) {
			        return 625.0 / 384.0 + x * (125.0 / 48.0 + x * (25.0 / 16.0 + (5.0 / 12.0 + x / 24.0) * x));
			    } else if(-1.5 <= x && x < 1.5) {
			        return 115.0 / 192.0 + x * x * (-(5.0 / 8.0) + x * x / 4.0);
			    } else {
			        return 0;
			    }
			},

			basisDeg5 : function(x) {
			    if(-2 <= x && x < -1) {
			        return 17.0 / 40.0 + x * (-(5.0 / 8.0) + x * (-(7.0 / 4.0) + x * (-(5.0 / 4.0) + (-(3.0 / 8.0) - x / 24.0) * x)));
			    } else if(0 <= x && x < 1) {
			        return 11.0 / 20.0 + x * x * (-(1.0 / 2.0) + (1.0 / 4.0 - x / 12.0) * x * x);
			    } else if(2 <= x && x <= 3) {
			        return 81.0 / 40.0 + x * (-(27.0 / 8.0) + x * (9.0 / 4.0 + x * (-(3.0 / 4.0) + (1.0 / 8.0 - x / 120.0) * x)));
			    } else if(-3 <= x && x < -2) {
			        return 81.0 / 40.0 + x *(27.0 / 8.0 + x * (9.0 / 4.0 + x * (3.0 / 4.0 + (1.0 / 8.0 + x / 120.0) * x)));
			    } else if(1 <= x && x < 2) {
			        return 17.0 / 40.0 + x * (5.0 / 8.0 + x * (-(7.0 / 4.0) + x * (5.0 / 4.0 + (-(3.0 / 8.0) + x / 24.0) * x)));
			    } else if(-1 <= x && x < 0) {
			        return 11.0 / 20.0 + x * x * (-(1.0 / 2.0) + (1.0 / 4.0 + x / 12.0) * x * x);
			    } else {
			        return 0;
			    }
			},

			getLength : function(subdiv) {
				var chunkLen = [];
				var index;
				var samples;
				var pos;
				var oldPos;
				var tmpVec;
				var totalLen = 0;
				var point = 0;
				var intPoint = 0;
				var oldIntPoint = 0;

				chunkLen[0] = 0;
				
				if(!subdiv) {
					subdiv = 100;
				}

				samples = this.points.length * subdiv;
				oldPos = new GSGL.geometry.Vector2D(this.points[0].x, this.points[0].y);

				var i = 1;
				var len = samples;

				for(i; i < len; i += 1) {
					index = i / samples;

					pos = this.getPoint(index);
					tmpVec = new GSGL.geometry.Vector2D(pos.x, pos.y);

					totalLen += tmpVec.distanceTo(oldPos);
					oldPos = new GSGL.geometry.Vector2D(pos.x, pos.y);

					point = (this.points.length - 1) * index;
					intPoint = Math.floor(point);

					if(intPoint != oldIntPoint) {
						chunkLen[intPoint] = totalLen.toFixed(8);
						oldIntPoint = intPoint;
					}
				}

				chunkLen[chunkLen.length] = totalLen;

				return {chunks: chunkLen, total: totalLen};
			},

			reparametrizeByArcLength : function(samplingCoef) {
				var newPoints = [];
				var i = 1;
				var len = this.points.length;
				var sl = this.getLength(100);
				var realDistance;
				var sampling;
				var pos;
				var indexCurrent;
				var index;
				var indexNext;

				newPoints.push(new GSGL.geometry.Point(this.points[0].x, this.points[0].y));

				for(i; i < len; i += 1) {
					realDistance = sl.chunks[i] - sl.chunks[i - 1];

					sampling = Math.ceil(samplingCoef * realDistance / sl.total);

					indexCurrent = (i - 1) / (this.points.length - 1);
					indexNext = i / (this.points.length - 1);

					var j = 1;

					for(j; j < sampling - 1; j += 1) {
						index = indexCurrent + j * (1 / sampling) * (indexNext - indexCurrent);

						pos = this.getPoint(index);
						newPoints.push(new GSGL.geometry.Point(pos.x, pos.y));
					}
				}

				this.points = newPoints;
			},

			interpolate : function(sequence, t) {
				var fn = this["basisDeg" + this.degree];
			    var tInt = Math.floor(t);
			    var result = 0;
			    var i = tInt - this.range;
			    var len = tInt + this.range;

			    for(i; i <= len; i += 1) {
			        result += sequence(i) * fn(t - i);
			    }

			    return result;
			},

			sequenceAt : function(dim) {
				var points = this.points;
    			var margin = this.degree + 1;

			    return function(n){
			        if(n < margin){
			            return points[0][dim];
			        } else if(points.length + margin <= n) {
			            return points[points.length - 1][dim];
			        } else {
			            return points[n - margin][dim];
			        }
			    };
			},

			getPoint : function(t) {
				var len = this.points.length;

				t = t * ((this.degree + 1) * 2 + len);

				return new GSGL.geometry.Point(this.interpolate(this.sequenceAt("x"), t), this.interpolate(this.sequenceAt("y"), t));
			},

			render : function() {
				var i, len;
				
				i = 0;
				len = 1 / this.render_step;
				
				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);
				for(i; i < len; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}

				len = this.points.length - 1;

				$g.lineTo(this.points[len].x, this.points[len].y);
				$g.stroke();
			},

			renderEdit : function() {
				var i, len;
				
				i = 0;
				len = 1 / this.render_step;
				
				// Render the B-Spline
				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);

				for(i; i < len; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}

				len = this.points.length - 1;

				$g.lineTo(this.points[len].x, this.points[len].y);
				$g.stroke();

				i = 0;
				len = this.points.length;
				// Render Control Points
				for(i; i < len; i += 1) {
					$g.beginPath();
					$g.arc(this.points[i].x, this.points[i].y, 4, 2 * Math.PI, false);
					$g.stroke();
				}
			}
		};
		bSpline.constructor(params);

		return bSpline;
	},
};
GSGL.graphics = {
	Sprite : function(params) {
		var sprite = {
			uid: 0,
			source: "",
			image: new Image(),
			logger: new GSGL.utility.Logger('image'),
			width: 0,
			height: 0,
			loaded: false,
			manager: {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				if(this.source != undefined) {
					this.load(this.source);
				}
			},

			load : function(src) {
				this.uid = $resourceManager.addResource("image");
				this.source = src;
				this.image.setAttribute("src", src);
				
				this.addEventListeners();
			},

			render : function(x, y) {
				$g.drawImage(this.image, x, y);
			},

			renderSize : function(x, y, width, height) {
				$g.drawImage(this.image, x, y, width, height);
			},

			renderSegment : function(x, y, sX, sY, sWidth, sHeight) {
				$g.drawImage(this.image, sX, sY, sWidth, sHeight, x, y, this.width, this.height);
			},

			renderSegmentSize : function(x, y, sX, sY, sWidth, sHeight, width, height) {
				$g.drawImage(this.image, sX, sY, sWidth, sHeight, x, y, width, height);
			},

			loadHandler : function(event) {
				this.loaded = true;
				$resourceManager.setLoaded(this.uid);
			},

			errorHandler : function(event) {
				$log.add("image", "Error loading image!");
			},

			addEventListeners : function() {
				var _this = this;

				this.image.addEventListener("load", function(event) {
					_this.loadHandler(event);
				});

				this.image.addEventListener("error", function(event) {
					_this.errorHandler(event);
				});
			}
		};
		sprite.constructor(params);

		return sprite;
	},

	SpriteSheet : function() {
		
	},

	Animation : function() {

	},

	Color : function(params) {
		var color = {
			r: 0,
			g: 0,
			b: 0,
			a: 0,
			h: 0,
			s: 0,
			l: 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setRGB : function(r, g, b) {
				this.r = r;
				this.g = g;
				this.b = b;
				this.RGBtoHSL();
			},

			setHSL : function(h, s, l) {
				this.h = h;
				this.s = s;
				this.l = l;
				this.HSLtoRGB();
			},

			setAlpha : function(alpha) {
				this.a = alpha;
			},

			setRGBA : function(r, g, b, a) {
				this.setRGB(r, g, b);
				this.setAlpha(a);
			},

			getRGB : function() {
				return {r: this.r, g: this.g, b: this.b};
			},

			getHSL : function() {
				return {h: this.h, s: this.s, l: this.l};
			},

			setRed : function(r) {
				this.r = r;
			},

			setGreen : function(g) {
				this.g = g;
			},

			setBlue : function(b) {
				this.b = b;
			},

			setHue : function(h) {
				this.h = h;
			},

			setSaturation : function(s) {
				this.s = s;
			},

			setLightness : function(l) {
				this.l = l;
			},

			getAlpha : function() {
				return this.a;
			},

			getRGBA : function() {
				return {r: this.r, g: this.g, b: this.b, a: this.a};
			},

			getRGBAFloat : function() {
				return {r: this.toFloat(this.r), g: this.toFloat(this.g), b: this.toFloat(this.b), a: this.toFloat(this.a)};
			},

			getRGBAFloatArray : function() {
				return [this.toFloat(this.r), this.toFloat(this.g), this.toFloat(this.b), this.a];
			},

			getRGBAInt : function() {
				return {r: this.toInt(this.r), g: this.toInt(this.g), b: this.toInt(this.b), a: this.toInt(this.a)};
			},

			RGBtoHSL : function() {
				var h, s, l, r, g, b, cmax, cmin, redc, greenc, bluec;
				r = this.r;
				g = this.g;
				b = this.b;

				cmax = (r > g) ? r : g;
				if(b > cmax) {
					cmax = b;
				}
				cmin = (r < g) ? r : g;
				if(b < cmin) {
					cmin = b;
				}

				l = cmax / 255.0;
				if(cmax != 0) {
					s = (cmax - cmin) / cmax;
				} else {
					s = 0;
				}
				if(s == 0) {
					h = 0;
				} else {
					redc = (cmax - r) / (cmax - cmin);
					greenc = (cmax - g) / (cmax - cmin);
					bluec = (cmax - b) / (cmax - cmin);
					if(r == cmax) {
						h = bluec - greenc;
					} else if(g == cmax) {
						h = 2.0 + redc - bluec;
					} else {
						h = 4.0 + greenc - redc;
					}
					h = h / 6.0;
					if(h < 0) {
						h = h + 1.0;
					}
				}
				this.h = h;
				this.s = s;
				this.l = l;
			},
			
			HSLtoRGB : function() {
				var r, g, b, h, hue, s, l, f, p, q, t;
				r = 0;
				g = 0;
				b = 0;
				hue = this.h;
				s = this.s;
				l = this.l;

				if(this.s == 0) {
					r = Math.floor(l * 255 + 0.5);
					g = Math.floor(l * 255 + 0.5);
					b = Math.floor(l * 255 + 0.5);
				} else {
					h = (hue - Math.floor(hue)) * 6.0;
					f = h - Math.floor(h);
					p = l * (1.0 - s);
					q = l * (1.0 - s * f);
					t = l * (1.0 - (s * (1.0 - f)));
					switch(Math.floor(h)) {
						case 0:
							r = (l * 255.0 + 0.5);
							g = (t * 255.0 + 0.5);
							b = (p * 255.0 + 0.5);
							break;
						case 1:
							r = (q * 255.0 + 0.5);
							g = (l * 255.0 + 0.5);
							b = (p * 255.0 + 0.5);
							break;
						case 2:
							r = (p * 255.0 + 0.5);
							g = (l * 255.0 + 0.5);
							b = (t * 255.0 + 0.5);
							break;
						case 3:
							r = (p * 255.0 + 0.5);
							g = (q * 255.0 + 0.5);
							b = (l * 255.0 + 0.5);
							break;
						case 4:
							r = (t * 255.0 + 0.5);
							g = (p * 255.0 + 0.5);
							b = (l * 255.0 + 0.5);
							break;
						case 5:
							r = (l * 255.0 + 0.5);
							g = (p * 255.0 + 0.5);
							b = (q * 255.0 + 0.5);
							break;
					}
				}
				this.r = Math.floor(r);
				this.g = Math.floor(g);
				this.b = Math.floor(b);
			},

			getHex : function() {
			    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
			},
			
			setHex : function(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

			    this.r = parseInt(result[1], 16);
			    this.g = parseInt(result[2], 16);
			    this.b = parseInt(result[3], 16);
			    
			    this.RGBtoHSL();
			},

			toFloat : function(value) {
				if(value != 0) {
					return value / 255;
				} else {
					return 0.0;
				}
			},

			toInt : function(value) {
				return value * 255;
			}
		};
		color.constructor(params);

		return color;
	},

	interpolate : function(color1, color2, scale) {
		var color = new GSColor({r: 0, g: 0, b: 0, a: 255});
		var c0 = color1.getRGBAFloat();
		var c1 = color2.getRGBAFloat();

		color.r = c0.r + (c1.r - c0.r) * scale;
		color.g = c0.g + (c1.g - c0.g) * scale;
		color.b = c0.b + (c1.b - c0.b) * scale;
		color.a = c0.a + (c1.a - c0.a) * scale;

		return color.getRGBAInt();
	}
};
GSGL.physics = {
	pointLine : function(point, line) {

	},

	pointTriangle : function(point, triangle) {

	},

	pointCircle : function(point, circle) {
		var v0, v1, len;
		v0 = new GSGL.geometry.Vector2D(point.x, point.y);
		v1 = new GSGL.geometry.Vector2D(circle.pos.x, circle.pos.y);
		len = v1.subtract(v0).length();

		return len < circle.radius;
	},

	pointRectangle : function(point, rectangle) {
		return (point.x > rectangle.pos.x && point.x < rectangle.pos.x + rectangle.width && 
				point.y > rectangle.pos.y && point.y < rectangle.pos.y + rectangle.height);
	},

	pointPolygon : function(point, polygon) {

	},

	lineLine : function(line1, line2) {

	},

	lineTriangle : function(line, triangle) {

	},

	lineCircle : function(line, circle) {

	},

	lineRectangle : function(line, rectangle) {

	},

	linePolygon : function(line, polygon) {

	},

	triangleTriangle : function(triangle1, triangle2) {

	},

	triangleCircle : function(triangle, circle) {

	},

	triangleRectangle : function(triangle, rectangle) {

	},

	trianglePolygon : function(triangle, polygon) {

	},

	circleCircle : function(c0, c1) {
		var v0, v1, vLen, cRadi;
		v0 = new GSGL.geometry.Vector2D(c0.pos.x, c0.pos.y);
		v1 = new GSGL.geometry.Vector2D(c1.pos.x, c1.pos.y);
		len = v1.subtract(v0).length();
		cRadi = c0.radius + c1.radius;

		return len < cRadi;
	},

	circleRectangle : function(circle, rectangle) {

	},

	circlePolygon : function(circle, polygon) {

	},

	rectangleRectangle : function(rectangle1, rectangle2) {
		return (rectangle1.pos.x + rectangle1.width >= rectangle2.pos.x && 
				rectangle1.pos.y + rectangle1.height >= rectangle2.pos.y && 
				rectangle1.pos.x <= rectangle2.pos.x + rectangle2.width && 
				rectangle1.pos.y <= rectangle2.pos.y + rectangle2.height);
	},

	rectanglePolygon : function(rectangle, polygon) {

	},

	polygonPolygon : function(polygon1, polygon2) {

	},

	intersects : function(shape1, shape2) {
		if(typeof( GSGL.physics[shape1.type + GSGL.utility.capitalize(shape2.type)] ) == "function") {
			//GSAW.cLog("Intersects", "Using collider: " + shape1.type + GSAW.engine.Utility.capitalize(shape2.type));
			return GSGL.physics[shape1.type + GSGL.utility.capitalize(shape2.type)](shape1, shape2);
		} else if(typeof( GSGL.physics[shape2.type + GSGL.utility.capitalize(shape1.type)] ) == "function") {
			//GSAW.cLog("Intersects", "Using collider: " + shape2.type + GSAW.engine.Utility.capitalize(shape1.type));
			return GSGL.physics[shape2.type + GSGL.utility.capitalize(shape1.type)](shape2, shape1);
		} else {
			//GSAW.cLog("Collision", "Couldn't find a collider for the objects!");
			return 0;
		}
	}
};
GSGL.resource = {
	_UID : 0,

	GetUniqueId : function() {
		GSGL.resource._UID++;

		return GSGL.resource._UID;
	},

	ResourceManager : function(params) {
		var resourceManager = {
			resources : {},
			total : {
				images : 0,
				imagesLoaded : 0,
				audio : 0,
				audioLoaded : 0,
				files : 0,
				filesLoaded : 0,
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addResource : function(type) {
				var resource = new GSGL.resource.Resource({type: type, id: GSGL.resource.GetUniqueId()});
				
				this.resources[resource.getId()] = resource;
				this.total.files += 1;

				switch(type) {
					case "image":
						this.total.images += 1;
						break;
					case "audio":
						this.total.audio += 1;
						break;
					default:
						this.imageResources += 1;
				}

				return resource.getId();
			},

			setLoaded : function(id) {
				this.resources[id].setLoaded(true);

				this.total.filesLoaded += 1;

				switch(this.resources[id].getType()) {
					case "image":
						this.total.imagesLoaded += 1;
						break;
					case "audio":
						this.total.audioLoaded += 1;
						break;
				}
			},

			checkProgress : function(type) {
				var response = {
					total : 0,
					loaded : 0,
					percent : 0,
				};

				if(type != undefined) {
					switch(type) {
						case "image":
							response.total = this.total.images;
							response.loaded = this.total.imagesLoaded;
							
							break;
						case "audio":
							response.total = this.total.audio;
							response.loaded = this.total.audioLoaded;
							break;
						default:
							response.total = this.total.files;
							response.loaded = this.total.filesLoaded;
					}
				} else {
					response.total = this.total.files;
					response.loaded = this.total.filesLoaded;
				}

				if(response.total != 0 && response.loaded != 0) {
					response.percent = Math.ceil((response.loaded / response.total) * 100)
				}

				return response;
			},

			isLoaded : function() {
				var response = this.checkProgress();
				if(response.percent == 100) {
					return true;
				} else {
					return false;
				}
			},
		};
		resourceManager.constructor(params);

		return resourceManager;
	},

	Resource : function(params) {
		var resource = {
			id : 0,
			type : "image",
			loaded : false,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			getId : function() {
				return this.id;
			},

			setType : function(type) {
				this.type = type;
			},

			getType : function() {
				return this.type;
			},

			setLoaded : function(loaded) {
				this.loaded = loaded;
			},

			getLoaded : function() {
				return this.loaded;
			},
		};
		resource.constructor(params);

		return resource;
	},
};
GSGL.surface = {
	Surface2D : function(params) {
		var surface2d = {
			logger: new GSGL.utility.Logger({type:"2d Surface"}),
			width: 640,
			height: 360,
			pos: {
				x: 0,
				y: 0,
				z: 1,
			},
			id: "",
			canvas : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.logger.log("Created 2d Surface", this);

				this.generateCanvas();
			},

			generateCanvas : function() {
				var container = document.getElementById(GSGL.CONTAINER_ID);
				this.canvas = document.createElement("canvas");

				this.canvas.setAttribute('id', this.id);
				this.canvas.setAttribute('width', this.width);
				this.canvas.setAttribute('height', this.height);

				this.canvas.style.position = "absolute";
				this.canvas.style.top = this.pos.y;
				this.canvas.style.left = this.pos.x;
				this.canvas.style.zIndex = this.pos.z;

				container.appendChild(this.canvas);
			},

			getContext : function() {
				return this.canvas.getContext("2d");
			},

			clear : function(color) {
				var ctx = this.getContext();
				ctx.clearRect(0, 0, this.width, this.height);
				if(color != undefined) {
					ctx.save();
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, this.width, this.height);
					ctx.restore();
				}
			},

			toDataUrl : function() {
				return this.canvas.toDataUrl('image/png');
			},

			setPos : function(x, y, z) {
				this.pos.x = x;
				this.pos.y = y;
				this.pos.z = z;
			},

			setPosZ : function(z) {
				this.pos.z = z;
			}
		};
		surface2d.constructor(params);

		return surface2d;
	},

	Surface3D : function(params) {
		var surface3d = {
			logger: new GSGL.utility.Logger({type:"3d Surface"}),
			width: 640,
			height: 360,
			pos: {
				x: 0,
				y: 0,
				z: 1,
			},
			id: "",
			canvas : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.logger.log("Created 3d Surface", this);

				this.generateCanvas();
			},

			generateCanvas : function() {
				var container = document.getElementById(GSGL.CONTAINER_ID);
				this.canvas = document.createElement("canvas");

				this.canvas.setAttribute('id', this.id);
				this.canvas.setAttribute('width', this.width);
				this.canvas.setAttribute('height', this.height);

				this.canvas.style.position = "absolute";
				this.canvas.style.top = this.pos.y;
				this.canvas.style.left = this.pos.x;
				this.canvas.style.zIndex = this.pos.z;

				container.appendChild(this.canvas);
			},

			initContext : function() {
				gl = null;
				try {
					gl = this.canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}) || this.canvas.getContext("webgl", {preserveDrawingBuffer: true});
				} catch(e) {
					this.logger.log("Doh!, Something went wrong: " + e);
					return 0;
				}

				this.logger.log("WebGL initialized successfully!");
				gl.clearColor(0.0, 0.0, 0.0, 1.0);
			},

			clear : function() {
    			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			},

			toUrl : function() {
				return this.canvas.toDataURL("image/png");
			},
		};
		surface3d.constructor(params);

		return surface3d;
	},
};
GSGL.ui = {
	Button : function(params) {
		var button = {
			shape : {},
			title : "Button",
			states : {
				"inactive" : {
					background: new GSGL.graphics.Color({r: 255, g: 255, b: 255}),
					color: new GSGL.graphics.Color({r: 0, g: 0, b: 0}),
					border: new GSGL.graphics.Color({r: 0, g: 0, b: 0})
				},
				"hover" : {
					background: new GSGL.graphics.Color({r: 200, g: 200, b: 200}),
					color: new GSGL.graphics.Color({r: 0, g: 0, b: 0}),
					border: new GSGL.graphics.Color({r: 255, g: 0, b: 0})
				}
			},
			currentState : "inactive",
			callback : {},
			hover: false,


			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function() {
				var point = new GSGL.geometry.Point($mouse.X, $mouse.Y);

				this.hover = $intersects(point, this.shape);

				if(this.hover) {
					this.currentState = "hover";
					if($mouse.CLICK[0]) {
						if(typeof(this.callback) == 'function') {
							this.callback();
						}
					}
				} else {
					this.currentState = "inactive";
				}
			},

			render : function() {
				$g.save();

				$g.font = "14px Helvetica";
				$g.textAlign = "center";
				$g.textBaseline = "middle";
				$g.fillStyle = this.states[this.currentState].background.getHex();
				$g.strokeStyle = this.states[this.currentState].border.getHex();
				$g.strokeRect(this.shape.getX(), this.shape.getY(), this.shape.getWidth(), this.shape.getHeight());
				$g.fillRect(this.shape.getX(), this.shape.getY(), this.shape.getWidth(), this.shape.getHeight());
				$g.fillStyle = this.states[this.currentState].color.getHex();
				$g.fillText(this.title, this.shape.getX() + this.shape.getWidth() / 2, this.shape.getY() + this.shape.getHeight() / 2);
				
				$g.restore();
			},
		};
		button.constructor(params);

		return button;
	},

	Radio : function(params) {
		var radio = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		radio.constructor(params);

		return radio;
	},

	Checkbox : function(params) {
		var checkbox = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		checkbox.constructor(params);

		return checkbox;
	},
};
GSGL.utility = {
	EPSILON : 0.000001,
	PI : Math.PI,

	Resolution : function(params) {
		var resolution = {
			WIDTH : 0,
			HEIGHT : 0,
			REAL_WIDTH : 0,
			REAL_HEIGHT : 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				console.log('Real width: ' + this.REAL_WIDTH + ' Real height: ' + this.REAL_HEIGHT + ' Width: ' + this.WIDTH + ' Height: ' + this.HEIGHT);
			},

			getX : function(x) {
				return (x / this.REAL_WIDTH) * this.WIDTH; 
			},

			getY : function(y) {
				return (y / this.REAL_HEIGHT) * this.HEIGHT;
			},

			getWidth : function(width) {
				return (this.REAL_WIDTH / this.WIDTH) * width;
			},

			getHeight : function(height) {
				return (this.REAL_HEIGHT / this.HEIGHT) * height;
			}
		};
		resolution.constructor(params);

		return resolution;
	},

	Ajax : function(params) {
		var ajax = {
			async : false,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			createXHR : function() {
				try { return new XMLHttpRequest(); } catch(err) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(err) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(err) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch(err) {}
				try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(err) {}

				return null;
			},

			load : function(src, callback) {
				var xhr = this.createXHR();
				if(xhr) {
					xhr.open("GET", src, this.async);
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4 && xhr.status == 200) {
							callback(xhr);
						}
					};
					xhr.send(null);
				}
			}
		};
		ajax.constructor(params);

		return ajax;
	},

	Logger : function(params) {
		var logger = {
			console : true,
			type : "",

			constructor : function(params) {
				this.type = params.type;
			},

			canLogToConsole : function() {
				if(typeof(console) == 'object') {
					this.console = true;
				} else {
					this.console = false;
				}
			},

			log : function(msg, obj) {
				if(this.console) {
					if(typeof(obj) == 'object') {
						console.log("[" + this.type + "]" + msg, obj);
					} else {
						console.log("[" + this.type + "]" + msg);
					}
				}
			},

			debug : function(msg, obj) {

			},

			info : function(msg, obj) {
				if(this.console) {
					if(typeof(obj) == 'object') {
						console.info("[" + this.type + "]" + msg, obj);
					} else {
						console.info("[" + this.type + "]" + msg);
					}
				}
			},
		};
		logger.constructor(params);

		return logger;
	},

	degreeToRadian : function(degree) {
		return degree * (GSGL.utility.PI/180);
	},

	radianToDegree : function(radian) {
		return radian * (180/GSGL.utility.PI);
	},

	capitalize : function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
};
GSGL.tilemap = {
	Tilemap : function(params) {
		var tilemap = {
			layers : [],
			tilesets : [],
			width : 0,
			height : 0,
			tilewidth : 0,
			tileheight : 0,
			backgroundcolor : new GSGL.graphics.Color(),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			/* Tiled map loader
			 * Must be uncompressed base64 data encoded orthogonal right-down
			 * map
			 */
			loadTiledMap : function(url) {
				var _this = this;
				var ajax = new GSGL.utility.Ajax();
				ajax.load(url, function(data) {
					var tiledMap = JSON.parse(data.responseText);
					console.log(tiledMap);

					// First we set the tilemap properties
					_this.width = tiledMap.width;
					_this.height = tiledMap.height;
					_this.tileWidth = tiledMap.tilewidth;
					_this.tileHeight = tiledMap.tileheight;
					_this.backgroundColor.setHex(tiledMap.backgroundcolor);

					// Then we create the layers
					for(var i in tiledMap.layers) {
						_this.layers.push(new GSGL.tilemap.TilemapLayer(tiledMap.layers[i]));
						_this.layers[i].decodeTileData();
					}

					// And last we import the sprite sheet that is the tiles
					for(var i in tiledMap.tilesets) {
						_this.tilesets.push(new GSGL.tilemap.Tileset(tiledMap.tilesets[i]));
					}

					// Let's output the tilemap in all it's glory!
					console.log(_this);
				});
			}
		};
		tilemap.constructor(params);

		return tilemap;
	},

	TilemapLayer : function(params) {
		var tilemapLayer = {
			tiles : [],
			data : "",
			encoding : "base64",
			height : 0,
			width : 0,
			x : 0,
			y : 0,
			visible : true,
			opacity : 1,
			type : "tilelayer",
			name : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			decodeTileData : function() {
				var rawData = new Int32Array(atob(this.data));

				console.log(rawData);
			},
		};
		tilemapLayer.constructor(params);

		return tilemapLayer;
	},

	Tileset : function(params) {
		var tileset = {
			image : "",
			imagewidth : 0,
			imageheight : 0,
			tilecount : 0,
			tilewidth : 0,
			tileheight : 0,
			firstgid : 0,
			columns : 0,
			margin : 0,
			spacing : 0,
			name : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		tileset.constructor(params);

		return tileset;
	},

	Tile : function(params) {
		var tile = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		tile.constructor(params);

		return tile;
	}
};
GSGL.gl = {
	VERTEX_SHADER : 0,
	FRAGMENT_SHADER : 1,

	Application : function(params) {
		var application = {
			container : '',
			lastDelta : new Date().getTime(),
			timerId : 0,
			targetFps : 20,
			lastUpdate : 0,
			fps : 30,
			frames : 0,
			width : 640,
			height : 480,
			canvasId : "",
			logger : new GSGL.utility.Logger({type: "WebGL Application"}),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.initGlobals();
			},

			initGlobals : function() {
				$surface = new GSGL.surface.Surface3D({id: this.canvasId, width: this.width, height: this.height});
				$surface.initContext();

				GSGL.WIDTH = this.width;
				GSGL.HEIGHT = this.height;

				var realWidth = $surface.canvas.clientWidth;
				var realHeight = $surface.canvas.clientHeight;

				$resolution = new GSGL.utility.Resolution({WIDTH: GSGL.WIDTH, HEIGHT: GSGL.HEIGHT, REAL_WIDTH: realWidth, REAL_HEIGHT: realHeight});
				// Global mouse, touch and keyboard event handelers.
				$mouse = new GSGL.event.MouseManager({target: GSGL.CONTAINER_ID,});
				$mouse.RESOLUTION = true;
				$touch = new GSGL.event.TouchManager({target: GSGL.CONTAINER_ID,});
				$touch.RESOLUTION = true;
				$keyboard = new GSGL.event.KeyboardManager();
				// Global collision detection, takes to shapes and checks if they intersects.
				$intersects = GSGL.physics.intersects;
				// General AJAX helper class
				$ajax = new GSGL.utility.Ajax({});
				// Resource manager, keeps track so that everything is loaded right
				$resources = new GSGL.resource.ResourceManager();
				// Texture manager keeps track on active textures
				$textureManager = new GSGL.gl.texture.TextureManager();
				// Shader manager keeps track on all shader programs and loading/compiling of shaders
				$shaderManager = new GSGL.gl.shader.ShaderManager();
				// Render manager handles all rendercalls and optimize GPU communication
				$renderManager = new GSGL.gl.render.RenderManager2D();
			},

			start : function() {
				var _this = this;

				if($resources.isLoaded()) {
					this.timerId = window.setInterval(function() {
						_this.step();
					}, (1000/_this.targetFps));
				} else {
					window.setTimeout(function() {
						_this.start();
					}, 100)
				}
			},

			stop : function() {
				window.clearInterval(this.timerId);
			},

			step : function() {
				this.update();
			},

			update : function() {
				var now = new Date().getTime();
				var delta = now - this.lastDelta;
				this.lastDelta = now;

				this.state.update(delta);
				this.state.render(delta);

				// Check if the user wants to render the FPS
				if(this.showFps) {
					this.renderFps();
				}

				if(now - this.lastUpdate > 1000) {
					this.fps = this.frames;
					this.frames = 0;
					this.lastUpdate = now;
				} else {
					this.frames += 1;
				}

				$mouse.clearClicks();
			},

			/* Set State
			 * * * * * * *
			 * This is were we init the application or it's childstates, we do this by stopping current state
			 * and init the new state, then we call the start method that checks if everything is loaded before
			 * it start the state loop. We can add functionality here so that we run the splash/loading screen
			 * betwixt states, and at the start of the application.
			 *
			 * The state always keeps a reference to this class as it needs it for global application
			 * commands as well as state changes.
			 *
			 * ToDo: Write a general purpose Splash/Loader for state changes.
			 */
			setState : function(state) {
				var _this = this;
				this.stop();
				this.state = new state({application: _this});
				this.start();
			},
		};
		application.constructor(params);

		return application;
	},
};
GSGL.gl.shader = {
	ShaderManager : function(params) {
		var shaderManager = {
			programs : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			createProgram : function(fShader, vShader, id) {
				this.programs[id] = new GSGL.gl.shader.Program();
				this.programs[id].initShaders(fShader, vShader);
			},

			getProgram : function(id) {
				return this.programs[id].getProgram();
			},

			useProgram : function(id) {
				gl.useProgram(this.programs[id].getProgram());
			},
		};
		shaderManager.constructor(params);

		return shaderManager;
	},

	Program : function(params) {
		var program = {
			vShader : {},
			fShader : {},
			program : {},
			logger : new GSGL.utility.Logger("shader"),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			loadShader : function(type, shader) {
				var shaderScript = shader;

				if(type == GSGL.gl.VERTEX_SHADER) {
					this.vShader = this.compileShader(type, shader);
				} else {
					this.fShader = this.compileShader(type, shader);
				}
			},

			compileShader : function(type, shaderSrc) {
				var shader;

				if(type == GSGL.gl.VERTEX_SHADER) {
					shader = gl.createShader(gl.VERTEX_SHADER);
				} else if(type == GSGL.gl.FRAGMENT_SHADER) {
					shader = gl.createShader(gl.FRAGMENT_SHADER);
				} else {
					this.logger.log("No valid shader type specified");
					return 0;
				}

				gl.shaderSource(shader, shaderSrc);
				gl.compileShader(shader);

				if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					this.logger.log(gl.getShaderInfoLog(shader));
					return 0;
				} else {
					this.logger.log("Shader compiled correctly.");
					return shader;
				}
			},

			initShaders : function(fShaderSrc, vShaderSrc) {
				var _this = this;

				$ajax.load(fShaderSrc, function(data) {
					_this.loadShader(GSGL.gl.FRAGMENT_SHADER, data.responseText);
				});
				$ajax.load(vShaderSrc, function(data) {
					_this.loadShader(GSGL.gl.VERTEX_SHADER, data.responseText);
				});

				this.program = gl.createProgram();

				gl.attachShader(this.program, this.vShader);
				gl.attachShader(this.program, this.fShader);
				gl.linkProgram(this.program);

				if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
					this.logger.log("Unable to initialize the shader program.");
				} else {
					this.logger.log("Shader program initialized without error.");
					gl.useProgram(this.program);
				}
			},

			getProgram : function() {
				return this.program;
			},
		};
		program.constructor(params);

		return program;
	},
};
GSGL.gl.particle = {
	Particle : function(params) {
		var particle = {
			pos : {
				x: 0,
				y: 0,
			},
			vel : 1,
			dir : {
				x: 0,
				y: 0,
			},
			size : 1,
			startLife : 1000,
			life : 0,
			alpha : 1.0,

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(gravity, wind, growth, delta) {
				this.life -= delta;
				this.size += growth;
				this.dir.y += gravity;
				this.dir.x += wind;
				this.pos.x += (this.dir.x * this.vel);
				this.pos.y += (this.dir.y * this.vel);
			},

			isDead : function() {
				if(this.life < 0) {
					return true;
				}

				return false;
			}
			
		};
		particle.constructor(params);

		return particle;
	},

	/* ParticleEmitter
	 * * * * * * * * * *
	 * The ParticleEmitter keeps reference to all the particles, and handles rendering of the particles.
	 * You can use different rendering blend modes on the emitter level, so a ParticleSystem can have Emitters with
	 * multiple different blend modes to get desired effects.
	 * The particle emitter has a shader program that it uses in the rendering process, this is specific for particle rendering
	 */
	ParticleEmitter : function(params) {
		var particleEmitter = {
			particles : [],
			texture : {},
			pos : {
				x : 0,
				y : 0,
			},
			dir : {
				max : {
					x : 0,
					y : 0,
				},
				min : {
					x : 0,
					y : 0,
				},
			},
			vel : {
				min : 2,
				max : 5
			},
			startSize : {
				min : 16.0,
				max : 32.0
			},
			constant : false,
			growth : 0.1,
			color : [0.9, 0.5, 0.1, 0.4],
			angularVel : 0,
			gravity : 0,
			wind : 0,
			life : {
				min : 200,
				max : 500
			},
			particlesPerSecond : 100,
			particlesAtStart : 100,
			lifeCycle : 1000,
			currLife : 0,
			shaderManager : {},
			blendSrc : gl.SRC_ALPHA,
			blendDst : gl.ONE,
			program: {},
			vertices: [],
			sizes: [],

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				// Clear last frame
				this.vertices.splice(0, this.vertices.length);
				this.sizes.splice(0, this.sizes.length);

				if(this.constant) {
					var numParticles = Math.ceil((delta / 1000) * this.particlesPerSecond);
					var i = 0;

					for(i; i < numParticles; i += 1) {
						this.addParticle();
					}
				} else {
					this.currLife -= delta;

					if(this.currLife < 0) {
						var i = 0;

						for(i; i < this.particlesAtStart; i += 1) {
							this.addParticle();
						}

						this.currLife = this.lifeCycle;
					}
				}

				i = 0;
				var len = this.particles.length;

				for(i; i < len; i += 1) {
					this.particles[i].update(this.gravity, this.wind, this.growth, delta);

					if(this.particles[i].isDead()) {
						this.particles.splice(i, 1);
						len -= 1;
					} else {
						this.vertices.push(this.particles[i].pos.x);
						this.vertices.push(this.particles[i].pos.y);
						this.sizes.push(this.particles[i].size);
					}
				}
			},

			addParticle : function() {
				var particle = new GSGL.gl.particle.Particle({
					pos : {x: this.pos.x, y: this.pos.y},
					vel : this.randomMinMax(this.vel.min, this.vel.max),
					dir : {x: this.randomMinMax(this.dir.min.x, this.dir.max.x), y: this.randomMinMax(this.dir.min.y, this.dir.max.y)},
					angle : 0,
					angleVel : this.angleVel,
					size : this.randomMinMax(this.startSize.min, this.startSize.max),
					startLife : this.life,
					life : this.randomMinMax(this.life.min, this.life.max),
					alpha : 1.0,
				});

				this.particles.push(particle);
			},

			randomMinMax : function(min, max) {
				return (Math.random() * (max - min)) + min;
			},

			render : function(delta) {
				var program = $shaderManager.getProgram("particle")
				gl.useProgram(program);
				gl.enable(gl.BLEND);
				gl.blendFunc(this.blendSrc, this.blendDst);

				this.resolutionLoc = gl.getUniformLocation(program, "u_resolution");
				gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				this.positionLoc = gl.getAttribLocation(program, "a_position");
				this.pointSizeLoc = gl.getAttribLocation(program, "a_pointSize");
				this.colorLoc = gl.getUniformLocation(program, "u_color");

				gl.bindTexture(gl.TEXTURE_2D, this.texture);

				gl.uniform4f(this.colorLoc, this.color[0], this.color[1], this.color[2], this.color[3]);
				
				var vertexBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.positionLoc);
				gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

				var sizeBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sizes), gl.STATIC_DRAW);
				gl.enableVertexAttribArray(this.pointSizeLoc);
				gl.vertexAttribPointer(this.pointSizeLoc, 1, gl.FLOAT, false, 0, 0);

				gl.drawArrays(gl.POINTS, 0, this.vertices.length / 2);
				
				gl.disableVertexAttribArray(this.positionLoc);
				gl.disableVertexAttribArray(this.pointSizeLoc);
			},
		};
		particleEmitter.constructor(params);

		return particleEmitter;
	},

	ParticleSystem : function(params) {
		var particleSystem = {
			emitters : [],
			// FBO thingamajigs
			FBOTexture : {},
			FBOWidth : 512,
			FBOHeight : 512,
			FBO : {},

			constructor : function() {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addEmitter : function(emitter) {
				this.emitters.push(emitter);
			},

			removeEmitter : function(emitter) {
				this.emitters.splice(emitter, 1);
			},

			switchEmitter : function(src, target) {
				var tempEmitter = this.emitters[target];

				this.emitters[target] = this.emitters[src];
				this.emitters[src] = tempEmitter;
			},

			getParticleAmount : function() {
				var i = 0;
				var len = this.emitters.length;
				var particles = 0;

				for(i; i < len; i += 1) {
					particles += this.emitters[i].particles.length;
				}

				return particles;
			},

			update : function(delta) {
				var i = 0;
				var len = this.emitters.length;

				for(i; i < len; i += 1) {
					this.emitters[i].update(delta);
				}
			},

			render : function(delta) {
				var i = 0;
				var len = this.emitters.length;

				for(i; i < len; i += 1) {
					this.emitters[i].render(delta);
				}
			},

			bindFBO : function() {
				this.FBO = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO);

				this.FBO.width = this.FBOWidth;
				this.FBO.height = this.FBOHeight;

				this.FBOTexture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, this.FBOTexture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.FBOWidth, this.FBOHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

				var renderBuffer = gl.createRenderbuffer();

				gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.FBOWidth, this.FBOHeight);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.FBOTexture, 0);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

				gl.bindTexture(gl.TEXTURE_2D, null);
				gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			},
		};
		particleSystem.constructor(params);

		return particleSystem;
	},
}
/* GL Font
 * * * * * *
 * 
 */

GSGL.gl.font = {
	Font : function(params) {
		var font = {
			sprite : [],
			loaded : [],
			glyphs : [],
			config : {},
			base : 0,
			lineHeight : 0,
			color : [1.0, 1.0, 1.0, 1.0],
			customSprite : false,
			src : "",
			align : "left",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				if(this.src != "") {
					this.load(this.src);
				}
			},

			load : function(src) {
				var _this = this;
				$ajax.load(src, function(data) {
					_this.config = data.responseXML;
					if(_this.customSprite) {
						_this.parseConfigCustomSprite();
					} else {
						_this.parseConfig();
					}
				});
			},

			configCustomSprite : function(texture, mapWidth, mapHeight, startX, startY, width, height) {

			},

			createSprite : function(id) {
				
			},

			parseConfig : function() {
				var _this = this;
				var _id;
				var pages = this.config.getElementsByTagName("page");
				var chars = this.config.getElementsByTagName("char");
				var common = this.config.getElementsByTagName("common");

				this.lineHeight = parseInt(common[0].getAttribute("lineHeight"));
				this.base = parseInt(common[0].getAttribute("base"));
				this.scaleW = parseInt(common[0].getAttribute("scaleW"));
				this.scaleH = parseInt(common[0].getAttribute("scaleH"));

				var i = 0;
				var len = pages.length;

				for(i; i < len; i += 1) {
					var id = pages[i].getAttribute("id");
					var file = pages[i].getAttribute("file");

					$textureManager.addTexture("font/" + file, "font" + id);
					this.sprite[id] = new GSGL.gl.sprite.Sprite({
						texture: "font" + id, 
						width: this.scaleW, 
						height: this.scaleH, 
						hasColor: true,
						color: this.color
					});
				}

				i = 0;
				len = chars.length;

				for(i; i < len; i += 1) {
					var id, x, y, width, height, xoffset, yoffset, xadvance, page;
					id = parseInt(chars[i].getAttribute("id"));
					x = parseInt(chars[i].getAttribute("x"));
					y = parseInt(chars[i].getAttribute("y"));
					width = parseInt(chars[i].getAttribute("width"));
					height = parseInt(chars[i].getAttribute("height"));
					xoffset = parseInt(chars[i].getAttribute("xoffset"));
					yoffset = parseInt(chars[i].getAttribute("yoffset"));
					xadvance = parseInt(chars[i].getAttribute("xadvance"));
					page = parseInt(chars[i].getAttribute("page"));

					this.glyphs[id] = new GSGL.gl.font.Glyph({x: x, y: y, width: width, height: height, xOffset: xoffset, yOffset: yoffset, xAdvance: xadvance, page: page});
				}
			},

			parseConfigCustomSprite : function(texture, mapWidth, mapHeight, startX, startY, width, height) {

			},

			setColor : function(r, g, b, a) {
				this.color = [r, g, b, a];

				var i = 0;
				var len = this.sprite.length;

				for(i; i < len; i += 1) {
					this.sprite[i].setColor(r, g, b, a);
				}
			},

			setAlign : function(align) {
				this.align = align;
			},

			getAlign : function() {
				return this.align;
			},

			getLineHeight : function() {
				return this.lineHeight;
			},

			getBase : function() {
				return this.base;
			},

			drawString : function(str, x, y) {
				var currentX = x;
				var currentY = 0;

				var i = 0;
				var len = str.length;

				if(this.align == "center") {
					var strWidth = this.stringWidth(str);
					currentX = x - Math.floor(strWidth / 2);
				} else if(this.align == "right") {
					var strWidth = this.stringWidth(str);
					currentX = x - strWidth;
				}

				for(i; i < len; i += 1) {
					var id = str.charCodeAt(i);
					
					if(this.glyphs[id] != undefined) {
						this.sprite[this.glyphs[id].page].renderSub(currentX + this.glyphs[id].xOffset, y + this.glyphs[id].yOffset, this.glyphs[id].x, this.glyphs[id].y, this.glyphs[id].width, this.glyphs[id].height);
						currentX += this.glyphs[id].xAdvance;
					}
				}
			},

			stringWidth : function(str) {
				var width = 0;
				var i = 0;
				var len = str.length;

				for(i; i < len; i += 1) {
					var id = str.charCodeAt(i);

					width += this.glyphs[id].xAdvance;
				}

				return width;
			},
		};
		font.constructor(params);

		return font;
	},

	Glyph : function(params) {
		var glyph = {
			x : 0,
			y : 0,
			xOffset : 0,
			yOffset : 0,
			width : 0,
			height : 0,
			xAdvance : 0,
			page : 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},
		};
		glyph.constructor(params);

		return glyph;
	},
};
/* WebGL Renderer
 * * * * * * * * * * *
 * We need to render things in the right order with the right texture and shader program and blending.
 * We need to push things into batches as often as we can, so we need to identify a global routine for rendering
 * everything in the rendering loop. Let's try to push the particle batch into this as well.
 * These are the things we need to setup each batch
 * * Z-Order
 * * Texture
 * * Shader Program
 * * Blender
 * Let's figure out how to sort rendercalls in a natural and optimized way:
 * * Z-Index
 * * * Program
 * * * * Texture
 * * * * Blendning
 */
GSGL.gl.render = {
	RenderManager2D : function(params) {
		var renderManager2d = {
			uid : 0,
			renderCalls : {},
			// Shader Attributes
			positionLoc : {},
			texCoordLoc : {},
			// Shader Uniforms
			colorLoc : {},
			noTextureLoc : {},
			noColorLoc : {},
			resolutionLoc : {},
			// Buffer objects
			vertexBuffer : {},
			indicesBuffer : {},
			texCoordBuffer : {},
			
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			initRenderer : function() {
				var program = $shaderManager.getProgram("default");

				this.resolutionLoc = gl.getUniformLocation(program, "u_resolution");
				this.positionLoc = gl.getAttribLocation(program, "a_position");
				this.texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
				this.colorLoc = gl.getUniformLocation(program, "u_color");
				this.noTextureLoc = gl.getUniformLocation(program, "no_texture");
				this.noColorLoc = gl.getUniformLocation(program, "no_color");

				this.vertexBuffer = gl.createBuffer();
				this.indicesBuffer = gl.createBuffer();
				this.texCoordBuffer = gl.createBuffer();
			},

			clearCalls : function() {
				this.renderCalls = {};
			},

			addToCall : function(zIndex, program, texture, renderCall) {
				var id = "" + zIndex + ";" + program + ";" + texture;
				if(renderCall.hasColor) {
					id += ";r" + renderCall.color[0] + ";g" + renderCall.color[1] + ";b" + renderCall.color[2] + ";a" + renderCall.color[3];
				} 

				if(this.renderCalls[id] == undefined) {
					this.renderCalls[id] = new GSGL.gl.render.RenderCall({
						texture: texture,
						program: program,
						zIndex: zIndex
					});
				}

				this.renderCalls[id].add(renderCall);
			},

			orderByZIndex : function() {
				// We sort the calls in z-index order so that we render it in the right order.
			},

			render : function() {
				this.flush();
				this.clearCalls();
			},

			flush : function() {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.uniform2f(this.resolutionLoc, GSGL.WIDTH, GSGL.HEIGHT);

				for(key in this.renderCalls) {
					if(this.renderCalls[key].hasTexture) {
						gl.uniform1i(this.noTextureLoc, 0);
						gl.bindTexture(gl.TEXTURE_2D, $textureManager.getTexture(this.renderCalls[key].texture));
					} else {
						gl.uniform1i(this.noTextureLoc, 1);
					}

					if(this.renderCalls[key].hasColor) {
						gl.uniform1i(this.noColorLoc, 0);
						gl.uniform4f(this.colorLoc, this.renderCalls[key].color[0], this.renderCalls[key].color[1], this.renderCalls[key].color[2], this.renderCalls[key].color[3]); 
					} else {
						gl.uniform1i(this.noColorLoc, 1);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[key].vertices), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.positionLoc);
					gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[key].uvs), gl.STATIC_DRAW);
					gl.enableVertexAttribArray(this.texCoordLoc);
					gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.renderCalls[key].indices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, this.renderCalls[key].numIndices, gl.UNSIGNED_SHORT, 0);
				}
			},
		};
		renderManager2d.constructor(params);

		return renderManager2d;
	},

	/* RenderCall
	 * * * * * * * *
	 * A RenderCall is a collection of renderable objects that uses the same general resources, thus being able to 
	 * push these through the GPU at the same time. The rendercalls are divided using the following parameters:
	 * * Z-Index
	 * * Shader
	 * * Texture
	 * * Blend Mode
	 * The rendercall contains the following information:
	 * * Texture
	 * * Program
	 * * Blend Mode
	 * * Vertices
	 * * Vertex Indices
	 * * UV coords
	 */
	RenderCall : function(params) {
		var renderCall = {
			vertices: [],
			indices: [],
			uvs: [],
			index: 0,
			numIndices: 0,
			texture: {},
			program: {},
			zIndex: 0,
			color: [0.0, 0.0, 0.0, 1.0],
			hasColor: false,
			hasTexture: true,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			add : function(renderCall) {
				this.vertices = this.vertices.concat(renderCall.vertices);
				this.uvs = this.uvs.concat(renderCall.uvs);

				var i = 0;
				var len = renderCall.indices.length;

				for(i; i < len; i += 1) {
					this.indices.push(renderCall.indices[i] + this.index);
				}

				this.index += this.findMaxIndex(renderCall.indices);

				this.numIndices += renderCall.numIndices;

				if(renderCall.hasColor) {
					this.hasColor = true;
					this.color = renderCall.color;
				}
			},

			findMaxIndex : function(indices) {
				var i = 0;
				var len = indices.length;
				var max = 0;

				for(i; i < len; i += 1) {
					if(indices[i] > max) {
						max = indices[i];
					}
				}

				max += 1;

				return max;
			},

			flush : function() {
				this.vertices = [];
				this.indices = [];
				this.uvs = [];
				this.index = 0;
				this.numIndices = 0;
			},

			setProgram : function(program) {
				this.program = program;
			},

			setTexture : function(texture) {
				this.texture = texture;
			},

			setZIndex : function(zIndex) {
				this.zIndex = zIndex;
			}
		};
		renderCall.constructor(params);

		return renderCall;
	},
}
GSGL.gl.texture = {
	/* GL TextureManager
	 * * * * * * * * * * *
	 * Global - $texture
	 * The Texture Manager keeps track of all the active textures used in the application, it stores the webGL textures and
	 * deletes it when not needed anylonger. Sprites use the texture manager to assign textures to specific sprites.
	 */
	TextureManager : function(params) {
		var textureManager = {
			textures : {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addTexture : function(src, id) {
				this.textures[id] = new GSGL.gl.texture.Texture({src: src});
			},

			removeTexture : function(id) {
				gl.deleteTexture(this.texture[id].texture);
			},

			getTexture : function(id) {
				return this.textures[id].texture;
			},
		};
		textureManager.constructor(params);

		return textureManager;
	},

	Texture : function(params) {
		var texture = {
			id : 0,
			image : new Image(),
			logger : new GSGL.utility.Logger('image'),
			width : 0,
			height : 0,
			texture : null,
			isLoaded : false,
			isReady : false,
			onLoaded : {},
			src : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				if(this.src != "") {
					this.load(this.src);
				}
			},

			load : function(src) {
				this.texture = gl.createTexture();
				this.id = $resources.addResource("image");
				this.addEventListeners();
				this.image.src = src;
			},

			init : function() {
				gl.bindTexture(gl.TEXTURE_2D, this.texture);

				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

				gl.bindTexture(gl.TEXTURE_2D, null);

				this.isReady = true;
			},

			loadedHandler : function(event) {
				this.isLoaded = true
				this.width = this.image.width;
				this.height = this.image.height;

				$resources.setLoaded(this.id);

				this.init();

				if(typeof(this.onLoaded) == "function") {
					this.onLoaded();
				}	
			},

			errorHandler : function(event) {
				this.logger.log("Failed to load image " + this.image.src);
			},

			addEventListeners : function() {
				var _this = this;

				this.image.addEventListener("load", function(event) {
					_this.loadedHandler(event);
				}, true);

				this.image.addEventListener("error", function(event) {
					_this.errorHandler(event);
				}, true);
			},
		};
		texture.constructor(params);

		return texture;
	},
};
GSGL.gl.sprite = {
	Sprite : function(params) {
		var sprite = {
			uv : [0.0, 0.0, 1.0, 1.0],
			color : [1.0, 1.0, 1.0, 1.0],
			width : 0,
			height : 0,
			texture : "",
			hasColor : false,
			zIndex : 0,
			program : "default",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setUV : function(x0, y0, x1, y1) {
				this.uv = [x0, y0, x1, y1];
			},

			setUVPixels : function(mapWidth, mapHeight, x, y, width, height) {
				this.uv = [(x / mapWidth), (y / mapHeight), ((x + width) / mapWidth), ((y + height) / mapHeight)];
			},

			setColor : function(r, g, b, a) {
				this.color = [r,g,b,a];
			},

			render : function(x, y, returnCall) {
				var renderCall = {
					texture : this.texture,
					vertices : [x, y,
					            x + this.width, y,
					            x, y + this.height,
					            x + this.width, y + this.height],
					uvs : [this.uv[0], this.uv[1],
					       this.uv[2], this.uv[1],
					       this.uv[0], this.uv[3],
					       this.uv[2], this.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				var unique = false;

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderScale : function(x, y, scale) {
				var renderCall = {
					texture : this.texture,
					vertices : [x, y,
								x + (this.width * scale), y,
								x, y + (this.height * scale),
								x + (this.width * scale), y + (this.height * scale)],
					uvs : [this.uv[0], this.uv[1],
						   this.uv[2], this.uv[1],
						   this.uv[0], this.uv[3],
						   this.uv[2], this.uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderAngle : function(x, y, angle) {
				var vectors = [];
				var px, py;
				px = x + (this.width / 2);
				py = y + (this.height / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + this.width, y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + this.height);
				vectors[3] = new GSGL.geometry.Vector2D(x + this.width, y + this.height);

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : this.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [this.uv[0], this.uv[1],
						       this.uv[2], this.uv[1],
						       this.uv[0], this.uv[3],
						       this.uv[2], this.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderAngleScale : function(x, y, angle, scale) {
				var vectors = [];
				var px, py;
				px = x + ((this.width * scale) / 2);
				py = y + ((this.height * scale) / 2);

				vectors[0] = new GSGL.geometry.Vector2D(x, y);
				vectors[1] = new GSGL.geometry.Vector2D(x + (this.width * scale), y);
				vectors[2] = new GSGL.geometry.Vector2D(x, y + (this.height * scale));
				vectors[3] = new GSGL.geometry.Vector2D(x + (this.width * scale), y + (this.height * scale));

				var i = 0;
				var len = 4;

				for(i; i < len; i += 1) {
					vectors[i] = vectors[i].rotatePivot(px, py, GSGL.utility.degreeToRadian(angle));
				}

				var renderCall = {
						texture : this.texture,
						vertices : [vectors[0].x, vectors[0].y,
						            vectors[1].x, vectors[1].y,
						            vectors[2].x, vectors[2].y,
						            vectors[3].x, vectors[3].y,],
						uvs : [this.uv[0], this.uv[1],
						       this.uv[2], this.uv[1],
						       this.uv[0], this.uv[3],
						       this.uv[2], this.uv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},

			renderSub : function(x, y, subX, subY, subWidth, subHeight, returnCall) {
				var suv = [];
				suv[0] = parseFloat(subX) / parseFloat(this.width);
				suv[1] = parseFloat(subY) / parseFloat(this.height);
				suv[2] = parseFloat(subX + subWidth) / parseFloat(this.width);
				suv[3] = parseFloat(subY + subHeight) / parseFloat(this.height);

				var renderCall = {
						texture : this.texture,
						vertices : [x, y,
						            x + subWidth, y,
						            x, y + subHeight,
						            x + subWidth, y + subHeight],
						uvs : [suv[0], suv[1],
						       suv[2], suv[1],
						       suv[0], suv[3],
						       suv[2], suv[3]],
						indices : [0, 1, 2, 1, 2, 3],
						numIndices : 6
				};

				if(this.hasColor) {
					renderCall.hasColor = true;
					renderCall.color = this.color;
				}

				$renderManager.addToCall(this.zIndex, this.program, this.texture, renderCall);
			},
		};
		sprite.constructor(params);

		return sprite;
	},

	AnimatedSprite : function(params) {
		var animatedSprite = {
			frames: [],
			loop: false,
			active: true,
			frameTime: 100,
			currentFrame: 0,
			currentDelta: 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			play : function() {
				this.active = true;
			},

			stop : function() {
				this.active = false;
				this.currentFrame = 0;
				this.currentDelta = 0;
			},

			pause : function() {
				this.active = false;
			},

			update : function(delta) {
				if(this.active) {
					this.currentDelta += delta;

					if(this.currentDelta > this.frameTime) {
						this.currentDelta = 0;
						this.nextFrame();
					}
				}
			},

			nextFrame : function() {
				this.currentFrame += 1;
				if(this.currentFrame >= this.frames.length) {
					if(!this.loop) {
						this.active = false;
					}
					this.currentFrame = 0;
				}
			},

			render : function(x, y) {
				this.frames[this.currentFrame].render(x, y);
			}
		};
		animatedSprite.constructor(params);

		return animatedSprite;
	}
};
GSGL.gl.ui = {
	Button : function(params) {
		var button = {
			states : ["INACTIVE","HOVER","ACTIVE"],
			sprites : [],
			shape : {},
			state : 0,
			callback : {},
			title : "",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			update : function(delta) {
				var point = new GSGL.geometry.Point($mouse.X, $mouse.Y);

				if($intersects(point, this.shape)) {
					this.state = 1;

					if($mouse.CLICK[0]) {
						this.state = 2
						if(typeof(this.callback) == 'function') {
							this.callback();
						}
					}

					if($mouse.MB[0]) {
						this.state = 2
					}
				} else {
					this.state = 0;
				}
			},

			render : function(delta) {
				this.sprites[this.state].render(this.shape.pos.x, this.shape.pos.y);

				if(this.title != "") {
					var oldAlign = $font.getAlign();
					$font.setAlign("center");
					var y = this.shape.pos.y + (this.shape.height / 2) - ($font.getLineHeight() / 2);

					$font.drawString(this.title, this.shape.pos.x + (this.shape.width / 2), y);
				}
			},
		};
		button.constructor(params);

		return button;
	},
};