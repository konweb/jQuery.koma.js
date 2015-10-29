
() => {
	var requestAnimationFrame = ( function(){
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){
					window.setTimeout( callback, 1000.0 / 60.0 );
				};
	} )();

	var now = window.performance && (
		performance.now || 
		performance.mozNow || 
		performance.msNow || 
		performance.oNow || 
		performance.webkitNow );

	var getTime = function() {
		return ( now && now.call( performance ) ) || ( new Date().getTime() );
	};

	class Koma {
		constructor($el, op) {
			this.$el       = $el;
			this.$img      = this.$el.find('img');
			this.imgLen    = this.$img.length;
			this.startTime = getTime();
			this.option    = $.extend({
				'fps': 20
			}, op);
			this.setup();
		}

		setup() {
			this.$img.slice(1).hide();
			this.imgLoad()
				.then( this.animation.bind(this) )
				.catch( () => { console.log('画像読み込み失敗'); } );
		}

		imgLoad() {
			let promises = [];

			this.$img.each(function(){
				let img = new Image();
				img.src = $(this).attr('src');

				let promise = new Promise((resolve, reject) => {
					img.onload = function () {
						resolve();
					};
					img.error = function () {
						reject();
					};
				});
				promises.push(promise);
			});
			return Promise.all(promises);
		}

		animation() {
			requestAnimationFrame( this.animation.bind(this) );
			let lastTime = getTime();
			let frame    = Math.floor( ( lastTime - this.startTime ) / ( 1000.0 / this.option.fps ) % this.imgLen );
			this.$img.hide();
			this.$img.slice( (frame-1), frame ).show();
		}
	}

	$.fn.koma = function(options) {
		return this.each(() => {
			new Koma($(this), options);
		});
	};
}();