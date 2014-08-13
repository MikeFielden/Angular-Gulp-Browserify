var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');


var embedlr = require('gulp-embedlr'),
	refresh = require('gulp-livereload'),
	lrserver = require('tiny-lr')(),
	express = require('express'),
	livereload = require('connect-livereload'),
	livereloadport = 35729,
	serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
	res.sendfile('index.html', { root: 'dist' });
});

// Dev task
gulp.task('dev', ['views', 'styles', 'lint', 'browserify'], function() {
	// Start webserver
	server.listen(serverport);
	// Start live reload
	lrserver.listen(livereloadport);
	// Run the watch task, to keep taps on changes
	gulp.run('watch');
});

// JSHint...
gulp.task('lint', function () {
	gulp.src('./app/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Sass...
gulp.task('styles', function() {
	gulp.src('app/styles/*.scss')
	// The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
	.pipe(sass({onError: function(e) { console.log(e); } }))

	.pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))

	.pipe(gulp.dest('dist/css/'))
	.pipe(refresh(lrserver));
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

// Move over the views into dist so they can be served
gulp.task('views', function () {
	// index
	gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));

	// Any other templates aka "views"
	gulp.src('./app/views/**/*')
		.pipe(gulp.dest('dist/views/'))
		// Tell LiveReload to refresh
		.pipe(refresh(lrserver));
});

// Hey... Watch it!
gulp.task('watch', ['lint'], function () {
	// Watch the scripts
	gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'], ['lint', 'browserify']);

	// Watch styles
  	gulp.watch(['app/styles/**/*.scss'], ['styles']);

	// Watch the views
	gulp.watch(['app/index.html', 'app/views/**/*.html'], ['views']);
});