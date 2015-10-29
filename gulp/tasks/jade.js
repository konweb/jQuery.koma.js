var gulp   = require( 'gulp' );
var config = require( '../config.js' ).jade;

gulp.task('jade', function(){
	var $ = require( 'gulp-load-plugins' )();
	return gulp.src( ['!' + config.src + 'inc/*.jade', config.src + '*.jade'] )
		.pipe( $.plumber() )
		.pipe($.jade({
			pretty: true
		}))
		.pipe( gulp.dest( config.dest ) );
});
