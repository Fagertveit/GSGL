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

	TouchManager : function() {

	},
};