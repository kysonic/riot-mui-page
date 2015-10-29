webpackHotUpdate(0,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "app {\n  display: block;\n  height: 100%;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans'; }\n  app p {\n    margin: 0; }\n  app .row {\n    height: 100%;\n    margin: 0;\n    padding: 0; }\n    app .row .col {\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      margin: 0;\n      padding: 0; }\n  app material-navbar .logo {\n    display: block;\n    margin-left: 20px;\n    font-size: 33px;\n    font-weight: 100; }\n    app material-navbar .logo a {\n      display: inline-block;\n      text-decoration: none;\n      position: relative;\n      top: 3px; }\n    app material-navbar .logo .for-riot {\n      display: inline-block;\n      vertical-align: middle;\n      margin-left: 5px;\n      background: url(\"/images/for_riot.png\") no-repeat center;\n      width: 92px;\n      height: 37px;\n      position: relative;\n      bottom: 2px; }\n  app .content riotmui-list {\n    display: block;\n    width: 100%;\n    height: calc(100vh - 70px);\n    background: #f5f5f5; }\n  app .content route {\n    width: 100%;\n    height: 100%;\n    background: #fff;\n    height: calc(100vh - 70px);\n    padding: 0 30px; }\n    app .content route riotmui-desc {\n      display: block; }\n", ""]);

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
	riot.tag('buttons', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Button</div> <div class="material-card-content"> <material-button class="ui"> <div class="text">BUTTON</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Rounded Button</div> <div class="material-card-content"> <material-button class="ui" center="true" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137"> <i class="material-icons">add</i> </material-button> </div> <riotmui-code style="margin-top: 29px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom Button</div> <div class="material-card-content"> <material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px"> <div class="text">CREATE</div> <i class="material-icons">create</i> </material-button> </div> <riotmui-code code="{{this.parent.parent.example3}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Disabled button</div> <div class="material-card-content"> <material-button class="ui" disabled="true"> <div class="text">Disabled</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example4}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component generate MUI button. It has two sets of options - button options and waves options (material-waves it is sub component providing material ripple). All of waves options have "waves" prefix, for example: waves-color. </p> <div class="description-title">Options</div> <div class="option row"> <div class="option-title col-lg-3 col-md-3 col-sm-3 col-xs-3">rounded</div> <div class="option-desc col-lg-9 col-md-9 col-sm-9 col-xs-9"> <p> <span class="type">string</span> <span class="default">false</span> </p> <p> Descriptoion of option </p> </div> </div> </div> </riotmui-desc>', function (opts) {
	  this.example1 = "<material-button class=\"ui\">\n      <div class=\"text\">BUTTON</div>\n  </material-button>";
	  this.example2 = "<material-button class=\"ui\" center=\"true\" waves-center=\"true\" rounded=\"true\" waves-opacity=\"0.6\" waves-duration=\"600\" style=\"background:#f43137\">\n      <i class=\"material-icons\">add</i>\n  </material-button>";
	  this.example3 = "<material-button class=\"ui\" waves-color=\"#000\" shady=\"true\" style=\"background:#ed7ff4; height: 50px; line-height: 46px\">\n      <div class=\"text\">ICON</div>\n      <i class=\"material-icons\">create</i>\n  </material-button>";
	  this.example4 = "<material-button class=\"ui\" disabled=\"true\">\n      <div class=\"text\">Disabled</div>\n  </material-button>";
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})