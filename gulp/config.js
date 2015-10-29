/**
 * config.js
 * - ディレクトリ構造
 */

const ROOT       =     './';
const SRC_ROOT   = ROOT + 'src';
const BUILD_ROOT = ROOT;

module.exports = {
	root       : ROOT,
	src_root   : SRC_ROOT,
	build_root : BUILD_ROOT,
	js: {
		src        : SRC_ROOT,
		dest       : BUILD_ROOT,
		bundle     : 'bundle.js',
		browserify : {
			debug     : true,
			transform : [ 'reactify', 'debowerify' ]
		}
	},
	jade: {
		src  : BUILD_ROOT + 'demo/jade/',
		dest : BUILD_ROOT + 'demo/'
	},
	build: {
		depends: [ 'js', 'css' ]
	}
};