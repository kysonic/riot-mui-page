webpackHotUpdate(0,{

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
	        desc: 'Setup default border color of checkbox.'
	    }, {
	        title: '$material-chekbox-disabled-border-color',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Setup disabled border color of checkbox.'
	    }, {
	        title: '$material-chekbox-checkmark-color',
	        type: 'color',
	        'default': '#fff',
	        desc: 'Setup default color of check mark.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})