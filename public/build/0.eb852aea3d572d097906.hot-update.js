webpackHotUpdate(0,{

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(196);
	__webpack_require__(198);
	__webpack_require__(199);
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

/***/ 199:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(200);
	riot.tag('material-dropdown-list', '<ul class="{{dropdown-content:true,opening:opening}}" if="{{opened}}" > <li each="{{item,key in items}}" class="{{selected:parent.selected==key}}"> <span if="{{!item.link}}" onclick="{{parent.select}}">{{item.title}}</span> <a if="{{item.link}}" href="{{item.link}}" onclick="{{parent.select}}" title="{{item.title}}">{{item.title}}</a> </li> </ul> <div name="overlay" if="{{opts.extraclose && opened}}" onclick="{{close}}" class="material-dropdown-list-overlay"></div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.opened = false;
	    // Attributes
	    if (opts.items) {
	        try {
	            this.items = eval(opts.items) || [];
	        } catch (e) {
	            console.error('Something wrong with your items. For details look at it - ' + e);
	        }
	        this.update({ items: this.items });
	    }
	    // Set selected
	    if (opts.selected) {
	        this.update({ selected: opts.selected });
	    }
	    /**
	     * Select dropdown item
	     * @param e
	     */
	    this.select = function (e) {
	        _this.update({ selected: e.item.key });
	        _this.close();
	        // Trigger event. It will help you to grab selected value from outside
	        // of this component
	        _this.trigger('select', e.item.key, e.item.item);
	        return true;
	        ///if(e.item.item.link) location.href = e.item.item.link;
	    };
	    /**
	     * Open dropdown list
	     */
	    this.open = function () {
	        _this.update({ opened: true, opening: true });
	        if (_this.opts.extraclose) document.body.appendChild(_this.overlay);
	        setTimeout(function () {
	            _this.update({ opening: false });
	        }, 0);
	    };
	    /**
	     * Close dropdown list
	     */
	    this.close = function () {
	        _this.update({ opening: true });
	        setTimeout(function () {
	            _this.update({ opened: false });
	        }, 200);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 200:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(201);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(201, function() {
				var newContent = __webpack_require__(201);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 201:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "material-dropdown-list {\n  position: absolute;\n  z-index: 100;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%; }\n  material-dropdown-list ul.dropdown-content {\n    z-index: 100;\n    background-color: #fff;\n    margin: 0;\n    min-width: 100px;\n    max-height: 650px;\n    overflow-y: auto;\n    will-change: width, height;\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transform: translateY(0px);\n    opacity: 1;\n    -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-dropdown-list ul.dropdown-content.opening {\n      transform: translateY(-50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-dropdown-list ul.dropdown-content li {\n      clear: both;\n      cursor: pointer;\n      line-height: 1.5rem;\n      width: 100%;\n      text-align: left;\n      text-transform: none;\n      background-color: #fff;\n      -webkit-transition: background-color .2s ease-in;\n      -ms-transition: background-color .2s ease-in;\n      -moz-transition: background-color .2s ease-in;\n      -o-transition: background-color .2s ease-in;\n      transition: background-color .2s ease-in; }\n      material-dropdown-list ul.dropdown-content li span {\n        font-size: 1.2rem;\n        color: #25313b;\n        display: block;\n        padding: 1rem 1rem; }\n      material-dropdown-list ul.dropdown-content li:hover {\n        background-color: #ededed;\n        -webkit-transition: background-color .2s ease-out;\n        -ms-transition: background-color .2s ease-out;\n        -moz-transition: background-color .2s ease-out;\n        -o-transition: background-color .2s ease-out;\n        transition: background-color .2s ease-out; }\n      material-dropdown-list ul.dropdown-content li a {\n        display: block;\n        width: 100%;\n        height: 100%; }\n      material-dropdown-list ul.dropdown-content li.selected {\n        background-color: #394b5a;\n        -webkit-transition: background-color .2s ease-out;\n        -ms-transition: background-color .2s ease-out;\n        -moz-transition: background-color .2s ease-out;\n        -o-transition: background-color .2s ease-out;\n        transition: background-color .2s ease-out; }\n        material-dropdown-list ul.dropdown-content li.selected span {\n          color: #fff; }\n\n/** OVERLAY **/\n.material-dropdown-list-overlay {\n  z-index: 99;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  position: fixed;\n  background: transparent; }\n", ""]);

	// exports


/***/ }

})