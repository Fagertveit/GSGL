GSGL.geometry = {
	Vector2D : function(x, y) {
		var vector2d = {
			x : 0.0,
			y : 0.0,
			type : "vector2d",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setX : function(x) {
				this.x = x;
			},

			getX : function() {
				return this.x;
			},

			setY : function(y) {
				this.y = y;
			},

			getY : function() {
				return this.y;
			},

			setPosition : function(x, y) {
				this.x = x;
				this.y = y;
			},

			getPosition : function() {
				return {x: this.x, y: this.y};
			},

			add : function(vec2d) {
				return new GSGL.geometry.Vector2D(this.x + vec2d.x, this.y + vec2d.y);
			},

			subtract : function(vec2d) {
				return new GSGL.geometry.Vector2D(this.x - vec2d.x, this.y - vec2d.y);
			},

			invert : function() {
				return new GSGL.geometry.Vector2D(-this.x, -this.y);
			},

			scale : function(scalar) {
				return new GSGL.geometry.Vector2D(this.x * scalar, this.y * scalar);
			},

			dot : function(vec2d) {
				return ((this.x * vec2d.x) + (this.y * vec2d.y));
			},

			cross : function(vec2d) {
				return ((this.x * vec2d.y) - (this.y * vec2d.x));
			},

			length : function() {
				return Math.sqrt(this.lengthSquared());
			},

			lengthSquared : function() {
				return (this.x * this.x) + (this.y * this.y);
			},

			normalize : function() {
				var length = this.length();

				if(length == 0) {
					return new GSGL.geometry.Vector2D(0.0, 0.0);
				}

				return new GSGL.geometry.Vector2D(this.x / length, this.y / length);
			},

			project : function(vec2d) {
				var dot, length;
				dot = this.dot(vec2d);
				length = this.lengthSquared();

				return new  GSGL.geometry.Vector2D((dot / length) * this.x, (dot / length) * this.y);
			},

			angle : function() {
				return Math.atan2(this.x, -this.y);
			},

			distanceTo : function(vec) {
				var tmp = this.subtract(vec);

				return tmp.length();
			},

			rotate : function(radian) {
				// Must fix a utility class!
				if(this.x == 0) {
					this.x += GSGL.utility.EPSILON;
				}

				if(this.y == 0) {
					this.y += GSGL.utility.EPSILON;
				}

				return new  GSGL.geometry.Vector2D(Math.cos(radian) * this.x - Math.sin(radian) * this.y,
					Math.sin(radian) * this.x + Math.cos(radian) * this.y);
			},

			rotatePivot : function(x, y, radian) {
				if(this.x == 0) {
					this.x += GSGL.utility.EPSILON;
				}
				if(this.y == 0) {
					this.y += GSGL.utility.EPSILON;
				}

				var x, y;
				srcX = this.x;
				srcY = this.y;

				srcX -= x;
				srcY -= y;

				return new  GSGL.geometry.Vector2D((Math.cos(radian) * srcX - Math.sin(radian) * srcY) + x,
					(Math.sin(radian) * srcX + Math.cos(radian) * srcY) + y);
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.x, this.y, 1.0, 0, Math.PI * 2);
				$g.fill();
			},

			renderDirection : function(x, y) {
				$g.beginPath();
				$g.moveTo(x, y);
				$g.lineTo(x + this.x, y + this.y);
				$g.closePath();
				$g.stroke();
			},

			renderArrow : function(x, y) {
				var temp;

				this.renderDirection(x, y);

				temp = new GSGL.geometry.Vector2D(this.x, this.y);

				temp = temp.normalize();
				temp = temp.rotate(GSGL.utility.degreeToRadian(30));

				$g.beginPath();
				$g.moveTo(x + this.x, y + this.y);
				$g.lineTo((x + this.x) - (temp.x * 10), (y + this.y) - (temp.y * 10));
				$g.closePath();
				$g.stroke();

				temp = temp.rotate(GSGL.utility.degreeToRadian(-60));

				$g.beginPath();
				$g.moveTo(x + this.x, y + this.x);
				$g.lineTo((x + this.x) - (temp.x * 10), (y + this.y) - (temp.y * 10));
				$g.closePath();
				$g.stroke();
			},

			renderDestination : function(x, y) {
				$g.beginPath();
				$g.arc(x + this.x, y + this.y, 2, 0, Math.PI * 2, true);
				$g.fill();
			}
		};
		vector2d.constructor({x: x, y: y});

		return vector2d;
	},
	
	Vector3D : function(x, y, z) {
		var vector3d = {
			x : 0.0,
			y : 0.0,
			z : 0.0,
			type : "vector3d",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		vector3d.constructor({x: x, y: y, z: z});

		return vector3d;
	},

	Point : function(x, y) {
		var point = {
			x : 0.0,
			y : 0.0,
			type : "point",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.x += x;
				this.y += y;
			},

			setPosition : function(x, y) {
				this.x = x;
				this.y = y;
			},

			getPosition : function() {
				return {x : this.x, y : this.y};
			},

			setX : function(x) {
				this.x = x;
			},

			getX : function() {
				return this.x;
			},

			setY : function(y) {
				this.y = y;
			},

			getY : function() {
				return this.y;
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.x, this.y, 1.0, 0, Math.PI * 2);
				$g.fill();
			}
		};
		point.constructor({x: x, y: y});

		return point;
	},

	Line : function(params) {
		var line = {
			p0 : new GSGL.geometry.Point(0.0, 0.0),
			p1 : new GSGL.geometry.Point(1.0, 1.0),
			type : "line",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.p0.transform(x, y);
				this.p1.transform(x, y);
			},

			transformStart : function(x, y) {
				this.p0.transform(x, y);
			},

			transformEnd : function(x, y) {
				this.p1.transform(x, y);
			},

			setPosition : function(x0, y0, x1, y1) {
				this.p0.setPosition(x0, y0);
				this.p1.setPosition(x1, y1);
			},

			render : function() {
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
			}
		};
		line.constructor(params);

		return line;
	},

	Triangle : function(params) {
		var triangle = {
			p0 : new GSGL.geometry.Point(1.0, 0.0),
			p1 : new GSGL.geometry.Point(1.0, 1.0),
			p2 : new GSGL.geometry.Point(0.0, 1.0),
			type : "triangle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.p0.transform(x, y);
				this.p1.transform(x, y);
				this.p2.transform(x, y);
			},

			setPosition : function(point, x, y) {
				this['p' + point].setPosition(x, y);
			},

			render : function() {
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.p1.x, this.p1.y);
				$g.lineTo(this.p2.x, this.p2.y);
				$g.lineTo(this.p0.x, this.p0.y);
				$g.stroke();
			}
		};
		triangle.constructor(params);

		return triangle;
	},

	Rectangle : function(params) {
		var rectangle = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			width : 1.0,
			height : 1.0,
			type : "rectangle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setWidth : function(width) {
				this.width = width;
			},

			getX : function() {
				return this.pos.getX();
			},

			getY : function() {
				return this.pos.getY();
			},

			getWidth : function() {
				return this.width;
			},

			setHeight : function(height) {
				this.height = height;
			},

			getHeight : function() {
				return this.height;
			},

			render : function() {
				$g.strokeRect(this.pos.x, this.pos.y, this.width, this.height)
			}
		};
		rectangle.constructor(params);

		return rectangle;
	},

	AABB : function(params) {
		var aabb = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			hWidth : 1.0,
			hHeight : 1.0,
			type : "aabb",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setHalfWidth : function(hWidth) {
				this.hWidth = hWidth;
			},

			getHalfWidth : function() {
				return this.hWidth;
			},

			setHalfHeight : function(hHeight) {
				this.hHeight = hHeight;
			},

			getHalfHeight : function() {
				return this.hHeight;
			},

			render : function() {
				$g.strokeRect(this.pos.x - this.hWidth, this.pos.y - this.hHeight, this.hWidth * 2, this.hHeight * 2);
			}
		};
		aabb.constructor(params);

		return aabb;
	},

	Plane : function(params) {
		var plane = {
			type : "plane",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		plane.constructor(params);

		return plane;
	},

	Circle : function(params) {
		var circle = {
			pos : new GSGL.geometry.Point(0.0, 0.0),
			radius : 1.0,
			type : "circle",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			transform : function(x, y) {
				this.pos.transform(x, y);
			},

			setPosition : function(x, y) {
				this.pos.setPosition(x, y);
			},

			setX : function(x) {
				this.pos.setX(x);
			},

			getX : function() {
				return this.pos.getX();
			},

			setY : function(y) {
				this.pos.setY(y);
			},

			getY : function() {
				return this.pos.getY();
			},

			setRadius : function(radius) {
				this.radius = radius;
			},

			getRadius : function() {
				return this.radius;
			},

			render : function() {
				$g.beginPath();
				$g.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
				$g.stroke();
			}
		};
		circle.constructor(params);

		return circle;
	},

	Polygon : function(params) {
		var polygon = {
			points : [],
			type : "polygon",

			constructor : function(params) {
				var i, len;
				i = 0;
				len = params.length;

				for(i; i < len; i += 1) {
					this.addPoint(params[i]);
				}
			},

			addPoint : function(point) {
				this.points.push(point);
			},

			removePoint : function(i) {
				this.points.slice(i, 1);
			},

			removeFirst : function() {
				this.points.shift();
			},

			removeLast : function() {
				this.points.pop();
			},

			render : function() {
				var len, i;
				i = 1;
				len = this.points.length;

				if(len < 3) {
					return 0;
				}

				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);
				for(i; i < len; i += 1) {
					$g.lineTo(this.points[i].x, this.points[i].y);
				}
				$g.lineTo(this.points[0].x, this.points[0].y)
				$g.stroke();
			}
		};
		polygon.constructor(params);

		return polygon;
	},

	Bezier : function(params) {
		var bezier = {
			p0 : new GSGL.geometry.Vector2D(0.0, 0.0),
			p1 : new GSGL.geometry.Vector2D(0.0, 1.0),
			c0 : new GSGL.geometry.Vector2D(1.0, 0.0),
			c1 : new GSGL.geometry.Vector2D(1.0, 1.0),
			render_step : 0.01,
			type : "bezier",

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			getPoint : function(t) {
				if(t != 0) {
					var u, t, uu, uuu, ttt, p;
					u = 1 - t;
					tt = t * t;
					uu = u * u;
					uuu = uu * u;
					ttt = tt * t;
					
					p = this.p0.scale(uuu);
					p = p.add(this.c0.scale(3 * uu * t));
					p = p.add(this.c1.scale(3 * u * tt));
					p = p.add(this.p1.scale(ttt));
				} else {
					p = this.p0;
				}
				
				return p;
			},
			
			setStartPoint : function(x, y) {
				this.p0.setPosition(x, y);
			},
			
			setEndPoint : function(x, y) {
				this.p1.setPosition(x, y);
			},
			
			setControlPoint : function(controlpoint, x, y) {
				this["c" + controlpoint].setPosition(x, y);
			},
			
			setRenderStep : function(value) {
				this.render_step = value;
			},
			
			render : function() {
				var i, length;
				
				i = 0;
				length = 1 / this.render_step;
				
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				for(i; i < length; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
			},
			
			renderEdit : function() {
				var i, length;
				
				i = 0;
				length = 1 / this.render_step;
				
				// Render the bezier curve
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				for(i; i < length; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}
				$g.lineTo(this.p1.x, this.p1.y);
				$g.stroke();
				
				$g.save();
				$g.lineWidth = 1;
				// Render control points
				$g.beginPath();
				$g.arc(this.c0.x, this.c0.y, 4, 2 * Math.PI, false);
				$g.stroke();
				
				$g.beginPath();
				$g.arc(this.c1.x, this.c1.y, 4, 2 * Math.PI, false);
				$g.stroke();
				
				// Lines
				$g.beginPath();
				$g.moveTo(this.p0.x, this.p0.y);
				$g.lineTo(this.c0.x, this.c0.y);
				$g.stroke();

				$g.beginPath();
				$g.moveTo(this.p1.x, this.p1.y);
				$g.lineTo(this.c1.x, this.c1.y);
				$g.stroke();
				$g.restore();

				// Render start and end points.
				$g.fillRect(this.p0.x - 3, this.p0.y - 3, 6, 6);
				$g.fillRect(this.p1.x - 3, this.p1.y - 3, 6, 6);
			}
		};
		bezier.constructor(params);

		return bezier;
	},

	/* B-Spline primitive
	 * * * * * * * * * * * *
	 * Code based on BSpline by Tagussan licenced under The MIT Licence
	 * https://github.com/Tagussan/BSpline
	 */
	BSpline : function(params) {
		var bSpline = {
			points : [],
			degree : 2,
			range : 2,
			render_step: 0.01,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			addPoint : function(point) {
				this.points.push(point);
			},

			removePoint : function(i) {
				this.points.slice(i, 1);
			},

			removeFirst : function() {
				this.points.shift();
			},

			removeLast : function() {
				this.points.pop();
			},

			setDegree : function(degree) {
				if(typeof(degree) == "number" && degree >= 2 && degree <= 5) {
					this.degree = degree;
				}

				if(this.degree == 2 || this.degree == 3) {
					this.range = 2;
				} else {
					this.range = 3;
				}
			},

			basisDeg2 : function(x) {
			    if(-0.5 <= x && x < 0.5) {
			        return 0.75 - x * x;
			    } else if(0.5 <= x && x <= 1.5) {
			        return 1.125 + (-1.5 + x / 2.0) * x;
			    } else if(-1.5 <= x && x < -0.5) {
			        return 1.125 + (1.5 + x / 2.0) * x;
			    } else {
			        return 0;
			    }
			},

			basisDeg3 : function(x) {
			    if(-1 <= x && x < 0) {
			        return 2.0 / 3.0 + (-1.0 - x / 2.0) * x * x;
			    } else if(1 <= x && x <= 2) {
			        return 4.0 / 3.0 + x * (-2.0 + (1.0 - x / 6.0) * x);
			    } else if(-2 <= x && x < -1) {
			        return 4.0 / 3.0 + x *(2.0 + (1.0 + x / 6.0) * x);
			    } else if(0 <= x && x < 1) {
			        return 2.0 / 3.0 + (-1.0 + x / 2.0) * x * x;
			    } else {
			        return 0;
			    }
			},

			basisDeg4 : function(x) {
			    if(-1.5 <= x && x < -0.5) {
			        return 55.0 / 96.0 + x * (-(5.0 / 24.0) + x * (-(5.0 / 4.0) + (-(5.0 / 6.0) - x / 6.0) * x));
			    } else if(0.5 <= x && x < 1.5) {
			        return 55.0 / 96.0 + x * (5.0 / 24.0 + x * (-(5.0 / 4.0) + (5.0 / 6.0 - x / 6.0) * x));
			    } else if(1.5 <= x && x <= 2.5) {
			        return 625.0 / 384.0 + x * (-(125.0 / 48.0) + x * (25.0 / 16.0 + (-(5.0 / 12.0) + x / 24.0) * x));
			    } else if(-2.5 <= x && x <= -1.5) {
			        return 625.0 / 384.0 + x * (125.0 / 48.0 + x * (25.0 / 16.0 + (5.0 / 12.0 + x / 24.0) * x));
			    } else if(-1.5 <= x && x < 1.5) {
			        return 115.0 / 192.0 + x * x * (-(5.0 / 8.0) + x * x / 4.0);
			    } else {
			        return 0;
			    }
			},

			basisDeg5 : function(x) {
			    if(-2 <= x && x < -1) {
			        return 17.0 / 40.0 + x * (-(5.0 / 8.0) + x * (-(7.0 / 4.0) + x * (-(5.0 / 4.0) + (-(3.0 / 8.0) - x / 24.0) * x)));
			    } else if(0 <= x && x < 1) {
			        return 11.0 / 20.0 + x * x * (-(1.0 / 2.0) + (1.0 / 4.0 - x / 12.0) * x * x);
			    } else if(2 <= x && x <= 3) {
			        return 81.0 / 40.0 + x * (-(27.0 / 8.0) + x * (9.0 / 4.0 + x * (-(3.0 / 4.0) + (1.0 / 8.0 - x / 120.0) * x)));
			    } else if(-3 <= x && x < -2) {
			        return 81.0 / 40.0 + x *(27.0 / 8.0 + x * (9.0 / 4.0 + x * (3.0 / 4.0 + (1.0 / 8.0 + x / 120.0) * x)));
			    } else if(1 <= x && x < 2) {
			        return 17.0 / 40.0 + x * (5.0 / 8.0 + x * (-(7.0 / 4.0) + x * (5.0 / 4.0 + (-(3.0 / 8.0) + x / 24.0) * x)));
			    } else if(-1 <= x && x < 0) {
			        return 11.0 / 20.0 + x * x * (-(1.0 / 2.0) + (1.0 / 4.0 + x / 12.0) * x * x);
			    } else {
			        return 0;
			    }
			},

			getLength : function(subdiv) {
				var chunkLen = [];
				var index;
				var samples;
				var pos;
				var oldPos;
				var tmpVec;
				var totalLen = 0;
				var point = 0;
				var intPoint = 0;
				var oldIntPoint = 0;

				chunkLen[0] = 0;
				
				if(!subdiv) {
					subdiv = 100;
				}

				samples = this.points.length * subdiv;
				oldPos = new GSGL.geometry.Vector2D(this.points[0].x, this.points[0].y);

				var i = 1;
				var len = samples;

				for(i; i < len; i += 1) {
					index = i / samples;

					pos = this.getPoint(index);
					tmpVec = new GSGL.geometry.Vector2D(pos.x, pos.y);

					totalLen += tmpVec.distanceTo(oldPos);
					oldPos = new GSGL.geometry.Vector2D(pos.x, pos.y);

					point = (this.points.length - 1) * index;
					intPoint = Math.floor(point);

					if(intPoint != oldIntPoint) {
						chunkLen[intPoint] = totalLen.toFixed(8);
						oldIntPoint = intPoint;
					}
				}

				chunkLen[chunkLen.length] = totalLen;

				return {chunks: chunkLen, total: totalLen};
			},

			reparametrizeByArcLength : function(samplingCoef) {
				var newPoints = [];
				var i = 1;
				var len = this.points.length;
				var sl = this.getLength(100);
				var realDistance;
				var sampling;
				var pos;
				var indexCurrent;
				var index;
				var indexNext;

				newPoints.push(new GSGL.geometry.Point(this.points[0].x, this.points[0].y));

				for(i; i < len; i += 1) {
					realDistance = sl.chunks[i] - sl.chunks[i - 1];

					sampling = Math.ceil(samplingCoef * realDistance / sl.total);

					indexCurrent = (i - 1) / (this.points.length - 1);
					indexNext = i / (this.points.length - 1);

					var j = 1;

					for(j; j < sampling - 1; j += 1) {
						index = indexCurrent + j * (1 / sampling) * (indexNext - indexCurrent);

						pos = this.getPoint(index);
						newPoints.push(new GSGL.geometry.Point(pos.x, pos.y));
					}
				}

				this.points = newPoints;
			},

			interpolate : function(sequence, t) {
				var fn = this["basisDeg" + this.degree];
			    var tInt = Math.floor(t);
			    var result = 0;
			    var i = tInt - this.range;
			    var len = tInt + this.range;

			    for(i; i <= len; i += 1) {
			        result += sequence(i) * fn(t - i);
			    }

			    return result;
			},

			sequenceAt : function(dim) {
				var points = this.points;
    			var margin = this.degree + 1;

			    return function(n){
			        if(n < margin){
			            return points[0][dim];
			        } else if(points.length + margin <= n) {
			            return points[points.length - 1][dim];
			        } else {
			            return points[n - margin][dim];
			        }
			    };
			},

			getPoint : function(t) {
				var len = this.points.length;

				t = t * ((this.degree + 1) * 2 + len);

				return new GSGL.geometry.Point(this.interpolate(this.sequenceAt("x"), t), this.interpolate(this.sequenceAt("y"), t));
			},

			render : function() {
				var i, len;
				
				i = 0;
				len = 1 / this.render_step;
				
				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);
				for(i; i < len; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}

				len = this.points.length - 1;

				$g.lineTo(this.points[len].x, this.points[len].y);
				$g.stroke();
			},

			renderEdit : function() {
				var i, len;
				
				i = 0;
				len = 1 / this.render_step;
				
				// Render the B-Spline
				$g.beginPath();
				$g.moveTo(this.points[0].x, this.points[0].y);

				for(i; i < len; i++) {
					var vec = this.getPoint(i * this.render_step);
					$g.lineTo(vec.x, vec.y);
				}

				len = this.points.length - 1;

				$g.lineTo(this.points[len].x, this.points[len].y);
				$g.stroke();

				i = 0;
				len = this.points.length;
				// Render Control Points
				for(i; i < len; i += 1) {
					$g.beginPath();
					$g.arc(this.points[i].x, this.points[i].y, 4, 2 * Math.PI, false);
					$g.stroke();
				}
			}
		};
		bSpline.constructor(params);

		return bSpline;
	},
};