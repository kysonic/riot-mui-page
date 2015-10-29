webpackHotUpdate(0,{

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var riot = __webpack_require__(1);
	__webpack_require__(25);
	// Page tags
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(187);
	__webpack_require__(194);
	__webpack_require__(206);
	__webpack_require__(207);

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([new DefaultRoute({ tag: 'home' }), new Route({ tag: 'buttons' }), new Route({ tag: 'checkbox' }), new Route({ tag: 'combobox' }), new Route({ tag: 'm-input' }), new Route({ tag: 'dropdown' })]);
	riot.router.start();

/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(14);
	__webpack_require__(208);
	riot.tag('dropdown', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default</div> <div class="material-card-content"> <material-button> <div class="text">OPEN</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> </div> </div> <div class="riotmui-desc-description"> <p> Description ... </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option>  </div> </riotmui-desc>', function (opts) {
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

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(209);
	riot.tag('material-dropdown', '<div name="dropdown" class="{{dropdown:true,opening:opening}}" if="{{opened}}"> <yield></yield> </div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.opened = opts.opened || false;
	    // Attributes
	    this.dropdown.classList.add(opts.animation || 'top');
	    /**
	     * Open dropdown
	     */
	    this.open = function () {
	        _this.update({ opened: true, opening: true });
	        setTimeout(function () {
	            _this.update({ opening: false });
	        }, 0);
	    };
	    /**
	     * Close dropdown
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

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(210);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(210, function() {
				var newContent = __webpack_require__(210);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "material-dropdown .dropdown {\n  background-color: #fff;\n  margin: 0;\n  min-width: 100px;\n  max-height: 650px;\n  overflow-y: auto;\n  will-change: width, height;\n  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  transform: translateY(0px);\n  opacity: 1;\n  -webkit-transition: transform .2s ease-in,opacity .2s;\n  -ms-transition: transform .2s ease-in,opacity .2s;\n  -moz-transition: transform .2s ease-in,opacity .2s;\n  -o-transition: transform .2s ease-in,opacity .2s;\n  transition: transform .2s ease-in,opacity .2s;\n  /** OPENING **/ }\n  material-dropdown .dropdown.opening.top {\n    transform: translateY(-50px);\n    opacity: 0;\n    -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n  material-dropdown .dropdown.opening.bottom {\n    transform: translateY(50px);\n    opacity: 0;\n    -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n", ""]);

	// exports


/***/ }

})