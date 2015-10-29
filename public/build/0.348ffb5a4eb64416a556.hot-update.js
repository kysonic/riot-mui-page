webpackHotUpdate(0,{

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(24, function() {
				var newContent = __webpack_require__(24);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "riotmui-list ul {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n  riotmui-list ul li {\n    width: 100%;\n    cursor: pointer;\n    transition: all 0.2s; }\n    riotmui-list ul li:hover {\n      background: #fff;\n      transition: all 0.2s; }\n    riotmui-list ul li a {\n      text-decoration: none;\n      color: #070726;\n      display: block;\n      width: 100%;\n      height: 100%;\n      padding: 15px 0px 15px 20px;\n      font-size: 20px; }\n    riotmui-list ul li.selected {\n      border-left: 2px solid #579ead; }\n      riotmui-list ul li.selected a {\n        color: #579ead; }\n", ""]);

	// exports


/***/ }

})