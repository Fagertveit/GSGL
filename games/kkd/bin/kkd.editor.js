KKD.state.Editor = function(params) {
	var editor = {
		parent : {},
		logger : new GSGL.utility.Logger({type: "KKD Game"}),
		activeArea : new GSGL.geometry.Rectangle({
			pos: new GSGL.geometry.Point(170, 10),
			width: 460,
			height: 460
		}),
		surface : {},
		btns : {},
		path : {},
		editMode : "move",
		move : {
			active: false,
			point: 0,
		},
		vEpsilon : 0.0001,
		vDivisions : 20,
		dirVectors : [],

		constructor : function(params) {
			for(key in params) {
				if(this[key] != undefined) {
					this[key] = params[key];
				}
			}
			this.init();
		},

		init : function() {
			var _this = this;

			this.btns.exit = new GSGL.ui.Button({
				title: "Exit",
				callback: function() {
					_this.exitEditor();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(10, 450),
					width: 150,
					height: 20
				}),
			});

			this.btns.add = new GSGL.ui.Button({
				title: "Add",
				callback: function() {
					_this.add();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(10, 200),
					width: 150,
					height: 20
				}),
			});

			this.btns.remove = new GSGL.ui.Button({
				title: "Remove",
				callback: function() {
					_this.remove();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(10, 224),
					width: 150,
					height: 20
				}),
			});

			this.btns.move = new GSGL.ui.Button({
				title: "Move",
				callback: function() {
					_this.move();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(10, 248),
					width: 150,
					height: 20
				}),
			});

			this.btns.testPath = new GSGL.ui.Button({
				title: "Export Path",
				callback: function() {
					_this.export();
				},
				shape: new GSGL.geometry.Rectangle({
					pos: new GSGL.geometry.Point(10, 280),
					width: 150,
					height: 20
				}),
			});

			this.path = new GSGL.geometry.BSpline({
				points: [
					new GSGL.geometry.Point(300, 50),
					new GSGL.geometry.Point(400, 100)
				]
			});
		},

		update : function(delta) {
			var mouse = new GSGL.geometry.Point($mouse.X, $mouse.Y);

			this.btns.exit.update();
			this.btns.add.update();
			this.btns.remove.update();
			this.btns.move.update();
			this.btns.testPath.update();

			switch(this.editMode) {
				case "add":
					if($mouse.CLICK[0]) {
						// Let's add a point to the path
						if($intersects(this.activeArea, mouse)) {
							this.path.addPoint(mouse);
						}
					}
					break;
				case "remove":
					if($mouse.CLICK[0]) {
						if($intersects(this.activeArea, mouse)) {
							var points = this.path.points;
							var i = 0;
							var len = points.length;

							for(i; i < len; i += 1) {
								var tmp = new GSGL.geometry.Circle({
									pos: new GSGL.geometry.Point(points[i].x, points[i].y),
									radius: 10,
								});

								if($intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), tmp)) {
									this.path.removePoint(i);
								}
							}
						}
					}
					break;
				case "move":
					if($mouse.MB[0]) {
						if($intersects(this.activeArea, mouse)) {
							if(this.move.active) {
								this.path.points[this.move.point].setPosition($mouse.X, $mouse.Y);
							} else {
								// Let's see if we can grab a point
								var points = this.path.points;
								var i = 0;
								var len = points.length;

								for(i; i < len; i += 1) {
									var tmp = new GSGL.geometry.Circle({
										pos: new GSGL.geometry.Point(points[i].x, points[i].y),
										radius: 10,
									});

									if($intersects(new GSGL.geometry.Point($mouse.X, $mouse.Y), tmp)) {
										this.move.active = true;
										this.move.point = i;
									}
								}
							}
						}
					} else {
						this.move.active = false;
					}
					break;
			}
		},

		render : function(delta) {
			this.surface.clear("#ffffff");
			$g = this.surface.getContext();

			this.btns.exit.render();
			this.btns.add.render();
			this.btns.remove.render();
			this.btns.move.render();
			this.btns.testPath.render();

			this.path.renderEdit();

			var i = 0;
			var len = this.vDivisions;

			for(i; i < len; i += 1) {
				var t = (1 / len) * i;
				this.calcVectorDirection(t);
			}

			$g.strokeRect(170, 10, 460, 460);
		},

		calcVectorDirection : function(t) {
			var refPoint = this.path.getPoint(t - this.vEpsilon);
			var currPoint = this.path.getPoint(t);

			var refVec = new GSGL.geometry.Vector2D(refPoint.x, refPoint.y);
			var currVec = new GSGL.geometry.Vector2D(currPoint.x, currPoint.y);

			currVec.subtract(refVec).normalize().renderArrow(currPoint.x, currPoint.y);
			$g.fillText(t.toFixed(2), currPoint.x + 10, currPoint.y);
		},

		exitEditor : function() {
			this.parent.setState("menu");
		},

		add : function() {
			this.editMode = "add";
		},

		remove : function() {
			this.editMode = "remove";
		},

		move : function() {
			this.editMode = "move";
		},

		export : function() {
			var json = "{";
			var len = this.path.points.length;
			var i = 0;

			for(i; i < len; i += 1) {
				json += "[" + this.path.points[i].x + "," + this.path.points[i].y + "]";
				if(i != len - 1) {
					json += ",";
				}
			}

			json += "}"
			console.log(json);
		},
	};
	editor.constructor(params);

	return editor; 
};