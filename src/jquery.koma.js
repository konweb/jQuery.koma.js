
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

	/**
	 * Creates a new Koma.
	 * @class
	 */
	class Koma {
		/**
		 * Initialize
		 * @param $el {element} peaent element
		 * @param op {object} plugin options
		 * @return undefined
		 */
		constructor($el, op) {
			this.option = $.extend({
				'fps'       : 20,
				'steps'     : [],
				'itemEl'    : '.koma-items',
				'restartEl' : '.koma-restart',
				'stopEl'    : '.koma-stop'
			}, op);
			this.$el           = $el;
			this.$img          = this.$el.find(this.option.itemEl + ' img');
			this.$item         = this.$el.find(this.option.itemEl);
			this.$restart      = this.$el.find(this.option.restartEl);
			this.$stop         = this.$el.find(this.option.stopEl);
			this.imgLen        = this.$img.length;
			this.startTime     = getTime();
			this.animationFlag = true;
			this.isSteps       = this.option.steps.length > 0 ? true : false;
			this.setup();
		}

		/**
		 * Setup
		 * @return undefined
		 */
		setup() {
			this.$img.slice(1).hide();
			this.imgLoad()
				.then(() => {
					this.animation();
					this.eventify();
					if(this.isSteps) this.imgLoadSteps();
				}).fail(() => {
					console.log('image load error'); 
				});
		}

		/**
		 * イベント設定
		 * @return undefined
		 */
		eventify(){
			let stopEvent    = new $.Event('koma_stop');
			let restartEvent = new $.Event('koma_restart');
			this.$stop.on('click', () => {
				window.cancelAnimationFrame( this.requestId );
				this.$el.trigger( stopEvent, {$el: this.$el} );
			});
			this.$restart.on('click', () => {
				this.requestId = requestAnimationFrame( this.animation.bind(this) );
				this.$el.trigger( restartEvent, {$el: this.$el} );
			});
		}

		/**
		 * 画像読み込み
		 * @return promise
		 */
		imgLoad(startNum = 0, endNum = this.isSteps ? this.option.steps[0] : this.imgLen) {
			let promises = [];
			let retDefer = $.Deferred();
			this.imgLen = this.isSteps ? this.option.steps[0] : this.imgLen;

			for(let i = startNum;i < endNum;i++){
				let img = new Image();
				let defer = $.Deferred();
				img.src = this.$img.eq(i).attr('src');
				img.onload = function () {
					defer.resolve();
				};
				img.error = function () {
					defer.reject();
				};
				promises.push(defer);
			}

			$.when.apply(null, promises).done(() => {
				retDefer.resolve();
			}).fail(() => {
				retDefer.reject();
			});

			return retDefer.promise();
		}

		/**
		 * 画像分割読み込み
		 * @return undefind
		 */
		imgLoadSteps() {
			let steps      = this.option.steps;
			let stepArr    = steps.length;
			let promise    = $.Deferred().resolve();
			let endFrame   = 0;
			let startFrame = steps[0];

			for(let i = 1;i < stepArr;i++){
				promise = promise.then(() => {
					endFrame = startFrame + steps[i];
					return this.imgLoad(startFrame, endFrame);
				}).then(() => {
					startFrame  = endFrame;
					this.imgLen = endFrame;
				}).fail(() => {
					console.log('image load error'); 
				});
			}
		}

		/**
		 * コマ送りアニメーション
		 * @return promise
		 */
		animation() {
			this.requestId = requestAnimationFrame( this.animation.bind(this) );
			let lastTime   = getTime();
			let frame      = Math.floor( ( lastTime - this.startTime ) / ( 1000.0 / this.option.fps ) % this.imgLen );
			if(frame === 0) frame = 1;
			this.$img.hide().slice( (frame-1), frame ).show();
		}
	}

	$.fn.koma = function(options) {
		return this.each(() => {
			new Koma($(this), options);
		});
	};
}();