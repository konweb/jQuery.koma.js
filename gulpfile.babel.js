var gulp = require('gulp');
var dir  = require( 'require-dir' );
dir( './gulp/tasks', { recurse: true } );

// defaults task
gulp.task("start", ['watch', 'bs']);

// gulpfile save restart
var spawn = require('child_process').spawn;
gulp.task('default', function() {
	var process;
	function restart() {
		if (process) process.kill();
		process = spawn('gulp', ['start'], {stdio: 'inherit'});
	}
	gulp.watch('gulpfile.babel.js', restart);
	restart();
});