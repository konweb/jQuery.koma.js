'use strict';

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

	var loop = true;

	/**
  * Creates a new Koma.
  * @class
  */
	function Koma($el, op) {
		this.option = $.extend({
			'fps': 20,
			'steps': [],
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
		this.isSteps = this.option.steps.length > 0 ? true : false;
		this.setup();
	}

	/**
  * Setup
  * @return undefined
  */
	Koma.prototype.setup = function () {
		var _this = this;

		this.$img.slice(1).hide();
		this.imgLoad().then(function () {
			_this.animation();
			_this.eventify();
			if (_this.isSteps) _this.imgLoadSteps();
		}).fail(function () {
			console.log('image load error');
		});
	};

	/**
  * イベント設定
  * @return undefined
  */
	Koma.prototype.eventify = function () {
		var _this2 = this;

		var stopEvent = new $.Event('koma_stop');
		var restartEvent = new $.Event('koma_restart');

		this.$stop.on('click', function () {
			if (!window.cancelAnimationFrame) {
				loop = false;
			} else {
				window.cancelAnimationFrame(_this2.requestId);
			}
			_this2.$el.trigger(stopEvent, { $el: _this2.$el });
		});
		this.$restart.on('click', function () {
			loop = true;
			_this2.requestId = requestAnimationFrame($.proxy(_this2.animation, _this2));
			_this2.$el.trigger(restartEvent, { $el: _this2.$el });
		});
	};

	/**
  * 画像読み込み
  * @return promise
  */
	Koma.prototype.imgLoad = function () {
		var _this3 = this;

		var startNum = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var endNum = arguments.length <= 1 || arguments[1] === undefined ? this.isSteps ? this.option.steps[0] : this.imgLen : arguments[1];

		var promises = [];
		var retDefer = $.Deferred();
		this.imgLen = this.isSteps ? this.option.steps[0] : this.imgLen;

		var _loop = function (i) {
			var img = new Image();
			var defer = $.Deferred();
			img.onload = function () {
				defer.resolve();
			};
			img.error = function () {
				defer.reject();
			};
			img.src = _this3.$img.eq(i).attr('src');
			promises.push(defer);
		};

		for (var i = startNum; i < endNum; i++) {
			_loop(i);
		}

		$.when.apply(null, promises).done(function () {
			retDefer.resolve();
		}).fail(function () {
			retDefer.reject();
		});

		return retDefer.promise();
	};

	/**
  * 画像分割読み込み
  * @return undefind
  */
	Koma.prototype.imgLoadSteps = function () {
		var _this4 = this;

		var steps = this.option.steps;
		var stepArr = steps.length;
		var promise = $.Deferred().resolve();
		var endFrame = 0;
		var startFrame = steps[0];

		var _loop2 = function (i) {
			promise = promise.then(function () {
				endFrame = startFrame + steps[i];
				return _this4.imgLoad(startFrame, endFrame);
			}).then(function () {
				startFrame = endFrame;
				_this4.imgLen = endFrame;
			}).fail(function () {
				console.log('image load error');
			});
		};

		for (var i = 1; i < stepArr; i++) {
			_loop2(i);
		}
	};

	/**
  * コマ送りアニメーション
  * @return promise
  */
	Koma.prototype.animation = function () {
		if (!loop) return;
		this.requestId = requestAnimationFrame($.proxy(this.animation, this));
		var lastTime = getTime();
		var frame = Math.floor((lastTime - this.startTime) / (1000.0 / this.option.fps) % this.imgLen);
		if (frame === 0) frame = 1;
		this.$img.hide().slice(frame - 1, frame).show();
	};

	$.fn.koma = function (options) {
		var _this5 = this;

		return this.each(function () {
			new Koma($(_this5), options);
		});
	};
})();