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
	riot.tag('app', '<material-navbar> <div class="row"> <div class="col col-lg-2 col-md-2"> <div class="logo"> <a href="/#" title="Material UI">material UI</a> <a href="https://muut.com/riotjs/" riot><div class="for-riot"></div></a> </div> </div> <div class="col col-lg-10 col-md-10"></div> </div> </material-navbar> <div class="row content"> <div class="col-lg-1 col-md-1 col"> <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list> </div> <div class="col-lg-11 col-md-11 col"> <route></route> </div> </div>', function (opts) {
	    var _this = this;

	    this.links = [{ link: '#buttons', title: 'Buttons' }, { link: '#checkbox', title: 'Checkbox' }, { link: '#combo', title: 'Combo' }, { link: '#dropdown', title: 'Dropdown' }, { link: '#dropdown-list', title: 'Dropdown list' }];
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

/***/ }

})