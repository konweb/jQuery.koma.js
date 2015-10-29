'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
	var requestAnimationFrame = (function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
			window.setTimeout(callback, 1000.0 / 60.0);
		};
	})();

	var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);

	var getTime = function getTime() {
		return now && now.call(performance) || new Date().getTime();
	};

	/**
  * Creates a new Koma.
  * @class
  */

	var Koma = (function () {
		/**
   * Initialize
   * @param $el {element} peaent element
   * @param op {object} plugin options
   * @return undefined
   */

		function Koma($el, op) {
			_classCallCheck(this, Koma);

			this.option = $.extend({
				'fps': 20,
				'step': null,
				'itemEl': '.koma-items',
				'restartEl': '.koma-restart',
				'stopEl': '.koma-stop'
			}, op);
			this.$el = $el;
			this.$img = this.$el.find(this.option.itemEl + ' img');
			this.$item = this.$el.find(this.option.itemEl);
			this.$restart = this.$el.find(this.option.restartEl);
			this.$stop = this.$el.find(this.option.stopEl);
			this.imgLen = this.$img.length;
			this.startTime = getTime();
			this.animationFlag = true;
			this.setup();
		}

		/**
   * Setup
   * @return undefined
   */

		_createClass(Koma, [{
			key: 'setup',
			value: function setup() {
				var _this = this;

				this.$img.slice(1).hide();
				this.imgLoad().then(function () {
					_this.animation();
					_this.eventify();
				})['catch'](function () {
					console.log('画像読み込み失敗');
				});
			}

			/**
    * イベント設定
    * @return undefined
    */
		}, {
			key: 'eventify',
			value: function eventify() {
				var _this2 = this;

				var stopEvent = new $.Event('koma_stop');
				var restartEvent = new $.Event('koma_restart');
				this.$stop.on('click', function () {
					window.cancelAnimationFrame(_this2.requestId);
					_this2.$el.trigger(stopEvent, { $el: _this2.$el });
				});
				this.$restart.on('click', function () {
					_this2.requestId = requestAnimationFrame(_this2.animation.bind(_this2));
					_this2.$el.trigger(restartEvent, { $el: _this2.$el });
				});
			}

			/**
    * 画像読み込み
    * @return promise
    */
		}, {
			key: 'imgLoad',
			value: function imgLoad() {
				var promises = [];

				this.$img.each(function () {
					var img = new Image();
					img.src = $(this).attr('src');

					var promise = new Promise(function (resolve, reject) {
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

			/**
    * コマ送りアニメーション
    * @return promise
    */
		}, {
			key: 'animation',
			value: function animation() {
				this.requestId = requestAnimationFrame(this.animation.bind(this));
				var lastTime = getTime();
				var frame = Math.floor((lastTime - this.startTime) / (1000.0 / this.option.fps) % this.imgLen);
				if (frame === 0) frame = 1;
				this.$img.hide().slice(frame - 1, frame).show();
			}
		}]);

		return Koma;
	})();

	$.fn.koma = function (options) {
		var _this3 = this;

		return this.each(function () {
			new Koma($(_this3), options);
		});
	};
})();