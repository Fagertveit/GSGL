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
}