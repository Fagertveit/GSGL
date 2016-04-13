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