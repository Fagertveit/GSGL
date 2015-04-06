/* GameSaw GameLibrary
 * - - - - - - - - - - -
 * Main class and entry point for the GameSaw GameLibrary
 */

var GSGL = {
	/* Global settings */
	CONTAINER_ID : "gsgl-container",
};GSGL.event = {
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
			    	this.X = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			    	this.Y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			    }
			    
			    this.X -= this.container.offsetLeft;
			    this.Y -= this.container.offsetTop;
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
			}
		};
		keyboardManager.constructor();
		
		return keyboardManager;
	},

	TouchManager : function() {

	},
};GSGL.geometry = {
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
				this.points.slice(i, 1);
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
};GSGL.graphics = {
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
};GSGL.physics = {
	pointLine : function(point, line) {

	},

	pointTriangle : function(point, triangle) {

	},

	pointCircle : function(point, circle) {

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
};GSGL.surface = {
	RenderingEngine : function(params) {
		var renderingEngine = {

		};
		renderingEngine.constructor(params);

		return renderingEngine;
	},

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

		};
		surface3d.constructor(params);

		return surface3d;
	},
};GSGL.ui = {
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
};GSGL.utility = {
	EPSILON : 0.000001,
	PI : Math.PI,

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