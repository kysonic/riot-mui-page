webpackHotUpdate(0,{

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(29);
	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(14);
	riot.tag('buttons', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Button</div> <div class="material-card-content"> <material-button class="ui"> <div class="text">BUTTON</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Rounded Button</div> <div class="material-card-content"> <material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137"> <i class="material-icons">add</i> </material-button> </div> <riotmui-code style="margin-top: 29px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom Button</div> <div class="material-card-content"> <material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px"> <div class="text">CREATE</div> <i class="material-icons">create</i> </material-button> </div> <riotmui-code code="{{this.parent.parent.example3}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Disabled button</div> <div class="material-card-content"> <material-button class="ui" disabled="true"> <div class="text">Disabled</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example4}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component generate MUI button. It has two sets of options - button options and waves options (material-waves it is sub component providing material ripple). All of waves options have "waves" prefix, for example: waves-color. </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Quick Styling</div> <riotmui-option data="{{this.parent.styling}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
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
	        desc: 'Sets default height of button.'
	    }, {
	        title: '$material-button-background',
	        type: 'color',
	        'default': '#61bdcc',
	        desc: 'Sets default button background.'
	    }, {
	        title: '$material-button-disabled-background',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Sets disabled button background.'
	    }, {
	        title: '$material-button-color',
	        type: 'color',
	        'default': '#fff',
	        desc: 'Sets default button text color.'
	    }, {
	        title: '$material-button-padding',
	        type: 'rem',
	        'default': '0 2rem',
	        desc: 'Sets default button left&right offset.'
	    }, {
	        title: '$material-button-font-size',
	        type: 'px',
	        'default': '18',
	        desc: 'Sets default button text font size.'
	    }, {
	        title: '$material-button-icon-size',
	        type: 'px',
	        'default': '20',
	        desc: 'Sets default button icon font size. (For google material icon set)'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(188);
	riot.tag('checkbox', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Checkbox</div> <div class="material-card-content"> <material-checkbox name="checker">Label</material-checkbox> </div> <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Disabled Checkbox</div> <div class="material-card-content"> <material-checkbox disabled="true">Disabled</material-checkbox> </div> <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This is component can replace usual checkbox. To add label you can write some text into it. </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Quick Styling</div> <riotmui-option data="{{this.parent.styling}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-checkbox name="checker">\n      Label\n  </material-checkbox>';

	    this.example2 = '<material-checkbox disabled="true">\n      Disabled\n  </material-checkbox>';

	    this.children = [{
	        title: 'Label',
	        type: 'textContent',
	        'default': '',
	        desc: 'Adds label to checkbox.'
	    }];
	    // Options
	    this.options = [{
	        title: 'disabled',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will disable checkbox.'
	    }];
	    // Styling
	    this.styling = [{
	        title: '$material-chekbox-border-color',
	        type: 'color',
	        'default': '#25313b',
	        desc: 'Sets default border color of checkbox.'
	    }, {
	        title: '$material-chekbox-disabled-border-color',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Sets disabled border color of checkbox.'
	    }, {
	        title: '$material-chekbox-checkmark-color',
	        type: 'color',
	        'default': '#fff',
	        desc: 'Sets default color of check mark.'
	    }, {
	        title: '$material-chekbox-checkmark-background-color',
	        type: 'color',
	        'default': '#25313b',
	        desc: 'Sets default background color of checked checkbox.'
	    }, {
	        title: '$material-chekbox-label-color',
	        type: 'color',
	        'default': '#25313b',
	        desc: 'Sets default text color of label.'
	    }, {
	        title: '$material-chekbox-disabled-label-color',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Sets default text color of disabled label.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})