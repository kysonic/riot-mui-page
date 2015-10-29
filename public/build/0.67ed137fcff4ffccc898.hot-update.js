webpackHotUpdate(0,{

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(189);
	riot.tag('material-checkbox', '<div class="{{checkbox:true,checked:checked}}" onclick="{{toggle}}"> <div class="checkmark"></div> </div> <div class="label" onclick="{{toggle}}"><yield></yield></div>', function (opts) {
	    var _this = this;

	    this.checked = opts.checked || false;
	    // Attributes
	    this.disabled = opts.disabled || false;
	    /**
	     * Toggle checkbox
	     */
	    this.toggle = function () {
	        if (_this.disabled) return false;
	        _this.update({ checked: !_this.checked });
	        _this.trigger('toggle', _this.checked);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})