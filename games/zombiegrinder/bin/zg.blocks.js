ZG.blocks = {
	BLUEPRINT : {
		"T" : {
			[0],[4],[0],
			[1],[2],[3],
			[0],[0],[0],
		},
		"O" : {
			[1],[2],
			[3],[4],
		},
		"L" : {
			[0],[1],[0],[0],
			[0],[2],[0],[0],
			[0],[3],[0],[0],
			[0],[4],[0],[0],
		},
		"S" : {
			[0],[3],[4],
			[1],[2],[0],
			[0],[0],[0],
		},
		"Z" : {
			[1],[2],[0],
			[0],[3],[4],
			[0],[0],[0],
		},
		"L" : {
			[0],[1],[0],
			[0],[2],[0],
			[0],[3],[4],
		},
		"J" : {
			[0],[1],[0],
			[0],[2],[0],
			[4],[3],[0],
		}
	},

	BlockManager : function(params) {
		var blockManager = {
			constructor : function(params) {
				
			}
		};
		blockManager.constructor(params);

		return blockManager;
	},

	Block : function(params) {
		var block = {
			constructor : function(params) {

			},
		};
		block.constructor(params);

		return block;
	},
}