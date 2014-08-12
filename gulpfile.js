var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean');

// JSHint...
gulp.task('lint', function () {
	gulp.src('./app/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Browserify...
gulp.task('browserify', function () {
	// Single entry point for the app
	gulp.src(['app/scripts/main.js'])
		.pipe(browserify({
			insertGlobals: true,
			debug: true
		}))
		// Combine it
		.pipe(concat('bundle.js'))
		// Output it
		.pipe(gulp.dest('dist/js'));
});

// Hey... Watch it!
gulp.task('watch', ['lint'], function () {
	gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'], ['lint', 'browserify']);
});