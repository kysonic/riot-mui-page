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

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([new DefaultRoute({ tag: 'home' }), new Route({ tag: 'buttons' }), new Route({ tag: 'checkbox' })]);
	riot.router.start();

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(34);

	__webpack_require__(188);
	riot.tag('checkbox', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Button</div> <div class="material-card-content"> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> </div> </div> <div class="riotmui-desc-description"> <p> This component generate MUI button. It has two sets of options - button options and waves options (material-waves it is sub component providing material ripple). All of waves options have "waves" prefix, for example: waves-color. </p> <div class="description-title">Children</div> <div class="option row" each="{{option,key in this.parent.children}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> <div class="description-title">Options</div> <div class="option row" each="{{option,key in this.parent.options}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> <div class="description-title">Quick Styling</div> <div class="option row" each="{{option,key in this.parent.styling}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-button class="ui">\n      <div class="text">BUTTON</div>\n  </material-button>';
	    this.example2 = '<material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137">\n      <i class="material-icons">add</i>\n  </material-button>';
	    this.example3 = '<material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px">\n      <div class="text">ICON</div>\n      <i class="material-icons">create</i>\n  </material-button>';
	    this.example4 = '<material-button class="ui" disabled="true">\n      <div class="text">Disabled</div>\n  </material-button>';
	    this.children = [{
	        title: '<div class="text">TEXT</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds text to the button.'
	    }, {
	        title: '<div class="icon"><svg>...</svg></div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds icon to the button.'
	    }, {
	        title: ' <i class="material-icons"> create </i>',
	        type: 'tag',
	        'default': '',
	        desc: 'If you use google material icon set you can add it into material-button.'
	    }];
	    // Options
	    this.options = [{
	        title: 'rounded',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make button rounded.'
	    }, {
	        title: 'shady',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will add to the button box-shadow property.'
	    }, {
	        title: 'disabled',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" user won\'t be able to click on it. Also it will change button color.'
	    }, {
	        title: 'waves-center',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" waves will start animation from center of button.'
	    }, {
	        title: 'waves-opacity',
	        type: 'number [0<x<1]',
	        'default': '0.4',
	        desc: 'Using this option it\'s possible to setup wave opacity.'
	    }, {
	        title: 'waves-duration',
	        type: 'number [ms]',
	        'default': '400',
	        desc: 'Speed of waves animation.'
	    }, {
	        title: 'waves-color',
	        type: 'color [RGB]',
	        'default': '#fff',
	        desc: 'Allows to setup waves\'s color.'
	    }];
	    // Styling
	    this.styling = [{
	        title: '$material-button-height',
	        type: 'px',
	        'default': '40',
	        desc: 'Setup default height of button.'
	    }, {
	        title: '$material-button-background',
	        type: 'color',
	        'default': '#61bdcc',
	        desc: 'Setup default button background.'
	    }, {
	        title: '$material-button-disabled-background',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Setup disabled button background.'
	    }, {
	        title: '$material-button-color',
	        type: 'color',
	        'default': '#fff',
	        desc: 'Setup default button text color.'
	    }, {
	        title: '$material-button-padding',
	        type: 'rem',
	        'default': '0 2rem',
	        desc: 'Setup default button left&right offset.'
	    }, {
	        title: '$material-button-font-size',
	        type: 'px',
	        'default': '18',
	        desc: 'Setup default button text font size.'
	    }, {
	        title: '$material-button-icon-size',
	        type: 'px',
	        'default': '20',
	        desc: 'Setup default button icon font size. (For google material icon set)'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(189);
	riot.tag('material-checkbox', '<div class="{{checkbox:true,checked:checked}}" onclick="{{toggle}}"> <div class="checkmark"></div> </div> <div class="label" onclick="{{toggle}}"><yield></yield></div>', function (opts) {
	  var _this = this;

	  this.checked = opts.checked || false;
	  /**
	   * Toggle checkbox
	   */
	  this.toggle = function () {
	    _this.update({ checked: !_this.checked });
	    _this.trigger('toggle', _this.checked);
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(190);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(190, function() {
				var newContent = __webpack_require__(190);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "material-checkbox {\n  background-color: transparent;\n  display: block;\n  position: relative;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -moz-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  /** CheckBox **/\n  /** Label **/ }\n  material-checkbox .checkbox {\n    display: inline-block;\n    position: relative;\n    box-sizing: border-box;\n    height: 100%;\n    border: solid 2px;\n    border-color: #25313b;\n    background-color: transparent;\n    border-radius: 2px;\n    width: 18px;\n    height: 18px;\n    cursor: pointer;\n    vertical-align: middle;\n    -webkit-transition: background-color 140ms, border-color 140ms;\n    -ms-transition: background-color 140ms, border-color 140ms;\n    -moz-transition: background-color 140ms, border-color 140ms;\n    -o-transition: background-color 140ms, border-color 140ms;\n    transition: background-color 140ms, border-color 140ms; }\n    material-checkbox .checkbox .checkmark {\n      -webkit-transform: rotate(0deg) scale(0.5);\n      -ms-transform: rotate(0deg) scale(0.5);\n      -moz-transform: rotate(0deg) scale(0.5);\n      -o-transform: rotate(0deg) scale(0.5);\n      transform: rotate(0deg) scale(0.5);\n      position: absolute;\n      top: 1px;\n      left: 4px;\n      width: 6px;\n      height: 10px;\n      border-style: solid;\n      border-top: none;\n      border-left: none;\n      border-right-width: 2px;\n      border-bottom-width: 2px;\n      border-color: transparent;\n      cursor: pointer; }\n    material-checkbox .checkbox.checked {\n      background-color: #25313b;\n      -webkit-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -ms-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -moz-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -o-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1); }\n      material-checkbox .checkbox.checked .checkmark {\n        border-color: #fff;\n        -webkit-transform: rotate(45deg) scale(1);\n        -ms-transform: rotate(45deg) scale(1);\n        -moz-transform: rotate(45deg) scale(1);\n        -o-transform: rotate(45deg) scale(1);\n        transform: rotate(45deg) scale(1);\n        -webkit-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -ms-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -moz-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -o-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1); }\n  material-checkbox .label {\n    display: inline-block;\n    color: #25313b;\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: 8px;\n    white-space: normal;\n    cursor: pointer; }\n", ""]);

	// exports


/***/ }

})