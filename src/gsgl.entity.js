GSGL.Entity = function(params) {
	var entity = {
		logger : new GSGL.utility.Logger({type:'Entity'}),

		constructor : function(params) {
			for(key in params) {
				this[key] = params[key];
			}

			this.logger.log("Created entity", this);
		},
	};
	entity.constructor(params);

	return entity;
}