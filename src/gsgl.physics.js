GSGL.physics = {
	pointLine : function(point, line) {

	},

	pointTriangle : function(point, triangle) {

	},

	pointCircle : function(point, circle) {

	},

	pointRectangle : function(point, rectangle) {
		return (point.x > rectangle.pos.x && point.x < rectangle.pos.x + rectangle.width && 
				point.y > rectangle.pos.y && point.y < rectangle.pos.y + rectangle.height);
	},

	pointPolygon : function(point, polygon) {

	},

	lineLine : function(line1, line2) {

	},

	lineTriangle : function(line, triangle) {

	},

	lineCircle : function(line, circle) {

	},

	lineRectangle : function(line, rectangle) {

	},

	linePolygon : function(line, polygon) {

	},

	triangleTriangle : function(triangle1, triangle2) {

	},

	triangleCircle : function(triangle, circle) {

	},

	triangleRectangle : function(triangle, rectangle) {

	},

	trianglePolygon : function(triangle, polygon) {

	},

	circleCircle : function(c0, c1) {
		var v0, v1, vLen, cRadi;
		v0 = new GSGL.geometry.Vector2D(c0.pos.x, c0.pos.y);
		v1 = new GSGL.geometry.Vector2D(c1.pos.x, c1.pos.y);
		len = v1.subtract(v0).length();
		cRadi = c0.radius + c1.radius;

		return len < cRadi;
	},

	circleRectangle : function(circle, rectangle) {

	},

	circlePolygon : function(circle, polygon) {

	},

	rectangleRectangle : function(rectangle1, rectangle2) {
		return (rectangle1.pos.x + rectangle1.width >= rectangle2.pos.x && 
				rectangle1.pos.y + rectangle1.height >= rectangle2.pos.y && 
				rectangle1.pos.x <= rectangle2.pos.x + rectangle2.width && 
				rectangle1.pos.y <= rectangle2.pos.y + rectangle2.height);
	},

	rectanglePolygon : function(rectangle, polygon) {

	},

	polygonPolygon : function(polygon1, polygon2) {

	},

	intersects : function(shape1, shape2) {
		if(typeof( GSGL.physics[shape1.type + GSGL.utility.capitalize(shape2.type)] ) == "function") {
			//GSAW.cLog("Intersects", "Using collider: " + shape1.type + GSAW.engine.Utility.capitalize(shape2.type));
			return GSGL.physics[shape1.type + GSGL.utility.capitalize(shape2.type)](shape1, shape2);
		} else if(typeof( GSGL.physics[shape2.type + GSGL.utility.capitalize(shape1.type)] ) == "function") {
			//GSAW.cLog("Intersects", "Using collider: " + shape2.type + GSAW.engine.Utility.capitalize(shape1.type));
			return GSGL.physics[shape2.type + GSGL.utility.capitalize(shape1.type)](shape2, shape1);
		} else {
			//GSAW.cLog("Collision", "Couldn't find a collider for the objects!");
			return 0;
		}
	}
};