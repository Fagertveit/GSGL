GSGL.gl.font = {
	Font : function(params) {
		var font = {
			texture : [],
			sprite : [],
			loaded : [],
			glyphs : [],
			config : {},
			customSprite : false,
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
				this.sprite[id] = new GSGL.gl.sprite.Sprite({texture: this.texture[id].texture, width: this.texture[id].width, height: this.texture[id].height});
			},

			parseConfig : function() {
				var _this = this;
				var _id;
				var pages = this.config.getElementsByTagName("page");
				var chars = this.config.getElementsByTagName("char");

				var i = 0;
				var len = pages.length;

				for(i; i < len; i += 1) {
					var id = pages[i].getAttribute("id");
					var file = pages[i].getAttribute("file");
					_id = id;

					this.texture[id] = new GSGL.gl.texture.Texture({src: "font/" + file, onLoaded: function() {
						_this.createSprite(_id);
					}});
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

			drawString : function(str, x, y) {
				var currentX = x;
				var currentY = 0;

				var i = 0;
				var len = str.length;

				for(i; i < len; i += 1) {
					var id = str.charCodeAt(i);
					
					if(this.glyphs[id] != undefined) {
						this.sprite[this.glyphs[id].page].renderSub(currentX + this.glyphs[id].xOffset, y + this.glyphs[id].yOffset, this.glyphs[id].x, this.glyphs[id].y, this.glyphs[id].width, this.glyphs[id].height);
						currentX += this.glyphs[id].xAdvance;
					}
				}
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