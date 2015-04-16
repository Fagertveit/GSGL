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