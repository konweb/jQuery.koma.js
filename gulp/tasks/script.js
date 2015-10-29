var gulp        = require( 'gulp' );
var config      = require( '../config.js' ).js;
var browserSync = require( 'browser-sync' );

gulp.task('scripts', function() {
	var $ = require( 'gulp-load-plugins' )();
	// gulp.src([
	// 		config.src + 'vendor/**/*.js',
	// 		config.src + 'app.js',
	// 		config.src + 'modules/**/*.js'
	// 	])
	// 	.pipe( $.plumber() )
	// 	.pipe( $.concat('all.js') )
	// 	.pipe( $.uglify( {preserveComments: "some"} ) )
	// 	.pipe( gulp.dest( config.dest ) )
	// 	.pipe( browserSync.reload( {stream: true} ) );
	gulp.src( config.src + '/**/*.js' )
		.pipe( $.plumber() )
		.pipe( $.babel() )
		.pipe( gulp.dest( config.dest ) )
		.pipe( browserSync.reload( {stream: true} ) );
});
