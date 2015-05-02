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