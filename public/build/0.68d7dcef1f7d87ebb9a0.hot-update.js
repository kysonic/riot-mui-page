webpackHotUpdate(0,{

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(3);
	__webpack_require__(7);
	__webpack_require__(10);
	__webpack_require__(14);
	__webpack_require__(22);
	__webpack_require__(25);
	riot.tag('app', '<material-navbar> <div class="row"> <div class="col col-lg-3 col-md-4"> <div class="logo"> <a href="/#" title="Material UI">material UI</a> <a href="https://muut.com/riotjs/" riot><div class="for-riot"></div></a> </div> </div> <div class="col col-lg-9 col-md-8"></div> </div> </material-navbar> <div class="row content"> <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col left"> <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list> </div> <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 col right"> <route></route> </div> </div>', function (opts) {
	    var _this = this;

	    this.links = [{ link: '#buttons', title: 'Buttons' }, { link: '#checkbox', title: 'CheckBox' }, { link: '#combobox', title: 'ComboBox' }, { link: '#dropdown', title: 'DropDown' }, { link: '#dropdown-list', title: 'DropdownList' }];
	    this.route = window.location.hash.replace('#', '') || 'Home';
	    this.tags.riotmuiList.update({ selected: window.location.hash });
	    riot.route(function (collection, id, action) {
	        _this.update({ route: collection || 'Home' });
	        _this.tags.riotmuiList.update({ selected: '#' + collection });
	    });
	    /**
	     * Go Back
	     */
	    this.back = function () {
	        window.location.hash = "/#";
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

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

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([new DefaultRoute({ tag: 'home' }), new Route({ tag: 'buttons' }), new Route({ tag: 'checkbox' }), new Route({ tag: 'combobox' })]);
	riot.router.start();

/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../material-elements/material-combobox/material-combobox.tag\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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

/***/ }

})