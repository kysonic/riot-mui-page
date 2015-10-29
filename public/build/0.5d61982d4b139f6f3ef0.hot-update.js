webpackHotUpdate(0,{

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(31);
	__webpack_require__(37);
	__webpack_require__(191);
	__webpack_require__(34);

	__webpack_require__(14);
	__webpack_require__(208);
	riot.tag('dropdown', '<riotmui-desc name="desc"> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Default Dropdown</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonOne" onclick="{{parent.parent.openDropDownOne}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown name="dropDownOne"> <p>DropDown content</p> </material-dropdown> </div> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardTwo"> <div class="material-card-title">Chnaged animation</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonTwo" onclick="{{parent.parent.openDropDownTwo}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown animation="bottom" name="dropDownOne"> <p>DropDown content</p> </material-dropdown> </div> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component provides functionality of dropown. It has two common methods - open() and close(). </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option>  </div> </riotmui-desc>', function (opts) {
	    var _this = this;

	    // Examples
	    this.example1 = '<material-dropdown>\n      <p>DropDown content</p>\n  </material-dropdown>';
	    this.example2 = '<material-dropdown animation="bottom">\n      <p>DropDown content</p>\n  </material-dropdown>';
	    this.children = [{
	        title: '<p>Any content...</p>',
	        type: 'tag',
	        'default': '',
	        desc: 'It is possible to be any html content inside material-dropdown.'
	    }];
	    // Options
	    this.options = [{
	        title: 'animation',
	        type: 'string ["top"|"bottom"]',
	        'default': 'top',
	        desc: 'Sets animation direction.'
	    }];
	    // Styling
	    this.styling = [{
	        title: '$material-button-height',
	        type: 'px',
	        'default': '40',
	        desc: 'Setup default height of button.'
	    }];
	    this.openDropDownOne = function () {
	        var dropdown = _this.tags.desc.tags.cardOne.tags.dropDownOne;
	        !dropdown.opened ? dropdown.open() : dropdown.close();
	    };
	    this.openDropDownTwo = function () {
	        var dropdown = _this.tags.desc.tags.cardTwo.tags.dropDownOne;
	        !dropdown.opened ? dropdown.open() : dropdown.close();
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

})