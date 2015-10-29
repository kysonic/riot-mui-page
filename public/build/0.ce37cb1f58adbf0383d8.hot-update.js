webpackHotUpdate(0,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "app {\n  display: block;\n  height: 100%;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans'; }\n  app p {\n    margin: 0; }\n  app .row {\n    height: 100%;\n    margin: 0;\n    padding: 0; }\n    app .row .col {\n      margin: 0;\n      padding: 0; }\n  app material-navbar .row .col {\n    display: flex;\n    flex-direction: row;\n    align-items: center; }\n  app material-navbar .logo {\n    display: block;\n    margin-left: 20px;\n    font-size: 33px;\n    font-weight: 100; }\n    app material-navbar .logo a {\n      display: inline-block;\n      text-decoration: none;\n      position: relative;\n      top: 3px; }\n    app material-navbar .logo .for-riot {\n      display: inline-block;\n      vertical-align: middle;\n      margin-left: 5px;\n      background: url(\"/images/for_riot.png\") no-repeat center;\n      width: 92px;\n      height: 37px;\n      position: relative;\n      bottom: 2px; }\n  app .content .left {\n    display: flex;\n    align-items: stretch;\n    flex-grow: 1;\n    flex-direction: row; }\n  app .content riotmui-list {\n    display: block;\n    width: 100%;\n    background: #f5f5f5;\n    min-height: calc(100vh - 70px); }\n  app .content route {\n    width: 100%;\n    height: 100%;\n    background: #fff; }\n    app .content route riotmui-desc {\n      display: block; }\n", ""]);

	// exports


/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(29);
	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(14);
	__webpack_require__(34);
	riot.tag('buttons', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Button</div> <div class="material-card-content"> <material-button class="ui"> <div class="text">BUTTON</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Rounded Button</div> <div class="material-card-content"> <material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137"> <i class="material-icons">add</i> </material-button> </div> <riotmui-code style="margin-top: 29px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom Button</div> <div class="material-card-content"> <material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px"> <div class="text">CREATE</div> <i class="material-icons">create</i> </material-button> </div> <riotmui-code code="{{this.parent.parent.example3}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Disabled button</div> <div class="material-card-content"> <material-button class="ui" disabled="true"> <div class="text">Disabled</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example4}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component generate MUI button. It has two sets of options - button options and waves options (material-waves it is sub component providing material ripple). All of waves options have "waves" prefix, for example: waves-color. </p> <div class="description-title">Children</div> <div class="option row" each="{{option,key in this.parent.children}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> <div class="description-title">Options</div> <div class="option row" each="{{option,key in this.parent.options}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> <div class="description-title">Quick Styling</div> <div class="option row" each="{{option,key in this.parent.styling}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-button class="ui">\n      <div class="text">BUTTON</div>\n  </material-button>';
	    this.example2 = '<material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137">\n      <i class="material-icons">add</i>\n  </material-button>';
	    this.example3 = '<material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px">\n      <div class="text">ICON</div>\n      <i class="material-icons">create</i>\n  </material-button>';
	    this.example4 = '<material-button class="ui" disabled="true">\n      <div class="text">Disabled</div>\n  </material-button>';
	    this.children = [{
	        title: '<div class="text"> TEXT </div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds text to the button.'
	    }, {
	        title: '<div class="icon"> <svg>...</svg> </div>',
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

/***/ }

})