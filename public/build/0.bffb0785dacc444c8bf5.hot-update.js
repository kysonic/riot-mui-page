webpackHotUpdate(0,{

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(196);
	__webpack_require__(198);
	__webpack_require__(199);
	__webpack_require__(202);
	riot.tag('material-combo', '<material-input name="input"></material-input> <material-dropdown-list __selected="{{opts.selected}}" name="dropdown"></material-dropdown-list> <input type="hidden" value="{{value}}"> <div name="options" hidden if="{{!isParsed}}"> <yield></yield> </div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.items = [];
	    this.isParsed = true;
	    this.title = null;
	    // Yielding
	    this.getOptions = function () {
	        // Get all options if it exits
	        Array.prototype.forEach.call(_this.options.children, function (option, key) {
	            if (option.tagName.toLowerCase() == 'option') {
	                var item = { title: option.innerHTML, value: option.getAttribute('value') };
	                _this.items.push(item);
	                // Set Selected
	                if (option.getAttribute('isSelected') != null) {
	                    _this.tags.dropdown.update({ selected: key });
	                    _this.update({ value: item.value || item.title });
	                    _this.title = item.title;
	                }
	            }
	        });
	        // Submit items to the dropdown
	        _this.tags.dropdown.update({ items: _this.items });
	        // We should update value of material combo
	        if (_this.tags.dropdown.selected) {
	            _this.update({ hValue: _this.tags.dropdown.items[_this.tags.dropdown.selected].value || _this.tags.dropdown.items[_this.tags.dropdown.selected].title });
	        }
	        _this.update({ isParsed: true });
	    };
	    // Setup options
	    this.getOptions();
	    // Attributes
	    if (opts.items) {
	        try {
	            this.items = eval(opts.items) || [];
	            if (this.items.length) this.tags.dropdown.update({ items: this.items });
	        } catch (e) {
	            console.error('Something wrong with your items. For details look at it - ' + e);
	        }
	    }
	    /**
	     * Ready
	     */
	    this.on('mount', function () {
	        // Defaults
	        _this.tags.dropdown.root.style.top = _this.tags.input.root.getBoundingClientRect().height + 'px';
	        _this.tags.input.update({ value: _this.title || (opts.defaultText || 'Choose item') });
	    });
	    /**
	     * When dropdown select event is working we
	     * update material-input and hidden
	     */
	    this.tags.dropdown.on('select', function (selected) {
	        _this.update({ value: _this.tags.dropdown.items[selected].value || _this.tags.dropdown.items[selected].title });
	        _this.tags.input.update({ value: _this.tags.dropdown.items[selected].title });
	        // After animation end
	        setTimeout(function () {
	            _this.tags.dropdown.update({ items: _this.items });
	        }, 200);
	    });
	    /**
	     * When material-input value has been changed
	     */
	    this.tags.input.on('changeValue', function (value) {
	        _this.tags.dropdown.update({ items: _this.filter('items', { title: value }) });
	    });
	    /**
	     * If material-input focus has been changed
	     * control dropdown opening
	     */
	    this.tags.input.on('changeFocus', function (focus) {
	        if (_this.tags.input.value == (opts.defaultText || 'Choose item') && focus) {
	            _this.tags.input.update({ value: '' });
	        }
	        if (_this.tags.input.value == '' && !focus) {
	            _this.tags.input.update({ value: opts.defaultText || 'Choose item' });
	        }
	        focus ? _this.tags.dropdown.open() : _this.tags.dropdown.close();
	    });
	    // Manage collection
	    this.mixin('collection');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

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

/***/ 203:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(204);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(204, function() {
				var newContent = __webpack_require__(204);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 204:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "material-input {\n  display: block;\n  padding: 8px 0;\n  position: relative;\n  /** LABEL PLACEHOLDER **/\n  /** UNDERLINE **/ }\n  material-input .label-placeholder {\n    height: 15px;\n    width: 100%; }\n  material-input .input-content {\n    font-size: 16px;\n    font-family: \"Ubuntu\";\n    color: #17242e;\n    position: relative;\n    /** LABEL **/\n    /** INPUT **/\n    /** ICON **/ }\n    material-input .input-content label {\n      position: absolute;\n      top: 0;\n      right: 0;\n      left: 0;\n      font: inherit;\n      color: #2f6975;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-size: 16px;\n      font-weight: 400;\n      line-height: 24px;\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-input .input-content.not-empty label {\n      -webkit-transform: translate3d(0, -70%, 0) scale(0.70);\n      -ms-transform: translate3d(0, -70%, 0) scale(0.70);\n      -moz-transform: translate3d(0, -70%, 0) scale(0.70);\n      -o-transform: translate3d(0, -70%, 0) scale(0.70);\n      transform: translate3d(0, -70%, 0) scale(0.70);\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-input .input-content input {\n      position: relative;\n      outline: none;\n      box-shadow: none;\n      padding: 0;\n      width: 100%;\n      background: transparent;\n      border: none;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-weight: 400;\n      line-height: 24px;\n      height: 24px; }\n    material-input .input-content .iconWrapper {\n      display: inline-block;\n      position: absolute;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      width: 40px;\n      height: 40px;\n      margin-left: -33px;\n      left: 100%;\n      margin-top: -7px; }\n      material-input .input-content .iconWrapper material-button {\n        background: transparent; }\n        material-input .input-content .iconWrapper material-button .content .material-icons {\n          color: #2f6975; }\n  material-input .underline {\n    position: relative;\n    display: block;\n    /** Focused behavior **/\n    /** Error **/ }\n    material-input .underline .unfocused-line {\n      height: 1px;\n      background: #2f6975; }\n    material-input .underline .focused-line {\n      height: 2px;\n      background: #2f6975;\n      -webkit-transform: scale3d(0, 1, 1);\n      -ms-transform: scale3d(0, 1, 1);\n      -moz-transform: scale3d(0, 1, 1);\n      -o-transform: scale3d(0, 1, 1);\n      transform: scale3d(0, 1, 1);\n      -webkit-transition: transform .2s ease-in;\n      -ms-transition: transform .2s ease-in;\n      -moz-transition: transform .2s ease-in;\n      -o-transition: transform .2s ease-in;\n      transition: transform .2s ease-in; }\n    material-input .underline.focused .focused-line {\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s ease-out;\n      -ms-transition: transform .2s ease-out;\n      -moz-transition: transform .2s ease-out;\n      -o-transition: transform .2s ease-out;\n      transition: transform .2s ease-out; }\n    material-input .underline.error .unfocused-line, material-input .underline.error .focused-line {\n      background: #941212;\n      -webkit-transition: background .2s ease-out;\n      -ms-transition: background .2s ease-out;\n      -moz-transition: background .2s ease-out;\n      -o-transition: background .2s ease-out;\n      transition: background .2s ease-out; }\n", ""]);

	// exports


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