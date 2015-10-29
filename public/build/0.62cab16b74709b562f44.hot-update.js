webpackHotUpdate(0,{

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(33);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(33, function() {
				var newContent = __webpack_require__(33);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "riotmui-desc > .content {\n  padding: 0 20px; }\n  riotmui-desc > .content > .title {\n    padding: 10px 0;\n    font-size: 28px;\n    color: #1c3b53; }\n  riotmui-desc > .content material-card {\n    margin-top: 20px;\n    min-height: 233px;\n    position: relative; }\n    riotmui-desc > .content material-card:first-child {\n      margin-top: 0; }\n    riotmui-desc > .content material-card .title {\n      padding: 10px 20px;\n      font-size: 18px;\n      color: #61bdcc;\n      box-shadow: none; }\n    riotmui-desc > .content material-card .material-card-content {\n      padding: 10px 0px 20px 20px; }\n  riotmui-desc > .content .riotmui-desc-description p {\n    display: block;\n    padding: 5px 5px; }\n  riotmui-desc > .content .riotmui-desc-description .description-title {\n    padding: 10px 0px;\n    font-size: 20px;\n    color: #61bdcc;\n    box-shadow: none; }\n  riotmui-desc > .content .riotmui-desc-description .option {\n    padding: 10px 0; }\n    riotmui-desc > .content .riotmui-desc-description .option-title {\n      font-weight: 700; }\n    riotmui-desc > .content .riotmui-desc-description .option .type {\n      color: #8d9899; }\n    riotmui-desc > .content .riotmui-desc-description .option .default {\n      color: #414546;\n      margin-left: 20px; }\n\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  > .content {\n    padding: 0 0px; } }\n\n@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {\n  > .content {\n    padding: 0 0px; } }\n", ""]);

	// exports


/***/ }

})