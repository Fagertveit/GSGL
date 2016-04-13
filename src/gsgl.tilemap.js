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
			ready : false,

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
					_this.tilewidth = tiledMap.tilewidth;
					_this.tileheight = tiledMap.tileheight;
					_this.backgroundcolor.setHex(tiledMap.backgroundcolor);

					// Then we create the layers
					for(var i in tiledMap.layers) {
						_this.layers.push(new GSGL.tilemap.TilemapLayer(tiledMap.layers[i]));
						_this.layers[i].decodeTileData();
					}

					// And last we import the sprite sheet that is the tiles
					for(var i in tiledMap.tilesets) {
						_this.tilesets.push(new GSGL.tilemap.Tileset(tiledMap.tilesets[i]));
						_this.tilesets[i].loadTexture();
					}

					// Let's output the tilemap in all it's glory!
					console.log(_this);
				});
			},

			render : function(x, y) {
				for(var i in this.layers) {
					if(this.layers[i].isVisible()) {
						for(var j in this.layers[i].tiles) {
							var tileData = this.layers[i].getTile(j);
							var tilex = this.tilewidth * tileData.col + x;
							var tiley = this.tileheight * tileData.row + y;
							if(tileData.tileid != 0) {
								this.tilesets[0].renderTile(tilex, tiley, tileData.tileid);
							}
						}
					}
				}
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

			/* Decode Base64 uncompressed data string */
			decodeTileData : function() {
				var rawData = atob(this.data);
				var bytes = 4;
				var len = rawData.length / 4;

		        for (var i = 0; i < len; i++) {
		            this.tiles[i] = 0;
		            for (var j = bytes - 1; j >= 0; --j) {
		                this.tiles[i] += rawData.charCodeAt((i * bytes) + j) << (j << 3);
		            }
		        }

				console.log(this.tiles);
			},

			isVisible : function() {
				return this.visible;
			},

			getTile : function(i) {
				return {
					tileid : this.tiles[i],
					row : Math.floor(i / this.width),
					col : i % this.width,
				};
			}
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
			},

			loadTexture : function() {
				$textureManager.addTexture(this.image, this.name);
			},

			renderTile : function(x, y, id) {
				var row = Math.floor((id - this.firstgid) / this.columns);
				var col = (id - this.firstgid) % this.columns;

				var uv = [
					((col * this.tilewidth) / this.imagewidth), 
					((row * this.tileheight) / this.imageheight), 
					(((col * this.tilewidth) + this.tilewidth) / this.imagewidth), 
					(((row * this.tileheight) + this.tileheight) / this.imageheight)
				];

				var renderCall = {
					texture : this.name,
					vertices : [x, y,
					            x + this.tilewidth, y,
					            x, y + this.tileheight,
					            x + this.tilewidth, y + this.tileheight],
					uvs : [uv[0], uv[1],
					       uv[2], uv[1],
					       uv[0], uv[3],
					       uv[2], uv[3]],
					indices : [0, 1, 2, 1, 2, 3],
					numIndices : 6
				};

				$renderManager.addToCall(0, "default", this.name, renderCall);
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