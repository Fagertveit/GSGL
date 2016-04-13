var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var copy = require('gulp-copy');

gulp.task('default', ['minify'], function() {
	console.log('Running default task!');
});

gulp.task('minify', function(done) {
	gulp.src([
			'./src/gsgl.js',
			'./src/gsgl.event.js',
			'./src/gsgl.geometry.js',
			'./src/gsgl.graphics.js',
			'./src/gsgl.physics.js',
			'./src/gsgl.resource.js',
			'./src/gsgl.surface.js',
			'./src/gsgl.ui.js',
			'./src/gsgl.utility.js',
			'./src/gsgl.tilemap.js',
			'./src/gsgl.gl.js',
			'./src/gsgl.gl.shader.js',
			'./src/gsgl.gl.particle.js',
			'./src/gsgl.gl.font.js',
			'./src/gsgl.gl.render.js',
			'./src/gsgl.gl.texture.js',
			'./src/gsgl.gl.sprite.js',
			'./src/gsgl.gl.ui.js',
		])
		.pipe(concat('gsgl.js'))
		.pipe(minify({
			ignoreFiles: ['-min.js']
		}))
		.pipe(gulp.dest('./dist/'), done);
});