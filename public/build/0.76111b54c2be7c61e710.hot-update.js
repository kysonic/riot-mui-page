webpackHotUpdate(0,{

/***/ 202:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(203);
	__webpack_require__(205);
	riot.tag('material-input', '<div class="label-placeholder"></div> <div class="{{input-content:true,not-empty:value,error:error}}"> <label for="input" name="label" if="{{opts.label}}">{{opts.label}}</label> <input type="{{opts.type || \'text\'}}" placeholder="{{opts.placeholder}}" onkeyup="{{changeValue}}" value="{{value}}" autocomplete="off" name="input"> <div class="iconWrapper" name="iconWrapper" if="{{opts.icon}}" > <material-button name="iconButton" center="true" waves-center="true" waves-color="{{opts[\'waves-color\']||\'#fff\'}}" rounded="true" waves-opacity="{{opts[\'waves-opacity\']||\'0.6\'}}" waves-duration="{{opts[\'waves-duration\']||\'600\'}}"> <yield></yield> </material-button> </div> </div> <div class="{{underline:true,focused:focused,error:error}}"> <div class="unfocused-line"></div> <div class="focused-line"></div> </div>', function (opts) {
	    var _this = this;

	    // Attributes
	    this.update({ value: opts.value || '' });
	    // For Validation Mixin
	    this.opts = opts;
	    // Not supported types
	    this.notSupportedTypes = ['date', 'color', 'datetime', 'month', 'range', 'time'];
	    if (this.notSupportedTypes.indexOf(opts.type) != -1) throw new Error('Sorry but we not support ' + date + ' type yet!');
	    // Icons
	    this.update({ showIcon: false });
	    /**
	     * When element focus changed update expressions.
	     */
	    this.changeFocus = function (e) {
	        _this.update({ focused: _this.input == document.activeElement });
	        _this.trigger('changeFocus', _this.focused, e);
	    };
	    /**
	     * Change input value should change tag behavior.
	     * @param e
	     */
	    this.changeValue = function (e) {
	        _this.update({ value: _this.input.value });
	        _this.trigger('changeValue', _this.input.value, e);
	    };
	    // Add event listeners to input. It is wat which will help us
	    // to provide focus\blur on material-input
	    this.input.addEventListener('focus', this.changeFocus);
	    this.input.addEventListener('blur', this.changeFocus);
	    // Validation
	    this.on('update', function (updated) {
	        if (updated && updated.value != undefined) {
	            if (_this.validationType) {
	                _this.isValid(_this.validate(updated.value));
	            }
	        }
	    });
	    /**
	     * Behevior after validation
	     * @param isValid - (true/false)
	     */
	    this.isValid = function (isValid) {
	        _this.update({ error: !isValid });
	    };
	    this.mixin('validate');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var ValidateMixin = Object.defineProperties({
	    init: function init() {
	        if (!this.opts) console.debug('Sorry, but for using validate mixin you should add following code in your component: this.opts = opts;');
	        if (this.opts && this.opts.valid) {
	            this.validationType = typeof this[this.opts.valid] == 'function' ? 'Function' : 'Regexp';
	            if (this.validationType === 'Regexp') {
	                try {
	                    this.validationRegexp = eval(this.opts.valid);
	                } catch (e) {
	                    throw new Error('Something wrong with your regular expression!. Checkout --- ' + e);
	                }
	                console.log(this.validationType);
	            }
	            if (this.validationType === 'Function') {
	                this.validationFunction = this[this.opts.valid] || false;
	            }
	        } else if (this.opts && Object.keys(this.base).indexOf(this.opts.type) != -1) {
	            this.validationType = 'Type';
	        }
	    },
	    validate: function validate(value) {
	        if (this.validationType) {
	            return this['validateBy' + this.validationType](value);
	        }
	        return null;
	    },
	    validateByFunction: function validateByFunction(value) {
	        if (this.validationFunction) {
	            return this.validationFunction(value);
	        }
	    },
	    validateByRegexp: function validateByRegexp(value) {
	        if (this.validationRegexp) {
	            return this.validationRegexp.test(value);
	        }
	    },
	    validateByType: function validateByType(value) {
	        return this.base[this.opts.type].test(value);
	    }
	}, {
	    base: {
	        get: function get() {
	            return {
	                'email': /^(([\w\.\-_]+)@[\w\-\_]+(\.\w+){1,}|)$/i,
	                'number': /^(\d+|)$/i,
	                'tel': /^((\+|\d)?([\d\-\(\)\#])|)+$/i,
	                'url': /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/i
	            };
	        },
	        configurable: true,
	        enumerable: true
	    }
	});

	riot.mixin('validate', ValidateMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})