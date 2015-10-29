webpackHotUpdate(0,{

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(196);
	__webpack_require__(198);
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

/***/ 198:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var CollectionMixin = {
	    /**
	     * Filter collection by criteria
	     * @params prop - collection name
	     * @params criteria - object (Which field should be filtred)
	     */
	    filter: function filter(prop, criteria) {
	        return this[prop].filter(function (item) {
	            var criteriaPass = false;
	            Object.keys(criteria).forEach(function (k) {
	                var v = criteria[k];
	                var regexp = new RegExp('' + v, 'i');
	                criteriaPass = regexp.test(item[k]);
	            });
	            return criteriaPass;
	        });
	    },
	    /**
	     * Find something in collection
	     * @params prop - collection name
	     * @params criteria - object (Which field should be filtred)
	     */
	    find: function find(data, criteria) {
	        var searched = {};
	        var i = 0;
	        data.forEach(function (e) {
	            Object.keys(criteria).forEach(function (k) {
	                var v = criteria[k];
	                if (e[k] == v) {
	                    searched.e = e;
	                    searched.k = i;
	                }
	            });
	            i++;
	        });
	        return searched;
	    }
	};

	riot.mixin('collection', CollectionMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})