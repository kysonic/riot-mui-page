webpackHotUpdate(0,{

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(195);
	riot.tag('combobox', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default</div> <div class="material-card-content"> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> </div> </div> <div class="riotmui-desc-description"> <p> Description ... </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Quick Styling</div> <riotmui-option data="{{this.parent.styling}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-button class="ui">\n      <div class="text">BUTTON</div>\n  </material-button>';
	    this.children = [{
	        title: '<div class="text">TEXT</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds text to the button.'
	    }];
	    // Options
	    this.options = [{
	        title: 'rounded',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make button rounded.'
	    }];
	    // Styling
	    this.styling = [{
	        title: '$material-button-height',
	        type: 'px',
	        'default': '40',
	        desc: 'Setup default height of button.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(196);
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../mixins/collections.es6\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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

/***/ 196:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(197);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(197, function() {
				var newContent = __webpack_require__(197);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "material-combo {\n  display: block;\n  position: relative; }\n  material-combo *[hidden] {\n    display: none; }\n  material-combo material-input input {\n    color: #2f6975; }\n", ""]);

	// exports


/***/ }

})