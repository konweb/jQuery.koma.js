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

	var Koma = (function () {
		function Koma($el, op) {
			_classCallCheck(this, Koma);

			this.$el = $el;
			this.$img = this.$el.find('img');
			this.imgLen = this.$img.length;
			this.startTime = getTime();
			this.option = $.extend({
				'fps': 20
			}, op);
			this.setup();
		}

		_createClass(Koma, [{
			key: 'setup',
			value: function setup() {
				this.$img.slice(1).hide();
				this.imgLoad().then(this.animation.bind(this))['catch'](function () {
					console.log('画像読み込み失敗');
				});
			}
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
		}, {
			key: 'animation',
			value: function animation() {
				requestAnimationFrame(this.animation.bind(this));
				var lastTime = getTime();
				var frame = Math.floor((lastTime - this.startTime) / (1000.0 / this.option.fps) % this.imgLen);
				this.$img.hide();
				this.$img.slice(frame - 1, frame).show();
			}
		}]);

		return Koma;
	})();

	$.fn.koma = function (options) {
		var _this = this;

		return this.each(function () {
			new Koma($(_this), options);
		});
	};
})();