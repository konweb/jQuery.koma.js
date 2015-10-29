var gulp   = require( 'gulp' );
var config = require( '../config.js' );

// file watch
gulp.task('watch', function(){
	var gaze_opt = {
		debounceDelay: 1000 // wait after the last run
	};
	gulp.watch( [config.jade.src + '/**/*.jade'], gaze_opt, ['jade'] );
	gulp.watch( [config.root + "**/*.html"], gaze_opt, ['bs-reload'] );
	gulp.watch( [config.js.src + '/**/*.js'], gaze_opt, ['scripts', 'webpack'] );
});
