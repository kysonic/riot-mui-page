webpackHotUpdate(0,[
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(3);
	__webpack_require__(7);
	__webpack_require__(10);
	__webpack_require__(14);
	__webpack_require__(22);
	__webpack_require__(25);
	riot.tag('app', '<material-navbar> <div class="row"> <div class="col col-lg-2 col-md-2"> <div class="logo"> <a href="/#" title="Material UI">material UI</a> <a href="https://muut.com/riotjs/" riot><div class="for-riot"></div></a> </div> </div> <div class="col col-lg-10 col-md-10"></div> </div> </material-navbar> <div class="row content"> <div class="col-lg-2 col-md-2 col left"> <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list> </div> <div class="col-lg-10 col-md-10 col right"> <route></route> </div> </div>', function (opts) {
	    var _this = this;

	    this.links = [{ link: '#buttons', title: 'Buttons' }, { link: '#checkbox', title: 'CheckBox' }, { link: '#combo', title: 'ComboBox' }, { link: '#dropdown', title: 'DropDown' }, { link: '#dropdown-list', title: 'DropdownList' }];
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
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "app {\n  display: block;\n  height: 100%;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans'; }\n  app p {\n    margin: 0; }\n  app .row {\n    height: 100%;\n    margin: 0;\n    padding: 0; }\n    app .row .col {\n      margin: 0;\n      padding: 0; }\n  app material-navbar .row .col {\n    display: flex;\n    flex-direction: row;\n    align-items: center; }\n  app material-navbar .logo {\n    display: block;\n    margin-left: 20px;\n    font-size: 33px;\n    font-weight: 100; }\n    app material-navbar .logo a {\n      display: inline-block;\n      text-decoration: none;\n      position: relative;\n      top: 3px; }\n    app material-navbar .logo .for-riot {\n      display: inline-block;\n      vertical-align: middle;\n      margin-left: 5px;\n      background: url(\"/images/for_riot.png\") no-repeat center;\n      width: 92px;\n      height: 37px;\n      position: relative;\n      bottom: 2px; }\n  app .content .left {\n    display: flex;\n    align-items: stretch;\n    flex-grow: 1;\n    flex-direction: row; }\n  app .content riotmui-list {\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: #f5f5f5; }\n  app .content route {\n    width: 100%;\n    height: 100%;\n    background: #fff; }\n    app .content route riotmui-desc {\n      display: block; }\n", ""]);

	// exports


/***/ }
])