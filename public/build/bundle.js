/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "bbf9899b400981dd2e0b"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var riot = __webpack_require__(1);
	// Provide some settings
	riot.settings.brackets = '{{ }}';
	// Get application tag and mount it! Yeah baby!
	__webpack_require__(2);
	riot.mount('app');
	// Router
	__webpack_require__(32);
	// SASS
	__webpack_require__(227);
	__webpack_require__(229);
	__webpack_require__(231);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.2.4, @license MIT, (c) 2015 Muut Inc. + contributors */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.2.4', settings: {} },
	  //// be aware, internal usage

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,

	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,

	  // Array.isArray for IE8 is in the polyfills
	  isArray = Array.isArray

	riot.observable = function(el) {

	  el = el || {}

	  var callbacks = {},
	      _id = 0

	  el.on = function(events, fn) {
	    if (isFunction(fn)) {
	      if (typeof fn.id === T_UNDEF) fn._id = _id++

	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }

	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) arr.splice(i--, 1)
	          }
	        } else {
	          callbacks[name] = []
	        }
	      })
	    }
	    return el
	  }

	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(name, on)
	  }

	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []

	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }
	    }

	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args))
	    }

	    return el
	  }

	  return el

	}
	riot.mixin = (function() {
	  var mixins = {}

	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }

	})()

	;(function(riot, evt, win) {

	  // browsers only
	  if (!win) return

	  var loc = win.location,
	      fns = riot.observable(),
	      started = false,
	      current

	  function hash() {
	    return loc.href.split('#')[1] || ''   // why not loc.hash.splice(1) ?
	  }

	  function parser(path) {
	    return path.split('/')
	  }

	  function emit(path) {
	    if (path.type) path = hash()

	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }

	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)

	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }

	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }

	  r.parser = function(fn) {
	    parser = fn
	  }

	  r.stop = function () {
	    if (started) {
	      if (win.removeEventListener) win.removeEventListener(evt, emit, false) //@IE8 - the if()
	      else win.detachEvent('on' + evt, emit) //@IE8
	      fns.off('*')
	      started = false
	    }
	  }

	  r.start = function () {
	    if (!started) {
	      if (win.addEventListener) win.addEventListener(evt, emit, false) //@IE8 - the if()
	      else win.attachEvent('on' + evt, emit) //IE8
	      started = true
	    }
	  }

	  // autostart the router
	  r.start()

	})(riot, 'hashchange', window)
	/*

	//// How it works?


	Three ways:

	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.

	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.

	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".


	// Template examples

	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)


	// Falsy expressions in templates

	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:

	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"

	*/


	var brackets = (function(orig) {

	  var cachedBrackets,
	      r,
	      b,
	      re = /[{}]/g

	  return function(x) {

	    // make sure we use the current setting
	    var s = riot.settings.brackets || orig

	    // recreate cached vars if needed
	    if (cachedBrackets !== s) {
	      cachedBrackets = s
	      b = s.split(' ')
	      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
	    }

	    // if regexp given, rewrite it with current brackets (only if differ from default)
	    return x instanceof RegExp ? (
	        s === orig ? x :
	        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
	      ) :
	      // else, get specific bracket
	      b[x]
	  }
	})('{ }')


	var tmpl = (function() {

	  var cache = {},
	      OGLOB = '"in d?d:' + (window ? 'window).' : 'global).'),
	      reVars =
	      /(['"\/])(?:[^\\]*?|\\.|.)*?\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function\s*\()|([A-Za-z_$]\w*)/g

	  // build a template (or get it from cache), render with data
	  return function(str, data) {
	    return str && (cache[str] || (cache[str] = tmpl(str)))(data)
	  }


	  // create a template instance

	  function tmpl(s, p) {

	    if (s.indexOf(brackets(0)) < 0) {
	      // return raw text
	      s = s.replace(/\n|\r\n?/g, '\n')
	      return function () { return s }
	    }

	    // temporarily convert \{ and \} to a non-character
	    s = s
	      .replace(brackets(/\\{/g), '\uFFF0')
	      .replace(brackets(/\\}/g), '\uFFF1')

	    // split string to expression and non-expresion parts
	    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

	    // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	    s = (p.length === 2 && !p[0]) ?

	      // if expression, evaluate it
	      expr(p[1]) :

	      // if template, evaluate all expressions in it
	      '[' + p.map(function(s, i) {

	        // is it an expression or a string (every second part is an expression)
	        return i % 2 ?

	          // evaluate the expressions
	          expr(s, true) :

	          // process string parts of the template:
	          '"' + s

	            // preserve new lines
	            .replace(/\n|\r\n?/g, '\\n')

	            // escape quotes
	            .replace(/"/g, '\\"') +

	          '"'

	      }).join(',') + '].join("")'

	    return new Function('d', 'return ' + s
	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets(0))
	      .replace(/\uFFF1/g, brackets(1)) + ';')

	  }


	  // parse { ... } expression

	  function expr(s, n) {
	    s = s

	      // convert new lines to spaces
	      .replace(/\n|\r\n?/g, ' ')

	      // trim whitespace, brackets, strip comments
	      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w- "']+ *:/.test(s) ?

	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      '[' +

	          // extract key:val pairs, ignoring any nested objects
	          extract(s,

	              // name part: name:, "name":, 'name':, name :
	              /["' ]*[\w- ]+["' ]*:/,

	              // expression part: everything upto a comma followed by a name (see above) or end of line
	              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
	              ).map(function(pair) {

	                // get key, val parts
	                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

	                  // wrap all conditional parts to ignore errors
	                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

	                })

	              }).join('') +

	        '].join(" ").trim()' :

	      // if js expression, evaluate as javascript
	      wrap(s, n)

	  }


	  // execute js w/o breaking on errors or undefined vars

	  function wrap(s, nonull) {
	    s = s.trim()
	    return !s ? '' : '(function(v){try{v=' +

	      // prefix vars (name => data.name)
	      s.replace(reVars, function(s, _, v) { return v ? '(("' + v + OGLOB + v + ')' : s }) +

	      // default to empty string for falsy values except zero
	      '}catch(e){}return ' + (nonull === true ? '!v&&v!==0?"":v' : 'v') + '}).call(d)'
	  }


	  // split string by an array of substrings

	  function split(str, substrings) {
	    var parts = []
	    substrings.map(function(sub, i) {

	      // push matched expression and part before it
	      i = str.indexOf(sub)
	      parts.push(str.slice(0, i), sub)
	      str = str.slice(i + sub.length)
	    })
	    if (str) parts.push(str)

	    // push the remaining part
	    return parts
	  }


	  // match strings between opening and closing regexp, skipping any inner/nested matches

	  function extract(str, open, close) {

	    var start,
	        level = 0,
	        matches = [],
	        re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g')

	    str.replace(re, function(_, open, close, pos) {

	      // if outer inner bracket, mark position
	      if (!level && open) start = pos

	      // in(de)crease bracket level
	      level += open ? 1 : -1

	      // if outer closing bracket, grab the match
	      if (!level && close != null) matches.push(str.slice(start, pos + close.length))

	    })

	    return matches
	  }

	})()

	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and bellow

	*/
	// http://kangax.github.io/compat-table/es5/#ie8
	// http://codeplanet.io/dropping-ie8/

	var mkdom = (function (checkIE) {

	  var rootEls = {
	        'tr': 'tbody',
	        'th': 'tr',
	        'td': 'tr',
	        'tbody': 'table',
	        'col': 'colgroup'
	      },
	      GENERIC = 'div'

	  checkIE = checkIE && checkIE < 10

	  // creates any dom element in a div, table, or colgroup container
	  function _mkdom(html) {

	    var match = html && html.match(/^\s*<([-\w]+)/),
	        tagName = match && match[1].toLowerCase(),
	        rootTag = rootEls[tagName] || GENERIC,
	        el = mkEl(rootTag)

	    el.stub = true

	    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
	      ie9elem(el, html, tagName, !!match[1])
	    else
	      el.innerHTML = html

	    return el
	  }

	  // creates tr, th, td, option, optgroup element for IE8-9
	  /* istanbul ignore next */
	  function ie9elem(el, html, tagName, select) {

	    var div = mkEl(GENERIC),
	        tag = select ? 'select>' : 'table>',
	        child

	    div.innerHTML = '<' + tag + html + '</' + tag

	    child = div.getElementsByTagName(tagName)[0]
	    if (child)
	      el.appendChild(child)

	  }
	  // end ie9elem()

	  return _mkdom

	})(IE_VERSION)

	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var b0 = brackets(0),
	      els = expr.trim().slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
	  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
	}

	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}


	/* Beware: heavy stuff */
	function _each(dom, parent, expr) {

	  remAttr(dom, 'each')

	  var tagName = getTagName(dom),
	      template = dom.outerHTML,
	      hasImpl = !!tagImpl[tagName],
	      impl = tagImpl[tagName] || {
	        tmpl: template
	      },
	      root = dom.parentNode,
	      placeholder = document.createComment('riot placeholder'),
	      tags = [],
	      child = getTag(dom),
	      checksum

	  root.insertBefore(placeholder, dom)

	  expr = loopKeys(expr)

	  // clean template code
	  parent
	    .one('premount', function () {
	      if (root.stub) root = parent.root
	      // remove the original DOM node
	      dom.parentNode.removeChild(dom)
	    })
	    .on('update', function () {
	      var items = tmpl(expr.val, parent)

	      // object loop. any changes cause full redraw
	      if (!isArray(items)) {

	        checksum = items ? JSON.stringify(items) : ''

	        items = !items ? [] :
	          Object.keys(items).map(function (key) {
	            return mkitem(expr, key, items[key])
	          })
	      }

	      var frag = document.createDocumentFragment(),
	          i = tags.length,
	          j = items.length

	      // unmount leftover items
	      while (i > j) {
	        tags[--i].unmount()
	        tags.splice(i, 1)
	      }

	      for (i = 0; i < j; ++i) {
	        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]

	        if (!tags[i]) {
	          // mount new
	          (tags[i] = new Tag(impl, {
	              parent: parent,
	              isLoop: true,
	              hasImpl: hasImpl,
	              root: SPECIAL_TAGS_REGEX.test(tagName) ? root : dom.cloneNode(),
	              item: _item
	            }, dom.innerHTML)
	          ).mount()

	          frag.appendChild(tags[i].root)
	        } else
	          tags[i].update(_item)

	        tags[i]._item = _item

	      }

	      root.insertBefore(frag, placeholder)

	      if (child) parent.tags[tagName] = tags

	    }).one('updated', function() {
	      var keys = Object.keys(parent)// only set new values
	      walk(root, function(node) {
	        // only set element node and not isLoop
	        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
	          node._visited = false // reset _visited for loop node
	          node._looped = true // avoid set multiple each
	          setNamed(node, parent, keys)
	        }
	      })
	    })

	}


	function parseNamedElements(root, tag, childTags) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

	      // custom child tag
	      var child = getTag(dom)

	      if (child && !dom.isLoop) {
	        childTags.push(initChildTag(child, dom, tag))
	      }

	      if (!dom.isLoop)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (val.indexOf(brackets(0)) >= 0) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    var attr = dom.getAttribute('each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	      opts = inherit(conf.opts) || {},
	      dom = mkdom(impl.tmpl),
	      parent = conf.parent,
	      isLoop = conf.isLoop,
	      hasImpl = conf.hasImpl,
	      item = cleanUpData(conf.item),
	      expressions = [],
	      childTags = [],
	      root = conf.root,
	      fn = impl.fn,
	      tagName = root.tagName.toLowerCase(),
	      attr = {},
	      propsInSyncWithParent = []

	  if (fn && root._tag) {
	    root._tag.unmount(true)
	  }

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  this._id = __uid++

	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (brackets(/{.*}/).test(val)) attr[el.name] = val
	  })

	  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[el.name] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[name] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF)
	        self[key] = data[key]
	    }
	  }

	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !~RESERVED_WORDS_BLACKLIST.indexOf(k) && ~propsInSyncWithParent.indexOf(k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }

	  this.update = function(data) {
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && typeof item === T_OBJECT) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	  }

	  this.mixin = function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	  }

	  this.mount = function() {

	    updateOpts()

	    // initialiation
	    if (fn) fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs || hasImpl) {
	      walkAttributes(impl.attrs, function (k, v) { root.setAttribute(k, v) })
	      parseExpressions(self.root, self, expressions)
	    }

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('premount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = dom.firstChild

	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  }


	  this.unmount = function(keepRootTag) {
	    var el = root,
	        p = el.parentNode,
	        ptag

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._id == self._id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        p.removeAttribute('riot-tag')
	    }


	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null

	  }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'

	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }

	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)


	}

	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var item = tag._item,
	        ptag = tag.parent,
	        el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag.parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // ignore error on some browsers
	    try {
	      e.currentTarget = dom
	      if (!e.target) e.target = e.srcElement
	      if (!e.which) e.which = e.charCode || e.keyCode
	    } catch (ignored) { /**/ }

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}

	// used by if- attribute
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}

	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	        attrName = expr.attr,
	        value = tmpl(expr.expr, tag),
	        parent = expr.dom.parentNode

	    if (expr.bool)
	      value = value ? attrName : false
	    else if (value == null)
	      value = ''

	    // leave out riot- prefixes from strings inside textarea
	    // fix #815: any value -> string
	    if (parent && parent.tagName == 'TEXTAREA') value = ('' + value).replace(/riot-/g, '')

	    // no change
	    if (expr.value === value) return
	    expr.value = value

	    // text node
	    if (!attrName) {
	      dom.nodeValue = '' + value    // #815 related
	      return
	    }

	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	          add = function() { insertTo(stub.parentNode, stub, dom) },
	          remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        else
	        // otherwise we need to wait the updated event
	          (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'

	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value

	    // <img src="{ expr }">
	    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	      if (value)
	        dom.setAttribute(attrName.slice(RIOT_PREFIX.length), value)

	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	      }

	      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)

	    }

	  })

	}
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	function getTag(dom) {
	  return dom.tagName && tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
	}

	function initChildTag(child, dom, parent) {
	  var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
	      tagName = getTagName(dom),
	      ptag = getImmediateCustomParentTag(parent),
	      cachedTag

	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag

	  cachedTag = ptag.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      ptag.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!~ptag.tags[tagName].indexOf(tag))
	      ptag.tags[tagName].push(tag)
	  } else {
	    ptag.tags[tagName] = tag
	  }

	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  dom.innerHTML = ''

	  return tag
	}

	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = dom.getAttribute('name'),
	    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if ((obj = args[i])) {
	      for (var key in obj) {      // eslint-disable-line guard-for-in
	        src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	// with this function we avoid that the current Tag methods get overridden
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

	  var o = {}
	  for (var key in data) {
	    if (!~RESERVED_WORDS_BLACKLIST.indexOf(key))
	      o[key] = data[key]
	  }
	  return o
	}

	function walk(dom, fn) {
	  if (dom) {
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	// minimize risk: only zero or one _space_ between attr & value
	function walkAttributes(html, fn) {
	  var m,
	      re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while ((m = re.exec(html))) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	function mkEl(name) {
	  return document.createElement(name)
	}

	function replaceYield(tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gi, innerHTML || '')
	}

	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}

	function setNamed(dom, parent, keys) {
	  if (dom._visited) return
	  var p,
	      v = dom.getAttribute('id') || dom.getAttribute('name')

	  if (v) {
	    if (keys.indexOf(v) < 0) {
	      p = parent[v]
	      if (!p)
	        parent[v] = dom
	      else if (isArray(p))
	        p.push(dom)
	      else
	        parent[v] = [p, dom]
	    }
	    dom._visited = true
	  }
	}

	// faster String startsWith alternative
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/*
	 Virtual dom is an array of custom tags on the document.
	 Updates and unmounts propagate downwards from parent to children.
	*/

	var virtualDom = [],
	    tagImpl = {},
	    styleNode

	function injectStyle(css) {

	  if (riot.render) return // skip injection on the server

	  if (!styleNode) {
	    styleNode = mkEl('style')
	    styleNode.setAttribute('type', 'text/css')
	  }

	  var head = document.head || document.getElementsByTagName('head')[0]

	  if (styleNode.styleSheet)
	    styleNode.styleSheet.cssText += css
	  else
	    styleNode.innerHTML += css

	  if (!styleNode._rendered)
	    if (styleNode.styleSheet) {
	      document.body.appendChild(styleNode)
	    } else {
	      var rs = $('style[type=riot]')
	      if (rs) {
	        rs.parentNode.insertBefore(styleNode, rs)
	        rs.parentNode.removeChild(rs)
	      } else head.appendChild(styleNode)

	    }

	  styleNode._rendered = true

	}

	function mountTo(root, tagName, opts) {
	  var tag = tagImpl[tagName],
	      // cache the inner HTML to fix #855
	      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    virtualDom.push(tag)
	    return tag.on('unmount', function() {
	      virtualDom.splice(virtualDom.indexOf(tag), 1)
	    })
	  }

	}

	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else injectStyle(css)
	  }
	  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	riot.mount = function(selector, tagName, opts) {

	  var els,
	      allTags,
	      tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    var last
	    if (root.tagName) {
	      if (tagName && (!(last = root.getAttribute(RIOT_TAG)) || last != tagName))
	        root.setAttribute(RIOT_TAG, tagName)

	      var tag = mountTo(root,
	        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    }
	    else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))

	    els = $$(selector)
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)

	  return tags
	}

	// update everything
	riot.update = function() {
	  return each(virtualDom, function(tag) {
	    tag.update()
	  })
	}

	// @deprecated
	riot.mountTo = riot.mount

	  // share methods for other riot parts, e.g. compiler
	  riot.util = { brackets: brackets, tmpl: tmpl }

	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return (window.riot = riot) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(3);
	__webpack_require__(28);
	riot.tag('app', '<basic-layout if="{{isHome}}"></basic-layout> <home-layout if="{{!isHome}}"></home-layout>', function (opts) {
	    var _this = this;

	    this.isHome = !!window.location.hash.replace('#', '');
	    riot.route(function (collection, id, action) {
	        _this.update({ isHome: !!collection });
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(4);
	__webpack_require__(8);
	__webpack_require__(11);
	__webpack_require__(15);
	__webpack_require__(23);
	__webpack_require__(26);
	__webpack_require__(27);
	riot.tag('basic-layout', '<material-navbar> <div class="row"> <div class="col col-lg-3 col-md-6 col-sm-11 col-xs-11"> <div class="logo"> <i class="material-icons menu" onclick="{{parent.toggleMenu}}">menu</i> <a href="#" title="Material UI">{{parent.logoText}}</a> <a href="https://muut.com/riotjs/" riot> <div class="for-riot"></div> </a> </div> </div> <div class="col col-lg-9 col-md-6 col-sm-1 col-xs-1 gitcol"> <a class="github" href="https://github.com/kysonic/riot-mui"> <github></github> </a> </div> </div> </material-navbar> <div class="row content"> <div name="menu" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col left"> <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list> </div> <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 col right"> <route></route> </div> </div> <div class="overlay" onclick="{{close}}" name="overlay" if="{{opened}}"></div>', function (opts) {
	    var _this = this;

	    this.opened = false;
	    this.logoText = 'material UI';
	    this.links = [{ link: '#buttons', title: 'Button' }, { link: '#checkbox', title: 'CheckBox' }, { link: '#combobox', title: 'ComboBox' }, { link: '#dropdown', title: 'DropDown' }, { link: '#dropdown-list', title: 'DropDownList' }, { link: '#m-input', title: 'Input' }, { link: '#navbar', title: 'Navbar' }, { link: '#pane', title: 'Pane' }, { link: '#popup', title: 'Popup' }, { link: '#snackbar', title: 'Snackbar' }, { link: '#tabs', title: 'Tabs' }, { link: '#m-textarea', title: 'Textarea' }];
	    this.route = window.location.hash.replace('#', '') || 'Home';
	    this.tags.riotmuiList.update({ selected: window.location.hash });
	    riot.route(function (collection, id, action) {
	        _this.update({ route: collection || 'Home' });
	        _this.tags.riotmuiList.update({ selected: '#' + collection });
	    });
	    //
	    this.tags.riotmuiList.on('onClick', function () {
	        _this.close();
	    });
	    this.mq = window.matchMedia('only screen and (min-width : 320px) and (max-width : 480px)');
	    this.mq.addListener(function () {
	        _this.checkOutMatches();
	    });
	    this.checkOutMatches = function () {
	        if (_this.mq.matches) {
	            _this.update({ logoText: 'mUI' });
	        } else {
	            _this.update({ logoText: 'material UI' });
	        }
	    };
	    this.checkOutMatches();
	    /**
	     * Go Back
	     */
	    this.back = function () {
	        window.location.hash = "/#";
	    };
	    this.toggleMenu = function () {
	        !_this.opened ? _this.open() : _this.close();
	    };
	    this.open = function () {
	        _this.update({ opened: true });
	        _this.menu.style.left = '0px';
	    };
	    this.close = function () {
	        _this.update({ opened: false });
	        _this.menu.style.left = '-100%';
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(5, function() {
				var newContent = __webpack_require__(5);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".stop-scrolling {\n  height: 100%;\n  overflow: hidden; }\n\nbasic-layout {\n  display: block;\n  height: 100%;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans'; }\n  basic-layout .overlay {\n    width: 100%;\n    height: 100%;\n    position: fixed;\n    top: 0;\n    left: 0;\n    background: rgba(255, 255, 255, 0.6); }\n  basic-layout p {\n    margin: 0; }\n  basic-layout .row {\n    height: 100%;\n    margin: 0;\n    padding: 0; }\n    basic-layout .row .col {\n      margin: 0;\n      padding: 0; }\n  basic-layout material-navbar .row .col {\n    display: flex;\n    flex-direction: row;\n    align-items: center; }\n  basic-layout material-navbar .gitcol {\n    flex-direction: column !important;\n    align-items: flex-end !important; }\n    basic-layout material-navbar .gitcol .github {\n      margin-right: 10px;\n      margin-top: 12px; }\n  basic-layout material-navbar .logo {\n    display: block;\n    margin-left: 20px;\n    font-size: 33px;\n    font-weight: 100; }\n    basic-layout material-navbar .logo .menu {\n      display: none; }\n    basic-layout material-navbar .logo a {\n      display: inline-block;\n      text-decoration: none; }\n    basic-layout material-navbar .logo .for-riot {\n      display: inline-block;\n      vertical-align: middle;\n      margin-left: 5px;\n      background: url(\"/riot-mui/images/for_riot.png\") no-repeat center;\n      width: 92px;\n      height: 37px;\n      position: relative;\n      bottom: 2px; }\n  basic-layout > .content .left {\n    display: flex;\n    align-items: stretch;\n    flex-grow: 1;\n    flex-direction: row;\n    min-height: 100%;\n    z-index: 99; }\n  basic-layout > .content riotmui-list {\n    display: block;\n    width: 100%;\n    background: #f5f5f5;\n    min-height: calc(100vh - 70px); }\n  basic-layout > .content route {\n    width: 100%;\n    height: 100%;\n    background: #fff; }\n    basic-layout > .content route riotmui-desc {\n      display: block; }\n\n@media (min-width: 768px) and (max-width: 1024px) {\n  basic-layout material-navbar .logo {\n    margin-left: 5px; }\n    basic-layout material-navbar .logo .menu {\n      display: inline-block;\n      font-size: 40px;\n      position: relative;\n      top: 7px;\n      cursor: pointer; }\n  basic-layout > .content .left {\n    position: fixed;\n    top: 0;\n    left: -100%;\n    transition: left 0.2s;\n    min-width: 320px; } }\n\n@media (min-width: 320px) and (max-width: 480px) {\n  basic-layout material-navbar .logo {\n    margin-left: 5px; }\n    basic-layout material-navbar .logo .menu {\n      display: inline-block;\n      font-size: 40px;\n      position: relative;\n      top: 7px;\n      cursor: pointer; }\n  basic-layout > .content .left {\n    position: fixed;\n    top: 0;\n    left: -100%;\n    min-width: 100%;\n    transition: left 0.2s; } }\n\n@media (min-width: 480px) and (max-width: 768px) {\n  basic-layout material-navbar .logo {\n    margin-left: 5px; }\n    basic-layout material-navbar .logo .menu {\n      display: inline-block;\n      font-size: 40px;\n      position: relative;\n      top: 10px;\n      cursor: pointer; }\n  basic-layout > .content .left {\n    position: fixed;\n    top: 0;\n    left: -100%;\n    transition: left 0.2s;\n    min-width: 320px; } }\n", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);
	riot.tag('material-navbar', '<div class="nav-wrapper"> <yield></yield> </div>', 'role="toolbar"', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(10, function() {
				var newContent = __webpack_require__(10);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-navbar {\n  display: block;\n  color: #fff;\n  -webkit-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -ms-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -moz-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -o-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  background-color: #25313b;\n  width: 100%;\n  height: 70px;\n  line-height: 70px; }\n  material-navbar:not(material-input) {\n    line-height: 0px; }\n  material-navbar a {\n    color: #fff; }\n  material-navbar .nav-wrapper {\n    position: relative;\n    height: 100%; }\n    material-navbar .nav-wrapper .logo {\n      line-height: 66px; }\n  material-navbar[fixed] {\n    position: relative;\n    height: 70px;\n    z-index: 998; }\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(12);
	__webpack_require__(14);
	riot.tag('material-pane', '<material-navbar riot-style="height:{{opts[\'material-navbar-height\'] || \'60px\'}};line-height: {{opts[\'material-navbar-height\'] || \'60px\'}};background-color:{{opts[\'material-navbar-color\'] || \'#ccc\'}}"> <content select=".material-pane-left-bar"></content> <content select=".material-pane-title"></content> <content select=".material-pane-right-bar"></content> </material-navbar> <div class="content"> <content select=".material-pane-content"></content> <yield></yield> </div>', function (opts) {
	  this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(13, function() {
				var newContent = __webpack_require__(13);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-pane {\n  display: block; }\n  material-pane material-navbar .nav-wrapper {\n    display: flex;\n    justify-content: space-between;\n    flex-grow: 1;\n    /** USE MaTRIAL-BUTTON INTO PANE**/ }\n    material-pane material-navbar .nav-wrapper .material-pane-title {\n      font-size: 26px;\n      text-transform: uppercase;\n      text-align: center; }\n    material-pane material-navbar .nav-wrapper material-button {\n      background: transparent; }\n  material-pane .content .material-pane-content {\n    padding: 10px;\n    background: #f2f2f2; }\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var Content = {
	    init: function init() {
	        var _this = this;

	        this.on('mount', function () {
	            [].forEach.call(_this.root.querySelectorAll('content'), function (node) {
	                var selector = node.getAttribute('select');
	                [].forEach.call(_this.root.querySelectorAll(selector), function (content) {
	                    node.parentNode.insertBefore(content, node.nextSibling);
	                });
	                node.parentNode.removeChild(node);
	            });
	        });
	    }
	};
	riot.mixin('content', Content);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(16);
	__webpack_require__(18);
	__webpack_require__(19);
	riot.tag('material-button', '<material-waves onclick="{{click}}" onmousedown="{{launch}}" center="{{opts[\'waves-center\']}}" rounded="{{opts[\'rounded\']}}" opacity="{{opts[\'waves-opacity\']}}" color="{{opts[\'waves-color\']}}" duration="{{opts[\'waves-duration\']}}"></material-waves> <div class="content"><yield></yield></div>', function (opts) {
	    var _this = this;

	    // Dynamic attribute for using special styles.
	    this.dynamicAttributes = ['disabled'];
	    // Attributes
	    this.disabled = opts.disabled || false;
	    // Launch waves
	    this.launch = function (e) {
	        if (!_this.disabled) _this.tags['material-waves'].trigger('launch', e);
	    };
	    // Trigger the click
	    this.click = function () {
	        if (opts.link) window.location.href = opts.link;
	        _this.trigger('click');
	    };
	    // Add mixin
	    this.mixin('dynamicAttributes');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(17, function() {
				var newContent = __webpack_require__(17);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-button {\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  position: relative;\n  height: 40px;\n  line-height: 36px;\n  background: #61bdcc;\n  color: #fff;\n  padding: 0 2rem;\n  cursor: pointer;\n  text-transform: uppercase;\n  vertical-align: middle;\n  outline: 0;\n  -webkit-tap-highlight-color: transparent;\n  /** CONTENT **/\n  /** Rounded **/\n  /** Shady **/\n  /**Disabled **/ }\n  material-button:hover material-waves {\n    background: rgba(255, 255, 255, 0.2);\n    -webkit-transition: background .2s ease-in;\n    -ms-transition: background .2s ease-in;\n    -moz-transition: background .2s ease-in;\n    -o-transition: background .2s ease-in;\n    transition: background .2s ease-in; }\n  material-button material-waves {\n    background: rgba(255, 255, 255, 0);\n    -webkit-transition: background .2s ease-in;\n    -ms-transition: background .2s ease-in;\n    -moz-transition: background .2s ease-in;\n    -o-transition: background .2s ease-in;\n    transition: background .2s ease-in; }\n  material-button .content {\n    width: 101%;\n    height: 100%;\n    display: block;\n    text-align: center; }\n    material-button .content .text, material-button .content i.material-icons, material-button .content i.icon, material-button .content a {\n      display: inline-block;\n      vertical-align: middle;\n      font-size: 18px;\n      color: #fff;\n      line-height: 40px; }\n      material-button .content .text.material-icons, material-button .content i.material-icons.material-icons, material-button .content i.icon.material-icons, material-button .content a.material-icons {\n        font-size: 20px; }\n      material-button .content .text svg, material-button .content i.material-icons svg, material-button .content i.icon svg, material-button .content a svg {\n        fill: #fff;\n        stroke: #fff; }\n  material-button[rounded=\"true\"] {\n    border-radius: 50%;\n    width: 40px;\n    padding: 0; }\n    material-button[rounded=\"true\"] .content {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      align-items: center;\n      text-align: center; }\n      material-button[rounded=\"true\"] .content i.material-icons, material-button[rounded=\"true\"] .content i.icon {\n        display: inline-block;\n        text-align: center;\n        width: 100%;\n        height: 100%;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        -moz-user-select: none;\n        -o-user-select: none;\n        user-select: none; }\n  material-button[shady=\"true\"] {\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 0.2s; }\n    material-button[shady=\"true\"]:hover {\n      -webkit-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -ms-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -moz-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -o-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      transition: box-shadow 0.2s; }\n  material-button[disabled=\"true\"] {\n    background: #ccc;\n    color: #999999;\n    cursor: default; }\n    material-button[disabled=\"true\"] #content .text, material-button[disabled=\"true\"] #content i.material-icons, material-button[disabled=\"true\"] #content i.icon, material-button[disabled=\"true\"] #content a {\n      color: #999999; }\n      material-button[disabled=\"true\"] #content .text svg, material-button[disabled=\"true\"] #content i.material-icons svg, material-button[disabled=\"true\"] #content i.icon svg, material-button[disabled=\"true\"] #content a svg {\n        fill: #999999;\n        stroke: #999999; }\n    material-button[disabled=\"true\"]:hover material-waves {\n      background: transparent; }\n", ""]);

	// exports


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {/**
	 * The mixin ables to update root tag attributes
	 * if in this.dynamicAttributes array contains
	 * name of attribute, which equals variable into tag instance
	 * Example:
	 * <my-tag disabled="true"></my-tag>
	 * <my-tag>
	 *     ....
	 *     <script>
	 *         this.disabled = true;
	 *         this.dynamicAttributes = ['disabled'];
	 *         setTimeout(function(){
	 *              this.update({disabled:false});
	 *         }.bind(this),1000);
	 *     </script>
	 * </my-tag>
	 * In this example disabled attribute of my-tag
	 * will be changed after 1s and we will see following HTML
	 * <my-tag disabled="false"></my-tag>
	 */
	'use strict';

	var DynamicAttributesMixin = {
	    init: function init() {
	        var _this = this;

	        this.on('update', function (updated) {
	            if (updated && _this.dynamicAttributes) {
	                _this.dynamicAttributes.forEach(function (key) {
	                    if (updated[key] != undefined) {
	                        _this.root.setAttribute(key, updated[key]);
	                    }
	                });
	            }
	        });
	    }
	};

	riot.mixin('dynamicAttributes', DynamicAttributesMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(20);
	__webpack_require__(22);
	riot.tag('material-waves', '<div id="waves" name="waves"></div>', function (opts) {
	    var _this3 = this;

	    var _createClass = (function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	        };
	    })();

	    var _get = function get(_x, _x2, _x3) {
	        var _again = true;_function: while (_again) {
	            var object = _x,
	                property = _x2,
	                receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	                var parent = Object.getPrototypeOf(object);if (parent === null) {
	                    return undefined;
	                } else {
	                    _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
	                }
	            } else if ('value' in desc) {
	                return desc.value;
	            } else {
	                var getter = desc.get;if (getter === undefined) {
	                    return undefined;
	                }return getter.call(receiver);
	            }
	        }
	    };

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError('Cannot call a class as a function');
	        }
	    }

	    function _inherits(subClass, superClass) {
	        if (typeof superClass !== 'function' && superClass !== null) {
	            throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	        }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	    }

	    // Get Bound Class from riot mixin source
	    var Bound = riot.mixin('Bound');
	    /**
	     * Wave class. Contain wave node and
	     * all of waves logic.
	     */

	    var Wave = (function (_Bound) {
	        _inherits(Wave, _Bound);

	        function Wave(container, opts, e) {
	            _classCallCheck(this, Wave);

	            _get(Object.getPrototypeOf(Wave.prototype), 'constructor', this).call(this);
	            // Initialize
	            if (!container) console.error('You should to set container to the wave!');
	            this.container = container;
	            // Throw the components options
	            this.maxOpacity = opts.opacity || 0.6;
	            this.duration = opts.duration || 750;
	            this.color = opts.color || '#fff';
	            this.center = opts.center || false;
	            // And event
	            this.event = e;
	            // Find related parameters
	            this.containerBound = this.receiveBound();
	            this.maxScale = this.containerBound.size / 100 * 10;
	            this.created = Date.now();
	            // Start point (center\mouse)
	            this.start = {};
	            // Startup
	            this.createNode();
	            this.waveIn();
	        }

	        // Basics

	        /**
	         * Create node for wave
	         */

	        _createClass(Wave, [{
	            key: 'createNode',
	            value: function createNode() {
	                this.wave = document.createElement('div');
	                this.wave.classList.add('wave');
	                this.container.appendChild(this.wave);
	            }

	            /**
	             * Starting the wave ripple.
	             */
	        }, {
	            key: 'waveIn',
	            value: function waveIn() {
	                var _this = this;

	                if (this.center && !this.event) console.error('Setup at least mouse event... Or just set center attribute');
	                // Starting point
	                this.start.x = this.center ? this.containerBound.height / 2 : this.event.pageY - this.containerBound.offsetTop;
	                this.start.y = this.center ? this.containerBound.width / 2 : this.event.pageX - this.containerBound.offsetLeft;
	                // Set styles at next tick. Add a little delay to lovely retarded IE :D
	                var isIE = window.navigator.userAgent.indexOf('Trident') !== -1;
	                setTimeout(function () {
	                    return _this.setStyles(_this.maxOpacity);
	                }, isIE ? 50 : 0);
	            }

	            /**
	             * Fade out wave ripple. Just disappear...
	             */
	        }, {
	            key: 'waveOut',
	            value: function waveOut() {
	                var _this2 = this;

	                var delta = Date.now() - this.created;
	                var deltaX = Math.round(this.duration / 2) - delta;
	                var delay = deltaX > 0 ? deltaX : 0;
	                setTimeout(function () {
	                    _this2.setStyles(0);
	                    setTimeout(function () {
	                        if (_this2.wave.parentNode === _this2.container) {
	                            _this2.container.removeChild(_this2.wave);
	                        }
	                    }, _this2.duration);
	                }, delay);
	            }

	            /**
	             * Set styles to in\out
	             * @param opacity - variable
	             */
	        }, {
	            key: 'setStyles',
	            value: function setStyles(opacity) {
	                this.wave.setAttribute('style', this.convertStyle({
	                    'top': this.start.x + 'px',
	                    'left': this.start.y + 'px',
	                    'transform': 'scale(' + this.maxScale + ')',
	                    'transition-duration': this.duration + 'ms',
	                    'transition-timing-function': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
	                    'background': this.color,
	                    'opacity': opacity
	                }));
	            }

	            /**
	             * Convert object into style string.
	             * @param o - object with styles
	             * @returns {string}
	             */
	        }, {
	            key: 'convertStyle',
	            value: function convertStyle(o) {
	                var style = '';
	                Object.keys(o).forEach(function (key) {
	                    if (o.hasOwnProperty(key)) {
	                        style += key + ':' + o[key] + ';';
	                    }
	                });
	                return style;
	            }
	        }]);

	        return Wave;
	    })(Bound);

	    this._waves = [];
	    this._events = [];
	    // Launch the ripple
	    this.on('launch', function (e) {
	        _this3._waves.push(new Wave(_this3.waves, opts, e));
	        if (!_this3._events.length) {
	            _this3._events.push(e.target.addEventListener('mouseup', function () {
	                return _this3.trigger('hold');
	            }));
	            _this3._events.push(e.target.addEventListener('mouseleave', function () {
	                return _this3.trigger('hold');
	            }));
	        }
	    });
	    // Hold the ripple. After it will be removed.
	    this.on('hold', function () {
	        // The last of waves
	        if (_this3._waves[_this3._waves.length - 1]) _this3._waves[_this3._waves.length - 1].waveOut();
	        if (_this3._waves[_this3._waves.length - 1]) _this3._waves.slice(_this3._waves.length - 1, 1);
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(21);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(21, function() {
				var newContent = __webpack_require__(21);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-waves {\n  display: block;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  overflow: hidden; }\n  material-waves #waves {\n    display: block;\n    width: 100%;\n    height: 100%;\n    position: relative;\n    overflow: hidden;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    -moz-user-select: none;\n    -o-user-select: none;\n    user-select: none;\n    vertical-align: middle;\n    -webkit-transform: rotate(0.0deg);\n    z-index: 1; }\n    material-waves #waves .wave {\n      position: absolute;\n      -webkit-border-radius: 50%;\n      -ms-border-radius: 50%;\n      -moz-border-radius: 50%;\n      -o-border-radius: 50%;\n      border-radius: 50%;\n      width: 20px;\n      height: 20px;\n      margin-top: -10px;\n      margin-left: -10px;\n      z-index: 0;\n      opacity: 0;\n      -webkit-transform: scale(0);\n      -ms-transform: scale(0);\n      -moz-transform: scale(0);\n      -o-transform: scale(0);\n      transform: scale(0);\n      -webkit-transition-property: transform,opacity;\n      -ms-transition-property: transform,opacity;\n      -moz-transition-property: transform,opacity;\n      -o-transition-property: transform,opacity;\n      transition-property: transform,opacity;\n      pointer-events: none; }\n  material-waves[rounded=\"true\"] {\n    border-radius: 50%; }\n    material-waves[rounded=\"true\"] #waves {\n      border-radius: 50%; }\n", ""]);

	// exports


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {/**
	 * Bound class contain methods for
	 * receiving bounds of DOM element.
	 */
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Bound = (function () {
	    function Bound() {
	        _classCallCheck(this, Bound);
	    }

	    _createClass(Bound, [{
	        key: 'receiveBound',

	        /**
	         * Get Bounds
	         * @returns {*}
	         */
	        value: function receiveBound() {
	            if (!this.container) console.error('Yor class must contain a container. It is DOM Element. Define please this.container property.');
	            var document,
	                window,
	                box,
	                doc = this.container && this.container.ownerDocument;
	            // Get document
	            document = doc.documentElement;
	            // Get container
	            if (typeof this.container.getBoundingClientRect !== typeof undefined) {
	                box = this.container.getBoundingClientRect();
	            }
	            window = this.getWindow(doc);
	            // Return BoundingRect with additional properties.
	            return this.mix(box, {
	                size: Math.max(box.width, box.height),
	                offsetTop: box.top + window.pageYOffset - document.clientTop,
	                offsetLeft: box.left + window.pageXOffset - document.clientLeft
	            });
	        }

	        /**
	         * Window or not?
	         * @param o - supposing object
	         * @returns {boolean}
	         */
	    }, {
	        key: 'isWindow',
	        value: function isWindow(o) {
	            return o !== null && o === o.window;
	        }

	        /**
	         * Get window method
	         * @param e - supposing object
	         * @returns {*}
	         */
	    }, {
	        key: 'getWindow',
	        value: function getWindow(o) {
	            return this.isWindow(o) ? o : o.nodeType === 9 && o.defaultView;
	        }

	        /**
	         * Simple mixin. Unfortunately, babel don't support Object.assign \ or mixin
	         * @param so
	         * @param to
	         * @returns {*}
	         */
	    }, {
	        key: 'mix',
	        value: function mix(so, to) {
	            for (var key in so) {
	                // only copy if not already present
	                if (!(key in to)) {
	                    to[key] = so[key];
	                }
	            }
	            return to;
	        }
	    }]);

	    return Bound;
	})();

	riot.mixin('Bound', Bound);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(24);
	riot.tag('riotmui-list', '<ul> <li each="{{item,key in items}}" class="{{selected:parent.selected==item.link}}"> <a if="{{item.link}}" onclick="{{onClick}}" href="{{item.link}}" onclick="{{parent.select}}" title="{{item.title}}">{{item.title}}</a> </li> </ul>', 'role="toolbar"', function (opts) {
	    var _this = this;

	    this.items = opts.links || [];
	    this.onClick = function (e) {
	        _this.trigger('onClick');
	        window.location.href = e.target.getAttribute('href');
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(25, function() {
				var newContent = __webpack_require__(25);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "riotmui-list ul {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n  riotmui-list ul li {\n    cursor: pointer;\n    transition: background 0.2s; }\n    riotmui-list ul li:hover {\n      background: #fff;\n      transition: all 0.2s; }\n    riotmui-list ul li a {\n      text-decoration: none;\n      color: #070726;\n      display: block;\n      height: 100%;\n      padding: 15px 0px 15px 20px;\n      font-size: 20px; }\n    riotmui-list ul li.selected {\n      border-left: 4px solid #579ead; }\n      riotmui-list ul li.selected a {\n        color: #579ead; }\n", ""]);

	// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag('github', '<svg version="1.1" id="����_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="41.666px" height="41.667px" viewBox="0 0 41.666 41.667" enable-background="new 0 0 41.666 41.667" xml:space="preserve"> <path id="GitHub_1_" fill="#FFFFFF" d="M20.832,0.833c-11.323,0-20.505,9.182-20.505,20.508c0,9.061,5.874,16.744,14.023,19.459 c1.025,0.188,1.399-0.447,1.399-0.992c0-0.485-0.019-1.775-0.026-3.485c-5.706,1.239-6.909-2.749-6.909-2.749 c-0.933-2.369-2.276-3-2.276-3c-1.863-1.27,0.14-1.246,0.14-1.246c2.058,0.146,3.141,2.113,3.141,2.113 c1.829,3.133,4.799,2.229,5.968,1.704c0.186-1.325,0.716-2.229,1.303-2.74c-4.554-0.518-9.341-2.276-9.341-10.136 c0-2.24,0.799-4.068,2.111-5.502c-0.211-0.518-0.915-2.605,0.201-5.427c0,0,1.722-0.551,5.638,2.103 c1.636-0.456,3.391-0.684,5.135-0.691c1.741,0.008,3.495,0.235,5.133,0.691c3.914-2.653,5.635-2.103,5.635-2.103 c1.117,2.821,0.414,4.91,0.203,5.427c1.314,1.434,2.107,3.262,2.107,5.502c0,7.877-4.793,9.61-9.363,10.118 c0.738,0.637,1.393,1.887,1.393,3.799c0,2.742-0.025,4.952-0.025,5.623c0,0.551,0.369,1.189,1.41,0.988 C35.47,38.08,41.339,30.4,41.339,21.341C41.337,10.016,32.155,0.833,20.832,0.833L20.832,0.833z"></path> </svg>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	!function(t,e){if(true)module.exports=e(__webpack_require__(1));else if("function"==typeof define&&define.amd)define(["riot"],e);else{var r=e("object"==typeof exports?require("riot"):t.riot);for(var o in r)("object"==typeof exports?exports:t)[o]=r[o]}}(this,function(t){return function(t){function e(o){if(r[o])return r[o].exports;var n=r[o]={exports:{},id:o,loaded:!1};return t[o].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var s,u=t[Symbol.iterator]();!(o=(s=u.next()).done)&&(r.push(s.value),!e||r.length!==e);o=!0);}catch(a){n=!0,i=a}finally{try{!o&&u["return"]&&u["return"]()}finally{if(n)throw i}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),s=r(1),u=r(2),a=console&&console.error||function(){},c=function(){function t(){n(this,t),s.router=this,s.observable(this),this.interceptors=[this.processRoute.bind(this)],this.handler=new l,this.current=new p("").response,this.process=this.process.bind(this)}return t.prototype.route=function(t){this.handler=t},t.prototype.routes=function(t){this.route((new l).routes(t))},t.prototype.use=function(t){this.interceptors.push(t)},t.prototype.process=function(){var t=Array.prototype.slice.call(arguments),e=t.join("/");"/"!==e[0]&&(e="/"+e);var r=new p(e);return this.rootContext||(this.rootContext=r),this.processRequest(r),r},t.prototype.processRequest=function(t){return this.processInterceptors(t),this.processResponse(t)},t.prototype.processResponse=function(t){if(this.isRedirect(t))return this.processRedirect(t);var e=(t.request,t.response);return e.redirectTo?void 0:(this.current=e,this.rootContext=null,this.trigger("route:updated",e),t)},t.prototype.isRedirect=function(t){return!!t.response.redirectTo},t.prototype.processRedirect=function(t){var e=t.response.redirectTo;this.rootContext.addRedirect(e),this.navigateTo(e)},t.prototype.navigateTo=function(t){s.route(t)},t.prototype.processInterceptors=function(t,e,r){var o=(e||[]).concat(this.interceptors).concat(r||[]),n=function i(){if(!t.stop){var e=o.shift(),r=t.request,n=t.response;if(e)return e(r,n,i,t)}return t};return n()},t.prototype.processRoute=function(t,e,r,o){return this.handler.process(t,e,o),r()},t.prototype.start=function(){s.route(this.process),s.route.start(),this.exec()},t.prototype.exec=function(){s.route.exec(this.process)},t}(),p=function(){function t(e){n(this,t),this.request="string"==typeof e?new v(e):e,this.response=new b(this.request),this.redirectStack=[]}return t.prototype.addRedirect=function(t){if(this.redirectStack.indexOf(t)>-1)throw new Error("Cyclic redirection to "+t+". Stack = "+this.redirectStack);this.redirectStack.push(t)},t}(),h=function(){function t(){n(this,t)}return t.prototype.matches=function(t){return!1},t.prototype.process=function(t,e){var r=this.matches(t);return r?this.routeMatch(t,e,r):this.routeMiss(t,e)},t.prototype.routeMatch=function(t,e,r){return e.add(r),!0},t.prototype.routeMiss=function(t,e){return!1},t.prototype.processRoutes=function(t,e,r){if(r&&r.length){for(var o=r.length,n=0;o>n;n++){var i=r[n];if(i.process(t,e))return!0}return!1}},t.prototype.createRequest=function(t,e){return new d(t,e)},t}(),f=function(t){function e(r){n(this,e),t.call(this,r),r=r||{},this.tag=r.tag,this.api=r.api,this.path=r.path,this.name=r.name,this.updatable=r.updatable,this.pathParameterNames=[];var o=this.getPath().replace(/^\//,"");this.pattern="^/?"+o.replace(/:([^\/]+)/g,function(t,e){return this.pathParameterNames.push(e),"([^/]+)"}.bind(this))+"(:?/|$)",this.regex=new RegExp(this.pattern)}return o(e,t),e.prototype.routes=function(t){var e=t.filter(function(t){return t instanceof g}),r=t.filter(function(t){return t instanceof m}),o=t.filter(function(t){return t instanceof y}),n=t.filter(function(t){return-1===e.indexOf(t)&&-1===r.indexOf(t)&&-1===o.indexOf(t)});return o.length>1&&a("Can't use more than one NotFoundRoute per route. --> "+this.getPath()),r.length>1&&a("Can't use more than one DefaultRoute per route. --> "+this.getPath()),this._routes=[].concat(e).concat(n).concat(r).concat(o),this},e.prototype.matches=function(t){var e=this.regex.exec(t.uri);if(e){var r={};for(var o in this.pathParameterNames){var n=this.pathParameterNames[o];r[n]=decodeURIComponent(e[parseInt(o,10)+1])}return{route:this,tag:this.tag,api:this.api,found:e[0],params:r}}return!1},e.prototype.routeMatch=function(e,r,o){var n=t.prototype.routeMatch.call(this,e,r,o);return this.processRoutes(e,r,o),n},e.prototype.processRoutes=function(e,r,o){return t.prototype.processRoutes.call(this,this.createRequest(e,o),r,this._routes)},e.prototype.getPath=function(){return this.name||this.path||("string"==typeof this.tag?this.tag:"")},e}(h),l=function(t){function e(){n(this,e),t.apply(this,arguments)}return o(e,t),e}(f),d=function R(t,e){n(this,R),this.request=t,this.matcher=e,this.uri=this.request.uri.substring(e.found.length),this.parentUri=this.request.uri.substring(0,e.found.length)},y=function(t){function e(r){n(this,e),t.call(this,r),r=r||{},this.tag=r.tag,this.api=r.api}return o(e,t),e.prototype.matches=function(t){return{route:this,tag:this.tag,api:this.api,found:t.uri}},e}(h),g=function(t){function e(r){n(this,e),t.call(this,r),r=r||{},this.from=r.from,this.to=r.to,this.pattern="(^/?)"+this.from+"(/|$)",this.regex=new RegExp(this.pattern)}return o(e,t),e.prototype.process=function(t,e){var r=t.uri.replace(this.regex,"$1"+this.to+"$2");if(r!==t.uri){var o=t.parentUri||"";return e.redirectTo=o+r,!0}},e}(h),m=function(t){function e(r){n(this,e),t.call(this,r),r=r||{},this.tag=r.tag,this.api=r.api}return o(e,t),e.prototype.matches=function(t){var e=t.uri.trim();return"/"===e||""===e?{route:this,tag:this.tag,api:this.api,found:e}:void 0},e}(h),v=function w(t){n(this,w),this.uri=t},b=function(){function t(e){n(this,t),this.uri=e.uri,this.matches=[],this.params={}}return t.prototype.add=function(t){this.matches.push(t);var e=t.params;if(e)for(var r in e)e.hasOwnProperty(r)&&(this.params[r]=e[r])},t.prototype.get=function(t){return this.matches[t]},t.prototype.size=function(){return this.matches.length},t.prototype.isEmpty=function(){return this.matches.length},t}();s.tag("route","<router-content></router-content>",function(t){this.calculateLevel=function(t){var e=0;return t.parent&&(e+=this.calculateLevel(t.parent)),t.opts.__router_level&&(e+=t.opts.__router_level),t.__router_tag&&(e+=1),e}.bind(this),this.normalizeTag=function(t,e,r){var o=t(e,r);return"string"==typeof o?t=o:(t=o.tag||t,e=o.api||e),[t,e,r]},this.unmountTag=function(){this.instance&&this.instance.unmount(!0)},this.mountTag=function(t,e,r){if("function"==typeof t){var o=this.normalizeTag(t,e,r),n=i(o,3);t=n[0],e=n[1],r=n[2]}this.canUpdate(t,e,r)?this.instance.update(e):(this.unmountTag(),t&&(this.root.replaceChild(document.createElement(t),this.root.children[0]),this.instance=s.mount(this.root.children[0],t,e)[0],this.instanceTag=t))},this.canUpdate=function(e,r,o){return(s.router.config.updatable||t.updatable||o.updatable)&&this.instance&&this.instance.isMounted&&this.instanceTag===e?!0:!1},this.updateRoute=function(){var t={tag:null};if(s.router&&s.router.current){var e=s.router.current;if(this.level<=e.size()){var r=e.get(this.level);if(r){var o=r.params||{},n=u(!0,{},r.api,o,{__router_level:this.level});t={tag:r.tag,api:n,updatable:r.route.updatable}}}}this.mountTag(t.tag,t.api,t)}.bind(this),this.__router_tag="route",this.level=this.calculateLevel(this),s.router.on("route:updated",this.updateRoute),this.on("unmount",function(){s.router.off("route:updated",this.updateRoute),this.unmountTag()}.bind(this))});var x=new c;x.Route=f,x.DefaultRoute=m,x.RedirectRoute=g,x.NotFoundRoute=y,x._={Response:b,Request:v},x.config={updatable:!1},s.router=x,t.exports=x},function(e,r){e.exports=t},function(t,e){"use strict";var r=Object.prototype.hasOwnProperty,o=Object.prototype.toString,n=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===o.call(t)},i=function(t){if(!t||"[object Object]"!==o.call(t))return!1;var e=r.call(t,"constructor"),n=t.constructor&&t.constructor.prototype&&r.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!n)return!1;var i;for(i in t);return"undefined"==typeof i||r.call(t,i)};t.exports=function s(){var t,e,r,o,u,a,c=arguments[0],p=1,h=arguments.length,f=!1;for("boolean"==typeof c?(f=c,c=arguments[1]||{},p=2):("object"!=typeof c&&"function"!=typeof c||null==c)&&(c={});h>p;++p)if(t=arguments[p],null!=t)for(e in t)r=c[e],o=t[e],c!==o&&(f&&o&&(i(o)||(u=n(o)))?(u?(u=!1,a=r&&n(r)?r:[]):a=r&&i(r)?r:{},c[e]=s(f,a,o)):"undefined"!=typeof o&&(c[e]=o));return c}}])});
	//# sourceMappingURL=router.min.js.map

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(29);
	__webpack_require__(8);
	__webpack_require__(11);
	__webpack_require__(15);
	__webpack_require__(23);
	__webpack_require__(26);
	__webpack_require__(31);
	__webpack_require__(27);
	riot.tag('home-layout', '<material-navbar> <div class="row icon-row"> <div class="col col-lg-12 col-md-12 col-sm-12 col-xs-12 gitcol"> <a class="github" href="https://github.com/kysonic/riot-mui"> <github></github> </a> </div> </div> <div class="row"> <div class="col col-lg-12 col-md-12 col-sm-12 col-xs-12 logocol"> <a href="#buttons" class="logo"> <logo></logo> </a> </div> </div> </material-navbar> <div class="row content"> <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col right"> <div class="wrapper"> <route></route> </div> </div> </div>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(30);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(30, function() {
				var newContent = __webpack_require__(30);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".stop-scrolling {\n  height: 100%;\n  overflow: hidden; }\n\nhome-layout {\n  display: block;\n  height: 100%;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans'; }\n  home-layout .row {\n    height: calc(100% - 67px);\n    margin: 0;\n    padding: 0; }\n    home-layout .row .col {\n      margin: 0;\n      padding: 0; }\n  home-layout .icon-row {\n    height: 67px; }\n  home-layout material-navbar {\n    height: 410px; }\n    home-layout material-navbar.footer {\n      height: 200px; }\n      home-layout material-navbar.footer .nav-wrapper {\n        display: flex;\n        flex-direction: row;\n        align-items: center;\n        text-align: center; }\n        home-layout material-navbar.footer .nav-wrapper material-button {\n          left: 50%;\n          margin-left: -70px; }\n    home-layout material-navbar .row .col {\n      display: flex;\n      flex-direction: row;\n      align-items: center; }\n      home-layout material-navbar .row .col.logocol {\n        flex-direction: column; }\n      home-layout material-navbar .row .col .logo {\n        width: 50%;\n        height: 60%; }\n        home-layout material-navbar .row .col .logo logo {\n          display: block;\n          width: 100%;\n          height: 100%; }\n    home-layout material-navbar .gitcol {\n      flex-direction: column !important;\n      align-items: flex-end !important; }\n      home-layout material-navbar .gitcol .github {\n        margin-right: 10px;\n        margin-top: 12px; }\n    home-layout material-navbar .logo {\n      display: block;\n      margin-left: 20px;\n      font-size: 33px;\n      font-weight: 100; }\n      home-layout material-navbar .logo .menu {\n        display: none; }\n      home-layout material-navbar .logo a {\n        display: inline-block;\n        text-decoration: none; }\n      home-layout material-navbar .logo .for-riot {\n        display: inline-block;\n        vertical-align: middle;\n        margin-left: 5px;\n        background: url(\"/images/for_riot.png\") no-repeat center;\n        width: 92px;\n        height: 37px;\n        position: relative;\n        bottom: 2px; }\n  home-layout > .content .wrapper {\n    max-width: 1100px;\n    width: 100%;\n    margin: 0 auto;\n    text-align: center; }\n    home-layout > .content .wrapper h1 {\n      color: #61bdcc;\n      font-size: 22px;\n      font-weight: 100; }\n    home-layout > .content .wrapper h3 {\n      color: #61bdcc;\n      font-size: 20px;\n      font-weight: 100; }\n    home-layout > .content .wrapper a {\n      color: #61bdcc;\n      font-weight: 100; }\n    home-layout > .content .wrapper riotmui-code {\n      margin: 10px 0; }\n    home-layout > .content .wrapper ul {\n      list-style: none; }\n\n@media (min-width: 768px) and (max-width: 1024px) {\n  home-layout material-navbar {\n    height: 300px; } }\n\n@media (min-width: 480px) and (max-width: 768px) {\n  home-layout material-navbar {\n    height: 200px; } }\n\n@media (min-width: 320px) and (max-width: 480px) {\n  home-layout material-navbar {\n    height: 200px; } }\n", ""]);

	// exports


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag('logo', '<svg version="1.1" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 952.667 204" > <g> <path fill="#FF0044" d="M949,46.658c0,2.214-1.229,4.009-3.412,4.009H833.804c-2.183,0-4.804-1.795-4.804-4.009V6.675 c0-2.214,2.621-4.009,4.804-4.009h111.784c2.183,0,3.412,1.795,3.412,4.009V46.658z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M914.451,20.68c-4.651-0.048-8.343,3.471-8.332,7.942 c0.01,4.451,3.533,7.784,8.217,7.775c4.639-0.009,8.23-3.391,8.274-7.789C922.654,24.241,919.038,20.728,914.451,20.68z M914.386,31.724c-1.615,0.023-2.938-1.369-2.962-3.116c-0.024-1.782,1.219-3.135,2.886-3.14c1.69-0.005,2.93,1.292,2.944,3.081 C917.268,30.333,916.031,31.701,914.386,31.724z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M898.297,21.384c0.316-0.245,0.361-0.311,0.414-0.318 c4.854-0.603,4.854-0.602,4.854,4.238c0,3.004-0.043,6.01,0.019,9.013c0.026,1.258-0.272,1.862-1.688,1.827 c-4.296-0.105-3.542,0.371-3.589-3.534C898.264,28.846,898.297,25.079,898.297,21.384z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M892.734,31.096c0.392-0.334,0.74-0.602,1.055-0.905 c3.033-2.916,1.26-7.924-2.859-8.727C887.616,20.819,884,21,880,20.811c0,5.333,0,9.855,0,14.855c2,0,4.615,0,6.269,0 c0.144-1,0.276-2.564,0.41-3.884c0.172-0.135,0.343-0.185,0.515-0.319c1.602,4.146,4.398,5.633,8.621,4.26 C894.786,34.164,893.785,32.69,892.734,31.096z M886.658,28.167c-0.074-0.854-0.141-1.622-0.231-2.659 c1.56,0.149,3.512-0.655,3.614,1.185C890.146,28.619,888.129,27.919,886.658,28.167z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M923.85,20.971c4.313,0,8.398,0.019,12.483-0.013 c1.014-0.008,1.38,0.423,1.321,1.385c-0.035,0.575-0.045,1.157,0.004,1.73c0.09,1.058-0.322,1.553-1.417,1.492 c-0.877-0.048-1.759-0.01-2.905-0.01c0,2.959-0.088,5.697,0.031,8.427c0.072,1.672-0.437,2.249-2.155,2.176 c-3.651-0.156-3.146,0.315-3.182-3.207c-0.023-2.361-0.005-4.723-0.005-7.263c-1.447-0.085-2.75-0.162-4.176-0.246 C923.85,23.962,923.85,22.595,923.85,20.971z"></path> <g> <path fill="#FFFFFF" d="M129.931,194.211v-58.836c0-8.747-1.701-15.128-5.103-19.145c-3.403-4.015-8.615-6.024-15.638-6.024 c-9.165,0-15.94,2.531-20.33,7.592c-4.391,5.062-6.584,13.011-6.584,23.848v52.564h-8.313V132.9 c0-15.128-6.914-22.693-20.741-22.693c-9.383,0-16.214,2.737-20.494,8.211c-4.28,5.475-6.42,14.235-6.42,26.282v49.512H18.16 v-89.698h6.749l1.729,12.295h0.494c2.469-4.456,5.98-7.908,10.535-10.356c4.554-2.447,9.575-3.672,15.062-3.672 c14.102,0,23.155,5.31,27.161,15.926h0.329c2.908-5.116,6.817-9.049,11.729-11.8c4.91-2.75,10.494-4.126,16.749-4.126 c9.766,0,17.091,2.614,21.976,7.839c4.883,5.227,7.325,13.533,7.325,24.921v58.671H129.931z"></path> <path fill="#FFFFFF" d="M221.29,194.211l-2.058-14.193h-0.658c-4.5,5.777-9.123,9.861-13.869,12.254 c-4.747,2.395-10.358,3.59-16.832,3.59c-8.78,0-15.611-2.254-20.494-6.766c-4.884-4.511-7.325-10.755-7.325-18.732 c0-8.747,3.634-15.541,10.906-20.383c7.27-4.84,17.791-7.398,31.564-7.674l17.037-0.495v-5.941c0-8.526-1.729-14.963-5.185-19.31 c-3.457-4.345-9.027-6.519-16.708-6.519c-8.286,0-16.873,2.311-25.762,6.932l-3.045-7.097c9.821-4.621,19.534-6.932,29.136-6.932 c9.821,0,17.161,2.558,22.017,7.674c4.856,5.116,7.284,13.094,7.284,23.931v59.661H221.29z M188.368,188.436 c9.548,0,17.079-2.736,22.593-8.211c5.514-5.474,8.271-13.08,8.271-22.816v-8.83l-15.638,0.66 c-12.565,0.605-21.523,2.572-26.873,5.9c-5.35,3.329-8.025,8.514-8.025,15.555c0,5.611,1.714,9.973,5.144,13.08 C177.27,186.881,182.113,188.436,188.368,188.436z"></path> <path fill="#FFFFFF" d="M279.892,188.6c5.157,0,9.657-0.439,13.498-1.32v6.602c-3.951,1.32-8.506,1.98-13.663,1.98 c-7.901,0-13.732-2.117-17.49-6.354c-3.759-4.235-5.638-10.893-5.638-19.97V111.61h-13.251v-4.786l13.251-3.713l4.115-20.3h4.197 v21.703h26.255v7.097h-26.255v56.773c0,6.877,1.207,11.965,3.622,15.266C270.948,186.95,274.733,188.6,279.892,188.6z"></path> <path fill="#FFFFFF" d="M348.864,195.862c-13.004,0-23.142-4.015-30.412-12.047c-7.271-8.031-10.905-19.281-10.905-33.751 c0-14.303,3.511-25.759,10.535-34.37c7.023-8.609,16.488-12.914,28.396-12.914c10.535,0,18.848,3.687,24.938,11.058 c6.09,7.373,9.136,17.385,9.136,30.038v6.602h-64.445c0.109,12.323,2.976,21.73,8.601,28.221 c5.624,6.492,13.676,9.738,24.157,9.738c5.103,0,9.588-0.357,13.457-1.073c3.868-0.714,8.766-2.255,14.691-4.621v7.427 c-5.049,2.201-9.712,3.701-13.992,4.498C358.74,195.462,354.021,195.862,348.864,195.862z M346.477,110.042 c-8.615,0-15.529,2.847-20.741,8.541c-5.213,5.693-8.259,13.904-9.136,24.632h55.309c0-10.398-2.25-18.525-6.749-24.385 C360.661,112.972,354.432,110.042,346.477,110.042z"></path> <path fill="#FFFFFF" d="M440.47,102.78c3.786,0,7.846,0.386,12.181,1.155l-1.564,7.839c-3.732-0.935-7.6-1.403-11.605-1.403 c-7.627,0-13.883,3.247-18.766,9.737c-4.884,6.493-7.325,14.688-7.325,24.59v49.512h-8.148v-89.698h6.914l0.823,16.174h0.576 c3.675-6.602,7.599-11.235,11.77-13.905C429.495,104.115,434.544,102.78,440.47,102.78z"></path> <path fill="#FFFFFF" d="M469.688,79.592c0-5.281,1.729-7.922,5.186-7.922c1.7,0,3.031,0.688,3.991,2.063 c0.96,1.376,1.441,3.329,1.441,5.859c0,2.476-0.481,4.429-1.441,5.859c-0.96,1.431-2.291,2.146-3.991,2.146 C471.417,87.597,469.688,84.929,469.688,79.592z M478.989,194.211h-8.148v-89.698h8.148V194.211z"></path> <path fill="#FFFFFF" d="M563.27,194.211l-2.057-14.193h-0.658c-4.5,5.777-9.123,9.861-13.869,12.254 c-4.746,2.395-10.357,3.59-16.832,3.59c-8.779,0-15.61-2.254-20.494-6.766c-4.884-4.511-7.324-10.755-7.324-18.732 c0-8.747,3.634-15.541,10.905-20.383c7.27-4.84,17.79-7.398,31.563-7.674l17.037-0.495v-5.941c0-8.526-1.729-14.963-5.185-19.31 c-3.457-4.345-9.026-6.519-16.708-6.519c-8.286,0-16.873,2.311-25.762,6.932l-3.045-7.097c9.82-4.621,19.533-6.932,29.136-6.932 c9.821,0,17.161,2.558,22.017,7.674c4.856,5.116,7.284,13.094,7.284,23.931v59.661H563.27z M530.348,188.436 c9.548,0,17.078-2.736,22.594-8.211c5.514-5.474,8.271-13.08,8.271-22.816v-8.83l-15.639,0.66 c-12.565,0.605-21.523,2.572-26.873,5.9c-5.35,3.329-8.024,8.514-8.024,15.555c0,5.611,1.714,9.973,5.144,13.08 S524.093,188.436,530.348,188.436z"></path> <path fill="#FFFFFF" d="M606.398,194.211h-8.148v-128.4h8.148V194.211z"></path> <path fill="#FFFFFF" d="M770.68,73.568v78.063c0,13.863-4.006,24.702-12.016,32.514c-8.012,7.813-19.178,11.717-33.498,11.717 c-13.938,0-24.816-3.92-32.635-11.758c-7.819-7.84-11.729-18.773-11.729-32.803V73.568h8.478v78.063 c0,11.609,3.21,20.645,9.63,27.107c6.42,6.466,15.5,9.697,27.242,9.697c11.469,0,20.357-3.178,26.668-9.531 c6.309-6.354,9.465-15.17,9.465-26.447V73.568H770.68z"></path> <path fill="#FFFFFF" d="M803.438,194.211V73.568h8.396v120.643H803.438z"></path> </g> <g> <path fill="#FFFFFF" d="M848.101,25.841h-2.729v9.404h-2.385v-9.404h-1.839v-1.115l1.839-0.729v-0.729 c0-1.324,0.31-2.306,0.93-2.944c0.62-0.639,1.566-0.958,2.841-0.958c0.835,0,1.657,0.139,2.466,0.416l-0.626,1.804 c-0.587-0.188-1.146-0.284-1.679-0.284c-0.539,0-0.932,0.167-1.178,0.502c-0.246,0.334-0.369,0.836-0.369,1.505v0.729h2.729 V25.841z"></path> <path fill="#FFFFFF" d="M859.917,29.621c0,1.831-0.47,3.26-1.405,4.287c-0.938,1.027-2.241,1.541-3.912,1.541 c-1.045,0-1.968-0.236-2.769-0.709c-0.804-0.473-1.42-1.151-1.851-2.037c-0.431-0.885-0.646-1.911-0.646-3.081 c0-1.817,0.465-3.236,1.395-4.256s2.24-1.53,3.933-1.53c1.616,0,2.896,0.522,3.84,1.565 C859.444,26.444,859.917,27.852,859.917,29.621z M851.78,29.621c0,2.588,0.953,3.881,2.86,3.881c1.887,0,2.83-1.293,2.83-3.881 c0-2.56-0.95-3.841-2.851-3.841c-0.997,0-1.721,0.332-2.168,0.994C852.004,27.436,851.78,28.385,851.78,29.621z"></path> <path fill="#FFFFFF" d="M868.315,23.835c0.479,0,0.872,0.034,1.183,0.101l-0.232,2.22c-0.337-0.081-0.688-0.122-1.051-0.122 c-0.95,0-1.721,0.311-2.31,0.933c-0.591,0.622-0.885,1.429-0.885,2.422v5.857h-2.375V24.038h1.86l0.313,1.976h0.121 c0.37-0.669,0.854-1.199,1.45-1.591C866.986,24.031,867.629,23.835,868.315,23.835z"></path> </g> </g> </svg>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var riot = __webpack_require__(1);
	__webpack_require__(27);
	// Page tags
	__webpack_require__(33);
	__webpack_require__(176);
	__webpack_require__(177);
	__webpack_require__(187);
	__webpack_require__(191);
	__webpack_require__(203);
	__webpack_require__(204);
	__webpack_require__(208);
	__webpack_require__(209);
	__webpack_require__(210);
	__webpack_require__(211);
	__webpack_require__(215);
	__webpack_require__(219);
	__webpack_require__(223);

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([new DefaultRoute({ tag: 'home' }), new Route({ tag: 'buttons' }), new Route({ tag: 'checkbox' }), new Route({ tag: 'combobox' }), new Route({ tag: 'm-input' }), new Route({ tag: 'dropdown' }), new Route({ tag: 'dropdown-list' }), new Route({ tag: 'navbar' }), new Route({ tag: 'pane' }), new Route({ tag: 'popup' }), new Route({ tag: 'snackbar' }), new Route({ tag: 'tabs' }), new Route({ tag: 'm-textarea' }), new NotFoundRoute({ tag: 'not-found' })]);
	riot.router.start();

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(34);
	__webpack_require__(15);
	__webpack_require__(8);
	riot.tag('home', '<h1>Welcome!</h1> <p> <a href="http://riotjs.com">Riot JS</a> is tiniest (by size) library allowing to create user interfaces. Riot is robust, fast and has enjoyable syntax. Unfortunately Riot doesn\'t have library of material UI components. This project aims to fix this problem. </p> <p> Any person who loves Riot and material UI willing to be a part of this project - <a href="https://github.com/kysonic/riot-mui">welcome</a>! We have great chance to create set of components which will provide basic features of <a href="https://www.google.com/design/spec/material-design/introduction.html">Material UI</a> for Riot. </p> <material-button link="#buttons"> <div class="text">Check this out!</div> </material-button> <h1>How to get riot-mui?</h1> <p>Github:</p> <riotmui-code code="git clone https://github.com/kysonic/riot-mui"></riotmui-code> <p>Npm:</p> <riotmui-code code="npm install riot-mui"></riotmui-code> <p>Bower:</p> <riotmui-code code="bower install riot-mui"></riotmui-code> ', function (opts) {
	  this.exp1 = "material-checkbox { background-color: transparent; }";
	  this.exp2 = "<link href=\"build/styles/riot-mui.min.css\" rel=\"stylesheet\">\n        ....\n <script src=\"build/js/riot-mui-mixins-min.js\"></script>\n <script src=\"build/js/riot-mui.js\"></script>";
	  this.exp3 = "modulesDirectories: [__dirname + '/node_modules',__dirname + '/bower_components/riot-mui/src']";
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(35);
	var hljs = __webpack_require__(37);
	riot.tag('riotmui-code', '<pre> <code> {{opts.code}} </code> </pre>', function (opts) {
	    var _this = this;

	    this.on('mount', function () {
	        hljs.highlightBlock(_this.root);
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(36);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(36, function() {
				var newContent = __webpack_require__(36);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "riotmui-code {\n  background: #f5f5f5; }\n  riotmui-code pre {\n    margin: 0; }\n", ""]);

	// exports


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var hljs = __webpack_require__(38);

	hljs.registerLanguage('1c', __webpack_require__(39));
	hljs.registerLanguage('accesslog', __webpack_require__(40));
	hljs.registerLanguage('actionscript', __webpack_require__(41));
	hljs.registerLanguage('apache', __webpack_require__(42));
	hljs.registerLanguage('applescript', __webpack_require__(43));
	hljs.registerLanguage('armasm', __webpack_require__(44));
	hljs.registerLanguage('xml', __webpack_require__(45));
	hljs.registerLanguage('asciidoc', __webpack_require__(46));
	hljs.registerLanguage('aspectj', __webpack_require__(47));
	hljs.registerLanguage('autohotkey', __webpack_require__(48));
	hljs.registerLanguage('autoit', __webpack_require__(49));
	hljs.registerLanguage('avrasm', __webpack_require__(50));
	hljs.registerLanguage('axapta', __webpack_require__(51));
	hljs.registerLanguage('bash', __webpack_require__(52));
	hljs.registerLanguage('brainfuck', __webpack_require__(53));
	hljs.registerLanguage('cal', __webpack_require__(54));
	hljs.registerLanguage('capnproto', __webpack_require__(55));
	hljs.registerLanguage('ceylon', __webpack_require__(56));
	hljs.registerLanguage('clojure', __webpack_require__(57));
	hljs.registerLanguage('clojure-repl', __webpack_require__(58));
	hljs.registerLanguage('cmake', __webpack_require__(59));
	hljs.registerLanguage('coffeescript', __webpack_require__(60));
	hljs.registerLanguage('cpp', __webpack_require__(61));
	hljs.registerLanguage('crmsh', __webpack_require__(62));
	hljs.registerLanguage('crystal', __webpack_require__(63));
	hljs.registerLanguage('cs', __webpack_require__(64));
	hljs.registerLanguage('css', __webpack_require__(65));
	hljs.registerLanguage('d', __webpack_require__(66));
	hljs.registerLanguage('markdown', __webpack_require__(67));
	hljs.registerLanguage('dart', __webpack_require__(68));
	hljs.registerLanguage('delphi', __webpack_require__(69));
	hljs.registerLanguage('diff', __webpack_require__(70));
	hljs.registerLanguage('django', __webpack_require__(71));
	hljs.registerLanguage('dns', __webpack_require__(72));
	hljs.registerLanguage('dockerfile', __webpack_require__(73));
	hljs.registerLanguage('dos', __webpack_require__(74));
	hljs.registerLanguage('dust', __webpack_require__(75));
	hljs.registerLanguage('elixir', __webpack_require__(76));
	hljs.registerLanguage('elm', __webpack_require__(77));
	hljs.registerLanguage('ruby', __webpack_require__(78));
	hljs.registerLanguage('erb', __webpack_require__(79));
	hljs.registerLanguage('erlang-repl', __webpack_require__(80));
	hljs.registerLanguage('erlang', __webpack_require__(81));
	hljs.registerLanguage('fix', __webpack_require__(82));
	hljs.registerLanguage('fortran', __webpack_require__(83));
	hljs.registerLanguage('fsharp', __webpack_require__(84));
	hljs.registerLanguage('gams', __webpack_require__(85));
	hljs.registerLanguage('gcode', __webpack_require__(86));
	hljs.registerLanguage('gherkin', __webpack_require__(87));
	hljs.registerLanguage('glsl', __webpack_require__(88));
	hljs.registerLanguage('go', __webpack_require__(89));
	hljs.registerLanguage('golo', __webpack_require__(90));
	hljs.registerLanguage('gradle', __webpack_require__(91));
	hljs.registerLanguage('groovy', __webpack_require__(92));
	hljs.registerLanguage('haml', __webpack_require__(93));
	hljs.registerLanguage('handlebars', __webpack_require__(94));
	hljs.registerLanguage('haskell', __webpack_require__(95));
	hljs.registerLanguage('haxe', __webpack_require__(96));
	hljs.registerLanguage('http', __webpack_require__(97));
	hljs.registerLanguage('inform7', __webpack_require__(98));
	hljs.registerLanguage('ini', __webpack_require__(99));
	hljs.registerLanguage('irpf90', __webpack_require__(100));
	hljs.registerLanguage('java', __webpack_require__(101));
	hljs.registerLanguage('javascript', __webpack_require__(102));
	hljs.registerLanguage('json', __webpack_require__(103));
	hljs.registerLanguage('julia', __webpack_require__(104));
	hljs.registerLanguage('kotlin', __webpack_require__(105));
	hljs.registerLanguage('lasso', __webpack_require__(106));
	hljs.registerLanguage('less', __webpack_require__(107));
	hljs.registerLanguage('lisp', __webpack_require__(108));
	hljs.registerLanguage('livecodeserver', __webpack_require__(109));
	hljs.registerLanguage('livescript', __webpack_require__(110));
	hljs.registerLanguage('lua', __webpack_require__(111));
	hljs.registerLanguage('makefile', __webpack_require__(112));
	hljs.registerLanguage('mathematica', __webpack_require__(113));
	hljs.registerLanguage('matlab', __webpack_require__(114));
	hljs.registerLanguage('mel', __webpack_require__(115));
	hljs.registerLanguage('mercury', __webpack_require__(116));
	hljs.registerLanguage('mizar', __webpack_require__(117));
	hljs.registerLanguage('perl', __webpack_require__(118));
	hljs.registerLanguage('mojolicious', __webpack_require__(119));
	hljs.registerLanguage('monkey', __webpack_require__(120));
	hljs.registerLanguage('nginx', __webpack_require__(121));
	hljs.registerLanguage('nimrod', __webpack_require__(122));
	hljs.registerLanguage('nix', __webpack_require__(123));
	hljs.registerLanguage('nsis', __webpack_require__(124));
	hljs.registerLanguage('objectivec', __webpack_require__(125));
	hljs.registerLanguage('ocaml', __webpack_require__(126));
	hljs.registerLanguage('openscad', __webpack_require__(127));
	hljs.registerLanguage('oxygene', __webpack_require__(128));
	hljs.registerLanguage('parser3', __webpack_require__(129));
	hljs.registerLanguage('pf', __webpack_require__(130));
	hljs.registerLanguage('php', __webpack_require__(131));
	hljs.registerLanguage('powershell', __webpack_require__(132));
	hljs.registerLanguage('processing', __webpack_require__(133));
	hljs.registerLanguage('profile', __webpack_require__(134));
	hljs.registerLanguage('prolog', __webpack_require__(135));
	hljs.registerLanguage('protobuf', __webpack_require__(136));
	hljs.registerLanguage('puppet', __webpack_require__(137));
	hljs.registerLanguage('python', __webpack_require__(138));
	hljs.registerLanguage('q', __webpack_require__(139));
	hljs.registerLanguage('r', __webpack_require__(140));
	hljs.registerLanguage('rib', __webpack_require__(141));
	hljs.registerLanguage('roboconf', __webpack_require__(142));
	hljs.registerLanguage('rsl', __webpack_require__(143));
	hljs.registerLanguage('ruleslanguage', __webpack_require__(144));
	hljs.registerLanguage('rust', __webpack_require__(145));
	hljs.registerLanguage('scala', __webpack_require__(146));
	hljs.registerLanguage('scheme', __webpack_require__(147));
	hljs.registerLanguage('scilab', __webpack_require__(148));
	hljs.registerLanguage('scss', __webpack_require__(149));
	hljs.registerLanguage('smali', __webpack_require__(150));
	hljs.registerLanguage('smalltalk', __webpack_require__(151));
	hljs.registerLanguage('sml', __webpack_require__(152));
	hljs.registerLanguage('sqf', __webpack_require__(153));
	hljs.registerLanguage('sql', __webpack_require__(154));
	hljs.registerLanguage('stata', __webpack_require__(155));
	hljs.registerLanguage('step21', __webpack_require__(156));
	hljs.registerLanguage('stylus', __webpack_require__(157));
	hljs.registerLanguage('swift', __webpack_require__(158));
	hljs.registerLanguage('tcl', __webpack_require__(159));
	hljs.registerLanguage('tex', __webpack_require__(160));
	hljs.registerLanguage('thrift', __webpack_require__(161));
	hljs.registerLanguage('tp', __webpack_require__(162));
	hljs.registerLanguage('twig', __webpack_require__(163));
	hljs.registerLanguage('typescript', __webpack_require__(164));
	hljs.registerLanguage('vala', __webpack_require__(165));
	hljs.registerLanguage('vbnet', __webpack_require__(166));
	hljs.registerLanguage('vbscript', __webpack_require__(167));
	hljs.registerLanguage('vbscript-html', __webpack_require__(168));
	hljs.registerLanguage('verilog', __webpack_require__(169));
	hljs.registerLanguage('vhdl', __webpack_require__(170));
	hljs.registerLanguage('vim', __webpack_require__(171));
	hljs.registerLanguage('x86asm', __webpack_require__(172));
	hljs.registerLanguage('xl', __webpack_require__(173));
	hljs.registerLanguage('xquery', __webpack_require__(174));
	hljs.registerLanguage('zephir', __webpack_require__(175));

	module.exports = hljs;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Syntax highlighting with language autodetection.
	https://highlightjs.org/
	*/

	(function(factory) {

	  // Setup highlight.js for different environments. First is Node.js or
	  // CommonJS.
	  if(true) {
	    factory(exports);
	  } else {
	    // Export hljs globally even when using AMD for cases when this script
	    // is loaded with others that may still expect a global hljs.
	    window.hljs = factory({});

	    // Finally register the global hljs with AMD.
	    if(typeof define === 'function' && define.amd) {
	      define('hljs', [], function() {
	        return window.hljs;
	      });
	    }
	  }

	}(function(hljs) {

	  /* Utility functions */

	  function escape(value) {
	    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
	  }

	  function tag(node) {
	    return node.nodeName.toLowerCase();
	  }

	  function testRe(re, lexeme) {
	    var match = re && re.exec(lexeme);
	    return match && match.index == 0;
	  }

	  function isNotHighlighted(language) {
	    return (/^(no-?highlight|plain|text)$/i).test(language);
	  }

	  function blockLanguage(block) {
	    var i, match, length,
	        classes = block.className + ' ';

	    classes += block.parentNode ? block.parentNode.className : '';

	    // language-* takes precedence over non-prefixed class names
	    match = (/\blang(?:uage)?-([\w-]+)\b/i).exec(classes);
	    if (match) {
	      return getLanguage(match[1]) ? match[1] : 'no-highlight';
	    }

	    classes = classes.split(/\s+/);
	    for (i = 0, length = classes.length; i < length; i++) {
	      if (getLanguage(classes[i]) || isNotHighlighted(classes[i])) {
	        return classes[i];
	      }
	    }
	  }

	  function inherit(parent, obj) {
	    var result = {}, key;
	    for (key in parent)
	      result[key] = parent[key];
	    if (obj)
	      for (key in obj)
	        result[key] = obj[key];
	    return result;
	  }

	  /* Stream merging */

	  function nodeStream(node) {
	    var result = [];
	    (function _nodeStream(node, offset) {
	      for (var child = node.firstChild; child; child = child.nextSibling) {
	        if (child.nodeType == 3)
	          offset += child.nodeValue.length;
	        else if (child.nodeType == 1) {
	          result.push({
	            event: 'start',
	            offset: offset,
	            node: child
	          });
	          offset = _nodeStream(child, offset);
	          // Prevent void elements from having an end tag that would actually
	          // double them in the output. There are more void elements in HTML
	          // but we list only those realistically expected in code display.
	          if (!tag(child).match(/br|hr|img|input/)) {
	            result.push({
	              event: 'stop',
	              offset: offset,
	              node: child
	            });
	          }
	        }
	      }
	      return offset;
	    })(node, 0);
	    return result;
	  }

	  function mergeStreams(original, highlighted, value) {
	    var processed = 0;
	    var result = '';
	    var nodeStack = [];

	    function selectStream() {
	      if (!original.length || !highlighted.length) {
	        return original.length ? original : highlighted;
	      }
	      if (original[0].offset != highlighted[0].offset) {
	        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
	      }

	      /*
	      To avoid starting the stream just before it should stop the order is
	      ensured that original always starts first and closes last:

	      if (event1 == 'start' && event2 == 'start')
	        return original;
	      if (event1 == 'start' && event2 == 'stop')
	        return highlighted;
	      if (event1 == 'stop' && event2 == 'start')
	        return original;
	      if (event1 == 'stop' && event2 == 'stop')
	        return highlighted;

	      ... which is collapsed to:
	      */
	      return highlighted[0].event == 'start' ? original : highlighted;
	    }

	    function open(node) {
	      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"';}
	      result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
	    }

	    function close(node) {
	      result += '</' + tag(node) + '>';
	    }

	    function render(event) {
	      (event.event == 'start' ? open : close)(event.node);
	    }

	    while (original.length || highlighted.length) {
	      var stream = selectStream();
	      result += escape(value.substr(processed, stream[0].offset - processed));
	      processed = stream[0].offset;
	      if (stream == original) {
	        /*
	        On any opening or closing tag of the original markup we first close
	        the entire highlighted node stack, then render the original tag along
	        with all the following original tags at the same offset and then
	        reopen all the tags on the highlighted stack.
	        */
	        nodeStack.reverse().forEach(close);
	        do {
	          render(stream.splice(0, 1)[0]);
	          stream = selectStream();
	        } while (stream == original && stream.length && stream[0].offset == processed);
	        nodeStack.reverse().forEach(open);
	      } else {
	        if (stream[0].event == 'start') {
	          nodeStack.push(stream[0].node);
	        } else {
	          nodeStack.pop();
	        }
	        render(stream.splice(0, 1)[0]);
	      }
	    }
	    return result + escape(value.substr(processed));
	  }

	  /* Initialization */

	  function compileLanguage(language) {

	    function reStr(re) {
	        return (re && re.source) || re;
	    }

	    function langRe(value, global) {
	      return new RegExp(
	        reStr(value),
	        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
	      );
	    }

	    function compileMode(mode, parent) {
	      if (mode.compiled)
	        return;
	      mode.compiled = true;

	      mode.keywords = mode.keywords || mode.beginKeywords;
	      if (mode.keywords) {
	        var compiled_keywords = {};

	        var flatten = function(className, str) {
	          if (language.case_insensitive) {
	            str = str.toLowerCase();
	          }
	          str.split(' ').forEach(function(kw) {
	            var pair = kw.split('|');
	            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
	          });
	        };

	        if (typeof mode.keywords == 'string') { // string
	          flatten('keyword', mode.keywords);
	        } else {
	          Object.keys(mode.keywords).forEach(function (className) {
	            flatten(className, mode.keywords[className]);
	          });
	        }
	        mode.keywords = compiled_keywords;
	      }
	      mode.lexemesRe = langRe(mode.lexemes || /\b\w+\b/, true);

	      if (parent) {
	        if (mode.beginKeywords) {
	          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
	        }
	        if (!mode.begin)
	          mode.begin = /\B|\b/;
	        mode.beginRe = langRe(mode.begin);
	        if (!mode.end && !mode.endsWithParent)
	          mode.end = /\B|\b/;
	        if (mode.end)
	          mode.endRe = langRe(mode.end);
	        mode.terminator_end = reStr(mode.end) || '';
	        if (mode.endsWithParent && parent.terminator_end)
	          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
	      }
	      if (mode.illegal)
	        mode.illegalRe = langRe(mode.illegal);
	      if (mode.relevance === undefined)
	        mode.relevance = 1;
	      if (!mode.contains) {
	        mode.contains = [];
	      }
	      var expanded_contains = [];
	      mode.contains.forEach(function(c) {
	        if (c.variants) {
	          c.variants.forEach(function(v) {expanded_contains.push(inherit(c, v));});
	        } else {
	          expanded_contains.push(c == 'self' ? mode : c);
	        }
	      });
	      mode.contains = expanded_contains;
	      mode.contains.forEach(function(c) {compileMode(c, mode);});

	      if (mode.starts) {
	        compileMode(mode.starts, parent);
	      }

	      var terminators =
	        mode.contains.map(function(c) {
	          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
	        })
	        .concat([mode.terminator_end, mode.illegal])
	        .map(reStr)
	        .filter(Boolean);
	      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/) {return null;}};
	    }

	    compileMode(language);
	  }

	  /*
	  Core highlighting function. Accepts a language name, or an alias, and a
	  string with the code to highlight. Returns an object with the following
	  properties:

	  - relevance (int)
	  - value (an HTML string with highlighting markup)

	  */
	  function highlight(name, value, ignore_illegals, continuation) {

	    function subMode(lexeme, mode) {
	      for (var i = 0; i < mode.contains.length; i++) {
	        if (testRe(mode.contains[i].beginRe, lexeme)) {
	          return mode.contains[i];
	        }
	      }
	    }

	    function endOfMode(mode, lexeme) {
	      if (testRe(mode.endRe, lexeme)) {
	        while (mode.endsParent && mode.parent) {
	          mode = mode.parent;
	        }
	        return mode;
	      }
	      if (mode.endsWithParent) {
	        return endOfMode(mode.parent, lexeme);
	      }
	    }

	    function isIllegal(lexeme, mode) {
	      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
	    }

	    function keywordMatch(mode, match) {
	      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
	      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
	    }

	    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
	      var classPrefix = noPrefix ? '' : options.classPrefix,
	          openSpan    = '<span class="' + classPrefix,
	          closeSpan   = leaveOpen ? '' : '</span>';

	      openSpan += classname + '">';

	      return openSpan + insideSpan + closeSpan;
	    }

	    function processKeywords() {
	      if (!top.keywords)
	        return escape(mode_buffer);
	      var result = '';
	      var last_index = 0;
	      top.lexemesRe.lastIndex = 0;
	      var match = top.lexemesRe.exec(mode_buffer);
	      while (match) {
	        result += escape(mode_buffer.substr(last_index, match.index - last_index));
	        var keyword_match = keywordMatch(top, match);
	        if (keyword_match) {
	          relevance += keyword_match[1];
	          result += buildSpan(keyword_match[0], escape(match[0]));
	        } else {
	          result += escape(match[0]);
	        }
	        last_index = top.lexemesRe.lastIndex;
	        match = top.lexemesRe.exec(mode_buffer);
	      }
	      return result + escape(mode_buffer.substr(last_index));
	    }

	    function processSubLanguage() {
	      var explicit = typeof top.subLanguage == 'string';
	      if (explicit && !languages[top.subLanguage]) {
	        return escape(mode_buffer);
	      }

	      var result = explicit ?
	                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
	                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

	      // Counting embedded language score towards the host language may be disabled
	      // with zeroing the containing mode relevance. Usecase in point is Markdown that
	      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
	      // score.
	      if (top.relevance > 0) {
	        relevance += result.relevance;
	      }
	      if (explicit) {
	        continuations[top.subLanguage] = result.top;
	      }
	      return buildSpan(result.language, result.value, false, true);
	    }

	    function processBuffer() {
	      return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
	    }

	    function startNewMode(mode, lexeme) {
	      var markup = mode.className? buildSpan(mode.className, '', true): '';
	      if (mode.returnBegin) {
	        result += markup;
	        mode_buffer = '';
	      } else if (mode.excludeBegin) {
	        result += escape(lexeme) + markup;
	        mode_buffer = '';
	      } else {
	        result += markup;
	        mode_buffer = lexeme;
	      }
	      top = Object.create(mode, {parent: {value: top}});
	    }

	    function processLexeme(buffer, lexeme) {

	      mode_buffer += buffer;
	      if (lexeme === undefined) {
	        result += processBuffer();
	        return 0;
	      }

	      var new_mode = subMode(lexeme, top);
	      if (new_mode) {
	        result += processBuffer();
	        startNewMode(new_mode, lexeme);
	        return new_mode.returnBegin ? 0 : lexeme.length;
	      }

	      var end_mode = endOfMode(top, lexeme);
	      if (end_mode) {
	        var origin = top;
	        if (!(origin.returnEnd || origin.excludeEnd)) {
	          mode_buffer += lexeme;
	        }
	        result += processBuffer();
	        do {
	          if (top.className) {
	            result += '</span>';
	          }
	          relevance += top.relevance;
	          top = top.parent;
	        } while (top != end_mode.parent);
	        if (origin.excludeEnd) {
	          result += escape(lexeme);
	        }
	        mode_buffer = '';
	        if (end_mode.starts) {
	          startNewMode(end_mode.starts, '');
	        }
	        return origin.returnEnd ? 0 : lexeme.length;
	      }

	      if (isIllegal(lexeme, top))
	        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

	      /*
	      Parser should not reach this point as all types of lexemes should be caught
	      earlier, but if it does due to some bug make sure it advances at least one
	      character forward to prevent infinite looping.
	      */
	      mode_buffer += lexeme;
	      return lexeme.length || 1;
	    }

	    var language = getLanguage(name);
	    if (!language) {
	      throw new Error('Unknown language: "' + name + '"');
	    }

	    compileLanguage(language);
	    var top = continuation || language;
	    var continuations = {}; // keep continuations for sub-languages
	    var result = '', current;
	    for(current = top; current != language; current = current.parent) {
	      if (current.className) {
	        result = buildSpan(current.className, '', true) + result;
	      }
	    }
	    var mode_buffer = '';
	    var relevance = 0;
	    try {
	      var match, count, index = 0;
	      while (true) {
	        top.terminators.lastIndex = index;
	        match = top.terminators.exec(value);
	        if (!match)
	          break;
	        count = processLexeme(value.substr(index, match.index - index), match[0]);
	        index = match.index + count;
	      }
	      processLexeme(value.substr(index));
	      for(current = top; current.parent; current = current.parent) { // close dangling modes
	        if (current.className) {
	          result += '</span>';
	        }
	      }
	      return {
	        relevance: relevance,
	        value: result,
	        language: name,
	        top: top
	      };
	    } catch (e) {
	      if (e.message.indexOf('Illegal') != -1) {
	        return {
	          relevance: 0,
	          value: escape(value)
	        };
	      } else {
	        throw e;
	      }
	    }
	  }

	  /*
	  Highlighting with language detection. Accepts a string with the code to
	  highlight. Returns an object with the following properties:

	  - language (detected language)
	  - relevance (int)
	  - value (an HTML string with highlighting markup)
	  - second_best (object with the same structure for second-best heuristically
	    detected language, may be absent)

	  */
	  function highlightAuto(text, languageSubset) {
	    languageSubset = languageSubset || options.languages || Object.keys(languages);
	    var result = {
	      relevance: 0,
	      value: escape(text)
	    };
	    var second_best = result;
	    languageSubset.forEach(function(name) {
	      if (!getLanguage(name)) {
	        return;
	      }
	      var current = highlight(name, text, false);
	      current.language = name;
	      if (current.relevance > second_best.relevance) {
	        second_best = current;
	      }
	      if (current.relevance > result.relevance) {
	        second_best = result;
	        result = current;
	      }
	    });
	    if (second_best.language) {
	      result.second_best = second_best;
	    }
	    return result;
	  }

	  /*
	  Post-processing of the highlighted markup:

	  - replace TABs with something more useful
	  - replace real line-breaks with '<br>' for non-pre containers

	  */
	  function fixMarkup(value) {
	    if (options.tabReplace) {
	      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1 /*..., offset, s*/) {
	        return p1.replace(/\t/g, options.tabReplace);
	      });
	    }
	    if (options.useBR) {
	      value = value.replace(/\n/g, '<br>');
	    }
	    return value;
	  }

	  function buildClassName(prevClassName, currentLang, resultLang) {
	    var language = currentLang ? aliases[currentLang] : resultLang,
	        result   = [prevClassName.trim()];

	    if (!prevClassName.match(/\bhljs\b/)) {
	      result.push('hljs');
	    }

	    if (prevClassName.indexOf(language) === -1) {
	      result.push(language);
	    }

	    return result.join(' ').trim();
	  }

	  /*
	  Applies highlighting to a DOM node containing code. Accepts a DOM node and
	  two optional parameters for fixMarkup.
	  */
	  function highlightBlock(block) {
	    var language = blockLanguage(block);
	    if (isNotHighlighted(language))
	        return;

	    var node;
	    if (options.useBR) {
	      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
	    } else {
	      node = block;
	    }
	    var text = node.textContent;
	    var result = language ? highlight(language, text, true) : highlightAuto(text);

	    var originalStream = nodeStream(node);
	    if (originalStream.length) {
	      var resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	      resultNode.innerHTML = result.value;
	      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
	    }
	    result.value = fixMarkup(result.value);

	    block.innerHTML = result.value;
	    block.className = buildClassName(block.className, language, result.language);
	    block.result = {
	      language: result.language,
	      re: result.relevance
	    };
	    if (result.second_best) {
	      block.second_best = {
	        language: result.second_best.language,
	        re: result.second_best.relevance
	      };
	    }
	  }

	  var options = {
	    classPrefix: 'hljs-',
	    tabReplace: null,
	    useBR: false,
	    languages: undefined
	  };

	  /*
	  Updates highlight.js global options with values passed in the form of an object
	  */
	  function configure(user_options) {
	    options = inherit(options, user_options);
	  }

	  /*
	  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
	  */
	  function initHighlighting() {
	    if (initHighlighting.called)
	      return;
	    initHighlighting.called = true;

	    var blocks = document.querySelectorAll('pre code');
	    Array.prototype.forEach.call(blocks, highlightBlock);
	  }

	  /*
	  Attaches highlighting to the page load event.
	  */
	  function initHighlightingOnLoad() {
	    addEventListener('DOMContentLoaded', initHighlighting, false);
	    addEventListener('load', initHighlighting, false);
	  }

	  var languages = {};
	  var aliases = {};

	  function registerLanguage(name, language) {
	    var lang = languages[name] = language(hljs);
	    if (lang.aliases) {
	      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
	    }
	  }

	  function listLanguages() {
	    return Object.keys(languages);
	  }

	  function getLanguage(name) {
	    name = (name || '').toLowerCase();
	    return languages[name] || languages[aliases[name]];
	  }

	  /* Interface definition */

	  hljs.highlight = highlight;
	  hljs.highlightAuto = highlightAuto;
	  hljs.fixMarkup = fixMarkup;
	  hljs.highlightBlock = highlightBlock;
	  hljs.configure = configure;
	  hljs.initHighlighting = initHighlighting;
	  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
	  hljs.registerLanguage = registerLanguage;
	  hljs.listLanguages = listLanguages;
	  hljs.getLanguage = getLanguage;
	  hljs.inherit = inherit;

	  // Common regexps
	  hljs.IDENT_RE = '[a-zA-Z]\\w*';
	  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
	  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
	  hljs.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
	  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
	  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

	  // Common modes
	  hljs.BACKSLASH_ESCAPE = {
	    begin: '\\\\[\\s\\S]', relevance: 0
	  };
	  hljs.APOS_STRING_MODE = {
	    className: 'string',
	    begin: '\'', end: '\'',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.QUOTE_STRING_MODE = {
	    className: 'string',
	    begin: '"', end: '"',
	    illegal: '\\n',
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  hljs.PHRASAL_WORDS_MODE = {
	    begin: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
	  };
	  hljs.COMMENT = function (begin, end, inherits) {
	    var mode = hljs.inherit(
	      {
	        className: 'comment',
	        begin: begin, end: end,
	        contains: []
	      },
	      inherits || {}
	    );
	    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
	    mode.contains.push({
	      className: 'doctag',
	      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
	      relevance: 0
	    });
	    return mode;
	  };
	  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
	  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
	  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
	  hljs.NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE,
	    relevance: 0
	  };
	  hljs.C_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.C_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.BINARY_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.BINARY_NUMBER_RE,
	    relevance: 0
	  };
	  hljs.CSS_NUMBER_MODE = {
	    className: 'number',
	    begin: hljs.NUMBER_RE + '(' +
	      '%|em|ex|ch|rem'  +
	      '|vw|vh|vmin|vmax' +
	      '|cm|mm|in|pt|pc|px' +
	      '|deg|grad|rad|turn' +
	      '|s|ms' +
	      '|Hz|kHz' +
	      '|dpi|dpcm|dppx' +
	      ')?',
	    relevance: 0
	  };
	  hljs.REGEXP_MODE = {
	    className: 'regexp',
	    begin: /\//, end: /\/[gimuy]*/,
	    illegal: /\n/,
	    contains: [
	      hljs.BACKSLASH_ESCAPE,
	      {
	        begin: /\[/, end: /\]/,
	        relevance: 0,
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }
	    ]
	  };
	  hljs.TITLE_MODE = {
	    className: 'title',
	    begin: hljs.IDENT_RE,
	    relevance: 0
	  };
	  hljs.UNDERSCORE_TITLE_MODE = {
	    className: 'title',
	    begin: hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0
	  };

	  return hljs;
	}));


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = function(hljs){
	  var IDENT_RE_RU = '[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*';
	  var OneS_KEYWORDS = 'возврат дата для если и или иначе иначеесли исключение конецесли ' +
	    'конецпопытки конецпроцедуры конецфункции конеццикла константа не перейти перем ' +
	    'перечисление по пока попытка прервать продолжить процедура строка тогда фс функция цикл ' +
	    'число экспорт';
	  var OneS_BUILT_IN = 'ansitooem oemtoansi ввестивидсубконто ввестидату ввестизначение ' +
	    'ввестиперечисление ввестипериод ввестиплансчетов ввестистроку ввестичисло вопрос ' +
	    'восстановитьзначение врег выбранныйплансчетов вызватьисключение датагод датамесяц ' +
	    'датачисло добавитьмесяц завершитьработусистемы заголовоксистемы записьжурналарегистрации ' +
	    'запуститьприложение зафиксироватьтранзакцию значениевстроку значениевстрокувнутр ' +
	    'значениевфайл значениеизстроки значениеизстрокивнутр значениеизфайла имякомпьютера ' +
	    'имяпользователя каталогвременныхфайлов каталогиб каталогпользователя каталогпрограммы ' +
	    'кодсимв командасистемы конгода конецпериодаби конецрассчитанногопериодаби ' +
	    'конецстандартногоинтервала конквартала конмесяца коннедели лев лог лог10 макс ' +
	    'максимальноеколичествосубконто мин монопольныйрежим названиеинтерфейса названиенабораправ ' +
	    'назначитьвид назначитьсчет найти найтипомеченныенаудаление найтиссылки началопериодаби ' +
	    'началостандартногоинтервала начатьтранзакцию начгода начквартала начмесяца начнедели ' +
	    'номерднягода номерднянедели номернеделигода нрег обработкаожидания окр описаниеошибки ' +
	    'основнойжурналрасчетов основнойплансчетов основнойязык открытьформу открытьформумодально ' +
	    'отменитьтранзакцию очиститьокносообщений периодстр полноеимяпользователя получитьвремята ' +
	    'получитьдатута получитьдокументта получитьзначенияотбора получитьпозициюта ' +
	    'получитьпустоезначение получитьта прав праводоступа предупреждение префиксавтонумерации ' +
	    'пустаястрока пустоезначение рабочаядаттьпустоезначение рабочаядата разделительстраниц ' +
	    'разделительстрок разм разобратьпозициюдокумента рассчитатьрегистрына ' +
	    'рассчитатьрегистрыпо сигнал симв символтабуляции создатьобъект сокрл сокрлп сокрп ' +
	    'сообщить состояние сохранитьзначение сред статусвозврата стрдлина стрзаменить ' +
	    'стрколичествострок стрполучитьстроку  стрчисловхождений сформироватьпозициюдокумента ' +
	    'счетпокоду текущаядата текущеевремя типзначения типзначениястр удалитьобъекты ' +
	    'установитьтана установитьтапо фиксшаблон формат цел шаблон';
	  var DQUOTE =  {className: 'dquote',  begin: '""'};
	  var STR_START = {
	      className: 'string',
	      begin: '"', end: '"|$',
	      contains: [DQUOTE]
	    };
	  var STR_CONT = {
	    className: 'string',
	    begin: '\\|', end: '"|$',
	    contains: [DQUOTE]
	  };

	  return {
	    case_insensitive: true,
	    lexemes: IDENT_RE_RU,
	    keywords: {keyword: OneS_KEYWORDS, built_in: OneS_BUILT_IN},
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.NUMBER_MODE,
	      STR_START, STR_CONT,
	      {
	        className: 'function',
	        begin: '(процедура|функция)', end: '$',
	        lexemes: IDENT_RE_RU,
	        keywords: 'процедура функция',
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE_RU}),
	          {
	            className: 'tail',
	            endsWithParent: true,
	            contains: [
	              {
	                className: 'params',
	                begin: '\\(', end: '\\)',
	                lexemes: IDENT_RE_RU,
	                keywords: 'знач',
	                contains: [STR_START, STR_CONT]
	              },
	              {
	                className: 'export',
	                begin: 'экспорт', endsWithParent: true,
	                lexemes: IDENT_RE_RU,
	                keywords: 'экспорт',
	                contains: [hljs.C_LINE_COMMENT_MODE]
	              }
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE
	        ]
	      },
	      {className: 'preprocessor', begin: '#', end: '$'},
	      {className: 'date', begin: '\'\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})\''}
	    ]
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    contains: [
	      // IP
	      {
	        className: 'number',
	        begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
	      },
	      // Other numbers
	      {
	        className: 'number',
	        begin: '\\b\\d+\\b',
	        relevance: 0
	      },
	      // Requests
	      {
	        className: 'string',
	        begin: '"(GET|POST|HEAD|PUT|DELETE|CONNECT|OPTIONS|PATCH|TRACE)', end: '"',
	        keywords: 'GET POST HEAD PUT DELETE CONNECT OPTIONS PATCH TRACE',
	        illegal: '\\n',
	        relevance: 10
	      },
	      // Dates
	      {
	        className: 'string',
	        begin: /\[/, end: /\]/,
	        illegal: '\\n'
	      },
	      // Strings
	      {
	        className: 'string',
	        begin: '"', end: '"',
	        illegal: '\\n'
	      }
	    ]
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE = '[a-zA-Z_$][a-zA-Z0-9_$]*';
	  var IDENT_FUNC_RETURN_TYPE_RE = '([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)';

	  var AS3_REST_ARG_MODE = {
	    className: 'rest_arg',
	    begin: '[.]{3}', end: IDENT_RE,
	    relevance: 10
	  };

	  return {
	    aliases: ['as'],
	    keywords: {
	      keyword: 'as break case catch class const continue default delete do dynamic each ' +
	        'else extends final finally for function get if implements import in include ' +
	        'instanceof interface internal is namespace native new override package private ' +
	        'protected public return set static super switch this throw try typeof use var void ' +
	        'while with',
	      literal: 'true false null undefined'
	    },
	    contains: [
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'package',
	        beginKeywords: 'package', end: '{',
	        contains: [hljs.TITLE_MODE]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        contains: [
	          {
	            beginKeywords: 'extends implements'
	          },
	          hljs.TITLE_MODE
	        ]
	      },
	      {
	        className: 'preprocessor',
	        beginKeywords: 'import include', end: ';'
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: '[{;]', excludeEnd: true,
	        illegal: '\\S',
	        contains: [
	          hljs.TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)',
	            contains: [
	              hljs.APOS_STRING_MODE,
	              hljs.QUOTE_STRING_MODE,
	              hljs.C_LINE_COMMENT_MODE,
	              hljs.C_BLOCK_COMMENT_MODE,
	              AS3_REST_ARG_MODE
	            ]
	          },
	          {
	            className: 'type',
	            begin: ':',
	            end: IDENT_FUNC_RETURN_TYPE_RE,
	            relevance: 10
	          }
	        ]
	      }
	    ],
	    illegal: /#/
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var NUMBER = {className: 'number', begin: '[\\$%]\\d+'};
	  return {
	    aliases: ['apacheconf'],
	    case_insensitive: true,
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {className: 'tag', begin: '</?', end: '>'},
	      {
	        className: 'keyword',
	        begin: /\w+/,
	        relevance: 0,
	        // keywords aren’t needed for highlighting per se, they only boost relevance
	        // for a very generally defined mode (starts with a word, ends with line-end
	        keywords: {
	          common:
	            'order deny allow setenv rewriterule rewriteengine rewritecond documentroot ' +
	            'sethandler errordocument loadmodule options header listen serverroot ' +
	            'servername'
	        },
	        starts: {
	          end: /$/,
	          relevance: 0,
	          keywords: {
	            literal: 'on off all'
	          },
	          contains: [
	            {
	              className: 'sqbracket',
	              begin: '\\s\\[', end: '\\]$'
	            },
	            {
	              className: 'cbracket',
	              begin: '[\\$%]\\{', end: '\\}',
	              contains: ['self', NUMBER]
	            },
	            NUMBER,
	            hljs.QUOTE_STRING_MODE
	          ]
	        }
	      }
	    ],
	    illegal: /\S/
	  };
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: ''});
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)',
	    contains: ['self', hljs.C_NUMBER_MODE, STRING]
	  };
	  var COMMENT_MODE_1 = hljs.COMMENT('--', '$');
	  var COMMENT_MODE_2 = hljs.COMMENT(
	    '\\(\\*',
	    '\\*\\)',
	    {
	      contains: ['self', COMMENT_MODE_1] //allow nesting
	    }
	  );
	  var COMMENTS = [
	    COMMENT_MODE_1,
	    COMMENT_MODE_2,
	    hljs.HASH_COMMENT_MODE
	  ];

	  return {
	    aliases: ['osascript'],
	    keywords: {
	      keyword:
	        'about above after against and around as at back before beginning ' +
	        'behind below beneath beside between but by considering ' +
	        'contain contains continue copy div does eighth else end equal ' +
	        'equals error every exit fifth first for fourth from front ' +
	        'get given global if ignoring in into is it its last local me ' +
	        'middle mod my ninth not of on onto or over prop property put ref ' +
	        'reference repeat returning script second set seventh since ' +
	        'sixth some tell tenth that the|0 then third through thru ' +
	        'timeout times to transaction try until where while whose with ' +
	        'without',
	      constant:
	        'AppleScript false linefeed return pi quote result space tab true',
	      type:
	        'alias application boolean class constant date file integer list ' +
	        'number real record string text',
	      command:
	        'activate beep count delay launch log offset read round ' +
	        'run say summarize write',
	      property:
	        'character characters contents day frontmost id item length ' +
	        'month name paragraph paragraphs rest reverse running time version ' +
	        'weekday word words year'
	    },
	    contains: [
	      STRING,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'type',
	        begin: '\\bPOSIX file\\b'
	      },
	      {
	        className: 'command',
	        begin:
	          '\\b(clipboard info|the clipboard|info for|list (disks|folder)|' +
	          'mount volume|path to|(close|open for) access|(get|set) eof|' +
	          'current date|do shell script|get volume settings|random number|' +
	          'set volume|system attribute|system info|time to GMT|' +
	          '(load|run|store) script|scripting components|' +
	          'ASCII (character|number)|localized string|' +
	          'choose (application|color|file|file name|' +
	          'folder|from list|remote application|URL)|' +
	          'display (alert|dialog))\\b|^\\s*return\\b'
	      },
	      {
	        className: 'constant',
	        begin:
	          '\\b(text item delimiters|current application|missing value)\\b'
	      },
	      {
	        className: 'keyword',
	        begin:
	          '\\b(apart from|aside from|instead of|out of|greater than|' +
	          "isn't|(doesn't|does not) (equal|come before|come after|contain)|" +
	          '(greater|less) than( or equal)?|(starts?|ends|begins?) with|' +
	          'contained by|comes (before|after)|a (ref|reference))\\b'
	      },
	      {
	        className: 'property',
	        begin:
	          '\\b(POSIX path|(date|time) string|quoted form)\\b'
	      },
	      {
	        className: 'function_start',
	        beginKeywords: 'on',
	        illegal: '[${=;\\n]',
	        contains: [hljs.UNDERSCORE_TITLE_MODE, PARAMS]
	      }
	    ].concat(COMMENTS),
	    illegal: '//|->|=>|\\[\\['
	  };
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	    //local labels: %?[FB]?[AT]?\d{1,2}\w+
	  return {
	    case_insensitive: true,
	    aliases: ['arm'],
	    lexemes: '\\.?' + hljs.IDENT_RE,
	    keywords: {
	      literal:
	        'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 '+ //standard registers
	        'pc lr sp ip sl sb fp '+ //typical regs plus backward compatibility
	        'a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 '+ //more regs and fp
	        'p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 '+ //coprocessor regs
	        'c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 '+ //more coproc
	        'q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 '+ //advanced SIMD NEON regs

	        //program status registers
	        'cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf '+
	        'spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf '+

	        //NEON and VFP registers
	        's0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 '+
	        's16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 '+
	        'd0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 '+
	        'd16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 ',
	    preprocessor:
	        //GNU preprocs
	        '.2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg '+
	        //ARM directives
	        'ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ',
	    built_in:
	        '{PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @ '
	    },
	    contains: [
	      {
	        className: 'keyword',
	        begin: '\\b('+     //mnemonics
	            'adc|'+
	            '(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|'+
	            'and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|'+
	            'bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|'+
	            'setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|'+
	            'ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|'+
	            'mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|'+
	            'mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|'+
	            'mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|'+
	            'rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|'+
	            'stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|'+
	            '[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|'+
	            'wfe|wfi|yield'+
	        ')'+
	        '(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?'+ //condition codes
	        '[sptrx]?' ,                                             //legal postfixes
	        end: '\\s'
	      },
	      hljs.COMMENT('[;@]', '$', {relevance: 0}),
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: '\'',
	        end: '[^\\\\]\'',
	        relevance: 0
	      },
	      {
	        className: 'title',
	        begin: '\\|', end: '\\|',
	        illegal: '\\n',
	        relevance: 0
	      },
	      {
	        className: 'number',
	        variants: [
	            {begin: '[#$=]?0x[0-9a-f]+'}, //hex
	            {begin: '[#$=]?0b[01]+'},     //bin
	            {begin: '[#$=]\\d+'},        //literal
	            {begin: '\\b\\d+'}           //bare number
	        ],
	        relevance: 0
	      },
	      {
	        className: 'label',
	        variants: [
	            {begin: '^[a-z_\\.\\$][a-z0-9_\\.\\$]+'}, //ARM syntax
	            {begin: '^\\s*[a-z_\\.\\$][a-z0-9_\\.\\$]+:'}, //GNU ARM syntax
	            {begin: '[=#]\\w+' }  //label reference
	        ],
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
	  var PHP = {
	    begin: /<\?(php)?(?!\w)/, end: /\?>/,
	    subLanguage: 'php'
	  };
	  var TAG_INTERNALS = {
	    endsWithParent: true,
	    illegal: /</,
	    relevance: 0,
	    contains: [
	      PHP,
	      {
	        className: 'attribute',
	        begin: XML_IDENT_RE,
	        relevance: 0
	      },
	      {
	        begin: '=',
	        relevance: 0,
	        contains: [
	          {
	            className: 'value',
	            contains: [PHP],
	            variants: [
	              {begin: /"/, end: /"/},
	              {begin: /'/, end: /'/},
	              {begin: /[^\s\/>]+/}
	            ]
	          }
	        ]
	      }
	    ]
	  };
	  return {
	    aliases: ['html', 'xhtml', 'rss', 'atom', 'xsl', 'plist'],
	    case_insensitive: true,
	    contains: [
	      {
	        className: 'doctype',
	        begin: '<!DOCTYPE', end: '>',
	        relevance: 10,
	        contains: [{begin: '\\[', end: '\\]'}]
	      },
	      hljs.COMMENT(
	        '<!--',
	        '-->',
	        {
	          relevance: 10
	        }
	      ),
	      {
	        className: 'cdata',
	        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
	        relevance: 10
	      },
	      {
	        className: 'tag',
	        /*
	        The lookahead pattern (?=...) ensures that 'begin' only matches
	        '<style' as a single word, followed by a whitespace or an
	        ending braket. The '$' is needed for the lexeme to be recognized
	        by hljs.subMode() that tests lexemes outside the stream.
	        */
	        begin: '<style(?=\\s|>|$)', end: '>',
	        keywords: {title: 'style'},
	        contains: [TAG_INTERNALS],
	        starts: {
	          end: '</style>', returnEnd: true,
	          subLanguage: 'css'
	        }
	      },
	      {
	        className: 'tag',
	        // See the comment in the <style tag about the lookahead pattern
	        begin: '<script(?=\\s|>|$)', end: '>',
	        keywords: {title: 'script'},
	        contains: [TAG_INTERNALS],
	        starts: {
	          end: '\<\/script\>', returnEnd: true,
	          subLanguage: ['actionscript', 'javascript', 'handlebars']
	        }
	      },
	      PHP,
	      {
	        className: 'pi',
	        begin: /<\?\w+/, end: /\?>/,
	        relevance: 10
	      },
	      {
	        className: 'tag',
	        begin: '</?', end: '/?>',
	        contains: [
	          {
	            className: 'title', begin: /[^ \/><\n\t]+/, relevance: 0
	          },
	          TAG_INTERNALS
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['adoc'],
	    contains: [
	      // block comment
	      hljs.COMMENT(
	        '^/{4,}\\n',
	        '\\n/{4,}$',
	        // can also be done as...
	        //'^/{4,}$',
	        //'^/{4,}$',
	        {
	          relevance: 10
	        }
	      ),
	      // line comment
	      hljs.COMMENT(
	        '^//',
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      // title
	      {
	        className: 'title',
	        begin: '^\\.\\w.*$'
	      },
	      // example, admonition & sidebar blocks
	      {
	        begin: '^[=\\*]{4,}\\n',
	        end: '\\n^[=\\*]{4,}$',
	        relevance: 10
	      },
	      // headings
	      {
	        className: 'header',
	        begin: '^(={1,5}) .+?( \\1)?$',
	        relevance: 10
	      },
	      {
	        className: 'header',
	        begin: '^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$',
	        relevance: 10
	      },
	      // document attributes
	      {
	        className: 'attribute',
	        begin: '^:.+?:',
	        end: '\\s',
	        excludeEnd: true,
	        relevance: 10
	      },
	      // block attributes
	      {
	        className: 'attribute',
	        begin: '^\\[.+?\\]$',
	        relevance: 0
	      },
	      // quoteblocks
	      {
	        className: 'blockquote',
	        begin: '^_{4,}\\n',
	        end: '\\n_{4,}$',
	        relevance: 10
	      },
	      // listing and literal blocks
	      {
	        className: 'code',
	        begin: '^[\\-\\.]{4,}\\n',
	        end: '\\n[\\-\\.]{4,}$',
	        relevance: 10
	      },
	      // passthrough blocks
	      {
	        begin: '^\\+{4,}\\n',
	        end: '\\n\\+{4,}$',
	        contains: [
	          {
	            begin: '<', end: '>',
	            subLanguage: 'xml',
	            relevance: 0
	          }
	        ],
	        relevance: 10
	      },
	      // lists (can only capture indicators)
	      {
	        className: 'bullet',
	        begin: '^(\\*+|\\-+|\\.+|[^\\n]+?::)\\s+'
	      },
	      // admonition
	      {
	        className: 'label',
	        begin: '^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+',
	        relevance: 10
	      },
	      // inline strong
	      {
	        className: 'strong',
	        // must not follow a word character or be followed by an asterisk or space
	        begin: '\\B\\*(?![\\*\\s])',
	        end: '(\\n{2}|\\*)',
	        // allow escaped asterisk followed by word char
	        contains: [
	          {
	            begin: '\\\\*\\w',
	            relevance: 0
	          }
	        ]
	      },
	      // inline emphasis
	      {
	        className: 'emphasis',
	        // must not follow a word character or be followed by a single quote or space
	        begin: '\\B\'(?![\'\\s])',
	        end: '(\\n{2}|\')',
	        // allow escaped single quote followed by word char
	        contains: [
	          {
	            begin: '\\\\\'\\w',
	            relevance: 0
	          }
	        ],
	        relevance: 0
	      },
	      // inline emphasis (alt)
	      {
	        className: 'emphasis',
	        // must not follow a word character or be followed by an underline or space
	        begin: '_(?![_\\s])',
	        end: '(\\n{2}|_)',
	        relevance: 0
	      },
	      // inline smart quotes
	      {
	        className: 'smartquote',
	        variants: [
	          {begin: "``.+?''"},
	          {begin: "`.+?'"}
	        ]
	      },
	      // inline code snippets (TODO should get same treatment as strong and emphasis)
	      {
	        className: 'code',
	        begin: '(`.+?`|\\+.+?\\+)',
	        relevance: 0
	      },
	      // indented literal block
	      {
	        className: 'code',
	        begin: '^[ \\t]',
	        end: '$',
	        relevance: 0
	      },
	      // horizontal rules
	      {
	        className: 'horizontal_rule',
	        begin: '^\'{3,}[ \\t]*$',
	        relevance: 10
	      },
	      // images and links
	      {
	        begin: '(link:)?(http|https|ftp|file|irc|image:?):\\S+\\[.*?\\]',
	        returnBegin: true,
	        contains: [
	          {
	            //className: 'macro',
	            begin: '(link|image:?):',
	            relevance: 0
	          },
	          {
	            className: 'link_url',
	            begin: '\\w',
	            end: '[^\\[]+',
	            relevance: 0
	          },
	          {
	            className: 'link_label',
	            begin: '\\[',
	            end: '\\]',
	            excludeBegin: true,
	            excludeEnd: true,
	            relevance: 0
	          }
	        ],
	        relevance: 10
	      }
	    ]
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = function (hljs) {
	  var KEYWORDS =
	    'false synchronized int abstract float private char boolean static null if const ' +
	    'for true while long throw strictfp finally protected import native final return void ' +
	    'enum else extends implements break transient new catch instanceof byte super volatile case ' +
	    'assert short package default double public try this switch continue throws privileged ' +
	    'aspectOf adviceexecution proceed cflowbelow cflow initialization preinitialization ' +
	    'staticinitialization withincode target within execution getWithinTypeName handler ' +
	    'thisJoinPoint thisJoinPointStaticPart thisEnclosingJoinPointStaticPart declare parents '+
	    'warning error soft precedence thisAspectInstance';
	  var SHORTKEYS = 'get set args call';
	  return {
	    keywords : KEYWORDS,
	    illegal : /<\/|#/,
	    contains : [
	      hljs.COMMENT(
	        '/\\*\\*',
	        '\\*/',
	        {
	          relevance : 0,
	          contains : [{
	            className : 'doctag',
	            begin : '@[A-Za-z]+'
	          }]
	        }
	      ),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className : 'aspect',
	        beginKeywords : 'aspect',
	        end : /[{;=]/,
	        excludeEnd : true,
	        illegal : /[:;"\[\]]/,
	        contains : [
	          {
	            beginKeywords : 'extends implements pertypewithin perthis pertarget percflowbelow percflow issingleton'
	          },
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	            begin : /\([^\)]*/,
	            end : /[)]+/,
	            keywords : KEYWORDS + ' ' + SHORTKEYS,
	            excludeEnd : false
	          }
	        ]
	      },
	      {
	        className : 'class',
	        beginKeywords : 'class interface',
	        end : /[{;=]/,
	        excludeEnd : true,
	        relevance: 0,
	        keywords : 'class interface',
	        illegal : /[:"\[\]]/,
	        contains : [
	          {beginKeywords : 'extends implements'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        // AspectJ Constructs
	        beginKeywords : 'pointcut after before around throwing returning',
	        end : /[)]/,
	        excludeEnd : false,
	        illegal : /["\[\]]/,
	        contains : [
	          {
	            begin : hljs.UNDERSCORE_IDENT_RE + '\\s*\\(',
	            returnBegin : true,
	            contains : [hljs.UNDERSCORE_TITLE_MODE]
	          }
	        ]
	      },
	      {
	        begin : /[:]/,
	        returnBegin : true,
	        end : /[{;]/,
	        relevance: 0,
	        excludeEnd : false,
	        keywords : KEYWORDS,
	        illegal : /["\[\]]/,
	        contains : [
	          {
	            begin : hljs.UNDERSCORE_IDENT_RE + '\\s*\\(',
	            keywords : KEYWORDS + ' ' + SHORTKEYS
	          },
	          hljs.QUOTE_STRING_MODE
	        ]
	      },
	      {
	        // this prevents 'new Name(...), or throw ...' from being recognized as a function definition
	        beginKeywords : 'new throw',
	        relevance : 0
	      },
	      {
	        // the function class is a bit different for AspectJ compared to the Java language
	        className : 'function',
	        begin : /\w+ +\w+(\.)?\w+\s*\([^\)]*\)\s*((throws)[\w\s,]+)?[\{;]/,
	        returnBegin : true,
	        end : /[{;=]/,
	        keywords : KEYWORDS,
	        excludeEnd : true,
	        contains : [
	          {
	            begin : hljs.UNDERSCORE_IDENT_RE + '\\s*\\(',
	            returnBegin : true,
	            relevance: 0,
	            contains : [hljs.UNDERSCORE_TITLE_MODE]
	          },
	          {
	            className : 'params',
	            begin : /\(/, end : /\)/,
	            relevance: 0,
	            keywords : KEYWORDS,
	            contains : [
	              hljs.APOS_STRING_MODE,
	              hljs.QUOTE_STRING_MODE,
	              hljs.C_NUMBER_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      },
	      hljs.C_NUMBER_MODE,
	      {
	        // annotation is also used in this language
	        className : 'annotation',
	        begin : '@[A-Za-z]+'
	      }
	    ]
	  };
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var BACKTICK_ESCAPE = {
	    className: 'escape',
	    begin: '`[\\s\\S]'
	  };
	  var COMMENTS = hljs.COMMENT(
	    ';',
	    '$',
	    {
	      relevance: 0
	    }
	  );
	  var BUILT_IN = [
	    {
	      className: 'built_in',
	      begin: 'A_[a-zA-Z0-9]+'
	    },
	    {
	      className: 'built_in',
	      beginKeywords: 'ComSpec Clipboard ClipboardAll ErrorLevel'
	    }
	  ];

	  return {
	    case_insensitive: true,
	    keywords: {
	      keyword: 'Break Continue Else Gosub If Loop Return While',
	      literal: 'A true false NOT AND OR'
	    },
	    contains: BUILT_IN.concat([
	      BACKTICK_ESCAPE,
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {contains: [BACKTICK_ESCAPE]}),
	      COMMENTS,
	      {
	        className: 'number',
	        begin: hljs.NUMBER_RE,
	        relevance: 0
	      },
	      {
	        className: 'var_expand', // FIXME
	        begin: '%', end: '%',
	        illegal: '\\n',
	        contains: [BACKTICK_ESCAPE]
	      },
	      {
	        className: 'label',
	        contains: [BACKTICK_ESCAPE],
	        variants: [
	          {begin: '^[^\\n";]+::(?!=)'},
	          {begin: '^[^\\n";]+:(?!=)', relevance: 0} // zero relevance as it catches a lot of things
	                                                    // followed by a single ':' in many languages
	        ]
	      },
	      {
	        // consecutive commas, not for highlighting but just for relevance
	        begin: ',\\s*,',
	        relevance: 10
	      }
	    ])
	  }
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	    var KEYWORDS = 'ByRef Case Const ContinueCase ContinueLoop ' +
	        'Default Dim Do Else ElseIf EndFunc EndIf EndSelect ' +
	        'EndSwitch EndWith Enum Exit ExitLoop For Func ' +
	        'Global If In Local Next ReDim Return Select Static ' +
	        'Step Switch Then To Until Volatile WEnd While With',

	        LITERAL = 'True False And Null Not Or',

	        BUILT_IN = 'Abs ACos AdlibRegister AdlibUnRegister Asc AscW ASin ' +
	        'Assign ATan AutoItSetOption AutoItWinGetTitle ' +
	        'AutoItWinSetTitle Beep Binary BinaryLen BinaryMid ' +
	        'BinaryToString BitAND BitNOT BitOR BitRotate BitShift ' +
	        'BitXOR BlockInput Break Call CDTray Ceiling Chr ' +
	        'ChrW ClipGet ClipPut ConsoleRead ConsoleWrite ' +
	        'ConsoleWriteError ControlClick ControlCommand ' +
	        'ControlDisable ControlEnable ControlFocus ControlGetFocus ' +
	        'ControlGetHandle ControlGetPos ControlGetText ControlHide ' +
	        'ControlListView ControlMove ControlSend ControlSetText ' +
	        'ControlShow ControlTreeView Cos Dec DirCopy DirCreate ' +
	        'DirGetSize DirMove DirRemove DllCall DllCallAddress ' +
	        'DllCallbackFree DllCallbackGetPtr DllCallbackRegister ' +
	        'DllClose DllOpen DllStructCreate DllStructGetData ' +
	        'DllStructGetPtr DllStructGetSize DllStructSetData ' +
	        'DriveGetDrive DriveGetFileSystem DriveGetLabel ' +
	        'DriveGetSerial DriveGetType DriveMapAdd DriveMapDel ' +
	        'DriveMapGet DriveSetLabel DriveSpaceFree DriveSpaceTotal ' +
	        'DriveStatus EnvGet EnvSet EnvUpdate Eval Execute Exp ' +
	        'FileChangeDir FileClose FileCopy FileCreateNTFSLink ' +
	        'FileCreateShortcut FileDelete FileExists FileFindFirstFile ' +
	        'FileFindNextFile FileFlush FileGetAttrib FileGetEncoding ' +
	        'FileGetLongName FileGetPos FileGetShortcut FileGetShortName ' +
	        'FileGetSize FileGetTime FileGetVersion FileInstall ' +
	        'FileMove FileOpen FileOpenDialog FileRead FileReadLine ' +
	        'FileReadToArray FileRecycle FileRecycleEmpty FileSaveDialog ' +
	        'FileSelectFolder FileSetAttrib FileSetEnd FileSetPos ' +
	        'FileSetTime FileWrite FileWriteLine Floor FtpSetProxy ' +
	        'FuncName GUICreate GUICtrlCreateAvi GUICtrlCreateButton ' +
	        'GUICtrlCreateCheckbox GUICtrlCreateCombo ' +
	        'GUICtrlCreateContextMenu GUICtrlCreateDate GUICtrlCreateDummy ' +
	        'GUICtrlCreateEdit GUICtrlCreateGraphic GUICtrlCreateGroup ' +
	        'GUICtrlCreateIcon GUICtrlCreateInput GUICtrlCreateLabel ' +
	        'GUICtrlCreateList GUICtrlCreateListView ' +
	        'GUICtrlCreateListViewItem GUICtrlCreateMenu ' +
	        'GUICtrlCreateMenuItem GUICtrlCreateMonthCal GUICtrlCreateObj ' +
	        'GUICtrlCreatePic GUICtrlCreateProgress GUICtrlCreateRadio ' +
	        'GUICtrlCreateSlider GUICtrlCreateTab GUICtrlCreateTabItem ' +
	        'GUICtrlCreateTreeView GUICtrlCreateTreeViewItem ' +
	        'GUICtrlCreateUpdown GUICtrlDelete GUICtrlGetHandle ' +
	        'GUICtrlGetState GUICtrlRead GUICtrlRecvMsg ' +
	        'GUICtrlRegisterListViewSort GUICtrlSendMsg GUICtrlSendToDummy ' +
	        'GUICtrlSetBkColor GUICtrlSetColor GUICtrlSetCursor ' +
	        'GUICtrlSetData GUICtrlSetDefBkColor GUICtrlSetDefColor ' +
	        'GUICtrlSetFont GUICtrlSetGraphic GUICtrlSetImage ' +
	        'GUICtrlSetLimit GUICtrlSetOnEvent GUICtrlSetPos ' +
	        'GUICtrlSetResizing GUICtrlSetState GUICtrlSetStyle ' +
	        'GUICtrlSetTip GUIDelete GUIGetCursorInfo GUIGetMsg ' +
	        'GUIGetStyle GUIRegisterMsg GUISetAccelerators GUISetBkColor ' +
	        'GUISetCoord GUISetCursor GUISetFont GUISetHelp GUISetIcon ' +
	        'GUISetOnEvent GUISetState GUISetStyle GUIStartGroup ' +
	        'GUISwitch Hex HotKeySet HttpSetProxy HttpSetUserAgent ' +
	        'HWnd InetClose InetGet InetGetInfo InetGetSize InetRead ' +
	        'IniDelete IniRead IniReadSection IniReadSectionNames ' +
	        'IniRenameSection IniWrite IniWriteSection InputBox Int ' +
	        'IsAdmin IsArray IsBinary IsBool IsDeclared IsDllStruct ' +
	        'IsFloat IsFunc IsHWnd IsInt IsKeyword IsNumber IsObj ' +
	        'IsPtr IsString Log MemGetStats Mod MouseClick ' +
	        'MouseClickDrag MouseDown MouseGetCursor MouseGetPos ' +
	        'MouseMove MouseUp MouseWheel MsgBox Number ObjCreate ' +
	        'ObjCreateInterface ObjEvent ObjGet ObjName ' +
	        'OnAutoItExitRegister OnAutoItExitUnRegister Opt Ping ' +
	        'PixelChecksum PixelGetColor PixelSearch ProcessClose ' +
	        'ProcessExists ProcessGetStats ProcessList ' +
	        'ProcessSetPriority ProcessWait ProcessWaitClose ProgressOff ' +
	        'ProgressOn ProgressSet Ptr Random RegDelete RegEnumKey ' +
	        'RegEnumVal RegRead RegWrite Round Run RunAs RunAsWait ' +
	        'RunWait Send SendKeepActive SetError SetExtended ' +
	        'ShellExecute ShellExecuteWait Shutdown Sin Sleep ' +
	        'SoundPlay SoundSetWaveVolume SplashImageOn SplashOff ' +
	        'SplashTextOn Sqrt SRandom StatusbarGetText StderrRead ' +
	        'StdinWrite StdioClose StdoutRead String StringAddCR ' +
	        'StringCompare StringFormat StringFromASCIIArray StringInStr ' +
	        'StringIsAlNum StringIsAlpha StringIsASCII StringIsDigit ' +
	        'StringIsFloat StringIsInt StringIsLower StringIsSpace ' +
	        'StringIsUpper StringIsXDigit StringLeft StringLen ' +
	        'StringLower StringMid StringRegExp StringRegExpReplace ' +
	        'StringReplace StringReverse StringRight StringSplit ' +
	        'StringStripCR StringStripWS StringToASCIIArray ' +
	        'StringToBinary StringTrimLeft StringTrimRight StringUpper ' +
	        'Tan TCPAccept TCPCloseSocket TCPConnect TCPListen ' +
	        'TCPNameToIP TCPRecv TCPSend TCPShutdown TCPStartup ' +
	        'TimerDiff TimerInit ToolTip TrayCreateItem TrayCreateMenu ' +
	        'TrayGetMsg TrayItemDelete TrayItemGetHandle ' +
	        'TrayItemGetState TrayItemGetText TrayItemSetOnEvent ' +
	        'TrayItemSetState TrayItemSetText TraySetClick TraySetIcon ' +
	        'TraySetOnEvent TraySetPauseIcon TraySetState TraySetToolTip ' +
	        'TrayTip UBound UDPBind UDPCloseSocket UDPOpen UDPRecv ' +
	        'UDPSend UDPShutdown UDPStartup VarGetType WinActivate ' +
	        'WinActive WinClose WinExists WinFlash WinGetCaretPos ' +
	        'WinGetClassList WinGetClientSize WinGetHandle WinGetPos ' +
	        'WinGetProcess WinGetState WinGetText WinGetTitle WinKill ' +
	        'WinList WinMenuSelectItem WinMinimizeAll WinMinimizeAllUndo ' +
	        'WinMove WinSetOnTop WinSetState WinSetTitle WinSetTrans ' +
	        'WinWait WinWaitActive WinWaitClose WinWaitNotActive ' +
	        'Array1DToHistogram ArrayAdd ArrayBinarySearch ' +
	        'ArrayColDelete ArrayColInsert ArrayCombinations ' +
	        'ArrayConcatenate ArrayDelete ArrayDisplay ArrayExtract ' +
	        'ArrayFindAll ArrayInsert ArrayMax ArrayMaxIndex ArrayMin ' +
	        'ArrayMinIndex ArrayPermute ArrayPop ArrayPush ' +
	        'ArrayReverse ArraySearch ArrayShuffle ArraySort ArraySwap ' +
	        'ArrayToClip ArrayToString ArrayTranspose ArrayTrim ' +
	        'ArrayUnique Assert ChooseColor ChooseFont ' +
	        'ClipBoard_ChangeChain ClipBoard_Close ClipBoard_CountFormats ' +
	        'ClipBoard_Empty ClipBoard_EnumFormats ClipBoard_FormatStr ' +
	        'ClipBoard_GetData ClipBoard_GetDataEx ClipBoard_GetFormatName ' +
	        'ClipBoard_GetOpenWindow ClipBoard_GetOwner ' +
	        'ClipBoard_GetPriorityFormat ClipBoard_GetSequenceNumber ' +
	        'ClipBoard_GetViewer ClipBoard_IsFormatAvailable ' +
	        'ClipBoard_Open ClipBoard_RegisterFormat ClipBoard_SetData ' +
	        'ClipBoard_SetDataEx ClipBoard_SetViewer ClipPutFile ' +
	        'ColorConvertHSLtoRGB ColorConvertRGBtoHSL ColorGetBlue ' +
	        'ColorGetCOLORREF ColorGetGreen ColorGetRed ColorGetRGB ' +
	        'ColorSetCOLORREF ColorSetRGB Crypt_DecryptData ' +
	        'Crypt_DecryptFile Crypt_DeriveKey Crypt_DestroyKey ' +
	        'Crypt_EncryptData Crypt_EncryptFile Crypt_GenRandom ' +
	        'Crypt_HashData Crypt_HashFile Crypt_Shutdown Crypt_Startup ' +
	        'DateAdd DateDayOfWeek DateDaysInMonth DateDiff ' +
	        'DateIsLeapYear DateIsValid DateTimeFormat DateTimeSplit ' +
	        'DateToDayOfWeek DateToDayOfWeekISO DateToDayValue ' +
	        'DateToMonth Date_Time_CompareFileTime ' +
	        'Date_Time_DOSDateTimeToArray Date_Time_DOSDateTimeToFileTime ' +
	        'Date_Time_DOSDateTimeToStr Date_Time_DOSDateToArray ' +
	        'Date_Time_DOSDateToStr Date_Time_DOSTimeToArray ' +
	        'Date_Time_DOSTimeToStr Date_Time_EncodeFileTime ' +
	        'Date_Time_EncodeSystemTime Date_Time_FileTimeToArray ' +
	        'Date_Time_FileTimeToDOSDateTime ' +
	        'Date_Time_FileTimeToLocalFileTime Date_Time_FileTimeToStr ' +
	        'Date_Time_FileTimeToSystemTime Date_Time_GetFileTime ' +
	        'Date_Time_GetLocalTime Date_Time_GetSystemTime ' +
	        'Date_Time_GetSystemTimeAdjustment ' +
	        'Date_Time_GetSystemTimeAsFileTime Date_Time_GetSystemTimes ' +
	        'Date_Time_GetTickCount Date_Time_GetTimeZoneInformation ' +
	        'Date_Time_LocalFileTimeToFileTime Date_Time_SetFileTime ' +
	        'Date_Time_SetLocalTime Date_Time_SetSystemTime ' +
	        'Date_Time_SetSystemTimeAdjustment ' +
	        'Date_Time_SetTimeZoneInformation Date_Time_SystemTimeToArray ' +
	        'Date_Time_SystemTimeToDateStr Date_Time_SystemTimeToDateTimeStr ' +
	        'Date_Time_SystemTimeToFileTime Date_Time_SystemTimeToTimeStr ' +
	        'Date_Time_SystemTimeToTzSpecificLocalTime ' +
	        'Date_Time_TzSpecificLocalTimeToSystemTime DayValueToDate ' +
	        'DebugBugReportEnv DebugCOMError DebugOut DebugReport ' +
	        'DebugReportEx DebugReportVar DebugSetup Degree ' +
	        'EventLog__Backup EventLog__Clear EventLog__Close ' +
	        'EventLog__Count EventLog__DeregisterSource EventLog__Full ' +
	        'EventLog__Notify EventLog__Oldest EventLog__Open ' +
	        'EventLog__OpenBackup EventLog__Read EventLog__RegisterSource ' +
	        'EventLog__Report Excel_BookAttach Excel_BookClose ' +
	        'Excel_BookList Excel_BookNew Excel_BookOpen ' +
	        'Excel_BookOpenText Excel_BookSave Excel_BookSaveAs ' +
	        'Excel_Close Excel_ColumnToLetter Excel_ColumnToNumber ' +
	        'Excel_ConvertFormula Excel_Export Excel_FilterGet ' +
	        'Excel_FilterSet Excel_Open Excel_PictureAdd Excel_Print ' +
	        'Excel_RangeCopyPaste Excel_RangeDelete Excel_RangeFind ' +
	        'Excel_RangeInsert Excel_RangeLinkAddRemove Excel_RangeRead ' +
	        'Excel_RangeReplace Excel_RangeSort Excel_RangeValidate ' +
	        'Excel_RangeWrite Excel_SheetAdd Excel_SheetCopyMove ' +
	        'Excel_SheetDelete Excel_SheetList FileCountLines FileCreate ' +
	        'FileListToArray FileListToArrayRec FilePrint ' +
	        'FileReadToArray FileWriteFromArray FileWriteLog ' +
	        'FileWriteToLine FTP_Close FTP_Command FTP_Connect ' +
	        'FTP_DecodeInternetStatus FTP_DirCreate FTP_DirDelete ' +
	        'FTP_DirGetCurrent FTP_DirPutContents FTP_DirSetCurrent ' +
	        'FTP_FileClose FTP_FileDelete FTP_FileGet FTP_FileGetSize ' +
	        'FTP_FileOpen FTP_FilePut FTP_FileRead FTP_FileRename ' +
	        'FTP_FileTimeLoHiToStr FTP_FindFileClose FTP_FindFileFirst ' +
	        'FTP_FindFileNext FTP_GetLastResponseInfo FTP_ListToArray ' +
	        'FTP_ListToArray2D FTP_ListToArrayEx FTP_Open ' +
	        'FTP_ProgressDownload FTP_ProgressUpload FTP_SetStatusCallback ' +
	        'GDIPlus_ArrowCapCreate GDIPlus_ArrowCapDispose ' +
	        'GDIPlus_ArrowCapGetFillState GDIPlus_ArrowCapGetHeight ' +
	        'GDIPlus_ArrowCapGetMiddleInset GDIPlus_ArrowCapGetWidth ' +
	        'GDIPlus_ArrowCapSetFillState GDIPlus_ArrowCapSetHeight ' +
	        'GDIPlus_ArrowCapSetMiddleInset GDIPlus_ArrowCapSetWidth ' +
	        'GDIPlus_BitmapApplyEffect GDIPlus_BitmapApplyEffectEx ' +
	        'GDIPlus_BitmapCloneArea GDIPlus_BitmapConvertFormat ' +
	        'GDIPlus_BitmapCreateApplyEffect ' +
	        'GDIPlus_BitmapCreateApplyEffectEx ' +
	        'GDIPlus_BitmapCreateDIBFromBitmap GDIPlus_BitmapCreateFromFile ' +
	        'GDIPlus_BitmapCreateFromGraphics ' +
	        'GDIPlus_BitmapCreateFromHBITMAP GDIPlus_BitmapCreateFromHICON ' +
	        'GDIPlus_BitmapCreateFromHICON32 GDIPlus_BitmapCreateFromMemory ' +
	        'GDIPlus_BitmapCreateFromResource GDIPlus_BitmapCreateFromScan0 ' +
	        'GDIPlus_BitmapCreateFromStream ' +
	        'GDIPlus_BitmapCreateHBITMAPFromBitmap GDIPlus_BitmapDispose ' +
	        'GDIPlus_BitmapGetHistogram GDIPlus_BitmapGetHistogramEx ' +
	        'GDIPlus_BitmapGetHistogramSize GDIPlus_BitmapGetPixel ' +
	        'GDIPlus_BitmapLockBits GDIPlus_BitmapSetPixel ' +
	        'GDIPlus_BitmapUnlockBits GDIPlus_BrushClone ' +
	        'GDIPlus_BrushCreateSolid GDIPlus_BrushDispose ' +
	        'GDIPlus_BrushGetSolidColor GDIPlus_BrushGetType ' +
	        'GDIPlus_BrushSetSolidColor GDIPlus_ColorMatrixCreate ' +
	        'GDIPlus_ColorMatrixCreateGrayScale ' +
	        'GDIPlus_ColorMatrixCreateNegative ' +
	        'GDIPlus_ColorMatrixCreateSaturation ' +
	        'GDIPlus_ColorMatrixCreateScale ' +
	        'GDIPlus_ColorMatrixCreateTranslate GDIPlus_CustomLineCapClone ' +
	        'GDIPlus_CustomLineCapCreate GDIPlus_CustomLineCapDispose ' +
	        'GDIPlus_CustomLineCapGetStrokeCaps ' +
	        'GDIPlus_CustomLineCapSetStrokeCaps GDIPlus_Decoders ' +
	        'GDIPlus_DecodersGetCount GDIPlus_DecodersGetSize ' +
	        'GDIPlus_DrawImageFX GDIPlus_DrawImageFXEx ' +
	        'GDIPlus_DrawImagePoints GDIPlus_EffectCreate ' +
	        'GDIPlus_EffectCreateBlur GDIPlus_EffectCreateBrightnessContrast ' +
	        'GDIPlus_EffectCreateColorBalance GDIPlus_EffectCreateColorCurve ' +
	        'GDIPlus_EffectCreateColorLUT GDIPlus_EffectCreateColorMatrix ' +
	        'GDIPlus_EffectCreateHueSaturationLightness ' +
	        'GDIPlus_EffectCreateLevels GDIPlus_EffectCreateRedEyeCorrection ' +
	        'GDIPlus_EffectCreateSharpen GDIPlus_EffectCreateTint ' +
	        'GDIPlus_EffectDispose GDIPlus_EffectGetParameters ' +
	        'GDIPlus_EffectSetParameters GDIPlus_Encoders ' +
	        'GDIPlus_EncodersGetCLSID GDIPlus_EncodersGetCount ' +
	        'GDIPlus_EncodersGetParamList GDIPlus_EncodersGetParamListSize ' +
	        'GDIPlus_EncodersGetSize GDIPlus_FontCreate ' +
	        'GDIPlus_FontDispose GDIPlus_FontFamilyCreate ' +
	        'GDIPlus_FontFamilyCreateFromCollection ' +
	        'GDIPlus_FontFamilyDispose GDIPlus_FontFamilyGetCellAscent ' +
	        'GDIPlus_FontFamilyGetCellDescent GDIPlus_FontFamilyGetEmHeight ' +
	        'GDIPlus_FontFamilyGetLineSpacing GDIPlus_FontGetHeight ' +
	        'GDIPlus_FontPrivateAddFont GDIPlus_FontPrivateAddMemoryFont ' +
	        'GDIPlus_FontPrivateCollectionDispose ' +
	        'GDIPlus_FontPrivateCreateCollection GDIPlus_GraphicsClear ' +
	        'GDIPlus_GraphicsCreateFromHDC GDIPlus_GraphicsCreateFromHWND ' +
	        'GDIPlus_GraphicsDispose GDIPlus_GraphicsDrawArc ' +
	        'GDIPlus_GraphicsDrawBezier GDIPlus_GraphicsDrawClosedCurve ' +
	        'GDIPlus_GraphicsDrawClosedCurve2 GDIPlus_GraphicsDrawCurve ' +
	        'GDIPlus_GraphicsDrawCurve2 GDIPlus_GraphicsDrawEllipse ' +
	        'GDIPlus_GraphicsDrawImage GDIPlus_GraphicsDrawImagePointsRect ' +
	        'GDIPlus_GraphicsDrawImageRect GDIPlus_GraphicsDrawImageRectRect ' +
	        'GDIPlus_GraphicsDrawLine GDIPlus_GraphicsDrawPath ' +
	        'GDIPlus_GraphicsDrawPie GDIPlus_GraphicsDrawPolygon ' +
	        'GDIPlus_GraphicsDrawRect GDIPlus_GraphicsDrawString ' +
	        'GDIPlus_GraphicsDrawStringEx GDIPlus_GraphicsFillClosedCurve ' +
	        'GDIPlus_GraphicsFillClosedCurve2 GDIPlus_GraphicsFillEllipse ' +
	        'GDIPlus_GraphicsFillPath GDIPlus_GraphicsFillPie ' +
	        'GDIPlus_GraphicsFillPolygon GDIPlus_GraphicsFillRect ' +
	        'GDIPlus_GraphicsFillRegion GDIPlus_GraphicsGetCompositingMode ' +
	        'GDIPlus_GraphicsGetCompositingQuality GDIPlus_GraphicsGetDC ' +
	        'GDIPlus_GraphicsGetInterpolationMode ' +
	        'GDIPlus_GraphicsGetSmoothingMode GDIPlus_GraphicsGetTransform ' +
	        'GDIPlus_GraphicsMeasureCharacterRanges ' +
	        'GDIPlus_GraphicsMeasureString GDIPlus_GraphicsReleaseDC ' +
	        'GDIPlus_GraphicsResetClip GDIPlus_GraphicsResetTransform ' +
	        'GDIPlus_GraphicsRestore GDIPlus_GraphicsRotateTransform ' +
	        'GDIPlus_GraphicsSave GDIPlus_GraphicsScaleTransform ' +
	        'GDIPlus_GraphicsSetClipPath GDIPlus_GraphicsSetClipRect ' +
	        'GDIPlus_GraphicsSetClipRegion ' +
	        'GDIPlus_GraphicsSetCompositingMode ' +
	        'GDIPlus_GraphicsSetCompositingQuality ' +
	        'GDIPlus_GraphicsSetInterpolationMode ' +
	        'GDIPlus_GraphicsSetPixelOffsetMode ' +
	        'GDIPlus_GraphicsSetSmoothingMode ' +
	        'GDIPlus_GraphicsSetTextRenderingHint ' +
	        'GDIPlus_GraphicsSetTransform GDIPlus_GraphicsTransformPoints ' +
	        'GDIPlus_GraphicsTranslateTransform GDIPlus_HatchBrushCreate ' +
	        'GDIPlus_HICONCreateFromBitmap GDIPlus_ImageAttributesCreate ' +
	        'GDIPlus_ImageAttributesDispose ' +
	        'GDIPlus_ImageAttributesSetColorKeys ' +
	        'GDIPlus_ImageAttributesSetColorMatrix GDIPlus_ImageDispose ' +
	        'GDIPlus_ImageGetDimension GDIPlus_ImageGetFlags ' +
	        'GDIPlus_ImageGetGraphicsContext GDIPlus_ImageGetHeight ' +
	        'GDIPlus_ImageGetHorizontalResolution ' +
	        'GDIPlus_ImageGetPixelFormat GDIPlus_ImageGetRawFormat ' +
	        'GDIPlus_ImageGetThumbnail GDIPlus_ImageGetType ' +
	        'GDIPlus_ImageGetVerticalResolution GDIPlus_ImageGetWidth ' +
	        'GDIPlus_ImageLoadFromFile GDIPlus_ImageLoadFromStream ' +
	        'GDIPlus_ImageResize GDIPlus_ImageRotateFlip ' +
	        'GDIPlus_ImageSaveToFile GDIPlus_ImageSaveToFileEx ' +
	        'GDIPlus_ImageSaveToStream GDIPlus_ImageScale ' +
	        'GDIPlus_LineBrushCreate GDIPlus_LineBrushCreateFromRect ' +
	        'GDIPlus_LineBrushCreateFromRectWithAngle ' +
	        'GDIPlus_LineBrushGetColors GDIPlus_LineBrushGetRect ' +
	        'GDIPlus_LineBrushMultiplyTransform ' +
	        'GDIPlus_LineBrushResetTransform GDIPlus_LineBrushSetBlend ' +
	        'GDIPlus_LineBrushSetColors GDIPlus_LineBrushSetGammaCorrection ' +
	        'GDIPlus_LineBrushSetLinearBlend GDIPlus_LineBrushSetPresetBlend ' +
	        'GDIPlus_LineBrushSetSigmaBlend GDIPlus_LineBrushSetTransform ' +
	        'GDIPlus_MatrixClone GDIPlus_MatrixCreate ' +
	        'GDIPlus_MatrixDispose GDIPlus_MatrixGetElements ' +
	        'GDIPlus_MatrixInvert GDIPlus_MatrixMultiply ' +
	        'GDIPlus_MatrixRotate GDIPlus_MatrixScale ' +
	        'GDIPlus_MatrixSetElements GDIPlus_MatrixShear ' +
	        'GDIPlus_MatrixTransformPoints GDIPlus_MatrixTranslate ' +
	        'GDIPlus_PaletteInitialize GDIPlus_ParamAdd GDIPlus_ParamInit ' +
	        'GDIPlus_ParamSize GDIPlus_PathAddArc GDIPlus_PathAddBezier ' +
	        'GDIPlus_PathAddClosedCurve GDIPlus_PathAddClosedCurve2 ' +
	        'GDIPlus_PathAddCurve GDIPlus_PathAddCurve2 ' +
	        'GDIPlus_PathAddCurve3 GDIPlus_PathAddEllipse ' +
	        'GDIPlus_PathAddLine GDIPlus_PathAddLine2 GDIPlus_PathAddPath ' +
	        'GDIPlus_PathAddPie GDIPlus_PathAddPolygon ' +
	        'GDIPlus_PathAddRectangle GDIPlus_PathAddString ' +
	        'GDIPlus_PathBrushCreate GDIPlus_PathBrushCreateFromPath ' +
	        'GDIPlus_PathBrushGetCenterPoint GDIPlus_PathBrushGetFocusScales ' +
	        'GDIPlus_PathBrushGetPointCount GDIPlus_PathBrushGetRect ' +
	        'GDIPlus_PathBrushGetWrapMode GDIPlus_PathBrushMultiplyTransform ' +
	        'GDIPlus_PathBrushResetTransform GDIPlus_PathBrushSetBlend ' +
	        'GDIPlus_PathBrushSetCenterColor GDIPlus_PathBrushSetCenterPoint ' +
	        'GDIPlus_PathBrushSetFocusScales ' +
	        'GDIPlus_PathBrushSetGammaCorrection ' +
	        'GDIPlus_PathBrushSetLinearBlend GDIPlus_PathBrushSetPresetBlend ' +
	        'GDIPlus_PathBrushSetSigmaBlend ' +
	        'GDIPlus_PathBrushSetSurroundColor ' +
	        'GDIPlus_PathBrushSetSurroundColorsWithCount ' +
	        'GDIPlus_PathBrushSetTransform GDIPlus_PathBrushSetWrapMode ' +
	        'GDIPlus_PathClone GDIPlus_PathCloseFigure GDIPlus_PathCreate ' +
	        'GDIPlus_PathCreate2 GDIPlus_PathDispose GDIPlus_PathFlatten ' +
	        'GDIPlus_PathGetData GDIPlus_PathGetFillMode ' +
	        'GDIPlus_PathGetLastPoint GDIPlus_PathGetPointCount ' +
	        'GDIPlus_PathGetPoints GDIPlus_PathGetWorldBounds ' +
	        'GDIPlus_PathIsOutlineVisiblePoint GDIPlus_PathIsVisiblePoint ' +
	        'GDIPlus_PathIterCreate GDIPlus_PathIterDispose ' +
	        'GDIPlus_PathIterGetSubpathCount GDIPlus_PathIterNextMarkerPath ' +
	        'GDIPlus_PathIterNextSubpathPath GDIPlus_PathIterRewind ' +
	        'GDIPlus_PathReset GDIPlus_PathReverse GDIPlus_PathSetFillMode ' +
	        'GDIPlus_PathSetMarker GDIPlus_PathStartFigure ' +
	        'GDIPlus_PathTransform GDIPlus_PathWarp GDIPlus_PathWiden ' +
	        'GDIPlus_PathWindingModeOutline GDIPlus_PenCreate ' +
	        'GDIPlus_PenCreate2 GDIPlus_PenDispose GDIPlus_PenGetAlignment ' +
	        'GDIPlus_PenGetColor GDIPlus_PenGetCustomEndCap ' +
	        'GDIPlus_PenGetDashCap GDIPlus_PenGetDashStyle ' +
	        'GDIPlus_PenGetEndCap GDIPlus_PenGetMiterLimit ' +
	        'GDIPlus_PenGetWidth GDIPlus_PenSetAlignment ' +
	        'GDIPlus_PenSetColor GDIPlus_PenSetCustomEndCap ' +
	        'GDIPlus_PenSetDashCap GDIPlus_PenSetDashStyle ' +
	        'GDIPlus_PenSetEndCap GDIPlus_PenSetLineCap ' +
	        'GDIPlus_PenSetLineJoin GDIPlus_PenSetMiterLimit ' +
	        'GDIPlus_PenSetStartCap GDIPlus_PenSetWidth ' +
	        'GDIPlus_RectFCreate GDIPlus_RegionClone ' +
	        'GDIPlus_RegionCombinePath GDIPlus_RegionCombineRect ' +
	        'GDIPlus_RegionCombineRegion GDIPlus_RegionCreate ' +
	        'GDIPlus_RegionCreateFromPath GDIPlus_RegionCreateFromRect ' +
	        'GDIPlus_RegionDispose GDIPlus_RegionGetBounds ' +
	        'GDIPlus_RegionGetHRgn GDIPlus_RegionTransform ' +
	        'GDIPlus_RegionTranslate GDIPlus_Shutdown GDIPlus_Startup ' +
	        'GDIPlus_StringFormatCreate GDIPlus_StringFormatDispose ' +
	        'GDIPlus_StringFormatGetMeasurableCharacterRangeCount ' +
	        'GDIPlus_StringFormatSetAlign GDIPlus_StringFormatSetLineAlign ' +
	        'GDIPlus_StringFormatSetMeasurableCharacterRanges ' +
	        'GDIPlus_TextureCreate GDIPlus_TextureCreate2 ' +
	        'GDIPlus_TextureCreateIA GetIP GUICtrlAVI_Close ' +
	        'GUICtrlAVI_Create GUICtrlAVI_Destroy GUICtrlAVI_IsPlaying ' +
	        'GUICtrlAVI_Open GUICtrlAVI_OpenEx GUICtrlAVI_Play ' +
	        'GUICtrlAVI_Seek GUICtrlAVI_Show GUICtrlAVI_Stop ' +
	        'GUICtrlButton_Click GUICtrlButton_Create ' +
	        'GUICtrlButton_Destroy GUICtrlButton_Enable ' +
	        'GUICtrlButton_GetCheck GUICtrlButton_GetFocus ' +
	        'GUICtrlButton_GetIdealSize GUICtrlButton_GetImage ' +
	        'GUICtrlButton_GetImageList GUICtrlButton_GetNote ' +
	        'GUICtrlButton_GetNoteLength GUICtrlButton_GetSplitInfo ' +
	        'GUICtrlButton_GetState GUICtrlButton_GetText ' +
	        'GUICtrlButton_GetTextMargin GUICtrlButton_SetCheck ' +
	        'GUICtrlButton_SetDontClick GUICtrlButton_SetFocus ' +
	        'GUICtrlButton_SetImage GUICtrlButton_SetImageList ' +
	        'GUICtrlButton_SetNote GUICtrlButton_SetShield ' +
	        'GUICtrlButton_SetSize GUICtrlButton_SetSplitInfo ' +
	        'GUICtrlButton_SetState GUICtrlButton_SetStyle ' +
	        'GUICtrlButton_SetText GUICtrlButton_SetTextMargin ' +
	        'GUICtrlButton_Show GUICtrlComboBoxEx_AddDir ' +
	        'GUICtrlComboBoxEx_AddString GUICtrlComboBoxEx_BeginUpdate ' +
	        'GUICtrlComboBoxEx_Create GUICtrlComboBoxEx_CreateSolidBitMap ' +
	        'GUICtrlComboBoxEx_DeleteString GUICtrlComboBoxEx_Destroy ' +
	        'GUICtrlComboBoxEx_EndUpdate GUICtrlComboBoxEx_FindStringExact ' +
	        'GUICtrlComboBoxEx_GetComboBoxInfo ' +
	        'GUICtrlComboBoxEx_GetComboControl GUICtrlComboBoxEx_GetCount ' +
	        'GUICtrlComboBoxEx_GetCurSel ' +
	        'GUICtrlComboBoxEx_GetDroppedControlRect ' +
	        'GUICtrlComboBoxEx_GetDroppedControlRectEx ' +
	        'GUICtrlComboBoxEx_GetDroppedState ' +
	        'GUICtrlComboBoxEx_GetDroppedWidth ' +
	        'GUICtrlComboBoxEx_GetEditControl GUICtrlComboBoxEx_GetEditSel ' +
	        'GUICtrlComboBoxEx_GetEditText ' +
	        'GUICtrlComboBoxEx_GetExtendedStyle ' +
	        'GUICtrlComboBoxEx_GetExtendedUI GUICtrlComboBoxEx_GetImageList ' +
	        'GUICtrlComboBoxEx_GetItem GUICtrlComboBoxEx_GetItemEx ' +
	        'GUICtrlComboBoxEx_GetItemHeight GUICtrlComboBoxEx_GetItemImage ' +
	        'GUICtrlComboBoxEx_GetItemIndent ' +
	        'GUICtrlComboBoxEx_GetItemOverlayImage ' +
	        'GUICtrlComboBoxEx_GetItemParam ' +
	        'GUICtrlComboBoxEx_GetItemSelectedImage ' +
	        'GUICtrlComboBoxEx_GetItemText GUICtrlComboBoxEx_GetItemTextLen ' +
	        'GUICtrlComboBoxEx_GetList GUICtrlComboBoxEx_GetListArray ' +
	        'GUICtrlComboBoxEx_GetLocale GUICtrlComboBoxEx_GetLocaleCountry ' +
	        'GUICtrlComboBoxEx_GetLocaleLang ' +
	        'GUICtrlComboBoxEx_GetLocalePrimLang ' +
	        'GUICtrlComboBoxEx_GetLocaleSubLang ' +
	        'GUICtrlComboBoxEx_GetMinVisible GUICtrlComboBoxEx_GetTopIndex ' +
	        'GUICtrlComboBoxEx_GetUnicode GUICtrlComboBoxEx_InitStorage ' +
	        'GUICtrlComboBoxEx_InsertString GUICtrlComboBoxEx_LimitText ' +
	        'GUICtrlComboBoxEx_ReplaceEditSel GUICtrlComboBoxEx_ResetContent ' +
	        'GUICtrlComboBoxEx_SetCurSel GUICtrlComboBoxEx_SetDroppedWidth ' +
	        'GUICtrlComboBoxEx_SetEditSel GUICtrlComboBoxEx_SetEditText ' +
	        'GUICtrlComboBoxEx_SetExtendedStyle ' +
	        'GUICtrlComboBoxEx_SetExtendedUI GUICtrlComboBoxEx_SetImageList ' +
	        'GUICtrlComboBoxEx_SetItem GUICtrlComboBoxEx_SetItemEx ' +
	        'GUICtrlComboBoxEx_SetItemHeight GUICtrlComboBoxEx_SetItemImage ' +
	        'GUICtrlComboBoxEx_SetItemIndent ' +
	        'GUICtrlComboBoxEx_SetItemOverlayImage ' +
	        'GUICtrlComboBoxEx_SetItemParam ' +
	        'GUICtrlComboBoxEx_SetItemSelectedImage ' +
	        'GUICtrlComboBoxEx_SetMinVisible GUICtrlComboBoxEx_SetTopIndex ' +
	        'GUICtrlComboBoxEx_SetUnicode GUICtrlComboBoxEx_ShowDropDown ' +
	        'GUICtrlComboBox_AddDir GUICtrlComboBox_AddString ' +
	        'GUICtrlComboBox_AutoComplete GUICtrlComboBox_BeginUpdate ' +
	        'GUICtrlComboBox_Create GUICtrlComboBox_DeleteString ' +
	        'GUICtrlComboBox_Destroy GUICtrlComboBox_EndUpdate ' +
	        'GUICtrlComboBox_FindString GUICtrlComboBox_FindStringExact ' +
	        'GUICtrlComboBox_GetComboBoxInfo GUICtrlComboBox_GetCount ' +
	        'GUICtrlComboBox_GetCueBanner GUICtrlComboBox_GetCurSel ' +
	        'GUICtrlComboBox_GetDroppedControlRect ' +
	        'GUICtrlComboBox_GetDroppedControlRectEx ' +
	        'GUICtrlComboBox_GetDroppedState GUICtrlComboBox_GetDroppedWidth ' +
	        'GUICtrlComboBox_GetEditSel GUICtrlComboBox_GetEditText ' +
	        'GUICtrlComboBox_GetExtendedUI ' +
	        'GUICtrlComboBox_GetHorizontalExtent ' +
	        'GUICtrlComboBox_GetItemHeight GUICtrlComboBox_GetLBText ' +
	        'GUICtrlComboBox_GetLBTextLen GUICtrlComboBox_GetList ' +
	        'GUICtrlComboBox_GetListArray GUICtrlComboBox_GetLocale ' +
	        'GUICtrlComboBox_GetLocaleCountry GUICtrlComboBox_GetLocaleLang ' +
	        'GUICtrlComboBox_GetLocalePrimLang ' +
	        'GUICtrlComboBox_GetLocaleSubLang GUICtrlComboBox_GetMinVisible ' +
	        'GUICtrlComboBox_GetTopIndex GUICtrlComboBox_InitStorage ' +
	        'GUICtrlComboBox_InsertString GUICtrlComboBox_LimitText ' +
	        'GUICtrlComboBox_ReplaceEditSel GUICtrlComboBox_ResetContent ' +
	        'GUICtrlComboBox_SelectString GUICtrlComboBox_SetCueBanner ' +
	        'GUICtrlComboBox_SetCurSel GUICtrlComboBox_SetDroppedWidth ' +
	        'GUICtrlComboBox_SetEditSel GUICtrlComboBox_SetEditText ' +
	        'GUICtrlComboBox_SetExtendedUI ' +
	        'GUICtrlComboBox_SetHorizontalExtent ' +
	        'GUICtrlComboBox_SetItemHeight GUICtrlComboBox_SetMinVisible ' +
	        'GUICtrlComboBox_SetTopIndex GUICtrlComboBox_ShowDropDown ' +
	        'GUICtrlDTP_Create GUICtrlDTP_Destroy GUICtrlDTP_GetMCColor ' +
	        'GUICtrlDTP_GetMCFont GUICtrlDTP_GetMonthCal ' +
	        'GUICtrlDTP_GetRange GUICtrlDTP_GetRangeEx ' +
	        'GUICtrlDTP_GetSystemTime GUICtrlDTP_GetSystemTimeEx ' +
	        'GUICtrlDTP_SetFormat GUICtrlDTP_SetMCColor ' +
	        'GUICtrlDTP_SetMCFont GUICtrlDTP_SetRange ' +
	        'GUICtrlDTP_SetRangeEx GUICtrlDTP_SetSystemTime ' +
	        'GUICtrlDTP_SetSystemTimeEx GUICtrlEdit_AppendText ' +
	        'GUICtrlEdit_BeginUpdate GUICtrlEdit_CanUndo ' +
	        'GUICtrlEdit_CharFromPos GUICtrlEdit_Create ' +
	        'GUICtrlEdit_Destroy GUICtrlEdit_EmptyUndoBuffer ' +
	        'GUICtrlEdit_EndUpdate GUICtrlEdit_Find GUICtrlEdit_FmtLines ' +
	        'GUICtrlEdit_GetCueBanner GUICtrlEdit_GetFirstVisibleLine ' +
	        'GUICtrlEdit_GetLimitText GUICtrlEdit_GetLine ' +
	        'GUICtrlEdit_GetLineCount GUICtrlEdit_GetMargins ' +
	        'GUICtrlEdit_GetModify GUICtrlEdit_GetPasswordChar ' +
	        'GUICtrlEdit_GetRECT GUICtrlEdit_GetRECTEx GUICtrlEdit_GetSel ' +
	        'GUICtrlEdit_GetText GUICtrlEdit_GetTextLen ' +
	        'GUICtrlEdit_HideBalloonTip GUICtrlEdit_InsertText ' +
	        'GUICtrlEdit_LineFromChar GUICtrlEdit_LineIndex ' +
	        'GUICtrlEdit_LineLength GUICtrlEdit_LineScroll ' +
	        'GUICtrlEdit_PosFromChar GUICtrlEdit_ReplaceSel ' +
	        'GUICtrlEdit_Scroll GUICtrlEdit_SetCueBanner ' +
	        'GUICtrlEdit_SetLimitText GUICtrlEdit_SetMargins ' +
	        'GUICtrlEdit_SetModify GUICtrlEdit_SetPasswordChar ' +
	        'GUICtrlEdit_SetReadOnly GUICtrlEdit_SetRECT ' +
	        'GUICtrlEdit_SetRECTEx GUICtrlEdit_SetRECTNP ' +
	        'GUICtrlEdit_SetRectNPEx GUICtrlEdit_SetSel ' +
	        'GUICtrlEdit_SetTabStops GUICtrlEdit_SetText ' +
	        'GUICtrlEdit_ShowBalloonTip GUICtrlEdit_Undo ' +
	        'GUICtrlHeader_AddItem GUICtrlHeader_ClearFilter ' +
	        'GUICtrlHeader_ClearFilterAll GUICtrlHeader_Create ' +
	        'GUICtrlHeader_CreateDragImage GUICtrlHeader_DeleteItem ' +
	        'GUICtrlHeader_Destroy GUICtrlHeader_EditFilter ' +
	        'GUICtrlHeader_GetBitmapMargin GUICtrlHeader_GetImageList ' +
	        'GUICtrlHeader_GetItem GUICtrlHeader_GetItemAlign ' +
	        'GUICtrlHeader_GetItemBitmap GUICtrlHeader_GetItemCount ' +
	        'GUICtrlHeader_GetItemDisplay GUICtrlHeader_GetItemFlags ' +
	        'GUICtrlHeader_GetItemFormat GUICtrlHeader_GetItemImage ' +
	        'GUICtrlHeader_GetItemOrder GUICtrlHeader_GetItemParam ' +
	        'GUICtrlHeader_GetItemRect GUICtrlHeader_GetItemRectEx ' +
	        'GUICtrlHeader_GetItemText GUICtrlHeader_GetItemWidth ' +
	        'GUICtrlHeader_GetOrderArray GUICtrlHeader_GetUnicodeFormat ' +
	        'GUICtrlHeader_HitTest GUICtrlHeader_InsertItem ' +
	        'GUICtrlHeader_Layout GUICtrlHeader_OrderToIndex ' +
	        'GUICtrlHeader_SetBitmapMargin ' +
	        'GUICtrlHeader_SetFilterChangeTimeout ' +
	        'GUICtrlHeader_SetHotDivider GUICtrlHeader_SetImageList ' +
	        'GUICtrlHeader_SetItem GUICtrlHeader_SetItemAlign ' +
	        'GUICtrlHeader_SetItemBitmap GUICtrlHeader_SetItemDisplay ' +
	        'GUICtrlHeader_SetItemFlags GUICtrlHeader_SetItemFormat ' +
	        'GUICtrlHeader_SetItemImage GUICtrlHeader_SetItemOrder ' +
	        'GUICtrlHeader_SetItemParam GUICtrlHeader_SetItemText ' +
	        'GUICtrlHeader_SetItemWidth GUICtrlHeader_SetOrderArray ' +
	        'GUICtrlHeader_SetUnicodeFormat GUICtrlIpAddress_ClearAddress ' +
	        'GUICtrlIpAddress_Create GUICtrlIpAddress_Destroy ' +
	        'GUICtrlIpAddress_Get GUICtrlIpAddress_GetArray ' +
	        'GUICtrlIpAddress_GetEx GUICtrlIpAddress_IsBlank ' +
	        'GUICtrlIpAddress_Set GUICtrlIpAddress_SetArray ' +
	        'GUICtrlIpAddress_SetEx GUICtrlIpAddress_SetFocus ' +
	        'GUICtrlIpAddress_SetFont GUICtrlIpAddress_SetRange ' +
	        'GUICtrlIpAddress_ShowHide GUICtrlListBox_AddFile ' +
	        'GUICtrlListBox_AddString GUICtrlListBox_BeginUpdate ' +
	        'GUICtrlListBox_ClickItem GUICtrlListBox_Create ' +
	        'GUICtrlListBox_DeleteString GUICtrlListBox_Destroy ' +
	        'GUICtrlListBox_Dir GUICtrlListBox_EndUpdate ' +
	        'GUICtrlListBox_FindInText GUICtrlListBox_FindString ' +
	        'GUICtrlListBox_GetAnchorIndex GUICtrlListBox_GetCaretIndex ' +
	        'GUICtrlListBox_GetCount GUICtrlListBox_GetCurSel ' +
	        'GUICtrlListBox_GetHorizontalExtent GUICtrlListBox_GetItemData ' +
	        'GUICtrlListBox_GetItemHeight GUICtrlListBox_GetItemRect ' +
	        'GUICtrlListBox_GetItemRectEx GUICtrlListBox_GetListBoxInfo ' +
	        'GUICtrlListBox_GetLocale GUICtrlListBox_GetLocaleCountry ' +
	        'GUICtrlListBox_GetLocaleLang GUICtrlListBox_GetLocalePrimLang ' +
	        'GUICtrlListBox_GetLocaleSubLang GUICtrlListBox_GetSel ' +
	        'GUICtrlListBox_GetSelCount GUICtrlListBox_GetSelItems ' +
	        'GUICtrlListBox_GetSelItemsText GUICtrlListBox_GetText ' +
	        'GUICtrlListBox_GetTextLen GUICtrlListBox_GetTopIndex ' +
	        'GUICtrlListBox_InitStorage GUICtrlListBox_InsertString ' +
	        'GUICtrlListBox_ItemFromPoint GUICtrlListBox_ReplaceString ' +
	        'GUICtrlListBox_ResetContent GUICtrlListBox_SelectString ' +
	        'GUICtrlListBox_SelItemRange GUICtrlListBox_SelItemRangeEx ' +
	        'GUICtrlListBox_SetAnchorIndex GUICtrlListBox_SetCaretIndex ' +
	        'GUICtrlListBox_SetColumnWidth GUICtrlListBox_SetCurSel ' +
	        'GUICtrlListBox_SetHorizontalExtent GUICtrlListBox_SetItemData ' +
	        'GUICtrlListBox_SetItemHeight GUICtrlListBox_SetLocale ' +
	        'GUICtrlListBox_SetSel GUICtrlListBox_SetTabStops ' +
	        'GUICtrlListBox_SetTopIndex GUICtrlListBox_Sort ' +
	        'GUICtrlListBox_SwapString GUICtrlListBox_UpdateHScroll ' +
	        'GUICtrlListView_AddArray GUICtrlListView_AddColumn ' +
	        'GUICtrlListView_AddItem GUICtrlListView_AddSubItem ' +
	        'GUICtrlListView_ApproximateViewHeight ' +
	        'GUICtrlListView_ApproximateViewRect ' +
	        'GUICtrlListView_ApproximateViewWidth GUICtrlListView_Arrange ' +
	        'GUICtrlListView_BeginUpdate GUICtrlListView_CancelEditLabel ' +
	        'GUICtrlListView_ClickItem GUICtrlListView_CopyItems ' +
	        'GUICtrlListView_Create GUICtrlListView_CreateDragImage ' +
	        'GUICtrlListView_CreateSolidBitMap ' +
	        'GUICtrlListView_DeleteAllItems GUICtrlListView_DeleteColumn ' +
	        'GUICtrlListView_DeleteItem GUICtrlListView_DeleteItemsSelected ' +
	        'GUICtrlListView_Destroy GUICtrlListView_DrawDragImage ' +
	        'GUICtrlListView_EditLabel GUICtrlListView_EnableGroupView ' +
	        'GUICtrlListView_EndUpdate GUICtrlListView_EnsureVisible ' +
	        'GUICtrlListView_FindInText GUICtrlListView_FindItem ' +
	        'GUICtrlListView_FindNearest GUICtrlListView_FindParam ' +
	        'GUICtrlListView_FindText GUICtrlListView_GetBkColor ' +
	        'GUICtrlListView_GetBkImage GUICtrlListView_GetCallbackMask ' +
	        'GUICtrlListView_GetColumn GUICtrlListView_GetColumnCount ' +
	        'GUICtrlListView_GetColumnOrder ' +
	        'GUICtrlListView_GetColumnOrderArray ' +
	        'GUICtrlListView_GetColumnWidth GUICtrlListView_GetCounterPage ' +
	        'GUICtrlListView_GetEditControl ' +
	        'GUICtrlListView_GetExtendedListViewStyle ' +
	        'GUICtrlListView_GetFocusedGroup GUICtrlListView_GetGroupCount ' +
	        'GUICtrlListView_GetGroupInfo ' +
	        'GUICtrlListView_GetGroupInfoByIndex ' +
	        'GUICtrlListView_GetGroupRect ' +
	        'GUICtrlListView_GetGroupViewEnabled GUICtrlListView_GetHeader ' +
	        'GUICtrlListView_GetHotCursor GUICtrlListView_GetHotItem ' +
	        'GUICtrlListView_GetHoverTime GUICtrlListView_GetImageList ' +
	        'GUICtrlListView_GetISearchString GUICtrlListView_GetItem ' +
	        'GUICtrlListView_GetItemChecked GUICtrlListView_GetItemCount ' +
	        'GUICtrlListView_GetItemCut GUICtrlListView_GetItemDropHilited ' +
	        'GUICtrlListView_GetItemEx GUICtrlListView_GetItemFocused ' +
	        'GUICtrlListView_GetItemGroupID GUICtrlListView_GetItemImage ' +
	        'GUICtrlListView_GetItemIndent GUICtrlListView_GetItemParam ' +
	        'GUICtrlListView_GetItemPosition ' +
	        'GUICtrlListView_GetItemPositionX ' +
	        'GUICtrlListView_GetItemPositionY GUICtrlListView_GetItemRect ' +
	        'GUICtrlListView_GetItemRectEx GUICtrlListView_GetItemSelected ' +
	        'GUICtrlListView_GetItemSpacing GUICtrlListView_GetItemSpacingX ' +
	        'GUICtrlListView_GetItemSpacingY GUICtrlListView_GetItemState ' +
	        'GUICtrlListView_GetItemStateImage GUICtrlListView_GetItemText ' +
	        'GUICtrlListView_GetItemTextArray ' +
	        'GUICtrlListView_GetItemTextString GUICtrlListView_GetNextItem ' +
	        'GUICtrlListView_GetNumberOfWorkAreas GUICtrlListView_GetOrigin ' +
	        'GUICtrlListView_GetOriginX GUICtrlListView_GetOriginY ' +
	        'GUICtrlListView_GetOutlineColor ' +
	        'GUICtrlListView_GetSelectedColumn ' +
	        'GUICtrlListView_GetSelectedCount ' +
	        'GUICtrlListView_GetSelectedIndices ' +
	        'GUICtrlListView_GetSelectionMark GUICtrlListView_GetStringWidth ' +
	        'GUICtrlListView_GetSubItemRect GUICtrlListView_GetTextBkColor ' +
	        'GUICtrlListView_GetTextColor GUICtrlListView_GetToolTips ' +
	        'GUICtrlListView_GetTopIndex GUICtrlListView_GetUnicodeFormat ' +
	        'GUICtrlListView_GetView GUICtrlListView_GetViewDetails ' +
	        'GUICtrlListView_GetViewLarge GUICtrlListView_GetViewList ' +
	        'GUICtrlListView_GetViewRect GUICtrlListView_GetViewSmall ' +
	        'GUICtrlListView_GetViewTile GUICtrlListView_HideColumn ' +
	        'GUICtrlListView_HitTest GUICtrlListView_InsertColumn ' +
	        'GUICtrlListView_InsertGroup GUICtrlListView_InsertItem ' +
	        'GUICtrlListView_JustifyColumn GUICtrlListView_MapIDToIndex ' +
	        'GUICtrlListView_MapIndexToID GUICtrlListView_RedrawItems ' +
	        'GUICtrlListView_RegisterSortCallBack ' +
	        'GUICtrlListView_RemoveAllGroups GUICtrlListView_RemoveGroup ' +
	        'GUICtrlListView_Scroll GUICtrlListView_SetBkColor ' +
	        'GUICtrlListView_SetBkImage GUICtrlListView_SetCallBackMask ' +
	        'GUICtrlListView_SetColumn GUICtrlListView_SetColumnOrder ' +
	        'GUICtrlListView_SetColumnOrderArray ' +
	        'GUICtrlListView_SetColumnWidth ' +
	        'GUICtrlListView_SetExtendedListViewStyle ' +
	        'GUICtrlListView_SetGroupInfo GUICtrlListView_SetHotItem ' +
	        'GUICtrlListView_SetHoverTime GUICtrlListView_SetIconSpacing ' +
	        'GUICtrlListView_SetImageList GUICtrlListView_SetItem ' +
	        'GUICtrlListView_SetItemChecked GUICtrlListView_SetItemCount ' +
	        'GUICtrlListView_SetItemCut GUICtrlListView_SetItemDropHilited ' +
	        'GUICtrlListView_SetItemEx GUICtrlListView_SetItemFocused ' +
	        'GUICtrlListView_SetItemGroupID GUICtrlListView_SetItemImage ' +
	        'GUICtrlListView_SetItemIndent GUICtrlListView_SetItemParam ' +
	        'GUICtrlListView_SetItemPosition ' +
	        'GUICtrlListView_SetItemPosition32 ' +
	        'GUICtrlListView_SetItemSelected GUICtrlListView_SetItemState ' +
	        'GUICtrlListView_SetItemStateImage GUICtrlListView_SetItemText ' +
	        'GUICtrlListView_SetOutlineColor ' +
	        'GUICtrlListView_SetSelectedColumn ' +
	        'GUICtrlListView_SetSelectionMark GUICtrlListView_SetTextBkColor ' +
	        'GUICtrlListView_SetTextColor GUICtrlListView_SetToolTips ' +
	        'GUICtrlListView_SetUnicodeFormat GUICtrlListView_SetView ' +
	        'GUICtrlListView_SetWorkAreas GUICtrlListView_SimpleSort ' +
	        'GUICtrlListView_SortItems GUICtrlListView_SubItemHitTest ' +
	        'GUICtrlListView_UnRegisterSortCallBack GUICtrlMenu_AddMenuItem ' +
	        'GUICtrlMenu_AppendMenu GUICtrlMenu_CalculatePopupWindowPosition ' +
	        'GUICtrlMenu_CheckMenuItem GUICtrlMenu_CheckRadioItem ' +
	        'GUICtrlMenu_CreateMenu GUICtrlMenu_CreatePopup ' +
	        'GUICtrlMenu_DeleteMenu GUICtrlMenu_DestroyMenu ' +
	        'GUICtrlMenu_DrawMenuBar GUICtrlMenu_EnableMenuItem ' +
	        'GUICtrlMenu_FindItem GUICtrlMenu_FindParent ' +
	        'GUICtrlMenu_GetItemBmp GUICtrlMenu_GetItemBmpChecked ' +
	        'GUICtrlMenu_GetItemBmpUnchecked GUICtrlMenu_GetItemChecked ' +
	        'GUICtrlMenu_GetItemCount GUICtrlMenu_GetItemData ' +
	        'GUICtrlMenu_GetItemDefault GUICtrlMenu_GetItemDisabled ' +
	        'GUICtrlMenu_GetItemEnabled GUICtrlMenu_GetItemGrayed ' +
	        'GUICtrlMenu_GetItemHighlighted GUICtrlMenu_GetItemID ' +
	        'GUICtrlMenu_GetItemInfo GUICtrlMenu_GetItemRect ' +
	        'GUICtrlMenu_GetItemRectEx GUICtrlMenu_GetItemState ' +
	        'GUICtrlMenu_GetItemStateEx GUICtrlMenu_GetItemSubMenu ' +
	        'GUICtrlMenu_GetItemText GUICtrlMenu_GetItemType ' +
	        'GUICtrlMenu_GetMenu GUICtrlMenu_GetMenuBackground ' +
	        'GUICtrlMenu_GetMenuBarInfo GUICtrlMenu_GetMenuContextHelpID ' +
	        'GUICtrlMenu_GetMenuData GUICtrlMenu_GetMenuDefaultItem ' +
	        'GUICtrlMenu_GetMenuHeight GUICtrlMenu_GetMenuInfo ' +
	        'GUICtrlMenu_GetMenuStyle GUICtrlMenu_GetSystemMenu ' +
	        'GUICtrlMenu_InsertMenuItem GUICtrlMenu_InsertMenuItemEx ' +
	        'GUICtrlMenu_IsMenu GUICtrlMenu_LoadMenu ' +
	        'GUICtrlMenu_MapAccelerator GUICtrlMenu_MenuItemFromPoint ' +
	        'GUICtrlMenu_RemoveMenu GUICtrlMenu_SetItemBitmaps ' +
	        'GUICtrlMenu_SetItemBmp GUICtrlMenu_SetItemBmpChecked ' +
	        'GUICtrlMenu_SetItemBmpUnchecked GUICtrlMenu_SetItemChecked ' +
	        'GUICtrlMenu_SetItemData GUICtrlMenu_SetItemDefault ' +
	        'GUICtrlMenu_SetItemDisabled GUICtrlMenu_SetItemEnabled ' +
	        'GUICtrlMenu_SetItemGrayed GUICtrlMenu_SetItemHighlighted ' +
	        'GUICtrlMenu_SetItemID GUICtrlMenu_SetItemInfo ' +
	        'GUICtrlMenu_SetItemState GUICtrlMenu_SetItemSubMenu ' +
	        'GUICtrlMenu_SetItemText GUICtrlMenu_SetItemType ' +
	        'GUICtrlMenu_SetMenu GUICtrlMenu_SetMenuBackground ' +
	        'GUICtrlMenu_SetMenuContextHelpID GUICtrlMenu_SetMenuData ' +
	        'GUICtrlMenu_SetMenuDefaultItem GUICtrlMenu_SetMenuHeight ' +
	        'GUICtrlMenu_SetMenuInfo GUICtrlMenu_SetMenuStyle ' +
	        'GUICtrlMenu_TrackPopupMenu GUICtrlMonthCal_Create ' +
	        'GUICtrlMonthCal_Destroy GUICtrlMonthCal_GetCalendarBorder ' +
	        'GUICtrlMonthCal_GetCalendarCount GUICtrlMonthCal_GetColor ' +
	        'GUICtrlMonthCal_GetColorArray GUICtrlMonthCal_GetCurSel ' +
	        'GUICtrlMonthCal_GetCurSelStr GUICtrlMonthCal_GetFirstDOW ' +
	        'GUICtrlMonthCal_GetFirstDOWStr GUICtrlMonthCal_GetMaxSelCount ' +
	        'GUICtrlMonthCal_GetMaxTodayWidth ' +
	        'GUICtrlMonthCal_GetMinReqHeight GUICtrlMonthCal_GetMinReqRect ' +
	        'GUICtrlMonthCal_GetMinReqRectArray ' +
	        'GUICtrlMonthCal_GetMinReqWidth GUICtrlMonthCal_GetMonthDelta ' +
	        'GUICtrlMonthCal_GetMonthRange GUICtrlMonthCal_GetMonthRangeMax ' +
	        'GUICtrlMonthCal_GetMonthRangeMaxStr ' +
	        'GUICtrlMonthCal_GetMonthRangeMin ' +
	        'GUICtrlMonthCal_GetMonthRangeMinStr ' +
	        'GUICtrlMonthCal_GetMonthRangeSpan GUICtrlMonthCal_GetRange ' +
	        'GUICtrlMonthCal_GetRangeMax GUICtrlMonthCal_GetRangeMaxStr ' +
	        'GUICtrlMonthCal_GetRangeMin GUICtrlMonthCal_GetRangeMinStr ' +
	        'GUICtrlMonthCal_GetSelRange GUICtrlMonthCal_GetSelRangeMax ' +
	        'GUICtrlMonthCal_GetSelRangeMaxStr ' +
	        'GUICtrlMonthCal_GetSelRangeMin ' +
	        'GUICtrlMonthCal_GetSelRangeMinStr GUICtrlMonthCal_GetToday ' +
	        'GUICtrlMonthCal_GetTodayStr GUICtrlMonthCal_GetUnicodeFormat ' +
	        'GUICtrlMonthCal_HitTest GUICtrlMonthCal_SetCalendarBorder ' +
	        'GUICtrlMonthCal_SetColor GUICtrlMonthCal_SetCurSel ' +
	        'GUICtrlMonthCal_SetDayState GUICtrlMonthCal_SetFirstDOW ' +
	        'GUICtrlMonthCal_SetMaxSelCount GUICtrlMonthCal_SetMonthDelta ' +
	        'GUICtrlMonthCal_SetRange GUICtrlMonthCal_SetSelRange ' +
	        'GUICtrlMonthCal_SetToday GUICtrlMonthCal_SetUnicodeFormat ' +
	        'GUICtrlRebar_AddBand GUICtrlRebar_AddToolBarBand ' +
	        'GUICtrlRebar_BeginDrag GUICtrlRebar_Create ' +
	        'GUICtrlRebar_DeleteBand GUICtrlRebar_Destroy ' +
	        'GUICtrlRebar_DragMove GUICtrlRebar_EndDrag ' +
	        'GUICtrlRebar_GetBandBackColor GUICtrlRebar_GetBandBorders ' +
	        'GUICtrlRebar_GetBandBordersEx GUICtrlRebar_GetBandChildHandle ' +
	        'GUICtrlRebar_GetBandChildSize GUICtrlRebar_GetBandCount ' +
	        'GUICtrlRebar_GetBandForeColor GUICtrlRebar_GetBandHeaderSize ' +
	        'GUICtrlRebar_GetBandID GUICtrlRebar_GetBandIdealSize ' +
	        'GUICtrlRebar_GetBandLength GUICtrlRebar_GetBandLParam ' +
	        'GUICtrlRebar_GetBandMargins GUICtrlRebar_GetBandMarginsEx ' +
	        'GUICtrlRebar_GetBandRect GUICtrlRebar_GetBandRectEx ' +
	        'GUICtrlRebar_GetBandStyle GUICtrlRebar_GetBandStyleBreak ' +
	        'GUICtrlRebar_GetBandStyleChildEdge ' +
	        'GUICtrlRebar_GetBandStyleFixedBMP ' +
	        'GUICtrlRebar_GetBandStyleFixedSize ' +
	        'GUICtrlRebar_GetBandStyleGripperAlways ' +
	        'GUICtrlRebar_GetBandStyleHidden ' +
	        'GUICtrlRebar_GetBandStyleHideTitle ' +
	        'GUICtrlRebar_GetBandStyleNoGripper ' +
	        'GUICtrlRebar_GetBandStyleTopAlign ' +
	        'GUICtrlRebar_GetBandStyleUseChevron ' +
	        'GUICtrlRebar_GetBandStyleVariableHeight ' +
	        'GUICtrlRebar_GetBandText GUICtrlRebar_GetBarHeight ' +
	        'GUICtrlRebar_GetBarInfo GUICtrlRebar_GetBKColor ' +
	        'GUICtrlRebar_GetColorScheme GUICtrlRebar_GetRowCount ' +
	        'GUICtrlRebar_GetRowHeight GUICtrlRebar_GetTextColor ' +
	        'GUICtrlRebar_GetToolTips GUICtrlRebar_GetUnicodeFormat ' +
	        'GUICtrlRebar_HitTest GUICtrlRebar_IDToIndex ' +
	        'GUICtrlRebar_MaximizeBand GUICtrlRebar_MinimizeBand ' +
	        'GUICtrlRebar_MoveBand GUICtrlRebar_SetBandBackColor ' +
	        'GUICtrlRebar_SetBandForeColor GUICtrlRebar_SetBandHeaderSize ' +
	        'GUICtrlRebar_SetBandID GUICtrlRebar_SetBandIdealSize ' +
	        'GUICtrlRebar_SetBandLength GUICtrlRebar_SetBandLParam ' +
	        'GUICtrlRebar_SetBandStyle GUICtrlRebar_SetBandStyleBreak ' +
	        'GUICtrlRebar_SetBandStyleChildEdge ' +
	        'GUICtrlRebar_SetBandStyleFixedBMP ' +
	        'GUICtrlRebar_SetBandStyleFixedSize ' +
	        'GUICtrlRebar_SetBandStyleGripperAlways ' +
	        'GUICtrlRebar_SetBandStyleHidden ' +
	        'GUICtrlRebar_SetBandStyleHideTitle ' +
	        'GUICtrlRebar_SetBandStyleNoGripper ' +
	        'GUICtrlRebar_SetBandStyleTopAlign ' +
	        'GUICtrlRebar_SetBandStyleUseChevron ' +
	        'GUICtrlRebar_SetBandStyleVariableHeight ' +
	        'GUICtrlRebar_SetBandText GUICtrlRebar_SetBarInfo ' +
	        'GUICtrlRebar_SetBKColor GUICtrlRebar_SetColorScheme ' +
	        'GUICtrlRebar_SetTextColor GUICtrlRebar_SetToolTips ' +
	        'GUICtrlRebar_SetUnicodeFormat GUICtrlRebar_ShowBand ' +
	        'GUICtrlRichEdit_AppendText GUICtrlRichEdit_AutoDetectURL ' +
	        'GUICtrlRichEdit_CanPaste GUICtrlRichEdit_CanPasteSpecial ' +
	        'GUICtrlRichEdit_CanRedo GUICtrlRichEdit_CanUndo ' +
	        'GUICtrlRichEdit_ChangeFontSize GUICtrlRichEdit_Copy ' +
	        'GUICtrlRichEdit_Create GUICtrlRichEdit_Cut ' +
	        'GUICtrlRichEdit_Deselect GUICtrlRichEdit_Destroy ' +
	        'GUICtrlRichEdit_EmptyUndoBuffer GUICtrlRichEdit_FindText ' +
	        'GUICtrlRichEdit_FindTextInRange GUICtrlRichEdit_GetBkColor ' +
	        'GUICtrlRichEdit_GetCharAttributes ' +
	        'GUICtrlRichEdit_GetCharBkColor GUICtrlRichEdit_GetCharColor ' +
	        'GUICtrlRichEdit_GetCharPosFromXY ' +
	        'GUICtrlRichEdit_GetCharPosOfNextWord ' +
	        'GUICtrlRichEdit_GetCharPosOfPreviousWord ' +
	        'GUICtrlRichEdit_GetCharWordBreakInfo ' +
	        'GUICtrlRichEdit_GetFirstCharPosOnLine GUICtrlRichEdit_GetFont ' +
	        'GUICtrlRichEdit_GetLineCount GUICtrlRichEdit_GetLineLength ' +
	        'GUICtrlRichEdit_GetLineNumberFromCharPos ' +
	        'GUICtrlRichEdit_GetNextRedo GUICtrlRichEdit_GetNextUndo ' +
	        'GUICtrlRichEdit_GetNumberOfFirstVisibleLine ' +
	        'GUICtrlRichEdit_GetParaAlignment ' +
	        'GUICtrlRichEdit_GetParaAttributes GUICtrlRichEdit_GetParaBorder ' +
	        'GUICtrlRichEdit_GetParaIndents GUICtrlRichEdit_GetParaNumbering ' +
	        'GUICtrlRichEdit_GetParaShading GUICtrlRichEdit_GetParaSpacing ' +
	        'GUICtrlRichEdit_GetParaTabStops GUICtrlRichEdit_GetPasswordChar ' +
	        'GUICtrlRichEdit_GetRECT GUICtrlRichEdit_GetScrollPos ' +
	        'GUICtrlRichEdit_GetSel GUICtrlRichEdit_GetSelAA ' +
	        'GUICtrlRichEdit_GetSelText GUICtrlRichEdit_GetSpaceUnit ' +
	        'GUICtrlRichEdit_GetText GUICtrlRichEdit_GetTextInLine ' +
	        'GUICtrlRichEdit_GetTextInRange GUICtrlRichEdit_GetTextLength ' +
	        'GUICtrlRichEdit_GetVersion GUICtrlRichEdit_GetXYFromCharPos ' +
	        'GUICtrlRichEdit_GetZoom GUICtrlRichEdit_GotoCharPos ' +
	        'GUICtrlRichEdit_HideSelection GUICtrlRichEdit_InsertText ' +
	        'GUICtrlRichEdit_IsModified GUICtrlRichEdit_IsTextSelected ' +
	        'GUICtrlRichEdit_Paste GUICtrlRichEdit_PasteSpecial ' +
	        'GUICtrlRichEdit_PauseRedraw GUICtrlRichEdit_Redo ' +
	        'GUICtrlRichEdit_ReplaceText GUICtrlRichEdit_ResumeRedraw ' +
	        'GUICtrlRichEdit_ScrollLineOrPage GUICtrlRichEdit_ScrollLines ' +
	        'GUICtrlRichEdit_ScrollToCaret GUICtrlRichEdit_SetBkColor ' +
	        'GUICtrlRichEdit_SetCharAttributes ' +
	        'GUICtrlRichEdit_SetCharBkColor GUICtrlRichEdit_SetCharColor ' +
	        'GUICtrlRichEdit_SetEventMask GUICtrlRichEdit_SetFont ' +
	        'GUICtrlRichEdit_SetLimitOnText GUICtrlRichEdit_SetModified ' +
	        'GUICtrlRichEdit_SetParaAlignment ' +
	        'GUICtrlRichEdit_SetParaAttributes GUICtrlRichEdit_SetParaBorder ' +
	        'GUICtrlRichEdit_SetParaIndents GUICtrlRichEdit_SetParaNumbering ' +
	        'GUICtrlRichEdit_SetParaShading GUICtrlRichEdit_SetParaSpacing ' +
	        'GUICtrlRichEdit_SetParaTabStops GUICtrlRichEdit_SetPasswordChar ' +
	        'GUICtrlRichEdit_SetReadOnly GUICtrlRichEdit_SetRECT ' +
	        'GUICtrlRichEdit_SetScrollPos GUICtrlRichEdit_SetSel ' +
	        'GUICtrlRichEdit_SetSpaceUnit GUICtrlRichEdit_SetTabStops ' +
	        'GUICtrlRichEdit_SetText GUICtrlRichEdit_SetUndoLimit ' +
	        'GUICtrlRichEdit_SetZoom GUICtrlRichEdit_StreamFromFile ' +
	        'GUICtrlRichEdit_StreamFromVar GUICtrlRichEdit_StreamToFile ' +
	        'GUICtrlRichEdit_StreamToVar GUICtrlRichEdit_Undo ' +
	        'GUICtrlSlider_ClearSel GUICtrlSlider_ClearTics ' +
	        'GUICtrlSlider_Create GUICtrlSlider_Destroy ' +
	        'GUICtrlSlider_GetBuddy GUICtrlSlider_GetChannelRect ' +
	        'GUICtrlSlider_GetChannelRectEx GUICtrlSlider_GetLineSize ' +
	        'GUICtrlSlider_GetLogicalTics GUICtrlSlider_GetNumTics ' +
	        'GUICtrlSlider_GetPageSize GUICtrlSlider_GetPos ' +
	        'GUICtrlSlider_GetRange GUICtrlSlider_GetRangeMax ' +
	        'GUICtrlSlider_GetRangeMin GUICtrlSlider_GetSel ' +
	        'GUICtrlSlider_GetSelEnd GUICtrlSlider_GetSelStart ' +
	        'GUICtrlSlider_GetThumbLength GUICtrlSlider_GetThumbRect ' +
	        'GUICtrlSlider_GetThumbRectEx GUICtrlSlider_GetTic ' +
	        'GUICtrlSlider_GetTicPos GUICtrlSlider_GetToolTips ' +
	        'GUICtrlSlider_GetUnicodeFormat GUICtrlSlider_SetBuddy ' +
	        'GUICtrlSlider_SetLineSize GUICtrlSlider_SetPageSize ' +
	        'GUICtrlSlider_SetPos GUICtrlSlider_SetRange ' +
	        'GUICtrlSlider_SetRangeMax GUICtrlSlider_SetRangeMin ' +
	        'GUICtrlSlider_SetSel GUICtrlSlider_SetSelEnd ' +
	        'GUICtrlSlider_SetSelStart GUICtrlSlider_SetThumbLength ' +
	        'GUICtrlSlider_SetTic GUICtrlSlider_SetTicFreq ' +
	        'GUICtrlSlider_SetTipSide GUICtrlSlider_SetToolTips ' +
	        'GUICtrlSlider_SetUnicodeFormat GUICtrlStatusBar_Create ' +
	        'GUICtrlStatusBar_Destroy GUICtrlStatusBar_EmbedControl ' +
	        'GUICtrlStatusBar_GetBorders GUICtrlStatusBar_GetBordersHorz ' +
	        'GUICtrlStatusBar_GetBordersRect GUICtrlStatusBar_GetBordersVert ' +
	        'GUICtrlStatusBar_GetCount GUICtrlStatusBar_GetHeight ' +
	        'GUICtrlStatusBar_GetIcon GUICtrlStatusBar_GetParts ' +
	        'GUICtrlStatusBar_GetRect GUICtrlStatusBar_GetRectEx ' +
	        'GUICtrlStatusBar_GetText GUICtrlStatusBar_GetTextFlags ' +
	        'GUICtrlStatusBar_GetTextLength GUICtrlStatusBar_GetTextLengthEx ' +
	        'GUICtrlStatusBar_GetTipText GUICtrlStatusBar_GetUnicodeFormat ' +
	        'GUICtrlStatusBar_GetWidth GUICtrlStatusBar_IsSimple ' +
	        'GUICtrlStatusBar_Resize GUICtrlStatusBar_SetBkColor ' +
	        'GUICtrlStatusBar_SetIcon GUICtrlStatusBar_SetMinHeight ' +
	        'GUICtrlStatusBar_SetParts GUICtrlStatusBar_SetSimple ' +
	        'GUICtrlStatusBar_SetText GUICtrlStatusBar_SetTipText ' +
	        'GUICtrlStatusBar_SetUnicodeFormat GUICtrlStatusBar_ShowHide ' +
	        'GUICtrlTab_ActivateTab GUICtrlTab_ClickTab GUICtrlTab_Create ' +
	        'GUICtrlTab_DeleteAllItems GUICtrlTab_DeleteItem ' +
	        'GUICtrlTab_DeselectAll GUICtrlTab_Destroy GUICtrlTab_FindTab ' +
	        'GUICtrlTab_GetCurFocus GUICtrlTab_GetCurSel ' +
	        'GUICtrlTab_GetDisplayRect GUICtrlTab_GetDisplayRectEx ' +
	        'GUICtrlTab_GetExtendedStyle GUICtrlTab_GetImageList ' +
	        'GUICtrlTab_GetItem GUICtrlTab_GetItemCount ' +
	        'GUICtrlTab_GetItemImage GUICtrlTab_GetItemParam ' +
	        'GUICtrlTab_GetItemRect GUICtrlTab_GetItemRectEx ' +
	        'GUICtrlTab_GetItemState GUICtrlTab_GetItemText ' +
	        'GUICtrlTab_GetRowCount GUICtrlTab_GetToolTips ' +
	        'GUICtrlTab_GetUnicodeFormat GUICtrlTab_HighlightItem ' +
	        'GUICtrlTab_HitTest GUICtrlTab_InsertItem ' +
	        'GUICtrlTab_RemoveImage GUICtrlTab_SetCurFocus ' +
	        'GUICtrlTab_SetCurSel GUICtrlTab_SetExtendedStyle ' +
	        'GUICtrlTab_SetImageList GUICtrlTab_SetItem ' +
	        'GUICtrlTab_SetItemImage GUICtrlTab_SetItemParam ' +
	        'GUICtrlTab_SetItemSize GUICtrlTab_SetItemState ' +
	        'GUICtrlTab_SetItemText GUICtrlTab_SetMinTabWidth ' +
	        'GUICtrlTab_SetPadding GUICtrlTab_SetToolTips ' +
	        'GUICtrlTab_SetUnicodeFormat GUICtrlToolbar_AddBitmap ' +
	        'GUICtrlToolbar_AddButton GUICtrlToolbar_AddButtonSep ' +
	        'GUICtrlToolbar_AddString GUICtrlToolbar_ButtonCount ' +
	        'GUICtrlToolbar_CheckButton GUICtrlToolbar_ClickAccel ' +
	        'GUICtrlToolbar_ClickButton GUICtrlToolbar_ClickIndex ' +
	        'GUICtrlToolbar_CommandToIndex GUICtrlToolbar_Create ' +
	        'GUICtrlToolbar_Customize GUICtrlToolbar_DeleteButton ' +
	        'GUICtrlToolbar_Destroy GUICtrlToolbar_EnableButton ' +
	        'GUICtrlToolbar_FindToolbar GUICtrlToolbar_GetAnchorHighlight ' +
	        'GUICtrlToolbar_GetBitmapFlags GUICtrlToolbar_GetButtonBitmap ' +
	        'GUICtrlToolbar_GetButtonInfo GUICtrlToolbar_GetButtonInfoEx ' +
	        'GUICtrlToolbar_GetButtonParam GUICtrlToolbar_GetButtonRect ' +
	        'GUICtrlToolbar_GetButtonRectEx GUICtrlToolbar_GetButtonSize ' +
	        'GUICtrlToolbar_GetButtonState GUICtrlToolbar_GetButtonStyle ' +
	        'GUICtrlToolbar_GetButtonText GUICtrlToolbar_GetColorScheme ' +
	        'GUICtrlToolbar_GetDisabledImageList ' +
	        'GUICtrlToolbar_GetExtendedStyle GUICtrlToolbar_GetHotImageList ' +
	        'GUICtrlToolbar_GetHotItem GUICtrlToolbar_GetImageList ' +
	        'GUICtrlToolbar_GetInsertMark GUICtrlToolbar_GetInsertMarkColor ' +
	        'GUICtrlToolbar_GetMaxSize GUICtrlToolbar_GetMetrics ' +
	        'GUICtrlToolbar_GetPadding GUICtrlToolbar_GetRows ' +
	        'GUICtrlToolbar_GetString GUICtrlToolbar_GetStyle ' +
	        'GUICtrlToolbar_GetStyleAltDrag ' +
	        'GUICtrlToolbar_GetStyleCustomErase GUICtrlToolbar_GetStyleFlat ' +
	        'GUICtrlToolbar_GetStyleList GUICtrlToolbar_GetStyleRegisterDrop ' +
	        'GUICtrlToolbar_GetStyleToolTips ' +
	        'GUICtrlToolbar_GetStyleTransparent ' +
	        'GUICtrlToolbar_GetStyleWrapable GUICtrlToolbar_GetTextRows ' +
	        'GUICtrlToolbar_GetToolTips GUICtrlToolbar_GetUnicodeFormat ' +
	        'GUICtrlToolbar_HideButton GUICtrlToolbar_HighlightButton ' +
	        'GUICtrlToolbar_HitTest GUICtrlToolbar_IndexToCommand ' +
	        'GUICtrlToolbar_InsertButton GUICtrlToolbar_InsertMarkHitTest ' +
	        'GUICtrlToolbar_IsButtonChecked GUICtrlToolbar_IsButtonEnabled ' +
	        'GUICtrlToolbar_IsButtonHidden ' +
	        'GUICtrlToolbar_IsButtonHighlighted ' +
	        'GUICtrlToolbar_IsButtonIndeterminate ' +
	        'GUICtrlToolbar_IsButtonPressed GUICtrlToolbar_LoadBitmap ' +
	        'GUICtrlToolbar_LoadImages GUICtrlToolbar_MapAccelerator ' +
	        'GUICtrlToolbar_MoveButton GUICtrlToolbar_PressButton ' +
	        'GUICtrlToolbar_SetAnchorHighlight GUICtrlToolbar_SetBitmapSize ' +
	        'GUICtrlToolbar_SetButtonBitMap GUICtrlToolbar_SetButtonInfo ' +
	        'GUICtrlToolbar_SetButtonInfoEx GUICtrlToolbar_SetButtonParam ' +
	        'GUICtrlToolbar_SetButtonSize GUICtrlToolbar_SetButtonState ' +
	        'GUICtrlToolbar_SetButtonStyle GUICtrlToolbar_SetButtonText ' +
	        'GUICtrlToolbar_SetButtonWidth GUICtrlToolbar_SetCmdID ' +
	        'GUICtrlToolbar_SetColorScheme ' +
	        'GUICtrlToolbar_SetDisabledImageList ' +
	        'GUICtrlToolbar_SetDrawTextFlags GUICtrlToolbar_SetExtendedStyle ' +
	        'GUICtrlToolbar_SetHotImageList GUICtrlToolbar_SetHotItem ' +
	        'GUICtrlToolbar_SetImageList GUICtrlToolbar_SetIndent ' +
	        'GUICtrlToolbar_SetIndeterminate GUICtrlToolbar_SetInsertMark ' +
	        'GUICtrlToolbar_SetInsertMarkColor GUICtrlToolbar_SetMaxTextRows ' +
	        'GUICtrlToolbar_SetMetrics GUICtrlToolbar_SetPadding ' +
	        'GUICtrlToolbar_SetParent GUICtrlToolbar_SetRows ' +
	        'GUICtrlToolbar_SetStyle GUICtrlToolbar_SetStyleAltDrag ' +
	        'GUICtrlToolbar_SetStyleCustomErase GUICtrlToolbar_SetStyleFlat ' +
	        'GUICtrlToolbar_SetStyleList GUICtrlToolbar_SetStyleRegisterDrop ' +
	        'GUICtrlToolbar_SetStyleToolTips ' +
	        'GUICtrlToolbar_SetStyleTransparent ' +
	        'GUICtrlToolbar_SetStyleWrapable GUICtrlToolbar_SetToolTips ' +
	        'GUICtrlToolbar_SetUnicodeFormat GUICtrlToolbar_SetWindowTheme ' +
	        'GUICtrlTreeView_Add GUICtrlTreeView_AddChild ' +
	        'GUICtrlTreeView_AddChildFirst GUICtrlTreeView_AddFirst ' +
	        'GUICtrlTreeView_BeginUpdate GUICtrlTreeView_ClickItem ' +
	        'GUICtrlTreeView_Create GUICtrlTreeView_CreateDragImage ' +
	        'GUICtrlTreeView_CreateSolidBitMap GUICtrlTreeView_Delete ' +
	        'GUICtrlTreeView_DeleteAll GUICtrlTreeView_DeleteChildren ' +
	        'GUICtrlTreeView_Destroy GUICtrlTreeView_DisplayRect ' +
	        'GUICtrlTreeView_DisplayRectEx GUICtrlTreeView_EditText ' +
	        'GUICtrlTreeView_EndEdit GUICtrlTreeView_EndUpdate ' +
	        'GUICtrlTreeView_EnsureVisible GUICtrlTreeView_Expand ' +
	        'GUICtrlTreeView_ExpandedOnce GUICtrlTreeView_FindItem ' +
	        'GUICtrlTreeView_FindItemEx GUICtrlTreeView_GetBkColor ' +
	        'GUICtrlTreeView_GetBold GUICtrlTreeView_GetChecked ' +
	        'GUICtrlTreeView_GetChildCount GUICtrlTreeView_GetChildren ' +
	        'GUICtrlTreeView_GetCount GUICtrlTreeView_GetCut ' +
	        'GUICtrlTreeView_GetDropTarget GUICtrlTreeView_GetEditControl ' +
	        'GUICtrlTreeView_GetExpanded GUICtrlTreeView_GetFirstChild ' +
	        'GUICtrlTreeView_GetFirstItem GUICtrlTreeView_GetFirstVisible ' +
	        'GUICtrlTreeView_GetFocused GUICtrlTreeView_GetHeight ' +
	        'GUICtrlTreeView_GetImageIndex ' +
	        'GUICtrlTreeView_GetImageListIconHandle ' +
	        'GUICtrlTreeView_GetIndent GUICtrlTreeView_GetInsertMarkColor ' +
	        'GUICtrlTreeView_GetISearchString GUICtrlTreeView_GetItemByIndex ' +
	        'GUICtrlTreeView_GetItemHandle GUICtrlTreeView_GetItemParam ' +
	        'GUICtrlTreeView_GetLastChild GUICtrlTreeView_GetLineColor ' +
	        'GUICtrlTreeView_GetNext GUICtrlTreeView_GetNextChild ' +
	        'GUICtrlTreeView_GetNextSibling GUICtrlTreeView_GetNextVisible ' +
	        'GUICtrlTreeView_GetNormalImageList ' +
	        'GUICtrlTreeView_GetParentHandle GUICtrlTreeView_GetParentParam ' +
	        'GUICtrlTreeView_GetPrev GUICtrlTreeView_GetPrevChild ' +
	        'GUICtrlTreeView_GetPrevSibling GUICtrlTreeView_GetPrevVisible ' +
	        'GUICtrlTreeView_GetScrollTime GUICtrlTreeView_GetSelected ' +
	        'GUICtrlTreeView_GetSelectedImageIndex ' +
	        'GUICtrlTreeView_GetSelection GUICtrlTreeView_GetSiblingCount ' +
	        'GUICtrlTreeView_GetState GUICtrlTreeView_GetStateImageIndex ' +
	        'GUICtrlTreeView_GetStateImageList GUICtrlTreeView_GetText ' +
	        'GUICtrlTreeView_GetTextColor GUICtrlTreeView_GetToolTips ' +
	        'GUICtrlTreeView_GetTree GUICtrlTreeView_GetUnicodeFormat ' +
	        'GUICtrlTreeView_GetVisible GUICtrlTreeView_GetVisibleCount ' +
	        'GUICtrlTreeView_HitTest GUICtrlTreeView_HitTestEx ' +
	        'GUICtrlTreeView_HitTestItem GUICtrlTreeView_Index ' +
	        'GUICtrlTreeView_InsertItem GUICtrlTreeView_IsFirstItem ' +
	        'GUICtrlTreeView_IsParent GUICtrlTreeView_Level ' +
	        'GUICtrlTreeView_SelectItem GUICtrlTreeView_SelectItemByIndex ' +
	        'GUICtrlTreeView_SetBkColor GUICtrlTreeView_SetBold ' +
	        'GUICtrlTreeView_SetChecked GUICtrlTreeView_SetCheckedByIndex ' +
	        'GUICtrlTreeView_SetChildren GUICtrlTreeView_SetCut ' +
	        'GUICtrlTreeView_SetDropTarget GUICtrlTreeView_SetFocused ' +
	        'GUICtrlTreeView_SetHeight GUICtrlTreeView_SetIcon ' +
	        'GUICtrlTreeView_SetImageIndex GUICtrlTreeView_SetIndent ' +
	        'GUICtrlTreeView_SetInsertMark ' +
	        'GUICtrlTreeView_SetInsertMarkColor ' +
	        'GUICtrlTreeView_SetItemHeight GUICtrlTreeView_SetItemParam ' +
	        'GUICtrlTreeView_SetLineColor GUICtrlTreeView_SetNormalImageList ' +
	        'GUICtrlTreeView_SetScrollTime GUICtrlTreeView_SetSelected ' +
	        'GUICtrlTreeView_SetSelectedImageIndex GUICtrlTreeView_SetState ' +
	        'GUICtrlTreeView_SetStateImageIndex ' +
	        'GUICtrlTreeView_SetStateImageList GUICtrlTreeView_SetText ' +
	        'GUICtrlTreeView_SetTextColor GUICtrlTreeView_SetToolTips ' +
	        'GUICtrlTreeView_SetUnicodeFormat GUICtrlTreeView_Sort ' +
	        'GUIImageList_Add GUIImageList_AddBitmap GUIImageList_AddIcon ' +
	        'GUIImageList_AddMasked GUIImageList_BeginDrag ' +
	        'GUIImageList_Copy GUIImageList_Create GUIImageList_Destroy ' +
	        'GUIImageList_DestroyIcon GUIImageList_DragEnter ' +
	        'GUIImageList_DragLeave GUIImageList_DragMove ' +
	        'GUIImageList_Draw GUIImageList_DrawEx GUIImageList_Duplicate ' +
	        'GUIImageList_EndDrag GUIImageList_GetBkColor ' +
	        'GUIImageList_GetIcon GUIImageList_GetIconHeight ' +
	        'GUIImageList_GetIconSize GUIImageList_GetIconSizeEx ' +
	        'GUIImageList_GetIconWidth GUIImageList_GetImageCount ' +
	        'GUIImageList_GetImageInfoEx GUIImageList_Remove ' +
	        'GUIImageList_ReplaceIcon GUIImageList_SetBkColor ' +
	        'GUIImageList_SetIconSize GUIImageList_SetImageCount ' +
	        'GUIImageList_Swap GUIScrollBars_EnableScrollBar ' +
	        'GUIScrollBars_GetScrollBarInfoEx GUIScrollBars_GetScrollBarRect ' +
	        'GUIScrollBars_GetScrollBarRGState ' +
	        'GUIScrollBars_GetScrollBarXYLineButton ' +
	        'GUIScrollBars_GetScrollBarXYThumbBottom ' +
	        'GUIScrollBars_GetScrollBarXYThumbTop ' +
	        'GUIScrollBars_GetScrollInfo GUIScrollBars_GetScrollInfoEx ' +
	        'GUIScrollBars_GetScrollInfoMax GUIScrollBars_GetScrollInfoMin ' +
	        'GUIScrollBars_GetScrollInfoPage GUIScrollBars_GetScrollInfoPos ' +
	        'GUIScrollBars_GetScrollInfoTrackPos GUIScrollBars_GetScrollPos ' +
	        'GUIScrollBars_GetScrollRange GUIScrollBars_Init ' +
	        'GUIScrollBars_ScrollWindow GUIScrollBars_SetScrollInfo ' +
	        'GUIScrollBars_SetScrollInfoMax GUIScrollBars_SetScrollInfoMin ' +
	        'GUIScrollBars_SetScrollInfoPage GUIScrollBars_SetScrollInfoPos ' +
	        'GUIScrollBars_SetScrollRange GUIScrollBars_ShowScrollBar ' +
	        'GUIToolTip_Activate GUIToolTip_AddTool GUIToolTip_AdjustRect ' +
	        'GUIToolTip_BitsToTTF GUIToolTip_Create GUIToolTip_Deactivate ' +
	        'GUIToolTip_DelTool GUIToolTip_Destroy GUIToolTip_EnumTools ' +
	        'GUIToolTip_GetBubbleHeight GUIToolTip_GetBubbleSize ' +
	        'GUIToolTip_GetBubbleWidth GUIToolTip_GetCurrentTool ' +
	        'GUIToolTip_GetDelayTime GUIToolTip_GetMargin ' +
	        'GUIToolTip_GetMarginEx GUIToolTip_GetMaxTipWidth ' +
	        'GUIToolTip_GetText GUIToolTip_GetTipBkColor ' +
	        'GUIToolTip_GetTipTextColor GUIToolTip_GetTitleBitMap ' +
	        'GUIToolTip_GetTitleText GUIToolTip_GetToolCount ' +
	        'GUIToolTip_GetToolInfo GUIToolTip_HitTest ' +
	        'GUIToolTip_NewToolRect GUIToolTip_Pop GUIToolTip_PopUp ' +
	        'GUIToolTip_SetDelayTime GUIToolTip_SetMargin ' +
	        'GUIToolTip_SetMaxTipWidth GUIToolTip_SetTipBkColor ' +
	        'GUIToolTip_SetTipTextColor GUIToolTip_SetTitle ' +
	        'GUIToolTip_SetToolInfo GUIToolTip_SetWindowTheme ' +
	        'GUIToolTip_ToolExists GUIToolTip_ToolToArray ' +
	        'GUIToolTip_TrackActivate GUIToolTip_TrackPosition ' +
	        'GUIToolTip_Update GUIToolTip_UpdateTipText HexToString ' +
	        'IEAction IEAttach IEBodyReadHTML IEBodyReadText ' +
	        'IEBodyWriteHTML IECreate IECreateEmbedded IEDocGetObj ' +
	        'IEDocInsertHTML IEDocInsertText IEDocReadHTML ' +
	        'IEDocWriteHTML IEErrorNotify IEFormElementCheckBoxSelect ' +
	        'IEFormElementGetCollection IEFormElementGetObjByName ' +
	        'IEFormElementGetValue IEFormElementOptionSelect ' +
	        'IEFormElementRadioSelect IEFormElementSetValue ' +
	        'IEFormGetCollection IEFormGetObjByName IEFormImageClick ' +
	        'IEFormReset IEFormSubmit IEFrameGetCollection ' +
	        'IEFrameGetObjByName IEGetObjById IEGetObjByName ' +
	        'IEHeadInsertEventScript IEImgClick IEImgGetCollection ' +
	        'IEIsFrameSet IELinkClickByIndex IELinkClickByText ' +
	        'IELinkGetCollection IELoadWait IELoadWaitTimeout IENavigate ' +
	        'IEPropertyGet IEPropertySet IEQuit IETableGetCollection ' +
	        'IETableWriteToArray IETagNameAllGetCollection ' +
	        'IETagNameGetCollection IE_Example IE_Introduction ' +
	        'IE_VersionInfo INetExplorerCapable INetGetSource INetMail ' +
	        'INetSmtpMail IsPressed MathCheckDiv Max MemGlobalAlloc ' +
	        'MemGlobalFree MemGlobalLock MemGlobalSize MemGlobalUnlock ' +
	        'MemMoveMemory MemVirtualAlloc MemVirtualAllocEx ' +
	        'MemVirtualFree MemVirtualFreeEx Min MouseTrap ' +
	        'NamedPipes_CallNamedPipe NamedPipes_ConnectNamedPipe ' +
	        'NamedPipes_CreateNamedPipe NamedPipes_CreatePipe ' +
	        'NamedPipes_DisconnectNamedPipe ' +
	        'NamedPipes_GetNamedPipeHandleState NamedPipes_GetNamedPipeInfo ' +
	        'NamedPipes_PeekNamedPipe NamedPipes_SetNamedPipeHandleState ' +
	        'NamedPipes_TransactNamedPipe NamedPipes_WaitNamedPipe ' +
	        'Net_Share_ConnectionEnum Net_Share_FileClose ' +
	        'Net_Share_FileEnum Net_Share_FileGetInfo Net_Share_PermStr ' +
	        'Net_Share_ResourceStr Net_Share_SessionDel ' +
	        'Net_Share_SessionEnum Net_Share_SessionGetInfo ' +
	        'Net_Share_ShareAdd Net_Share_ShareCheck Net_Share_ShareDel ' +
	        'Net_Share_ShareEnum Net_Share_ShareGetInfo ' +
	        'Net_Share_ShareSetInfo Net_Share_StatisticsGetSvr ' +
	        'Net_Share_StatisticsGetWrk Now NowCalc NowCalcDate ' +
	        'NowDate NowTime PathFull PathGetRelative PathMake ' +
	        'PathSplit ProcessGetName ProcessGetPriority Radian ' +
	        'ReplaceStringInFile RunDos ScreenCapture_Capture ' +
	        'ScreenCapture_CaptureWnd ScreenCapture_SaveImage ' +
	        'ScreenCapture_SetBMPFormat ScreenCapture_SetJPGQuality ' +
	        'ScreenCapture_SetTIFColorDepth ScreenCapture_SetTIFCompression ' +
	        'Security__AdjustTokenPrivileges ' +
	        'Security__CreateProcessWithToken Security__DuplicateTokenEx ' +
	        'Security__GetAccountSid Security__GetLengthSid ' +
	        'Security__GetTokenInformation Security__ImpersonateSelf ' +
	        'Security__IsValidSid Security__LookupAccountName ' +
	        'Security__LookupAccountSid Security__LookupPrivilegeValue ' +
	        'Security__OpenProcessToken Security__OpenThreadToken ' +
	        'Security__OpenThreadTokenEx Security__SetPrivilege ' +
	        'Security__SetTokenInformation Security__SidToStringSid ' +
	        'Security__SidTypeStr Security__StringSidToSid SendMessage ' +
	        'SendMessageA SetDate SetTime Singleton SoundClose ' +
	        'SoundLength SoundOpen SoundPause SoundPlay SoundPos ' +
	        'SoundResume SoundSeek SoundStatus SoundStop ' +
	        'SQLite_Changes SQLite_Close SQLite_Display2DResult ' +
	        'SQLite_Encode SQLite_ErrCode SQLite_ErrMsg SQLite_Escape ' +
	        'SQLite_Exec SQLite_FastEncode SQLite_FastEscape ' +
	        'SQLite_FetchData SQLite_FetchNames SQLite_GetTable ' +
	        'SQLite_GetTable2d SQLite_LastInsertRowID SQLite_LibVersion ' +
	        'SQLite_Open SQLite_Query SQLite_QueryFinalize ' +
	        'SQLite_QueryReset SQLite_QuerySingleRow SQLite_SafeMode ' +
	        'SQLite_SetTimeout SQLite_Shutdown SQLite_SQLiteExe ' +
	        'SQLite_Startup SQLite_TotalChanges StringBetween ' +
	        'StringExplode StringInsert StringProper StringRepeat ' +
	        'StringTitleCase StringToHex TCPIpToName TempFile ' +
	        'TicksToTime Timer_Diff Timer_GetIdleTime Timer_GetTimerID ' +
	        'Timer_Init Timer_KillAllTimers Timer_KillTimer ' +
	        'Timer_SetTimer TimeToTicks VersionCompare viClose ' +
	        'viExecCommand viFindGpib viGpibBusReset viGTL ' +
	        'viInteractiveControl viOpen viSetAttribute viSetTimeout ' +
	        'WeekNumberISO WinAPI_AbortPath WinAPI_ActivateKeyboardLayout ' +
	        'WinAPI_AddClipboardFormatListener WinAPI_AddFontMemResourceEx ' +
	        'WinAPI_AddFontResourceEx WinAPI_AddIconOverlay ' +
	        'WinAPI_AddIconTransparency WinAPI_AddMRUString ' +
	        'WinAPI_AdjustBitmap WinAPI_AdjustTokenPrivileges ' +
	        'WinAPI_AdjustWindowRectEx WinAPI_AlphaBlend WinAPI_AngleArc ' +
	        'WinAPI_AnimateWindow WinAPI_Arc WinAPI_ArcTo ' +
	        'WinAPI_ArrayToStruct WinAPI_AssignProcessToJobObject ' +
	        'WinAPI_AssocGetPerceivedType WinAPI_AssocQueryString ' +
	        'WinAPI_AttachConsole WinAPI_AttachThreadInput ' +
	        'WinAPI_BackupRead WinAPI_BackupReadAbort WinAPI_BackupSeek ' +
	        'WinAPI_BackupWrite WinAPI_BackupWriteAbort WinAPI_Beep ' +
	        'WinAPI_BeginBufferedPaint WinAPI_BeginDeferWindowPos ' +
	        'WinAPI_BeginPaint WinAPI_BeginPath WinAPI_BeginUpdateResource ' +
	        'WinAPI_BitBlt WinAPI_BringWindowToTop ' +
	        'WinAPI_BroadcastSystemMessage WinAPI_BrowseForFolderDlg ' +
	        'WinAPI_BufferedPaintClear WinAPI_BufferedPaintInit ' +
	        'WinAPI_BufferedPaintSetAlpha WinAPI_BufferedPaintUnInit ' +
	        'WinAPI_CallNextHookEx WinAPI_CallWindowProc ' +
	        'WinAPI_CallWindowProcW WinAPI_CascadeWindows ' +
	        'WinAPI_ChangeWindowMessageFilterEx WinAPI_CharToOem ' +
	        'WinAPI_ChildWindowFromPointEx WinAPI_ClientToScreen ' +
	        'WinAPI_ClipCursor WinAPI_CloseDesktop WinAPI_CloseEnhMetaFile ' +
	        'WinAPI_CloseFigure WinAPI_CloseHandle WinAPI_CloseThemeData ' +
	        'WinAPI_CloseWindow WinAPI_CloseWindowStation ' +
	        'WinAPI_CLSIDFromProgID WinAPI_CoInitialize ' +
	        'WinAPI_ColorAdjustLuma WinAPI_ColorHLSToRGB ' +
	        'WinAPI_ColorRGBToHLS WinAPI_CombineRgn ' +
	        'WinAPI_CombineTransform WinAPI_CommandLineToArgv ' +
	        'WinAPI_CommDlgExtendedError WinAPI_CommDlgExtendedErrorEx ' +
	        'WinAPI_CompareString WinAPI_CompressBitmapBits ' +
	        'WinAPI_CompressBuffer WinAPI_ComputeCrc32 ' +
	        'WinAPI_ConfirmCredentials WinAPI_CopyBitmap WinAPI_CopyCursor ' +
	        'WinAPI_CopyEnhMetaFile WinAPI_CopyFileEx WinAPI_CopyIcon ' +
	        'WinAPI_CopyImage WinAPI_CopyRect WinAPI_CopyStruct ' +
	        'WinAPI_CoTaskMemAlloc WinAPI_CoTaskMemFree ' +
	        'WinAPI_CoTaskMemRealloc WinAPI_CoUninitialize ' +
	        'WinAPI_Create32BitHBITMAP WinAPI_Create32BitHICON ' +
	        'WinAPI_CreateANDBitmap WinAPI_CreateBitmap ' +
	        'WinAPI_CreateBitmapIndirect WinAPI_CreateBrushIndirect ' +
	        'WinAPI_CreateBuffer WinAPI_CreateBufferFromStruct ' +
	        'WinAPI_CreateCaret WinAPI_CreateColorAdjustment ' +
	        'WinAPI_CreateCompatibleBitmap WinAPI_CreateCompatibleBitmapEx ' +
	        'WinAPI_CreateCompatibleDC WinAPI_CreateDesktop ' +
	        'WinAPI_CreateDIB WinAPI_CreateDIBColorTable ' +
	        'WinAPI_CreateDIBitmap WinAPI_CreateDIBSection ' +
	        'WinAPI_CreateDirectory WinAPI_CreateDirectoryEx ' +
	        'WinAPI_CreateEllipticRgn WinAPI_CreateEmptyIcon ' +
	        'WinAPI_CreateEnhMetaFile WinAPI_CreateEvent WinAPI_CreateFile ' +
	        'WinAPI_CreateFileEx WinAPI_CreateFileMapping ' +
	        'WinAPI_CreateFont WinAPI_CreateFontEx ' +
	        'WinAPI_CreateFontIndirect WinAPI_CreateGUID ' +
	        'WinAPI_CreateHardLink WinAPI_CreateIcon ' +
	        'WinAPI_CreateIconFromResourceEx WinAPI_CreateIconIndirect ' +
	        'WinAPI_CreateJobObject WinAPI_CreateMargins ' +
	        'WinAPI_CreateMRUList WinAPI_CreateMutex WinAPI_CreateNullRgn ' +
	        'WinAPI_CreateNumberFormatInfo WinAPI_CreateObjectID ' +
	        'WinAPI_CreatePen WinAPI_CreatePoint WinAPI_CreatePolygonRgn ' +
	        'WinAPI_CreateProcess WinAPI_CreateProcessWithToken ' +
	        'WinAPI_CreateRect WinAPI_CreateRectEx WinAPI_CreateRectRgn ' +
	        'WinAPI_CreateRectRgnIndirect WinAPI_CreateRoundRectRgn ' +
	        'WinAPI_CreateSemaphore WinAPI_CreateSize ' +
	        'WinAPI_CreateSolidBitmap WinAPI_CreateSolidBrush ' +
	        'WinAPI_CreateStreamOnHGlobal WinAPI_CreateString ' +
	        'WinAPI_CreateSymbolicLink WinAPI_CreateTransform ' +
	        'WinAPI_CreateWindowEx WinAPI_CreateWindowStation ' +
	        'WinAPI_DecompressBuffer WinAPI_DecryptFile ' +
	        'WinAPI_DeferWindowPos WinAPI_DefineDosDevice ' +
	        'WinAPI_DefRawInputProc WinAPI_DefSubclassProc ' +
	        'WinAPI_DefWindowProc WinAPI_DefWindowProcW WinAPI_DeleteDC ' +
	        'WinAPI_DeleteEnhMetaFile WinAPI_DeleteFile ' +
	        'WinAPI_DeleteObject WinAPI_DeleteObjectID ' +
	        'WinAPI_DeleteVolumeMountPoint WinAPI_DeregisterShellHookWindow ' +
	        'WinAPI_DestroyCaret WinAPI_DestroyCursor WinAPI_DestroyIcon ' +
	        'WinAPI_DestroyWindow WinAPI_DeviceIoControl ' +
	        'WinAPI_DisplayStruct WinAPI_DllGetVersion WinAPI_DllInstall ' +
	        'WinAPI_DllUninstall WinAPI_DPtoLP WinAPI_DragAcceptFiles ' +
	        'WinAPI_DragFinish WinAPI_DragQueryFileEx ' +
	        'WinAPI_DragQueryPoint WinAPI_DrawAnimatedRects ' +
	        'WinAPI_DrawBitmap WinAPI_DrawEdge WinAPI_DrawFocusRect ' +
	        'WinAPI_DrawFrameControl WinAPI_DrawIcon WinAPI_DrawIconEx ' +
	        'WinAPI_DrawLine WinAPI_DrawShadowText WinAPI_DrawText ' +
	        'WinAPI_DrawThemeBackground WinAPI_DrawThemeEdge ' +
	        'WinAPI_DrawThemeIcon WinAPI_DrawThemeParentBackground ' +
	        'WinAPI_DrawThemeText WinAPI_DrawThemeTextEx ' +
	        'WinAPI_DuplicateEncryptionInfoFile WinAPI_DuplicateHandle ' +
	        'WinAPI_DuplicateTokenEx WinAPI_DwmDefWindowProc ' +
	        'WinAPI_DwmEnableBlurBehindWindow WinAPI_DwmEnableComposition ' +
	        'WinAPI_DwmExtendFrameIntoClientArea ' +
	        'WinAPI_DwmGetColorizationColor ' +
	        'WinAPI_DwmGetColorizationParameters ' +
	        'WinAPI_DwmGetWindowAttribute WinAPI_DwmInvalidateIconicBitmaps ' +
	        'WinAPI_DwmIsCompositionEnabled ' +
	        'WinAPI_DwmQueryThumbnailSourceSize WinAPI_DwmRegisterThumbnail ' +
	        'WinAPI_DwmSetColorizationParameters ' +
	        'WinAPI_DwmSetIconicLivePreviewBitmap ' +
	        'WinAPI_DwmSetIconicThumbnail WinAPI_DwmSetWindowAttribute ' +
	        'WinAPI_DwmUnregisterThumbnail ' +
	        'WinAPI_DwmUpdateThumbnailProperties WinAPI_DWordToFloat ' +
	        'WinAPI_DWordToInt WinAPI_EjectMedia WinAPI_Ellipse ' +
	        'WinAPI_EmptyWorkingSet WinAPI_EnableWindow WinAPI_EncryptFile ' +
	        'WinAPI_EncryptionDisable WinAPI_EndBufferedPaint ' +
	        'WinAPI_EndDeferWindowPos WinAPI_EndPaint WinAPI_EndPath ' +
	        'WinAPI_EndUpdateResource WinAPI_EnumChildProcess ' +
	        'WinAPI_EnumChildWindows WinAPI_EnumDesktops ' +
	        'WinAPI_EnumDesktopWindows WinAPI_EnumDeviceDrivers ' +
	        'WinAPI_EnumDisplayDevices WinAPI_EnumDisplayMonitors ' +
	        'WinAPI_EnumDisplaySettings WinAPI_EnumDllProc ' +
	        'WinAPI_EnumFiles WinAPI_EnumFileStreams ' +
	        'WinAPI_EnumFontFamilies WinAPI_EnumHardLinks ' +
	        'WinAPI_EnumMRUList WinAPI_EnumPageFiles ' +
	        'WinAPI_EnumProcessHandles WinAPI_EnumProcessModules ' +
	        'WinAPI_EnumProcessThreads WinAPI_EnumProcessWindows ' +
	        'WinAPI_EnumRawInputDevices WinAPI_EnumResourceLanguages ' +
	        'WinAPI_EnumResourceNames WinAPI_EnumResourceTypes ' +
	        'WinAPI_EnumSystemGeoID WinAPI_EnumSystemLocales ' +
	        'WinAPI_EnumUILanguages WinAPI_EnumWindows ' +
	        'WinAPI_EnumWindowsPopup WinAPI_EnumWindowStations ' +
	        'WinAPI_EnumWindowsTop WinAPI_EqualMemory WinAPI_EqualRect ' +
	        'WinAPI_EqualRgn WinAPI_ExcludeClipRect ' +
	        'WinAPI_ExpandEnvironmentStrings WinAPI_ExtCreatePen ' +
	        'WinAPI_ExtCreateRegion WinAPI_ExtFloodFill WinAPI_ExtractIcon ' +
	        'WinAPI_ExtractIconEx WinAPI_ExtSelectClipRgn ' +
	        'WinAPI_FatalAppExit WinAPI_FatalExit ' +
	        'WinAPI_FileEncryptionStatus WinAPI_FileExists ' +
	        'WinAPI_FileIconInit WinAPI_FileInUse WinAPI_FillMemory ' +
	        'WinAPI_FillPath WinAPI_FillRect WinAPI_FillRgn ' +
	        'WinAPI_FindClose WinAPI_FindCloseChangeNotification ' +
	        'WinAPI_FindExecutable WinAPI_FindFirstChangeNotification ' +
	        'WinAPI_FindFirstFile WinAPI_FindFirstFileName ' +
	        'WinAPI_FindFirstStream WinAPI_FindNextChangeNotification ' +
	        'WinAPI_FindNextFile WinAPI_FindNextFileName ' +
	        'WinAPI_FindNextStream WinAPI_FindResource ' +
	        'WinAPI_FindResourceEx WinAPI_FindTextDlg WinAPI_FindWindow ' +
	        'WinAPI_FlashWindow WinAPI_FlashWindowEx WinAPI_FlattenPath ' +
	        'WinAPI_FloatToDWord WinAPI_FloatToInt WinAPI_FlushFileBuffers ' +
	        'WinAPI_FlushFRBuffer WinAPI_FlushViewOfFile ' +
	        'WinAPI_FormatDriveDlg WinAPI_FormatMessage WinAPI_FrameRect ' +
	        'WinAPI_FrameRgn WinAPI_FreeLibrary WinAPI_FreeMemory ' +
	        'WinAPI_FreeMRUList WinAPI_FreeResource WinAPI_GdiComment ' +
	        'WinAPI_GetActiveWindow WinAPI_GetAllUsersProfileDirectory ' +
	        'WinAPI_GetAncestor WinAPI_GetApplicationRestartSettings ' +
	        'WinAPI_GetArcDirection WinAPI_GetAsyncKeyState ' +
	        'WinAPI_GetBinaryType WinAPI_GetBitmapBits ' +
	        'WinAPI_GetBitmapDimension WinAPI_GetBitmapDimensionEx ' +
	        'WinAPI_GetBkColor WinAPI_GetBkMode WinAPI_GetBoundsRect ' +
	        'WinAPI_GetBrushOrg WinAPI_GetBufferedPaintBits ' +
	        'WinAPI_GetBufferedPaintDC WinAPI_GetBufferedPaintTargetDC ' +
	        'WinAPI_GetBufferedPaintTargetRect WinAPI_GetBValue ' +
	        'WinAPI_GetCaretBlinkTime WinAPI_GetCaretPos WinAPI_GetCDType ' +
	        'WinAPI_GetClassInfoEx WinAPI_GetClassLongEx ' +
	        'WinAPI_GetClassName WinAPI_GetClientHeight ' +
	        'WinAPI_GetClientRect WinAPI_GetClientWidth ' +
	        'WinAPI_GetClipboardSequenceNumber WinAPI_GetClipBox ' +
	        'WinAPI_GetClipCursor WinAPI_GetClipRgn ' +
	        'WinAPI_GetColorAdjustment WinAPI_GetCompressedFileSize ' +
	        'WinAPI_GetCompression WinAPI_GetConnectedDlg ' +
	        'WinAPI_GetCurrentDirectory WinAPI_GetCurrentHwProfile ' +
	        'WinAPI_GetCurrentObject WinAPI_GetCurrentPosition ' +
	        'WinAPI_GetCurrentProcess ' +
	        'WinAPI_GetCurrentProcessExplicitAppUserModelID ' +
	        'WinAPI_GetCurrentProcessID WinAPI_GetCurrentThemeName ' +
	        'WinAPI_GetCurrentThread WinAPI_GetCurrentThreadId ' +
	        'WinAPI_GetCursor WinAPI_GetCursorInfo WinAPI_GetDateFormat ' +
	        'WinAPI_GetDC WinAPI_GetDCEx WinAPI_GetDefaultPrinter ' +
	        'WinAPI_GetDefaultUserProfileDirectory WinAPI_GetDesktopWindow ' +
	        'WinAPI_GetDeviceCaps WinAPI_GetDeviceDriverBaseName ' +
	        'WinAPI_GetDeviceDriverFileName WinAPI_GetDeviceGammaRamp ' +
	        'WinAPI_GetDIBColorTable WinAPI_GetDIBits ' +
	        'WinAPI_GetDiskFreeSpaceEx WinAPI_GetDlgCtrlID ' +
	        'WinAPI_GetDlgItem WinAPI_GetDllDirectory ' +
	        'WinAPI_GetDriveBusType WinAPI_GetDriveGeometryEx ' +
	        'WinAPI_GetDriveNumber WinAPI_GetDriveType ' +
	        'WinAPI_GetDurationFormat WinAPI_GetEffectiveClientRect ' +
	        'WinAPI_GetEnhMetaFile WinAPI_GetEnhMetaFileBits ' +
	        'WinAPI_GetEnhMetaFileDescription WinAPI_GetEnhMetaFileDimension ' +
	        'WinAPI_GetEnhMetaFileHeader WinAPI_GetErrorMessage ' +
	        'WinAPI_GetErrorMode WinAPI_GetExitCodeProcess ' +
	        'WinAPI_GetExtended WinAPI_GetFileAttributes WinAPI_GetFileID ' +
	        'WinAPI_GetFileInformationByHandle ' +
	        'WinAPI_GetFileInformationByHandleEx WinAPI_GetFilePointerEx ' +
	        'WinAPI_GetFileSizeEx WinAPI_GetFileSizeOnDisk ' +
	        'WinAPI_GetFileTitle WinAPI_GetFileType ' +
	        'WinAPI_GetFileVersionInfo WinAPI_GetFinalPathNameByHandle ' +
	        'WinAPI_GetFinalPathNameByHandleEx WinAPI_GetFocus ' +
	        'WinAPI_GetFontMemoryResourceInfo WinAPI_GetFontName ' +
	        'WinAPI_GetFontResourceInfo WinAPI_GetForegroundWindow ' +
	        'WinAPI_GetFRBuffer WinAPI_GetFullPathName WinAPI_GetGeoInfo ' +
	        'WinAPI_GetGlyphOutline WinAPI_GetGraphicsMode ' +
	        'WinAPI_GetGuiResources WinAPI_GetGUIThreadInfo ' +
	        'WinAPI_GetGValue WinAPI_GetHandleInformation ' +
	        'WinAPI_GetHGlobalFromStream WinAPI_GetIconDimension ' +
	        'WinAPI_GetIconInfo WinAPI_GetIconInfoEx WinAPI_GetIdleTime ' +
	        'WinAPI_GetKeyboardLayout WinAPI_GetKeyboardLayoutList ' +
	        'WinAPI_GetKeyboardState WinAPI_GetKeyboardType ' +
	        'WinAPI_GetKeyNameText WinAPI_GetKeyState ' +
	        'WinAPI_GetLastActivePopup WinAPI_GetLastError ' +
	        'WinAPI_GetLastErrorMessage WinAPI_GetLayeredWindowAttributes ' +
	        'WinAPI_GetLocaleInfo WinAPI_GetLogicalDrives ' +
	        'WinAPI_GetMapMode WinAPI_GetMemorySize ' +
	        'WinAPI_GetMessageExtraInfo WinAPI_GetModuleFileNameEx ' +
	        'WinAPI_GetModuleHandle WinAPI_GetModuleHandleEx ' +
	        'WinAPI_GetModuleInformation WinAPI_GetMonitorInfo ' +
	        'WinAPI_GetMousePos WinAPI_GetMousePosX WinAPI_GetMousePosY ' +
	        'WinAPI_GetMUILanguage WinAPI_GetNumberFormat WinAPI_GetObject ' +
	        'WinAPI_GetObjectID WinAPI_GetObjectInfoByHandle ' +
	        'WinAPI_GetObjectNameByHandle WinAPI_GetObjectType ' +
	        'WinAPI_GetOpenFileName WinAPI_GetOutlineTextMetrics ' +
	        'WinAPI_GetOverlappedResult WinAPI_GetParent ' +
	        'WinAPI_GetParentProcess WinAPI_GetPerformanceInfo ' +
	        'WinAPI_GetPEType WinAPI_GetPhysicallyInstalledSystemMemory ' +
	        'WinAPI_GetPixel WinAPI_GetPolyFillMode WinAPI_GetPosFromRect ' +
	        'WinAPI_GetPriorityClass WinAPI_GetProcAddress ' +
	        'WinAPI_GetProcessAffinityMask WinAPI_GetProcessCommandLine ' +
	        'WinAPI_GetProcessFileName WinAPI_GetProcessHandleCount ' +
	        'WinAPI_GetProcessID WinAPI_GetProcessIoCounters ' +
	        'WinAPI_GetProcessMemoryInfo WinAPI_GetProcessName ' +
	        'WinAPI_GetProcessShutdownParameters WinAPI_GetProcessTimes ' +
	        'WinAPI_GetProcessUser WinAPI_GetProcessWindowStation ' +
	        'WinAPI_GetProcessWorkingDirectory WinAPI_GetProfilesDirectory ' +
	        'WinAPI_GetPwrCapabilities WinAPI_GetRawInputBuffer ' +
	        'WinAPI_GetRawInputBufferLength WinAPI_GetRawInputData ' +
	        'WinAPI_GetRawInputDeviceInfo WinAPI_GetRegionData ' +
	        'WinAPI_GetRegisteredRawInputDevices ' +
	        'WinAPI_GetRegKeyNameByHandle WinAPI_GetRgnBox WinAPI_GetROP2 ' +
	        'WinAPI_GetRValue WinAPI_GetSaveFileName WinAPI_GetShellWindow ' +
	        'WinAPI_GetStartupInfo WinAPI_GetStdHandle ' +
	        'WinAPI_GetStockObject WinAPI_GetStretchBltMode ' +
	        'WinAPI_GetString WinAPI_GetSysColor WinAPI_GetSysColorBrush ' +
	        'WinAPI_GetSystemDefaultLangID WinAPI_GetSystemDefaultLCID ' +
	        'WinAPI_GetSystemDefaultUILanguage WinAPI_GetSystemDEPPolicy ' +
	        'WinAPI_GetSystemInfo WinAPI_GetSystemMetrics ' +
	        'WinAPI_GetSystemPowerStatus WinAPI_GetSystemTimes ' +
	        'WinAPI_GetSystemWow64Directory WinAPI_GetTabbedTextExtent ' +
	        'WinAPI_GetTempFileName WinAPI_GetTextAlign ' +
	        'WinAPI_GetTextCharacterExtra WinAPI_GetTextColor ' +
	        'WinAPI_GetTextExtentPoint32 WinAPI_GetTextFace ' +
	        'WinAPI_GetTextMetrics WinAPI_GetThemeAppProperties ' +
	        'WinAPI_GetThemeBackgroundContentRect ' +
	        'WinAPI_GetThemeBackgroundExtent WinAPI_GetThemeBackgroundRegion ' +
	        'WinAPI_GetThemeBitmap WinAPI_GetThemeBool ' +
	        'WinAPI_GetThemeColor WinAPI_GetThemeDocumentationProperty ' +
	        'WinAPI_GetThemeEnumValue WinAPI_GetThemeFilename ' +
	        'WinAPI_GetThemeFont WinAPI_GetThemeInt WinAPI_GetThemeMargins ' +
	        'WinAPI_GetThemeMetric WinAPI_GetThemePartSize ' +
	        'WinAPI_GetThemePosition WinAPI_GetThemePropertyOrigin ' +
	        'WinAPI_GetThemeRect WinAPI_GetThemeString ' +
	        'WinAPI_GetThemeSysBool WinAPI_GetThemeSysColor ' +
	        'WinAPI_GetThemeSysColorBrush WinAPI_GetThemeSysFont ' +
	        'WinAPI_GetThemeSysInt WinAPI_GetThemeSysSize ' +
	        'WinAPI_GetThemeSysString WinAPI_GetThemeTextExtent ' +
	        'WinAPI_GetThemeTextMetrics WinAPI_GetThemeTransitionDuration ' +
	        'WinAPI_GetThreadDesktop WinAPI_GetThreadErrorMode ' +
	        'WinAPI_GetThreadLocale WinAPI_GetThreadUILanguage ' +
	        'WinAPI_GetTickCount WinAPI_GetTickCount64 ' +
	        'WinAPI_GetTimeFormat WinAPI_GetTopWindow ' +
	        'WinAPI_GetUDFColorMode WinAPI_GetUpdateRect ' +
	        'WinAPI_GetUpdateRgn WinAPI_GetUserDefaultLangID ' +
	        'WinAPI_GetUserDefaultLCID WinAPI_GetUserDefaultUILanguage ' +
	        'WinAPI_GetUserGeoID WinAPI_GetUserObjectInformation ' +
	        'WinAPI_GetVersion WinAPI_GetVersionEx ' +
	        'WinAPI_GetVolumeInformation WinAPI_GetVolumeInformationByHandle ' +
	        'WinAPI_GetVolumeNameForVolumeMountPoint WinAPI_GetWindow ' +
	        'WinAPI_GetWindowDC WinAPI_GetWindowDisplayAffinity ' +
	        'WinAPI_GetWindowExt WinAPI_GetWindowFileName ' +
	        'WinAPI_GetWindowHeight WinAPI_GetWindowInfo ' +
	        'WinAPI_GetWindowLong WinAPI_GetWindowOrg ' +
	        'WinAPI_GetWindowPlacement WinAPI_GetWindowRect ' +
	        'WinAPI_GetWindowRgn WinAPI_GetWindowRgnBox ' +
	        'WinAPI_GetWindowSubclass WinAPI_GetWindowText ' +
	        'WinAPI_GetWindowTheme WinAPI_GetWindowThreadProcessId ' +
	        'WinAPI_GetWindowWidth WinAPI_GetWorkArea ' +
	        'WinAPI_GetWorldTransform WinAPI_GetXYFromPoint ' +
	        'WinAPI_GlobalMemoryStatus WinAPI_GradientFill ' +
	        'WinAPI_GUIDFromString WinAPI_GUIDFromStringEx WinAPI_HashData ' +
	        'WinAPI_HashString WinAPI_HiByte WinAPI_HideCaret ' +
	        'WinAPI_HiDWord WinAPI_HiWord WinAPI_InflateRect ' +
	        'WinAPI_InitMUILanguage WinAPI_InProcess ' +
	        'WinAPI_IntersectClipRect WinAPI_IntersectRect ' +
	        'WinAPI_IntToDWord WinAPI_IntToFloat WinAPI_InvalidateRect ' +
	        'WinAPI_InvalidateRgn WinAPI_InvertANDBitmap ' +
	        'WinAPI_InvertColor WinAPI_InvertRect WinAPI_InvertRgn ' +
	        'WinAPI_IOCTL WinAPI_IsAlphaBitmap WinAPI_IsBadCodePtr ' +
	        'WinAPI_IsBadReadPtr WinAPI_IsBadStringPtr ' +
	        'WinAPI_IsBadWritePtr WinAPI_IsChild WinAPI_IsClassName ' +
	        'WinAPI_IsDoorOpen WinAPI_IsElevated WinAPI_IsHungAppWindow ' +
	        'WinAPI_IsIconic WinAPI_IsInternetConnected ' +
	        'WinAPI_IsLoadKBLayout WinAPI_IsMemory ' +
	        'WinAPI_IsNameInExpression WinAPI_IsNetworkAlive ' +
	        'WinAPI_IsPathShared WinAPI_IsProcessInJob ' +
	        'WinAPI_IsProcessorFeaturePresent WinAPI_IsRectEmpty ' +
	        'WinAPI_IsThemeActive ' +
	        'WinAPI_IsThemeBackgroundPartiallyTransparent ' +
	        'WinAPI_IsThemePartDefined WinAPI_IsValidLocale ' +
	        'WinAPI_IsWindow WinAPI_IsWindowEnabled WinAPI_IsWindowUnicode ' +
	        'WinAPI_IsWindowVisible WinAPI_IsWow64Process ' +
	        'WinAPI_IsWritable WinAPI_IsZoomed WinAPI_Keybd_Event ' +
	        'WinAPI_KillTimer WinAPI_LineDDA WinAPI_LineTo ' +
	        'WinAPI_LoadBitmap WinAPI_LoadCursor WinAPI_LoadCursorFromFile ' +
	        'WinAPI_LoadIcon WinAPI_LoadIconMetric ' +
	        'WinAPI_LoadIconWithScaleDown WinAPI_LoadImage ' +
	        'WinAPI_LoadIndirectString WinAPI_LoadKeyboardLayout ' +
	        'WinAPI_LoadLibrary WinAPI_LoadLibraryEx WinAPI_LoadMedia ' +
	        'WinAPI_LoadResource WinAPI_LoadShell32Icon WinAPI_LoadString ' +
	        'WinAPI_LoadStringEx WinAPI_LoByte WinAPI_LocalFree ' +
	        'WinAPI_LockDevice WinAPI_LockFile WinAPI_LockResource ' +
	        'WinAPI_LockWindowUpdate WinAPI_LockWorkStation WinAPI_LoDWord ' +
	        'WinAPI_LongMid WinAPI_LookupIconIdFromDirectoryEx ' +
	        'WinAPI_LoWord WinAPI_LPtoDP WinAPI_MAKELANGID ' +
	        'WinAPI_MAKELCID WinAPI_MakeLong WinAPI_MakeQWord ' +
	        'WinAPI_MakeWord WinAPI_MapViewOfFile WinAPI_MapVirtualKey ' +
	        'WinAPI_MaskBlt WinAPI_MessageBeep WinAPI_MessageBoxCheck ' +
	        'WinAPI_MessageBoxIndirect WinAPI_MirrorIcon ' +
	        'WinAPI_ModifyWorldTransform WinAPI_MonitorFromPoint ' +
	        'WinAPI_MonitorFromRect WinAPI_MonitorFromWindow ' +
	        'WinAPI_Mouse_Event WinAPI_MoveFileEx WinAPI_MoveMemory ' +
	        'WinAPI_MoveTo WinAPI_MoveToEx WinAPI_MoveWindow ' +
	        'WinAPI_MsgBox WinAPI_MulDiv WinAPI_MultiByteToWideChar ' +
	        'WinAPI_MultiByteToWideCharEx WinAPI_NtStatusToDosError ' +
	        'WinAPI_OemToChar WinAPI_OffsetClipRgn WinAPI_OffsetPoints ' +
	        'WinAPI_OffsetRect WinAPI_OffsetRgn WinAPI_OffsetWindowOrg ' +
	        'WinAPI_OpenDesktop WinAPI_OpenFileById WinAPI_OpenFileDlg ' +
	        'WinAPI_OpenFileMapping WinAPI_OpenIcon ' +
	        'WinAPI_OpenInputDesktop WinAPI_OpenJobObject WinAPI_OpenMutex ' +
	        'WinAPI_OpenProcess WinAPI_OpenProcessToken ' +
	        'WinAPI_OpenSemaphore WinAPI_OpenThemeData ' +
	        'WinAPI_OpenWindowStation WinAPI_PageSetupDlg ' +
	        'WinAPI_PaintDesktop WinAPI_PaintRgn WinAPI_ParseURL ' +
	        'WinAPI_ParseUserName WinAPI_PatBlt WinAPI_PathAddBackslash ' +
	        'WinAPI_PathAddExtension WinAPI_PathAppend ' +
	        'WinAPI_PathBuildRoot WinAPI_PathCanonicalize ' +
	        'WinAPI_PathCommonPrefix WinAPI_PathCompactPath ' +
	        'WinAPI_PathCompactPathEx WinAPI_PathCreateFromUrl ' +
	        'WinAPI_PathFindExtension WinAPI_PathFindFileName ' +
	        'WinAPI_PathFindNextComponent WinAPI_PathFindOnPath ' +
	        'WinAPI_PathGetArgs WinAPI_PathGetCharType ' +
	        'WinAPI_PathGetDriveNumber WinAPI_PathIsContentType ' +
	        'WinAPI_PathIsDirectory WinAPI_PathIsDirectoryEmpty ' +
	        'WinAPI_PathIsExe WinAPI_PathIsFileSpec ' +
	        'WinAPI_PathIsLFNFileSpec WinAPI_PathIsRelative ' +
	        'WinAPI_PathIsRoot WinAPI_PathIsSameRoot ' +
	        'WinAPI_PathIsSystemFolder WinAPI_PathIsUNC ' +
	        'WinAPI_PathIsUNCServer WinAPI_PathIsUNCServerShare ' +
	        'WinAPI_PathMakeSystemFolder WinAPI_PathMatchSpec ' +
	        'WinAPI_PathParseIconLocation WinAPI_PathRelativePathTo ' +
	        'WinAPI_PathRemoveArgs WinAPI_PathRemoveBackslash ' +
	        'WinAPI_PathRemoveExtension WinAPI_PathRemoveFileSpec ' +
	        'WinAPI_PathRenameExtension WinAPI_PathSearchAndQualify ' +
	        'WinAPI_PathSkipRoot WinAPI_PathStripPath ' +
	        'WinAPI_PathStripToRoot WinAPI_PathToRegion ' +
	        'WinAPI_PathUndecorate WinAPI_PathUnExpandEnvStrings ' +
	        'WinAPI_PathUnmakeSystemFolder WinAPI_PathUnquoteSpaces ' +
	        'WinAPI_PathYetAnotherMakeUniqueName WinAPI_PickIconDlg ' +
	        'WinAPI_PlayEnhMetaFile WinAPI_PlaySound WinAPI_PlgBlt ' +
	        'WinAPI_PointFromRect WinAPI_PolyBezier WinAPI_PolyBezierTo ' +
	        'WinAPI_PolyDraw WinAPI_Polygon WinAPI_PostMessage ' +
	        'WinAPI_PrimaryLangId WinAPI_PrintDlg WinAPI_PrintDlgEx ' +
	        'WinAPI_PrintWindow WinAPI_ProgIDFromCLSID WinAPI_PtInRect ' +
	        'WinAPI_PtInRectEx WinAPI_PtInRegion WinAPI_PtVisible ' +
	        'WinAPI_QueryDosDevice WinAPI_QueryInformationJobObject ' +
	        'WinAPI_QueryPerformanceCounter WinAPI_QueryPerformanceFrequency ' +
	        'WinAPI_RadialGradientFill WinAPI_ReadDirectoryChanges ' +
	        'WinAPI_ReadFile WinAPI_ReadProcessMemory WinAPI_Rectangle ' +
	        'WinAPI_RectInRegion WinAPI_RectIsEmpty WinAPI_RectVisible ' +
	        'WinAPI_RedrawWindow WinAPI_RegCloseKey ' +
	        'WinAPI_RegConnectRegistry WinAPI_RegCopyTree ' +
	        'WinAPI_RegCopyTreeEx WinAPI_RegCreateKey ' +
	        'WinAPI_RegDeleteEmptyKey WinAPI_RegDeleteKey ' +
	        'WinAPI_RegDeleteKeyValue WinAPI_RegDeleteTree ' +
	        'WinAPI_RegDeleteTreeEx WinAPI_RegDeleteValue ' +
	        'WinAPI_RegDisableReflectionKey WinAPI_RegDuplicateHKey ' +
	        'WinAPI_RegEnableReflectionKey WinAPI_RegEnumKey ' +
	        'WinAPI_RegEnumValue WinAPI_RegFlushKey ' +
	        'WinAPI_RegisterApplicationRestart WinAPI_RegisterClass ' +
	        'WinAPI_RegisterClassEx WinAPI_RegisterHotKey ' +
	        'WinAPI_RegisterPowerSettingNotification ' +
	        'WinAPI_RegisterRawInputDevices WinAPI_RegisterShellHookWindow ' +
	        'WinAPI_RegisterWindowMessage WinAPI_RegLoadMUIString ' +
	        'WinAPI_RegNotifyChangeKeyValue WinAPI_RegOpenKey ' +
	        'WinAPI_RegQueryInfoKey WinAPI_RegQueryLastWriteTime ' +
	        'WinAPI_RegQueryMultipleValues WinAPI_RegQueryReflectionKey ' +
	        'WinAPI_RegQueryValue WinAPI_RegRestoreKey WinAPI_RegSaveKey ' +
	        'WinAPI_RegSetValue WinAPI_ReleaseCapture WinAPI_ReleaseDC ' +
	        'WinAPI_ReleaseMutex WinAPI_ReleaseSemaphore ' +
	        'WinAPI_ReleaseStream WinAPI_RemoveClipboardFormatListener ' +
	        'WinAPI_RemoveDirectory WinAPI_RemoveFontMemResourceEx ' +
	        'WinAPI_RemoveFontResourceEx WinAPI_RemoveWindowSubclass ' +
	        'WinAPI_ReOpenFile WinAPI_ReplaceFile WinAPI_ReplaceTextDlg ' +
	        'WinAPI_ResetEvent WinAPI_RestartDlg WinAPI_RestoreDC ' +
	        'WinAPI_RGB WinAPI_RotatePoints WinAPI_RoundRect ' +
	        'WinAPI_SaveDC WinAPI_SaveFileDlg WinAPI_SaveHBITMAPToFile ' +
	        'WinAPI_SaveHICONToFile WinAPI_ScaleWindowExt ' +
	        'WinAPI_ScreenToClient WinAPI_SearchPath WinAPI_SelectClipPath ' +
	        'WinAPI_SelectClipRgn WinAPI_SelectObject ' +
	        'WinAPI_SendMessageTimeout WinAPI_SetActiveWindow ' +
	        'WinAPI_SetArcDirection WinAPI_SetBitmapBits ' +
	        'WinAPI_SetBitmapDimensionEx WinAPI_SetBkColor ' +
	        'WinAPI_SetBkMode WinAPI_SetBoundsRect WinAPI_SetBrushOrg ' +
	        'WinAPI_SetCapture WinAPI_SetCaretBlinkTime WinAPI_SetCaretPos ' +
	        'WinAPI_SetClassLongEx WinAPI_SetColorAdjustment ' +
	        'WinAPI_SetCompression WinAPI_SetCurrentDirectory ' +
	        'WinAPI_SetCurrentProcessExplicitAppUserModelID WinAPI_SetCursor ' +
	        'WinAPI_SetDCBrushColor WinAPI_SetDCPenColor ' +
	        'WinAPI_SetDefaultPrinter WinAPI_SetDeviceGammaRamp ' +
	        'WinAPI_SetDIBColorTable WinAPI_SetDIBits ' +
	        'WinAPI_SetDIBitsToDevice WinAPI_SetDllDirectory ' +
	        'WinAPI_SetEndOfFile WinAPI_SetEnhMetaFileBits ' +
	        'WinAPI_SetErrorMode WinAPI_SetEvent WinAPI_SetFileAttributes ' +
	        'WinAPI_SetFileInformationByHandleEx WinAPI_SetFilePointer ' +
	        'WinAPI_SetFilePointerEx WinAPI_SetFileShortName ' +
	        'WinAPI_SetFileValidData WinAPI_SetFocus WinAPI_SetFont ' +
	        'WinAPI_SetForegroundWindow WinAPI_SetFRBuffer ' +
	        'WinAPI_SetGraphicsMode WinAPI_SetHandleInformation ' +
	        'WinAPI_SetInformationJobObject WinAPI_SetKeyboardLayout ' +
	        'WinAPI_SetKeyboardState WinAPI_SetLastError ' +
	        'WinAPI_SetLayeredWindowAttributes WinAPI_SetLocaleInfo ' +
	        'WinAPI_SetMapMode WinAPI_SetMessageExtraInfo WinAPI_SetParent ' +
	        'WinAPI_SetPixel WinAPI_SetPolyFillMode ' +
	        'WinAPI_SetPriorityClass WinAPI_SetProcessAffinityMask ' +
	        'WinAPI_SetProcessShutdownParameters ' +
	        'WinAPI_SetProcessWindowStation WinAPI_SetRectRgn ' +
	        'WinAPI_SetROP2 WinAPI_SetSearchPathMode ' +
	        'WinAPI_SetStretchBltMode WinAPI_SetSysColors ' +
	        'WinAPI_SetSystemCursor WinAPI_SetTextAlign ' +
	        'WinAPI_SetTextCharacterExtra WinAPI_SetTextColor ' +
	        'WinAPI_SetTextJustification WinAPI_SetThemeAppProperties ' +
	        'WinAPI_SetThreadDesktop WinAPI_SetThreadErrorMode ' +
	        'WinAPI_SetThreadExecutionState WinAPI_SetThreadLocale ' +
	        'WinAPI_SetThreadUILanguage WinAPI_SetTimer ' +
	        'WinAPI_SetUDFColorMode WinAPI_SetUserGeoID ' +
	        'WinAPI_SetUserObjectInformation WinAPI_SetVolumeMountPoint ' +
	        'WinAPI_SetWindowDisplayAffinity WinAPI_SetWindowExt ' +
	        'WinAPI_SetWindowLong WinAPI_SetWindowOrg ' +
	        'WinAPI_SetWindowPlacement WinAPI_SetWindowPos ' +
	        'WinAPI_SetWindowRgn WinAPI_SetWindowsHookEx ' +
	        'WinAPI_SetWindowSubclass WinAPI_SetWindowText ' +
	        'WinAPI_SetWindowTheme WinAPI_SetWinEventHook ' +
	        'WinAPI_SetWorldTransform WinAPI_SfcIsFileProtected ' +
	        'WinAPI_SfcIsKeyProtected WinAPI_ShellAboutDlg ' +
	        'WinAPI_ShellAddToRecentDocs WinAPI_ShellChangeNotify ' +
	        'WinAPI_ShellChangeNotifyDeregister ' +
	        'WinAPI_ShellChangeNotifyRegister WinAPI_ShellCreateDirectory ' +
	        'WinAPI_ShellEmptyRecycleBin WinAPI_ShellExecute ' +
	        'WinAPI_ShellExecuteEx WinAPI_ShellExtractAssociatedIcon ' +
	        'WinAPI_ShellExtractIcon WinAPI_ShellFileOperation ' +
	        'WinAPI_ShellFlushSFCache WinAPI_ShellGetFileInfo ' +
	        'WinAPI_ShellGetIconOverlayIndex WinAPI_ShellGetImageList ' +
	        'WinAPI_ShellGetKnownFolderIDList WinAPI_ShellGetKnownFolderPath ' +
	        'WinAPI_ShellGetLocalizedName WinAPI_ShellGetPathFromIDList ' +
	        'WinAPI_ShellGetSetFolderCustomSettings WinAPI_ShellGetSettings ' +
	        'WinAPI_ShellGetSpecialFolderLocation ' +
	        'WinAPI_ShellGetSpecialFolderPath WinAPI_ShellGetStockIconInfo ' +
	        'WinAPI_ShellILCreateFromPath WinAPI_ShellNotifyIcon ' +
	        'WinAPI_ShellNotifyIconGetRect WinAPI_ShellObjectProperties ' +
	        'WinAPI_ShellOpenFolderAndSelectItems WinAPI_ShellOpenWithDlg ' +
	        'WinAPI_ShellQueryRecycleBin ' +
	        'WinAPI_ShellQueryUserNotificationState ' +
	        'WinAPI_ShellRemoveLocalizedName WinAPI_ShellRestricted ' +
	        'WinAPI_ShellSetKnownFolderPath WinAPI_ShellSetLocalizedName ' +
	        'WinAPI_ShellSetSettings WinAPI_ShellStartNetConnectionDlg ' +
	        'WinAPI_ShellUpdateImage WinAPI_ShellUserAuthenticationDlg ' +
	        'WinAPI_ShellUserAuthenticationDlgEx WinAPI_ShortToWord ' +
	        'WinAPI_ShowCaret WinAPI_ShowCursor WinAPI_ShowError ' +
	        'WinAPI_ShowLastError WinAPI_ShowMsg WinAPI_ShowOwnedPopups ' +
	        'WinAPI_ShowWindow WinAPI_ShutdownBlockReasonCreate ' +
	        'WinAPI_ShutdownBlockReasonDestroy ' +
	        'WinAPI_ShutdownBlockReasonQuery WinAPI_SizeOfResource ' +
	        'WinAPI_StretchBlt WinAPI_StretchDIBits ' +
	        'WinAPI_StrFormatByteSize WinAPI_StrFormatByteSizeEx ' +
	        'WinAPI_StrFormatKBSize WinAPI_StrFromTimeInterval ' +
	        'WinAPI_StringFromGUID WinAPI_StringLenA WinAPI_StringLenW ' +
	        'WinAPI_StrLen WinAPI_StrokeAndFillPath WinAPI_StrokePath ' +
	        'WinAPI_StructToArray WinAPI_SubLangId WinAPI_SubtractRect ' +
	        'WinAPI_SwapDWord WinAPI_SwapQWord WinAPI_SwapWord ' +
	        'WinAPI_SwitchColor WinAPI_SwitchDesktop ' +
	        'WinAPI_SwitchToThisWindow WinAPI_SystemParametersInfo ' +
	        'WinAPI_TabbedTextOut WinAPI_TerminateJobObject ' +
	        'WinAPI_TerminateProcess WinAPI_TextOut WinAPI_TileWindows ' +
	        'WinAPI_TrackMouseEvent WinAPI_TransparentBlt ' +
	        'WinAPI_TwipsPerPixelX WinAPI_TwipsPerPixelY ' +
	        'WinAPI_UnhookWindowsHookEx WinAPI_UnhookWinEvent ' +
	        'WinAPI_UnionRect WinAPI_UnionStruct WinAPI_UniqueHardwareID ' +
	        'WinAPI_UnloadKeyboardLayout WinAPI_UnlockFile ' +
	        'WinAPI_UnmapViewOfFile WinAPI_UnregisterApplicationRestart ' +
	        'WinAPI_UnregisterClass WinAPI_UnregisterHotKey ' +
	        'WinAPI_UnregisterPowerSettingNotification ' +
	        'WinAPI_UpdateLayeredWindow WinAPI_UpdateLayeredWindowEx ' +
	        'WinAPI_UpdateLayeredWindowIndirect WinAPI_UpdateResource ' +
	        'WinAPI_UpdateWindow WinAPI_UrlApplyScheme ' +
	        'WinAPI_UrlCanonicalize WinAPI_UrlCombine WinAPI_UrlCompare ' +
	        'WinAPI_UrlCreateFromPath WinAPI_UrlFixup WinAPI_UrlGetPart ' +
	        'WinAPI_UrlHash WinAPI_UrlIs WinAPI_UserHandleGrantAccess ' +
	        'WinAPI_ValidateRect WinAPI_ValidateRgn WinAPI_VerQueryRoot ' +
	        'WinAPI_VerQueryValue WinAPI_VerQueryValueEx ' +
	        'WinAPI_WaitForInputIdle WinAPI_WaitForMultipleObjects ' +
	        'WinAPI_WaitForSingleObject WinAPI_WideCharToMultiByte ' +
	        'WinAPI_WidenPath WinAPI_WindowFromDC WinAPI_WindowFromPoint ' +
	        'WinAPI_WordToShort WinAPI_Wow64EnableWow64FsRedirection ' +
	        'WinAPI_WriteConsole WinAPI_WriteFile ' +
	        'WinAPI_WriteProcessMemory WinAPI_ZeroMemory ' +
	        'WinNet_AddConnection WinNet_AddConnection2 ' +
	        'WinNet_AddConnection3 WinNet_CancelConnection ' +
	        'WinNet_CancelConnection2 WinNet_CloseEnum ' +
	        'WinNet_ConnectionDialog WinNet_ConnectionDialog1 ' +
	        'WinNet_DisconnectDialog WinNet_DisconnectDialog1 ' +
	        'WinNet_EnumResource WinNet_GetConnection ' +
	        'WinNet_GetConnectionPerformance WinNet_GetLastError ' +
	        'WinNet_GetNetworkInformation WinNet_GetProviderName ' +
	        'WinNet_GetResourceInformation WinNet_GetResourceParent ' +
	        'WinNet_GetUniversalName WinNet_GetUser WinNet_OpenEnum ' +
	        'WinNet_RestoreConnection WinNet_UseConnection Word_Create ' +
	        'Word_DocAdd Word_DocAttach Word_DocClose Word_DocExport ' +
	        'Word_DocFind Word_DocFindReplace Word_DocGet ' +
	        'Word_DocLinkAdd Word_DocLinkGet Word_DocOpen ' +
	        'Word_DocPictureAdd Word_DocPrint Word_DocRangeSet ' +
	        'Word_DocSave Word_DocSaveAs Word_DocTableRead ' +
	        'Word_DocTableWrite Word_Quit',

	        COMMENT = {
	            variants: [
	              hljs.COMMENT(';', '$', {relevance: 0}),
	              hljs.COMMENT('#cs', '#ce'),
	              hljs.COMMENT('#comments-start', '#comments-end')
	            ]
	        },

	        VARIABLE = {
	            className: 'variable',
	            begin: '\\$[A-z0-9_]+'
	        },

	        STRING = {
	            className: 'string',
	            variants: [{
	                begin: /"/,
	                end: /"/,
	                contains: [{
	                    begin: /""/,
	                    relevance: 0
	                }]
	            }, {
	                begin: /'/,
	                end: /'/,
	                contains: [{
	                    begin: /''/,
	                    relevance: 0
	                }]
	            }]
	        },

	        NUMBER = {
	            variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]
	        },

	        PREPROCESSOR = {
	            className: 'preprocessor',
	            begin: '#',
	            end: '$',
	            keywords: 'include include-once NoTrayIcon OnAutoItStartRegister RequireAdmin pragma ' +
	                'Au3Stripper_Ignore_Funcs Au3Stripper_Ignore_Variables ' +
	                'Au3Stripper_Off Au3Stripper_On Au3Stripper_Parameters ' +
	                'AutoIt3Wrapper_Add_Constants AutoIt3Wrapper_Au3Check_Parameters ' +
	                'AutoIt3Wrapper_Au3Check_Stop_OnWarning AutoIt3Wrapper_Aut2Exe ' +
	                'AutoIt3Wrapper_AutoIt3 AutoIt3Wrapper_AutoIt3Dir ' +
	                'AutoIt3Wrapper_Change2CUI AutoIt3Wrapper_Compile_Both ' +
	                'AutoIt3Wrapper_Compression AutoIt3Wrapper_EndIf ' +
	                'AutoIt3Wrapper_Icon AutoIt3Wrapper_If_Compile ' +
	                'AutoIt3Wrapper_If_Run AutoIt3Wrapper_Jump_To_First_Error ' +
	                'AutoIt3Wrapper_OutFile AutoIt3Wrapper_OutFile_Type ' +
	                'AutoIt3Wrapper_OutFile_X64 AutoIt3Wrapper_PlugIn_Funcs ' +
	                'AutoIt3Wrapper_Res_Comment Autoit3Wrapper_Res_Compatibility ' +
	                'AutoIt3Wrapper_Res_Description AutoIt3Wrapper_Res_Field ' +
	                'AutoIt3Wrapper_Res_File_Add AutoIt3Wrapper_Res_FileVersion ' +
	                'AutoIt3Wrapper_Res_FileVersion_AutoIncrement ' +
	                'AutoIt3Wrapper_Res_Icon_Add AutoIt3Wrapper_Res_Language ' +
	                'AutoIt3Wrapper_Res_LegalCopyright ' +
	                'AutoIt3Wrapper_Res_ProductVersion ' +
	                'AutoIt3Wrapper_Res_requestedExecutionLevel ' +
	                'AutoIt3Wrapper_Res_SaveSource AutoIt3Wrapper_Run_After ' +
	                'AutoIt3Wrapper_Run_Au3Check AutoIt3Wrapper_Run_Au3Stripper ' +
	                'AutoIt3Wrapper_Run_Before AutoIt3Wrapper_Run_Debug_Mode ' +
	                'AutoIt3Wrapper_Run_SciTE_Minimized ' +
	                'AutoIt3Wrapper_Run_SciTE_OutputPane_Minimized ' +
	                'AutoIt3Wrapper_Run_Tidy AutoIt3Wrapper_ShowProgress ' +
	                'AutoIt3Wrapper_Testing AutoIt3Wrapper_Tidy_Stop_OnError ' +
	                'AutoIt3Wrapper_UPX_Parameters AutoIt3Wrapper_UseUPX ' +
	                'AutoIt3Wrapper_UseX64 AutoIt3Wrapper_Version ' +
	                'AutoIt3Wrapper_Versioning AutoIt3Wrapper_Versioning_Parameters ' +
	                'Tidy_Off Tidy_On Tidy_Parameters EndRegion Region',
	            contains: [{
	                    begin: /\\\n/,
	                    relevance: 0
	                }, {
	                    beginKeywords: 'include',
	                    end: '$',
	                    contains: [
	                        STRING, {
	                            className: 'string',
	                            variants: [{
	                                begin: '<',
	                                end: '>'
	                            }, {
	                                begin: /"/,
	                                end: /"/,
	                                contains: [{
	                                    begin: /""/,
	                                    relevance: 0
	                                }]
	                            }, {
	                                begin: /'/,
	                                end: /'/,
	                                contains: [{
	                                    begin: /''/,
	                                    relevance: 0
	                                }]
	                            }]
	                        }
	                    ]
	                },
	                STRING,
	                COMMENT
	            ]
	        },

	        CONSTANT = {
	            className: 'constant',
	            // begin: '@',
	            // end: '$',
	            // keywords: 'AppDataCommonDir AppDataDir AutoItExe AutoItPID AutoItVersion AutoItX64 COM_EventObj CommonFilesDir Compiled ComputerName ComSpec CPUArch CR CRLF DesktopCommonDir DesktopDepth DesktopDir DesktopHeight DesktopRefresh DesktopWidth DocumentsCommonDir error exitCode exitMethod extended FavoritesCommonDir FavoritesDir GUI_CtrlHandle GUI_CtrlId GUI_DragFile GUI_DragId GUI_DropId GUI_WinHandle HomeDrive HomePath HomeShare HotKeyPressed HOUR IPAddress1 IPAddress2 IPAddress3 IPAddress4 KBLayout LF LocalAppDataDir LogonDNSDomain LogonDomain LogonServer MDAY MIN MON MSEC MUILang MyDocumentsDir NumParams OSArch OSBuild OSLang OSServicePack OSType OSVersion ProgramFilesDir ProgramsCommonDir ProgramsDir ScriptDir ScriptFullPath ScriptLineNumber ScriptName SEC StartMenuCommonDir StartMenuDir StartupCommonDir StartupDir SW_DISABLE SW_ENABLE SW_HIDE SW_LOCK SW_MAXIMIZE SW_MINIMIZE SW_RESTORE SW_SHOW SW_SHOWDEFAULT SW_SHOWMAXIMIZED SW_SHOWMINIMIZED SW_SHOWMINNOACTIVE SW_SHOWNA SW_SHOWNOACTIVATE SW_SHOWNORMAL SW_UNLOCK SystemDir TAB TempDir TRAY_ID TrayIconFlashing TrayIconVisible UserName UserProfileDir WDAY WindowsDir WorkingDir YDAY YEAR',
	            // relevance: 5
	            begin: '@[A-z0-9_]+'
	        },

	        FUNCTION = {
	            className: 'function',
	            beginKeywords: 'Func',
	            end: '$',
	            excludeEnd: true,
	            illegal: '\\$|\\[|%',
	            contains: [
	                hljs.UNDERSCORE_TITLE_MODE, {
	                    className: 'params',
	                    begin: '\\(',
	                    end: '\\)',
	                    contains: [
	                        VARIABLE,
	                        STRING,
	                        NUMBER
	                    ]
	                }
	            ]
	        };

	    return {
	        case_insensitive: true,
	        illegal: /\/\*/,
	        keywords: {
	            keyword: KEYWORDS,
	            built_in: BUILT_IN,
	            literal: LITERAL
	        },
	        contains: [
	            COMMENT,
	            VARIABLE,
	            STRING,
	            NUMBER,
	            PREPROCESSOR,
	            CONSTANT,
	            FUNCTION
	        ]
	    }
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    case_insensitive: true,
	    lexemes: '\\.?' + hljs.IDENT_RE,
	    keywords: {
	      keyword:
	        /* mnemonic */
	        'adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs ' +
	        'brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr ' +
	        'clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor ' +
	        'fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul ' +
	        'muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs ' +
	        'sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub ' +
	        'subi swap tst wdr',
	      built_in:
	        /* general purpose registers */
	        'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 ' +
	        'r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ' +
	        /* IO Registers (ATMega128) */
	        'ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h ' +
	        'tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ' +
	        'ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ' +
	        'ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk ' +
	        'tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ' +
	        'ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr ' +
	        'porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ' +
	        'ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf',
	      preprocessor:
	        '.byte .cseg .db .def .device .dseg .dw .endmacro .equ .eseg .exit .include .list ' +
	        '.listmac .macro .nolist .org .set'
	    },
	    contains: [
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.COMMENT(
	        ';',
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      hljs.C_NUMBER_MODE, // 0x..., decimal, float
	      hljs.BINARY_NUMBER_MODE, // 0b...
	      {
	        className: 'number',
	        begin: '\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)' // $..., 0o...
	      },
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: '\'', end: '[^\\\\]\'',
	        illegal: '[^\\\\][^\']'
	      },
	      {className: 'label',  begin: '^[A-Za-z0-9_.$]+:'},
	      {className: 'preprocessor', begin: '#', end: '$'},
	      {  // подстановка в «.macro»
	        className: 'localvars',
	        begin: '@[0-9]+'
	      }
	    ]
	  };
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: 'false int abstract private char boolean static null if for true ' +
	      'while long throw finally protected final return void enum else ' +
	      'break new catch byte super case short default double public try this switch ' +
	      'continue reverse firstfast firstonly forupdate nofetch sum avg minof maxof count ' +
	      'order group by asc desc index hint like dispaly edit client server ttsbegin ' +
	      'ttscommit str real date container anytype common div mod',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$'
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        illegal: ':',
	        contains: [
	          {beginKeywords: 'extends implements'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VAR = {
	    className: 'variable',
	    variants: [
	      {begin: /\$[\w\d#@][\w\d_]*/},
	      {begin: /\$\{(.*?)}/}
	    ]
	  };
	  var QUOTE_STRING = {
	    className: 'string',
	    begin: /"/, end: /"/,
	    contains: [
	      hljs.BACKSLASH_ESCAPE,
	      VAR,
	      {
	        className: 'variable',
	        begin: /\$\(/, end: /\)/,
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }
	    ]
	  };
	  var APOS_STRING = {
	    className: 'string',
	    begin: /'/, end: /'/
	  };

	  return {
	    aliases: ['sh', 'zsh'],
	    lexemes: /-?[a-z\.]+/,
	    keywords: {
	      keyword:
	        'if then else elif fi for while in do done case esac function',
	      literal:
	        'true false',
	      built_in:
	        // Shell built-ins
	        // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
	        'break cd continue eval exec exit export getopts hash pwd readonly return shift test times ' +
	        'trap umask unset ' +
	        // Bash built-ins
	        'alias bind builtin caller command declare echo enable help let local logout mapfile printf ' +
	        'read readarray source type typeset ulimit unalias ' +
	        // Shell modifiers
	        'set shopt ' +
	        // Zsh built-ins
	        'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles ' +
	        'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate ' +
	        'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print ' +
	        'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit ' +
	        'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof ' +
	        'zpty zregexparse zsocket zstyle ztcp',
	      operator:
	        '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
	    },
	    contains: [
	      {
	        className: 'shebang',
	        begin: /^#![^\n]+sh\s*$/,
	        relevance: 10
	      },
	      {
	        className: 'function',
	        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
	        returnBegin: true,
	        contains: [hljs.inherit(hljs.TITLE_MODE, {begin: /\w[\w\d_]*/})],
	        relevance: 0
	      },
	      hljs.HASH_COMMENT_MODE,
	      hljs.NUMBER_MODE,
	      QUOTE_STRING,
	      APOS_STRING,
	      VAR
	    ]
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = function(hljs){
	  var LITERAL = {
	    className: 'literal',
	    begin: '[\\+\\-]',
	    relevance: 0
	  };
	  return {
	    aliases: ['bf'],
	    contains: [
	      hljs.COMMENT(
	        '[^\\[\\]\\.,\\+\\-<> \r\n]',
	        '[\\[\\]\\.,\\+\\-<> \r\n]',
	        {
	          returnEnd: true,
	          relevance: 0
	        }
	      ),
	      {
	        className: 'title',
	        begin: '[\\[\\]]',
	        relevance: 0
	      },
	      {
	        className: 'string',
	        begin: '[\\.,]',
	        relevance: 0
	      },
	      {
	        // this mode works as the only relevance counter
	        begin: /\+\+|\-\-/, returnBegin: true,
	        contains: [LITERAL]
	      },
	      LITERAL
	    ]
	  };
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS =
	    'div mod in and or not xor asserterror begin case do downto else end exit for if of repeat then to ' +
	    'until while with var';
	  var LITERALS = 'false true';
	  var COMMENT_MODES = [
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.COMMENT(
	      /\{/,
	      /\}/,
	      {
	        relevance: 0
	      }
	    ),
	    hljs.COMMENT(
	      /\(\*/,
	      /\*\)/,
	      {
	        relevance: 10
	      }
	    )
	  ];
	  var STRING = {
	    className: 'string',
	    begin: /'/, end: /'/,
	    contains: [{begin: /''/}]
	  };
	  var CHAR_STRING = {
	    className: 'string', begin: /(#\d+)+/
	  };
	  var DATE = {
	      className: 'date',
	      begin: '\\b\\d+(\\.\\d+)?(DT|D|T)',
	      relevance: 0
	  };
	  var DBL_QUOTED_VARIABLE = {
	      className: 'variable',
	      begin: '"',
	      end: '"'
	  };

	  var PROCEDURE = {
	    className: 'function',
	    beginKeywords: 'procedure', end: /[:;]/,
	    keywords: 'procedure|10',
	    contains: [
	      hljs.TITLE_MODE,
	      {
	        className: 'params',
	        begin: /\(/, end: /\)/,
	        keywords: KEYWORDS,
	        contains: [STRING, CHAR_STRING]
	      }
	    ].concat(COMMENT_MODES)
	  };

	  var OBJECT = {
	    className: 'class',
	    begin: 'OBJECT (Table|Form|Report|Dataport|Codeunit|XMLport|MenuSuite|Page|Query) (\\d+) ([^\\r\\n]+)',
	    returnBegin: true,
	    contains: [
	      hljs.TITLE_MODE,
	        PROCEDURE
	    ]
	  };

	  return {
	    case_insensitive: true,
	    keywords: { keyword: KEYWORDS, literal: LITERALS },
	    illegal: /\/\*/,
	    contains: [
	      STRING, CHAR_STRING,
	      DATE, DBL_QUOTED_VARIABLE,
	      hljs.NUMBER_MODE,
	      OBJECT,
	      PROCEDURE
	    ]
	  };
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['capnp'],
	    keywords: {
	      keyword:
	        'struct enum interface union group import using const annotation extends in of on as with from fixed',
	      built_in:
	        'Void Bool Int8 Int16 Int32 Int64 UInt8 UInt16 UInt32 UInt64 Float32 Float64 ' +
	        'Text Data AnyPointer AnyStruct Capability List',
	      literal:
	        'true false'
	    },
	    contains: [
	      hljs.QUOTE_STRING_MODE,
	      hljs.NUMBER_MODE,
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'shebang',
	        begin: /@0x[\w\d]{16};/,
	        illegal: /\n/
	      },
	      {
	        className: 'number',
	        begin: /@\d+\b/
	      },
	      {
	        className: 'class',
	        beginKeywords: 'struct enum', end: /\{/,
	        illegal: /\n/,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {
	            starts: {endsWithParent: true, excludeEnd: true} // hack: eating everything after the first title
	          })
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'interface', end: /\{/,
	        illegal: /\n/,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {
	            starts: {endsWithParent: true, excludeEnd: true} // hack: eating everything after the first title
	          })
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  // 2.3. Identifiers and keywords
	  var KEYWORDS =
	    'assembly module package import alias class interface object given value ' +
	    'assign void function new of extends satisfies abstracts in out return ' +
	    'break continue throw assert dynamic if else switch case for while try ' +
	    'catch finally then let this outer super is exists nonempty';
	  // 7.4.1 Declaration Modifiers
	  var DECLARATION_MODIFIERS =
	    'shared abstract formal default actual variable late native deprecated' +
	    'final sealed annotation suppressWarnings small';
	  // 7.4.2 Documentation
	  var DOCUMENTATION =
	    'doc by license see throws tagged';
	  var LANGUAGE_ANNOTATIONS = DECLARATION_MODIFIERS + ' ' + DOCUMENTATION;
	  var SUBST = {
	    className: 'subst', excludeBegin: true, excludeEnd: true,
	    begin: /``/, end: /``/,
	    keywords: KEYWORDS,
	    relevance: 10
	  };
	  var EXPRESSIONS = [
	    {
	      // verbatim string
	      className: 'string',
	      begin: '"""',
	      end: '"""',
	      relevance: 10
	    },
	    {
	      // string literal or template
	      className: 'string',
	      begin: '"', end: '"',
	      contains: [SUBST]
	    },
	    {
	      // character literal
	      className: 'string',
	      begin: "'",
	      end: "'"
	    },
	    {
	      // numeric literal
	      className: 'number',
	      begin: '#[0-9a-fA-F_]+|\\$[01_]+|[0-9_]+(?:\\.[0-9_](?:[eE][+-]?\\d+)?)?[kMGTPmunpf]?',
	      relevance: 0
	    }
	  ];
	  SUBST.contains = EXPRESSIONS;

	  return {
	    keywords: {
	      keyword: KEYWORDS,
	      annotation: LANGUAGE_ANNOTATIONS
	    },
	    illegal: '\\$[^01]|#[^0-9a-fA-F]',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.COMMENT('/\\*', '\\*/', {contains: ['self']}),
	      {
	        // compiler annotation
	        className: 'annotation',
	        begin: '@[a-z]\\w*(?:\\:\"[^\"]*\")?'
	      }
	    ].concat(EXPRESSIONS)
	  };
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var keywords = {
	    built_in:
	      // Clojure keywords
	      'def defonce cond apply if-not if-let if not not= = < > <= >= == + / * - rem '+
	      'quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? '+
	      'set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? '+
	      'class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? '+
	      'string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . '+
	      'inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last '+
	      'drop-while while intern condp case reduced cycle split-at split-with repeat replicate '+
	      'iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext '+
	      'nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends '+
	      'add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler '+
	      'set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter '+
	      'monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or '+
	      'when when-not when-let comp juxt partial sequence memoize constantly complement identity assert '+
	      'peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast '+
	      'sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import '+
	      'refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! '+
	      'assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger '+
	      'bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline '+
	      'flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking '+
	      'assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! '+
	      'reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! '+
	      'new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty '+
	      'hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list '+
	      'disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer '+
	      'chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate '+
	      'unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta '+
	      'lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize'
	   };

	  var SYMBOLSTART = 'a-zA-Z_\\-!.?+*=<>&#\'';
	  var SYMBOL_RE = '[' + SYMBOLSTART + '][' + SYMBOLSTART + '0-9/;:]*';
	  var SIMPLE_NUMBER_RE = '[-+]?\\d+(\\.\\d+)?';

	  var SYMBOL = {
	    begin: SYMBOL_RE,
	    relevance: 0
	  };
	  var NUMBER = {
	    className: 'number', begin: SIMPLE_NUMBER_RE,
	    relevance: 0
	  };
	  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null});
	  var COMMENT = hljs.COMMENT(
	    ';',
	    '$',
	    {
	      relevance: 0
	    }
	  );
	  var LITERAL = {
	    className: 'literal',
	    begin: /\b(true|false|nil)\b/
	  };
	  var COLLECTION = {
	    className: 'collection',
	    begin: '[\\[\\{]', end: '[\\]\\}]'
	  };
	  var HINT = {
	    className: 'comment',
	    begin: '\\^' + SYMBOL_RE
	  };
	  var HINT_COL = hljs.COMMENT('\\^\\{', '\\}');
	  var KEY = {
	    className: 'attribute',
	    begin: '[:]' + SYMBOL_RE
	  };
	  var LIST = {
	    className: 'list',
	    begin: '\\(', end: '\\)'
	  };
	  var BODY = {
	    endsWithParent: true,
	    relevance: 0
	  };
	  var NAME = {
	    keywords: keywords,
	    lexemes: SYMBOL_RE,
	    className: 'keyword', begin: SYMBOL_RE,
	    starts: BODY
	  };
	  var DEFAULT_CONTAINS = [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER, LITERAL, SYMBOL];

	  LIST.contains = [hljs.COMMENT('comment', ''), NAME, BODY];
	  BODY.contains = DEFAULT_CONTAINS;
	  COLLECTION.contains = DEFAULT_CONTAINS;

	  return {
	    aliases: ['clj'],
	    illegal: /\S/,
	    contains: [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER, LITERAL]
	  }
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    contains: [
	      {
	        className: 'prompt',
	        begin: /^([\w.-]+|\s*#_)=>/,
	        starts: {
	          end: /$/,
	          subLanguage: 'clojure'
	        }
	      }
	    ]
	  }
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['cmake.in'],
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'add_custom_command add_custom_target add_definitions add_dependencies ' +
	        'add_executable add_library add_subdirectory add_test aux_source_directory ' +
	        'break build_command cmake_minimum_required cmake_policy configure_file ' +
	        'create_test_sourcelist define_property else elseif enable_language enable_testing ' +
	        'endforeach endfunction endif endmacro endwhile execute_process export find_file ' +
	        'find_library find_package find_path find_program fltk_wrap_ui foreach function ' +
	        'get_cmake_property get_directory_property get_filename_component get_property ' +
	        'get_source_file_property get_target_property get_test_property if include ' +
	        'include_directories include_external_msproject include_regular_expression install ' +
	        'link_directories load_cache load_command macro mark_as_advanced message option ' +
	        'output_required_files project qt_wrap_cpp qt_wrap_ui remove_definitions return ' +
	        'separate_arguments set set_directory_properties set_property ' +
	        'set_source_files_properties set_target_properties set_tests_properties site_name ' +
	        'source_group string target_link_libraries try_compile try_run unset variable_watch ' +
	        'while build_name exec_program export_library_dependencies install_files ' +
	        'install_programs install_targets link_libraries make_directory remove subdir_depends ' +
	        'subdirs use_mangled_mesa utility_source variable_requires write_file ' +
	        'qt5_use_modules qt5_use_package qt5_wrap_cpp on off true false and or',
	      operator:
	        'equal less greater strless strgreater strequal matches'
	    },
	    contains: [
	      {
	        className: 'envvar',
	        begin: '\\${', end: '}'
	      },
	      hljs.HASH_COMMENT_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS = {
	    keyword:
	      // JS keywords
	      'in if for while finally new do return else break catch instanceof throw try this ' +
	      'switch continue typeof delete debugger super ' +
	      // Coffee keywords
	      'then unless until loop of by when and or is isnt not',
	    literal:
	      // JS literals
	      'true false null undefined ' +
	      // Coffee literals
	      'yes no on off',
	    built_in:
	      'npm require console print module global window document'
	  };
	  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
	  var SUBST = {
	    className: 'subst',
	    begin: /#\{/, end: /}/,
	    keywords: KEYWORDS
	  };
	  var EXPRESSIONS = [
	    hljs.BINARY_NUMBER_MODE,
	    hljs.inherit(hljs.C_NUMBER_MODE, {starts: {end: '(\\s*/)?', relevance: 0}}), // a number tries to eat the following slash to prevent treating it as a regexp
	    {
	      className: 'string',
	      variants: [
	        {
	          begin: /'''/, end: /'''/,
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: /'/, end: /'/,
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: /"""/, end: /"""/,
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	        },
	        {
	          begin: /"/, end: /"/,
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	        }
	      ]
	    },
	    {
	      className: 'regexp',
	      variants: [
	        {
	          begin: '///', end: '///',
	          contains: [SUBST, hljs.HASH_COMMENT_MODE]
	        },
	        {
	          begin: '//[gim]*',
	          relevance: 0
	        },
	        {
	          // regex can't start with space to parse x / 2 / 3 as two divisions
	          // regex can't start with *, and it supports an "illegal" in the main mode
	          begin: /\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/
	        }
	      ]
	    },
	    {
	      className: 'property',
	      begin: '@' + JS_IDENT_RE
	    },
	    {
	      begin: '`', end: '`',
	      excludeBegin: true, excludeEnd: true,
	      subLanguage: 'javascript'
	    }
	  ];
	  SUBST.contains = EXPRESSIONS;

	  var TITLE = hljs.inherit(hljs.TITLE_MODE, {begin: JS_IDENT_RE});
	  var PARAMS_RE = '(\\(.*\\))?\\s*\\B[-=]>';
	  var PARAMS = {
	    className: 'params',
	    begin: '\\([^\\(]', returnBegin: true,
	    /* We need another contained nameless mode to not have every nested
	    pair of parens to be called "params" */
	    contains: [{
	      begin: /\(/, end: /\)/,
	      keywords: KEYWORDS,
	      contains: ['self'].concat(EXPRESSIONS)
	    }]
	  };

	  return {
	    aliases: ['coffee', 'cson', 'iced'],
	    keywords: KEYWORDS,
	    illegal: /\/\*/,
	    contains: EXPRESSIONS.concat([
	      hljs.COMMENT('###', '###'),
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'function',
	        begin: '^\\s*' + JS_IDENT_RE + '\\s*=\\s*' + PARAMS_RE, end: '[-=]>',
	        returnBegin: true,
	        contains: [TITLE, PARAMS]
	      },
	      {
	        // anonymous function start
	        begin: /[:\(,=]\s*/,
	        relevance: 0,
	        contains: [
	          {
	            className: 'function',
	            begin: PARAMS_RE, end: '[-=]>',
	            returnBegin: true,
	            contains: [PARAMS]
	          }
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class',
	        end: '$',
	        illegal: /[:="\[\]]/,
	        contains: [
	          {
	            beginKeywords: 'extends',
	            endsWithParent: true,
	            illegal: /[:="\[\]]/,
	            contains: [TITLE]
	          },
	          TITLE
	        ]
	      },
	      {
	        className: 'attribute',
	        begin: JS_IDENT_RE + ':', end: ':',
	        returnBegin: true, returnEnd: true,
	        relevance: 0
	      }
	    ])
	  };
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var CPP_PRIMATIVE_TYPES = {
	    className: 'keyword',
	    begin: '\\b[a-z\\d_]*_t\\b'
	  };

	  var STRINGS = {
	    className: 'string',
	    variants: [
	      hljs.inherit(hljs.QUOTE_STRING_MODE, { begin: '((u8?|U)|L)?"' }),
	      {
	        begin: '(u8?|U)?R"', end: '"',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      },
	      {
	        begin: '\'\\\\?.', end: '\'',
	        illegal: '.'
	      }
	    ]
	  };

	  var NUMBERS = {
	    className: 'number',
	    variants: [
	      { begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)' },
	      { begin: hljs.C_NUMBER_RE }
	    ]
	  };

	  var PREPROCESSOR =       {
	    className: 'preprocessor',
	    begin: '#', end: '$',
	    keywords: 'if else elif endif define undef warning error line ' +
	              'pragma ifdef ifndef',
	    contains: [
	      {
	        begin: /\\\n/, relevance: 0
	      },
	      {
	        beginKeywords: 'include', end: '$',
	        contains: [
	          STRINGS,
	          {
	            className: 'string',
	            begin: '<', end: '>',
	            illegal: '\\n',
	          }
	        ]
	      },
	      STRINGS,
	      NUMBERS,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE
	    ]
	  };

	  var FUNCTION_TITLE = hljs.IDENT_RE + '\\s*\\(';

	  var CPP_KEYWORDS = {
	    keyword: 'int float while private char catch export virtual operator sizeof ' +
	      'dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace ' +
	      'unsigned long volatile static protected bool template mutable if public friend ' +
	      'do goto auto void enum else break extern using class asm case typeid ' +
	      'short reinterpret_cast|10 default double register explicit signed typename try this ' +
	      'switch continue inline delete alignof constexpr decltype ' +
	      'noexcept static_assert thread_local restrict _Bool complex _Complex _Imaginary ' +
	      'atomic_bool atomic_char atomic_schar ' +
	      'atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong ' +
	      'atomic_ullong',
	    built_in: 'std string cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream ' +
	      'auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set ' +
	      'unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos ' +
	      'asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp ' +
	      'fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper ' +
	      'isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow ' +
	      'printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp ' +
	      'strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan ' +
	      'vfprintf vprintf vsprintf',
	    literal: 'true false nullptr NULL'
	  };

	  return {
	    aliases: ['c', 'cc', 'h', 'c++', 'h++', 'hpp'],
	    keywords: CPP_KEYWORDS,
	    illegal: '</',
	    contains: [
	      CPP_PRIMATIVE_TYPES,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      NUMBERS,
	      STRINGS,
	      PREPROCESSOR,
	      {
	        begin: '\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<', end: '>',
	        keywords: CPP_KEYWORDS,
	        contains: ['self', CPP_PRIMATIVE_TYPES]
	      },
	      {
	        begin: hljs.IDENT_RE + '::',
	        keywords: CPP_KEYWORDS
	      },
	      {
	        // Expression keywords prevent 'keyword Name(...) or else if(...)' from
	        // being recognized as a function definition
	        beginKeywords: 'new throw return else',
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: '(' + hljs.IDENT_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
	        returnBegin: true, end: /[{;=]/,
	        excludeEnd: true,
	        keywords: CPP_KEYWORDS,
	        illegal: /[^\w\s\*&]/,
	        contains: [
	          {
	            begin: FUNCTION_TITLE, returnBegin: true,
	            contains: [hljs.TITLE_MODE],
	            relevance: 0
	          },
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            keywords: CPP_KEYWORDS,
	            relevance: 0,
	            contains: [
	              hljs.C_LINE_COMMENT_MODE,
	              hljs.C_BLOCK_COMMENT_MODE,
	              STRINGS,
	              NUMBERS
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE,
	          PREPROCESSOR
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var RESOURCES = 'primitive rsc_template';

	  var COMMANDS = 'group clone ms master location colocation order fencing_topology ' +
	      'rsc_ticket acl_target acl_group user role ' +
	      'tag xml';

	  var PROPERTY_SETS = 'property rsc_defaults op_defaults';

	  var KEYWORDS = 'params meta operations op rule attributes utilization';

	  var OPERATORS = 'read write deny defined not_defined in_range date spec in ' +
	      'ref reference attribute type xpath version and or lt gt tag ' +
	      'lte gte eq ne \\';

	  var TYPES = 'number string';

	  var LITERALS = 'Master Started Slave Stopped start promote demote stop monitor true false';

	  return {
	    aliases: ['crm', 'pcmk'],
	    case_insensitive: true,
	    keywords: {
	      keyword: KEYWORDS,
	      operator: OPERATORS,
	      type: TYPES,
	      literal: LITERALS
	    },
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        beginKeywords: 'node',
	        starts: {
	          className: 'identifier',
	          end: '\\s*([\\w_-]+:)?',
	          starts: {
	            className: 'title',
	            end: '\\s*[\\$\\w_][\\w_-]*'
	          }
	        }
	      },
	      {
	        beginKeywords: RESOURCES,
	        starts: {
	          className: 'title',
	          end: '\\s*[\\$\\w_][\\w_-]*',
	          starts: {
	            className: 'pragma',
	            end: '\\s*@?[\\w_][\\w_\\.:-]*',
	          }
	        }
	      },
	      {
	        begin: '\\b(' + COMMANDS.split(' ').join('|') + ')\\s+',
	        keywords: COMMANDS,
	        starts: {
	          className: 'title',
	          end: '[\\$\\w_][\\w_-]*',
	        }
	      },
	      {
	        beginKeywords: PROPERTY_SETS,
	        starts: {
	          className: 'title',
	          end: '\\s*([\\w_-]+:)?'
	        }
	      },
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'pragma',
	        begin: '(ocf|systemd|service|lsb):[\\w_:-]+',
	        relevance: 0
	      },
	      {
	        className: 'number',
	        begin: '\\b\\d+(\\.\\d+)?(ms|s|h|m)?',
	        relevance: 0
	      },
	      {
	        className: 'number',
	        begin: '[-]?(infinity|inf)',
	        relevance: 0
	      },
	      {
	        className: 'variable',
	        begin: /([A-Za-z\$_\#][\w_-]+)=/,
	        relevance: 0
	      },
	      {
	        className: 'tag',
	        begin: '</?',
	        end: '/?>',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var NUM_SUFFIX = '(_[uif](8|16|32|64))?';
	  var CRYSTAL_IDENT_RE = '[a-zA-Z_]\\w*[!?=]?';
	  var RE_STARTER = '!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|' +
	    '>>|>|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';
	  var CRYSTAL_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\][=?]?';
	  var CRYSTAL_KEYWORDS = {
	    keyword:
	      'abstract alias as asm begin break case class def do else elsif end ensure enum extend for fun if ifdef ' +
	      'include instance_sizeof is_a? lib macro module next of out pointerof private protected rescue responds_to? ' +
	      'return require self sizeof struct super then type typeof union unless until when while with yield ' +
	      '__DIR__ __FILE__ __LINE__',
	    literal: 'false nil true'
	  };
	  var SUBST = {
	    className: 'subst',
	    begin: '#{', end: '}',
	    keywords: CRYSTAL_KEYWORDS
	  };
	  var EXPANSION = {
	    className: 'expansion',
	    variants: [
	      {begin: '\\{\\{', end: '\\}\\}'},
	      {begin: '\\{%', end: '%\\}'}
	    ],
	    keywords: CRYSTAL_KEYWORDS,
	    relevance: 10
	  };

	  function recursiveParen(begin, end) {
	    var
	    contains = [{begin: begin, end: end}];
	    contains[0].contains = contains;
	    return contains;
	  }
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	    variants: [
	      {begin: /'/, end: /'/},
	      {begin: /"/, end: /"/},
	      {begin: /`/, end: /`/},
	      {begin: '%w?\\(', end: '\\)', contains: recursiveParen('\\(', '\\)')},
	      {begin: '%w?\\[', end: '\\]', contains: recursiveParen('\\[', '\\]')},
	      {begin: '%w?{', end: '}', contains: recursiveParen('{', '}')},
	      {begin: '%w?<', end: '>', contains: recursiveParen('<', '>')},
	      {begin: '%w?/', end: '/'},
	      {begin: '%w?%', end: '%'},
	      {begin: '%w?-', end: '-'},
	      {begin: '%w?\\|', end: '\\|'},
	    ],
	    relevance: 0,
	  };
	  var REGEXP = {
	    begin: '(' + RE_STARTER + ')\\s*',
	    contains: [
	      {
	        className: 'regexp',
	        contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	        variants: [
	          {begin: '/', end: '/[a-z]*'},
	          {begin: '%r\\(', end: '\\)', contains: recursiveParen('\\(', '\\)')},
	          {begin: '%r\\[', end: '\\]', contains: recursiveParen('\\[', '\\]')},
	          {begin: '%r{', end: '}', contains: recursiveParen('{', '}')},
	          {begin: '%r<', end: '>', contains: recursiveParen('<', '>')},
	          {begin: '%r/', end: '/'},
	          {begin: '%r%', end: '%'},
	          {begin: '%r-', end: '-'},
	          {begin: '%r\\|', end: '\\|'},
	        ]
	      }
	    ],
	    relevance: 0
	  };
	  var REGEXP2 = {
	    className: 'regexp',
	    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	    variants: [
	      {begin: '%r\\(', end: '\\)', contains: recursiveParen('\\(', '\\)')},
	      {begin: '%r\\[', end: '\\]', contains: recursiveParen('\\[', '\\]')},
	      {begin: '%r{', end: '}', contains: recursiveParen('{', '}')},
	      {begin: '%r<', end: '>', contains: recursiveParen('<', '>')},
	      {begin: '%r/', end: '/'},
	      {begin: '%r%', end: '%'},
	      {begin: '%r-', end: '-'},
	      {begin: '%r\\|', end: '\\|'},
	    ],
	    relevance: 0
	  };
	  var ATTRIBUTE = {
	    className: 'annotation',
	    begin: '@\\[', end: '\\]',
	    relevance: 5
	  };
	  var CRYSTAL_DEFAULT_CONTAINS = [
	    EXPANSION,
	    STRING,
	    REGEXP,
	    REGEXP2,
	    ATTRIBUTE,
	    hljs.HASH_COMMENT_MODE,
	    {
	      className: 'class',
	      beginKeywords: 'class module struct', end: '$|;',
	      illegal: /=/,
	      contains: [
	        hljs.HASH_COMMENT_MODE,
	        hljs.inherit(hljs.TITLE_MODE, {begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'}),
	        {
	          className: 'inheritance',
	          begin: '<\\s*',
	          contains: [{
	            className: 'parent',
	            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
	          }]
	        }
	      ]
	    },
	    {
	      className: 'class',
	      beginKeywords: 'lib enum union', end: '$|;',
	      illegal: /=/,
	      contains: [
	        hljs.HASH_COMMENT_MODE,
	        hljs.inherit(hljs.TITLE_MODE, {begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'}),
	      ],
	      relevance: 10
	    },
	    {
	      className: 'function',
	      beginKeywords: 'def', end: /\B\b/,
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {
	          begin: CRYSTAL_METHOD_RE,
	          endsParent: true
	        })
	      ]
	    },
	    {
	      className: 'function',
	      beginKeywords: 'fun macro', end: /\B\b/,
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {
	          begin: CRYSTAL_METHOD_RE,
	          endsParent: true
	        })
	      ],
	      relevance: 5
	    },
	    {
	      className: 'constant',
	      begin: '(::)?(\\b[A-Z]\\w*(::)?)+',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: hljs.UNDERSCORE_IDENT_RE + '(\\!|\\?)?:',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: ':',
	      contains: [STRING, {begin: CRYSTAL_METHOD_RE}],
	      relevance: 0
	    },
	    {
	      className: 'number',
	      variants: [
	        { begin: '\\b0b([01_]*[01])' + NUM_SUFFIX },
	        { begin: '\\b0o([0-7_]*[0-7])' + NUM_SUFFIX },
	        { begin: '\\b0x([A-Fa-f0-9_]*[A-Fa-f0-9])' + NUM_SUFFIX },
	        { begin: '\\b(([0-9][0-9_]*[0-9]|[0-9])(\\.[0-9_]*[0-9])?([eE][+-]?[0-9_]*[0-9])?)' + NUM_SUFFIX}
	      ],
	      relevance: 0
	    },
	    {
	      className: 'variable',
	      begin: '(\\$\\W)|((\\$|\\@\\@?|%)(\\w+))'
	    }
	  ];
	  SUBST.contains = CRYSTAL_DEFAULT_CONTAINS;
	  ATTRIBUTE.contains = CRYSTAL_DEFAULT_CONTAINS;
	  EXPANSION.contains = CRYSTAL_DEFAULT_CONTAINS.slice(1); // without EXPANSION

	  return {
	    aliases: ['cr'],
	    lexemes: CRYSTAL_IDENT_RE,
	    keywords: CRYSTAL_KEYWORDS,
	    contains: CRYSTAL_DEFAULT_CONTAINS
	  };
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS =
	    // Normal keywords.
	    'abstract as base bool break byte case catch char checked const continue decimal dynamic ' +
	    'default delegate do double else enum event explicit extern false finally fixed float ' +
	    'for foreach goto if implicit in int interface internal is lock long null when ' +
	    'object operator out override params private protected public readonly ref sbyte ' +
	    'sealed short sizeof stackalloc static string struct switch this true try typeof ' +
	    'uint ulong unchecked unsafe ushort using virtual volatile void while async ' +
	    'protected public private internal ' +
	    // Contextual keywords.
	    'ascending descending from get group into join let orderby partial select set value var ' +
	    'where yield';
	  var GENERIC_IDENT_RE = hljs.IDENT_RE + '(<' + hljs.IDENT_RE + '>)?';
	  return {
	    aliases: ['csharp'],
	    keywords: KEYWORDS,
	    illegal: /::/,
	    contains: [
	      hljs.COMMENT(
	        '///',
	        '$',
	        {
	          returnBegin: true,
	          contains: [
	            {
	              className: 'xmlDocTag',
	              variants: [
	                {
	                  begin: '///', relevance: 0
	                },
	                {
	                  begin: '<!--|-->'
	                },
	                {
	                  begin: '</?', end: '>'
	                }
	              ]
	            }
	          ]
	        }
	      ),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$',
	        keywords: 'if else elif endif define undef warning error line region endregion pragma checksum'
	      },
	      {
	        className: 'string',
	        begin: '@"', end: '"',
	        contains: [{begin: '""'}]
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        beginKeywords: 'class interface', end: /[{;=]/,
	        illegal: /[^\s:]/,
	        contains: [
	          hljs.TITLE_MODE,
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      },
	      {
	        beginKeywords: 'namespace', end: /[{;=]/,
	        illegal: /[^\s:]/,
	        contains: [
	          {
	            // Customization of hljs.TITLE_MODE that allows '.'
	            className: 'title',
	            begin: '[a-zA-Z](\\.?\\w)*',
	            relevance: 0
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      },
	      {
	        // Expression keywords prevent 'keyword Name(...)' from being
	        // recognized as a function definition
	        beginKeywords: 'new return throw await',
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: '(' + GENERIC_IDENT_RE + '\\s+)+' + hljs.IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=]/,
	        excludeEnd: true,
	        keywords: KEYWORDS,
	        contains: [
	          {
	            begin: hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
	            contains: [hljs.TITLE_MODE],
	            relevance: 0
	          },
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            excludeBegin: true,
	            excludeEnd: true,
	            keywords: KEYWORDS,
	            relevance: 0,
	            contains: [
	              hljs.APOS_STRING_MODE,
	              hljs.QUOTE_STRING_MODE,
	              hljs.C_NUMBER_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
	  var FUNCTION = {
	    className: 'function',
	    begin: IDENT_RE + '\\(',
	    returnBegin: true,
	    excludeEnd: true,
	    end: '\\('
	  };
	  var RULE = {
	    className: 'rule',
	    begin: /[A-Z\_\.\-]+\s*:/, returnBegin: true, end: ';', endsWithParent: true,
	    contains: [
	      {
	        className: 'attribute',
	        begin: /\S/, end: ':', excludeEnd: true,
	        starts: {
	          className: 'value',
	          endsWithParent: true, excludeEnd: true,
	          contains: [
	            FUNCTION,
	            hljs.CSS_NUMBER_MODE,
	            hljs.QUOTE_STRING_MODE,
	            hljs.APOS_STRING_MODE,
	            hljs.C_BLOCK_COMMENT_MODE,
	            {
	              className: 'hexcolor', begin: '#[0-9A-Fa-f]+'
	            },
	            {
	              className: 'important', begin: '!important'
	            }
	          ]
	        }
	      }
	    ]
	  };

	  return {
	    case_insensitive: true,
	    illegal: /[=\/|'\$]/,
	    contains: [
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'id', begin: /\#[A-Za-z0-9_-]+/
	      },
	      {
	        className: 'class', begin: /\.[A-Za-z0-9_-]+/
	      },
	      {
	        className: 'attr_selector',
	        begin: /\[/, end: /\]/,
	        illegal: '$'
	      },
	      {
	        className: 'pseudo',
	        begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"']+/
	      },
	      {
	        className: 'at_rule',
	        begin: '@(font-face|page)',
	        lexemes: '[a-z-]+',
	        keywords: 'font-face page'
	      },
	      {
	        className: 'at_rule',
	        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
	                                 // because it doesn’t let it to be parsed as
	                                 // a rule set but instead drops parser into
	                                 // the default mode which is how it should be.
	        contains: [
	          {
	            className: 'keyword',
	            begin: /\S+/
	          },
	          {
	            begin: /\s/, endsWithParent: true, excludeEnd: true,
	            relevance: 0,
	            contains: [
	              FUNCTION,
	              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
	              hljs.CSS_NUMBER_MODE
	            ]
	          }
	        ]
	      },
	      {
	        className: 'tag', begin: IDENT_RE,
	        relevance: 0
	      },
	      {
	        className: 'rules',
	        begin: '{', end: '}',
	        illegal: /\S/,
	        contains: [
	          hljs.C_BLOCK_COMMENT_MODE,
	          RULE,
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = /**
	 * Known issues:
	 *
	 * - invalid hex string literals will be recognized as a double quoted strings
	 *   but 'x' at the beginning of string will not be matched
	 *
	 * - delimited string literals are not checked for matching end delimiter
	 *   (not possible to do with js regexp)
	 *
	 * - content of token string is colored as a string (i.e. no keyword coloring inside a token string)
	 *   also, content of token string is not validated to contain only valid D tokens
	 *
	 * - special token sequence rule is not strictly following D grammar (anything following #line
	 *   up to the end of line is matched as special token sequence)
	 */

	function(hljs) {
	  /**
	   * Language keywords
	   *
	   * @type {Object}
	   */
	  var D_KEYWORDS = {
	    keyword:
	      'abstract alias align asm assert auto body break byte case cast catch class ' +
	      'const continue debug default delete deprecated do else enum export extern final ' +
	      'finally for foreach foreach_reverse|10 goto if immutable import in inout int ' +
	      'interface invariant is lazy macro mixin module new nothrow out override package ' +
	      'pragma private protected public pure ref return scope shared static struct ' +
	      'super switch synchronized template this throw try typedef typeid typeof union ' +
	      'unittest version void volatile while with __FILE__ __LINE__ __gshared|10 ' +
	      '__thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__',
	    built_in:
	      'bool cdouble cent cfloat char creal dchar delegate double dstring float function ' +
	      'idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar ' +
	      'wstring',
	    literal:
	      'false null true'
	  };

	  /**
	   * Number literal regexps
	   *
	   * @type {String}
	   */
	  var decimal_integer_re = '(0|[1-9][\\d_]*)',
	    decimal_integer_nosus_re = '(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)',
	    binary_integer_re = '0[bB][01_]+',
	    hexadecimal_digits_re = '([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)',
	    hexadecimal_integer_re = '0[xX]' + hexadecimal_digits_re,

	    decimal_exponent_re = '([eE][+-]?' + decimal_integer_nosus_re + ')',
	    decimal_float_re = '(' + decimal_integer_nosus_re + '(\\.\\d*|' + decimal_exponent_re + ')|' +
	                '\\d+\\.' + decimal_integer_nosus_re + decimal_integer_nosus_re + '|' +
	                '\\.' + decimal_integer_re + decimal_exponent_re + '?' +
	              ')',
	    hexadecimal_float_re = '(0[xX](' +
	                  hexadecimal_digits_re + '\\.' + hexadecimal_digits_re + '|'+
	                  '\\.?' + hexadecimal_digits_re +
	                 ')[pP][+-]?' + decimal_integer_nosus_re + ')',

	    integer_re = '(' +
	      decimal_integer_re + '|' +
	      binary_integer_re  + '|' +
	       hexadecimal_integer_re   +
	    ')',

	    float_re = '(' +
	      hexadecimal_float_re + '|' +
	      decimal_float_re  +
	    ')';

	  /**
	   * Escape sequence supported in D string and character literals
	   *
	   * @type {String}
	   */
	  var escape_sequence_re = '\\\\(' +
	              '[\'"\\?\\\\abfnrtv]|' +  // common escapes
	              'u[\\dA-Fa-f]{4}|' +     // four hex digit unicode codepoint
	              '[0-7]{1,3}|' +       // one to three octal digit ascii char code
	              'x[\\dA-Fa-f]{2}|' +    // two hex digit ascii char code
	              'U[\\dA-Fa-f]{8}' +      // eight hex digit unicode codepoint
	              ')|' +
	              '&[a-zA-Z\\d]{2,};';      // named character entity

	  /**
	   * D integer number literals
	   *
	   * @type {Object}
	   */
	  var D_INTEGER_MODE = {
	    className: 'number',
	      begin: '\\b' + integer_re + '(L|u|U|Lu|LU|uL|UL)?',
	      relevance: 0
	  };

	  /**
	   * [D_FLOAT_MODE description]
	   * @type {Object}
	   */
	  var D_FLOAT_MODE = {
	    className: 'number',
	    begin: '\\b(' +
	        float_re + '([fF]|L|i|[fF]i|Li)?|' +
	        integer_re + '(i|[fF]i|Li)' +
	      ')',
	    relevance: 0
	  };

	  /**
	   * D character literal
	   *
	   * @type {Object}
	   */
	  var D_CHARACTER_MODE = {
	    className: 'string',
	    begin: '\'(' + escape_sequence_re + '|.)', end: '\'',
	    illegal: '.'
	  };

	  /**
	   * D string escape sequence
	   *
	   * @type {Object}
	   */
	  var D_ESCAPE_SEQUENCE = {
	    begin: escape_sequence_re,
	    relevance: 0
	  };

	  /**
	   * D double quoted string literal
	   *
	   * @type {Object}
	   */
	  var D_STRING_MODE = {
	    className: 'string',
	    begin: '"',
	    contains: [D_ESCAPE_SEQUENCE],
	    end: '"[cwd]?'
	  };

	  /**
	   * D wysiwyg and delimited string literals
	   *
	   * @type {Object}
	   */
	  var D_WYSIWYG_DELIMITED_STRING_MODE = {
	    className: 'string',
	    begin: '[rq]"',
	    end: '"[cwd]?',
	    relevance: 5
	  };

	  /**
	   * D alternate wysiwyg string literal
	   *
	   * @type {Object}
	   */
	  var D_ALTERNATE_WYSIWYG_STRING_MODE = {
	    className: 'string',
	    begin: '`',
	    end: '`[cwd]?'
	  };

	  /**
	   * D hexadecimal string literal
	   *
	   * @type {Object}
	   */
	  var D_HEX_STRING_MODE = {
	    className: 'string',
	    begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
	    relevance: 10
	  };

	  /**
	   * D delimited string literal
	   *
	   * @type {Object}
	   */
	  var D_TOKEN_STRING_MODE = {
	    className: 'string',
	    begin: 'q"\\{',
	    end: '\\}"'
	  };

	  /**
	   * Hashbang support
	   *
	   * @type {Object}
	   */
	  var D_HASHBANG_MODE = {
	    className: 'shebang',
	    begin: '^#!',
	    end: '$',
	    relevance: 5
	  };

	  /**
	   * D special token sequence
	   *
	   * @type {Object}
	   */
	  var D_SPECIAL_TOKEN_SEQUENCE_MODE = {
	    className: 'preprocessor',
	    begin: '#(line)',
	    end: '$',
	    relevance: 5
	  };

	  /**
	   * D attributes
	   *
	   * @type {Object}
	   */
	  var D_ATTRIBUTE_MODE = {
	    className: 'keyword',
	    begin: '@[a-zA-Z_][a-zA-Z_\\d]*'
	  };

	  /**
	   * D nesting comment
	   *
	   * @type {Object}
	   */
	  var D_NESTING_COMMENT_MODE = hljs.COMMENT(
	    '\\/\\+',
	    '\\+\\/',
	    {
	      contains: ['self'],
	      relevance: 10
	    }
	  );

	  return {
	    lexemes: hljs.UNDERSCORE_IDENT_RE,
	    keywords: D_KEYWORDS,
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	        hljs.C_BLOCK_COMMENT_MODE,
	        D_NESTING_COMMENT_MODE,
	        D_HEX_STRING_MODE,
	        D_STRING_MODE,
	        D_WYSIWYG_DELIMITED_STRING_MODE,
	        D_ALTERNATE_WYSIWYG_STRING_MODE,
	        D_TOKEN_STRING_MODE,
	        D_FLOAT_MODE,
	        D_INTEGER_MODE,
	        D_CHARACTER_MODE,
	        D_HASHBANG_MODE,
	        D_SPECIAL_TOKEN_SEQUENCE_MODE,
	        D_ATTRIBUTE_MODE
	    ]
	  };
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['md', 'mkdown', 'mkd'],
	    contains: [
	      // highlight headers
	      {
	        className: 'header',
	        variants: [
	          { begin: '^#{1,6}', end: '$' },
	          { begin: '^.+?\\n[=-]{2,}$' }
	        ]
	      },
	      // inline html
	      {
	        begin: '<', end: '>',
	        subLanguage: 'xml',
	        relevance: 0
	      },
	      // lists (indicators only)
	      {
	        className: 'bullet',
	        begin: '^([*+-]|(\\d+\\.))\\s+'
	      },
	      // strong segments
	      {
	        className: 'strong',
	        begin: '[*_]{2}.+?[*_]{2}'
	      },
	      // emphasis segments
	      {
	        className: 'emphasis',
	        variants: [
	          { begin: '\\*.+?\\*' },
	          { begin: '_.+?_'
	          , relevance: 0
	          }
	        ]
	      },
	      // blockquotes
	      {
	        className: 'blockquote',
	        begin: '^>\\s+', end: '$'
	      },
	      // code snippets
	      {
	        className: 'code',
	        variants: [
	          { begin: '`.+?`' },
	          { begin: '^( {4}|\t)', end: '$'
	          , relevance: 0
	          }
	        ]
	      },
	      // horizontal rules
	      {
	        className: 'horizontal_rule',
	        begin: '^[-\\*]{3,}', end: '$'
	      },
	      // using links - title and link
	      {
	        begin: '\\[.+?\\][\\(\\[].*?[\\)\\]]',
	        returnBegin: true,
	        contains: [
	          {
	            className: 'link_label',
	            begin: '\\[', end: '\\]',
	            excludeBegin: true,
	            returnEnd: true,
	            relevance: 0
	          },
	          {
	            className: 'link_url',
	            begin: '\\]\\(', end: '\\)',
	            excludeBegin: true, excludeEnd: true
	          },
	          {
	            className: 'link_reference',
	            begin: '\\]\\[', end: '\\]',
	            excludeBegin: true, excludeEnd: true
	          }
	        ],
	        relevance: 10
	      },
	      {
	        begin: '^\\[\.+\\]:',
	        returnBegin: true,
	        contains: [
	          {
	            className: 'link_reference',
	            begin: '\\[', end: '\\]:',
	            excludeBegin: true, excludeEnd: true,
	            starts: {
	              className: 'link_url',
	              end: '$'
	            }
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = function (hljs) {
	  var SUBST = {
	    className: 'subst',
	    begin: '\\$\\{', end: '}',
	    keywords: 'true false null this is new super'
	  };

	  var STRING = {
	    className: 'string',
	    variants: [
	      {
	        begin: 'r\'\'\'', end: '\'\'\''
	      },
	      {
	        begin: 'r"""', end: '"""'
	      },
	      {
	        begin: 'r\'', end: '\'',
	        illegal: '\\n'
	      },
	      {
	        begin: 'r"', end: '"',
	        illegal: '\\n'
	      },
	      {
	        begin: '\'\'\'', end: '\'\'\'',
	        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	      },
	      {
	        begin: '"""', end: '"""',
	        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	      },
	      {
	        begin: '\'', end: '\'',
	        illegal: '\\n',
	        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	      },
	      {
	        begin: '"', end: '"',
	        illegal: '\\n',
	        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
	      }
	    ]
	  };
	  SUBST.contains = [
	    hljs.C_NUMBER_MODE, STRING
	  ];

	  var KEYWORDS = {
	    keyword: 'assert break case catch class const continue default do else enum extends false final finally for if ' +
	      'in is new null rethrow return super switch this throw true try var void while with',
	    literal: 'abstract as dynamic export external factory get implements import library operator part set static typedef',
	    built_in:
	      // dart:core
	      'print Comparable DateTime Duration Function Iterable Iterator List Map Match Null Object Pattern RegExp Set ' +
	      'Stopwatch String StringBuffer StringSink Symbol Type Uri bool double int num ' +
	      // dart:html
	      'document window querySelector querySelectorAll Element ElementList'
	  };

	  return {
	    keywords: KEYWORDS,
	    contains: [
	      STRING,
	      hljs.COMMENT(
	        '/\\*\\*',
	        '\\*/',
	        {
	          subLanguage: 'markdown'
	        }
	      ),
	      hljs.COMMENT(
	        '///',
	        '$',
	        {
	          subLanguage: 'markdown'
	        }
	      ),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        contains: [
	          {
	            beginKeywords: 'extends implements'
	          },
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'annotation', begin: '@[A-Za-z]+'
	      },
	      {
	        begin: '=>' // No markup, just a relevance booster
	      }
	    ]
	  }
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS =
	    'exports register file shl array record property for mod while set ally label uses raise not ' +
	    'stored class safecall var interface or private static exit index inherited to else stdcall ' +
	    'override shr asm far resourcestring finalization packed virtual out and protected library do ' +
	    'xorwrite goto near function end div overload object unit begin string on inline repeat until ' +
	    'destructor write message program with read initialization except default nil if case cdecl in ' +
	    'downto threadvar of try pascal const external constructor type public then implementation ' +
	    'finally published procedure';
	  var COMMENT_MODES = [
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.COMMENT(
	      /\{/,
	      /\}/,
	      {
	        relevance: 0
	      }
	    ),
	    hljs.COMMENT(
	      /\(\*/,
	      /\*\)/,
	      {
	        relevance: 10
	      }
	    )
	  ];
	  var STRING = {
	    className: 'string',
	    begin: /'/, end: /'/,
	    contains: [{begin: /''/}]
	  };
	  var CHAR_STRING = {
	    className: 'string', begin: /(#\d+)+/
	  };
	  var CLASS = {
	    begin: hljs.IDENT_RE + '\\s*=\\s*class\\s*\\(', returnBegin: true,
	    contains: [
	      hljs.TITLE_MODE
	    ]
	  };
	  var FUNCTION = {
	    className: 'function',
	    beginKeywords: 'function constructor destructor procedure', end: /[:;]/,
	    keywords: 'function constructor|10 destructor|10 procedure|10',
	    contains: [
	      hljs.TITLE_MODE,
	      {
	        className: 'params',
	        begin: /\(/, end: /\)/,
	        keywords: KEYWORDS,
	        contains: [STRING, CHAR_STRING]
	      }
	    ].concat(COMMENT_MODES)
	  };
	  return {
	    case_insensitive: true,
	    keywords: KEYWORDS,
	    illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
	    contains: [
	      STRING, CHAR_STRING,
	      hljs.NUMBER_MODE,
	      CLASS,
	      FUNCTION
	    ].concat(COMMENT_MODES)
	  };
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['patch'],
	    contains: [
	      {
	        className: 'chunk',
	        relevance: 10,
	        variants: [
	          {begin: /^@@ +\-\d+,\d+ +\+\d+,\d+ +@@$/},
	          {begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/},
	          {begin: /^\-\-\- +\d+,\d+ +\-\-\-\-$/}
	        ]
	      },
	      {
	        className: 'header',
	        variants: [
	          {begin: /Index: /, end: /$/},
	          {begin: /=====/, end: /=====$/},
	          {begin: /^\-\-\-/, end: /$/},
	          {begin: /^\*{3} /, end: /$/},
	          {begin: /^\+\+\+/, end: /$/},
	          {begin: /\*{5}/, end: /\*{5}$/}
	        ]
	      },
	      {
	        className: 'addition',
	        begin: '^\\+', end: '$'
	      },
	      {
	        className: 'deletion',
	        begin: '^\\-', end: '$'
	      },
	      {
	        className: 'change',
	        begin: '^\\!', end: '$'
	      }
	    ]
	  };
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var FILTER = {
	    className: 'filter',
	    begin: /\|[A-Za-z]+:?/,
	    keywords:
	      'truncatewords removetags linebreaksbr yesno get_digit timesince random striptags ' +
	      'filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands ' +
	      'title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode ' +
	      'timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort ' +
	      'dictsortreversed default_if_none pluralize lower join center default ' +
	      'truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first ' +
	      'escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize ' +
	      'localtime utc timezone',
	    contains: [
	      {className: 'argument', begin: /"/, end: /"/},
	      {className: 'argument', begin: /'/, end: /'/}
	    ]
	  };

	  return {
	    aliases: ['jinja'],
	    case_insensitive: true,
	    subLanguage: 'xml',
	    contains: [
	      hljs.COMMENT(/\{%\s*comment\s*%}/, /\{%\s*endcomment\s*%}/),
	      hljs.COMMENT(/\{#/, /#}/),
	      {
	        className: 'template_tag',
	        begin: /\{%/, end: /%}/,
	        keywords:
	          'comment endcomment load templatetag ifchanged endifchanged if endif firstof for ' +
	          'endfor in ifnotequal endifnotequal widthratio extends include spaceless ' +
	          'endspaceless regroup by as ifequal endifequal ssi now with cycle url filter ' +
	          'endfilter debug block endblock else autoescape endautoescape csrf_token empty elif ' +
	          'endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix ' +
	          'plural get_current_language language get_available_languages ' +
	          'get_current_language_bidi get_language_info get_language_info_list localize ' +
	          'endlocalize localtime endlocaltime timezone endtimezone get_current_timezone ' +
	          'verbatim',
	        contains: [FILTER]
	      },
	      {
	        className: 'variable',
	        begin: /\{\{/, end: /}}/,
	        contains: [FILTER]
	      }
	    ]
	  };
	};

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['bind', 'zone'],
	    keywords: {
	      keyword:
	        'IN A AAAA AFSDB APL CAA CDNSKEY CDS CERT CNAME DHCID DLV DNAME DNSKEY DS HIP IPSECKEY KEY KX ' +
	        'LOC MX NAPTR NS NSEC NSEC3 NSEC3PARAM PTR RRSIG RP SIG SOA SRV SSHFP TA TKEY TLSA TSIG TXT'
	    },
	    contains: [
	      hljs.COMMENT(';', '$'),
	      {
	        className: 'operator',
	        beginKeywords: '$TTL $GENERATE $INCLUDE $ORIGIN'
	      },
	      // IPv6
	      {
	        className: 'number',
	        begin: '((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))'
	      },
	      // IPv4
	      {
	        className: 'number',
	        begin: '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])'
	      }
	    ]
	  };
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['docker'],
	    case_insensitive: true,
	    keywords: {
	      built_ins: 'from maintainer cmd expose add copy entrypoint volume user workdir onbuild run env label'
	    },
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        keywords : {
	          built_in: 'run cmd entrypoint volume add copy workdir onbuild label'
	        },
	        begin: /^ *(onbuild +)?(run|cmd|entrypoint|volume|add|copy|workdir|label) +/,
	        starts: {
	          end: /[^\\]\n/,
	          subLanguage: 'bash'
	        }
	      },
	      {
	        keywords: {
	          built_in: 'from maintainer expose env user onbuild'
	        },
	        begin: /^ *(onbuild +)?(from|maintainer|expose|env|user|onbuild) +/, end: /[^\\]\n/,
	        contains: [
	          hljs.APOS_STRING_MODE,
	          hljs.QUOTE_STRING_MODE,
	          hljs.NUMBER_MODE,
	          hljs.HASH_COMMENT_MODE
	        ]
	      }
	    ]
	  }
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMENT = hljs.COMMENT(
	    /@?rem\b/, /$/,
	    {
	      relevance: 10
	    }
	  );
	  var LABEL = {
	    className: 'label',
	    begin: '^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)',
	    relevance: 0
	  };
	  return {
	    aliases: ['bat', 'cmd'],
	    case_insensitive: true,
	    illegal: /\/\*/,
	    keywords: {
	      flow: 'if else goto for in do call exit not exist errorlevel defined',
	      operator: 'equ neq lss leq gtr geq',
	      keyword: 'shift cd dir echo setlocal endlocal set pause copy',
	      stream: 'prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux',
	      winutils: 'ping net ipconfig taskkill xcopy ren del',
	      built_in: 'append assoc at attrib break cacls cd chcp chdir chkdsk chkntfs cls cmd color ' +
	        'comp compact convert date dir diskcomp diskcopy doskey erase fs ' +
	        'find findstr format ftype graftabl help keyb label md mkdir mode more move path ' +
	        'pause print popd pushd promt rd recover rem rename replace restore rmdir shift' +
	        'sort start subst time title tree type ver verify vol'
	    },
	    contains: [
	      {
	        className: 'envvar', begin: /%%[^ ]|%[^ ]+?%|![^ ]+?!/
	      },
	      {
	        className: 'function',
	        begin: LABEL.begin, end: 'goto:eof',
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*'}),
	          COMMENT
	        ]
	      },
	      {
	        className: 'number', begin: '\\b\\d+',
	        relevance: 0
	      },
	      COMMENT
	    ]
	  };
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var EXPRESSION_KEYWORDS = 'if eq ne lt lte gt gte select default math sep';
	  return {
	    aliases: ['dst'],
	    case_insensitive: true,
	    subLanguage: 'xml',
	    contains: [
	      {
	        className: 'expression',
	        begin: '{', end: '}',
	        relevance: 0,
	        contains: [
	          {
	            className: 'begin-block', begin: '\#[a-zA-Z\-\ \.]+',
	            keywords: EXPRESSION_KEYWORDS
	          },
	          {
	            className: 'string',
	            begin: '"', end: '"'
	          },
	          {
	            className: 'end-block', begin: '\\\/[a-zA-Z\-\ \.]+',
	            keywords: EXPRESSION_KEYWORDS
	          },
	          {
	            className: 'variable', begin: '[a-zA-Z\-\.]+',
	            keywords: EXPRESSION_KEYWORDS,
	            relevance: 0
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var ELIXIR_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?';
	  var ELIXIR_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
	  var ELIXIR_KEYWORDS =
	    'and false then defined module in return redo retry end for true self when ' +
	    'next until do begin unless nil break not case cond alias while ensure or ' +
	    'include use alias fn quote';
	  var SUBST = {
	    className: 'subst',
	    begin: '#\\{', end: '}',
	    lexemes: ELIXIR_IDENT_RE,
	    keywords: ELIXIR_KEYWORDS
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	    variants: [
	      {
	        begin: /'/, end: /'/
	      },
	      {
	        begin: /"/, end: /"/
	      }
	    ]
	  };
	  var FUNCTION = {
	    className: 'function',
	    beginKeywords: 'def defp defmacro', end: /\B\b/, // the mode is ended by the title
	    contains: [
	      hljs.inherit(hljs.TITLE_MODE, {
	        begin: ELIXIR_IDENT_RE,
	        endsParent: true
	      })
	    ]
	  };
	  var CLASS = hljs.inherit(FUNCTION, {
	    className: 'class',
	    beginKeywords: 'defmodule defrecord', end: /\bdo\b|$|;/
	  });
	  var ELIXIR_DEFAULT_CONTAINS = [
	    STRING,
	    hljs.HASH_COMMENT_MODE,
	    CLASS,
	    FUNCTION,
	    {
	      className: 'constant',
	      begin: '(\\b[A-Z_]\\w*(.)?)+',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: ':',
	      contains: [STRING, {begin: ELIXIR_METHOD_RE}],
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: ELIXIR_IDENT_RE + ':',
	      relevance: 0
	    },
	    {
	      className: 'number',
	      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	      relevance: 0
	    },
	    {
	      className: 'variable',
	      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))'
	    },
	    {
	      begin: '->'
	    },
	    { // regexp container
	      begin: '(' + hljs.RE_STARTERS_RE + ')\\s*',
	      contains: [
	        hljs.HASH_COMMENT_MODE,
	        {
	          className: 'regexp',
	          illegal: '\\n',
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	          variants: [
	            {
	              begin: '/', end: '/[a-z]*'
	            },
	            {
	              begin: '%r\\[', end: '\\][a-z]*'
	            }
	          ]
	        }
	      ],
	      relevance: 0
	    }
	  ];
	  SUBST.contains = ELIXIR_DEFAULT_CONTAINS;

	  return {
	    lexemes: ELIXIR_IDENT_RE,
	    keywords: ELIXIR_KEYWORDS,
	    contains: ELIXIR_DEFAULT_CONTAINS
	  };
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMENT_MODES = [
	    hljs.COMMENT('--', '$'),
	    hljs.COMMENT(
	      '{-',
	      '-}',
	      {
	        contains: ['self']
	      }
	    )
	  ];

	  var CONSTRUCTOR = {
	    className: 'type',
	    begin: '\\b[A-Z][\\w\']*', // TODO: other constructors (build-in, infix).
	    relevance: 0
	  };

	  var LIST = {
	    className: 'container',
	    begin: '\\(', end: '\\)',
	    illegal: '"',
	    contains: [
	      {className: 'type', begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'}
	    ].concat(COMMENT_MODES)
	  };

	  var RECORD = {
	    className: 'container',
	    begin: '{', end: '}',
	    contains: LIST.contains
	  };

	  return {
	    keywords:
	      'let in if then else case of where module import exposing ' +
	      'type alias as infix infixl infixr port',
	    contains: [

	      // Top-level constructions.

	      {
	        className: 'module',
	        begin: '\\bmodule\\b', end: 'where',
	        keywords: 'module where',
	        contains: [LIST].concat(COMMENT_MODES),
	        illegal: '\\W\\.|;'
	      },
	      {
	        className: 'import',
	        begin: '\\bimport\\b', end: '$',
	        keywords: 'import|0 as exposing',
	        contains: [LIST].concat(COMMENT_MODES),
	        illegal: '\\W\\.|;'
	      },
	      {
	        className: 'typedef',
	        begin: '\\btype\\b', end: '$',
	        keywords: 'type alias',
	        contains: [CONSTRUCTOR, LIST, RECORD].concat(COMMENT_MODES)
	      },
	      {
	        className: 'infix',
	        beginKeywords: 'infix infixl infixr', end: '$',
	        contains: [hljs.C_NUMBER_MODE].concat(COMMENT_MODES)
	      },
	      {
	        className: 'foreign',
	        begin: '\\bport\\b', end: '$',
	        keywords: 'port',
	        contains: COMMENT_MODES
	      },

	      // Literals and names.

	      // TODO: characters.
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      CONSTRUCTOR,
	      hljs.inherit(hljs.TITLE_MODE, {begin: '^[_a-z][\\w\']*'}),

	      {begin: '->|<-'} // No markup, relevance booster
	    ].concat(COMMENT_MODES)
	  };
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var RUBY_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
	  var RUBY_KEYWORDS =
	    'and false then defined module in return redo if BEGIN retry end for true self when ' +
	    'next until do begin unless END rescue nil else break undef not super class case ' +
	    'require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor';
	  var YARDOCTAG = {
	    className: 'doctag',
	    begin: '@[A-Za-z]+'
	  };
	  var IRB_OBJECT = {
	    className: 'value',
	    begin: '#<', end: '>'
	  };
	  var COMMENT_MODES = [
	    hljs.COMMENT(
	      '#',
	      '$',
	      {
	        contains: [YARDOCTAG]
	      }
	    ),
	    hljs.COMMENT(
	      '^\\=begin',
	      '^\\=end',
	      {
	        contains: [YARDOCTAG],
	        relevance: 10
	      }
	    ),
	    hljs.COMMENT('^__END__', '\\n$')
	  ];
	  var SUBST = {
	    className: 'subst',
	    begin: '#\\{', end: '}',
	    keywords: RUBY_KEYWORDS
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	    variants: [
	      {begin: /'/, end: /'/},
	      {begin: /"/, end: /"/},
	      {begin: /`/, end: /`/},
	      {begin: '%[qQwWx]?\\(', end: '\\)'},
	      {begin: '%[qQwWx]?\\[', end: '\\]'},
	      {begin: '%[qQwWx]?{', end: '}'},
	      {begin: '%[qQwWx]?<', end: '>'},
	      {begin: '%[qQwWx]?/', end: '/'},
	      {begin: '%[qQwWx]?%', end: '%'},
	      {begin: '%[qQwWx]?-', end: '-'},
	      {begin: '%[qQwWx]?\\|', end: '\\|'},
	      {
	        // \B in the beginning suppresses recognition of ?-sequences where ?
	        // is the last character of a preceding identifier, as in: `func?4`
	        begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
	      }
	    ]
	  };
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)',
	    keywords: RUBY_KEYWORDS
	  };

	  var RUBY_DEFAULT_CONTAINS = [
	    STRING,
	    IRB_OBJECT,
	    {
	      className: 'class',
	      beginKeywords: 'class module', end: '$|;',
	      illegal: /=/,
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'}),
	        {
	          className: 'inheritance',
	          begin: '<\\s*',
	          contains: [{
	            className: 'parent',
	            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
	          }]
	        }
	      ].concat(COMMENT_MODES)
	    },
	    {
	      className: 'function',
	      beginKeywords: 'def', end: '$|;',
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {begin: RUBY_METHOD_RE}),
	        PARAMS
	      ].concat(COMMENT_MODES)
	    },
	    {
	      className: 'constant',
	      begin: '(::)?(\\b[A-Z]\\w*(::)?)+',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: hljs.UNDERSCORE_IDENT_RE + '(\\!|\\?)?:',
	      relevance: 0
	    },
	    {
	      className: 'symbol',
	      begin: ':',
	      contains: [STRING, {begin: RUBY_METHOD_RE}],
	      relevance: 0
	    },
	    {
	      className: 'number',
	      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	      relevance: 0
	    },
	    {
	      className: 'variable',
	      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))'
	    },
	    { // regexp container
	      begin: '(' + hljs.RE_STARTERS_RE + ')\\s*',
	      contains: [
	        IRB_OBJECT,
	        {
	          className: 'regexp',
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST],
	          illegal: /\n/,
	          variants: [
	            {begin: '/', end: '/[a-z]*'},
	            {begin: '%r{', end: '}[a-z]*'},
	            {begin: '%r\\(', end: '\\)[a-z]*'},
	            {begin: '%r!', end: '![a-z]*'},
	            {begin: '%r\\[', end: '\\][a-z]*'}
	          ]
	        }
	      ].concat(COMMENT_MODES),
	      relevance: 0
	    }
	  ].concat(COMMENT_MODES);

	  SUBST.contains = RUBY_DEFAULT_CONTAINS;
	  PARAMS.contains = RUBY_DEFAULT_CONTAINS;

	  var SIMPLE_PROMPT = "[>?]>";
	  var DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+>";
	  var RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>";

	  var IRB_DEFAULT = [
	    {
	      begin: /^\s*=>/,
	      className: 'status',
	      starts: {
	        end: '$', contains: RUBY_DEFAULT_CONTAINS
	      }
	    },
	    {
	      className: 'prompt',
	      begin: '^('+SIMPLE_PROMPT+"|"+DEFAULT_PROMPT+'|'+RVM_PROMPT+')',
	      starts: {
	        end: '$', contains: RUBY_DEFAULT_CONTAINS
	      }
	    }
	  ];

	  return {
	    aliases: ['rb', 'gemspec', 'podspec', 'thor', 'irb'],
	    keywords: RUBY_KEYWORDS,
	    illegal: /\/\*/,
	    contains: COMMENT_MODES.concat(IRB_DEFAULT).concat(RUBY_DEFAULT_CONTAINS)
	  };
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    subLanguage: 'xml',
	    contains: [
	      hljs.COMMENT('<%#', '%>'),
	      {
	        begin: '<%[%=-]?', end: '[%-]?%>',
	        subLanguage: 'ruby',
	        excludeBegin: true,
	        excludeEnd: true
	      }
	    ]
	  };
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      special_functions:
	        'spawn spawn_link self',
	      reserved:
	        'after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if ' +
	        'let not of or orelse|10 query receive rem try when xor'
	    },
	    contains: [
	      {
	        className: 'prompt', begin: '^[0-9]+> ',
	        relevance: 10
	      },
	      hljs.COMMENT('%', '$'),
	      {
	        className: 'number',
	        begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
	        relevance: 0
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'constant', begin: '\\?(::)?([A-Z]\\w*(::)?)+'
	      },
	      {
	        className: 'arrow', begin: '->'
	      },
	      {
	        className: 'ok', begin: 'ok'
	      },
	      {
	        className: 'exclamation_mark', begin: '!'
	      },
	      {
	        className: 'function_or_atom',
	        begin: '(\\b[a-z\'][a-zA-Z0-9_\']*:[a-z\'][a-zA-Z0-9_\']*)|(\\b[a-z\'][a-zA-Z0-9_\']*)',
	        relevance: 0
	      },
	      {
	        className: 'variable',
	        begin: '[A-Z][a-zA-Z0-9_\']*',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var BASIC_ATOM_RE = '[a-z\'][a-zA-Z0-9_\']*';
	  var FUNCTION_NAME_RE = '(' + BASIC_ATOM_RE + ':' + BASIC_ATOM_RE + '|' + BASIC_ATOM_RE + ')';
	  var ERLANG_RESERVED = {
	    keyword:
	      'after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun if ' +
	      'let not of orelse|10 query receive rem try when xor',
	    literal:
	      'false true'
	  };

	  var COMMENT = hljs.COMMENT('%', '$');
	  var NUMBER = {
	    className: 'number',
	    begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
	    relevance: 0
	  };
	  var NAMED_FUN = {
	    begin: 'fun\\s+' + BASIC_ATOM_RE + '/\\d+'
	  };
	  var FUNCTION_CALL = {
	    begin: FUNCTION_NAME_RE + '\\(', end: '\\)',
	    returnBegin: true,
	    relevance: 0,
	    contains: [
	      {
	        className: 'function_name', begin: FUNCTION_NAME_RE,
	        relevance: 0
	      },
	      {
	        begin: '\\(', end: '\\)', endsWithParent: true,
	        returnEnd: true,
	        relevance: 0
	        // "contains" defined later
	      }
	    ]
	  };
	  var TUPLE = {
	    className: 'tuple',
	    begin: '{', end: '}',
	    relevance: 0
	    // "contains" defined later
	  };
	  var VAR1 = {
	    className: 'variable',
	    begin: '\\b_([A-Z][A-Za-z0-9_]*)?',
	    relevance: 0
	  };
	  var VAR2 = {
	    className: 'variable',
	    begin: '[A-Z][a-zA-Z0-9_]*',
	    relevance: 0
	  };
	  var RECORD_ACCESS = {
	    begin: '#' + hljs.UNDERSCORE_IDENT_RE,
	    relevance: 0,
	    returnBegin: true,
	    contains: [
	      {
	        className: 'record_name',
	        begin: '#' + hljs.UNDERSCORE_IDENT_RE,
	        relevance: 0
	      },
	      {
	        begin: '{', end: '}',
	        relevance: 0
	        // "contains" defined later
	      }
	    ]
	  };

	  var BLOCK_STATEMENTS = {
	    beginKeywords: 'fun receive if try case', end: 'end',
	    keywords: ERLANG_RESERVED
	  };
	  BLOCK_STATEMENTS.contains = [
	    COMMENT,
	    NAMED_FUN,
	    hljs.inherit(hljs.APOS_STRING_MODE, {className: ''}),
	    BLOCK_STATEMENTS,
	    FUNCTION_CALL,
	    hljs.QUOTE_STRING_MODE,
	    NUMBER,
	    TUPLE,
	    VAR1, VAR2,
	    RECORD_ACCESS
	  ];

	  var BASIC_MODES = [
	    COMMENT,
	    NAMED_FUN,
	    BLOCK_STATEMENTS,
	    FUNCTION_CALL,
	    hljs.QUOTE_STRING_MODE,
	    NUMBER,
	    TUPLE,
	    VAR1, VAR2,
	    RECORD_ACCESS
	  ];
	  FUNCTION_CALL.contains[1].contains = BASIC_MODES;
	  TUPLE.contains = BASIC_MODES;
	  RECORD_ACCESS.contains[1].contains = BASIC_MODES;

	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)',
	    contains: BASIC_MODES
	  };
	  return {
	    aliases: ['erl'],
	    keywords: ERLANG_RESERVED,
	    illegal: '(</|\\*=|\\+=|-=|/\\*|\\*/|\\(\\*|\\*\\))',
	    contains: [
	      {
	        className: 'function',
	        begin: '^' + BASIC_ATOM_RE + '\\s*\\(', end: '->',
	        returnBegin: true,
	        illegal: '\\(|#|//|/\\*|\\\\|:|;',
	        contains: [
	          PARAMS,
	          hljs.inherit(hljs.TITLE_MODE, {begin: BASIC_ATOM_RE})
	        ],
	        starts: {
	          end: ';|\\.',
	          keywords: ERLANG_RESERVED,
	          contains: BASIC_MODES
	        }
	      },
	      COMMENT,
	      {
	        className: 'pp',
	        begin: '^-', end: '\\.',
	        relevance: 0,
	        excludeEnd: true,
	        returnBegin: true,
	        lexemes: '-' + hljs.IDENT_RE,
	        keywords:
	          '-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn ' +
	          '-import -include -include_lib -compile -define -else -endif -file -behaviour ' +
	          '-behavior -spec',
	        contains: [PARAMS]
	      },
	      NUMBER,
	      hljs.QUOTE_STRING_MODE,
	      RECORD_ACCESS,
	      VAR1, VAR2,
	      TUPLE,
	      {begin: /\.$/} // relevance booster
	    ]
	  };
	};

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    contains: [
	    {
	      begin: /[^\u2401\u0001]+/,
	      end: /[\u2401\u0001]/,
	      excludeEnd: true,
	      returnBegin: true,
	      returnEnd: false,
	      contains: [
	      {
	        begin: /([^\u2401\u0001=]+)/,
	        end: /=([^\u2401\u0001=]+)/,
	        returnEnd: true,
	        returnBegin: false,
	        className: 'attribute'
	      },
	      {
	        begin: /=/,
	        end: /([\u2401\u0001])/,
	        excludeEnd: true,
	        excludeBegin: true,
	        className: 'string'
	      }]
	    }],
	    case_insensitive: true
	  };
	};

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)'
	  };

	  var F_KEYWORDS = {
	    constant: '.False. .True.',
	    type: 'integer real character complex logical dimension allocatable|10 parameter ' +
	      'external implicit|10 none double precision assign intent optional pointer ' +
	      'target in out common equivalence data',
	    keyword: 'kind do while private call intrinsic where elsewhere ' +
	      'type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then ' +
	      'public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. ' +
	      'goto save else use module select case ' +
	      'access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit ' +
	      'continue format pause cycle exit ' +
	      'c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg ' +
	      'synchronous nopass non_overridable pass protected volatile abstract extends import ' +
	      'non_intrinsic value deferred generic final enumerator class associate bind enum ' +
	      'c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t ' +
	      'c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double ' +
	      'c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr ' +
	      'c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer ' +
	      'c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor ' +
	      'numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control ' +
	      'ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive ' +
	      'pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure',
	    built_in: 'alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint ' +
	      'dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl ' +
	      'algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama ' +
	      'iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod ' +
	      'qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log ' +
	      'log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate ' +
	      'adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product ' +
	      'eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul ' +
	      'maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product ' +
	      'radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind ' +
	      'set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer ' +
	      'dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end ' +
	      'ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode ' +
	      'is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of'  +
	      'acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 ' +
	      'atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits ' +
	      'bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr ' +
	      'num_images parity popcnt poppar shifta shiftl shiftr this_image'
	  };
	  return {
	    case_insensitive: true,
	    aliases: ['f90', 'f95'],
	    keywords: F_KEYWORDS,
	    illegal: /\/\*/,
	    contains: [
	      hljs.inherit(hljs.APOS_STRING_MODE, {className: 'string', relevance: 0}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {className: 'string', relevance: 0}),
	      {
	        className: 'function',
	        beginKeywords: 'subroutine function program',
	        illegal: '[${=\\n]',
	        contains: [hljs.UNDERSCORE_TITLE_MODE, PARAMS]
	      },
	      hljs.COMMENT('!', '$', {relevance: 0}),
	      {
	        className: 'number',
	        begin: '(?=\\b|\\+|\\-|\\.)(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*)(?:[de][+-]?\\d+)?\\b\\.?',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var TYPEPARAM = {
	    begin: '<', end: '>',
	    contains: [
	      hljs.inherit(hljs.TITLE_MODE, {begin: /'[a-zA-Z0-9_]+/})
	    ]
	  };

	  return {
	    aliases: ['fs'],
	    keywords:
	      'abstract and as assert base begin class default delegate do done ' +
	      'downcast downto elif else end exception extern false finally for ' +
	      'fun function global if in inherit inline interface internal lazy let ' +
	      'match member module mutable namespace new null of open or ' +
	      'override private public rec return sig static struct then to ' +
	      'true try type upcast use val void when while with yield',
	    illegal: /\/\*/,
	    contains: [
	      {
	        // monad builder keywords (matches before non-bang kws)
	        className: 'keyword',
	        begin: /\b(yield|return|let|do)!/
	      },
	      {
	        className: 'string',
	        begin: '@"', end: '"',
	        contains: [{begin: '""'}]
	      },
	      {
	        className: 'string',
	        begin: '"""', end: '"""'
	      },
	      hljs.COMMENT('\\(\\*', '\\*\\)'),
	      {
	        className: 'class',
	        beginKeywords: 'type', end: '\\(|=|$', excludeEnd: true,
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          TYPEPARAM
	        ]
	      },
	      {
	        className: 'annotation',
	        begin: '\\[<', end: '>\\]',
	        relevance: 10
	      },
	      {
	        className: 'attribute',
	        begin: '\\B(\'[A-Za-z])\\b',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      },
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = function (hljs) {
	  var KEYWORDS =
	    'abort acronym acronyms alias all and assign binary card diag display else1 eps eq equation equations file files ' +
	    'for1 free ge gt if inf integer le loop lt maximizing minimizing model models na ne negative no not option ' +
	    'options or ord parameter parameters positive prod putpage puttl repeat sameas scalar scalars semicont semiint ' +
	    'set1 sets smax smin solve sos1 sos2 sum system table then until using variable variables while1 xor yes';

	  return {
	    aliases: ['gms'],
	    case_insensitive: true,
	    keywords: KEYWORDS,
	    contains: [
	      {
	        className: 'section',
	        beginKeywords: 'sets parameters variables equations',
	        end: ';',
	        contains: [
	          {
	            begin: '/',
	            end: '/',
	            contains: [hljs.NUMBER_MODE]
	          }
	        ]
	      },
	      {
	        className: 'string',
	        begin: '\\*{3}', end: '\\*{3}'
	      },
	      hljs.NUMBER_MODE,
	      {
	        className: 'number',
	        begin: '\\$[a-zA-Z0-9]+'
	      }
	    ]
	  };
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	    var GCODE_IDENT_RE = '[A-Z_][A-Z0-9_.]*';
	    var GCODE_CLOSE_RE = '\\%';
	    var GCODE_KEYWORDS = {
	        literal:
	            '',
	        built_in:
	            '',
	        keyword:
	            'IF DO WHILE ENDWHILE CALL ENDIF SUB ENDSUB GOTO REPEAT ENDREPEAT ' +
	            'EQ LT GT NE GE LE OR XOR'
	    };
	    var GCODE_START = {
	        className: 'preprocessor',
	        begin: '([O])([0-9]+)'
	    };
	    var GCODE_CODE = [
	        hljs.C_LINE_COMMENT_MODE,
	        hljs.C_BLOCK_COMMENT_MODE,
	        hljs.COMMENT(/\(/, /\)/),
	        hljs.inherit(hljs.C_NUMBER_MODE, {begin: '([-+]?([0-9]*\\.?[0-9]+\\.?))|' + hljs.C_NUMBER_RE}),
	        hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	        hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	        {
	            className: 'keyword',
	            begin: '([G])([0-9]+\\.?[0-9]?)'
	        },
	        {
	            className: 'title',
	            begin: '([M])([0-9]+\\.?[0-9]?)'
	        },
	        {
	            className: 'title',
	            begin: '(VC|VS|#)',
	            end: '(\\d+)'
	        },
	        {
	            className: 'title',
	            begin: '(VZOFX|VZOFY|VZOFZ)'
	        },
	        {
	            className: 'built_in',
	            begin: '(ATAN|ABS|ACOS|ASIN|SIN|COS|EXP|FIX|FUP|ROUND|LN|TAN)(\\[)',
	            end: '([-+]?([0-9]*\\.?[0-9]+\\.?))(\\])'
	        },
	        {
	            className: 'label',
	            variants: [
	                {
	                    begin: 'N', end: '\\d+',
	                    illegal: '\\W'
	                }
	            ]
	        }
	    ];

	    return {
	        aliases: ['nc'],
	        // Some implementations (CNC controls) of G-code are interoperable with uppercase and lowercase letters seamlessly.
	        // However, most prefer all uppercase and uppercase is customary.
	        case_insensitive: true,
	        lexemes: GCODE_IDENT_RE,
	        keywords: GCODE_KEYWORDS,
	        contains: [
	            {
	                className: 'preprocessor',
	                begin: GCODE_CLOSE_RE
	            },
	            GCODE_START
	        ].concat(GCODE_CODE)
	    };
	};

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = function (hljs) {
	  return {
	    aliases: ['feature'],
	    keywords: 'Feature Background Ability Business\ Need Scenario Scenarios Scenario\ Outline Scenario\ Template Examples Given And Then But When',
	    contains: [
	      {
	        className: 'keyword',
	        begin: '\\*'
	      },
	      hljs.COMMENT('@[^@\r\n\t ]+', '$'),
	      {
	        begin: '\\|', end: '\\|\\w*$',
	        contains: [
	          {
	            className: 'string',
	            begin: '[^|]+'
	          }
	        ]
	      },
	      {
	        className: 'variable',
	        begin: '<', end: '>'
	      },
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'string',
	        begin: '"""', end: '"""'
	      },
	      hljs.QUOTE_STRING_MODE
	    ]
	  };
	};

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      keyword:
	        'atomic_uint attribute bool break bvec2 bvec3 bvec4 case centroid coherent const continue default ' +
	        'discard dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 dmat3x4 dmat4 dmat4x2 dmat4x3 ' +
	        'dmat4x4 do double dvec2 dvec3 dvec4 else flat float for highp if iimage1D iimage1DArray ' +
	        'iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer iimageCube ' +
	        'iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray image2DRect ' +
	        'image3D imageBuffer imageCube imageCubeArray in inout int invariant isampler1D isampler1DArray ' +
	        'isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D isamplerBuffer ' +
	        'isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 layout lowp mat2 mat2x2 mat2x3 mat2x4 mat3 mat3x2 ' +
	        'mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 mediump noperspective out patch precision readonly restrict ' +
	        'return sample sampler1D sampler1DArray sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray ' +
	        'sampler2DArrayShadow sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow ' +
	        'sampler3D samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow smooth ' +
	        'struct subroutine switch uimage1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray ' +
	        'uimage2DRect uimage3D uimageBuffer uimageCube uimageCubeArray uint uniform usampler1D usampler1DArray ' +
	        'usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D usamplerBuffer ' +
	        'usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 varying vec2 vec3 vec4 void volatile while writeonly',
	      built_in:
	        'gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial ' +
	        'gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color ' +
	        'gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord ' +
	        'gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor ' +
	        'gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial ' +
	        'gl_FrontSecondaryColor gl_InstanceID gl_InvocationID gl_Layer gl_LightModel ' +
	        'gl_LightSource gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize ' +
	        'gl_MaxClipDistances gl_MaxClipPlanes gl_MaxCombinedAtomicCounterBuffers ' +
	        'gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms gl_MaxCombinedImageUnitsAndFragmentOutputs ' +
	        'gl_MaxCombinedTextureImageUnits gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers ' +
	        'gl_MaxFragmentAtomicCounters gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents ' +
	        'gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers ' +
	        'gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents ' +
	        'gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits ' +
	        'gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents ' +
	        'gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset ' +
	        'gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms ' +
	        'gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits ' +
	        'gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents ' +
	        'gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters ' +
	        'gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents ' +
	        'gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents ' +
	        'gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits ' +
	        'gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors ' +
	        'gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs ' +
	        'gl_MaxVertexImageUniforms gl_MaxVertexOutputComponents gl_MaxVertexTextureImageUnits ' +
	        'gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffset'+
	        'gl_ModelViewMatrix gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose ' +
	        'gl_ModelViewMatrixTranspose gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse ' +
	        'gl_ModelViewProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixTranspose ' +
	        'gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 ' +
	        'gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_Normal gl_NormalMatrix ' +
	        'gl_NormalScale gl_ObjectPlaneQ gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn ' +
	        'gl_PerVertex gl_Point gl_PointCoord gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn ' +
	        'gl_ProjectionMatrix gl_ProjectionMatrixInverse gl_ProjectionMatrixInverseTranspose ' +
	        'gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask gl_SampleMaskIn gl_SamplePosition ' +
	        'gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter gl_TexCoord gl_TextureEnvColor ' +
	        'gl_TextureMatrixInverseTranspose gl_TextureMatrixTranspose gl_Vertex gl_VertexID ' +
	        'gl_ViewportIndex gl_in gl_out EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive ' +
	        'abs acos acosh all any asin asinh atan atanh atomicCounter atomicCounterDecrement ' +
	        'atomicCounterIncrement barrier bitCount bitfieldExtract bitfieldInsert bitfieldReverse ' +
	        'ceil clamp cos cosh cross dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward ' +
	        'findLSB findMSB floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan ' +
	        'greaterThanEqual imageAtomicAdd imageAtomicAnd imageAtomicCompSwap imageAtomicExchange ' +
	        'imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad imageStore imulExtended ' +
	        'intBitsToFloat interpolateAtCentroid interpolateAtOffset interpolateAtSample inverse inversesqrt ' +
	        'isinf isnan ldexp length lessThan lessThanEqual log log2 matrixCompMult max memoryBarrier ' +
	        'min mix mod modf noise1 noise2 noise3 noise4 normalize not notEqual outerProduct packDouble2x32 ' +
	        'packHalf2x16 packSnorm2x16 packSnorm4x8 packUnorm2x16 packUnorm4x8 pow radians reflect refract ' +
	        'round roundEven shadow1D shadow1DLod shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj ' +
	        'shadow2DProjLod sign sin sinh smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture ' +
	        'texture1D texture1DLod texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj ' +
	        'texture2DProjLod texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod ' +
	        'textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset textureLod ' +
	        'textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset textureProjLod ' +
	        'textureProjLodOffset textureProjOffset textureQueryLod textureSize transpose trunc uaddCarry ' +
	        'uintBitsToFloat umulExtended unpackDouble2x32 unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 ' +
	        'unpackUnorm2x16 unpackUnorm4x8 usubBorrow gl_TextureMatrix gl_TextureMatrixInverse',
	      literal: 'true false'
	    },
	    illegal: '"',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$'
	      }
	    ]
	  };
	};

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var GO_KEYWORDS = {
	    keyword:
	      'break default func interface select case map struct chan else goto package switch ' +
	      'const fallthrough if range type continue for import return var go defer',
	    constant:
	       'true false iota nil',
	    typename:
	      'bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 ' +
	      'uint16 uint32 uint64 int uint uintptr rune',
	    built_in:
	      'append cap close complex copy imag len make new panic print println real recover delete'
	  };
	  return {
	    aliases: ["golang"],
	    keywords: GO_KEYWORDS,
	    illegal: '</',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: '\'', end: '[^\\\\]\''
	      },
	      {
	        className: 'string',
	        begin: '`', end: '`'
	      },
	      {
	        className: 'number',
	        begin: hljs.C_NUMBER_RE + '[dflsi]?',
	        relevance: 0
	      },
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	    return {
	      keywords: {
	        keyword:
	          'println readln print import module function local return let var ' +
	          'while for foreach times in case when match with break continue ' +
	          'augment augmentation each find filter reduce ' +
	          'if then else otherwise try catch finally raise throw orIfNull',
	        typename:
	          'DynamicObject|10 DynamicVariable struct Observable map set vector list array',
	        literal:
	          'true false null'
	      },
	      contains: [
	        hljs.HASH_COMMENT_MODE,
	        hljs.QUOTE_STRING_MODE,
	        hljs.C_NUMBER_MODE,
	        {
	          className: 'annotation', begin: '@[A-Za-z]+'
	        }
	      ]
	    }
	};

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'task project allprojects subprojects artifacts buildscript configurations ' +
	        'dependencies repositories sourceSets description delete from into include ' +
	        'exclude source classpath destinationDir includes options sourceCompatibility ' +
	        'targetCompatibility group flatDir doLast doFirst flatten todir fromdir ant ' +
	        'def abstract break case catch continue default do else extends final finally ' +
	        'for if implements instanceof native new private protected public return static ' +
	        'switch synchronized throw throws transient try volatile while strictfp package ' +
	        'import false null super this true antlrtask checkstyle codenarc copy boolean ' +
	        'byte char class double float int interface long short void compile runTime ' +
	        'file fileTree abs any append asList asWritable call collect compareTo count ' +
	        'div dump each eachByte eachFile eachLine every find findAll flatten getAt ' +
	        'getErr getIn getOut getText grep immutable inject inspect intersect invokeMethods ' +
	        'isCase join leftShift minus multiply newInputStream newOutputStream newPrintWriter ' +
	        'newReader newWriter next plus pop power previous print println push putAt read ' +
	        'readBytes readLines reverse reverseEach round size sort splitEachLine step subMap ' +
	        'times toInteger toList tokenize upto waitForOrKill withPrintWriter withReader ' +
	        'withStream withWriter withWriterAppend write writeLine'
	    },
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.NUMBER_MODE,
	      hljs.REGEXP_MODE

	    ]
	  }
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	    return {
	        keywords: {
	            typename: 'byte short char int long boolean float double void',
	            literal : 'true false null',
	            keyword:
	            // groovy specific keywords
	            'def as in assert trait ' +
	            // common keywords with Java
	            'super this abstract static volatile transient public private protected synchronized final ' +
	            'class interface enum if else for while switch case break default continue ' +
	            'throw throws try catch finally implements extends new import package return instanceof'
	        },

	        contains: [
	            hljs.COMMENT(
	                '/\\*\\*',
	                '\\*/',
	                {
	                    relevance : 0,
	                    contains : [{
	                        className : 'doctag',
	                        begin : '@[A-Za-z]+'
	                    }]
	                }
	            ),
	            hljs.C_LINE_COMMENT_MODE,
	            hljs.C_BLOCK_COMMENT_MODE,
	            {
	                className: 'string',
	                begin: '"""', end: '"""'
	            },
	            {
	                className: 'string',
	                begin: "'''", end: "'''"
	            },
	            {
	                className: 'string',
	                begin: "\\$/", end: "/\\$",
	                relevance: 10
	            },
	            hljs.APOS_STRING_MODE,
	            {
	                className: 'regexp',
	                begin: /~?\/[^\/\n]+\//,
	                contains: [
	                    hljs.BACKSLASH_ESCAPE
	                ]
	            },
	            hljs.QUOTE_STRING_MODE,
	            {
	                className: 'shebang',
	                begin: "^#!/usr/bin/env", end: '$',
	                illegal: '\n'
	            },
	            hljs.BINARY_NUMBER_MODE,
	            {
	                className: 'class',
	                beginKeywords: 'class interface trait enum', end: '{',
	                illegal: ':',
	                contains: [
	                    {beginKeywords: 'extends implements'},
	                    hljs.UNDERSCORE_TITLE_MODE,
	                ]
	            },
	            hljs.C_NUMBER_MODE,
	            {
	                className: 'annotation', begin: '@[A-Za-z]+'
	            },
	            {
	                // highlight map keys and named parameters as strings
	                className: 'string', begin: /[^\?]{0}[A-Za-z0-9_$]+ *:/
	            },
	            {
	                // catch middle element of the ternary operator
	                // to avoid highlight it as a label, named parameter, or map key
	                begin: /\?/, end: /\:/
	            },
	            {
	                // highlight labeled statements
	                className: 'label', begin: '^\\s*[A-Za-z0-9_$]+:',
	                relevance: 0
	            },
	        ],
	        illegal: /#/
	    }
	};

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = // TODO support filter tags like :javascript, support inline HTML
	function(hljs) {
	  return {
	    case_insensitive: true,
	    contains: [
	      {
	        className: 'doctype',
	        begin: '^!!!( (5|1\\.1|Strict|Frameset|Basic|Mobile|RDFa|XML\\b.*))?$',
	        relevance: 10
	      },
	      // FIXME these comments should be allowed to span indented lines
	      hljs.COMMENT(
	        '^\\s*(!=#|=#|-#|/).*$',
	        false,
	        {
	          relevance: 0
	        }
	      ),
	      {
	        begin: '^\\s*(-|=|!=)(?!#)',
	        starts: {
	          end: '\\n',
	          subLanguage: 'ruby'
	        }
	      },
	      {
	        className: 'tag',
	        begin: '^\\s*%',
	        contains: [
	          {
	            className: 'title',
	            begin: '\\w+'
	          },
	          {
	            className: 'value',
	            begin: '[#\\.][\\w-]+'
	          },
	          {
	            begin: '{\\s*',
	            end: '\\s*}',
	            excludeEnd: true,
	            contains: [
	              {
	                //className: 'attribute',
	                begin: ':\\w+\\s*=>',
	                end: ',\\s+',
	                returnBegin: true,
	                endsWithParent: true,
	                contains: [
	                  {
	                    className: 'symbol',
	                    begin: ':\\w+'
	                  },
	                  hljs.APOS_STRING_MODE,
	                  hljs.QUOTE_STRING_MODE,
	                  {
	                    begin: '\\w+',
	                    relevance: 0
	                  }
	                ]
	              }
	            ]
	          },
	          {
	            begin: '\\(\\s*',
	            end: '\\s*\\)',
	            excludeEnd: true,
	            contains: [
	              {
	                //className: 'attribute',
	                begin: '\\w+\\s*=',
	                end: '\\s+',
	                returnBegin: true,
	                endsWithParent: true,
	                contains: [
	                  {
	                    className: 'attribute',
	                    begin: '\\w+',
	                    relevance: 0
	                  },
	                  hljs.APOS_STRING_MODE,
	                  hljs.QUOTE_STRING_MODE,
	                  {
	                    begin: '\\w+',
	                    relevance: 0
	                  }
	                ]
	              }
	            ]
	          }
	        ]
	      },
	      {
	        className: 'bullet',
	        begin: '^\\s*[=~]\\s*',
	        relevance: 0
	      },
	      {
	        begin: '#{',
	        starts: {
	          end: '}',
	          subLanguage: 'ruby'
	        }
	      }
	    ]
	  };
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var EXPRESSION_KEYWORDS = 'each in with if else unless bindattr action collection debugger log outlet template unbound view yield';
	  return {
	    aliases: ['hbs', 'html.hbs', 'html.handlebars'],
	    case_insensitive: true,
	    subLanguage: 'xml',
	    contains: [
	      {
	        className: 'expression',
	        begin: '{{', end: '}}',
	        contains: [
	          {
	            className: 'begin-block', begin: '\#[a-zA-Z\-\ \.]+',
	            keywords: EXPRESSION_KEYWORDS
	          },
	          {
	            className: 'string',
	            begin: '"', end: '"'
	          },
	          {
	            className: 'end-block', begin: '\\\/[a-zA-Z\-\ \.]+',
	            keywords: EXPRESSION_KEYWORDS
	          },
	          {
	            className: 'variable', begin: '[a-zA-Z\-\.]+',
	            keywords: EXPRESSION_KEYWORDS
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMENT_MODES = [
	    hljs.COMMENT('--', '$'),
	    hljs.COMMENT(
	      '{-',
	      '-}',
	      {
	        contains: ['self']
	      }
	    )
	  ];

	  var PRAGMA = {
	    className: 'pragma',
	    begin: '{-#', end: '#-}'
	  };

	  var PREPROCESSOR = {
	    className: 'preprocessor',
	    begin: '^#', end: '$'
	  };

	  var CONSTRUCTOR = {
	    className: 'type',
	    begin: '\\b[A-Z][\\w\']*', // TODO: other constructors (build-in, infix).
	    relevance: 0
	  };

	  var LIST = {
	    className: 'container',
	    begin: '\\(', end: '\\)',
	    illegal: '"',
	    contains: [
	      PRAGMA,
	      PREPROCESSOR,
	      {className: 'type', begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'},
	      hljs.inherit(hljs.TITLE_MODE, {begin: '[_a-z][\\w\']*'})
	    ].concat(COMMENT_MODES)
	  };

	  var RECORD = {
	    className: 'container',
	    begin: '{', end: '}',
	    contains: LIST.contains
	  };

	  return {
	    aliases: ['hs'],
	    keywords:
	      'let in if then else case of where do module import hiding ' +
	      'qualified type data newtype deriving class instance as default ' +
	      'infix infixl infixr foreign export ccall stdcall cplusplus ' +
	      'jvm dotnet safe unsafe family forall mdo proc rec',
	    contains: [

	      // Top-level constructions.

	      {
	        className: 'module',
	        begin: '\\bmodule\\b', end: 'where',
	        keywords: 'module where',
	        contains: [LIST].concat(COMMENT_MODES),
	        illegal: '\\W\\.|;'
	      },
	      {
	        className: 'import',
	        begin: '\\bimport\\b', end: '$',
	        keywords: 'import|0 qualified as hiding',
	        contains: [LIST].concat(COMMENT_MODES),
	        illegal: '\\W\\.|;'
	      },

	      {
	        className: 'class',
	        begin: '^(\\s*)?(class|instance)\\b', end: 'where',
	        keywords: 'class family instance where',
	        contains: [CONSTRUCTOR, LIST].concat(COMMENT_MODES)
	      },
	      {
	        className: 'typedef',
	        begin: '\\b(data|(new)?type)\\b', end: '$',
	        keywords: 'data family type newtype deriving',
	        contains: [PRAGMA, CONSTRUCTOR, LIST, RECORD].concat(COMMENT_MODES)
	      },
	      {
	        className: 'default',
	        beginKeywords: 'default', end: '$',
	        contains: [CONSTRUCTOR, LIST].concat(COMMENT_MODES)
	      },
	      {
	        className: 'infix',
	        beginKeywords: 'infix infixl infixr', end: '$',
	        contains: [hljs.C_NUMBER_MODE].concat(COMMENT_MODES)
	      },
	      {
	        className: 'foreign',
	        begin: '\\bforeign\\b', end: '$',
	        keywords: 'foreign import export ccall stdcall cplusplus jvm ' +
	                  'dotnet safe unsafe',
	        contains: [CONSTRUCTOR, hljs.QUOTE_STRING_MODE].concat(COMMENT_MODES)
	      },
	      {
	        className: 'shebang',
	        begin: '#!\\/usr\\/bin\\/env\ runhaskell', end: '$'
	      },

	      // "Whitespaces".

	      PRAGMA,
	      PREPROCESSOR,

	      // Literals and names.

	      // TODO: characters.
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      CONSTRUCTOR,
	      hljs.inherit(hljs.TITLE_MODE, {begin: '^[_a-z][\\w\']*'}),

	      {begin: '->|<-'} // No markup, relevance booster
	    ].concat(COMMENT_MODES)
	  };
	};

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE = '[a-zA-Z_$][a-zA-Z0-9_$]*';
	  var IDENT_FUNC_RETURN_TYPE_RE = '([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)';

	  return {
	    aliases: ['hx'],
	    keywords: {
	      keyword: 'break callback case cast catch class continue default do dynamic else enum extends extern ' +
	    'for function here if implements import in inline interface never new override package private ' +
	    'public return static super switch this throw trace try typedef untyped using var while',
	      literal: 'true false null'
	    },
	    contains: [
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        contains: [
	          {
	            beginKeywords: 'extends implements'
	          },
	          hljs.TITLE_MODE
	        ]
	      },
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$',
	        keywords: 'if else elseif end error'
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: '[{;]', excludeEnd: true,
	        illegal: '\\S',
	        contains: [
	          hljs.TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)',
	            contains: [
	              hljs.APOS_STRING_MODE,
	              hljs.QUOTE_STRING_MODE,
	              hljs.C_LINE_COMMENT_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ]
	          },
	          {
	            className: 'type',
	            begin: ':',
	            end: IDENT_FUNC_RETURN_TYPE_RE,
	            relevance: 10
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['https'],
	    illegal: '\\S',
	    contains: [
	      {
	        className: 'status',
	        begin: '^HTTP/[0-9\\.]+', end: '$',
	        contains: [{className: 'number', begin: '\\b\\d{3}\\b'}]
	      },
	      {
	        className: 'request',
	        begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$', returnBegin: true, end: '$',
	        contains: [
	          {
	            className: 'string',
	            begin: ' ', end: ' ',
	            excludeBegin: true, excludeEnd: true
	          }
	        ]
	      },
	      {
	        className: 'attribute',
	        begin: '^\\w', end: ': ', excludeEnd: true,
	        illegal: '\\n|\\s|=',
	        starts: {className: 'string', end: '$'}
	      },
	      {
	        begin: '\\n\\n',
	        starts: {subLanguage: [], endsWithParent: true}
	      }
	    ]
	  };
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var START_BRACKET = '\\[';
	  var END_BRACKET = '\\]';
	  return {
	    aliases: ['i7'],
	    case_insensitive: true,
	    keywords: {
	      // Some keywords more or less unique to I7, for relevance.
	      keyword:
	        // kind:
	        'thing room person man woman animal container ' +
	        'supporter backdrop door ' +
	        // characteristic:
	        'scenery open closed locked inside gender ' +
	        // verb:
	        'is are say understand ' +
	        // misc keyword:
	        'kind of rule'
	    },
	    contains: [
	      {
	        className: 'string',
	        begin: '"', end: '"',
	        relevance: 0,
	        contains: [
	          {
	            className: 'subst',
	            begin: START_BRACKET, end: END_BRACKET
	          }
	        ]
	      },
	      {
	        className: 'title',
	        begin: /^(Volume|Book|Part|Chapter|Section|Table)\b/,
	        end: '$'
	      },
	      {
	        // Rule definition
	        // This is here for relevance.
	        begin: /^(Check|Carry out|Report|Instead of|To|Rule|When|Before|After)\b/,
	        end: ':',
	        contains: [
	          {
	            //Rule name
	            begin: '\\b\\(This',
	            end: '\\)'
	          }
	        ]
	      },
	      {
	        className: 'comment',
	        begin: START_BRACKET, end: END_BRACKET,
	        contains: ['self']
	      }
	    ]
	  };
	};

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var STRING = {
	    className: "string",
	    contains: [hljs.BACKSLASH_ESCAPE],
	    variants: [
	      {
	        begin: "'''", end: "'''",
	        relevance: 10
	      }, {
	        begin: '"""', end: '"""',
	        relevance: 10
	      }, {
	        begin: '"', end: '"'
	      }, {
	        begin: "'", end: "'"
	      }
	    ]
	  };
	  return {
	    aliases: ['toml'],
	    case_insensitive: true,
	    illegal: /\S/,
	    contains: [
	      hljs.COMMENT(';', '$'),
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'title',
	        begin: /^\s*\[+/, end: /\]+/
	      },
	      {
	        className: 'setting',
	        begin: /^[a-z0-9\[\]_-]+\s*=\s*/, end: '$',
	        contains: [
	          {
	            className: 'value',
	            endsWithParent: true,
	            keywords: 'on off true false yes no',
	            contains: [
	              {
	                className: 'variable',
	                variants: [
	                  {begin: /\$[\w\d"][\w\d_]*/},
	                  {begin: /\$\{(.*?)}/}
	                ]
	              },
	              STRING,
	              {
	                className: 'number',
	                begin: /([\+\-]+)?[\d]+_[\d_]+/
	              },
	              hljs.NUMBER_MODE
	            ],
	            relevance: 0
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)'
	  };

	  var F_KEYWORDS = {
	    constant: '.False. .True.',
	    type: 'integer real character complex logical dimension allocatable|10 parameter ' +
	      'external implicit|10 none double precision assign intent optional pointer ' +
	      'target in out common equivalence data',
	    keyword: 'kind do while private call intrinsic where elsewhere ' +
	      'type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then ' +
	      'public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. ' +
	      'goto save else use module select case ' +
	      'access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit ' +
	      'continue format pause cycle exit ' +
	      'c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg ' +
	      'synchronous nopass non_overridable pass protected volatile abstract extends import ' +
	      'non_intrinsic value deferred generic final enumerator class associate bind enum ' +
	      'c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t ' +
	      'c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double ' +
	      'c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr ' +
	      'c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer ' +
	      'c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor ' +
	      'numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control ' +
	      'ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive ' +
	      'pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure ' +
	      // IRPF90 special keywords
	      'begin_provider &begin_provider end_provider begin_shell end_shell begin_template end_template subst assert touch ' +
	      'soft_touch provide no_dep free irp_if irp_else irp_endif irp_write irp_read',
	    built_in: 'alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint ' +
	      'dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl ' +
	      'algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama ' +
	      'iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod ' +
	      'qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log ' +
	      'log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate ' +
	      'adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product ' +
	      'eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul ' +
	      'maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product ' +
	      'radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind ' +
	      'set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer ' +
	      'dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end ' +
	      'ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode ' +
	      'is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of'  +
	      'acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 ' +
	      'atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits ' +
	      'bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr ' +
	      'num_images parity popcnt poppar shifta shiftl shiftr this_image ' +
	      // IRPF90 special built_ins
	      'IRP_ALIGN irp_here'
	  };
	  return {
	    case_insensitive: true,
	    keywords: F_KEYWORDS,
	    illegal: /\/\*/,
	    contains: [
	      hljs.inherit(hljs.APOS_STRING_MODE, {className: 'string', relevance: 0}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {className: 'string', relevance: 0}),
	      {
	        className: 'function',
	        beginKeywords: 'subroutine function program',
	        illegal: '[${=\\n]',
	        contains: [hljs.UNDERSCORE_TITLE_MODE, PARAMS]
	      },
	      hljs.COMMENT('!', '$', {relevance: 0}),
	      hljs.COMMENT('begin_doc', 'end_doc', {relevance: 10}),
	      {
	        className: 'number',
	        begin: '(?=\\b|\\+|\\-|\\.)(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*)(?:[de][+-]?\\d+)?\\b\\.?',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var GENERIC_IDENT_RE = hljs.UNDERSCORE_IDENT_RE + '(<' + hljs.UNDERSCORE_IDENT_RE + '>)?';
	  var KEYWORDS =
	    'false synchronized int abstract float private char boolean static null if const ' +
	    'for true while long strictfp finally protected import native final void ' +
	    'enum else break transient catch instanceof byte super volatile case assert short ' +
	    'package default double public try this switch continue throws protected public private';

	  // https://docs.oracle.com/javase/7/docs/technotes/guides/language/underscores-literals.html
	  var JAVA_NUMBER_RE = '\\b' +
	    '(' +
	      '0[bB]([01]+[01_]+[01]+|[01]+)' + // 0b...
	      '|' +
	      '0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)' + // 0x...
	      '|' +
	      '(' +
	        '([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?' +
	        '|' +
	        '\\.([\\d]+[\\d_]+[\\d]+|[\\d]+)' +
	      ')' +
	      '([eE][-+]?\\d+)?' + // octal, decimal, float
	    ')' +
	    '[lLfF]?';
	  var JAVA_NUMBER_MODE = {
	    className: 'number',
	    begin: JAVA_NUMBER_RE,
	    relevance: 0
	  };

	  return {
	    aliases: ['jsp'],
	    keywords: KEYWORDS,
	    illegal: /<\/|#/,
	    contains: [
	      hljs.COMMENT(
	        '/\\*\\*',
	        '\\*/',
	        {
	          relevance : 0,
	          contains : [{
	            className : 'doctag',
	            begin : '@[A-Za-z]+'
	          }]
	        }
	      ),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: /[{;=]/, excludeEnd: true,
	        keywords: 'class interface',
	        illegal: /[:"\[\]]/,
	        contains: [
	          {beginKeywords: 'extends implements'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        // Expression keywords prevent 'keyword Name(...)' from being
	        // recognized as a function definition
	        beginKeywords: 'new throw return else',
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: '(' + GENERIC_IDENT_RE + '\\s+)+' + hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=]/,
	        excludeEnd: true,
	        keywords: KEYWORDS,
	        contains: [
	          {
	            begin: hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true,
	            relevance: 0,
	            contains: [hljs.UNDERSCORE_TITLE_MODE]
	          },
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            keywords: KEYWORDS,
	            relevance: 0,
	            contains: [
	              hljs.APOS_STRING_MODE,
	              hljs.QUOTE_STRING_MODE,
	              hljs.C_NUMBER_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      },
	      JAVA_NUMBER_MODE,
	      {
	        className: 'annotation', begin: '@[A-Za-z]+'
	      }
	    ]
	  };
	};

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['js'],
	    keywords: {
	      keyword:
	        'in of if for while finally var new function do return void else break catch ' +
	        'instanceof with throw case default try this switch continue typeof delete ' +
	        'let yield const export super debugger as async await',
	      literal:
	        'true false null undefined NaN Infinity',
	      built_in:
	        'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
	        'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
	        'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
	        'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
	        'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
	        'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
	        'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
	        'Promise'
	    },
	    contains: [
	      {
	        className: 'pi',
	        relevance: 10,
	        begin: /^\s*['"]use (strict|asm)['"]/
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      { // template string
	        className: 'string',
	        begin: '`', end: '`',
	        contains: [
	          hljs.BACKSLASH_ESCAPE,
	          {
	            className: 'subst',
	            begin: '\\$\\{', end: '\\}'
	          }
	        ]
	      },
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'number',
	        variants: [
	          { begin: '\\b(0[bB][01]+)' },
	          { begin: '\\b(0[oO][0-7]+)' },
	          { begin: hljs.C_NUMBER_RE }
	        ],
	        relevance: 0
	      },
	      { // "value" container
	        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
	        keywords: 'return throw case',
	        contains: [
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE,
	          hljs.REGEXP_MODE,
	          { // E4X / JSX
	            begin: /</, end: />\s*[);\]]/,
	            relevance: 0,
	            subLanguage: 'xml'
	          }
	        ],
	        relevance: 0
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: /\{/, excludeEnd: true,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            excludeBegin: true,
	            excludeEnd: true,
	            contains: [
	              hljs.C_LINE_COMMENT_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ]
	          }
	        ],
	        illegal: /\[|%/
	      },
	      {
	        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
	      },
	      {
	        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
	      },
	      // ECMAScript 6 modules import
	      {
	        beginKeywords: 'import', end: '[;$]',
	        keywords: 'import from as',
	        contains: [
	          hljs.APOS_STRING_MODE,
	          hljs.QUOTE_STRING_MODE
	        ]
	      },
	      { // ES6 class
	        className: 'class',
	        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
	        illegal: /[:"\[\]]/,
	        contains: [
	          {beginKeywords: 'extends'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      }
	    ],
	    illegal: /#/
	  };
	};

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var LITERALS = {literal: 'true false null'};
	  var TYPES = [
	    hljs.QUOTE_STRING_MODE,
	    hljs.C_NUMBER_MODE
	  ];
	  var VALUE_CONTAINER = {
	    className: 'value',
	    end: ',', endsWithParent: true, excludeEnd: true,
	    contains: TYPES,
	    keywords: LITERALS
	  };
	  var OBJECT = {
	    begin: '{', end: '}',
	    contains: [
	      {
	        className: 'attribute',
	        begin: '\\s*"', end: '"\\s*:\\s*', excludeBegin: true, excludeEnd: true,
	        contains: [hljs.BACKSLASH_ESCAPE],
	        illegal: '\\n',
	        starts: VALUE_CONTAINER
	      }
	    ],
	    illegal: '\\S'
	  };
	  var ARRAY = {
	    begin: '\\[', end: '\\]',
	    contains: [hljs.inherit(VALUE_CONTAINER, {className: null})], // inherit is also a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
	    illegal: '\\S'
	  };
	  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
	  return {
	    contains: TYPES,
	    keywords: LITERALS,
	    illegal: '\\S'
	  };
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  // Since there are numerous special names in Julia, it is too much trouble
	  // to maintain them by hand. Hence these names (i.e. keywords, literals and
	  // built-ins) are automatically generated from Julia (v0.3.0) itself through
	  // following scripts for each.

	  var KEYWORDS = {
	    // # keyword generator
	    // println("\"in\",")
	    // for kw in Base.REPLCompletions.complete_keyword("")
	    //     println("\"$kw\",")
	    // end
	    keyword:
	      'in abstract baremodule begin bitstype break catch ccall const continue do else elseif end export ' +
	      'finally for function global if immutable import importall let local macro module quote return try type ' +
	      'typealias using while',

	    // # literal generator
	    // println("\"true\",\n\"false\"")
	    // for name in Base.REPLCompletions.completions("", 0)[1]
	    //     try
	    //         s = symbol(name)
	    //         v = eval(s)
	    //         if !isa(v, Function) &&
	    //            !isa(v, DataType) &&
	    //            !issubtype(typeof(v), Tuple) &&
	    //            !isa(v, UnionType) &&
	    //            !isa(v, Module) &&
	    //            !isa(v, TypeConstructor) &&
	    //            !isa(v, Colon)
	    //             println("\"$name\",")
	    //         end
	    //     end
	    // end
	    literal:
	      'true false ANY ARGS CPU_CORES C_NULL DL_LOAD_PATH DevNull ENDIAN_BOM ENV I|0 Inf Inf16 Inf32 ' +
	      'InsertionSort JULIA_HOME LOAD_PATH MS_ASYNC MS_INVALIDATE MS_SYNC MergeSort NaN NaN16 NaN32 OS_NAME QuickSort ' +
	      'RTLD_DEEPBIND RTLD_FIRST RTLD_GLOBAL RTLD_LAZY RTLD_LOCAL RTLD_NODELETE RTLD_NOLOAD RTLD_NOW RoundDown ' +
	      'RoundFromZero RoundNearest RoundToZero RoundUp STDERR STDIN STDOUT VERSION WORD_SIZE catalan cglobal e|0 eu|0 ' +
	      'eulergamma golden im nothing pi γ π φ',

	    // # built_in generator:
	    // for name in Base.REPLCompletions.completions("", 0)[1]
	    //     try
	    //         v = eval(symbol(name))
	    //         if isa(v, DataType)
	    //             println("\"$name\",")
	    //         end
	    //     end
	    // end
	    built_in:
	      'ASCIIString AbstractArray AbstractRNG AbstractSparseArray Any ArgumentError Array Associative Base64Pipe ' +
	      'Bidiagonal BigFloat BigInt BitArray BitMatrix BitVector Bool BoundsError Box CFILE Cchar Cdouble Cfloat Char ' +
	      'CharString Cint Clong Clonglong ClusterManager Cmd Coff_t Colon Complex Complex128 Complex32 Complex64 ' +
	      'Condition Cptrdiff_t Cshort Csize_t Cssize_t Cuchar Cuint Culong Culonglong Cushort Cwchar_t DArray DataType ' +
	      'DenseArray Diagonal Dict DimensionMismatch DirectIndexString Display DivideError DomainError EOFError ' +
	      'EachLine Enumerate ErrorException Exception Expr Factorization FileMonitor FileOffset Filter Float16 Float32 ' +
	      'Float64 FloatRange FloatingPoint Function GetfieldNode GotoNode Hermitian IO IOBuffer IOStream IPv4 IPv6 ' +
	      'InexactError Int Int128 Int16 Int32 Int64 Int8 IntSet Integer InterruptException IntrinsicFunction KeyError ' +
	      'LabelNode LambdaStaticData LineNumberNode LoadError LocalProcess MIME MathConst MemoryError MersenneTwister ' +
	      'Method MethodError MethodTable Module NTuple NewvarNode Nothing Number ObjectIdDict OrdinalRange ' +
	      'OverflowError ParseError PollingFileWatcher ProcessExitedException ProcessGroup Ptr QuoteNode Range Range1 ' +
	      'Ranges Rational RawFD Real Regex RegexMatch RemoteRef RepString RevString RopeString RoundingMode Set ' +
	      'SharedArray Signed SparseMatrixCSC StackOverflowError Stat StatStruct StepRange String SubArray SubString ' +
	      'SymTridiagonal Symbol SymbolNode Symmetric SystemError Task TextDisplay Timer TmStruct TopNode Triangular ' +
	      'Tridiagonal Type TypeConstructor TypeError TypeName TypeVar UTF16String UTF32String UTF8String UdpSocket ' +
	      'Uint Uint128 Uint16 Uint32 Uint64 Uint8 UndefRefError UndefVarError UniformScaling UnionType UnitRange ' +
	      'Unsigned Vararg VersionNumber WString WeakKeyDict WeakRef Woodbury Zip'
	  };

	  // ref: http://julia.readthedocs.org/en/latest/manual/variables/#allowed-variable-names
	  var VARIABLE_NAME_RE = "[A-Za-z_\\u00A1-\\uFFFF][A-Za-z_0-9\\u00A1-\\uFFFF]*";

	  // placeholder for recursive self-reference
	  var DEFAULT = { lexemes: VARIABLE_NAME_RE, keywords: KEYWORDS };

	  var TYPE_ANNOTATION = {
	    className: "type-annotation",
	    begin: /::/
	  };

	  var SUBTYPE = {
	    className: "subtype",
	    begin: /<:/
	  };

	  // ref: http://julia.readthedocs.org/en/latest/manual/integers-and-floating-point-numbers/
	  var NUMBER = {
	    className: "number",
	    // supported numeric literals:
	    //  * binary literal (e.g. 0x10)
	    //  * octal literal (e.g. 0o76543210)
	    //  * hexadecimal literal (e.g. 0xfedcba876543210)
	    //  * hexadecimal floating point literal (e.g. 0x1p0, 0x1.2p2)
	    //  * decimal literal (e.g. 9876543210, 100_000_000)
	    //  * floating pointe literal (e.g. 1.2, 1.2f, .2, 1., 1.2e10, 1.2e-10)
	    begin: /(\b0x[\d_]*(\.[\d_]*)?|0x\.\d[\d_]*)p[-+]?\d+|\b0[box][a-fA-F0-9][a-fA-F0-9_]*|(\b\d[\d_]*(\.[\d_]*)?|\.\d[\d_]*)([eEfF][-+]?\d+)?/,
	    relevance: 0
	  };

	  var CHAR = {
	    className: "char",
	    begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/
	  };

	  var INTERPOLATION = {
	    className: 'subst',
	    begin: /\$\(/, end: /\)/,
	    keywords: KEYWORDS
	  };

	  var INTERPOLATED_VARIABLE = {
	    className: 'variable',
	    begin: "\\$" + VARIABLE_NAME_RE
	  };

	  // TODO: neatly escape normal code in string literal
	  var STRING = {
	    className: "string",
	    contains: [hljs.BACKSLASH_ESCAPE, INTERPOLATION, INTERPOLATED_VARIABLE],
	    variants: [
	      { begin: /\w*"/, end: /"\w*/ },
	      { begin: /\w*"""/, end: /"""\w*/ }
	    ]
	  };

	  var COMMAND = {
	    className: "string",
	    contains: [hljs.BACKSLASH_ESCAPE, INTERPOLATION, INTERPOLATED_VARIABLE],
	    begin: '`', end: '`'
	  };

	  var MACROCALL = {
	    className: "macrocall",
	    begin: "@" + VARIABLE_NAME_RE
	  };

	  var COMMENT = {
	    className: "comment",
	    variants: [
	      { begin: "#=", end: "=#", relevance: 10 },
	      { begin: '#', end: '$' }
	    ]
	  };

	  DEFAULT.contains = [
	    NUMBER,
	    CHAR,
	    TYPE_ANNOTATION,
	    SUBTYPE,
	    STRING,
	    COMMAND,
	    MACROCALL,
	    COMMENT,
	    hljs.HASH_COMMENT_MODE
	  ];
	  INTERPOLATION.contains = DEFAULT.contains;

	  return DEFAULT;
	};

/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = function (hljs) {
	  var KEYWORDS = 'val var get set class trait object public open private protected ' +
	    'final enum if else do while for when break continue throw try catch finally ' +
	    'import package is as in return fun override default companion reified inline volatile transient native';

	  return {
	    keywords: {
	      typename: 'Byte Short Char Int Long Boolean Float Double Void Unit Nothing',
	      literal: 'true false null',
	      keyword: KEYWORDS
	    },
	    contains : [
	      hljs.COMMENT(
	        '/\\*\\*',
	        '\\*/',
	        {
	          relevance : 0,
	          contains : [{
	            className : 'doctag',
	            begin : '@[A-Za-z]+'
	          }]
	        }
	      ),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'type',
	        begin: /</, end: />/,
	        returnBegin: true,
	        excludeEnd: false,
	        relevance: 0
	      },
	      {
	        className: 'function',
	        beginKeywords: 'fun', end: '[(]|$',
	        returnBegin: true,
	        excludeEnd: true,
	        keywords: KEYWORDS,
	        illegal: /fun\s+(<.*>)?[^\s\(]+(\s+[^\s\(]+)\s*=/,
	        relevance: 5,
	        contains: [
	          {
	            begin: hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true,
	            relevance: 0,
	            contains: [hljs.UNDERSCORE_TITLE_MODE]
	          },
	          {
	            className: 'type',
	            begin: /</, end: />/, keywords: 'reified',
	            relevance: 0
	          },
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            keywords: KEYWORDS,
	            relevance: 0,
	            illegal: /\([^\(,\s:]+,/,
	            contains: [
	              {
	                className: 'typename',
	                begin: /:\s*/, end: /\s*[=\)]/, excludeBegin: true, returnEnd: true,
	                relevance: 0
	              }
	            ]
	          },
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class trait', end: /[:\{(]|$/,
	        excludeEnd: true,
	        illegal: 'extends implements',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	            className: 'type',
	            begin: /</, end: />/, excludeBegin: true, excludeEnd: true,
	            relevance: 0
	          },
	          {
	            className: 'typename',
	            begin: /[,:]\s*/, end: /[<\(,]|$/, excludeBegin: true, returnEnd: true
	          }
	        ]
	      },
	      {
	        className: 'variable', beginKeywords: 'var val', end: /\s*[=:$]/, excludeEnd: true
	      },
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'shebang',
	        begin: "^#!/usr/bin/env", end: '$',
	        illegal: '\n'
	      },
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var LASSO_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_.]*';
	  var LASSO_ANGLE_RE = '<\\?(lasso(script)?|=)';
	  var LASSO_CLOSE_RE = '\\]|\\?>';
	  var LASSO_KEYWORDS = {
	    literal:
	      'true false none minimal full all void ' +
	      'bw nbw ew new cn ncn lt lte gt gte eq neq rx nrx ft',
	    built_in:
	      'array date decimal duration integer map pair string tag xml null ' +
	      'boolean bytes keyword list locale queue set stack staticarray ' +
	      'local var variable global data self inherited currentcapture givenblock',
	    keyword:
	      'error_code error_msg error_pop error_push error_reset cache ' +
	      'database_names database_schemanames database_tablenames define_tag ' +
	      'define_type email_batch encode_set html_comment handle handle_error ' +
	      'header if inline iterate ljax_target link link_currentaction ' +
	      'link_currentgroup link_currentrecord link_detail link_firstgroup ' +
	      'link_firstrecord link_lastgroup link_lastrecord link_nextgroup ' +
	      'link_nextrecord link_prevgroup link_prevrecord log loop ' +
	      'namespace_using output_none portal private protect records referer ' +
	      'referrer repeating resultset rows search_args search_arguments ' +
	      'select sort_args sort_arguments thread_atomic value_list while ' +
	      'abort case else if_empty if_false if_null if_true loop_abort ' +
	      'loop_continue loop_count params params_up return return_value ' +
	      'run_children soap_definetag soap_lastrequest soap_lastresponse ' +
	      'tag_name ascending average by define descending do equals ' +
	      'frozen group handle_failure import in into join let match max ' +
	      'min on order parent protected provide public require returnhome ' +
	      'skip split_thread sum take thread to trait type where with ' +
	      'yield yieldhome'
	  };
	  var HTML_COMMENT = hljs.COMMENT(
	    '<!--',
	    '-->',
	    {
	      relevance: 0
	    }
	  );
	  var LASSO_NOPROCESS = {
	    className: 'preprocessor',
	    begin: '\\[noprocess\\]',
	    starts: {
	      className: 'markup',
	      end: '\\[/noprocess\\]',
	      returnEnd: true,
	      contains: [HTML_COMMENT]
	    }
	  };
	  var LASSO_START = {
	    className: 'preprocessor',
	    begin: '\\[/noprocess|' + LASSO_ANGLE_RE
	  };
	  var LASSO_DATAMEMBER = {
	    className: 'variable',
	    begin: '\'' + LASSO_IDENT_RE + '\''
	  };
	  var LASSO_CODE = [
	    hljs.COMMENT(
	      '/\\*\\*!',
	      '\\*/'
	    ),
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    hljs.inherit(hljs.C_NUMBER_MODE, {begin: hljs.C_NUMBER_RE + '|(infinity|nan)\\b'}),
	    hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	    hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	    {
	      className: 'string',
	      begin: '`', end: '`'
	    },
	    {
	      className: 'variable',
	      variants: [
	        {
	          begin: '[#$]' + LASSO_IDENT_RE
	        },
	        {
	          begin: '#', end: '\\d+',
	          illegal: '\\W'
	        }
	      ]
	    },
	    {
	      className: 'tag',
	      begin: '::\\s*', end: LASSO_IDENT_RE,
	      illegal: '\\W'
	    },
	    {
	      className: 'attribute',
	      variants: [
	        {
	          begin: '-(?!infinity)' + hljs.UNDERSCORE_IDENT_RE,
	          relevance: 0
	        },
	        {
	          begin: '(\\.\\.\\.)'
	        }
	      ]
	    },
	    {
	      className: 'subst',
	      variants: [
	        {
	          begin: '->\\s*',
	          contains: [LASSO_DATAMEMBER]
	        },
	        {
	          begin: '->|\\\\|&&?|\\|\\||!(?!=|>)|(and|or|not)\\b',
	          relevance: 0
	        }
	      ]
	    },
	    {
	      className: 'built_in',
	      begin: '\\.\\.?\\s*',
	      relevance: 0,
	      contains: [LASSO_DATAMEMBER]
	    },
	    {
	      className: 'class',
	      beginKeywords: 'define',
	      returnEnd: true, end: '\\(|=>',
	      contains: [
	        hljs.inherit(hljs.TITLE_MODE, {begin: hljs.UNDERSCORE_IDENT_RE + '(=(?!>))?'})
	      ]
	    }
	  ];
	  return {
	    aliases: ['ls', 'lassoscript'],
	    case_insensitive: true,
	    lexemes: LASSO_IDENT_RE + '|&[lg]t;',
	    keywords: LASSO_KEYWORDS,
	    contains: [
	      {
	        className: 'preprocessor',
	        begin: LASSO_CLOSE_RE,
	        relevance: 0,
	        starts: {
	          className: 'markup',
	          end: '\\[|' + LASSO_ANGLE_RE,
	          returnEnd: true,
	          relevance: 0,
	          contains: [HTML_COMMENT]
	        }
	      },
	      LASSO_NOPROCESS,
	      LASSO_START,
	      {
	        className: 'preprocessor',
	        begin: '\\[no_square_brackets',
	        starts: {
	          end: '\\[/no_square_brackets\\]', // not implemented in the language
	          lexemes: LASSO_IDENT_RE + '|&[lg]t;',
	          keywords: LASSO_KEYWORDS,
	          contains: [
	            {
	              className: 'preprocessor',
	              begin: LASSO_CLOSE_RE,
	              relevance: 0,
	              starts: {
	                className: 'markup',
	                end: '\\[noprocess\\]|' + LASSO_ANGLE_RE,
	                returnEnd: true,
	                contains: [HTML_COMMENT]
	              }
	            },
	            LASSO_NOPROCESS,
	            LASSO_START
	          ].concat(LASSO_CODE)
	        }
	      },
	      {
	        className: 'preprocessor',
	        begin: '\\[',
	        relevance: 0
	      },
	      {
	        className: 'shebang',
	        begin: '^#!.+lasso9\\b',
	        relevance: 10
	      }
	    ].concat(LASSO_CODE)
	  };
	};

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE        = '[\\w-]+'; // yes, Less identifiers may begin with a digit
	  var INTERP_IDENT_RE = '(' + IDENT_RE + '|@{' + IDENT_RE + '})';

	  /* Generic Modes */

	  var RULES = [], VALUE = []; // forward def. for recursive modes

	  var STRING_MODE = function(c) { return {
	    // Less strings are not multiline (also include '~' for more consistent coloring of "escaped" strings)
	    className: 'string', begin: '~?' + c + '.*?' + c
	  };};

	  var IDENT_MODE = function(name, begin, relevance) { return {
	    className: name, begin: begin, relevance: relevance
	  };};

	  var FUNCT_MODE = function(name, ident, obj) {
	    return hljs.inherit({
	        className: name, begin: ident + '\\(', end: '\\(',
	        returnBegin: true, excludeEnd: true, relevance: 0
	    }, obj);
	  };

	  var PARENS_MODE = {
	    // used only to properly balance nested parens inside mixin call, def. arg list
	    begin: '\\(', end: '\\)', contains: VALUE, relevance: 0
	  };

	  // generic Less highlighter (used almost everywhere except selectors):
	  VALUE.push(
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    STRING_MODE("'"),
	    STRING_MODE('"'),
	    hljs.CSS_NUMBER_MODE, // fixme: it does not include dot for numbers like .5em :(
	    IDENT_MODE('hexcolor', '#[0-9A-Fa-f]+\\b'),
	    FUNCT_MODE('function', '(url|data-uri)', {
	      starts: {className: 'string', end: '[\\)\\n]', excludeEnd: true}
	    }),
	    FUNCT_MODE('function', IDENT_RE),
	    PARENS_MODE,
	    IDENT_MODE('variable', '@@?' + IDENT_RE, 10),
	    IDENT_MODE('variable', '@{'  + IDENT_RE + '}'),
	    IDENT_MODE('built_in', '~?`[^`]*?`'), // inline javascript (or whatever host language) *multiline* string
	    { // @media features (it’s here to not duplicate things in AT_RULE_MODE with extra PARENS_MODE overriding):
	      className: 'attribute', begin: IDENT_RE + '\\s*:', end: ':', returnBegin: true, excludeEnd: true
	    }
	  );

	  var VALUE_WITH_RULESETS = VALUE.concat({
	    begin: '{', end: '}', contains: RULES
	  });

	  var MIXIN_GUARD_MODE = {
	    beginKeywords: 'when', endsWithParent: true,
	    contains: [{beginKeywords: 'and not'}].concat(VALUE) // using this form to override VALUE’s 'function' match
	  };

	  /* Rule-Level Modes */

	  var RULE_MODE = {
	    className: 'attribute',
	    begin: INTERP_IDENT_RE, end: ':', excludeEnd: true,
	    contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE],
	    illegal: /\S/,
	    starts: {end: '[;}]', returnEnd: true, contains: VALUE, illegal: '[<=$]'}
	  };

	  var AT_RULE_MODE = {
	    className: 'at_rule', // highlight only at-rule keyword
	    begin: '@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b',
	    starts: {end: '[;{}]', returnEnd: true, contains: VALUE, relevance: 0}
	  };

	  // variable definitions and calls
	  var VAR_RULE_MODE = {
	    className: 'variable',
	    variants: [
	      // using more strict pattern for higher relevance to increase chances of Less detection.
	      // this is *the only* Less specific statement used in most of the sources, so...
	      // (we’ll still often loose to the css-parser unless there's '//' comment,
	      // simply because 1 variable just can't beat 99 properties :)
	      {begin: '@' + IDENT_RE + '\\s*:', relevance: 15},
	      {begin: '@' + IDENT_RE}
	    ],
	    starts: {end: '[;}]', returnEnd: true, contains: VALUE_WITH_RULESETS}
	  };

	  var SELECTOR_MODE = {
	    // first parse unambiguous selectors (i.e. those not starting with tag)
	    // then fall into the scary lookahead-discriminator variant.
	    // this mode also handles mixin definitions and calls
	    variants: [{
	      begin: '[\\.#:&\\[]', end: '[;{}]'  // mixin calls end with ';'
	      }, {
	      begin: INTERP_IDENT_RE + '[^;]*{',
	      end: '{'
	    }],
	    returnBegin: true,
	    returnEnd:   true,
	    illegal: '[<=\'$"]',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      MIXIN_GUARD_MODE,
	      IDENT_MODE('keyword',  'all\\b'),
	      IDENT_MODE('variable', '@{'  + IDENT_RE + '}'),     // otherwise it’s identified as tag
	      IDENT_MODE('tag',       INTERP_IDENT_RE + '%?', 0), // '%' for more consistent coloring of @keyframes "tags"
	      IDENT_MODE('id',       '#'   + INTERP_IDENT_RE),
	      IDENT_MODE('class',    '\\.' + INTERP_IDENT_RE, 0),
	      IDENT_MODE('keyword',  '&', 0),
	      FUNCT_MODE('pseudo',   ':not'),
	      FUNCT_MODE('keyword',  ':extend'),
	      IDENT_MODE('pseudo',   '::?' + INTERP_IDENT_RE),
	      {className: 'attr_selector', begin: '\\[', end: '\\]'},
	      {begin: '\\(', end: '\\)', contains: VALUE_WITH_RULESETS}, // argument list of parametric mixins
	      {begin: '!important'} // eat !important after mixin call or it will be colored as tag
	    ]
	  };

	  RULES.push(
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    AT_RULE_MODE,
	    VAR_RULE_MODE,
	    SELECTOR_MODE,
	    RULE_MODE
	  );

	  return {
	    case_insensitive: true,
	    illegal: '[=>\'/<($"]',
	    contains: RULES
	  };
	};

/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*';
	  var MEC_RE = '\\|[^]*?\\|';
	  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|\\-)?\\d+)?';
	  var SHEBANG = {
	    className: 'shebang',
	    begin: '^#!', end: '$'
	  };
	  var LITERAL = {
	    className: 'literal',
	    begin: '\\b(t{1}|nil)\\b'
	  };
	  var NUMBER = {
	    className: 'number',
	    variants: [
	      {begin: LISP_SIMPLE_NUMBER_RE, relevance: 0},
	      {begin: '#(b|B)[0-1]+(/[0-1]+)?'},
	      {begin: '#(o|O)[0-7]+(/[0-7]+)?'},
	      {begin: '#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?'},
	      {begin: '#(c|C)\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)'}
	    ]
	  };
	  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null});
	  var COMMENT = hljs.COMMENT(
	    ';', '$',
	    {
	      relevance: 0
	    }
	  );
	  var VARIABLE = {
	    className: 'variable',
	    begin: '\\*', end: '\\*'
	  };
	  var KEYWORD = {
	    className: 'keyword',
	    begin: '[:&]' + LISP_IDENT_RE
	  };
	  var IDENT = {
	    begin: LISP_IDENT_RE,
	    relevance: 0
	  };
	  var MEC = {
	    begin: MEC_RE
	  };
	  var QUOTED_LIST = {
	    begin: '\\(', end: '\\)',
	    contains: ['self', LITERAL, STRING, NUMBER, IDENT]
	  };
	  var QUOTED = {
	    className: 'quoted',
	    contains: [NUMBER, STRING, VARIABLE, KEYWORD, QUOTED_LIST, IDENT],
	    variants: [
	      {
	        begin: '[\'`]\\(', end: '\\)'
	      },
	      {
	        begin: '\\(quote ', end: '\\)',
	        keywords: 'quote'
	      },
	      {
	        begin: '\'' + MEC_RE
	      }
	    ]
	  };
	  var QUOTED_ATOM = {
	    className: 'quoted',
	    variants: [
	      {begin: '\'' + LISP_IDENT_RE},
	      {begin: '#\'' + LISP_IDENT_RE + '(::' + LISP_IDENT_RE + ')*'}
	    ]
	  };
	  var LIST = {
	    className: 'list',
	    begin: '\\(\\s*', end: '\\)'
	  };
	  var BODY = {
	    endsWithParent: true,
	    relevance: 0
	  };
	  LIST.contains = [
	    {
	      className: 'keyword',
	      variants: [
	        {begin: LISP_IDENT_RE},
	        {begin: MEC_RE}
	      ]
	    },
	    BODY
	  ];
	  BODY.contains = [QUOTED, QUOTED_ATOM, LIST, LITERAL, NUMBER, STRING, COMMENT, VARIABLE, KEYWORD, MEC, IDENT];

	  return {
	    illegal: /\S/,
	    contains: [
	      NUMBER,
	      SHEBANG,
	      LITERAL,
	      STRING,
	      COMMENT,
	      QUOTED,
	      QUOTED_ATOM,
	      LIST,
	      IDENT
	    ]
	  };
	};

/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VARIABLE = {
	    className: 'variable', begin: '\\b[gtps][A-Z]+[A-Za-z0-9_\\-]*\\b|\\$_[A-Z]+',
	    relevance: 0
	  };
	  var COMMENT_MODES = [
	    hljs.C_BLOCK_COMMENT_MODE,
	    hljs.HASH_COMMENT_MODE,
	    hljs.COMMENT('--', '$'),
	    hljs.COMMENT('[^:]//', '$')
	  ];
	  var TITLE1 = hljs.inherit(hljs.TITLE_MODE, {
	    variants: [
	      {begin: '\\b_*rig[A-Z]+[A-Za-z0-9_\\-]*'},
	      {begin: '\\b_[a-z0-9\\-]+'}
	    ]
	  });
	  var TITLE2 = hljs.inherit(hljs.TITLE_MODE, {begin: '\\b([A-Za-z0-9_\\-]+)\\b'});
	  return {
	    case_insensitive: false,
	    keywords: {
	      keyword:
	        '$_COOKIE $_FILES $_GET $_GET_BINARY $_GET_RAW $_POST $_POST_BINARY $_POST_RAW $_SESSION $_SERVER ' +
	        'codepoint codepoints segment segments codeunit codeunits sentence sentences trueWord trueWords paragraph ' +
	        'after byte bytes english the until http forever descending using line real8 with seventh ' +
	        'for stdout finally element word words fourth before black ninth sixth characters chars stderr ' +
	        'uInt1 uInt1s uInt2 uInt2s stdin string lines relative rel any fifth items from middle mid ' +
	        'at else of catch then third it file milliseconds seconds second secs sec int1 int1s int4 ' +
	        'int4s internet int2 int2s normal text item last long detailed effective uInt4 uInt4s repeat ' +
	        'end repeat URL in try into switch to words https token binfile each tenth as ticks tick ' +
	        'system real4 by dateItems without char character ascending eighth whole dateTime numeric short ' +
	        'first ftp integer abbreviated abbr abbrev private case while if',
	      constant:
	        'SIX TEN FORMFEED NINE ZERO NONE SPACE FOUR FALSE COLON CRLF PI COMMA ENDOFFILE EOF EIGHT FIVE ' +
	        'QUOTE EMPTY ONE TRUE RETURN CR LINEFEED RIGHT BACKSLASH NULL SEVEN TAB THREE TWO ' +
	        'six ten formfeed nine zero none space four false colon crlf pi comma endoffile eof eight five ' +
	        'quote empty one true return cr linefeed right backslash null seven tab three two ' +
	        'RIVERSION RISTATE FILE_READ_MODE FILE_WRITE_MODE FILE_WRITE_MODE DIR_WRITE_MODE FILE_READ_UMASK ' +
	        'FILE_WRITE_UMASK DIR_READ_UMASK DIR_WRITE_UMASK',
	      operator:
	        'div mod wrap and or bitAnd bitNot bitOr bitXor among not in a an within ' +
	        'contains ends with begins the keys of keys',
	      built_in:
	        'put abs acos aliasReference annuity arrayDecode arrayEncode asin atan atan2 average avg avgDev base64Decode ' +
	        'base64Encode baseConvert binaryDecode binaryEncode byteOffset byteToNum cachedURL cachedURLs charToNum ' +
	        'cipherNames codepointOffset codepointProperty codepointToNum codeunitOffset commandNames compound compress ' +
	        'constantNames cos date dateFormat decompress directories ' +
	        'diskSpace DNSServers exp exp1 exp2 exp10 extents files flushEvents folders format functionNames geometricMean global ' +
	        'globals hasMemory harmonicMean hostAddress hostAddressToName hostName hostNameToAddress isNumber ISOToMac itemOffset ' +
	        'keys len length libURLErrorData libUrlFormData libURLftpCommand libURLLastHTTPHeaders libURLLastRHHeaders ' +
	        'libUrlMultipartFormAddPart libUrlMultipartFormData libURLVersion lineOffset ln ln1 localNames log log2 log10 ' +
	        'longFilePath lower macToISO matchChunk matchText matrixMultiply max md5Digest median merge millisec ' +
	        'millisecs millisecond milliseconds min monthNames nativeCharToNum normalizeText num number numToByte numToChar ' +
	        'numToCodepoint numToNativeChar offset open openfiles openProcesses openProcessIDs openSockets ' +
	        'paragraphOffset paramCount param params peerAddress pendingMessages platform popStdDev populationStandardDeviation ' +
	        'populationVariance popVariance processID random randomBytes replaceText result revCreateXMLTree revCreateXMLTreeFromFile ' +
	        'revCurrentRecord revCurrentRecordIsFirst revCurrentRecordIsLast revDatabaseColumnCount revDatabaseColumnIsNull ' +
	        'revDatabaseColumnLengths revDatabaseColumnNames revDatabaseColumnNamed revDatabaseColumnNumbered ' +
	        'revDatabaseColumnTypes revDatabaseConnectResult revDatabaseCursors revDatabaseID revDatabaseTableNames ' +
	        'revDatabaseType revDataFromQuery revdb_closeCursor revdb_columnbynumber revdb_columncount revdb_columnisnull ' +
	        'revdb_columnlengths revdb_columnnames revdb_columntypes revdb_commit revdb_connect revdb_connections ' +
	        'revdb_connectionerr revdb_currentrecord revdb_cursorconnection revdb_cursorerr revdb_cursors revdb_dbtype ' +
	        'revdb_disconnect revdb_execute revdb_iseof revdb_isbof revdb_movefirst revdb_movelast revdb_movenext ' +
	        'revdb_moveprev revdb_query revdb_querylist revdb_recordcount revdb_rollback revdb_tablenames ' +
	        'revGetDatabaseDriverPath revNumberOfRecords revOpenDatabase revOpenDatabases revQueryDatabase ' +
	        'revQueryDatabaseBlob revQueryResult revQueryIsAtStart revQueryIsAtEnd revUnixFromMacPath revXMLAttribute ' +
	        'revXMLAttributes revXMLAttributeValues revXMLChildContents revXMLChildNames revXMLCreateTreeFromFileWithNamespaces ' +
	        'revXMLCreateTreeWithNamespaces revXMLDataFromXPathQuery revXMLEvaluateXPath revXMLFirstChild revXMLMatchingNode ' +
	        'revXMLNextSibling revXMLNodeContents revXMLNumberOfChildren revXMLParent revXMLPreviousSibling ' +
	        'revXMLRootNode revXMLRPC_CreateRequest revXMLRPC_Documents revXMLRPC_Error ' +
	        'revXMLRPC_GetHost revXMLRPC_GetMethod revXMLRPC_GetParam revXMLText revXMLRPC_Execute ' +
	        'revXMLRPC_GetParamCount revXMLRPC_GetParamNode revXMLRPC_GetParamType revXMLRPC_GetPath revXMLRPC_GetPort ' +
	        'revXMLRPC_GetProtocol revXMLRPC_GetRequest revXMLRPC_GetResponse revXMLRPC_GetSocket revXMLTree ' +
	        'revXMLTrees revXMLValidateDTD revZipDescribeItem revZipEnumerateItems revZipOpenArchives round sampVariance ' +
	        'sec secs seconds sentenceOffset sha1Digest shell shortFilePath sin specialFolderPath sqrt standardDeviation statRound ' +
	        'stdDev sum sysError systemVersion tan tempName textDecode textEncode tick ticks time to tokenOffset toLower toUpper ' +
	        'transpose truewordOffset trunc uniDecode uniEncode upper URLDecode URLEncode URLStatus uuid value variableNames ' +
	        'variance version waitDepth weekdayNames wordOffset xsltApplyStylesheet xsltApplyStylesheetFromFile xsltLoadStylesheet ' +
	        'xsltLoadStylesheetFromFile add breakpoint cancel clear local variable file word line folder directory URL close socket process ' +
	        'combine constant convert create new alias folder directory decrypt delete variable word line folder ' +
	        'directory URL dispatch divide do encrypt filter get include intersect kill libURLDownloadToFile ' +
	        'libURLFollowHttpRedirects libURLftpUpload libURLftpUploadFile libURLresetAll libUrlSetAuthCallback ' +
	        'libURLSetCustomHTTPHeaders libUrlSetExpect100 libURLSetFTPListCommand libURLSetFTPMode libURLSetFTPStopTime ' +
	        'libURLSetStatusCallback load multiply socket prepare process post seek rel relative read from process rename ' +
	        'replace require resetAll resolve revAddXMLNode revAppendXML revCloseCursor revCloseDatabase revCommitDatabase ' +
	        'revCopyFile revCopyFolder revCopyXMLNode revDeleteFolder revDeleteXMLNode revDeleteAllXMLTrees ' +
	        'revDeleteXMLTree revExecuteSQL revGoURL revInsertXMLNode revMoveFolder revMoveToFirstRecord revMoveToLastRecord ' +
	        'revMoveToNextRecord revMoveToPreviousRecord revMoveToRecord revMoveXMLNode revPutIntoXMLNode revRollBackDatabase ' +
	        'revSetDatabaseDriverPath revSetXMLAttribute revXMLRPC_AddParam revXMLRPC_DeleteAllDocuments revXMLAddDTD ' +
	        'revXMLRPC_Free revXMLRPC_FreeAll revXMLRPC_DeleteDocument revXMLRPC_DeleteParam revXMLRPC_SetHost ' +
	        'revXMLRPC_SetMethod revXMLRPC_SetPort revXMLRPC_SetProtocol revXMLRPC_SetSocket revZipAddItemWithData ' +
	        'revZipAddItemWithFile revZipAddUncompressedItemWithData revZipAddUncompressedItemWithFile revZipCancel ' +
	        'revZipCloseArchive revZipDeleteItem revZipExtractItemToFile revZipExtractItemToVariable revZipSetProgressCallback ' +
	        'revZipRenameItem revZipReplaceItemWithData revZipReplaceItemWithFile revZipOpenArchive send set sort split start stop ' +
	        'subtract union unload wait write'
	    },
	    contains: [
	      VARIABLE,
	      {
	        className: 'keyword',
	        begin: '\\bend\\sif\\b'
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: '$',
	        contains: [
	          VARIABLE,
	          TITLE2,
	          hljs.APOS_STRING_MODE,
	          hljs.QUOTE_STRING_MODE,
	          hljs.BINARY_NUMBER_MODE,
	          hljs.C_NUMBER_MODE,
	          TITLE1
	        ]
	      },
	      {
	        className: 'function',
	        begin: '\\bend\\s+', end: '$',
	        keywords: 'end',
	        contains: [
	          TITLE2,
	          TITLE1
	        ]
	      },
	      {
	        className: 'command',
	        beginKeywords: 'command on', end: '$',
	        contains: [
	          VARIABLE,
	          TITLE2,
	          hljs.APOS_STRING_MODE,
	          hljs.QUOTE_STRING_MODE,
	          hljs.BINARY_NUMBER_MODE,
	          hljs.C_NUMBER_MODE,
	          TITLE1
	        ]
	      },
	      {
	        className: 'preprocessor',
	        variants: [
	          {
	            begin: '<\\?(rev|lc|livecode)',
	            relevance: 10
	          },
	          { begin: '<\\?' },
	          { begin: '\\?>' }
	        ]
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.BINARY_NUMBER_MODE,
	      hljs.C_NUMBER_MODE,
	      TITLE1
	    ].concat(COMMENT_MODES),
	    illegal: ';$|^\\[|^='
	  };
	};

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS = {
	    keyword:
	      // JS keywords
	      'in if for while finally new do return else break catch instanceof throw try this ' +
	      'switch continue typeof delete debugger case default function var with ' +
	      // LiveScript keywords
	      'then unless until loop of by when and or is isnt not it that otherwise from to til fallthrough super ' +
	      'case default function var void const let enum export import native ' +
	      '__hasProp __extends __slice __bind __indexOf',
	    literal:
	      // JS literals
	      'true false null undefined ' +
	      // LiveScript literals
	      'yes no on off it that void',
	    built_in:
	      'npm require console print module global window document'
	  };
	  var JS_IDENT_RE = '[A-Za-z$_](?:\-[0-9A-Za-z$_]|[0-9A-Za-z$_])*';
	  var TITLE = hljs.inherit(hljs.TITLE_MODE, {begin: JS_IDENT_RE});
	  var SUBST = {
	    className: 'subst',
	    begin: /#\{/, end: /}/,
	    keywords: KEYWORDS
	  };
	  var SUBST_SIMPLE = {
	    className: 'subst',
	    begin: /#[A-Za-z$_]/, end: /(?:\-[0-9A-Za-z$_]|[0-9A-Za-z$_])*/,
	    keywords: KEYWORDS
	  };
	  var EXPRESSIONS = [
	    hljs.BINARY_NUMBER_MODE,
	    {
	      className: 'number',
	      begin: '(\\b0[xX][a-fA-F0-9_]+)|(\\b\\d(\\d|_\\d)*(\\.(\\d(\\d|_\\d)*)?)?(_*[eE]([-+]\\d(_\\d|\\d)*)?)?[_a-z]*)',
	      relevance: 0,
	      starts: {end: '(\\s*/)?', relevance: 0} // a number tries to eat the following slash to prevent treating it as a regexp
	    },
	    {
	      className: 'string',
	      variants: [
	        {
	          begin: /'''/, end: /'''/,
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: /'/, end: /'/,
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: /"""/, end: /"""/,
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST, SUBST_SIMPLE]
	        },
	        {
	          begin: /"/, end: /"/,
	          contains: [hljs.BACKSLASH_ESCAPE, SUBST, SUBST_SIMPLE]
	        },
	        {
	          begin: /\\/, end: /(\s|$)/,
	          excludeEnd: true
	        }
	      ]
	    },
	    {
	      className: 'pi',
	      variants: [
	        {
	          begin: '//', end: '//[gim]*',
	          contains: [SUBST, hljs.HASH_COMMENT_MODE]
	        },
	        {
	          // regex can't start with space to parse x / 2 / 3 as two divisions
	          // regex can't start with *, and it supports an "illegal" in the main mode
	          begin: /\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/
	        }
	      ]
	    },
	    {
	      className: 'property',
	      begin: '@' + JS_IDENT_RE
	    },
	    {
	      begin: '``', end: '``',
	      excludeBegin: true, excludeEnd: true,
	      subLanguage: 'javascript'
	    }
	  ];
	  SUBST.contains = EXPRESSIONS;

	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', returnBegin: true,
	    /* We need another contained nameless mode to not have every nested
	    pair of parens to be called "params" */
	    contains: [
	      {
	        begin: /\(/, end: /\)/,
	        keywords: KEYWORDS,
	        contains: ['self'].concat(EXPRESSIONS)
	      }
	    ]
	  };

	  return {
	    aliases: ['ls'],
	    keywords: KEYWORDS,
	    illegal: /\/\*/,
	    contains: EXPRESSIONS.concat([
	      hljs.COMMENT('\\/\\*', '\\*\\/'),
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'function',
	        contains: [TITLE, PARAMS],
	        returnBegin: true,
	        variants: [
	          {
	            begin: '(' + JS_IDENT_RE + '\\s*(?:=|:=)\\s*)?(\\(.*\\))?\\s*\\B\\->\\*?', end: '\\->\\*?'
	          },
	          {
	            begin: '(' + JS_IDENT_RE + '\\s*(?:=|:=)\\s*)?!?(\\(.*\\))?\\s*\\B[-~]{1,2}>\\*?', end: '[-~]{1,2}>\\*?'
	          },
	          {
	            begin: '(' + JS_IDENT_RE + '\\s*(?:=|:=)\\s*)?(\\(.*\\))?\\s*\\B!?[-~]{1,2}>\\*?', end: '!?[-~]{1,2}>\\*?'
	          }
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class',
	        end: '$',
	        illegal: /[:="\[\]]/,
	        contains: [
	          {
	            beginKeywords: 'extends',
	            endsWithParent: true,
	            illegal: /[:="\[\]]/,
	            contains: [TITLE]
	          },
	          TITLE
	        ]
	      },
	      {
	        className: 'attribute',
	        begin: JS_IDENT_RE + ':', end: ':',
	        returnBegin: true, returnEnd: true,
	        relevance: 0
	      }
	    ])
	  };
	};

/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var OPENING_LONG_BRACKET = '\\[=*\\[';
	  var CLOSING_LONG_BRACKET = '\\]=*\\]';
	  var LONG_BRACKETS = {
	    begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
	    contains: ['self']
	  };
	  var COMMENTS = [
	    hljs.COMMENT('--(?!' + OPENING_LONG_BRACKET + ')', '$'),
	    hljs.COMMENT(
	      '--' + OPENING_LONG_BRACKET,
	      CLOSING_LONG_BRACKET,
	      {
	        contains: [LONG_BRACKETS],
	        relevance: 10
	      }
	    )
	  ];
	  return {
	    lexemes: hljs.UNDERSCORE_IDENT_RE,
	    keywords: {
	      keyword:
	        'and break do else elseif end false for if in local nil not or repeat return then ' +
	        'true until while',
	      built_in:
	        '_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load ' +
	        'loadfile loadstring module next pairs pcall print rawequal rawget rawset require ' +
	        'select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug ' +
	        'io math os package string table'
	    },
	    contains: COMMENTS.concat([
	      {
	        className: 'function',
	        beginKeywords: 'function', end: '\\)',
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*'}),
	          {
	            className: 'params',
	            begin: '\\(', endsWithParent: true,
	            contains: COMMENTS
	          }
	        ].concat(COMMENTS)
	      },
	      hljs.C_NUMBER_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
	        contains: [LONG_BRACKETS],
	        relevance: 5
	      }
	    ])
	  };
	};

/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VARIABLE = {
	    className: 'variable',
	    begin: /\$\(/, end: /\)/,
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };
	  return {
	    aliases: ['mk', 'mak'],
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        begin: /^\w+\s*\W*=/, returnBegin: true,
	        relevance: 0,
	        starts: {
	          className: 'constant',
	          end: /\s*\W*=/, excludeEnd: true,
	          starts: {
	            end: /$/,
	            relevance: 0,
	            contains: [
	              VARIABLE
	            ]
	          }
	        }
	      },
	      {
	        className: 'title',
	        begin: /^[\w]+:\s*$/
	      },
	      {
	        className: 'phony',
	        begin: /^\.PHONY:/, end: /$/,
	        keywords: '.PHONY', lexemes: /[\.\w]+/
	      },
	      {
	        begin: /^\t+/, end: /$/,
	        relevance: 0,
	        contains: [
	          hljs.QUOTE_STRING_MODE,
	          VARIABLE
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['mma'],
	    lexemes: '(\\$|\\b)' + hljs.IDENT_RE + '\\b',
	    keywords: 'AbelianGroup Abort AbortKernels AbortProtect Above Abs Absolute AbsoluteCorrelation AbsoluteCorrelationFunction AbsoluteCurrentValue AbsoluteDashing AbsoluteFileName AbsoluteOptions AbsolutePointSize AbsoluteThickness AbsoluteTime AbsoluteTiming AccountingForm Accumulate Accuracy AccuracyGoal ActionDelay ActionMenu ActionMenuBox ActionMenuBoxOptions Active ActiveItem ActiveStyle AcyclicGraphQ AddOnHelpPath AddTo AdjacencyGraph AdjacencyList AdjacencyMatrix AdjustmentBox AdjustmentBoxOptions AdjustTimeSeriesForecast AffineTransform After AiryAi AiryAiPrime AiryAiZero AiryBi AiryBiPrime AiryBiZero AlgebraicIntegerQ AlgebraicNumber AlgebraicNumberDenominator AlgebraicNumberNorm AlgebraicNumberPolynomial AlgebraicNumberTrace AlgebraicRules AlgebraicRulesData Algebraics AlgebraicUnitQ Alignment AlignmentMarker AlignmentPoint All AllowedDimensions AllowGroupClose AllowInlineCells AllowKernelInitialization AllowReverseGroupClose AllowScriptLevelChange AlphaChannel AlternatingGroup AlternativeHypothesis Alternatives AmbientLight Analytic AnchoredSearch And AndersonDarlingTest AngerJ AngleBracket AngularGauge Animate AnimationCycleOffset AnimationCycleRepetitions AnimationDirection AnimationDisplayTime AnimationRate AnimationRepetitions AnimationRunning Animator AnimatorBox AnimatorBoxOptions AnimatorElements Annotation Annuity AnnuityDue Antialiasing Antisymmetric Apart ApartSquareFree Appearance AppearanceElements AppellF1 Append AppendTo Apply ArcCos ArcCosh ArcCot ArcCoth ArcCsc ArcCsch ArcSec ArcSech ArcSin ArcSinDistribution ArcSinh ArcTan ArcTanh Arg ArgMax ArgMin ArgumentCountQ ARIMAProcess ArithmeticGeometricMean ARMAProcess ARProcess Array ArrayComponents ArrayDepth ArrayFlatten ArrayPad ArrayPlot ArrayQ ArrayReshape ArrayRules Arrays Arrow Arrow3DBox ArrowBox Arrowheads AspectRatio AspectRatioFixed Assert Assuming Assumptions AstronomicalData Asynchronous AsynchronousTaskObject AsynchronousTasks AtomQ Attributes AugmentedSymmetricPolynomial AutoAction AutoDelete AutoEvaluateEvents AutoGeneratedPackage AutoIndent AutoIndentSpacings AutoItalicWords AutoloadPath AutoMatch Automatic AutomaticImageSize AutoMultiplicationSymbol AutoNumberFormatting AutoOpenNotebooks AutoOpenPalettes AutorunSequencing AutoScaling AutoScroll AutoSpacing AutoStyleOptions AutoStyleWords Axes AxesEdge AxesLabel AxesOrigin AxesStyle Axis ' +
	      'BabyMonsterGroupB Back Background BackgroundTasksSettings Backslash Backsubstitution Backward Band BandpassFilter BandstopFilter BarabasiAlbertGraphDistribution BarChart BarChart3D BarLegend BarlowProschanImportance BarnesG BarOrigin BarSpacing BartlettHannWindow BartlettWindow BaseForm Baseline BaselinePosition BaseStyle BatesDistribution BattleLemarieWavelet Because BeckmannDistribution Beep Before Begin BeginDialogPacket BeginFrontEndInteractionPacket BeginPackage BellB BellY Below BenfordDistribution BeniniDistribution BenktanderGibratDistribution BenktanderWeibullDistribution BernoulliB BernoulliDistribution BernoulliGraphDistribution BernoulliProcess BernsteinBasis BesselFilterModel BesselI BesselJ BesselJZero BesselK BesselY BesselYZero Beta BetaBinomialDistribution BetaDistribution BetaNegativeBinomialDistribution BetaPrimeDistribution BetaRegularized BetweennessCentrality BezierCurve BezierCurve3DBox BezierCurve3DBoxOptions BezierCurveBox BezierCurveBoxOptions BezierFunction BilateralFilter Binarize BinaryFormat BinaryImageQ BinaryRead BinaryReadList BinaryWrite BinCounts BinLists Binomial BinomialDistribution BinomialProcess BinormalDistribution BiorthogonalSplineWavelet BipartiteGraphQ BirnbaumImportance BirnbaumSaundersDistribution BitAnd BitClear BitGet BitLength BitNot BitOr BitSet BitShiftLeft BitShiftRight BitXor Black BlackmanHarrisWindow BlackmanNuttallWindow BlackmanWindow Blank BlankForm BlankNullSequence BlankSequence Blend Block BlockRandom BlomqvistBeta BlomqvistBetaTest Blue Blur BodePlot BohmanWindow Bold Bookmarks Boole BooleanConsecutiveFunction BooleanConvert BooleanCountingFunction BooleanFunction BooleanGraph BooleanMaxterms BooleanMinimize BooleanMinterms Booleans BooleanTable BooleanVariables BorderDimensions BorelTannerDistribution Bottom BottomHatTransform BoundaryStyle Bounds Box BoxBaselineShift BoxData BoxDimensions Boxed Boxes BoxForm BoxFormFormatTypes BoxFrame BoxID BoxMargins BoxMatrix BoxRatios BoxRotation BoxRotationPoint BoxStyle BoxWhiskerChart Bra BracketingBar BraKet BrayCurtisDistance BreadthFirstScan Break Brown BrownForsytheTest BrownianBridgeProcess BrowserCategory BSplineBasis BSplineCurve BSplineCurve3DBox BSplineCurveBox BSplineCurveBoxOptions BSplineFunction BSplineSurface BSplineSurface3DBox BubbleChart BubbleChart3D BubbleScale BubbleSizes BulletGauge BusinessDayQ ButterflyGraph ButterworthFilterModel Button ButtonBar ButtonBox ButtonBoxOptions ButtonCell ButtonContents ButtonData ButtonEvaluator ButtonExpandable ButtonFrame ButtonFunction ButtonMargins ButtonMinHeight ButtonNote ButtonNotebook ButtonSource ButtonStyle ButtonStyleMenuListing Byte ByteCount ByteOrdering ' +
	      'C CachedValue CacheGraphics CalendarData CalendarType CallPacket CanberraDistance Cancel CancelButton CandlestickChart Cap CapForm CapitalDifferentialD CardinalBSplineBasis CarmichaelLambda Cases Cashflow Casoratian Catalan CatalanNumber Catch CauchyDistribution CauchyWindow CayleyGraph CDF CDFDeploy CDFInformation CDFWavelet Ceiling Cell CellAutoOverwrite CellBaseline CellBoundingBox CellBracketOptions CellChangeTimes CellContents CellContext CellDingbat CellDynamicExpression CellEditDuplicate CellElementsBoundingBox CellElementSpacings CellEpilog CellEvaluationDuplicate CellEvaluationFunction CellEventActions CellFrame CellFrameColor CellFrameLabelMargins CellFrameLabels CellFrameMargins CellGroup CellGroupData CellGrouping CellGroupingRules CellHorizontalScrolling CellID CellLabel CellLabelAutoDelete CellLabelMargins CellLabelPositioning CellMargins CellObject CellOpen CellPrint CellProlog Cells CellSize CellStyle CellTags CellularAutomaton CensoredDistribution Censoring Center CenterDot CentralMoment CentralMomentGeneratingFunction CForm ChampernowneNumber ChanVeseBinarize Character CharacterEncoding CharacterEncodingsPath CharacteristicFunction CharacteristicPolynomial CharacterRange Characters ChartBaseStyle ChartElementData ChartElementDataFunction ChartElementFunction ChartElements ChartLabels ChartLayout ChartLegends ChartStyle Chebyshev1FilterModel Chebyshev2FilterModel ChebyshevDistance ChebyshevT ChebyshevU Check CheckAbort CheckAll Checkbox CheckboxBar CheckboxBox CheckboxBoxOptions ChemicalData ChessboardDistance ChiDistribution ChineseRemainder ChiSquareDistribution ChoiceButtons ChoiceDialog CholeskyDecomposition Chop Circle CircleBox CircleDot CircleMinus CirclePlus CircleTimes CirculantGraph CityData Clear ClearAll ClearAttributes ClearSystemCache ClebschGordan ClickPane Clip ClipboardNotebook ClipFill ClippingStyle ClipPlanes ClipRange Clock ClockGauge ClockwiseContourIntegral Close Closed CloseKernels ClosenessCentrality Closing ClosingAutoSave ClosingEvent ClusteringComponents CMYKColor Coarse Coefficient CoefficientArrays CoefficientDomain CoefficientList CoefficientRules CoifletWavelet Collect Colon ColonForm ColorCombine ColorConvert ColorData ColorDataFunction ColorFunction ColorFunctionScaling Colorize ColorNegate ColorOutput ColorProfileData ColorQuantize ColorReplace ColorRules ColorSelectorSettings ColorSeparate ColorSetter ColorSetterBox ColorSetterBoxOptions ColorSlider ColorSpace Column ColumnAlignments ColumnBackgrounds ColumnForm ColumnLines ColumnsEqual ColumnSpacings ColumnWidths CommonDefaultFormatTypes Commonest CommonestFilter CommonUnits CommunityBoundaryStyle CommunityGraphPlot CommunityLabels CommunityRegionStyle CompatibleUnitQ CompilationOptions CompilationTarget Compile Compiled CompiledFunction Complement CompleteGraph CompleteGraphQ CompleteKaryTree CompletionsListPacket Complex Complexes ComplexExpand ComplexInfinity ComplexityFunction ComponentMeasurements ' +
	      'ComponentwiseContextMenu Compose ComposeList ComposeSeries Composition CompoundExpression CompoundPoissonDistribution CompoundPoissonProcess CompoundRenewalProcess Compress CompressedData Condition ConditionalExpression Conditioned Cone ConeBox ConfidenceLevel ConfidenceRange ConfidenceTransform ConfigurationPath Congruent Conjugate ConjugateTranspose Conjunction Connect ConnectedComponents ConnectedGraphQ ConnesWindow ConoverTest ConsoleMessage ConsoleMessagePacket ConsolePrint Constant ConstantArray Constants ConstrainedMax ConstrainedMin ContentPadding ContentsBoundingBox ContentSelectable ContentSize Context ContextMenu Contexts ContextToFilename ContextToFileName Continuation Continue ContinuedFraction ContinuedFractionK ContinuousAction ContinuousMarkovProcess ContinuousTimeModelQ ContinuousWaveletData ContinuousWaveletTransform ContourDetect ContourGraphics ContourIntegral ContourLabels ContourLines ContourPlot ContourPlot3D Contours ContourShading ContourSmoothing ContourStyle ContraharmonicMean Control ControlActive ControlAlignment ControllabilityGramian ControllabilityMatrix ControllableDecomposition ControllableModelQ ControllerDuration ControllerInformation ControllerInformationData ControllerLinking ControllerManipulate ControllerMethod ControllerPath ControllerState ControlPlacement ControlsRendering ControlType Convergents ConversionOptions ConversionRules ConvertToBitmapPacket ConvertToPostScript ConvertToPostScriptPacket Convolve ConwayGroupCo1 ConwayGroupCo2 ConwayGroupCo3 CoordinateChartData CoordinatesToolOptions CoordinateTransform CoordinateTransformData CoprimeQ Coproduct CopulaDistribution Copyable CopyDirectory CopyFile CopyTag CopyToClipboard CornerFilter CornerNeighbors Correlation CorrelationDistance CorrelationFunction CorrelationTest Cos Cosh CoshIntegral CosineDistance CosineWindow CosIntegral Cot Coth Count CounterAssignments CounterBox CounterBoxOptions CounterClockwiseContourIntegral CounterEvaluator CounterFunction CounterIncrements CounterStyle CounterStyleMenuListing CountRoots CountryData Covariance CovarianceEstimatorFunction CovarianceFunction CoxianDistribution CoxIngersollRossProcess CoxModel CoxModelFit CramerVonMisesTest CreateArchive CreateDialog CreateDirectory CreateDocument CreateIntermediateDirectories CreatePalette CreatePalettePacket CreateScheduledTask CreateTemporary CreateWindow CriticalityFailureImportance CriticalitySuccessImportance CriticalSection Cross CrossingDetect CrossMatrix Csc Csch CubeRoot Cubics Cuboid CuboidBox Cumulant CumulantGeneratingFunction Cup CupCap Curl CurlyDoubleQuote CurlyQuote CurrentImage CurrentlySpeakingPacket CurrentValue CurvatureFlowFilter CurveClosed Cyan CycleGraph CycleIndexPolynomial Cycles CyclicGroup Cyclotomic Cylinder CylinderBox CylindricalDecomposition ' +
	      'D DagumDistribution DamerauLevenshteinDistance DampingFactor Darker Dashed Dashing DataCompression DataDistribution DataRange DataReversed Date DateDelimiters DateDifference DateFunction DateList DateListLogPlot DateListPlot DatePattern DatePlus DateRange DateString DateTicksFormat DaubechiesWavelet DavisDistribution DawsonF DayCount DayCountConvention DayMatchQ DayName DayPlus DayRange DayRound DeBruijnGraph Debug DebugTag Decimal DeclareKnownSymbols DeclarePackage Decompose Decrement DedekindEta Default DefaultAxesStyle DefaultBaseStyle DefaultBoxStyle DefaultButton DefaultColor DefaultControlPlacement DefaultDuplicateCellStyle DefaultDuration DefaultElement DefaultFaceGridsStyle DefaultFieldHintStyle DefaultFont DefaultFontProperties DefaultFormatType DefaultFormatTypeForStyle DefaultFrameStyle DefaultFrameTicksStyle DefaultGridLinesStyle DefaultInlineFormatType DefaultInputFormatType DefaultLabelStyle DefaultMenuStyle DefaultNaturalLanguage DefaultNewCellStyle DefaultNewInlineCellStyle DefaultNotebook DefaultOptions DefaultOutputFormatType DefaultStyle DefaultStyleDefinitions DefaultTextFormatType DefaultTextInlineFormatType DefaultTicksStyle DefaultTooltipStyle DefaultValues Defer DefineExternal DefineInputStreamMethod DefineOutputStreamMethod Definition Degree DegreeCentrality DegreeGraphDistribution DegreeLexicographic DegreeReverseLexicographic Deinitialization Del Deletable Delete DeleteBorderComponents DeleteCases DeleteContents DeleteDirectory DeleteDuplicates DeleteFile DeleteSmallComponents DeleteWithContents DeletionWarning Delimiter DelimiterFlashTime DelimiterMatching Delimiters Denominator DensityGraphics DensityHistogram DensityPlot DependentVariables Deploy Deployed Depth DepthFirstScan Derivative DerivativeFilter DescriptorStateSpace DesignMatrix Det DGaussianWavelet DiacriticalPositioning Diagonal DiagonalMatrix Dialog DialogIndent DialogInput DialogLevel DialogNotebook DialogProlog DialogReturn DialogSymbols Diamond DiamondMatrix DiceDissimilarity DictionaryLookup DifferenceDelta DifferenceOrder DifferenceRoot DifferenceRootReduce Differences DifferentialD DifferentialRoot DifferentialRootReduce DifferentiatorFilter DigitBlock DigitBlockMinimum DigitCharacter DigitCount DigitQ DihedralGroup Dilation Dimensions DiracComb DiracDelta DirectedEdge DirectedEdges DirectedGraph DirectedGraphQ DirectedInfinity Direction Directive Directory DirectoryName DirectoryQ DirectoryStack DirichletCharacter DirichletConvolve DirichletDistribution DirichletL DirichletTransform DirichletWindow DisableConsolePrintPacket DiscreteChirpZTransform DiscreteConvolve DiscreteDelta DiscreteHadamardTransform DiscreteIndicator DiscreteLQEstimatorGains DiscreteLQRegulatorGains DiscreteLyapunovSolve DiscreteMarkovProcess DiscretePlot DiscretePlot3D DiscreteRatio DiscreteRiccatiSolve DiscreteShift DiscreteTimeModelQ DiscreteUniformDistribution DiscreteVariables DiscreteWaveletData DiscreteWaveletPacketTransform ' +
	      'DiscreteWaveletTransform Discriminant Disjunction Disk DiskBox DiskMatrix Dispatch DispersionEstimatorFunction Display DisplayAllSteps DisplayEndPacket DisplayFlushImagePacket DisplayForm DisplayFunction DisplayPacket DisplayRules DisplaySetSizePacket DisplayString DisplayTemporary DisplayWith DisplayWithRef DisplayWithVariable DistanceFunction DistanceTransform Distribute Distributed DistributedContexts DistributeDefinitions DistributionChart DistributionDomain DistributionFitTest DistributionParameterAssumptions DistributionParameterQ Dithering Div Divergence Divide DivideBy Dividers Divisible Divisors DivisorSigma DivisorSum DMSList DMSString Do DockedCells DocumentNotebook DominantColors DOSTextFormat Dot DotDashed DotEqual Dotted DoubleBracketingBar DoubleContourIntegral DoubleDownArrow DoubleLeftArrow DoubleLeftRightArrow DoubleLeftTee DoubleLongLeftArrow DoubleLongLeftRightArrow DoubleLongRightArrow DoubleRightArrow DoubleRightTee DoubleUpArrow DoubleUpDownArrow DoubleVerticalBar DoublyInfinite Down DownArrow DownArrowBar DownArrowUpArrow DownLeftRightVector DownLeftTeeVector DownLeftVector DownLeftVectorBar DownRightTeeVector DownRightVector DownRightVectorBar Downsample DownTee DownTeeArrow DownValues DragAndDrop DrawEdges DrawFrontFaces DrawHighlighted Drop DSolve Dt DualLinearProgramming DualSystemsModel DumpGet DumpSave DuplicateFreeQ Dynamic DynamicBox DynamicBoxOptions DynamicEvaluationTimeout DynamicLocation DynamicModule DynamicModuleBox DynamicModuleBoxOptions DynamicModuleParent DynamicModuleValues DynamicName DynamicNamespace DynamicReference DynamicSetting DynamicUpdating DynamicWrapper DynamicWrapperBox DynamicWrapperBoxOptions ' +
	      'E EccentricityCentrality EdgeAdd EdgeBetweennessCentrality EdgeCapacity EdgeCapForm EdgeColor EdgeConnectivity EdgeCost EdgeCount EdgeCoverQ EdgeDashing EdgeDelete EdgeDetect EdgeForm EdgeIndex EdgeJoinForm EdgeLabeling EdgeLabels EdgeLabelStyle EdgeList EdgeOpacity EdgeQ EdgeRenderingFunction EdgeRules EdgeShapeFunction EdgeStyle EdgeThickness EdgeWeight Editable EditButtonSettings EditCellTagsSettings EditDistance EffectiveInterest Eigensystem Eigenvalues EigenvectorCentrality Eigenvectors Element ElementData Eliminate EliminationOrder EllipticE EllipticExp EllipticExpPrime EllipticF EllipticFilterModel EllipticK EllipticLog EllipticNomeQ EllipticPi EllipticReducedHalfPeriods EllipticTheta EllipticThetaPrime EmitSound EmphasizeSyntaxErrors EmpiricalDistribution Empty EmptyGraphQ EnableConsolePrintPacket Enabled Encode End EndAdd EndDialogPacket EndFrontEndInteractionPacket EndOfFile EndOfLine EndOfString EndPackage EngineeringForm Enter EnterExpressionPacket EnterTextPacket Entropy EntropyFilter Environment Epilog Equal EqualColumns EqualRows EqualTilde EquatedTo Equilibrium EquirippleFilterKernel Equivalent Erf Erfc Erfi ErlangB ErlangC ErlangDistribution Erosion ErrorBox ErrorBoxOptions ErrorNorm ErrorPacket ErrorsDialogSettings EstimatedDistribution EstimatedProcess EstimatorGains EstimatorRegulator EuclideanDistance EulerE EulerGamma EulerianGraphQ EulerPhi Evaluatable Evaluate Evaluated EvaluatePacket EvaluationCell EvaluationCompletionAction EvaluationElements EvaluationMode EvaluationMonitor EvaluationNotebook EvaluationObject EvaluationOrder Evaluator EvaluatorNames EvenQ EventData EventEvaluator EventHandler EventHandlerTag EventLabels ExactBlackmanWindow ExactNumberQ ExactRootIsolation ExampleData Except ExcludedForms ExcludePods Exclusions ExclusionsStyle Exists Exit ExitDialog Exp Expand ExpandAll ExpandDenominator ExpandFileName ExpandNumerator Expectation ExpectationE ExpectedValue ExpGammaDistribution ExpIntegralE ExpIntegralEi Exponent ExponentFunction ExponentialDistribution ExponentialFamily ExponentialGeneratingFunction ExponentialMovingAverage ExponentialPowerDistribution ExponentPosition ExponentStep Export ExportAutoReplacements ExportPacket ExportString Expression ExpressionCell ExpressionPacket ExpToTrig ExtendedGCD Extension ExtentElementFunction ExtentMarkers ExtentSize ExternalCall ExternalDataCharacterEncoding Extract ExtractArchive ExtremeValueDistribution ' +
	      'FaceForm FaceGrids FaceGridsStyle Factor FactorComplete Factorial Factorial2 FactorialMoment FactorialMomentGeneratingFunction FactorialPower FactorInteger FactorList FactorSquareFree FactorSquareFreeList FactorTerms FactorTermsList Fail FailureDistribution False FARIMAProcess FEDisableConsolePrintPacket FeedbackSector FeedbackSectorStyle FeedbackType FEEnableConsolePrintPacket Fibonacci FieldHint FieldHintStyle FieldMasked FieldSize File FileBaseName FileByteCount FileDate FileExistsQ FileExtension FileFormat FileHash FileInformation FileName FileNameDepth FileNameDialogSettings FileNameDrop FileNameJoin FileNames FileNameSetter FileNameSplit FileNameTake FilePrint FileType FilledCurve FilledCurveBox Filling FillingStyle FillingTransform FilterRules FinancialBond FinancialData FinancialDerivative FinancialIndicator Find FindArgMax FindArgMin FindClique FindClusters FindCurvePath FindDistributionParameters FindDivisions FindEdgeCover FindEdgeCut FindEulerianCycle FindFaces FindFile FindFit FindGeneratingFunction FindGeoLocation FindGeometricTransform FindGraphCommunities FindGraphIsomorphism FindGraphPartition FindHamiltonianCycle FindIndependentEdgeSet FindIndependentVertexSet FindInstance FindIntegerNullVector FindKClan FindKClique FindKClub FindKPlex FindLibrary FindLinearRecurrence FindList FindMaximum FindMaximumFlow FindMaxValue FindMinimum FindMinimumCostFlow FindMinimumCut FindMinValue FindPermutation FindPostmanTour FindProcessParameters FindRoot FindSequenceFunction FindSettings FindShortestPath FindShortestTour FindThreshold FindVertexCover FindVertexCut Fine FinishDynamic FiniteAbelianGroupCount FiniteGroupCount FiniteGroupData First FirstPassageTimeDistribution FischerGroupFi22 FischerGroupFi23 FischerGroupFi24Prime FisherHypergeometricDistribution FisherRatioTest FisherZDistribution Fit FitAll FittedModel FixedPoint FixedPointList FlashSelection Flat Flatten FlattenAt FlatTopWindow FlipView Floor FlushPrintOutputPacket Fold FoldList Font FontColor FontFamily FontForm FontName FontOpacity FontPostScriptName FontProperties FontReencoding FontSize FontSlant FontSubstitutions FontTracking FontVariations FontWeight For ForAll Format FormatRules FormatType FormatTypeAutoConvert FormatValues FormBox FormBoxOptions FortranForm Forward ForwardBackward Fourier FourierCoefficient FourierCosCoefficient FourierCosSeries FourierCosTransform FourierDCT FourierDCTFilter FourierDCTMatrix FourierDST FourierDSTMatrix FourierMatrix FourierParameters FourierSequenceTransform FourierSeries FourierSinCoefficient FourierSinSeries FourierSinTransform FourierTransform FourierTrigSeries FractionalBrownianMotionProcess FractionalPart FractionBox FractionBoxOptions FractionLine Frame FrameBox FrameBoxOptions Framed FrameInset FrameLabel Frameless FrameMargins FrameStyle FrameTicks FrameTicksStyle FRatioDistribution FrechetDistribution FreeQ FrequencySamplingFilterKernel FresnelC FresnelS Friday FrobeniusNumber FrobeniusSolve ' +
	      'FromCharacterCode FromCoefficientRules FromContinuedFraction FromDate FromDigits FromDMS Front FrontEndDynamicExpression FrontEndEventActions FrontEndExecute FrontEndObject FrontEndResource FrontEndResourceString FrontEndStackSize FrontEndToken FrontEndTokenExecute FrontEndValueCache FrontEndVersion FrontFaceColor FrontFaceOpacity Full FullAxes FullDefinition FullForm FullGraphics FullOptions FullSimplify Function FunctionExpand FunctionInterpolation FunctionSpace FussellVeselyImportance ' +
	      'GaborFilter GaborMatrix GaborWavelet GainMargins GainPhaseMargins Gamma GammaDistribution GammaRegularized GapPenalty Gather GatherBy GaugeFaceElementFunction GaugeFaceStyle GaugeFrameElementFunction GaugeFrameSize GaugeFrameStyle GaugeLabels GaugeMarkers GaugeStyle GaussianFilter GaussianIntegers GaussianMatrix GaussianWindow GCD GegenbauerC General GeneralizedLinearModelFit GenerateConditions GeneratedCell GeneratedParameters GeneratingFunction Generic GenericCylindricalDecomposition GenomeData GenomeLookup GeodesicClosing GeodesicDilation GeodesicErosion GeodesicOpening GeoDestination GeodesyData GeoDirection GeoDistance GeoGridPosition GeometricBrownianMotionProcess GeometricDistribution GeometricMean GeometricMeanFilter GeometricTransformation GeometricTransformation3DBox GeometricTransformation3DBoxOptions GeometricTransformationBox GeometricTransformationBoxOptions GeoPosition GeoPositionENU GeoPositionXYZ GeoProjectionData GestureHandler GestureHandlerTag Get GetBoundingBoxSizePacket GetContext GetEnvironment GetFileName GetFrontEndOptionsDataPacket GetLinebreakInformationPacket GetMenusPacket GetPageBreakInformationPacket Glaisher GlobalClusteringCoefficient GlobalPreferences GlobalSession Glow GoldenRatio GompertzMakehamDistribution GoodmanKruskalGamma GoodmanKruskalGammaTest Goto Grad Gradient GradientFilter GradientOrientationFilter Graph GraphAssortativity GraphCenter GraphComplement GraphData GraphDensity GraphDiameter GraphDifference GraphDisjointUnion ' +
	      'GraphDistance GraphDistanceMatrix GraphElementData GraphEmbedding GraphHighlight GraphHighlightStyle GraphHub Graphics Graphics3D Graphics3DBox Graphics3DBoxOptions GraphicsArray GraphicsBaseline GraphicsBox GraphicsBoxOptions GraphicsColor GraphicsColumn GraphicsComplex GraphicsComplex3DBox GraphicsComplex3DBoxOptions GraphicsComplexBox GraphicsComplexBoxOptions GraphicsContents GraphicsData GraphicsGrid GraphicsGridBox GraphicsGroup GraphicsGroup3DBox GraphicsGroup3DBoxOptions GraphicsGroupBox GraphicsGroupBoxOptions GraphicsGrouping GraphicsHighlightColor GraphicsRow GraphicsSpacing GraphicsStyle GraphIntersection GraphLayout GraphLinkEfficiency GraphPeriphery GraphPlot GraphPlot3D GraphPower GraphPropertyDistribution GraphQ GraphRadius GraphReciprocity GraphRoot GraphStyle GraphUnion Gray GrayLevel GreatCircleDistance Greater GreaterEqual GreaterEqualLess GreaterFullEqual GreaterGreater GreaterLess GreaterSlantEqual GreaterTilde Green Grid GridBaseline GridBox GridBoxAlignment GridBoxBackground GridBoxDividers GridBoxFrame GridBoxItemSize GridBoxItemStyle GridBoxOptions GridBoxSpacings GridCreationSettings GridDefaultElement GridElementStyleOptions GridFrame GridFrameMargins GridGraph GridLines GridLinesStyle GroebnerBasis GroupActionBase GroupCentralizer GroupElementFromWord GroupElementPosition GroupElementQ GroupElements GroupElementToWord GroupGenerators GroupMultiplicationTable GroupOrbits GroupOrder GroupPageBreakWithin GroupSetwiseStabilizer GroupStabilizer GroupStabilizerChain Gudermannian GumbelDistribution ' +
	      'HaarWavelet HadamardMatrix HalfNormalDistribution HamiltonianGraphQ HammingDistance HammingWindow HankelH1 HankelH2 HankelMatrix HannPoissonWindow HannWindow HaradaNortonGroupHN HararyGraph HarmonicMean HarmonicMeanFilter HarmonicNumber Hash HashTable Haversine HazardFunction Head HeadCompose Heads HeavisideLambda HeavisidePi HeavisideTheta HeldGroupHe HeldPart HelpBrowserLookup HelpBrowserNotebook HelpBrowserSettings HermiteDecomposition HermiteH HermitianMatrixQ HessenbergDecomposition Hessian HexadecimalCharacter Hexahedron HexahedronBox HexahedronBoxOptions HiddenSurface HighlightGraph HighlightImage HighpassFilter HigmanSimsGroupHS HilbertFilter HilbertMatrix Histogram Histogram3D HistogramDistribution HistogramList HistogramTransform HistogramTransformInterpolation HitMissTransform HITSCentrality HodgeDual HoeffdingD HoeffdingDTest Hold HoldAll HoldAllComplete HoldComplete HoldFirst HoldForm HoldPattern HoldRest HolidayCalendar HomeDirectory HomePage Horizontal HorizontalForm HorizontalGauge HorizontalScrollPosition HornerForm HotellingTSquareDistribution HoytDistribution HTMLSave Hue HumpDownHump HumpEqual HurwitzLerchPhi HurwitzZeta HyperbolicDistribution HypercubeGraph HyperexponentialDistribution Hyperfactorial Hypergeometric0F1 Hypergeometric0F1Regularized Hypergeometric1F1 Hypergeometric1F1Regularized Hypergeometric2F1 Hypergeometric2F1Regularized HypergeometricDistribution HypergeometricPFQ HypergeometricPFQRegularized HypergeometricU Hyperlink HyperlinkCreationSettings Hyphenation HyphenationOptions HypoexponentialDistribution HypothesisTestData ' +
	      'I Identity IdentityMatrix If IgnoreCase Im Image Image3D Image3DSlices ImageAccumulate ImageAdd ImageAdjust ImageAlign ImageApply ImageAspectRatio ImageAssemble ImageCache ImageCacheValid ImageCapture ImageChannels ImageClip ImageColorSpace ImageCompose ImageConvolve ImageCooccurrence ImageCorners ImageCorrelate ImageCorrespondingPoints ImageCrop ImageData ImageDataPacket ImageDeconvolve ImageDemosaic ImageDifference ImageDimensions ImageDistance ImageEffect ImageFeatureTrack ImageFileApply ImageFileFilter ImageFileScan ImageFilter ImageForestingComponents ImageForwardTransformation ImageHistogram ImageKeypoints ImageLevels ImageLines ImageMargins ImageMarkers ImageMeasurements ImageMultiply ImageOffset ImagePad ImagePadding ImagePartition ImagePeriodogram ImagePerspectiveTransformation ImageQ ImageRangeCache ImageReflect ImageRegion ImageResize ImageResolution ImageRotate ImageRotated ImageScaled ImageScan ImageSize ImageSizeAction ImageSizeCache ImageSizeMultipliers ImageSizeRaw ImageSubtract ImageTake ImageTransformation ImageTrim ImageType ImageValue ImageValuePositions Implies Import ImportAutoReplacements ImportString ImprovementImportance In IncidenceGraph IncidenceList IncidenceMatrix IncludeConstantBasis IncludeFileExtension IncludePods IncludeSingularTerm Increment Indent IndentingNewlineSpacings IndentMaxFraction IndependenceTest IndependentEdgeSetQ IndependentUnit IndependentVertexSetQ Indeterminate IndexCreationOptions Indexed IndexGraph IndexTag Inequality InexactNumberQ InexactNumbers Infinity Infix Information Inherited InheritScope Initialization InitializationCell InitializationCellEvaluation InitializationCellWarning InlineCounterAssignments InlineCounterIncrements InlineRules Inner Inpaint Input InputAliases InputAssumptions InputAutoReplacements InputField InputFieldBox InputFieldBoxOptions InputForm InputGrouping InputNamePacket InputNotebook InputPacket InputSettings InputStream InputString InputStringPacket InputToBoxFormPacket Insert InsertionPointObject InsertResults Inset Inset3DBox Inset3DBoxOptions InsetBox InsetBoxOptions Install InstallService InString Integer IntegerDigits IntegerExponent IntegerLength IntegerPart IntegerPartitions IntegerQ Integers IntegerString Integral Integrate Interactive InteractiveTradingChart Interlaced Interleaving InternallyBalancedDecomposition InterpolatingFunction InterpolatingPolynomial Interpolation InterpolationOrder InterpolationPoints InterpolationPrecision Interpretation InterpretationBox InterpretationBoxOptions InterpretationFunction ' +
	      'InterpretTemplate InterquartileRange Interrupt InterruptSettings Intersection Interval IntervalIntersection IntervalMemberQ IntervalUnion Inverse InverseBetaRegularized InverseCDF InverseChiSquareDistribution InverseContinuousWaveletTransform InverseDistanceTransform InverseEllipticNomeQ InverseErf InverseErfc InverseFourier InverseFourierCosTransform InverseFourierSequenceTransform InverseFourierSinTransform InverseFourierTransform InverseFunction InverseFunctions InverseGammaDistribution InverseGammaRegularized InverseGaussianDistribution InverseGudermannian InverseHaversine InverseJacobiCD InverseJacobiCN InverseJacobiCS InverseJacobiDC InverseJacobiDN InverseJacobiDS InverseJacobiNC InverseJacobiND InverseJacobiNS InverseJacobiSC InverseJacobiSD InverseJacobiSN InverseLaplaceTransform InversePermutation InverseRadon InverseSeries InverseSurvivalFunction InverseWaveletTransform InverseWeierstrassP InverseZTransform Invisible InvisibleApplication InvisibleTimes IrreduciblePolynomialQ IsolatingInterval IsomorphicGraphQ IsotopeData Italic Item ItemBox ItemBoxOptions ItemSize ItemStyle ItoProcess ' +
	      'JaccardDissimilarity JacobiAmplitude Jacobian JacobiCD JacobiCN JacobiCS JacobiDC JacobiDN JacobiDS JacobiNC JacobiND JacobiNS JacobiP JacobiSC JacobiSD JacobiSN JacobiSymbol JacobiZeta JankoGroupJ1 JankoGroupJ2 JankoGroupJ3 JankoGroupJ4 JarqueBeraALMTest JohnsonDistribution Join Joined JoinedCurve JoinedCurveBox JoinForm JordanDecomposition JordanModelDecomposition ' +
	      'K KagiChart KaiserBesselWindow KaiserWindow KalmanEstimator KalmanFilter KarhunenLoeveDecomposition KaryTree KatzCentrality KCoreComponents KDistribution KelvinBei KelvinBer KelvinKei KelvinKer KendallTau KendallTauTest KernelExecute KernelMixtureDistribution KernelObject Kernels Ket Khinchin KirchhoffGraph KirchhoffMatrix KleinInvariantJ KnightTourGraph KnotData KnownUnitQ KolmogorovSmirnovTest KroneckerDelta KroneckerModelDecomposition KroneckerProduct KroneckerSymbol KuiperTest KumaraswamyDistribution Kurtosis KuwaharaFilter ' +
	      'Label Labeled LabeledSlider LabelingFunction LabelStyle LaguerreL LambdaComponents LambertW LanczosWindow LandauDistribution Language LanguageCategory LaplaceDistribution LaplaceTransform Laplacian LaplacianFilter LaplacianGaussianFilter Large Larger Last Latitude LatitudeLongitude LatticeData LatticeReduce Launch LaunchKernels LayeredGraphPlot LayerSizeFunction LayoutInformation LCM LeafCount LeapYearQ LeastSquares LeastSquaresFilterKernel Left LeftArrow LeftArrowBar LeftArrowRightArrow LeftDownTeeVector LeftDownVector LeftDownVectorBar LeftRightArrow LeftRightVector LeftTee LeftTeeArrow LeftTeeVector LeftTriangle LeftTriangleBar LeftTriangleEqual LeftUpDownVector LeftUpTeeVector LeftUpVector LeftUpVectorBar LeftVector LeftVectorBar LegendAppearance Legended LegendFunction LegendLabel LegendLayout LegendMargins LegendMarkers LegendMarkerSize LegendreP LegendreQ LegendreType Length LengthWhile LerchPhi Less LessEqual LessEqualGreater LessFullEqual LessGreater LessLess LessSlantEqual LessTilde LetterCharacter LetterQ Level LeveneTest LeviCivitaTensor LevyDistribution Lexicographic LibraryFunction LibraryFunctionError LibraryFunctionInformation LibraryFunctionLoad LibraryFunctionUnload LibraryLoad LibraryUnload LicenseID LiftingFilterData LiftingWaveletTransform LightBlue LightBrown LightCyan Lighter LightGray LightGreen Lighting LightingAngle LightMagenta LightOrange LightPink LightPurple LightRed LightSources LightYellow Likelihood Limit LimitsPositioning LimitsPositioningTokens LindleyDistribution Line Line3DBox LinearFilter LinearFractionalTransform LinearModelFit LinearOffsetFunction LinearProgramming LinearRecurrence LinearSolve LinearSolveFunction LineBox LineBreak LinebreakAdjustments LineBreakChart LineBreakWithin LineColor LineForm LineGraph LineIndent LineIndentMaxFraction LineIntegralConvolutionPlot LineIntegralConvolutionScale LineLegend LineOpacity LineSpacing LineWrapParts LinkActivate LinkClose LinkConnect LinkConnectedQ LinkCreate LinkError LinkFlush LinkFunction LinkHost LinkInterrupt LinkLaunch LinkMode LinkObject LinkOpen LinkOptions LinkPatterns LinkProtocol LinkRead LinkReadHeld LinkReadyQ Links LinkWrite LinkWriteHeld LiouvilleLambda List Listable ListAnimate ListContourPlot ListContourPlot3D ListConvolve ListCorrelate ListCurvePathPlot ListDeconvolve ListDensityPlot Listen ListFourierSequenceTransform ListInterpolation ListLineIntegralConvolutionPlot ListLinePlot ListLogLinearPlot ListLogLogPlot ListLogPlot ListPicker ListPickerBox ListPickerBoxBackground ListPickerBoxOptions ListPlay ListPlot ListPlot3D ListPointPlot3D ListPolarPlot ListQ ListStreamDensityPlot ListStreamPlot ListSurfacePlot3D ListVectorDensityPlot ListVectorPlot ListVectorPlot3D ListZTransform Literal LiteralSearch LocalClusteringCoefficient LocalizeVariables LocationEquivalenceTest LocationTest Locator LocatorAutoCreate LocatorBox LocatorBoxOptions LocatorCentering LocatorPane LocatorPaneBox LocatorPaneBoxOptions ' +
	      'LocatorRegion Locked Log Log10 Log2 LogBarnesG LogGamma LogGammaDistribution LogicalExpand LogIntegral LogisticDistribution LogitModelFit LogLikelihood LogLinearPlot LogLogisticDistribution LogLogPlot LogMultinormalDistribution LogNormalDistribution LogPlot LogRankTest LogSeriesDistribution LongEqual Longest LongestAscendingSequence LongestCommonSequence LongestCommonSequencePositions LongestCommonSubsequence LongestCommonSubsequencePositions LongestMatch LongForm Longitude LongLeftArrow LongLeftRightArrow LongRightArrow Loopback LoopFreeGraphQ LowerCaseQ LowerLeftArrow LowerRightArrow LowerTriangularize LowpassFilter LQEstimatorGains LQGRegulator LQOutputRegulatorGains LQRegulatorGains LUBackSubstitution LucasL LuccioSamiComponents LUDecomposition LyapunovSolve LyonsGroupLy ' +
	      'MachineID MachineName MachineNumberQ MachinePrecision MacintoshSystemPageSetup Magenta Magnification Magnify MainSolve MaintainDynamicCaches Majority MakeBoxes MakeExpression MakeRules MangoldtLambda ManhattanDistance Manipulate Manipulator MannWhitneyTest MantissaExponent Manual Map MapAll MapAt MapIndexed MAProcess MapThread MarcumQ MardiaCombinedTest MardiaKurtosisTest MardiaSkewnessTest MarginalDistribution MarkovProcessProperties Masking MatchingDissimilarity MatchLocalNameQ MatchLocalNames MatchQ Material MathematicaNotation MathieuC MathieuCharacteristicA MathieuCharacteristicB MathieuCharacteristicExponent MathieuCPrime MathieuGroupM11 MathieuGroupM12 MathieuGroupM22 MathieuGroupM23 MathieuGroupM24 MathieuS MathieuSPrime MathMLForm MathMLText Matrices MatrixExp MatrixForm MatrixFunction MatrixLog MatrixPlot MatrixPower MatrixQ MatrixRank Max MaxBend MaxDetect MaxExtraBandwidths MaxExtraConditions MaxFeatures MaxFilter Maximize MaxIterations MaxMemoryUsed MaxMixtureKernels MaxPlotPoints MaxPoints MaxRecursion MaxStableDistribution MaxStepFraction MaxSteps MaxStepSize MaxValue MaxwellDistribution McLaughlinGroupMcL Mean MeanClusteringCoefficient MeanDegreeConnectivity MeanDeviation MeanFilter MeanGraphDistance MeanNeighborDegree MeanShift MeanShiftFilter Median MedianDeviation MedianFilter Medium MeijerG MeixnerDistribution MemberQ MemoryConstrained MemoryInUse Menu MenuAppearance MenuCommandKey MenuEvaluator MenuItem MenuPacket MenuSortingValue MenuStyle MenuView MergeDifferences Mesh MeshFunctions MeshRange MeshShading MeshStyle Message MessageDialog MessageList MessageName MessageOptions MessagePacket Messages MessagesNotebook MetaCharacters MetaInformation Method MethodOptions MexicanHatWavelet MeyerWavelet Min MinDetect MinFilter MinimalPolynomial MinimalStateSpaceModel Minimize Minors MinRecursion MinSize MinStableDistribution Minus MinusPlus MinValue Missing MissingDataMethod MittagLefflerE MixedRadix MixedRadixQuantity MixtureDistribution Mod Modal Mode Modular ModularLambda Module Modulus MoebiusMu Moment Momentary MomentConvert MomentEvaluate MomentGeneratingFunction Monday Monitor MonomialList MonomialOrder MonsterGroupM MorletWavelet MorphologicalBinarize MorphologicalBranchPoints MorphologicalComponents MorphologicalEulerNumber MorphologicalGraph MorphologicalPerimeter MorphologicalTransform Most MouseAnnotation MouseAppearance MouseAppearanceTag MouseButtons Mouseover MousePointerNote MousePosition MovingAverage MovingMedian MoyalDistribution MultiedgeStyle MultilaunchWarning MultiLetterItalics MultiLetterStyle MultilineFunction Multinomial MultinomialDistribution MultinormalDistribution MultiplicativeOrder Multiplicity Multiselection MultivariateHypergeometricDistribution MultivariatePoissonDistribution MultivariateTDistribution ' +
	      'N NakagamiDistribution NameQ Names NamespaceBox Nand NArgMax NArgMin NBernoulliB NCache NDSolve NDSolveValue Nearest NearestFunction NeedCurrentFrontEndPackagePacket NeedCurrentFrontEndSymbolsPacket NeedlemanWunschSimilarity Needs Negative NegativeBinomialDistribution NegativeMultinomialDistribution NeighborhoodGraph Nest NestedGreaterGreater NestedLessLess NestedScriptRules NestList NestWhile NestWhileList NevilleThetaC NevilleThetaD NevilleThetaN NevilleThetaS NewPrimitiveStyle NExpectation Next NextPrime NHoldAll NHoldFirst NHoldRest NicholsGridLines NicholsPlot NIntegrate NMaximize NMaxValue NMinimize NMinValue NominalVariables NonAssociative NoncentralBetaDistribution NoncentralChiSquareDistribution NoncentralFRatioDistribution NoncentralStudentTDistribution NonCommutativeMultiply NonConstants None NonlinearModelFit NonlocalMeansFilter NonNegative NonPositive Nor NorlundB Norm Normal NormalDistribution NormalGrouping Normalize NormalizedSquaredEuclideanDistance NormalsFunction NormFunction Not NotCongruent NotCupCap NotDoubleVerticalBar Notebook NotebookApply NotebookAutoSave NotebookClose NotebookConvertSettings NotebookCreate NotebookCreateReturnObject NotebookDefault NotebookDelete NotebookDirectory NotebookDynamicExpression NotebookEvaluate NotebookEventActions NotebookFileName NotebookFind NotebookFindReturnObject NotebookGet NotebookGetLayoutInformationPacket NotebookGetMisspellingsPacket NotebookInformation NotebookInterfaceObject NotebookLocate NotebookObject NotebookOpen NotebookOpenReturnObject NotebookPath NotebookPrint NotebookPut NotebookPutReturnObject NotebookRead NotebookResetGeneratedCells Notebooks NotebookSave NotebookSaveAs NotebookSelection NotebookSetupLayoutInformationPacket NotebooksMenu NotebookWrite NotElement NotEqualTilde NotExists NotGreater NotGreaterEqual NotGreaterFullEqual NotGreaterGreater NotGreaterLess NotGreaterSlantEqual NotGreaterTilde NotHumpDownHump NotHumpEqual NotLeftTriangle NotLeftTriangleBar NotLeftTriangleEqual NotLess NotLessEqual NotLessFullEqual NotLessGreater NotLessLess NotLessSlantEqual NotLessTilde NotNestedGreaterGreater NotNestedLessLess NotPrecedes NotPrecedesEqual NotPrecedesSlantEqual NotPrecedesTilde NotReverseElement NotRightTriangle NotRightTriangleBar NotRightTriangleEqual NotSquareSubset NotSquareSubsetEqual NotSquareSuperset NotSquareSupersetEqual NotSubset NotSubsetEqual NotSucceeds NotSucceedsEqual NotSucceedsSlantEqual NotSucceedsTilde NotSuperset NotSupersetEqual NotTilde NotTildeEqual NotTildeFullEqual NotTildeTilde NotVerticalBar NProbability NProduct NProductFactors NRoots NSolve NSum NSumTerms Null NullRecords NullSpace NullWords Number NumberFieldClassNumber NumberFieldDiscriminant NumberFieldFundamentalUnits NumberFieldIntegralBasis NumberFieldNormRepresentatives NumberFieldRegulator NumberFieldRootsOfUnity NumberFieldSignature NumberForm NumberFormat NumberMarks NumberMultiplier NumberPadding NumberPoint NumberQ NumberSeparator ' +
	      'NumberSigns NumberString Numerator NumericFunction NumericQ NuttallWindow NValues NyquistGridLines NyquistPlot ' +
	      'O ObservabilityGramian ObservabilityMatrix ObservableDecomposition ObservableModelQ OddQ Off Offset OLEData On ONanGroupON OneIdentity Opacity Open OpenAppend Opener OpenerBox OpenerBoxOptions OpenerView OpenFunctionInspectorPacket Opening OpenRead OpenSpecialOptions OpenTemporary OpenWrite Operate OperatingSystem OptimumFlowData Optional OptionInspectorSettings OptionQ Options OptionsPacket OptionsPattern OptionValue OptionValueBox OptionValueBoxOptions Or Orange Order OrderDistribution OrderedQ Ordering Orderless OrnsteinUhlenbeckProcess Orthogonalize Out Outer OutputAutoOverwrite OutputControllabilityMatrix OutputControllableModelQ OutputForm OutputFormData OutputGrouping OutputMathEditExpression OutputNamePacket OutputResponse OutputSizeLimit OutputStream Over OverBar OverDot Overflow OverHat Overlaps Overlay OverlayBox OverlayBoxOptions Overscript OverscriptBox OverscriptBoxOptions OverTilde OverVector OwenT OwnValues ' +
	      'PackingMethod PaddedForm Padding PadeApproximant PadLeft PadRight PageBreakAbove PageBreakBelow PageBreakWithin PageFooterLines PageFooters PageHeaderLines PageHeaders PageHeight PageRankCentrality PageWidth PairedBarChart PairedHistogram PairedSmoothHistogram PairedTTest PairedZTest PaletteNotebook PalettePath Pane PaneBox PaneBoxOptions Panel PanelBox PanelBoxOptions Paneled PaneSelector PaneSelectorBox PaneSelectorBoxOptions PaperWidth ParabolicCylinderD ParagraphIndent ParagraphSpacing ParallelArray ParallelCombine ParallelDo ParallelEvaluate Parallelization Parallelize ParallelMap ParallelNeeds ParallelProduct ParallelSubmit ParallelSum ParallelTable ParallelTry Parameter ParameterEstimator ParameterMixtureDistribution ParameterVariables ParametricFunction ParametricNDSolve ParametricNDSolveValue ParametricPlot ParametricPlot3D ParentConnect ParentDirectory ParentForm Parenthesize ParentList ParetoDistribution Part PartialCorrelationFunction PartialD ParticleData Partition PartitionsP PartitionsQ ParzenWindow PascalDistribution PassEventsDown PassEventsUp Paste PasteBoxFormInlineCells PasteButton Path PathGraph PathGraphQ Pattern PatternSequence PatternTest PauliMatrix PaulWavelet Pause PausedTime PDF PearsonChiSquareTest PearsonCorrelationTest PearsonDistribution PerformanceGoal PeriodicInterpolation Periodogram PeriodogramArray PermutationCycles PermutationCyclesQ PermutationGroup PermutationLength PermutationList PermutationListQ PermutationMax PermutationMin PermutationOrder PermutationPower PermutationProduct PermutationReplace Permutations PermutationSupport Permute PeronaMalikFilter Perpendicular PERTDistribution PetersenGraph PhaseMargins Pi Pick PIDData PIDDerivativeFilter PIDFeedforward PIDTune Piecewise PiecewiseExpand PieChart PieChart3D PillaiTrace PillaiTraceTest Pink Pivoting PixelConstrained PixelValue PixelValuePositions Placed Placeholder PlaceholderReplace Plain PlanarGraphQ Play PlayRange Plot Plot3D Plot3Matrix PlotDivision PlotJoined PlotLabel PlotLayout PlotLegends PlotMarkers PlotPoints PlotRange PlotRangeClipping PlotRangePadding PlotRegion PlotStyle Plus PlusMinus Pochhammer PodStates PodWidth Point Point3DBox PointBox PointFigureChart PointForm PointLegend PointSize PoissonConsulDistribution PoissonDistribution PoissonProcess PoissonWindow PolarAxes PolarAxesOrigin PolarGridLines PolarPlot PolarTicks PoleZeroMarkers PolyaAeppliDistribution PolyGamma Polygon Polygon3DBox Polygon3DBoxOptions PolygonBox PolygonBoxOptions PolygonHoleScale PolygonIntersections PolygonScale PolyhedronData PolyLog PolynomialExtendedGCD PolynomialForm PolynomialGCD PolynomialLCM PolynomialMod PolynomialQ PolynomialQuotient PolynomialQuotientRemainder PolynomialReduce PolynomialRemainder Polynomials PopupMenu PopupMenuBox PopupMenuBoxOptions PopupView PopupWindow Position Positive PositiveDefiniteMatrixQ PossibleZeroQ Postfix PostScript Power PowerDistribution PowerExpand PowerMod PowerModList ' +
	      'PowerSpectralDensity PowersRepresentations PowerSymmetricPolynomial Precedence PrecedenceForm Precedes PrecedesEqual PrecedesSlantEqual PrecedesTilde Precision PrecisionGoal PreDecrement PredictionRoot PreemptProtect PreferencesPath Prefix PreIncrement Prepend PrependTo PreserveImageOptions Previous PriceGraphDistribution PrimaryPlaceholder Prime PrimeNu PrimeOmega PrimePi PrimePowerQ PrimeQ Primes PrimeZetaP PrimitiveRoot PrincipalComponents PrincipalValue Print PrintAction PrintForm PrintingCopies PrintingOptions PrintingPageRange PrintingStartingPageNumber PrintingStyleEnvironment PrintPrecision PrintTemporary Prism PrismBox PrismBoxOptions PrivateCellOptions PrivateEvaluationOptions PrivateFontOptions PrivateFrontEndOptions PrivateNotebookOptions PrivatePaths Probability ProbabilityDistribution ProbabilityPlot ProbabilityPr ProbabilityScalePlot ProbitModelFit ProcessEstimator ProcessParameterAssumptions ProcessParameterQ ProcessStateDomain ProcessTimeDomain Product ProductDistribution ProductLog ProgressIndicator ProgressIndicatorBox ProgressIndicatorBoxOptions Projection Prolog PromptForm Properties Property PropertyList PropertyValue Proportion Proportional Protect Protected ProteinData Pruning PseudoInverse Purple Put PutAppend Pyramid PyramidBox PyramidBoxOptions ' +
	      'QBinomial QFactorial QGamma QHypergeometricPFQ QPochhammer QPolyGamma QRDecomposition QuadraticIrrationalQ Quantile QuantilePlot Quantity QuantityForm QuantityMagnitude QuantityQ QuantityUnit Quartics QuartileDeviation Quartiles QuartileSkewness QueueingNetworkProcess QueueingProcess QueueProperties Quiet Quit Quotient QuotientRemainder ' +
	      'RadialityCentrality RadicalBox RadicalBoxOptions RadioButton RadioButtonBar RadioButtonBox RadioButtonBoxOptions Radon RamanujanTau RamanujanTauL RamanujanTauTheta RamanujanTauZ Random RandomChoice RandomComplex RandomFunction RandomGraph RandomImage RandomInteger RandomPermutation RandomPrime RandomReal RandomSample RandomSeed RandomVariate RandomWalkProcess Range RangeFilter RangeSpecification RankedMax RankedMin Raster Raster3D Raster3DBox Raster3DBoxOptions RasterArray RasterBox RasterBoxOptions Rasterize RasterSize Rational RationalFunctions Rationalize Rationals Ratios Raw RawArray RawBoxes RawData RawMedium RayleighDistribution Re Read ReadList ReadProtected Real RealBlockDiagonalForm RealDigits RealExponent Reals Reap Record RecordLists RecordSeparators Rectangle RectangleBox RectangleBoxOptions RectangleChart RectangleChart3D RecurrenceFilter RecurrenceTable RecurringDigitsForm Red Reduce RefBox ReferenceLineStyle ReferenceMarkers ReferenceMarkerStyle Refine ReflectionMatrix ReflectionTransform Refresh RefreshRate RegionBinarize RegionFunction RegionPlot RegionPlot3D RegularExpression Regularization Reinstall Release ReleaseHold ReliabilityDistribution ReliefImage ReliefPlot Remove RemoveAlphaChannel RemoveAsynchronousTask Removed RemoveInputStreamMethod RemoveOutputStreamMethod RemoveProperty RemoveScheduledTask RenameDirectory RenameFile RenderAll RenderingOptions RenewalProcess RenkoChart Repeated RepeatedNull RepeatedString Replace ReplaceAll ReplaceHeldPart ReplaceImageValue ReplaceList ReplacePart ReplacePixelValue ReplaceRepeated Resampling Rescale RescalingTransform ResetDirectory ResetMenusPacket ResetScheduledTask Residue Resolve Rest Resultant ResumePacket Return ReturnExpressionPacket ReturnInputFormPacket ReturnPacket ReturnTextPacket Reverse ReverseBiorthogonalSplineWavelet ReverseElement ReverseEquilibrium ReverseGraph ReverseUpEquilibrium RevolutionAxis RevolutionPlot3D RGBColor RiccatiSolve RiceDistribution RidgeFilter RiemannR RiemannSiegelTheta RiemannSiegelZ Riffle Right RightArrow RightArrowBar RightArrowLeftArrow RightCosetRepresentative RightDownTeeVector RightDownVector RightDownVectorBar RightTee RightTeeArrow RightTeeVector RightTriangle RightTriangleBar RightTriangleEqual RightUpDownVector RightUpTeeVector RightUpVector RightUpVectorBar RightVector RightVectorBar RiskAchievementImportance RiskReductionImportance RogersTanimotoDissimilarity Root RootApproximant RootIntervals RootLocusPlot RootMeanSquare RootOfUnityQ RootReduce Roots RootSum Rotate RotateLabel RotateLeft RotateRight RotationAction RotationBox RotationBoxOptions RotationMatrix RotationTransform Round RoundImplies RoundingRadius Row RowAlignments RowBackgrounds RowBox RowHeights RowLines RowMinHeight RowReduce RowsEqual RowSpacings RSolve RudvalisGroupRu Rule RuleCondition RuleDelayed RuleForm RulerUnits Run RunScheduledTask RunThrough RuntimeAttributes RuntimeOptions RussellRaoDissimilarity ' +
	      'SameQ SameTest SampleDepth SampledSoundFunction SampledSoundList SampleRate SamplingPeriod SARIMAProcess SARMAProcess SatisfiabilityCount SatisfiabilityInstances SatisfiableQ Saturday Save Saveable SaveAutoDelete SaveDefinitions SawtoothWave Scale Scaled ScaleDivisions ScaledMousePosition ScaleOrigin ScalePadding ScaleRanges ScaleRangeStyle ScalingFunctions ScalingMatrix ScalingTransform Scan ScheduledTaskActiveQ ScheduledTaskData ScheduledTaskObject ScheduledTasks SchurDecomposition ScientificForm ScreenRectangle ScreenStyleEnvironment ScriptBaselineShifts ScriptLevel ScriptMinSize ScriptRules ScriptSizeMultipliers Scrollbars ScrollingOptions ScrollPosition Sec Sech SechDistribution SectionGrouping SectorChart SectorChart3D SectorOrigin SectorSpacing SeedRandom Select Selectable SelectComponents SelectedCells SelectedNotebook Selection SelectionAnimate SelectionCell SelectionCellCreateCell SelectionCellDefaultStyle SelectionCellParentStyle SelectionCreateCell SelectionDebuggerTag SelectionDuplicateCell SelectionEvaluate SelectionEvaluateCreateCell SelectionMove SelectionPlaceholder SelectionSetStyle SelectWithContents SelfLoops SelfLoopStyle SemialgebraicComponentInstances SendMail Sequence SequenceAlignment SequenceForm SequenceHold SequenceLimit Series SeriesCoefficient SeriesData SessionTime Set SetAccuracy SetAlphaChannel SetAttributes Setbacks SetBoxFormNamesPacket SetDelayed SetDirectory SetEnvironment SetEvaluationNotebook SetFileDate SetFileLoadingContext SetNotebookStatusLine SetOptions SetOptionsPacket SetPrecision SetProperty SetSelectedNotebook SetSharedFunction SetSharedVariable SetSpeechParametersPacket SetStreamPosition SetSystemOptions Setter SetterBar SetterBox SetterBoxOptions Setting SetValue Shading Shallow ShannonWavelet ShapiroWilkTest Share Sharpen ShearingMatrix ShearingTransform ShenCastanMatrix Short ShortDownArrow Shortest ShortestMatch ShortestPathFunction ShortLeftArrow ShortRightArrow ShortUpArrow Show ShowAutoStyles ShowCellBracket ShowCellLabel ShowCellTags ShowClosedCellArea ShowContents ShowControls ShowCursorTracker ShowGroupOpenCloseIcon ShowGroupOpener ShowInvisibleCharacters ShowPageBreaks ShowPredictiveInterface ShowSelection ShowShortBoxForm ShowSpecialCharacters ShowStringCharacters ShowSyntaxStyles ShrinkingDelay ShrinkWrapBoundingBox SiegelTheta SiegelTukeyTest Sign Signature SignedRankTest SignificanceLevel SignPadding SignTest SimilarityRules SimpleGraph SimpleGraphQ Simplify Sin Sinc SinghMaddalaDistribution SingleEvaluation SingleLetterItalics SingleLetterStyle SingularValueDecomposition SingularValueList SingularValuePlot SingularValues Sinh SinhIntegral SinIntegral SixJSymbol Skeleton SkeletonTransform SkellamDistribution Skewness SkewNormalDistribution Skip SliceDistribution Slider Slider2D Slider2DBox Slider2DBoxOptions SliderBox SliderBoxOptions SlideView Slot SlotSequence Small SmallCircle Smaller SmithDelayCompensator SmithWatermanSimilarity ' +
	      'SmoothDensityHistogram SmoothHistogram SmoothHistogram3D SmoothKernelDistribution SocialMediaData Socket SokalSneathDissimilarity Solve SolveAlways SolveDelayed Sort SortBy Sound SoundAndGraphics SoundNote SoundVolume Sow Space SpaceForm Spacer Spacings Span SpanAdjustments SpanCharacterRounding SpanFromAbove SpanFromBoth SpanFromLeft SpanLineThickness SpanMaxSize SpanMinSize SpanningCharacters SpanSymmetric SparseArray SpatialGraphDistribution Speak SpeakTextPacket SpearmanRankTest SpearmanRho Spectrogram SpectrogramArray Specularity SpellingCorrection SpellingDictionaries SpellingDictionariesPath SpellingOptions SpellingSuggestionsPacket Sphere SphereBox SphericalBesselJ SphericalBesselY SphericalHankelH1 SphericalHankelH2 SphericalHarmonicY SphericalPlot3D SphericalRegion SpheroidalEigenvalue SpheroidalJoiningFactor SpheroidalPS SpheroidalPSPrime SpheroidalQS SpheroidalQSPrime SpheroidalRadialFactor SpheroidalS1 SpheroidalS1Prime SpheroidalS2 SpheroidalS2Prime Splice SplicedDistribution SplineClosed SplineDegree SplineKnots SplineWeights Split SplitBy SpokenString Sqrt SqrtBox SqrtBoxOptions Square SquaredEuclideanDistance SquareFreeQ SquareIntersection SquaresR SquareSubset SquareSubsetEqual SquareSuperset SquareSupersetEqual SquareUnion SquareWave StabilityMargins StabilityMarginsStyle StableDistribution Stack StackBegin StackComplete StackInhibit StandardDeviation StandardDeviationFilter StandardForm Standardize StandbyDistribution Star StarGraph StartAsynchronousTask StartingStepSize StartOfLine StartOfString StartScheduledTask StartupSound StateDimensions StateFeedbackGains StateOutputEstimator StateResponse StateSpaceModel StateSpaceRealization StateSpaceTransform StationaryDistribution StationaryWaveletPacketTransform StationaryWaveletTransform StatusArea StatusCentrality StepMonitor StieltjesGamma StirlingS1 StirlingS2 StopAsynchronousTask StopScheduledTask StrataVariables StratonovichProcess StreamColorFunction StreamColorFunctionScaling StreamDensityPlot StreamPlot StreamPoints StreamPosition Streams StreamScale StreamStyle String StringBreak StringByteCount StringCases StringCount StringDrop StringExpression StringForm StringFormat StringFreeQ StringInsert StringJoin StringLength StringMatchQ StringPosition StringQ StringReplace StringReplaceList StringReplacePart StringReverse StringRotateLeft StringRotateRight StringSkeleton StringSplit StringTake StringToStream StringTrim StripBoxes StripOnInput StripWrapperBoxes StrokeForm StructuralImportance StructuredArray StructuredSelection StruveH StruveL Stub StudentTDistribution Style StyleBox StyleBoxAutoDelete StyleBoxOptions StyleData StyleDefinitions StyleForm StyleKeyMapping StyleMenuListing StyleNameDialogSettings StyleNames StylePrint StyleSheetPath Subfactorial Subgraph SubMinus SubPlus SubresultantPolynomialRemainders ' +
	      'SubresultantPolynomials Subresultants Subscript SubscriptBox SubscriptBoxOptions Subscripted Subset SubsetEqual Subsets SubStar Subsuperscript SubsuperscriptBox SubsuperscriptBoxOptions Subtract SubtractFrom SubValues Succeeds SucceedsEqual SucceedsSlantEqual SucceedsTilde SuchThat Sum SumConvergence Sunday SuperDagger SuperMinus SuperPlus Superscript SuperscriptBox SuperscriptBoxOptions Superset SupersetEqual SuperStar Surd SurdForm SurfaceColor SurfaceGraphics SurvivalDistribution SurvivalFunction SurvivalModel SurvivalModelFit SuspendPacket SuzukiDistribution SuzukiGroupSuz SwatchLegend Switch Symbol SymbolName SymletWavelet Symmetric SymmetricGroup SymmetricMatrixQ SymmetricPolynomial SymmetricReduction Symmetrize SymmetrizedArray SymmetrizedArrayRules SymmetrizedDependentComponents SymmetrizedIndependentComponents SymmetrizedReplacePart SynchronousInitialization SynchronousUpdating Syntax SyntaxForm SyntaxInformation SyntaxLength SyntaxPacket SyntaxQ SystemDialogInput SystemException SystemHelpPath SystemInformation SystemInformationData SystemOpen SystemOptions SystemsModelDelay SystemsModelDelayApproximate SystemsModelDelete SystemsModelDimensions SystemsModelExtract SystemsModelFeedbackConnect SystemsModelLabels SystemsModelOrder SystemsModelParallelConnect SystemsModelSeriesConnect SystemsModelStateFeedbackConnect SystemStub ' +
	      'Tab TabFilling Table TableAlignments TableDepth TableDirections TableForm TableHeadings TableSpacing TableView TableViewBox TabSpacings TabView TabViewBox TabViewBoxOptions TagBox TagBoxNote TagBoxOptions TaggingRules TagSet TagSetDelayed TagStyle TagUnset Take TakeWhile Tally Tan Tanh TargetFunctions TargetUnits TautologyQ TelegraphProcess TemplateBox TemplateBoxOptions TemplateSlotSequence TemporalData Temporary TemporaryVariable TensorContract TensorDimensions TensorExpand TensorProduct TensorQ TensorRank TensorReduce TensorSymmetry TensorTranspose TensorWedge Tetrahedron TetrahedronBox TetrahedronBoxOptions TeXForm TeXSave Text Text3DBox Text3DBoxOptions TextAlignment TextBand TextBoundingBox TextBox TextCell TextClipboardType TextData TextForm TextJustification TextLine TextPacket TextParagraph TextRecognize TextRendering TextStyle Texture TextureCoordinateFunction TextureCoordinateScaling Therefore ThermometerGauge Thick Thickness Thin Thinning ThisLink ThompsonGroupTh Thread ThreeJSymbol Threshold Through Throw Thumbnail Thursday Ticks TicksStyle Tilde TildeEqual TildeFullEqual TildeTilde TimeConstrained TimeConstraint Times TimesBy TimeSeriesForecast TimeSeriesInvertibility TimeUsed TimeValue TimeZone Timing Tiny TitleGrouping TitsGroupT ToBoxes ToCharacterCode ToColor ToContinuousTimeModel ToDate ToDiscreteTimeModel ToeplitzMatrix ToExpression ToFileName Together Toggle ToggleFalse Toggler TogglerBar TogglerBox TogglerBoxOptions ToHeldExpression ToInvertibleTimeSeries TokenWords Tolerance ToLowerCase ToNumberField TooBig Tooltip TooltipBox TooltipBoxOptions TooltipDelay TooltipStyle Top TopHatTransform TopologicalSort ToRadicals ToRules ToString Total TotalHeight TotalVariationFilter TotalWidth TouchscreenAutoZoom TouchscreenControlPlacement ToUpperCase Tr Trace TraceAbove TraceAction TraceBackward TraceDepth TraceDialog TraceForward TraceInternal TraceLevel TraceOff TraceOn TraceOriginal TracePrint TraceScan TrackedSymbols TradingChart TraditionalForm TraditionalFunctionNotation TraditionalNotation TraditionalOrder TransferFunctionCancel TransferFunctionExpand TransferFunctionFactor TransferFunctionModel TransferFunctionPoles TransferFunctionTransform TransferFunctionZeros TransformationFunction TransformationFunctions TransformationMatrix TransformedDistribution TransformedField Translate TranslationTransform TransparentColor Transpose TreeForm TreeGraph TreeGraphQ TreePlot TrendStyle TriangleWave TriangularDistribution Trig TrigExpand TrigFactor TrigFactorList Trigger TrigReduce TrigToExp TrimmedMean True TrueQ TruncatedDistribution TsallisQExponentialDistribution TsallisQGaussianDistribution TTest Tube TubeBezierCurveBox TubeBezierCurveBoxOptions TubeBox TubeBSplineCurveBox TubeBSplineCurveBoxOptions Tuesday TukeyLambdaDistribution TukeyWindow Tuples TuranGraph TuringMachine ' +
	      'Transparent ' +
	      'UnateQ Uncompress Undefined UnderBar Underflow Underlined Underoverscript UnderoverscriptBox UnderoverscriptBoxOptions Underscript UnderscriptBox UnderscriptBoxOptions UndirectedEdge UndirectedGraph UndirectedGraphQ UndocumentedTestFEParserPacket UndocumentedTestGetSelectionPacket Unequal Unevaluated UniformDistribution UniformGraphDistribution UniformSumDistribution Uninstall Union UnionPlus Unique UnitBox UnitConvert UnitDimensions Unitize UnitRootTest UnitSimplify UnitStep UnitTriangle UnitVector Unprotect UnsameQ UnsavedVariables Unset UnsetShared UntrackedVariables Up UpArrow UpArrowBar UpArrowDownArrow Update UpdateDynamicObjects UpdateDynamicObjectsSynchronous UpdateInterval UpDownArrow UpEquilibrium UpperCaseQ UpperLeftArrow UpperRightArrow UpperTriangularize Upsample UpSet UpSetDelayed UpTee UpTeeArrow UpValues URL URLFetch URLFetchAsynchronous URLSave URLSaveAsynchronous UseGraphicsRange Using UsingFrontEnd ' +
	      'V2Get ValidationLength Value ValueBox ValueBoxOptions ValueForm ValueQ ValuesData Variables Variance VarianceEquivalenceTest VarianceEstimatorFunction VarianceGammaDistribution VarianceTest VectorAngle VectorColorFunction VectorColorFunctionScaling VectorDensityPlot VectorGlyphData VectorPlot VectorPlot3D VectorPoints VectorQ Vectors VectorScale VectorStyle Vee Verbatim Verbose VerboseConvertToPostScriptPacket VerifyConvergence VerifySolutions VerifyTestAssumptions Version VersionNumber VertexAdd VertexCapacity VertexColors VertexComponent VertexConnectivity VertexCoordinateRules VertexCoordinates VertexCorrelationSimilarity VertexCosineSimilarity VertexCount VertexCoverQ VertexDataCoordinates VertexDegree VertexDelete VertexDiceSimilarity VertexEccentricity VertexInComponent VertexInDegree VertexIndex VertexJaccardSimilarity VertexLabeling VertexLabels VertexLabelStyle VertexList VertexNormals VertexOutComponent VertexOutDegree VertexQ VertexRenderingFunction VertexReplace VertexShape VertexShapeFunction VertexSize VertexStyle VertexTextureCoordinates VertexWeight Vertical VerticalBar VerticalForm VerticalGauge VerticalSeparator VerticalSlider VerticalTilde ViewAngle ViewCenter ViewMatrix ViewPoint ViewPointSelectorSettings ViewPort ViewRange ViewVector ViewVertical VirtualGroupData Visible VisibleCell VoigtDistribution VonMisesDistribution ' +
	      'WaitAll WaitAsynchronousTask WaitNext WaitUntil WakebyDistribution WalleniusHypergeometricDistribution WaringYuleDistribution WatershedComponents WatsonUSquareTest WattsStrogatzGraphDistribution WaveletBestBasis WaveletFilterCoefficients WaveletImagePlot WaveletListPlot WaveletMapIndexed WaveletMatrixPlot WaveletPhi WaveletPsi WaveletScale WaveletScalogram WaveletThreshold WeaklyConnectedComponents WeaklyConnectedGraphQ WeakStationarity WeatherData WeberE Wedge Wednesday WeibullDistribution WeierstrassHalfPeriods WeierstrassInvariants WeierstrassP WeierstrassPPrime WeierstrassSigma WeierstrassZeta WeightedAdjacencyGraph WeightedAdjacencyMatrix WeightedData WeightedGraphQ Weights WelchWindow WheelGraph WhenEvent Which While White Whitespace WhitespaceCharacter WhittakerM WhittakerW WienerFilter WienerProcess WignerD WignerSemicircleDistribution WilksW WilksWTest WindowClickSelect WindowElements WindowFloating WindowFrame WindowFrameElements WindowMargins WindowMovable WindowOpacity WindowSelected WindowSize WindowStatusArea WindowTitle WindowToolbars WindowWidth With WolframAlpha WolframAlphaDate WolframAlphaQuantity WolframAlphaResult Word WordBoundary WordCharacter WordData WordSearch WordSeparators WorkingPrecision Write WriteString Wronskian ' +
	      'XMLElement XMLObject Xnor Xor ' +
	      'Yellow YuleDissimilarity ' +
	      'ZernikeR ZeroSymmetric ZeroTest ZeroWidthTimes Zeta ZetaZero ZipfDistribution ZTest ZTransform ' +
	      '$Aborted $ActivationGroupID $ActivationKey $ActivationUserRegistered $AddOnsDirectory $AssertFunction $Assumptions $AsynchronousTask $BaseDirectory $BatchInput $BatchOutput $BoxForms $ByteOrdering $Canceled $CharacterEncoding $CharacterEncodings $CommandLine $CompilationTarget $ConditionHold $ConfiguredKernels $Context $ContextPath $ControlActiveSetting $CreationDate $CurrentLink $DateStringFormat $DefaultFont $DefaultFrontEnd $DefaultImagingDevice $DefaultPath $Display $DisplayFunction $DistributedContexts $DynamicEvaluation $Echo $Epilog $ExportFormats $Failed $FinancialDataSource $FormatType $FrontEnd $FrontEndSession $GeoLocation $HistoryLength $HomeDirectory $HTTPCookies $IgnoreEOF $ImagingDevices $ImportFormats $InitialDirectory $Input $InputFileName $InputStreamMethods $Inspector $InstallationDate $InstallationDirectory $InterfaceEnvironment $IterationLimit $KernelCount $KernelID $Language $LaunchDirectory $LibraryPath $LicenseExpirationDate $LicenseID $LicenseProcesses $LicenseServer $LicenseSubprocesses $LicenseType $Line $Linked $LinkSupported $LoadedFiles $MachineAddresses $MachineDomain $MachineDomains $MachineEpsilon $MachineID $MachineName $MachinePrecision $MachineType $MaxExtraPrecision $MaxLicenseProcesses $MaxLicenseSubprocesses $MaxMachineNumber $MaxNumber $MaxPiecewiseCases $MaxPrecision $MaxRootDegree $MessageGroups $MessageList $MessagePrePrint $Messages $MinMachineNumber $MinNumber $MinorReleaseNumber $MinPrecision $ModuleNumber $NetworkLicense $NewMessage $NewSymbol $Notebooks $NumberMarks $Off $OperatingSystem $Output $OutputForms $OutputSizeLimit $OutputStreamMethods $Packages $ParentLink $ParentProcessID $PasswordFile $PatchLevelID $Path $PathnameSeparator $PerformanceGoal $PipeSupported $Post $Pre $PreferencesDirectory $PrePrint $PreRead $PrintForms $PrintLiteral $ProcessID $ProcessorCount $ProcessorType $ProductInformation $ProgramName $RandomState $RecursionLimit $ReleaseNumber $RootDirectory $ScheduledTask $ScriptCommandLine $SessionID $SetParentLink $SharedFunctions $SharedVariables $SoundDisplay $SoundDisplayFunction $SuppressInputFormHeads $SynchronousEvaluation $SyntaxHandler $System $SystemCharacterEncoding $SystemID $SystemWordLength $TemporaryDirectory $TemporaryPrefix $TextStyle $TimedOut $TimeUnit $TimeZone $TopDirectory $TraceOff $TraceOn $TracePattern $TracePostAction $TracePreAction $Urgent $UserAddOnsDirectory $UserBaseDirectory $UserDocumentsDirectory $UserName $Version $VersionNumber',
	    contains: [
	      {
	        className: "comment",
	        begin: /\(\*/, end: /\*\)/
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'list',
	        begin: /\{/, end: /\}/,
	        illegal: /:/
	      }
	    ]
	  };
	};

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMON_CONTAINS = [
	    hljs.C_NUMBER_MODE,
	    {
	      className: 'string',
	      begin: '\'', end: '\'',
	      contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}]
	    }
	  ];
	  var TRANSPOSE = {
	    relevance: 0,
	    contains: [
	      {
	        className: 'operator', begin: /'['\.]*/
	      }
	    ]
	  };

	  return {
	    keywords: {
	      keyword:
	        'break case catch classdef continue else elseif end enumerated events for function ' +
	        'global if methods otherwise parfor persistent properties return spmd switch try while',
	      built_in:
	        'sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan ' +
	        'atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot ' +
	        'cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog ' +
	        'realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal ' +
	        'cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli ' +
	        'besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma ' +
	        'gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms ' +
	        'nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones ' +
	        'eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length ' +
	        'ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril ' +
	        'triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute ' +
	        'shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i inf nan ' +
	        'isnan isinf isfinite j why compan gallery hadamard hankel hilb invhilb magic pascal ' +
	        'rosser toeplitz vander wilkinson'
	    },
	    illegal: '(//|"|#|/\\*|\\s+/\\w+)',
	    contains: [
	      {
	        className: 'function',
	        beginKeywords: 'function', end: '$',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	              className: 'params',
	              begin: '\\(', end: '\\)'
	          },
	          {
	              className: 'params',
	              begin: '\\[', end: '\\]'
	          }
	        ]
	      },
	      {
	        begin: /[a-zA-Z_][a-zA-Z_0-9]*'['\.]*/,
	        returnBegin: true,
	        relevance: 0,
	        contains: [
	          {begin: /[a-zA-Z_][a-zA-Z_0-9]*/, relevance: 0},
	          TRANSPOSE.contains[0]
	        ]
	      },
	      {
	        className: 'matrix',
	        begin: '\\[', end: '\\]',
	        contains: COMMON_CONTAINS,
	        relevance: 0,
	        starts: TRANSPOSE
	      },
	      {
	        className: 'cell',
	        begin: '\\{', end: /}/,
	        contains: COMMON_CONTAINS,
	        relevance: 0,
	        starts: TRANSPOSE
	      },
	      {
	        // transpose operators at the end of a function call
	        begin: /\)/,
	        relevance: 0,
	        starts: TRANSPOSE
	      },
	      hljs.COMMENT('^\\s*\\%\\{\\s*$', '^\\s*\\%\\}\\s*$'),
	      hljs.COMMENT('\\%', '$')
	    ].concat(COMMON_CONTAINS)
	  };
	};

/***/ },
/* 115 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords:
	      'int float string vector matrix if else switch case default while do for in break ' +
	      'continue global proc return about abs addAttr addAttributeEditorNodeHelp addDynamic ' +
	      'addNewShelfTab addPP addPanelCategory addPrefixToName advanceToNextDrivenKey ' +
	      'affectedNet affects aimConstraint air alias aliasAttr align alignCtx alignCurve ' +
	      'alignSurface allViewFit ambientLight angle angleBetween animCone animCurveEditor ' +
	      'animDisplay animView annotate appendStringArray applicationName applyAttrPreset ' +
	      'applyTake arcLenDimContext arcLengthDimension arclen arrayMapper art3dPaintCtx ' +
	      'artAttrCtx artAttrPaintVertexCtx artAttrSkinPaintCtx artAttrTool artBuildPaintMenu ' +
	      'artFluidAttrCtx artPuttyCtx artSelectCtx artSetPaintCtx artUserPaintCtx assignCommand ' +
	      'assignInputDevice assignViewportFactories attachCurve attachDeviceAttr attachSurface ' +
	      'attrColorSliderGrp attrCompatibility attrControlGrp attrEnumOptionMenu ' +
	      'attrEnumOptionMenuGrp attrFieldGrp attrFieldSliderGrp attrNavigationControlGrp ' +
	      'attrPresetEditWin attributeExists attributeInfo attributeMenu attributeQuery ' +
	      'autoKeyframe autoPlace bakeClip bakeFluidShading bakePartialHistory bakeResults ' +
	      'bakeSimulation basename basenameEx batchRender bessel bevel bevelPlus binMembership ' +
	      'bindSkin blend2 blendShape blendShapeEditor blendShapePanel blendTwoAttr blindDataType ' +
	      'boneLattice boundary boxDollyCtx boxZoomCtx bufferCurve buildBookmarkMenu ' +
	      'buildKeyframeMenu button buttonManip CBG cacheFile cacheFileCombine cacheFileMerge ' +
	      'cacheFileTrack camera cameraView canCreateManip canvas capitalizeString catch ' +
	      'catchQuiet ceil changeSubdivComponentDisplayLevel changeSubdivRegion channelBox ' +
	      'character characterMap characterOutlineEditor characterize chdir checkBox checkBoxGrp ' +
	      'checkDefaultRenderGlobals choice circle circularFillet clamp clear clearCache clip ' +
	      'clipEditor clipEditorCurrentTimeCtx clipSchedule clipSchedulerOutliner clipTrimBefore ' +
	      'closeCurve closeSurface cluster cmdFileOutput cmdScrollFieldExecuter ' +
	      'cmdScrollFieldReporter cmdShell coarsenSubdivSelectionList collision color ' +
	      'colorAtPoint colorEditor colorIndex colorIndexSliderGrp colorSliderButtonGrp ' +
	      'colorSliderGrp columnLayout commandEcho commandLine commandPort compactHairSystem ' +
	      'componentEditor compositingInterop computePolysetVolume condition cone confirmDialog ' +
	      'connectAttr connectControl connectDynamic connectJoint connectionInfo constrain ' +
	      'constrainValue constructionHistory container containsMultibyte contextInfo control ' +
	      'convertFromOldLayers convertIffToPsd convertLightmap convertSolidTx convertTessellation ' +
	      'convertUnit copyArray copyFlexor copyKey copySkinWeights cos cpButton cpCache ' +
	      'cpClothSet cpCollision cpConstraint cpConvClothToMesh cpForces cpGetSolverAttr cpPanel ' +
	      'cpProperty cpRigidCollisionFilter cpSeam cpSetEdit cpSetSolverAttr cpSolver ' +
	      'cpSolverTypes cpTool cpUpdateClothUVs createDisplayLayer createDrawCtx createEditor ' +
	      'createLayeredPsdFile createMotionField createNewShelf createNode createRenderLayer ' +
	      'createSubdivRegion cross crossProduct ctxAbort ctxCompletion ctxEditMode ctxTraverse ' +
	      'currentCtx currentTime currentTimeCtx currentUnit curve curveAddPtCtx ' +
	      'curveCVCtx curveEPCtx curveEditorCtx curveIntersect curveMoveEPCtx curveOnSurface ' +
	      'curveSketchCtx cutKey cycleCheck cylinder dagPose date defaultLightListCheckBox ' +
	      'defaultNavigation defineDataServer defineVirtualDevice deformer deg_to_rad delete ' +
	      'deleteAttr deleteShadingGroupsAndMaterials deleteShelfTab deleteUI deleteUnusedBrushes ' +
	      'delrandstr detachCurve detachDeviceAttr detachSurface deviceEditor devicePanel dgInfo ' +
	      'dgdirty dgeval dgtimer dimWhen directKeyCtx directionalLight dirmap dirname disable ' +
	      'disconnectAttr disconnectJoint diskCache displacementToPoly displayAffected ' +
	      'displayColor displayCull displayLevelOfDetail displayPref displayRGBColor ' +
	      'displaySmoothness displayStats displayString displaySurface distanceDimContext ' +
	      'distanceDimension doBlur dolly dollyCtx dopeSheetEditor dot dotProduct ' +
	      'doubleProfileBirailSurface drag dragAttrContext draggerContext dropoffLocator ' +
	      'duplicate duplicateCurve duplicateSurface dynCache dynControl dynExport dynExpression ' +
	      'dynGlobals dynPaintEditor dynParticleCtx dynPref dynRelEdPanel dynRelEditor ' +
	      'dynamicLoad editAttrLimits editDisplayLayerGlobals editDisplayLayerMembers ' +
	      'editRenderLayerAdjustment editRenderLayerGlobals editRenderLayerMembers editor ' +
	      'editorTemplate effector emit emitter enableDevice encodeString endString endsWith env ' +
	      'equivalent equivalentTol erf error eval evalDeferred evalEcho event ' +
	      'exactWorldBoundingBox exclusiveLightCheckBox exec executeForEachObject exists exp ' +
	      'expression expressionEditorListen extendCurve extendSurface extrude fcheck fclose feof ' +
	      'fflush fgetline fgetword file fileBrowserDialog fileDialog fileExtension fileInfo ' +
	      'filetest filletCurve filter filterCurve filterExpand filterStudioImport ' +
	      'findAllIntersections findAnimCurves findKeyframe findMenuItem findRelatedSkinCluster ' +
	      'finder firstParentOf fitBspline flexor floatEq floatField floatFieldGrp floatScrollBar ' +
	      'floatSlider floatSlider2 floatSliderButtonGrp floatSliderGrp floor flow fluidCacheInfo ' +
	      'fluidEmitter fluidVoxelInfo flushUndo fmod fontDialog fopen formLayout format fprint ' +
	      'frameLayout fread freeFormFillet frewind fromNativePath fwrite gamma gauss ' +
	      'geometryConstraint getApplicationVersionAsFloat getAttr getClassification ' +
	      'getDefaultBrush getFileList getFluidAttr getInputDeviceRange getMayaPanelTypes ' +
	      'getModifiers getPanel getParticleAttr getPluginResource getenv getpid glRender ' +
	      'glRenderEditor globalStitch gmatch goal gotoBindPose grabColor gradientControl ' +
	      'gradientControlNoAttr graphDollyCtx graphSelectContext graphTrackCtx gravity grid ' +
	      'gridLayout group groupObjectsByName HfAddAttractorToAS HfAssignAS HfBuildEqualMap ' +
	      'HfBuildFurFiles HfBuildFurImages HfCancelAFR HfConnectASToHF HfCreateAttractor ' +
	      'HfDeleteAS HfEditAS HfPerformCreateAS HfRemoveAttractorFromAS HfSelectAttached ' +
	      'HfSelectAttractors HfUnAssignAS hardenPointCurve hardware hardwareRenderPanel ' +
	      'headsUpDisplay headsUpMessage help helpLine hermite hide hilite hitTest hotBox hotkey ' +
	      'hotkeyCheck hsv_to_rgb hudButton hudSlider hudSliderButton hwReflectionMap hwRender ' +
	      'hwRenderLoad hyperGraph hyperPanel hyperShade hypot iconTextButton iconTextCheckBox ' +
	      'iconTextRadioButton iconTextRadioCollection iconTextScrollList iconTextStaticLabel ' +
	      'ikHandle ikHandleCtx ikHandleDisplayScale ikSolver ikSplineHandleCtx ikSystem ' +
	      'ikSystemInfo ikfkDisplayMethod illustratorCurves image imfPlugins inheritTransform ' +
	      'insertJoint insertJointCtx insertKeyCtx insertKnotCurve insertKnotSurface instance ' +
	      'instanceable instancer intField intFieldGrp intScrollBar intSlider intSliderGrp ' +
	      'interToUI internalVar intersect iprEngine isAnimCurve isConnected isDirty isParentOf ' +
	      'isSameObject isTrue isValidObjectName isValidString isValidUiName isolateSelect ' +
	      'itemFilter itemFilterAttr itemFilterRender itemFilterType joint jointCluster jointCtx ' +
	      'jointDisplayScale jointLattice keyTangent keyframe keyframeOutliner ' +
	      'keyframeRegionCurrentTimeCtx keyframeRegionDirectKeyCtx keyframeRegionDollyCtx ' +
	      'keyframeRegionInsertKeyCtx keyframeRegionMoveKeyCtx keyframeRegionScaleKeyCtx ' +
	      'keyframeRegionSelectKeyCtx keyframeRegionSetKeyCtx keyframeRegionTrackCtx ' +
	      'keyframeStats lassoContext lattice latticeDeformKeyCtx launch launchImageEditor ' +
	      'layerButton layeredShaderPort layeredTexturePort layout layoutDialog lightList ' +
	      'lightListEditor lightListPanel lightlink lineIntersection linearPrecision linstep ' +
	      'listAnimatable listAttr listCameras listConnections listDeviceAttachments listHistory ' +
	      'listInputDeviceAxes listInputDeviceButtons listInputDevices listMenuAnnotation ' +
	      'listNodeTypes listPanelCategories listRelatives listSets listTransforms ' +
	      'listUnselected listerEditor loadFluid loadNewShelf loadPlugin ' +
	      'loadPluginLanguageResources loadPrefObjects localizedPanelLabel lockNode loft log ' +
	      'longNameOf lookThru ls lsThroughFilter lsType lsUI Mayatomr mag makeIdentity makeLive ' +
	      'makePaintable makeRoll makeSingleSurface makeTubeOn makebot manipMoveContext ' +
	      'manipMoveLimitsCtx manipOptions manipRotateContext manipRotateLimitsCtx ' +
	      'manipScaleContext manipScaleLimitsCtx marker match max memory menu menuBarLayout ' +
	      'menuEditor menuItem menuItemToShelf menuSet menuSetPref messageLine min minimizeApp ' +
	      'mirrorJoint modelCurrentTimeCtx modelEditor modelPanel mouse movIn movOut move ' +
	      'moveIKtoFK moveKeyCtx moveVertexAlongDirection multiProfileBirailSurface mute ' +
	      'nParticle nameCommand nameField namespace namespaceInfo newPanelItems newton nodeCast ' +
	      'nodeIconButton nodeOutliner nodePreset nodeType noise nonLinear normalConstraint ' +
	      'normalize nurbsBoolean nurbsCopyUVSet nurbsCube nurbsEditUV nurbsPlane nurbsSelect ' +
	      'nurbsSquare nurbsToPoly nurbsToPolygonsPref nurbsToSubdiv nurbsToSubdivPref ' +
	      'nurbsUVSet nurbsViewDirectionVector objExists objectCenter objectLayer objectType ' +
	      'objectTypeUI obsoleteProc oceanNurbsPreviewPlane offsetCurve offsetCurveOnSurface ' +
	      'offsetSurface openGLExtension openMayaPref optionMenu optionMenuGrp optionVar orbit ' +
	      'orbitCtx orientConstraint outlinerEditor outlinerPanel overrideModifier ' +
	      'paintEffectsDisplay pairBlend palettePort paneLayout panel panelConfiguration ' +
	      'panelHistory paramDimContext paramDimension paramLocator parent parentConstraint ' +
	      'particle particleExists particleInstancer particleRenderInfo partition pasteKey ' +
	      'pathAnimation pause pclose percent performanceOptions pfxstrokes pickWalk picture ' +
	      'pixelMove planarSrf plane play playbackOptions playblast plugAttr plugNode pluginInfo ' +
	      'pluginResourceUtil pointConstraint pointCurveConstraint pointLight pointMatrixMult ' +
	      'pointOnCurve pointOnSurface pointPosition poleVectorConstraint polyAppend ' +
	      'polyAppendFacetCtx polyAppendVertex polyAutoProjection polyAverageNormal ' +
	      'polyAverageVertex polyBevel polyBlendColor polyBlindData polyBoolOp polyBridgeEdge ' +
	      'polyCacheMonitor polyCheck polyChipOff polyClipboard polyCloseBorder polyCollapseEdge ' +
	      'polyCollapseFacet polyColorBlindData polyColorDel polyColorPerVertex polyColorSet ' +
	      'polyCompare polyCone polyCopyUV polyCrease polyCreaseCtx polyCreateFacet ' +
	      'polyCreateFacetCtx polyCube polyCut polyCutCtx polyCylinder polyCylindricalProjection ' +
	      'polyDelEdge polyDelFacet polyDelVertex polyDuplicateAndConnect polyDuplicateEdge ' +
	      'polyEditUV polyEditUVShell polyEvaluate polyExtrudeEdge polyExtrudeFacet ' +
	      'polyExtrudeVertex polyFlipEdge polyFlipUV polyForceUV polyGeoSampler polyHelix ' +
	      'polyInfo polyInstallAction polyLayoutUV polyListComponentConversion polyMapCut ' +
	      'polyMapDel polyMapSew polyMapSewMove polyMergeEdge polyMergeEdgeCtx polyMergeFacet ' +
	      'polyMergeFacetCtx polyMergeUV polyMergeVertex polyMirrorFace polyMoveEdge ' +
	      'polyMoveFacet polyMoveFacetUV polyMoveUV polyMoveVertex polyNormal polyNormalPerVertex ' +
	      'polyNormalizeUV polyOptUvs polyOptions polyOutput polyPipe polyPlanarProjection ' +
	      'polyPlane polyPlatonicSolid polyPoke polyPrimitive polyPrism polyProjection ' +
	      'polyPyramid polyQuad polyQueryBlindData polyReduce polySelect polySelectConstraint ' +
	      'polySelectConstraintMonitor polySelectCtx polySelectEditCtx polySeparate ' +
	      'polySetToFaceNormal polySewEdge polyShortestPathCtx polySmooth polySoftEdge ' +
	      'polySphere polySphericalProjection polySplit polySplitCtx polySplitEdge polySplitRing ' +
	      'polySplitVertex polyStraightenUVBorder polySubdivideEdge polySubdivideFacet ' +
	      'polyToSubdiv polyTorus polyTransfer polyTriangulate polyUVSet polyUnite polyWedgeFace ' +
	      'popen popupMenu pose pow preloadRefEd print progressBar progressWindow projFileViewer ' +
	      'projectCurve projectTangent projectionContext projectionManip promptDialog propModCtx ' +
	      'propMove psdChannelOutliner psdEditTextureFile psdExport psdTextureFile putenv pwd ' +
	      'python querySubdiv quit rad_to_deg radial radioButton radioButtonGrp radioCollection ' +
	      'radioMenuItemCollection rampColorPort rand randomizeFollicles randstate rangeControl ' +
	      'readTake rebuildCurve rebuildSurface recordAttr recordDevice redo reference ' +
	      'referenceEdit referenceQuery refineSubdivSelectionList refresh refreshAE ' +
	      'registerPluginResource rehash reloadImage removeJoint removeMultiInstance ' +
	      'removePanelCategory rename renameAttr renameSelectionList renameUI render ' +
	      'renderGlobalsNode renderInfo renderLayerButton renderLayerParent ' +
	      'renderLayerPostProcess renderLayerUnparent renderManip renderPartition ' +
	      'renderQualityNode renderSettings renderThumbnailUpdate renderWindowEditor ' +
	      'renderWindowSelectContext renderer reorder reorderDeformers requires reroot ' +
	      'resampleFluid resetAE resetPfxToPolyCamera resetTool resolutionNode retarget ' +
	      'reverseCurve reverseSurface revolve rgb_to_hsv rigidBody rigidSolver roll rollCtx ' +
	      'rootOf rot rotate rotationInterpolation roundConstantRadius rowColumnLayout rowLayout ' +
	      'runTimeCommand runup sampleImage saveAllShelves saveAttrPreset saveFluid saveImage ' +
	      'saveInitialState saveMenu savePrefObjects savePrefs saveShelf saveToolSettings scale ' +
	      'scaleBrushBrightness scaleComponents scaleConstraint scaleKey scaleKeyCtx sceneEditor ' +
	      'sceneUIReplacement scmh scriptCtx scriptEditorInfo scriptJob scriptNode scriptTable ' +
	      'scriptToShelf scriptedPanel scriptedPanelType scrollField scrollLayout sculpt ' +
	      'searchPathArray seed selLoadSettings select selectContext selectCurveCV selectKey ' +
	      'selectKeyCtx selectKeyframeRegionCtx selectMode selectPref selectPriority selectType ' +
	      'selectedNodes selectionConnection separator setAttr setAttrEnumResource ' +
	      'setAttrMapping setAttrNiceNameResource setConstraintRestPosition ' +
	      'setDefaultShadingGroup setDrivenKeyframe setDynamic setEditCtx setEditor setFluidAttr ' +
	      'setFocus setInfinity setInputDeviceMapping setKeyCtx setKeyPath setKeyframe ' +
	      'setKeyframeBlendshapeTargetWts setMenuMode setNodeNiceNameResource setNodeTypeFlag ' +
	      'setParent setParticleAttr setPfxToPolyCamera setPluginResource setProject ' +
	      'setStampDensity setStartupMessage setState setToolTo setUITemplate setXformManip sets ' +
	      'shadingConnection shadingGeometryRelCtx shadingLightRelCtx shadingNetworkCompare ' +
	      'shadingNode shapeCompare shelfButton shelfLayout shelfTabLayout shellField ' +
	      'shortNameOf showHelp showHidden showManipCtx showSelectionInTitle ' +
	      'showShadingGroupAttrEditor showWindow sign simplify sin singleProfileBirailSurface ' +
	      'size sizeBytes skinCluster skinPercent smoothCurve smoothTangentSurface smoothstep ' +
	      'snap2to2 snapKey snapMode snapTogetherCtx snapshot soft softMod softModCtx sort sound ' +
	      'soundControl source spaceLocator sphere sphrand spotLight spotLightPreviewPort ' +
	      'spreadSheetEditor spring sqrt squareSurface srtContext stackTrace startString ' +
	      'startsWith stitchAndExplodeShell stitchSurface stitchSurfacePoints strcmp ' +
	      'stringArrayCatenate stringArrayContains stringArrayCount stringArrayInsertAtIndex ' +
	      'stringArrayIntersector stringArrayRemove stringArrayRemoveAtIndex ' +
	      'stringArrayRemoveDuplicates stringArrayRemoveExact stringArrayToString ' +
	      'stringToStringArray strip stripPrefixFromName stroke subdAutoProjection ' +
	      'subdCleanTopology subdCollapse subdDuplicateAndConnect subdEditUV ' +
	      'subdListComponentConversion subdMapCut subdMapSewMove subdMatchTopology subdMirror ' +
	      'subdToBlind subdToPoly subdTransferUVsToCache subdiv subdivCrease ' +
	      'subdivDisplaySmoothness substitute substituteAllString substituteGeometry substring ' +
	      'surface surfaceSampler surfaceShaderList swatchDisplayPort switchTable symbolButton ' +
	      'symbolCheckBox sysFile system tabLayout tan tangentConstraint texLatticeDeformContext ' +
	      'texManipContext texMoveContext texMoveUVShellContext texRotateContext texScaleContext ' +
	      'texSelectContext texSelectShortestPathCtx texSmudgeUVContext texWinToolCtx text ' +
	      'textCurves textField textFieldButtonGrp textFieldGrp textManip textScrollList ' +
	      'textToShelf textureDisplacePlane textureHairColor texturePlacementContext ' +
	      'textureWindow threadCount threePointArcCtx timeControl timePort timerX toNativePath ' +
	      'toggle toggleAxis toggleWindowVisibility tokenize tokenizeList tolerance tolower ' +
	      'toolButton toolCollection toolDropped toolHasOptions toolPropertyWindow torus toupper ' +
	      'trace track trackCtx transferAttributes transformCompare transformLimits translator ' +
	      'trim trunc truncateFluidCache truncateHairCache tumble tumbleCtx turbulence ' +
	      'twoPointArcCtx uiRes uiTemplate unassignInputDevice undo undoInfo ungroup uniform unit ' +
	      'unloadPlugin untangleUV untitledFileName untrim upAxis updateAE userCtx uvLink ' +
	      'uvSnapshot validateShelfName vectorize view2dToolCtx viewCamera viewClipPlane ' +
	      'viewFit viewHeadOn viewLookAt viewManip viewPlace viewSet visor volumeAxis vortex ' +
	      'waitCursor warning webBrowser webBrowserPrefs whatIs window windowPref wire ' +
	      'wireContext workspace wrinkle wrinkleContext writeTake xbmLangPathList xform',
	    illegal: '</',
	    contains: [
	      hljs.C_NUMBER_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: '`', end: '`',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      },
	      {
	        className: 'variable',
	        variants: [
	          {begin: '\\$\\d'},
	          {begin: '[\\$\\%\\@](\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)'},
	          {begin: '\\*(\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)', relevance: 0}
	        ]
	      },
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE
	    ]
	  };
	};

/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS = {
	    keyword:
	      'module use_module import_module include_module end_module initialise ' +
	      'mutable initialize finalize finalise interface implementation pred ' +
	      'mode func type inst solver any_pred any_func is semidet det nondet ' +
	      'multi erroneous failure cc_nondet cc_multi typeclass instance where ' +
	      'pragma promise external trace atomic or_else require_complete_switch ' +
	      'require_det require_semidet require_multi require_nondet ' +
	      'require_cc_multi require_cc_nondet require_erroneous require_failure',
	    pragma:
	      'inline no_inline type_spec source_file fact_table obsolete memo ' +
	      'loop_check minimal_model terminates does_not_terminate ' +
	      'check_termination promise_equivalent_clauses',
	    preprocessor:
	      'foreign_proc foreign_decl foreign_code foreign_type ' +
	      'foreign_import_module foreign_export_enum foreign_export ' +
	      'foreign_enum may_call_mercury will_not_call_mercury thread_safe ' +
	      'not_thread_safe maybe_thread_safe promise_pure promise_semipure ' +
	      'tabled_for_io local untrailed trailed attach_to_io_state ' +
	      'can_pass_as_mercury_type stable will_not_throw_exception ' +
	      'may_modify_trail will_not_modify_trail may_duplicate ' +
	      'may_not_duplicate affects_liveness does_not_affect_liveness ' +
	      'doesnt_affect_liveness no_sharing unknown_sharing sharing',
	    built_in:
	      'some all not if then else true fail false try catch catch_any ' +
	      'semidet_true semidet_false semidet_fail impure_true impure semipure'
	  };

	  var TODO = {
	    className: 'label',
	    begin: 'XXX', end: '$', endsWithParent: true,
	    relevance: 0
	  };
	  var COMMENT = hljs.inherit(hljs.C_LINE_COMMENT_MODE, {begin: '%'});
	  var CCOMMENT = hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, {relevance: 0});
	  COMMENT.contains.push(TODO);
	  CCOMMENT.contains.push(TODO);

	  var NUMCODE = {
	    className: 'number',
	    begin: "0'.\\|0[box][0-9a-fA-F]*"
	  };

	  var ATOM = hljs.inherit(hljs.APOS_STRING_MODE, {relevance: 0});
	  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {relevance: 0});
	  var STRING_FMT = {
	    className: 'constant',
	    begin: '\\\\[abfnrtv]\\|\\\\x[0-9a-fA-F]*\\\\\\|%[-+# *.0-9]*[dioxXucsfeEgGp]',
	    relevance: 0
	  };
	  STRING.contains.push(STRING_FMT);

	  var IMPLICATION = {
	    className: 'built_in',
	    variants: [
	      {begin: '<=>'},
	      {begin: '<=', relevance: 0},
	      {begin: '=>', relevance: 0},
	      {begin: '/\\\\'},
	      {begin: '\\\\/'}
	    ]
	  };

	  var HEAD_BODY_CONJUNCTION = {
	    className: 'built_in',
	    variants: [
	      {begin: ':-\\|-->'},
	      {begin: '=', relevance: 0}
	    ]
	  };

	  return {
	    aliases: ['m', 'moo'],
	    keywords: KEYWORDS,
	    contains: [
	      IMPLICATION,
	      HEAD_BODY_CONJUNCTION,
	      COMMENT,
	      CCOMMENT,
	      NUMCODE,
	      hljs.NUMBER_MODE,
	      ATOM,
	      STRING,
	      {begin: /:-/} // relevance booster
	    ]
	  };
	};

/***/ },
/* 117 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords:
	      'environ vocabularies notations constructors definitions ' +
	      'registrations theorems schemes requirements begin end definition ' +
	      'registration cluster existence pred func defpred deffunc theorem ' +
	      'proof let take assume then thus hence ex for st holds consider ' +
	      'reconsider such that and in provided of as from be being by means ' +
	      'equals implies iff redefine define now not or attr is mode ' +
	      'suppose per cases set thesis contradiction scheme reserve struct ' +
	      'correctness compatibility coherence symmetry assymetry ' +
	      'reflexivity irreflexivity connectedness uniqueness commutativity ' +
	      'idempotence involutiveness projectivity',
	    contains: [
	      hljs.COMMENT('::', '$')
	    ]
	  };
	};

/***/ },
/* 118 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var PERL_KEYWORDS = 'getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ' +
	    'ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime ' +
	    'readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq' +
	    'fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent ' +
	    'shutdown dump chomp connect getsockname die socketpair close flock exists index shmget' +
	    'sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr ' +
	    'unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 ' +
	    'getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline ' +
	    'endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand ' +
	    'mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink ' +
	    'getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr ' +
	    'untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link ' +
	    'getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller ' +
	    'lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and ' +
	    'sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 ' +
	    'chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach ' +
	    'tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir' +
	    'ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe ' +
	    'atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when';
	  var SUBST = {
	    className: 'subst',
	    begin: '[$@]\\{', end: '\\}',
	    keywords: PERL_KEYWORDS
	  };
	  var METHOD = {
	    begin: '->{', end: '}'
	    // contains defined later
	  };
	  var VAR = {
	    className: 'variable',
	    variants: [
	      {begin: /\$\d/},
	      {begin: /[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/},
	      {begin: /[\$%@][^\s\w{]/, relevance: 0}
	    ]
	  };
	  var STRING_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST, VAR];
	  var PERL_DEFAULT_CONTAINS = [
	    VAR,
	    hljs.HASH_COMMENT_MODE,
	    hljs.COMMENT(
	      '^\\=\\w',
	      '\\=cut',
	      {
	        endsWithParent: true
	      }
	    ),
	    METHOD,
	    {
	      className: 'string',
	      contains: STRING_CONTAINS,
	      variants: [
	        {
	          begin: 'q[qwxr]?\\s*\\(', end: '\\)',
	          relevance: 5
	        },
	        {
	          begin: 'q[qwxr]?\\s*\\[', end: '\\]',
	          relevance: 5
	        },
	        {
	          begin: 'q[qwxr]?\\s*\\{', end: '\\}',
	          relevance: 5
	        },
	        {
	          begin: 'q[qwxr]?\\s*\\|', end: '\\|',
	          relevance: 5
	        },
	        {
	          begin: 'q[qwxr]?\\s*\\<', end: '\\>',
	          relevance: 5
	        },
	        {
	          begin: 'qw\\s+q', end: 'q',
	          relevance: 5
	        },
	        {
	          begin: '\'', end: '\'',
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: '"', end: '"'
	        },
	        {
	          begin: '`', end: '`',
	          contains: [hljs.BACKSLASH_ESCAPE]
	        },
	        {
	          begin: '{\\w+}',
	          contains: [],
	          relevance: 0
	        },
	        {
	          begin: '\-?\\w+\\s*\\=\\>',
	          contains: [],
	          relevance: 0
	        }
	      ]
	    },
	    {
	      className: 'number',
	      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	      relevance: 0
	    },
	    { // regexp container
	      begin: '(\\/\\/|' + hljs.RE_STARTERS_RE + '|\\b(split|return|print|reverse|grep)\\b)\\s*',
	      keywords: 'split return print reverse grep',
	      relevance: 0,
	      contains: [
	        hljs.HASH_COMMENT_MODE,
	        {
	          className: 'regexp',
	          begin: '(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*',
	          relevance: 10
	        },
	        {
	          className: 'regexp',
	          begin: '(m|qr)?/', end: '/[a-z]*',
	          contains: [hljs.BACKSLASH_ESCAPE],
	          relevance: 0 // allows empty "//" which is a common comment delimiter in other languages
	        }
	      ]
	    },
	    {
	      className: 'sub',
	      beginKeywords: 'sub', end: '(\\s*\\(.*?\\))?[;{]',
	      relevance: 5
	    },
	    {
	      className: 'operator',
	      begin: '-\\w\\b',
	      relevance: 0
	    },
	    {
	      begin: "^__DATA__$",
	      end: "^__END__$",
	      subLanguage: 'mojolicious',
	      contains: [
	        {
	            begin: "^@@.*",
	            end: "$",
	            className: "comment"
	        }
	      ]
	    }
	  ];
	  SUBST.contains = PERL_DEFAULT_CONTAINS;
	  METHOD.contains = PERL_DEFAULT_CONTAINS;

	  return {
	    aliases: ['pl'],
	    keywords: PERL_KEYWORDS,
	    contains: PERL_DEFAULT_CONTAINS
	  };
	};

/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    subLanguage: 'xml',
	    contains: [
	      {
	        className: 'preprocessor',
	        begin: '^__(END|DATA)__$'
	      },
	    // mojolicious line
	      {
	        begin: "^\\s*%{1,2}={0,2}", end: '$',
	        subLanguage: 'perl'
	      },
	    // mojolicious block
	      {
	        begin: "<%{1,2}={0,2}",
	        end: "={0,1}%>",
	        subLanguage: 'perl',
	        excludeBegin: true,
	        excludeEnd: true
	      }
	    ]
	  };
	};

/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var NUMBER = {
	    className: 'number', relevance: 0,
	    variants: [
	      {
	        begin: '[$][a-fA-F0-9]+'
	      },
	      hljs.NUMBER_MODE
	    ]
	  };

	  return {
	    case_insensitive: true,
	    keywords: {
	      keyword: 'public private property continue exit extern new try catch ' +
	        'eachin not abstract final select case default const local global field ' +
	        'end if then else elseif endif while wend repeat until forever for to step next return module inline throw',

	      built_in: 'DebugLog DebugStop Error Print ACos ACosr ASin ASinr ATan ATan2 ATan2r ATanr Abs Abs Ceil ' +
	        'Clamp Clamp Cos Cosr Exp Floor Log Max Max Min Min Pow Sgn Sgn Sin Sinr Sqrt Tan Tanr Seed PI HALFPI TWOPI',

	      literal: 'true false null and or shl shr mod'
	    },
	    illegal: /\/\*/,
	    contains: [
	      hljs.COMMENT('#rem', '#end'),
	      hljs.COMMENT(
	        "'",
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      {
	        className: 'function',
	        beginKeywords: 'function method', end: '[(=:]|$',
	        illegal: /\n/,
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '$',
	        contains: [
	          {
	            beginKeywords: 'extends implements'
	          },
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        className: 'variable',
	        begin: '\\b(self|super)\\b'
	      },
	      {
	        className: 'preprocessor',
	        beginKeywords: 'import',
	        end: '$'
	      },
	      {
	        className: 'preprocessor',
	        begin: '\\s*#', end: '$',
	        keywords: 'if else elseif endif end then'
	      },
	      {
	        className: 'pi',
	        begin: '^\\s*strict\\b'
	      },
	      {
	        beginKeywords: 'alias', end: '=',
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      hljs.QUOTE_STRING_MODE,
	      NUMBER
	    ]
	  }
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VAR = {
	    className: 'variable',
	    variants: [
	      {begin: /\$\d+/},
	      {begin: /\$\{/, end: /}/},
	      {begin: '[\\$\\@]' + hljs.UNDERSCORE_IDENT_RE}
	    ]
	  };
	  var DEFAULT = {
	    endsWithParent: true,
	    lexemes: '[a-z/_]+',
	    keywords: {
	      built_in:
	        'on off yes no true false none blocked debug info notice warn error crit ' +
	        'select break last permanent redirect kqueue rtsig epoll poll /dev/poll'
	    },
	    relevance: 0,
	    illegal: '=>',
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        className: 'string',
	        contains: [hljs.BACKSLASH_ESCAPE, VAR],
	        variants: [
	          {begin: /"/, end: /"/},
	          {begin: /'/, end: /'/}
	        ]
	      },
	      {
	        className: 'url',
	        begin: '([a-z]+):/', end: '\\s', endsWithParent: true, excludeEnd: true,
	        contains: [VAR]
	      },
	      {
	        className: 'regexp',
	        contains: [hljs.BACKSLASH_ESCAPE, VAR],
	        variants: [
	          {begin: "\\s\\^", end: "\\s|{|;", returnEnd: true},
	          // regexp locations (~, ~*)
	          {begin: "~\\*?\\s+", end: "\\s|{|;", returnEnd: true},
	          // *.example.com
	          {begin: "\\*(\\.[a-z\\-]+)+"},
	          // sub.example.*
	          {begin: "([a-z\\-]+\\.)+\\*"}
	        ]
	      },
	      // IP
	      {
	        className: 'number',
	        begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
	      },
	      // units
	      {
	        className: 'number',
	        begin: '\\b\\d+[kKmMgGdshdwy]*\\b',
	        relevance: 0
	      },
	      VAR
	    ]
	  };

	  return {
	    aliases: ['nginxconf'],
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        begin: hljs.UNDERSCORE_IDENT_RE + '\\s', end: ';|{', returnBegin: true,
	        contains: [
	          {
	            className: 'title',
	            begin: hljs.UNDERSCORE_IDENT_RE,
	            starts: DEFAULT
	          }
	        ],
	        relevance: 0
	      }
	    ],
	    illegal: '[^\\s\\}]'
	  };
	};

/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['nim'],
	    keywords: {
	      keyword: 'addr and as asm bind block break|0 case|0 cast const|0 continue|0 converter discard distinct|10 div do elif else|0 end|0 enum|0 except export finally for from generic if|0 import|0 in include|0 interface is isnot|10 iterator|10 let|0 macro method|10 mixin mod nil not notin|10 object|0 of or out proc|10 ptr raise ref|10 return shl shr static template try|0 tuple type|0 using|0 var|0 when while|0 with without xor yield',
	      literal: 'shared guarded stdin stdout stderr result|10 true false'
	    },
	    contains: [ {
	        className: 'decorator', // Actually pragma
	        begin: /{\./,
	        end: /\.}/,
	        relevance: 10
	      }, {
	        className: 'string',
	        begin: /[a-zA-Z]\w*"/,
	        end: /"/,
	        contains: [{begin: /""/}]
	      }, {
	        className: 'string',
	        begin: /([a-zA-Z]\w*)?"""/,
	        end: /"""/
	      },
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'type',
	        begin: /\b[A-Z]\w+\b/,
	        relevance: 0
	      }, {
	        className: 'type',
	        begin: /\b(int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float|float32|float64|bool|char|string|cstring|pointer|expr|stmt|void|auto|any|range|array|openarray|varargs|seq|set|clong|culong|cchar|cschar|cshort|cint|csize|clonglong|cfloat|cdouble|clongdouble|cuchar|cushort|cuint|culonglong|cstringarray|semistatic)\b/
	      }, {
	        className: 'number',
	        begin: /\b(0[xX][0-9a-fA-F][_0-9a-fA-F]*)('?[iIuU](8|16|32|64))?/,
	        relevance: 0
	      }, {
	        className: 'number',
	        begin: /\b(0o[0-7][_0-7]*)('?[iIuUfF](8|16|32|64))?/,
	        relevance: 0
	      }, {
	        className: 'number',
	        begin: /\b(0(b|B)[01][_01]*)('?[iIuUfF](8|16|32|64))?/,
	        relevance: 0
	      }, {
	        className: 'number',
	        begin: /\b(\d[_\d]*)('?[iIuUfF](8|16|32|64))?/,
	        relevance: 0
	      },
	      hljs.HASH_COMMENT_MODE
	    ]
	  }
	};

/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var NIX_KEYWORDS = {
	    keyword: 'rec with let in inherit assert if else then',
	    constant: 'true false or and null',
	    built_in:
	      'import abort baseNameOf dirOf isNull builtins map removeAttrs throw toString derivation'
	  };
	  var ANTIQUOTE = {
	    className: 'subst',
	    begin: /\$\{/,
	    end: /}/,
	    keywords: NIX_KEYWORDS
	  };
	  var ATTRS = {
	    className: 'variable',
	    // TODO: we have to figure out a way how to exclude \s*=
	    begin: /[a-zA-Z0-9-_]+(\s*=)/,
	    relevance: 0
	  };
	  var SINGLE_QUOTE = {
	    className: 'string',
	    begin: "''",
	    end: "''",
	    contains: [
	      ANTIQUOTE
	    ]
	  };
	  var DOUBLE_QUOTE = {
	    className: 'string',
	    begin: '"',
	    end: '"',
	    contains: [
	      ANTIQUOTE
	    ]
	  };
	  var EXPRESSIONS = [
	    hljs.NUMBER_MODE,
	    hljs.HASH_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    SINGLE_QUOTE,
	    DOUBLE_QUOTE,
	    ATTRS
	  ];
	  ANTIQUOTE.contains = EXPRESSIONS;
	  return {
	    aliases: ["nixos"],
	    keywords: NIX_KEYWORDS,
	    contains: EXPRESSIONS
	  };
	};

/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var CONSTANTS = {
	    className: 'symbol',
	    begin: '\\$(ADMINTOOLS|APPDATA|CDBURN_AREA|CMDLINE|COMMONFILES32|COMMONFILES64|COMMONFILES|COOKIES|DESKTOP|DOCUMENTS|EXEDIR|EXEFILE|EXEPATH|FAVORITES|FONTS|HISTORY|HWNDPARENT|INSTDIR|INTERNET_CACHE|LANGUAGE|LOCALAPPDATA|MUSIC|NETHOOD|OUTDIR|PICTURES|PLUGINSDIR|PRINTHOOD|PROFILE|PROGRAMFILES32|PROGRAMFILES64|PROGRAMFILES|QUICKLAUNCH|RECENT|RESOURCES_LOCALIZED|RESOURCES|SENDTO|SMPROGRAMS|SMSTARTUP|STARTMENU|SYSDIR|TEMP|TEMPLATES|VIDEOS|WINDIR)'
	  };

	  var DEFINES = {
	    // ${defines}
	    className: 'constant',
	    begin: '\\$+{[a-zA-Z0-9_]+}'
	  };

	  var VARIABLES = {
	    // $variables
	    className: 'variable',
	    begin: '\\$+[a-zA-Z0-9_]+',
	    illegal: '\\(\\){}'
	  };

	  var LANGUAGES = {
	    // $(language_strings)
	    className: 'constant',
	    begin: '\\$+\\([a-zA-Z0-9_]+\\)'
	  };

	  var PARAMETERS = {
	    // command parameters
	    className: 'params',
	    begin: '(ARCHIVE|FILE_ATTRIBUTE_ARCHIVE|FILE_ATTRIBUTE_NORMAL|FILE_ATTRIBUTE_OFFLINE|FILE_ATTRIBUTE_READONLY|FILE_ATTRIBUTE_SYSTEM|FILE_ATTRIBUTE_TEMPORARY|HKCR|HKCU|HKDD|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_DYN_DATA|HKEY_LOCAL_MACHINE|HKEY_PERFORMANCE_DATA|HKEY_USERS|HKLM|HKPD|HKU|IDABORT|IDCANCEL|IDIGNORE|IDNO|IDOK|IDRETRY|IDYES|MB_ABORTRETRYIGNORE|MB_DEFBUTTON1|MB_DEFBUTTON2|MB_DEFBUTTON3|MB_DEFBUTTON4|MB_ICONEXCLAMATION|MB_ICONINFORMATION|MB_ICONQUESTION|MB_ICONSTOP|MB_OK|MB_OKCANCEL|MB_RETRYCANCEL|MB_RIGHT|MB_RTLREADING|MB_SETFOREGROUND|MB_TOPMOST|MB_USERICON|MB_YESNO|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SYSTEM|TEMPORARY)'
	  };

	  var COMPILER ={
	    // !compiler_flags
	    className: 'constant',
	    begin: '\\!(addincludedir|addplugindir|appendfile|cd|define|delfile|echo|else|endif|error|execute|finalize|getdllversionsystem|ifdef|ifmacrodef|ifmacrondef|ifndef|if|include|insertmacro|macroend|macro|makensis|packhdr|searchparse|searchreplace|tempfile|undef|verbose|warning)'
	  };

	  return {
	    case_insensitive: false,
	    keywords: {
	      keyword:
	      'Abort AddBrandingImage AddSize AllowRootDirInstall AllowSkipFiles AutoCloseWindow BGFont BGGradient BrandingText BringToFront Call CallInstDLL Caption ChangeUI CheckBitmap ClearErrors CompletedText ComponentText CopyFiles CRCCheck CreateDirectory CreateFont CreateShortCut Delete DeleteINISec DeleteINIStr DeleteRegKey DeleteRegValue DetailPrint DetailsButtonText DirText DirVar DirVerify EnableWindow EnumRegKey EnumRegValue Exch Exec ExecShell ExecWait ExpandEnvStrings File FileBufSize FileClose FileErrorText FileOpen FileRead FileReadByte FileReadUTF16LE FileReadWord FileSeek FileWrite FileWriteByte FileWriteUTF16LE FileWriteWord FindClose FindFirst FindNext FindWindow FlushINI FunctionEnd GetCurInstType GetCurrentAddress GetDlgItem GetDLLVersion GetDLLVersionLocal GetErrorLevel GetFileTime GetFileTimeLocal GetFullPathName GetFunctionAddress GetInstDirError GetLabelAddress GetTempFileName Goto HideWindow Icon IfAbort IfErrors IfFileExists IfRebootFlag IfSilent InitPluginsDir InstallButtonText InstallColors InstallDir InstallDirRegKey InstProgressFlags InstType InstTypeGetText InstTypeSetText IntCmp IntCmpU IntFmt IntOp IsWindow LangString LicenseBkColor LicenseData LicenseForceSelection LicenseLangString LicenseText LoadLanguageFile LockWindow LogSet LogText ManifestDPIAware ManifestSupportedOS MessageBox MiscButtonText Name Nop OutFile Page PageCallbacks PageExEnd Pop Push Quit ReadEnvStr ReadINIStr ReadRegDWORD ReadRegStr Reboot RegDLL Rename RequestExecutionLevel ReserveFile Return RMDir SearchPath SectionEnd SectionGetFlags SectionGetInstTypes SectionGetSize SectionGetText SectionGroupEnd SectionIn SectionSetFlags SectionSetInstTypes SectionSetSize SectionSetText SendMessage SetAutoClose SetBrandingImage SetCompress SetCompressor SetCompressorDictSize SetCtlColors SetCurInstType SetDatablockOptimize SetDateSave SetDetailsPrint SetDetailsView SetErrorLevel SetErrors SetFileAttributes SetFont SetOutPath SetOverwrite SetPluginUnload SetRebootFlag SetRegView SetShellVarContext SetSilent ShowInstDetails ShowUninstDetails ShowWindow SilentInstall SilentUnInstall Sleep SpaceTexts StrCmp StrCmpS StrCpy StrLen SubCaption SubSectionEnd Unicode UninstallButtonText UninstallCaption UninstallIcon UninstallSubCaption UninstallText UninstPage UnRegDLL Var VIAddVersionKey VIFileVersion VIProductVersion WindowIcon WriteINIStr WriteRegBin WriteRegDWORD WriteRegExpandStr WriteRegStr WriteUninstaller XPStyle',
	      literal:
	      'admin all auto both colored current false force hide highest lastused leave listonly none normal notset off on open print show silent silentlog smooth textonly true user '
	    },
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'string',
	        begin: '"', end: '"',
	        illegal: '\\n',
	        contains: [
	          { // $\n, $\r, $\t, $$
	            className: 'symbol',
	            begin: '\\$(\\\\(n|r|t)|\\$)'
	          },
	          CONSTANTS,
	          DEFINES,
	          VARIABLES,
	          LANGUAGES
	        ]
	      },
	      hljs.COMMENT(
	        ';',
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      {
	        className: 'function',
	        beginKeywords: 'Function PageEx Section SectionGroup SubSection', end: '$'
	      },
	      COMPILER,
	      DEFINES,
	      VARIABLES,
	      LANGUAGES,
	      PARAMETERS,
	      hljs.NUMBER_MODE,
	      { // plug::ins
	        className: 'literal',
	        begin: hljs.IDENT_RE + '::' + hljs.IDENT_RE
	      }
	    ]
	  };
	};

/***/ },
/* 125 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var API_CLASS = {
	    className: 'built_in',
	    begin: '(AV|CA|CF|CG|CI|MK|MP|NS|UI)\\w+',
	  };
	  var OBJC_KEYWORDS = {
	    keyword:
	      'int float while char export sizeof typedef const struct for union ' +
	      'unsigned long volatile static bool mutable if do return goto void ' +
	      'enum else break extern asm case short default double register explicit ' +
	      'signed typename this switch continue wchar_t inline readonly assign ' +
	      'readwrite self @synchronized id typeof ' +
	      'nonatomic super unichar IBOutlet IBAction strong weak copy ' +
	      'in out inout bycopy byref oneway __strong __weak __block __autoreleasing ' +
	      '@private @protected @public @try @property @end @throw @catch @finally ' +
	      '@autoreleasepool @synthesize @dynamic @selector @optional @required',
	    literal:
	      'false true FALSE TRUE nil YES NO NULL',
	    built_in:
	      'BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once'
	  };
	  var LEXEMES = /[a-zA-Z@][a-zA-Z0-9_]*/;
	  var CLASS_KEYWORDS = '@interface @class @protocol @implementation';
	  return {
	    aliases: ['mm', 'objc', 'obj-c'],
	    keywords: OBJC_KEYWORDS,
	    lexemes: LEXEMES,
	    illegal: '</',
	    contains: [
	      API_CLASS,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.C_NUMBER_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        variants: [
	          {
	            begin: '@"', end: '"',
	            illegal: '\\n',
	            contains: [hljs.BACKSLASH_ESCAPE]
	          },
	          {
	            begin: '\'', end: '[^\\\\]\'',
	            illegal: '[^\\\\][^\']'
	          }
	        ]
	      },
	      {
	        className: 'preprocessor',
	        begin: '#',
	        end: '$',
	        contains: [
	          {
	            className: 'title',
	            variants: [
	              { begin: '\"', end: '\"' },
	              { begin: '<', end: '>' }
	            ]
	          }
	        ]
	      },
	      {
	        className: 'class',
	        begin: '(' + CLASS_KEYWORDS.split(' ').join('|') + ')\\b', end: '({|$)', excludeEnd: true,
	        keywords: CLASS_KEYWORDS, lexemes: LEXEMES,
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        className: 'variable',
	        begin: '\\.'+hljs.UNDERSCORE_IDENT_RE,
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  /* missing support for heredoc-like string (OCaml 4.0.2+) */
	  return {
	    aliases: ['ml'],
	    keywords: {
	      keyword:
	        'and as assert asr begin class constraint do done downto else end ' +
	        'exception external for fun function functor if in include ' +
	        'inherit! inherit initializer land lazy let lor lsl lsr lxor match method!|10 method ' +
	        'mod module mutable new object of open! open or private rec sig struct ' +
	        'then to try type val! val virtual when while with ' +
	        /* camlp4 */
	        'parser value',
	      built_in:
	        /* built-in types */
	        'array bool bytes char exn|5 float int int32 int64 list lazy_t|5 nativeint|5 string unit ' +
	        /* (some) types in Pervasives */
	        'in_channel out_channel ref',
	      literal:
	        'true false'
	    },
	    illegal: /\/\/|>>/,
	    lexemes: '[a-z_]\\w*!?',
	    contains: [
	      {
	        className: 'literal',
	        begin: '\\[(\\|\\|)?\\]|\\(\\)',
	        relevance: 0
	      },
	      hljs.COMMENT(
	        '\\(\\*',
	        '\\*\\)',
	        {
	          contains: ['self']
	        }
	      ),
	      { /* type variable */
	        className: 'symbol',
	        begin: '\'[A-Za-z_](?!\')[\\w\']*'
	        /* the grammar is ambiguous on how 'a'b should be interpreted but not the compiler */
	      },
	      { /* polymorphic variant */
	        className: 'tag',
	        begin: '`[A-Z][\\w\']*'
	      },
	      { /* module or constructor */
	        className: 'type',
	        begin: '\\b[A-Z][\\w\']*',
	        relevance: 0
	      },
	      { /* don't color identifiers, but safely catch all identifiers with '*/
	        begin: '[a-z_]\\w*\'[\\w\']*'
	      },
	      hljs.inherit(hljs.APOS_STRING_MODE, {className: 'char', relevance: 0}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	      {
	        className: 'number',
	        begin:
	          '\\b(0[xX][a-fA-F0-9_]+[Lln]?|' +
	          '0[oO][0-7_]+[Lln]?|' +
	          '0[bB][01_]+[Lln]?|' +
	          '[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)',
	        relevance: 0
	      },
	      {
	        begin: /[-=]>/ // relevance booster
	      }
	    ]
	  }
	};

/***/ },
/* 127 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
		var SPECIAL_VARS = {
			className: 'keyword',
			begin: '\\$(f[asn]|t|vp[rtd]|children)'
		},
		LITERALS = {
			className: 'literal',
			begin: 'false|true|PI|undef'
		},
		NUMBERS = {
			className: 'number',
			begin: '\\b\\d+(\\.\\d+)?(e-?\\d+)?', //adds 1e5, 1e-10
			relevance: 0
		},
		STRING = hljs.inherit(hljs.QUOTE_STRING_MODE,{illegal: null}),
		PREPRO = {
			className: 'preprocessor',
			keywords: 'include use',
			begin: 'include|use <',
			end: '>'
		},
		PARAMS = {
			className: 'params',
			begin: '\\(', end: '\\)',
			contains: ['self', NUMBERS, STRING, SPECIAL_VARS, LITERALS]
		},
		MODIFIERS = {
			className: 'built_in',
			begin: '[*!#%]',
			relevance: 0
		},
		FUNCTIONS = {
			className: 'function',
			beginKeywords: 'module function',
			end: '\\=|\\{',
			contains: [PARAMS, hljs.UNDERSCORE_TITLE_MODE]
		};

		return {
			aliases: ['scad'],
			keywords: {
				keyword: 'function module include use for intersection_for if else \\%',
				literal: 'false true PI undef',
				built_in: 'circle square polygon text sphere cube cylinder polyhedron translate rotate scale resize mirror multmatrix color offset hull minkowski union difference intersection abs sign sin cos tan acos asin atan atan2 floor round ceil ln log pow sqrt exp rands min max concat lookup str chr search version version_num norm cross parent_module echo import import_dxf dxf_linear_extrude linear_extrude rotate_extrude surface projection render children dxf_cross dxf_dim let assign'
			},
			contains: [
				hljs.C_LINE_COMMENT_MODE,
				hljs.C_BLOCK_COMMENT_MODE,
				NUMBERS,
				PREPRO,
				STRING,
				SPECIAL_VARS,
				MODIFIERS,
				FUNCTIONS
			]
		}
	};

/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var OXYGENE_KEYWORDS = 'abstract add and array as asc aspect assembly async begin break block by case class concat const copy constructor continue '+
	    'create default delegate desc distinct div do downto dynamic each else empty end ensure enum equals event except exit extension external false '+
	    'final finalize finalizer finally flags for forward from function future global group has if implementation implements implies in index inherited '+
	    'inline interface into invariants is iterator join locked locking loop matching method mod module namespace nested new nil not notify nullable of '+
	    'old on operator or order out override parallel params partial pinned private procedure property protected public queryable raise read readonly '+
	    'record reintroduce remove repeat require result reverse sealed select self sequence set shl shr skip static step soft take then to true try tuple '+
	    'type union unit unsafe until uses using var virtual raises volatile where while with write xor yield await mapped deprecated stdcall cdecl pascal '+
	    'register safecall overload library platform reference packed strict published autoreleasepool selector strong weak unretained';
	  var CURLY_COMMENT =  hljs.COMMENT(
	    '{',
	    '}',
	    {
	      relevance: 0
	    }
	  );
	  var PAREN_COMMENT = hljs.COMMENT(
	    '\\(\\*',
	    '\\*\\)',
	    {
	      relevance: 10
	    }
	  );
	  var STRING = {
	    className: 'string',
	    begin: '\'', end: '\'',
	    contains: [{begin: '\'\''}]
	  };
	  var CHAR_STRING = {
	    className: 'string', begin: '(#\\d+)+'
	  };
	  var FUNCTION = {
	    className: 'function',
	    beginKeywords: 'function constructor destructor procedure method', end: '[:;]',
	    keywords: 'function constructor|10 destructor|10 procedure|10 method|10',
	    contains: [
	      hljs.TITLE_MODE,
	      {
	        className: 'params',
	        begin: '\\(', end: '\\)',
	        keywords: OXYGENE_KEYWORDS,
	        contains: [STRING, CHAR_STRING]
	      },
	      CURLY_COMMENT, PAREN_COMMENT
	    ]
	  };
	  return {
	    case_insensitive: true,
	    keywords: OXYGENE_KEYWORDS,
	    illegal: '("|\\$[G-Zg-z]|\\/\\*|</|=>|->)',
	    contains: [
	      CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
	      STRING, CHAR_STRING,
	      hljs.NUMBER_MODE,
	      FUNCTION,
	      {
	        className: 'class',
	        begin: '=\\bclass\\b', end: 'end;',
	        keywords: OXYGENE_KEYWORDS,
	        contains: [
	          STRING, CHAR_STRING,
	          CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
	          FUNCTION
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var CURLY_SUBCOMMENT = hljs.COMMENT(
	    '{',
	    '}',
	    {
	      contains: ['self']
	    }
	  );
	  return {
	    subLanguage: 'xml', relevance: 0,
	    contains: [
	      hljs.COMMENT('^#', '$'),
	      hljs.COMMENT(
	        '\\^rem{',
	        '}',
	        {
	          relevance: 10,
	          contains: [
	            CURLY_SUBCOMMENT
	          ]
	        }
	      ),
	      {
	        className: 'preprocessor',
	        begin: '^@(?:BASE|USE|CLASS|OPTIONS)$',
	        relevance: 10
	      },
	      {
	        className: 'title',
	        begin: '@[\\w\\-]+\\[[\\w^;\\-]*\\](?:\\[[\\w^;\\-]*\\])?(?:.*)$'
	      },
	      {
	        className: 'variable',
	        begin: '\\$\\{?[\\w\\-\\.\\:]+\\}?'
	      },
	      {
	        className: 'keyword',
	        begin: '\\^[\\w\\-\\.\\:]+'
	      },
	      {
	        className: 'number',
	        begin: '\\^#[0-9a-fA-F]+'
	      },
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 130 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var MACRO = {
	    className: 'variable',
	    begin: /\$[\w\d#@][\w\d_]*/
	  };
	  var TABLE = {
	    className: 'variable',
	    begin: /</, end: />/
	  };
	  var QUOTE_STRING = {
	    className: 'string',
	    begin: /"/, end: /"/
	  };

	  return {
	    aliases: ['pf.conf'],
	    lexemes: /[a-z0-9_<>-]+/,
	    keywords: {
	      built_in: /* block match pass are "actions" in pf.conf(5), the rest are
	                 * lexically similar top-level commands.
	                 */
	        'block match pass load anchor|5 antispoof|10 set table',
	      keyword:
	        'in out log quick on rdomain inet inet6 proto from port os to route' +
	        'allow-opts divert-packet divert-reply divert-to flags group icmp-type' +
	        'icmp6-type label once probability recieved-on rtable prio queue' +
	        'tos tag tagged user keep fragment for os drop' +
	        'af-to|10 binat-to|10 nat-to|10 rdr-to|10 bitmask least-stats random round-robin' +
	        'source-hash static-port' +
	        'dup-to reply-to route-to' +
	        'parent bandwidth default min max qlimit' +
	        'block-policy debug fingerprints hostid limit loginterface optimization' +
	        'reassemble ruleset-optimization basic none profile skip state-defaults' +
	        'state-policy timeout' +
	        'const counters persist' +
	        'no modulate synproxy state|5 floating if-bound no-sync pflow|10 sloppy' +
	        'source-track global rule max-src-nodes max-src-states max-src-conn' +
	        'max-src-conn-rate overload flush' +
	        'scrub|5 max-mss min-ttl no-df|10 random-id',
	      literal:
	        'all any no-route self urpf-failed egress|5 unknown'
	    },
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      hljs.NUMBER_MODE,
	      hljs.QUOTE_STRING_MODE,
	      MACRO,
	      TABLE
	    ]
	  };
	};

/***/ },
/* 131 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VARIABLE = {
	    className: 'variable', begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
	  };
	  var PREPROCESSOR = {
	    className: 'preprocessor', begin: /<\?(php)?|\?>/
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, PREPROCESSOR],
	    variants: [
	      {
	        begin: 'b"', end: '"'
	      },
	      {
	        begin: 'b\'', end: '\''
	      },
	      hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null})
	    ]
	  };
	  var NUMBER = {variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]};
	  return {
	    aliases: ['php3', 'php4', 'php5', 'php6'],
	    case_insensitive: true,
	    keywords:
	      'and include_once list abstract global private echo interface as static endswitch ' +
	      'array null if endwhile or const for endforeach self var while isset public ' +
	      'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
	      'return parent clone use __CLASS__ __LINE__ else break print eval new ' +
	      'catch __METHOD__ case exception default die require __FUNCTION__ ' +
	      'enddeclare final try switch continue endfor endif declare unset true false ' +
	      'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' +
	      'yield finally',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.HASH_COMMENT_MODE,
	      hljs.COMMENT(
	        '/\\*',
	        '\\*/',
	        {
	          contains: [
	            {
	              className: 'doctag',
	              begin: '@[A-Za-z]+'
	            },
	            PREPROCESSOR
	          ]
	        }
	      ),
	      hljs.COMMENT(
	        '__halt_compiler.+?;',
	        false,
	        {
	          endsWithParent: true,
	          keywords: '__halt_compiler',
	          lexemes: hljs.UNDERSCORE_IDENT_RE
	        }
	      ),
	      {
	        className: 'string',
	        begin: /<<<['"]?\w+['"]?$/, end: /^\w+;?$/,
	        contains: [
	          hljs.BACKSLASH_ESCAPE,
	          {
	            className: 'subst',
	            variants: [
	              {begin: /\$\w+/},
	              {begin: /\{\$/, end: /\}/}
	            ]
	          }
	        ]
	      },
	      PREPROCESSOR,
	      VARIABLE,
	      {
	        // swallow composed identifiers to avoid parsing them as keywords
	        begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
	        illegal: '\\$|\\[|%',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)',
	            contains: [
	              'self',
	              VARIABLE,
	              hljs.C_BLOCK_COMMENT_MODE,
	              STRING,
	              NUMBER
	            ]
	          }
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        illegal: /[:\(\$"]/,
	        contains: [
	          {beginKeywords: 'extends implements'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        beginKeywords: 'namespace', end: ';',
	        illegal: /[\.']/,
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      {
	        beginKeywords: 'use', end: ';',
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      {
	        begin: '=>' // No markup, just a relevance booster
	      },
	      STRING,
	      NUMBER
	    ]
	  };
	};

/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var backtickEscape = {
	    begin: '`[\\s\\S]',
	    relevance: 0
	  };
	  var VAR = {
	    className: 'variable',
	    variants: [
	      {begin: /\$[\w\d][\w\d_:]*/}
	    ]
	  };
	  var QUOTE_STRING = {
	    className: 'string',
	    begin: /"/, end: /"/,
	    contains: [
	      backtickEscape,
	      VAR,
	      {
	        className: 'variable',
	        begin: /\$[A-z]/, end: /[^A-z]/
	      }
	    ]
	  };
	  var APOS_STRING = {
	    className: 'string',
	    begin: /'/, end: /'/
	  };

	  return {
	    aliases: ['ps'],
	    lexemes: /-?[A-z\.\-]+/,
	    case_insensitive: true,
	    keywords: {
	      keyword: 'if else foreach return function do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch',
	      literal: '$null $true $false',
	      built_in: 'Add-Content Add-History Add-Member Add-PSSnapin Clear-Content Clear-Item Clear-Item Property Clear-Variable Compare-Object ConvertFrom-SecureString Convert-Path ConvertTo-Html ConvertTo-SecureString Copy-Item Copy-ItemProperty Export-Alias Export-Clixml Export-Console Export-Csv ForEach-Object Format-Custom Format-List Format-Table Format-Wide Get-Acl Get-Alias Get-AuthenticodeSignature Get-ChildItem Get-Command Get-Content Get-Credential Get-Culture Get-Date Get-EventLog Get-ExecutionPolicy Get-Help Get-History Get-Host Get-Item Get-ItemProperty Get-Location Get-Member Get-PfxCertificate Get-Process Get-PSDrive Get-PSProvider Get-PSSnapin Get-Service Get-TraceSource Get-UICulture Get-Unique Get-Variable Get-WmiObject Group-Object Import-Alias Import-Clixml Import-Csv Invoke-Expression Invoke-History Invoke-Item Join-Path Measure-Command Measure-Object Move-Item Move-ItemProperty New-Alias New-Item New-ItemProperty New-Object New-PSDrive New-Service New-TimeSpan New-Variable Out-Default Out-File Out-Host Out-Null Out-Printer Out-String Pop-Location Push-Location Read-Host Remove-Item Remove-ItemProperty Remove-PSDrive Remove-PSSnapin Remove-Variable Rename-Item Rename-ItemProperty Resolve-Path Restart-Service Resume-Service Select-Object Select-String Set-Acl Set-Alias Set-AuthenticodeSignature Set-Content Set-Date Set-ExecutionPolicy Set-Item Set-ItemProperty Set-Location Set-PSDebug Set-Service Set-TraceSource Set-Variable Sort-Object Split-Path Start-Service Start-Sleep Start-Transcript Stop-Process Stop-Service Stop-Transcript Suspend-Service Tee-Object Test-Path Trace-Command Update-FormatData Update-TypeData Where-Object Write-Debug Write-Error Write-Host Write-Output Write-Progress Write-Verbose Write-Warning',
	      operator: '-ne -eq -lt -gt -ge -le -not -like -notlike -match -notmatch -contains -notcontains -in -notin -replace'
	    },
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      hljs.NUMBER_MODE,
	      QUOTE_STRING,
	      APOS_STRING,
	      VAR
	    ]
	  };
	};

/***/ },
/* 133 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      keyword: 'BufferedReader PVector PFont PImage PGraphics HashMap boolean byte char color ' +
	        'double float int long String Array FloatDict FloatList IntDict IntList JSONArray JSONObject ' +
	        'Object StringDict StringList Table TableRow XML ' +
	        // Java keywords
	        'false synchronized int abstract float private char boolean static null if const ' +
	        'for true while long throw strictfp finally protected import native final return void ' +
	        'enum else break transient new catch instanceof byte super volatile case assert short ' +
	        'package default double public try this switch continue throws protected public private',
	      constant: 'P2D P3D HALF_PI PI QUARTER_PI TAU TWO_PI',
	      variable: 'displayHeight displayWidth mouseY mouseX mousePressed pmouseX pmouseY key ' +
	        'keyCode pixels focused frameCount frameRate height width',
	      title: 'setup draw',
	      built_in: 'size createGraphics beginDraw createShape loadShape PShape arc ellipse line point ' +
	        'quad rect triangle bezier bezierDetail bezierPoint bezierTangent curve curveDetail curvePoint ' +
	        'curveTangent curveTightness shape shapeMode beginContour beginShape bezierVertex curveVertex ' +
	        'endContour endShape quadraticVertex vertex ellipseMode noSmooth rectMode smooth strokeCap ' +
	        'strokeJoin strokeWeight mouseClicked mouseDragged mouseMoved mousePressed mouseReleased ' +
	        'mouseWheel keyPressed keyPressedkeyReleased keyTyped print println save saveFrame day hour ' +
	        'millis minute month second year background clear colorMode fill noFill noStroke stroke alpha ' +
	        'blue brightness color green hue lerpColor red saturation modelX modelY modelZ screenX screenY ' +
	        'screenZ ambient emissive shininess specular add createImage beginCamera camera endCamera frustum ' +
	        'ortho perspective printCamera printProjection cursor frameRate noCursor exit loop noLoop popStyle ' +
	        'pushStyle redraw binary boolean byte char float hex int str unbinary unhex join match matchAll nf ' +
	        'nfc nfp nfs split splitTokens trim append arrayCopy concat expand reverse shorten sort splice subset ' +
	        'box sphere sphereDetail createInput createReader loadBytes loadJSONArray loadJSONObject loadStrings ' +
	        'loadTable loadXML open parseXML saveTable selectFolder selectInput beginRaw beginRecord createOutput ' +
	        'createWriter endRaw endRecord PrintWritersaveBytes saveJSONArray saveJSONObject saveStream saveStrings ' +
	        'saveXML selectOutput popMatrix printMatrix pushMatrix resetMatrix rotate rotateX rotateY rotateZ scale ' +
	        'shearX shearY translate ambientLight directionalLight lightFalloff lights lightSpecular noLights normal ' +
	        'pointLight spotLight image imageMode loadImage noTint requestImage tint texture textureMode textureWrap ' +
	        'blend copy filter get loadPixels set updatePixels blendMode loadShader PShaderresetShader shader createFont ' +
	        'loadFont text textFont textAlign textLeading textMode textSize textWidth textAscent textDescent abs ceil ' +
	        'constrain dist exp floor lerp log mag map max min norm pow round sq sqrt acos asin atan atan2 cos degrees ' +
	        'radians sin tan noise noiseDetail noiseSeed random randomGaussian randomSeed'
	    },
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    contains: [
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'built_in',
	        begin: '{', end: '}$',
	        excludeBegin: true, excludeEnd: true,
	        contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE],
	        relevance: 0
	      },
	      {
	        className: 'filename',
	        begin: '[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}', end: ':',
	        excludeEnd: true
	      },
	      {
	        className: 'header',
	        begin: '(ncalls|tottime|cumtime)', end: '$',
	        keywords: 'ncalls tottime|10 cumtime|10 filename',
	        relevance: 10
	      },
	      {
	        className: 'summary',
	        begin: 'function calls', end: '$',
	        contains: [hljs.C_NUMBER_MODE],
	        relevance: 10
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'function',
	        begin: '\\(', end: '\\)$',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE
	        ],
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 135 */
/***/ function(module, exports) {

	module.exports = function(hljs) {

	  var ATOM = {

	    className: 'atom',
	    begin: /[a-z][A-Za-z0-9_]*/,
	    relevance: 0
	  };

	  var VAR = {

	    className: 'name',
	    variants: [
	      {begin: /[A-Z][a-zA-Z0-9_]*/},
	      {begin: /_[A-Za-z0-9_]*/},
	    ],
	    relevance: 0
	  };

	  var PARENTED = {

	    begin: /\(/,
	    end: /\)/,
	    relevance: 0
	  };

	  var LIST = {

	    begin: /\[/,
	    end: /\]/
	  };

	  var LINE_COMMENT = {

	    className: 'comment',
	    begin: /%/, end: /$/,
	    contains: [hljs.PHRASAL_WORDS_MODE]
	  };

	  var BACKTICK_STRING = {

	    className: 'string',
	    begin: /`/, end: /`/,
	    contains: [hljs.BACKSLASH_ESCAPE]
	  };

	  var CHAR_CODE = {

	    className: 'string', // 0'a etc.
	    begin: /0\'(\\\'|.)/
	  };

	  var SPACE_CODE = {

	    className: 'string',
	    begin: /0\'\\s/ // 0'\s
	  };

	  var PRED_OP = { // relevance booster
	    begin: /:-/
	  };

	  var inner = [

	    ATOM,
	    VAR,
	    PARENTED,
	    PRED_OP,
	    LIST,
	    LINE_COMMENT,
	    hljs.C_BLOCK_COMMENT_MODE,
	    hljs.QUOTE_STRING_MODE,
	    hljs.APOS_STRING_MODE,
	    BACKTICK_STRING,
	    CHAR_CODE,
	    SPACE_CODE,
	    hljs.C_NUMBER_MODE
	  ];

	  PARENTED.contains = inner;
	  LIST.contains = inner;

	  return {
	    contains: inner.concat([
	      {begin: /\.$/} // relevance booster
	    ])
	  };
	};

/***/ },
/* 136 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      keyword: 'package import option optional required repeated group',
	      built_in: 'double float int32 int64 uint32 uint64 sint32 sint64 ' +
	        'fixed32 fixed64 sfixed32 sfixed64 bool string bytes',
	      literal: 'true false'
	    },
	    contains: [
	      hljs.QUOTE_STRING_MODE,
	      hljs.NUMBER_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      {
	        className: 'class',
	        beginKeywords: 'message enum service', end: /\{/,
	        illegal: /\n/,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {
	            starts: {endsWithParent: true, excludeEnd: true} // hack: eating everything after the first title
	          })
	        ]
	      },
	      {
	        className: 'function',
	        beginKeywords: 'rpc',
	        end: /;/, excludeEnd: true,
	        keywords: 'rpc returns'
	      },
	      {
	        className: 'constant',
	        begin: /^\s*[A-Z_]+/,
	        end: /\s*=/, excludeEnd: true
	      }
	    ]
	  };
	};

/***/ },
/* 137 */
/***/ function(module, exports) {

	module.exports = function(hljs) {

	  var PUPPET_KEYWORDS = {
	    keyword:
	    /* language keywords */
	      'and case default else elsif false if in import enherits node or true undef unless main settings $string ',
	    literal:
	    /* metaparameters */
	      'alias audit before loglevel noop require subscribe tag ' +
	    /* normal attributes */
	      'owner ensure group mode name|0 changes context force incl lens load_path onlyif provider returns root show_diff type_check ' +
	      'en_address ip_address realname command environment hour monute month monthday special target weekday '+
	      'creates cwd ogoutput refresh refreshonly tries try_sleep umask backup checksum content ctime force ignore ' +
	      'links mtime purge recurse recurselimit replace selinux_ignore_defaults selrange selrole seltype seluser source ' +
	      'souirce_permissions sourceselect validate_cmd validate_replacement allowdupe attribute_membership auth_membership forcelocal gid '+
	      'ia_load_module members system host_aliases ip allowed_trunk_vlans description device_url duplex encapsulation etherchannel ' +
	      'native_vlan speed principals allow_root auth_class auth_type authenticate_user k_of_n mechanisms rule session_owner shared options ' +
	      'device fstype enable hasrestart directory present absent link atboot blockdevice device dump pass remounts poller_tag use ' +
	      'message withpath adminfile allow_virtual allowcdrom category configfiles flavor install_options instance package_settings platform ' +
	      'responsefile status uninstall_options vendor unless_system_user unless_uid binary control flags hasstatus manifest pattern restart running ' +
	      'start stop allowdupe auths expiry gid groups home iterations key_membership keys managehome membership password password_max_age ' +
	      'password_min_age profile_membership profiles project purge_ssh_keys role_membership roles salt shell uid baseurl cost descr enabled ' +
	      'enablegroups exclude failovermethod gpgcheck gpgkey http_caching include includepkgs keepalive metadata_expire metalink mirrorlist ' +
	      'priority protect proxy proxy_password proxy_username repo_gpgcheck s3_enabled skip_if_unavailable sslcacert sslclientcert sslclientkey ' +
	      'sslverify mounted',
	    built_in:
	    /* core facts */
	      'architecture augeasversion blockdevices boardmanufacturer boardproductname boardserialnumber cfkey dhcp_servers ' +
	      'domain ec2_ ec2_userdata facterversion filesystems ldom fqdn gid hardwareisa hardwaremodel hostname id|0 interfaces '+
	      'ipaddress ipaddress_ ipaddress6 ipaddress6_ iphostnumber is_virtual kernel kernelmajversion kernelrelease kernelversion ' +
	      'kernelrelease kernelversion lsbdistcodename lsbdistdescription lsbdistid lsbdistrelease lsbmajdistrelease lsbminordistrelease ' +
	      'lsbrelease macaddress macaddress_ macosx_buildversion macosx_productname macosx_productversion macosx_productverson_major ' +
	      'macosx_productversion_minor manufacturer memoryfree memorysize netmask metmask_ network_ operatingsystem operatingsystemmajrelease '+
	      'operatingsystemrelease osfamily partitions path physicalprocessorcount processor processorcount productname ps puppetversion '+
	      'rubysitedir rubyversion selinux selinux_config_mode selinux_config_policy selinux_current_mode selinux_current_mode selinux_enforced '+
	      'selinux_policyversion serialnumber sp_ sshdsakey sshecdsakey sshrsakey swapencrypted swapfree swapsize timezone type uniqueid uptime '+
	      'uptime_days uptime_hours uptime_seconds uuid virtual vlans xendomains zfs_version zonenae zones zpool_version'
	  };

	  var COMMENT = hljs.COMMENT('#', '$');

	  var IDENT_RE = '([A-Za-z_]|::)(\\w|::)*';

	  var TITLE = hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE});

	  var VARIABLE = {className: 'variable', begin: '\\$' + IDENT_RE};

	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE, VARIABLE],
	    variants: [
	      {begin: /'/, end: /'/},
	      {begin: /"/, end: /"/}
	    ]
	  };

	  return {
	    aliases: ['pp'],
	    contains: [
	      COMMENT,
	      VARIABLE,
	      STRING,
	      {
	        beginKeywords: 'class', end: '\\{|;',
	        illegal: /=/,
	        contains: [TITLE, COMMENT]
	      },
	      {
	        beginKeywords: 'define', end: /\{/,
	        contains: [
	          {
	            className: 'title', begin: hljs.IDENT_RE, endsParent: true
	          }
	        ]
	      },
	      {
	        begin: hljs.IDENT_RE + '\\s+\\{', returnBegin: true,
	        end: /\S/,
	        contains: [
	          {
	            className: 'name',
	            begin: hljs.IDENT_RE
	          },
	          {
	            begin: /\{/, end: /\}/,
	            keywords: PUPPET_KEYWORDS,
	            relevance: 0,
	            contains: [
	              STRING,
	              COMMENT,
	              {
	                begin:'[a-zA-Z_]+\\s*=>'
	              },
	              {
	                className: 'number',
	                begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	                relevance: 0
	              },
	              VARIABLE
	            ]
	          }
	        ],
	        relevance: 0
	      }
	    ]
	  }
	};

/***/ },
/* 138 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var PROMPT = {
	    className: 'prompt',  begin: /^(>>>|\.\.\.) /
	  };
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE],
	    variants: [
	      {
	        begin: /(u|b)?r?'''/, end: /'''/,
	        contains: [PROMPT],
	        relevance: 10
	      },
	      {
	        begin: /(u|b)?r?"""/, end: /"""/,
	        contains: [PROMPT],
	        relevance: 10
	      },
	      {
	        begin: /(u|r|ur)'/, end: /'/,
	        relevance: 10
	      },
	      {
	        begin: /(u|r|ur)"/, end: /"/,
	        relevance: 10
	      },
	      {
	        begin: /(b|br)'/, end: /'/
	      },
	      {
	        begin: /(b|br)"/, end: /"/
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE
	    ]
	  };
	  var NUMBER = {
	    className: 'number', relevance: 0,
	    variants: [
	      {begin: hljs.BINARY_NUMBER_RE + '[lLjJ]?'},
	      {begin: '\\b(0o[0-7]+)[lLjJ]?'},
	      {begin: hljs.C_NUMBER_RE + '[lLjJ]?'}
	    ]
	  };
	  var PARAMS = {
	    className: 'params',
	    begin: /\(/, end: /\)/,
	    contains: ['self', PROMPT, NUMBER, STRING]
	  };
	  return {
	    aliases: ['py', 'gyp'],
	    keywords: {
	      keyword:
	        'and elif is global as in if from raise for except finally print import pass return ' +
	        'exec else break not with class assert yield try while continue del or def lambda ' +
	        'async await nonlocal|10 None True False',
	      built_in:
	        'Ellipsis NotImplemented'
	    },
	    illegal: /(<\/|->|\?)/,
	    contains: [
	      PROMPT,
	      NUMBER,
	      STRING,
	      hljs.HASH_COMMENT_MODE,
	      {
	        variants: [
	          {className: 'function', beginKeywords: 'def', relevance: 10},
	          {className: 'class', beginKeywords: 'class'}
	        ],
	        end: /:/,
	        illegal: /[${=;\n,]/,
	        contains: [hljs.UNDERSCORE_TITLE_MODE, PARAMS]
	      },
	      {
	        className: 'decorator',
	        begin: /^[\t ]*@/, end: /$/
	      },
	      {
	        begin: /\b(print|exec)\(/ // don’t highlight keywords-turned-functions in Python 3
	      }
	    ]
	  };
	};

/***/ },
/* 139 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var Q_KEYWORDS = {
	  keyword:
	    'do while select delete by update from',
	  constant:
	    '0b 1b',
	  built_in:
	    'neg not null string reciprocal floor ceiling signum mod xbar xlog and or each scan over prior mmu lsq inv md5 ltime gtime count first var dev med cov cor all any rand sums prds mins maxs fills deltas ratios avgs differ prev next rank reverse iasc idesc asc desc msum mcount mavg mdev xrank mmin mmax xprev rotate distinct group where flip type key til get value attr cut set upsert raze union inter except cross sv vs sublist enlist read0 read1 hopen hclose hdel hsym hcount peach system ltrim rtrim trim lower upper ssr view tables views cols xcols keys xkey xcol xasc xdesc fkeys meta lj aj aj0 ij pj asof uj ww wj wj1 fby xgroup ungroup ej save load rsave rload show csv parse eval min max avg wavg wsum sin cos tan sum',
	  typename:
	    '`float `double int `timestamp `timespan `datetime `time `boolean `symbol `char `byte `short `long `real `month `date `minute `second `guid'
	  };
	  return {
	  aliases:['k', 'kdb'],
	  keywords: Q_KEYWORDS,
	  lexemes: /\b(`?)[A-Za-z0-9_]+\b/,
	  contains: [
	  hljs.C_LINE_COMMENT_MODE,
	    hljs.QUOTE_STRING_MODE,
	    hljs.C_NUMBER_MODE
	     ]
	  };
	};

/***/ },
/* 140 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE = '([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*';

	  return {
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      {
	        begin: IDENT_RE,
	        lexemes: IDENT_RE,
	        keywords: {
	          keyword:
	            'function if in break next repeat else for return switch while try tryCatch ' +
	            'stop warning require library attach detach source setMethod setGeneric ' +
	            'setGroupGeneric setClass ...',
	          literal:
	            'NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 ' +
	            'NA_complex_|10'
	        },
	        relevance: 0
	      },
	      {
	        // hex value
	        className: 'number',
	        begin: "0[xX][0-9a-fA-F]+[Li]?\\b",
	        relevance: 0
	      },
	      {
	        // explicit integer
	        className: 'number',
	        begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b",
	        relevance: 0
	      },
	      {
	        // number with trailing decimal
	        className: 'number',
	        begin: "\\d+\\.(?!\\d)(?:i\\b)?",
	        relevance: 0
	      },
	      {
	        // number
	        className: 'number',
	        begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b",
	        relevance: 0
	      },
	      {
	        // number with leading decimal
	        className: 'number',
	        begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b",
	        relevance: 0
	      },

	      {
	        // escaped identifier
	        begin: '`',
	        end: '`',
	        relevance: 0
	      },

	      {
	        className: 'string',
	        contains: [hljs.BACKSLASH_ESCAPE],
	        variants: [
	          {begin: '"', end: '"'},
	          {begin: "'", end: "'"}
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords:
	      'ArchiveRecord AreaLightSource Atmosphere Attribute AttributeBegin AttributeEnd Basis ' +
	      'Begin Blobby Bound Clipping ClippingPlane Color ColorSamples ConcatTransform Cone ' +
	      'CoordinateSystem CoordSysTransform CropWindow Curves Cylinder DepthOfField Detail ' +
	      'DetailRange Disk Displacement Display End ErrorHandler Exposure Exterior Format ' +
	      'FrameAspectRatio FrameBegin FrameEnd GeneralPolygon GeometricApproximation Geometry ' +
	      'Hider Hyperboloid Identity Illuminate Imager Interior LightSource ' +
	      'MakeCubeFaceEnvironment MakeLatLongEnvironment MakeShadow MakeTexture Matte ' +
	      'MotionBegin MotionEnd NuPatch ObjectBegin ObjectEnd ObjectInstance Opacity Option ' +
	      'Orientation Paraboloid Patch PatchMesh Perspective PixelFilter PixelSamples ' +
	      'PixelVariance Points PointsGeneralPolygons PointsPolygons Polygon Procedural Projection ' +
	      'Quantize ReadArchive RelativeDetail ReverseOrientation Rotate Scale ScreenWindow ' +
	      'ShadingInterpolation ShadingRate Shutter Sides Skew SolidBegin SolidEnd Sphere ' +
	      'SubdivisionMesh Surface TextureCoordinates Torus Transform TransformBegin TransformEnd ' +
	      'TransformPoints Translate TrimCurve WorldBegin WorldEnd',
	    illegal: '</',
	    contains: [
	      hljs.HASH_COMMENT_MODE,
	      hljs.C_NUMBER_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE
	    ]
	  };
	};

/***/ },
/* 142 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENTIFIER = '[a-zA-Z-_][^\n{\r\n]+\\{';

	  return {
	    aliases: ['graph', 'instances'],
	    case_insensitive: true,
	    keywords: 'import',
	    contains: [
	      // Facet sections
	      {
	        className: 'facet',
	        begin: '^facet ' + IDENTIFIER,
	        end: '}',
	        keywords: 'facet installer exports children extends',
	        contains: [
	          hljs.HASH_COMMENT_MODE
	        ]
	      },

	      // Instance sections
	      {
	        className: 'instance-of',
	        begin: '^instance of ' + IDENTIFIER,
	        end: '}',
	        keywords: 'name count channels instance-data instance-state instance of',
	        contains: [
	          // Instance overridden properties
	          {
	            className: 'keyword',
	            begin: '[a-zA-Z-_]+( |\t)*:'
	          },
	          hljs.HASH_COMMENT_MODE
	        ]
	      },

	      // Component sections
	      {
	        className: 'component',
	        begin: '^' + IDENTIFIER,
	        end: '}',
	        lexemes: '\\(?[a-zA-Z]+\\)?',
	        keywords: 'installer exports children extends imports facets alias (optional)',
	        contains: [
	          // Imported component variables
	          {
	            className: 'string',
	            begin: '\\.[a-zA-Z-_]+',
	            end: '\\s|,|;',
	            excludeEnd: true
	          },
	          hljs.HASH_COMMENT_MODE
	        ]
	      },

	      // Comments
	      hljs.HASH_COMMENT_MODE
	    ]
	  };
	};

/***/ },
/* 143 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      keyword:
	        'float color point normal vector matrix while for if do return else break extern continue',
	      built_in:
	        'abs acos ambient area asin atan atmosphere attribute calculatenormal ceil cellnoise ' +
	        'clamp comp concat cos degrees depth Deriv diffuse distance Du Dv environment exp ' +
	        'faceforward filterstep floor format fresnel incident length lightsource log match ' +
	        'max min mod noise normalize ntransform opposite option phong pnoise pow printf ' +
	        'ptlined radians random reflect refract renderinfo round setcomp setxcomp setycomp ' +
	        'setzcomp shadow sign sin smoothstep specular specularbrdf spline sqrt step tan ' +
	        'texture textureinfo trace transform vtransform xcomp ycomp zcomp'
	    },
	    illegal: '</',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$'
	      },
	      {
	        className: 'shader',
	        beginKeywords: 'surface displacement light volume imager', end: '\\('
	      },
	      {
	        className: 'shading',
	        beginKeywords: 'illuminate illuminance gather', end: '\\('
	      }
	    ]
	  };
	};

/***/ },
/* 144 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	       keyword: 'BILL_PERIOD BILL_START BILL_STOP RS_EFFECTIVE_START RS_EFFECTIVE_STOP RS_JURIS_CODE RS_OPCO_CODE ' +
	         'INTDADDATTRIBUTE|5 INTDADDVMSG|5 INTDBLOCKOP|5 INTDBLOCKOPNA|5 INTDCLOSE|5 INTDCOUNT|5 ' +
	         'INTDCOUNTSTATUSCODE|5 INTDCREATEMASK|5 INTDCREATEDAYMASK|5 INTDCREATEFACTORMASK|5 ' +
	         'INTDCREATEHANDLE|5 INTDCREATEOVERRIDEDAYMASK|5 INTDCREATEOVERRIDEMASK|5 ' +
	         'INTDCREATESTATUSCODEMASK|5 INTDCREATETOUPERIOD|5 INTDDELETE|5 INTDDIPTEST|5 INTDEXPORT|5 ' +
	         'INTDGETERRORCODE|5 INTDGETERRORMESSAGE|5 INTDISEQUAL|5 INTDJOIN|5 INTDLOAD|5 INTDLOADACTUALCUT|5 ' +
	         'INTDLOADDATES|5 INTDLOADHIST|5 INTDLOADLIST|5 INTDLOADLISTDATES|5 INTDLOADLISTENERGY|5 ' +
	         'INTDLOADLISTHIST|5 INTDLOADRELATEDCHANNEL|5 INTDLOADSP|5 INTDLOADSTAGING|5 INTDLOADUOM|5 ' +
	         'INTDLOADUOMDATES|5 INTDLOADUOMHIST|5 INTDLOADVERSION|5 INTDOPEN|5 INTDREADFIRST|5 INTDREADNEXT|5 ' +
	         'INTDRECCOUNT|5 INTDRELEASE|5 INTDREPLACE|5 INTDROLLAVG|5 INTDROLLPEAK|5 INTDSCALAROP|5 INTDSCALE|5 ' +
	         'INTDSETATTRIBUTE|5 INTDSETDSTPARTICIPANT|5 INTDSETSTRING|5 INTDSETVALUE|5 INTDSETVALUESTATUS|5 ' +
	         'INTDSHIFTSTARTTIME|5 INTDSMOOTH|5 INTDSORT|5 INTDSPIKETEST|5 INTDSUBSET|5 INTDTOU|5 ' +
	         'INTDTOURELEASE|5 INTDTOUVALUE|5 INTDUPDATESTATS|5 INTDVALUE|5 STDEV INTDDELETEEX|5 ' +
	         'INTDLOADEXACTUAL|5 INTDLOADEXCUT|5 INTDLOADEXDATES|5 INTDLOADEX|5 INTDLOADEXRELATEDCHANNEL|5 ' +
	         'INTDSAVEEX|5 MVLOAD|5 MVLOADACCT|5 MVLOADACCTDATES|5 MVLOADACCTHIST|5 MVLOADDATES|5 MVLOADHIST|5 ' +
	         'MVLOADLIST|5 MVLOADLISTDATES|5 MVLOADLISTHIST|5 IF FOR NEXT DONE SELECT END CALL ABORT CLEAR CHANNEL FACTOR LIST NUMBER ' +
	         'OVERRIDE SET WEEK DISTRIBUTIONNODE ELSE WHEN THEN OTHERWISE IENUM CSV INCLUDE LEAVE RIDER SAVE DELETE ' +
	         'NOVALUE SECTION WARN SAVE_UPDATE DETERMINANT LABEL REPORT REVENUE EACH ' +
	         'IN FROM TOTAL CHARGE BLOCK AND OR CSV_FILE RATE_CODE AUXILIARY_DEMAND ' +
	         'UIDACCOUNT RS BILL_PERIOD_SELECT HOURS_PER_MONTH INTD_ERROR_STOP SEASON_SCHEDULE_NAME ' +
	         'ACCOUNTFACTOR ARRAYUPPERBOUND CALLSTOREDPROC GETADOCONNECTION GETCONNECT GETDATASOURCE ' +
	         'GETQUALIFIER GETUSERID HASVALUE LISTCOUNT LISTOP LISTUPDATE LISTVALUE PRORATEFACTOR RSPRORATE ' +
	         'SETBINPATH SETDBMONITOR WQ_OPEN BILLINGHOURS DATE DATEFROMFLOAT DATETIMEFROMSTRING ' +
	         'DATETIMETOSTRING DATETOFLOAT DAY DAYDIFF DAYNAME DBDATETIME HOUR MINUTE MONTH MONTHDIFF ' +
	         'MONTHHOURS MONTHNAME ROUNDDATE SAMEWEEKDAYLASTYEAR SECOND WEEKDAY WEEKDIFF YEAR YEARDAY ' +
	         'YEARSTR COMPSUM HISTCOUNT HISTMAX HISTMIN HISTMINNZ HISTVALUE MAXNRANGE MAXRANGE MINRANGE ' +
	         'COMPIKVA COMPKVA COMPKVARFROMKQKW COMPLF IDATTR FLAG LF2KW LF2KWH MAXKW POWERFACTOR ' +
	         'READING2USAGE AVGSEASON MAXSEASON MONTHLYMERGE SEASONVALUE SUMSEASON ACCTREADDATES ' +
	         'ACCTTABLELOAD CONFIGADD CONFIGGET CREATEOBJECT CREATEREPORT EMAILCLIENT EXPBLKMDMUSAGE ' +
	         'EXPMDMUSAGE EXPORT_USAGE FACTORINEFFECT GETUSERSPECIFIEDSTOP INEFFECT ISHOLIDAY RUNRATE ' +
	         'SAVE_PROFILE SETREPORTTITLE USEREXIT WATFORRUNRATE TO TABLE ACOS ASIN ATAN ATAN2 BITAND CEIL ' +
	         'COS COSECANT COSH COTANGENT DIVQUOT DIVREM EXP FABS FLOOR FMOD FREPM FREXPN LOG LOG10 MAX MAXN ' +
	         'MIN MINNZ MODF POW ROUND ROUND2VALUE ROUNDINT SECANT SIN SINH SQROOT TAN TANH FLOAT2STRING ' +
	         'FLOAT2STRINGNC INSTR LEFT LEN LTRIM MID RIGHT RTRIM STRING STRINGNC TOLOWER TOUPPER TRIM ' +
	         'NUMDAYS READ_DATE STAGING',
	       built_in: 'IDENTIFIER OPTIONS XML_ELEMENT XML_OP XML_ELEMENT_OF DOMDOCCREATE DOMDOCLOADFILE DOMDOCLOADXML ' +
	         'DOMDOCSAVEFILE DOMDOCGETROOT DOMDOCADDPI DOMNODEGETNAME DOMNODEGETTYPE DOMNODEGETVALUE DOMNODEGETCHILDCT ' +
	         'DOMNODEGETFIRSTCHILD DOMNODEGETSIBLING DOMNODECREATECHILDELEMENT DOMNODESETATTRIBUTE ' +
	         'DOMNODEGETCHILDELEMENTCT DOMNODEGETFIRSTCHILDELEMENT DOMNODEGETSIBLINGELEMENT DOMNODEGETATTRIBUTECT ' +
	         'DOMNODEGETATTRIBUTEI DOMNODEGETATTRIBUTEBYNAME DOMNODEGETBYNAME'
	    },
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'array',
	        variants: [
	          {begin: '#\\s+[a-zA-Z\\ \\.]*', relevance: 0}, // looks like #-comment
	          {begin: '#[a-zA-Z\\ \\.]+'}
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var NUM_SUFFIX = '([uif](8|16|32|64|size))\?';
	  var BLOCK_COMMENT = hljs.inherit(hljs.C_BLOCK_COMMENT_MODE);
	  BLOCK_COMMENT.contains.push('self');
	  return {
	    aliases: ['rs'],
	    keywords: {
	      keyword:
	        'alignof as be box break const continue crate do else enum extern ' +
	        'false fn for if impl in let loop match mod mut offsetof once priv ' +
	        'proc pub pure ref return self Self sizeof static struct super trait true ' +
	        'type typeof unsafe unsized use virtual while where yield ' +
	        'int i8 i16 i32 i64 ' +
	        'uint u8 u32 u64 ' +
	        'float f32 f64 ' +
	        'str char bool',
	      built_in:
	        // prelude
	        'Copy Send Sized Sync Drop Fn FnMut FnOnce drop Box ToOwned Clone ' +
	        'PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator ' +
	        'Extend IntoIterator DoubleEndedIterator ExactSizeIterator Option ' +
	        'Some None Result Ok Err SliceConcatExt String ToString Vec ' +
	        // macros
	        'assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! ' +
	        'debug_assert! debug_assert_eq! env! panic! file! format! format_args! ' +
	        'include_bin! include_str! line! local_data_key! module_path! ' +
	        'option_env! print! println! select! stringify! try! unimplemented! ' +
	        'unreachable! vec! write! writeln!'
	    },
	    lexemes: hljs.IDENT_RE + '!?',
	    illegal: '</',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      BLOCK_COMMENT,
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	      {
	        className: 'string',
	        variants: [
	           { begin: /r(#*)".*?"\1(?!#)/ },
	           { begin: /'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ },
	           { begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ }
	        ]
	      },
	      {
	        className: 'number',
	        variants: [
	          { begin: '\\b0b([01_]+)' + NUM_SUFFIX },
	          { begin: '\\b0o([0-7_]+)' + NUM_SUFFIX },
	          { begin: '\\b0x([A-Fa-f0-9_]+)' + NUM_SUFFIX },
	          { begin: '\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)' +
	                   NUM_SUFFIX
	          }
	        ],
	        relevance: 0
	      },
	      {
	        className: 'function',
	        beginKeywords: 'fn', end: '(\\(|<)', excludeEnd: true,
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      {
	        className: 'preprocessor',
	        begin: '#\\!?\\[', end: '\\]'
	      },
	      {
	        beginKeywords: 'type', end: '(=|<)',
	        contains: [hljs.UNDERSCORE_TITLE_MODE],
	        illegal: '\\S'
	      },
	      {
	        beginKeywords: 'trait enum', end: '{',
	        contains: [
	          hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, {endsParent: true})
	        ],
	        illegal: '[\\w\\d]'
	      },
	      {
	        begin: hljs.IDENT_RE + '::'
	      },
	      {
	        begin: '->'
	      }
	    ]
	  };
	};

/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = function(hljs) {

	  var ANNOTATION = {
	    className: 'annotation', begin: '@[A-Za-z]+'
	  };

	  var STRING = {
	    className: 'string',
	    begin: 'u?r?"""', end: '"""',
	    relevance: 10
	  };

	  var SYMBOL = {
	    className: 'symbol',
	    begin: '\'\\w[\\w\\d_]*(?!\')'
	  };

	  var TYPE = {
	    className: 'type',
	    begin: '\\b[A-Z][A-Za-z0-9_]*',
	    relevance: 0
	  };

	  var NAME = {
	    className: 'title',
	    begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
	    relevance: 0
	  };

	  var CLASS = {
	    className: 'class',
	    beginKeywords: 'class object trait type',
	    end: /[:={\[(\n;]/,
	    contains: [{className: 'keyword', beginKeywords: 'extends with', relevance: 10}, NAME]
	  };

	  var METHOD = {
	    className: 'function',
	    beginKeywords: 'def',
	    end: /[:={\[(\n;]/,
	    contains: [NAME]
	  };

	  return {
	    keywords: {
	      literal: 'true false null',
	      keyword: 'type yield lazy override def with val var sealed abstract private trait object if forSome for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit'
	    },
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      STRING,
	      hljs.QUOTE_STRING_MODE,
	      SYMBOL,
	      TYPE,
	      METHOD,
	      CLASS,
	      hljs.C_NUMBER_MODE,
	      ANNOTATION
	    ]
	  };
	};

/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var SCHEME_IDENT_RE = '[^\\(\\)\\[\\]\\{\\}",\'`;#|\\\\\\s]+';
	  var SCHEME_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+([./]\\d+)?';
	  var SCHEME_COMPLEX_NUMBER_RE = SCHEME_SIMPLE_NUMBER_RE + '[+\\-]' + SCHEME_SIMPLE_NUMBER_RE + 'i';
	  var BUILTINS = {
	    built_in:
	      'case-lambda call/cc class define-class exit-handler field import ' +
	      'inherit init-field interface let*-values let-values let/ec mixin ' +
	      'opt-lambda override protect provide public rename require ' +
	      'require-for-syntax syntax syntax-case syntax-error unit/sig unless ' +
	      'when with-syntax and begin call-with-current-continuation ' +
	      'call-with-input-file call-with-output-file case cond define ' +
	      'define-syntax delay do dynamic-wind else for-each if lambda let let* ' +
	      'let-syntax letrec letrec-syntax map or syntax-rules \' * + , ,@ - ... / ' +
	      '; < <= = => > >= ` abs acos angle append apply asin assoc assq assv atan ' +
	      'boolean? caar cadr call-with-input-file call-with-output-file ' +
	      'call-with-values car cdddar cddddr cdr ceiling char->integer ' +
	      'char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? ' +
	      'char-downcase char-lower-case? char-numeric? char-ready? char-upcase ' +
	      'char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? ' +
	      'char? close-input-port close-output-port complex? cons cos ' +
	      'current-input-port current-output-port denominator display eof-object? ' +
	      'eq? equal? eqv? eval even? exact->inexact exact? exp expt floor ' +
	      'force gcd imag-part inexact->exact inexact? input-port? integer->char ' +
	      'integer? interaction-environment lcm length list list->string ' +
	      'list->vector list-ref list-tail list? load log magnitude make-polar ' +
	      'make-rectangular make-string make-vector max member memq memv min ' +
	      'modulo negative? newline not null-environment null? number->string ' +
	      'number? numerator odd? open-input-file open-output-file output-port? ' +
	      'pair? peek-char port? positive? procedure? quasiquote quote quotient ' +
	      'rational? rationalize read read-char real-part real? remainder reverse ' +
	      'round scheme-report-environment set! set-car! set-cdr! sin sqrt string ' +
	      'string->list string->number string->symbol string-append string-ci<=? ' +
	      'string-ci<? string-ci=? string-ci>=? string-ci>? string-copy ' +
	      'string-fill! string-length string-ref string-set! string<=? string<? ' +
	      'string=? string>=? string>? string? substring symbol->string symbol? ' +
	      'tan transcript-off transcript-on truncate values vector ' +
	      'vector->list vector-fill! vector-length vector-ref vector-set! ' +
	      'with-input-from-file with-output-to-file write write-char zero?'
	  };

	  var SHEBANG = {
	    className: 'shebang',
	    begin: '^#!',
	    end: '$'
	  };

	  var LITERAL = {
	    className: 'literal',
	    begin: '(#t|#f|#\\\\' + SCHEME_IDENT_RE + '|#\\\\.)'
	  };

	  var NUMBER = {
	    className: 'number',
	    variants: [
	      { begin: SCHEME_SIMPLE_NUMBER_RE, relevance: 0 },
	      { begin: SCHEME_COMPLEX_NUMBER_RE, relevance: 0 },
	      { begin: '#b[0-1]+(/[0-1]+)?' },
	      { begin: '#o[0-7]+(/[0-7]+)?' },
	      { begin: '#x[0-9a-f]+(/[0-9a-f]+)?' }
	    ]
	  };

	  var STRING = hljs.QUOTE_STRING_MODE;

	  var REGULAR_EXPRESSION = {
	    className: 'regexp',
	    begin: '#[pr]x"',
	    end: '[^\\\\]"'
	  };

	  var COMMENT_MODES = [
	    hljs.COMMENT(
	      ';',
	      '$',
	      {
	        relevance: 0
	      }
	    ),
	    hljs.COMMENT('#\\|', '\\|#')
	  ];

	  var IDENT = {
	    begin: SCHEME_IDENT_RE,
	    relevance: 0
	  };

	  var QUOTED_IDENT = {
	    className: 'variable',
	    begin: '\'' + SCHEME_IDENT_RE
	  };

	  var BODY = {
	    endsWithParent: true,
	    relevance: 0
	  };

	  var LIST = {
	    className: 'list',
	    variants: [
	      { begin: '\\(', end: '\\)' },
	      { begin: '\\[', end: '\\]' }
	    ],
	    contains: [
	      {
	        className: 'keyword',
	        begin: SCHEME_IDENT_RE,
	        lexemes: SCHEME_IDENT_RE,
	        keywords: BUILTINS
	      },
	      BODY
	    ]
	  };

	  BODY.contains = [LITERAL, NUMBER, STRING, IDENT, QUOTED_IDENT, LIST].concat(COMMENT_MODES);

	  return {
	    illegal: /\S/,
	    contains: [SHEBANG, NUMBER, STRING, QUOTED_IDENT, LIST].concat(COMMENT_MODES)
	  };
	};

/***/ },
/* 148 */
/***/ function(module, exports) {

	module.exports = function(hljs) {

	  var COMMON_CONTAINS = [
	    hljs.C_NUMBER_MODE,
	    {
	      className: 'string',
	      begin: '\'|\"', end: '\'|\"',
	      contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}]
	    }
	  ];

	  return {
	    aliases: ['sci'],
	    keywords: {
	      keyword: 'abort break case clear catch continue do elseif else endfunction end for function'+
	        'global if pause return resume select try then while'+
	        '%f %F %t %T %pi %eps %inf %nan %e %i %z %s',
	      built_in: // Scilab has more than 2000 functions. Just list the most commons
	       'abs and acos asin atan ceil cd chdir clearglobal cosh cos cumprod deff disp error'+
	       'exec execstr exists exp eye gettext floor fprintf fread fsolve imag isdef isempty'+
	       'isinfisnan isvector lasterror length load linspace list listfiles log10 log2 log'+
	       'max min msprintf mclose mopen ones or pathconvert poly printf prod pwd rand real'+
	       'round sinh sin size gsort sprintf sqrt strcat strcmps tring sum system tanh tan'+
	       'type typename warning zeros matrix'
	    },
	    illegal: '("|#|/\\*|\\s+/\\w+)',
	    contains: [
	      {
	        className: 'function',
	        beginKeywords: 'function endfunction', end: '$',
	        keywords: 'function endfunction|10',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)'
	          }
	        ]
	      },
	      {
	        className: 'transposed_variable',
	        begin: '[a-zA-Z_][a-zA-Z_0-9]*(\'+[\\.\']*|[\\.\']+)', end: '',
	        relevance: 0
	      },
	      {
	        className: 'matrix',
	        begin: '\\[', end: '\\]\'*[\\.\']*',
	        relevance: 0,
	        contains: COMMON_CONTAINS
	      },
	      hljs.COMMENT('//', '$')
	    ].concat(COMMON_CONTAINS)
	  };
	};

/***/ },
/* 149 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
	  var VARIABLE = {
	    className: 'variable',
	    begin: '(\\$' + IDENT_RE + ')\\b'
	  };
	  var FUNCTION = {
	    className: 'function',
	    begin: IDENT_RE + '\\(',
	    returnBegin: true,
	    excludeEnd: true,
	    end: '\\('
	  };
	  var HEXCOLOR = {
	    className: 'hexcolor', begin: '#[0-9A-Fa-f]+'
	  };
	  var DEF_INTERNALS = {
	    className: 'attribute',
	    begin: '[A-Z\\_\\.\\-]+', end: ':',
	    excludeEnd: true,
	    illegal: '[^\\s]',
	    starts: {
	      className: 'value',
	      endsWithParent: true, excludeEnd: true,
	      contains: [
	        FUNCTION,
	        HEXCOLOR,
	        hljs.CSS_NUMBER_MODE,
	        hljs.QUOTE_STRING_MODE,
	        hljs.APOS_STRING_MODE,
	        hljs.C_BLOCK_COMMENT_MODE,
	        {
	          className: 'important', begin: '!important'
	        }
	      ]
	    }
	  };
	  return {
	    case_insensitive: true,
	    illegal: '[=/|\']',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      FUNCTION,
	      {
	        className: 'id', begin: '\\#[A-Za-z0-9_-]+',
	        relevance: 0
	      },
	      {
	        className: 'class', begin: '\\.[A-Za-z0-9_-]+',
	        relevance: 0
	      },
	      {
	        className: 'attr_selector',
	        begin: '\\[', end: '\\]',
	        illegal: '$'
	      },
	      {
	        className: 'tag', // begin: IDENT_RE, end: '[,|\\s]'
	        begin: '\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b',
	        relevance: 0
	      },
	      {
	        className: 'pseudo',
	        begin: ':(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)'
	      },
	      {
	        className: 'pseudo',
	        begin: '::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)'
	      },
	      VARIABLE,
	      {
	        className: 'attribute',
	        begin: '\\b(z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b',
	        illegal: '[^\\s]'
	      },
	      {
	        className: 'value',
	        begin: '\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b'
	      },
	      {
	        className: 'value',
	        begin: ':', end: ';',
	        contains: [
	          FUNCTION,
	          VARIABLE,
	          HEXCOLOR,
	          hljs.CSS_NUMBER_MODE,
	          hljs.QUOTE_STRING_MODE,
	          hljs.APOS_STRING_MODE,
	          {
	            className: 'important', begin: '!important'
	          }
	        ]
	      },
	      {
	        className: 'at_rule',
	        begin: '@', end: '[{;]',
	        keywords: 'mixin include extend for if else each while charset import debug media page content font-face namespace warn',
	        contains: [
	          FUNCTION,
	          VARIABLE,
	          hljs.QUOTE_STRING_MODE,
	          hljs.APOS_STRING_MODE,
	          HEXCOLOR,
	          hljs.CSS_NUMBER_MODE,
	          {
	            className: 'preprocessor',
	            begin: '\\s[A-Za-z0-9_.-]+',
	            relevance: 0
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 150 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var smali_instr_low_prio = ['add', 'and', 'cmp', 'cmpg', 'cmpl', 'const', 'div', 'double', 'float', 'goto', 'if', 'int', 'long', 'move', 'mul', 'neg', 'new', 'nop', 'not', 'or', 'rem', 'return', 'shl', 'shr', 'sput', 'sub', 'throw', 'ushr', 'xor'];
	  var smali_instr_high_prio = ['aget', 'aput', 'array', 'check', 'execute', 'fill', 'filled', 'goto/16', 'goto/32', 'iget', 'instance', 'invoke', 'iput', 'monitor', 'packed', 'sget', 'sparse'];
	  var smali_keywords = ['transient', 'constructor', 'abstract', 'final', 'synthetic', 'public', 'private', 'protected', 'static', 'bridge', 'system'];
	  return {
	    aliases: ['smali'],
	    contains: [
	      {
	        className: 'string',
	        begin: '"', end: '"',
	        relevance: 0
	      },
	      hljs.COMMENT(
	        '#',
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      {
	        className: 'keyword',
	        begin: '\\s*\\.end\\s[a-zA-Z0-9]*',
	        relevance: 1
	      },
	      {
	        className: 'keyword',
	        begin: '^[ ]*\\.[a-zA-Z]*',
	        relevance: 0
	      },
	      {
	        className: 'keyword',
	        begin: '\\s:[a-zA-Z_0-9]*',
	        relevance: 0
	      },
	      {
	        className: 'keyword',
	        begin: '\\s('+smali_keywords.join('|')+')',
	        relevance: 1
	      },
	      {
	        className: 'keyword',
	        begin: '\\[',
	        relevance: 0
	      },
	      {
	        className: 'instruction',
	        begin: '\\s('+smali_instr_low_prio.join('|')+')\\s',
	        relevance: 1
	      },
	      {
	        className: 'instruction',
	        begin: '\\s('+smali_instr_low_prio.join('|')+')((\\-|/)[a-zA-Z0-9]+)+\\s',
	        relevance: 10
	      },
	      {
	        className: 'instruction',
	        begin: '\\s('+smali_instr_high_prio.join('|')+')((\\-|/)[a-zA-Z0-9]+)*\\s',
	        relevance: 10
	      },
	      {
	        className: 'class',
	        begin: 'L[^\(;:\n]*;',
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: '( |->)[^(\n ;"]*\\(',
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: '\\)',
	        relevance: 0
	      },
	      {
	        className: 'variable',
	        begin: '[vp][0-9]+',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var VAR_IDENT_RE = '[a-z][a-zA-Z0-9_]*';
	  var CHAR = {
	    className: 'char',
	    begin: '\\$.{1}'
	  };
	  var SYMBOL = {
	    className: 'symbol',
	    begin: '#' + hljs.UNDERSCORE_IDENT_RE
	  };
	  return {
	    aliases: ['st'],
	    keywords: 'self super nil true false thisContext', // only 6
	    contains: [
	      hljs.COMMENT('"', '"'),
	      hljs.APOS_STRING_MODE,
	      {
	        className: 'class',
	        begin: '\\b[A-Z][A-Za-z0-9_]*',
	        relevance: 0
	      },
	      {
	        className: 'method',
	        begin: VAR_IDENT_RE + ':',
	        relevance: 0
	      },
	      hljs.C_NUMBER_MODE,
	      SYMBOL,
	      CHAR,
	      {
	        className: 'localvars',
	        // This looks more complicated than needed to avoid combinatorial
	        // explosion under V8. It effectively means `| var1 var2 ... |` with
	        // whitespace adjacent to `|` being optional.
	        begin: '\\|[ ]*' + VAR_IDENT_RE + '([ ]+' + VAR_IDENT_RE + ')*[ ]*\\|',
	        returnBegin: true, end: /\|/,
	        illegal: /\S/,
	        contains: [{begin: '(\\|[ ]*)?' + VAR_IDENT_RE}]
	      },
	      {
	        className: 'array',
	        begin: '\\#\\(', end: '\\)',
	        contains: [
	          hljs.APOS_STRING_MODE,
	          CHAR,
	          hljs.C_NUMBER_MODE,
	          SYMBOL
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 152 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['ml'],
	    keywords: {
	      keyword:
	        /* according to Definition of Standard ML 97  */
	        'abstype and andalso as case datatype do else end eqtype ' +
	        'exception fn fun functor handle if in include infix infixr ' +
	        'let local nonfix of op open orelse raise rec sharing sig ' +
	        'signature struct structure then type val with withtype where while',
	      built_in:
	        /* built-in types according to basis library */
	        'array bool char exn int list option order real ref string substring vector unit word',
	      literal:
	        'true false NONE SOME LESS EQUAL GREATER nil'
	    },
	    illegal: /\/\/|>>/,
	    lexemes: '[a-z_]\\w*!?',
	    contains: [
	      {
	        className: 'literal',
	        begin: '\\[(\\|\\|)?\\]|\\(\\)'
	      },
	      hljs.COMMENT(
	        '\\(\\*',
	        '\\*\\)',
	        {
	          contains: ['self']
	        }
	      ),
	      { /* type variable */
	        className: 'symbol',
	        begin: '\'[A-Za-z_](?!\')[\\w\']*'
	        /* the grammar is ambiguous on how 'a'b should be interpreted but not the compiler */
	      },
	      { /* polymorphic variant */
	        className: 'tag',
	        begin: '`[A-Z][\\w\']*'
	      },
	      { /* module or constructor */
	        className: 'type',
	        begin: '\\b[A-Z][\\w\']*',
	        relevance: 0
	      },
	      { /* don't color identifiers, but safely catch all identifiers with '*/
	        begin: '[a-z_]\\w*\'[\\w\']*'
	      },
	      hljs.inherit(hljs.APOS_STRING_MODE, {className: 'char', relevance: 0}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	      {
	        className: 'number',
	        begin:
	          '\\b(0[xX][a-fA-F0-9_]+[Lln]?|' +
	          '0[oO][0-7_]+[Lln]?|' +
	          '0[bB][01_]+[Lln]?|' +
	          '[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)',
	        relevance: 0
	      },
	      {
	        begin: /[-=]>/ // relevance booster
	      }
	    ]
	  };
	};

/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var allCommands = ['!', '-', '+', '!=', '%', '&&', '*', '/', '=', '==', '>', '>=', '<', '<=', 'or', 'plus', '^', ':', '>>', 'abs', 'accTime', 'acos', 'action', 'actionKeys', 'actionKeysImages', 'actionKeysNames', 'actionKeysNamesArray', 'actionName', 'activateAddons', 'activatedAddons', 'activateKey', 'addAction', 'addBackpack', 'addBackpackCargo', 'addBackpackCargoGlobal', 'addBackpackGlobal', 'addCamShake', 'addCuratorAddons', 'addCuratorCameraArea', 'addCuratorEditableObjects', 'addCuratorEditingArea', 'addCuratorPoints', 'addEditorObject', 'addEventHandler', 'addGoggles', 'addGroupIcon', 'addHandgunItem', 'addHeadgear', 'addItem', 'addItemCargo', 'addItemCargoGlobal', 'addItemPool', 'addItemToBackpack', 'addItemToUniform', 'addItemToVest', 'addLiveStats', 'addMagazine', 'addMagazine array', 'addMagazineAmmoCargo', 'addMagazineCargo', 'addMagazineCargoGlobal', 'addMagazineGlobal', 'addMagazinePool', 'addMagazines', 'addMagazineTurret', 'addMenu', 'addMenuItem', 'addMissionEventHandler', 'addMPEventHandler', 'addMusicEventHandler', 'addPrimaryWeaponItem', 'addPublicVariableEventHandler', 'addRating', 'addResources', 'addScore', 'addScoreSide', 'addSecondaryWeaponItem', 'addSwitchableUnit', 'addTeamMember', 'addToRemainsCollector', 'addUniform', 'addVehicle', 'addVest', 'addWaypoint', 'addWeapon', 'addWeaponCargo', 'addWeaponCargoGlobal', 'addWeaponGlobal', 'addWeaponPool', 'addWeaponTurret', 'agent', 'agents', 'AGLToASL', 'aimedAtTarget', 'aimPos', 'airDensityRTD', 'airportSide', 'AISFinishHeal', 'alive', 'allControls', 'allCurators', 'allDead', 'allDeadMen', 'allDisplays', 'allGroups', 'allMapMarkers', 'allMines', 'allMissionObjects', 'allow3DMode', 'allowCrewInImmobile', 'allowCuratorLogicIgnoreAreas', 'allowDamage', 'allowDammage', 'allowFileOperations', 'allowFleeing', 'allowGetIn', 'allPlayers', 'allSites', 'allTurrets', 'allUnits', 'allUnitsUAV', 'allVariables', 'ammo', 'and', 'animate', 'animateDoor', 'animationPhase', 'animationState', 'append', 'armoryPoints', 'arrayIntersect', 'asin', 'ASLToAGL', 'ASLToATL', 'assert', 'assignAsCargo', 'assignAsCargoIndex', 'assignAsCommander', 'assignAsDriver', 'assignAsGunner', 'assignAsTurret', 'assignCurator', 'assignedCargo', 'assignedCommander', 'assignedDriver', 'assignedGunner', 'assignedItems', 'assignedTarget', 'assignedTeam', 'assignedVehicle', 'assignedVehicleRole', 'assignItem', 'assignTeam', 'assignToAirport', 'atan', 'atan2', 'atg', 'ATLToASL', 'attachedObject', 'attachedObjects', 'attachedTo', 'attachObject', 'attachTo', 'attackEnabled', 'backpack', 'backpackCargo', 'backpackContainer', 'backpackItems', 'backpackMagazines', 'backpackSpaceFor', 'behaviour', 'benchmark', 'binocular', 'blufor', 'boundingBox', 'boundingBoxReal', 'boundingCenter', 'breakOut', 'breakTo', 'briefingName', 'buildingExit', 'buildingPos', 'buttonAction', 'buttonSetAction', 'cadetMode', 'call', 'callExtension', 'camCommand', 'camCommit', 'camCommitPrepared', 'camCommitted', 'camConstuctionSetParams', 'camCreate', 'camDestroy', 'cameraEffect', 'cameraEffectEnableHUD', 'cameraInterest', 'cameraOn', 'cameraView', 'campaignConfigFile', 'camPreload', 'camPreloaded', 'camPrepareBank', 'camPrepareDir', 'camPrepareDive', 'camPrepareFocus', 'camPrepareFov', 'camPrepareFovRange', 'camPreparePos', 'camPrepareRelPos', 'camPrepareTarget', 'camSetBank', 'camSetDir', 'camSetDive', 'camSetFocus', 'camSetFov', 'camSetFovRange', 'camSetPos', 'camSetRelPos', 'camSetTarget', 'camTarget', 'camUseNVG', 'canAdd', 'canAddItemToBackpack', 'canAddItemToUniform', 'canAddItemToVest', 'cancelSimpleTaskDestination', 'canFire', 'canMove', 'canSlingLoad', 'canStand', 'canUnloadInCombat', 'captive', 'captiveNum', 'case', 'catch', 'cbChecked', 'cbSetChecked', 'ceil', 'cheatsEnabled', 'checkAIFeature', 'civilian', 'className', 'clearAllItemsFromBackpack', 'clearBackpackCargo', 'clearBackpackCargoGlobal', 'clearGroupIcons', 'clearItemCargo', 'clearItemCargoGlobal', 'clearItemPool', 'clearMagazineCargo', 'clearMagazineCargoGlobal', 'clearMagazinePool', 'clearOverlay', 'clearRadio', 'clearWeaponCargo', 'clearWeaponCargoGlobal', 'clearWeaponPool', 'closeDialog', 'closeDisplay', 'closeOverlay', 'collapseObjectTree', 'combatMode', 'commandArtilleryFire', 'commandChat', 'commander', 'commandFire', 'commandFollow', 'commandFSM', 'commandGetOut', 'commandingMenu', 'commandMove', 'commandRadio', 'commandStop', 'commandTarget', 'commandWatch', 'comment', 'commitOverlay', 'compile', 'compileFinal', 'completedFSM', 'composeText', 'configClasses', 'configFile', 'configHierarchy', 'configName', 'configProperties', 'configSourceMod', 'configSourceModList', 'connectTerminalToUAV', 'controlNull', 'controlsGroupCtrl', 'copyFromClipboard', 'copyToClipboard', 'copyWaypoints', 'cos', 'count', 'countEnemy', 'countFriendly', 'countSide', 'countType', 'countUnknown', 'createAgent', 'createCenter', 'createDialog', 'createDiaryLink', 'createDiaryRecord', 'createDiarySubject', 'createDisplay', 'createGearDialog', 'createGroup', 'createGuardedPoint', 'createLocation', 'createMarker', 'createMarkerLocal', 'createMenu', 'createMine', 'createMissionDisplay', 'createSimpleTask', 'createSite', 'createSoundSource', 'createTask', 'createTeam', 'createTrigger', 'createUnit', 'createUnit array', 'createVehicle', 'createVehicle array', 'createVehicleCrew', 'createVehicleLocal', 'crew', 'ctrlActivate', 'ctrlAddEventHandler', 'ctrlAutoScrollDelay', 'ctrlAutoScrollRewind', 'ctrlAutoScrollSpeed', 'ctrlChecked', 'ctrlClassName', 'ctrlCommit', 'ctrlCommitted', 'ctrlCreate', 'ctrlDelete', 'ctrlEnable', 'ctrlEnabled', 'ctrlFade', 'ctrlHTMLLoaded', 'ctrlIDC', 'ctrlIDD', 'ctrlMapAnimAdd', 'ctrlMapAnimClear', 'ctrlMapAnimCommit', 'ctrlMapAnimDone', 'ctrlMapCursor', 'ctrlMapMouseOver', 'ctrlMapScale', 'ctrlMapScreenToWorld', 'ctrlMapWorldToScreen', 'ctrlModel', 'ctrlModelDirAndUp', 'ctrlModelScale', 'ctrlParent', 'ctrlPosition', 'ctrlRemoveAllEventHandlers', 'ctrlRemoveEventHandler', 'ctrlScale', 'ctrlSetActiveColor', 'ctrlSetAutoScrollDelay', 'ctrlSetAutoScrollRewind', 'ctrlSetAutoScrollSpeed', 'ctrlSetBackgroundColor', 'ctrlSetChecked', 'ctrlSetEventHandler', 'ctrlSetFade', 'ctrlSetFocus', 'ctrlSetFont', 'ctrlSetFontH1', 'ctrlSetFontH1B', 'ctrlSetFontH2', 'ctrlSetFontH2B', 'ctrlSetFontH3', 'ctrlSetFontH3B', 'ctrlSetFontH4', 'ctrlSetFontH4B', 'ctrlSetFontH5', 'ctrlSetFontH5B', 'ctrlSetFontH6', 'ctrlSetFontH6B', 'ctrlSetFontHeight', 'ctrlSetFontHeightH1', 'ctrlSetFontHeightH2', 'ctrlSetFontHeightH3', 'ctrlSetFontHeightH4', 'ctrlSetFontHeightH5', 'ctrlSetFontHeightH6', 'ctrlSetFontP', 'ctrlSetFontPB', 'ctrlSetForegroundColor', 'ctrlSetModel', 'ctrlSetModelDirAndUp', 'ctrlSetModelScale', 'ctrlSetPosition', 'ctrlSetScale', 'ctrlSetStructuredText', 'ctrlSetText', 'ctrlSetTextColor', 'ctrlSetTooltip', 'ctrlSetTooltipColorBox', 'ctrlSetTooltipColorShade', 'ctrlSetTooltipColorText', 'ctrlShow', 'ctrlShown', 'ctrlText', 'ctrlTextHeight', 'ctrlType', 'ctrlVisible', 'curatorAddons', 'curatorCamera', 'curatorCameraArea', 'curatorCameraAreaCeiling', 'curatorCoef', 'curatorEditableObjects', 'curatorEditingArea', 'curatorEditingAreaType', 'curatorMouseOver', 'curatorPoints', 'curatorRegisteredObjects', 'curatorSelected', 'curatorWaypointCost', 'currentChannel', 'currentCommand', 'currentMagazine', 'currentMagazineDetail', 'currentMagazineDetailTurret', 'currentMagazineTurret', 'currentMuzzle', 'currentNamespace', 'currentTask', 'currentTasks', 'currentThrowable', 'currentVisionMode', 'currentWaypoint', 'currentWeapon', 'currentWeaponMode', 'currentWeaponTurret', 'currentZeroing', 'cursorTarget', 'customChat', 'customRadio', 'cutFadeOut', 'cutObj', 'cutRsc', 'cutText', 'damage', 'date', 'dateToNumber', 'daytime', 'deActivateKey', 'debriefingText', 'debugFSM', 'debugLog', 'default', 'deg', 'deleteAt', 'deleteCenter', 'deleteCollection', 'deleteEditorObject', 'deleteGroup', 'deleteIdentity', 'deleteLocation', 'deleteMarker', 'deleteMarkerLocal', 'deleteRange', 'deleteResources', 'deleteSite', 'deleteStatus', 'deleteTeam', 'deleteVehicle', 'deleteVehicleCrew', 'deleteWaypoint', 'detach', 'detectedMines', 'diag activeMissionFSMs', 'diag activeSQFScripts', 'diag activeSQSScripts', 'diag captureFrame', 'diag captureSlowFrame', 'diag fps', 'diag fpsMin', 'diag frameNo', 'diag log', 'diag logSlowFrame', 'diag tickTime', 'dialog', 'diarySubjectExists', 'didJIP', 'didJIPOwner', 'difficulty', 'difficultyEnabled', 'difficultyEnabledRTD', 'direction', 'directSay', 'disableAI', 'disableCollisionWith', 'disableConversation', 'disableDebriefingStats', 'disableSerialization', 'disableTIEquipment', 'disableUAVConnectability', 'disableUserInput', 'displayAddEventHandler', 'displayCtrl', 'displayNull', 'displayRemoveAllEventHandlers', 'displayRemoveEventHandler', 'displaySetEventHandler', 'dissolveTeam', 'distance', 'distance2D', 'distanceSqr', 'distributionRegion', 'do', 'doArtilleryFire', 'doFire', 'doFollow', 'doFSM', 'doGetOut', 'doMove', 'doorPhase', 'doStop', 'doTarget', 'doWatch', 'drawArrow', 'drawEllipse', 'drawIcon', 'drawIcon3D', 'drawLine', 'drawLine3D', 'drawLink', 'drawLocation', 'drawRectangle', 'driver', 'drop', 'east', 'echo', 'editObject', 'editorSetEventHandler', 'effectiveCommander', 'else', 'emptyPositions', 'enableAI', 'enableAIFeature', 'enableAttack', 'enableCamShake', 'enableCaustics', 'enableCollisionWith', 'enableCopilot', 'enableDebriefingStats', 'enableDiagLegend', 'enableEndDialog', 'enableEngineArtillery', 'enableEnvironment', 'enableFatigue', 'enableGunLights', 'enableIRLasers', 'enableMimics', 'enablePersonTurret', 'enableRadio', 'enableReload', 'enableRopeAttach', 'enableSatNormalOnDetail', 'enableSaving', 'enableSentences', 'enableSimulation', 'enableSimulationGlobal', 'enableTeamSwitch', 'enableUAVConnectability', 'enableUAVWaypoints', 'endLoadingScreen', 'endMission', 'engineOn', 'enginesIsOnRTD', 'enginesRpmRTD', 'enginesTorqueRTD', 'entities', 'estimatedEndServerTime', 'estimatedTimeLeft', 'evalObjectArgument', 'everyBackpack', 'everyContainer', 'exec', 'execEditorScript', 'execFSM', 'execVM', 'exit', 'exitWith', 'exp', 'expectedDestination', 'eyeDirection', 'eyePos', 'face', 'faction', 'fadeMusic', 'fadeRadio', 'fadeSound', 'fadeSpeech', 'failMission', 'false', 'fillWeaponsFromPool', 'find', 'findCover', 'findDisplay', 'findEditorObject', 'findEmptyPosition', 'findEmptyPositionReady', 'findNearestEnemy', 'finishMissionInit', 'finite', 'fire', 'fireAtTarget', 'firstBackpack', 'flag', 'flagOwner', 'fleeing', 'floor', 'flyInHeight', 'fog', 'fogForecast', 'fogParams', 'for', 'forceAddUniform', 'forceEnd', 'forceMap', 'forceRespawn', 'forceSpeed', 'forceWalk', 'forceWeaponFire', 'forceWeatherChange', 'forEach', 'forEachMember', 'forEachMemberAgent', 'forEachMemberTeam', 'format', 'formation', 'formationDirection', 'formationLeader', 'formationMembers', 'formationPosition', 'formationTask', 'formatText', 'formLeader', 'freeLook', 'from', 'fromEditor', 'fuel', 'fullCrew', 'gearSlotAmmoCount', 'gearSlotData', 'getAllHitPointsDamage', 'getAmmoCargo', 'getArray', 'getArtilleryAmmo', 'getArtilleryComputerSettings', 'getArtilleryETA', 'getAssignedCuratorLogic', 'getAssignedCuratorUnit', 'getBackpackCargo', 'getBleedingRemaining', 'getBurningValue', 'getCargoIndex', 'getCenterOfMass', 'getClientState', 'getConnectedUAV', 'getDammage', 'getDescription', 'getDir', 'getDirVisual', 'getDLCs', 'getEditorCamera', 'getEditorMode', 'getEditorObjectScope', 'getElevationOffset', 'getFatigue', 'getFriend', 'getFSMVariable', 'getFuelCargo', 'getGroupIcon', 'getGroupIconParams', 'getGroupIcons', 'getHideFrom', 'getHit', 'getHitIndex', 'getHitPointDamage', 'getItemCargo', 'getMagazineCargo', 'getMarkerColor', 'getMarkerPos', 'getMarkerSize', 'getMarkerType', 'getMass', 'getModelInfo', 'getNumber', 'getObjectArgument', 'getObjectChildren', 'getObjectDLC', 'getObjectMaterials', 'getObjectProxy', 'getObjectTextures', 'getObjectType', 'getObjectViewDistance', 'getOxygenRemaining', 'getPersonUsedDLCs', 'getPlayerChannel', 'getPlayerUID', 'getPos', 'getPosASL', 'getPosASLVisual', 'getPosASLW', 'getPosATL', 'getPosATLVisual', 'getPosVisual', 'getPosWorld', 'getRepairCargo', 'getResolution', 'getShadowDistance', 'getSlingLoad', 'getSpeed', 'getSuppression', 'getTerrainHeightASL', 'getText', 'getVariable', 'getWeaponCargo', 'getWPPos', 'glanceAt', 'globalChat', 'globalRadio', 'goggles', 'goto', 'group', 'groupChat', 'groupFromNetId', 'groupIconSelectable', 'groupIconsVisible', 'groupId', 'groupOwner', 'groupRadio', 'groupSelectedUnits', 'groupSelectUnit', 'grpNull', 'gunner', 'gusts', 'halt', 'handgunItems', 'handgunMagazine', 'handgunWeapon', 'handsHit', 'hasInterface', 'hasWeapon', 'hcAllGroups', 'hcGroupParams', 'hcLeader', 'hcRemoveAllGroups', 'hcRemoveGroup', 'hcSelected', 'hcSelectGroup', 'hcSetGroup', 'hcShowBar', 'hcShownBar', 'headgear', 'hideBody', 'hideObject', 'hideObjectGlobal', 'hint', 'hintC', 'hintCadet', 'hintSilent', 'hmd', 'hostMission', 'htmlLoad', 'HUDMovementLevels', 'humidity', 'if', 'image', 'importAllGroups', 'importance', 'in', 'incapacitatedState', 'independent', 'inflame', 'inflamed', 'inGameUISetEventHandler', 'inheritsFrom', 'initAmbientLife', 'inputAction', 'inRangeOfArtillery', 'insertEditorObject', 'intersect', 'isAbleToBreathe', 'isAgent', 'isArray', 'isAutoHoverOn', 'isAutonomous', 'isAutotest', 'isBleeding', 'isBurning', 'isClass', 'isCollisionLightOn', 'isCopilotEnabled', 'isDedicated', 'isDLCAvailable', 'isEngineOn', 'isEqualTo', 'isFlashlightOn', 'isFlatEmpty', 'isForcedWalk', 'isFormationLeader', 'isHidden', 'isInRemainsCollector', 'isInstructorFigureEnabled', 'isIRLaserOn', 'isKeyActive', 'isKindOf', 'isLightOn', 'isLocalized', 'isManualFire', 'isMarkedForCollection', 'isMultiplayer', 'isNil', 'isNull', 'isNumber', 'isObjectHidden', 'isObjectRTD', 'isOnRoad', 'isPipEnabled', 'isPlayer', 'isRealTime', 'isServer', 'isShowing3DIcons', 'isSteamMission', 'isStreamFriendlyUIEnabled', 'isText', 'isTouchingGround', 'isTurnedOut', 'isTutHintsEnabled', 'isUAVConnectable', 'isUAVConnected', 'isUniformAllowed', 'isWalking', 'isWeaponDeployed', 'isWeaponRested', 'itemCargo', 'items', 'itemsWithMagazines', 'join', 'joinAs', 'joinAsSilent', 'joinSilent', 'joinString', 'kbAddDatabase', 'kbAddDatabaseTargets', 'kbAddTopic', 'kbHasTopic', 'kbReact', 'kbRemoveTopic', 'kbTell', 'kbWasSaid', 'keyImage', 'keyName', 'knowsAbout', 'land', 'landAt', 'landResult', 'language', 'laserTarget', 'lbAdd', 'lbClear', 'lbColor', 'lbCurSel', 'lbData', 'lbDelete', 'lbIsSelected', 'lbPicture', 'lbSelection', 'lbSetColor', 'lbSetCurSel', 'lbSetData', 'lbSetPicture', 'lbSetPictureColor', 'lbSetPictureColorDisabled', 'lbSetPictureColorSelected', 'lbSetSelectColor', 'lbSetSelectColorRight', 'lbSetSelected', 'lbSetTooltip', 'lbSetValue', 'lbSize', 'lbSort', 'lbSortByValue', 'lbText', 'lbValue', 'leader', 'leaderboardDeInit', 'leaderboardGetRows', 'leaderboardInit', 'leaveVehicle', 'libraryCredits', 'libraryDisclaimers', 'lifeState', 'lightAttachObject', 'lightDetachObject', 'lightIsOn', 'lightnings', 'limitSpeed', 'linearConversion', 'lineBreak', 'lineIntersects', 'lineIntersectsObjs', 'lineIntersectsSurfaces', 'lineIntersectsWith', 'linkItem', 'list', 'listObjects', 'ln', 'lnbAddArray', 'lnbAddColumn', 'lnbAddRow', 'lnbClear', 'lnbColor', 'lnbCurSelRow', 'lnbData', 'lnbDeleteColumn', 'lnbDeleteRow', 'lnbGetColumnsPosition', 'lnbPicture', 'lnbSetColor', 'lnbSetColumnsPos', 'lnbSetCurSelRow', 'lnbSetData', 'lnbSetPicture', 'lnbSetText', 'lnbSetValue', 'lnbSize', 'lnbText', 'lnbValue', 'load', 'loadAbs', 'loadBackpack', 'loadFile', 'loadGame', 'loadIdentity', 'loadMagazine', 'loadOverlay', 'loadStatus', 'loadUniform', 'loadVest', 'local', 'localize', 'locationNull', 'locationPosition', 'lock', 'lockCameraTo', 'lockCargo', 'lockDriver', 'locked', 'lockedCargo', 'lockedDriver', 'lockedTurret', 'lockTurret', 'lockWP', 'log', 'logEntities', 'lookAt', 'lookAtPos', 'magazineCargo', 'magazines', 'magazinesAllTurrets', 'magazinesAmmo', 'magazinesAmmoCargo', 'magazinesAmmoFull', 'magazinesDetail', 'magazinesDetailBackpack', 'magazinesDetailUniform', 'magazinesDetailVest', 'magazinesTurret', 'magazineTurretAmmo', 'mapAnimAdd', 'mapAnimClear', 'mapAnimCommit', 'mapAnimDone', 'mapCenterOnCamera', 'mapGridPosition', 'markAsFinishedOnSteam', 'markerAlpha', 'markerBrush', 'markerColor', 'markerDir', 'markerPos', 'markerShape', 'markerSize', 'markerText', 'markerType', 'max', 'members', 'min', 'mineActive', 'mineDetectedBy', 'missionConfigFile', 'missionName', 'missionNamespace', 'missionStart', 'mod', 'modelToWorld', 'modelToWorldVisual', 'moonIntensity', 'morale', 'move', 'moveInAny', 'moveInCargo', 'moveInCommander', 'moveInDriver', 'moveInGunner', 'moveInTurret', 'moveObjectToEnd', 'moveOut', 'moveTime', 'moveTo', 'moveToCompleted', 'moveToFailed', 'musicVolume', 'name', 'name location', 'nameSound', 'nearEntities', 'nearestBuilding', 'nearestLocation', 'nearestLocations', 'nearestLocationWithDubbing', 'nearestObject', 'nearestObjects', 'nearObjects', 'nearObjectsReady', 'nearRoads', 'nearSupplies', 'nearTargets', 'needReload', 'netId', 'netObjNull', 'newOverlay', 'nextMenuItemIndex', 'nextWeatherChange', 'nil', 'nMenuItems', 'not', 'numberToDate', 'objectCurators', 'objectFromNetId', 'objectParent', 'objNull', 'objStatus', 'onBriefingGroup', 'onBriefingNotes', 'onBriefingPlan', 'onBriefingTeamSwitch', 'onCommandModeChanged', 'onDoubleClick', 'onEachFrame', 'onGroupIconClick', 'onGroupIconOverEnter', 'onGroupIconOverLeave', 'onHCGroupSelectionChanged', 'onMapSingleClick', 'onPlayerConnected', 'onPlayerDisconnected', 'onPreloadFinished', 'onPreloadStarted', 'onShowNewObject', 'onTeamSwitch', 'openCuratorInterface', 'openMap', 'openYoutubeVideo', 'opfor', 'or', 'orderGetIn', 'overcast', 'overcastForecast', 'owner', 'param', 'params', 'parseNumber', 'parseText', 'parsingNamespace', 'particlesQuality', 'pi', 'pickWeaponPool', 'pitch', 'playableSlotsNumber', 'playableUnits', 'playAction', 'playActionNow', 'player', 'playerRespawnTime', 'playerSide', 'playersNumber', 'playGesture', 'playMission', 'playMove', 'playMoveNow', 'playMusic', 'playScriptedMission', 'playSound', 'playSound3D', 'position', 'positionCameraToWorld', 'posScreenToWorld', 'posWorldToScreen', 'ppEffectAdjust', 'ppEffectCommit', 'ppEffectCommitted', 'ppEffectCreate', 'ppEffectDestroy', 'ppEffectEnable', 'ppEffectForceInNVG', 'precision', 'preloadCamera', 'preloadObject', 'preloadSound', 'preloadTitleObj', 'preloadTitleRsc', 'preprocessFile', 'preprocessFileLineNumbers', 'primaryWeapon', 'primaryWeaponItems', 'primaryWeaponMagazine', 'priority', 'private', 'processDiaryLink', 'productVersion', 'profileName', 'profileNamespace', 'profileNameSteam', 'progressLoadingScreen', 'progressPosition', 'progressSetPosition', 'publicVariable', 'publicVariableClient', 'publicVariableServer', 'pushBack', 'putWeaponPool', 'queryItemsPool', 'queryMagazinePool', 'queryWeaponPool', 'rad', 'radioChannelAdd', 'radioChannelCreate', 'radioChannelRemove', 'radioChannelSetCallSign', 'radioChannelSetLabel', 'radioVolume', 'rain', 'rainbow', 'random', 'rank', 'rankId', 'rating', 'rectangular', 'registeredTasks', 'registerTask', 'reload', 'reloadEnabled', 'remoteControl', 'remoteExec', 'remoteExecCall', 'removeAction', 'removeAllActions', 'removeAllAssignedItems', 'removeAllContainers', 'removeAllCuratorAddons', 'removeAllCuratorCameraAreas', 'removeAllCuratorEditingAreas', 'removeAllEventHandlers', 'removeAllHandgunItems', 'removeAllItems', 'removeAllItemsWithMagazines', 'removeAllMissionEventHandlers', 'removeAllMPEventHandlers', 'removeAllMusicEventHandlers', 'removeAllPrimaryWeaponItems', 'removeAllWeapons', 'removeBackpack', 'removeBackpackGlobal', 'removeCuratorAddons', 'removeCuratorCameraArea', 'removeCuratorEditableObjects', 'removeCuratorEditingArea', 'removeDrawIcon', 'removeDrawLinks', 'removeEventHandler', 'removeFromRemainsCollector', 'removeGoggles', 'removeGroupIcon', 'removeHandgunItem', 'removeHeadgear', 'removeItem', 'removeItemFromBackpack', 'removeItemFromUniform', 'removeItemFromVest', 'removeItems', 'removeMagazine', 'removeMagazineGlobal', 'removeMagazines', 'removeMagazinesTurret', 'removeMagazineTurret', 'removeMenuItem', 'removeMissionEventHandler', 'removeMPEventHandler', 'removeMusicEventHandler', 'removePrimaryWeaponItem', 'removeSecondaryWeaponItem', 'removeSimpleTask', 'removeSwitchableUnit', 'removeTeamMember', 'removeUniform', 'removeVest', 'removeWeapon', 'removeWeaponGlobal', 'removeWeaponTurret', 'requiredVersion', 'resetCamShake', 'resetSubgroupDirection', 'resistance', 'resize', 'resources', 'respawnVehicle', 'restartEditorCamera', 'reveal', 'revealMine', 'reverse', 'reversedMouseY', 'roadsConnectedTo', 'roleDescription', 'ropeAttachedObjects', 'ropeAttachedTo', 'ropeAttachEnabled', 'ropeAttachTo', 'ropeCreate', 'ropeCut', 'ropeEndPosition', 'ropeLength', 'ropes', 'ropeUnwind', 'ropeUnwound', 'rotorsForcesRTD', 'rotorsRpmRTD', 'round', 'runInitScript', 'safeZoneH', 'safeZoneW', 'safeZoneWAbs', 'safeZoneX', 'safeZoneXAbs', 'safeZoneY', 'saveGame', 'saveIdentity', 'saveJoysticks', 'saveOverlay', 'saveProfileNamespace', 'saveStatus', 'saveVar', 'savingEnabled', 'say', 'say2D', 'say3D', 'scopeName', 'score', 'scoreSide', 'screenToWorld', 'scriptDone', 'scriptName', 'scriptNull', 'scudState', 'secondaryWeapon', 'secondaryWeaponItems', 'secondaryWeaponMagazine', 'select', 'selectBestPlaces', 'selectDiarySubject', 'selectedEditorObjects', 'selectEditorObject', 'selectionPosition', 'selectLeader', 'selectNoPlayer', 'selectPlayer', 'selectWeapon', 'selectWeaponTurret', 'sendAUMessage', 'sendSimpleCommand', 'sendTask', 'sendTaskResult', 'sendUDPMessage', 'serverCommand', 'serverCommandAvailable', 'serverCommandExecutable', 'serverName', 'serverTime', 'set', 'setAccTime', 'setAirportSide', 'setAmmo', 'setAmmoCargo', 'setAperture', 'setApertureNew', 'setArmoryPoints', 'setAttributes', 'setAutonomous', 'setBehaviour', 'setBleedingRemaining', 'setCameraInterest', 'setCamShakeDefParams', 'setCamShakeParams', 'setCamUseTi', 'setCaptive', 'setCenterOfMass', 'setCollisionLight', 'setCombatMode', 'setCompassOscillation', 'setCuratorCameraAreaCeiling', 'setCuratorCoef', 'setCuratorEditingAreaType', 'setCuratorWaypointCost', 'setCurrentChannel', 'setCurrentTask', 'setCurrentWaypoint', 'setDamage', 'setDammage', 'setDate', 'setDebriefingText', 'setDefaultCamera', 'setDestination', 'setDetailMapBlendPars', 'setDir', 'setDirection', 'setDrawIcon', 'setDropInterval', 'setEditorMode', 'setEditorObjectScope', 'setEffectCondition', 'setFace', 'setFaceAnimation', 'setFatigue', 'setFlagOwner', 'setFlagSide', 'setFlagTexture', 'setFog', 'setFog array', 'setFormation', 'setFormationTask', 'setFormDir', 'setFriend', 'setFromEditor', 'setFSMVariable', 'setFuel', 'setFuelCargo', 'setGroupIcon', 'setGroupIconParams', 'setGroupIconsSelectable', 'setGroupIconsVisible', 'setGroupId', 'setGroupIdGlobal', 'setGroupOwner', 'setGusts', 'setHideBehind', 'setHit', 'setHitIndex', 'setHitPointDamage', 'setHorizonParallaxCoef', 'setHUDMovementLevels', 'setIdentity', 'setImportance', 'setLeader', 'setLightAmbient', 'setLightAttenuation', 'setLightBrightness', 'setLightColor', 'setLightDayLight', 'setLightFlareMaxDistance', 'setLightFlareSize', 'setLightIntensity', 'setLightnings', 'setLightUseFlare', 'setLocalWindParams', 'setMagazineTurretAmmo', 'setMarkerAlpha', 'setMarkerAlphaLocal', 'setMarkerBrush', 'setMarkerBrushLocal', 'setMarkerColor', 'setMarkerColorLocal', 'setMarkerDir', 'setMarkerDirLocal', 'setMarkerPos', 'setMarkerPosLocal', 'setMarkerShape', 'setMarkerShapeLocal', 'setMarkerSize', 'setMarkerSizeLocal', 'setMarkerText', 'setMarkerTextLocal', 'setMarkerType', 'setMarkerTypeLocal', 'setMass', 'setMimic', 'setMousePosition', 'setMusicEffect', 'setMusicEventHandler', 'setName', 'setNameSound', 'setObjectArguments', 'setObjectMaterial', 'setObjectProxy', 'setObjectTexture', 'setObjectTextureGlobal', 'setObjectViewDistance', 'setOvercast', 'setOwner', 'setOxygenRemaining', 'setParticleCircle', 'setParticleClass', 'setParticleFire', 'setParticleParams', 'setParticleRandom', 'setPilotLight', 'setPiPEffect', 'setPitch', 'setPlayable', 'setPlayerRespawnTime', 'setPos', 'setPosASL', 'setPosASL2', 'setPosASLW', 'setPosATL', 'setPosition', 'setPosWorld', 'setRadioMsg', 'setRain', 'setRainbow', 'setRandomLip', 'setRank', 'setRectangular', 'setRepairCargo', 'setShadowDistance', 'setSide', 'setSimpleTaskDescription', 'setSimpleTaskDestination', 'setSimpleTaskTarget', 'setSimulWeatherLayers', 'setSize', 'setSkill', 'setSkill array', 'setSlingLoad', 'setSoundEffect', 'setSpeaker', 'setSpeech', 'setSpeedMode', 'setStatValue', 'setSuppression', 'setSystemOfUnits', 'setTargetAge', 'setTaskResult', 'setTaskState', 'setTerrainGrid', 'setText', 'setTimeMultiplier', 'setTitleEffect', 'setTriggerActivation', 'setTriggerArea', 'setTriggerStatements', 'setTriggerText', 'setTriggerTimeout', 'setTriggerType', 'setType', 'setUnconscious', 'setUnitAbility', 'setUnitPos', 'setUnitPosWeak', 'setUnitRank', 'setUnitRecoilCoefficient', 'setUnloadInCombat', 'setUserActionText', 'setVariable', 'setVectorDir', 'setVectorDirAndUp', 'setVectorUp', 'setVehicleAmmo', 'setVehicleAmmoDef', 'setVehicleArmor', 'setVehicleId', 'setVehicleLock', 'setVehiclePosition', 'setVehicleTiPars', 'setVehicleVarName', 'setVelocity', 'setVelocityTransformation', 'setViewDistance', 'setVisibleIfTreeCollapsed', 'setWaves', 'setWaypointBehaviour', 'setWaypointCombatMode', 'setWaypointCompletionRadius', 'setWaypointDescription', 'setWaypointFormation', 'setWaypointHousePosition', 'setWaypointLoiterRadius', 'setWaypointLoiterType', 'setWaypointName', 'setWaypointPosition', 'setWaypointScript', 'setWaypointSpeed', 'setWaypointStatements', 'setWaypointTimeout', 'setWaypointType', 'setWaypointVisible', 'setWeaponReloadingTime', 'setWind', 'setWindDir', 'setWindForce', 'setWindStr', 'setWPPos', 'show3DIcons', 'showChat', 'showCinemaBorder', 'showCommandingMenu', 'showCompass', 'showCuratorCompass', 'showGPS', 'showHUD', 'showLegend', 'showMap', 'shownArtilleryComputer', 'shownChat', 'shownCompass', 'shownCuratorCompass', 'showNewEditorObject', 'shownGPS', 'shownHUD', 'shownMap', 'shownPad', 'shownRadio', 'shownUAVFeed', 'shownWarrant', 'shownWatch', 'showPad', 'showRadio', 'showSubtitles', 'showUAVFeed', 'showWarrant', 'showWatch', 'showWaypoint', 'side', 'sideChat', 'sideEnemy', 'sideFriendly', 'sideLogic', 'sideRadio', 'sideUnknown', 'simpleTasks', 'simulationEnabled', 'simulCloudDensity', 'simulCloudOcclusion', 'simulInClouds', 'simulWeatherSync', 'sin', 'size', 'sizeOf', 'skill', 'skillFinal', 'skipTime', 'sleep', 'sliderPosition', 'sliderRange', 'sliderSetPosition', 'sliderSetRange', 'sliderSetSpeed', 'sliderSpeed', 'slingLoadAssistantShown', 'soldierMagazines', 'someAmmo', 'sort', 'soundVolume', 'spawn', 'speaker', 'speed', 'speedMode', 'splitString', 'sqrt', 'squadParams', 'stance', 'startLoadingScreen', 'step', 'stop', 'stopped', 'str', 'sunOrMoon', 'supportInfo', 'suppressFor', 'surfaceIsWater', 'surfaceNormal', 'surfaceType', 'swimInDepth', 'switch', 'switchableUnits', 'switchAction', 'switchCamera', 'switchGesture', 'switchLight', 'switchMove', 'synchronizedObjects', 'synchronizedTriggers', 'synchronizedWaypoints', 'synchronizeObjectsAdd', 'synchronizeObjectsRemove', 'synchronizeTrigger', 'synchronizeWaypoint', 'synchronizeWaypoint trigger', 'systemChat', 'systemOfUnits', 'tan', 'targetKnowledge', 'targetsAggregate', 'targetsQuery', 'taskChildren', 'taskCompleted', 'taskDescription', 'taskDestination', 'taskHint', 'taskNull', 'taskParent', 'taskResult', 'taskState', 'teamMember', 'teamMemberNull', 'teamName', 'teams', 'teamSwitch', 'teamSwitchEnabled', 'teamType', 'terminate', 'terrainIntersect', 'terrainIntersectASL', 'text', 'text location', 'textLog', 'textLogFormat', 'tg', 'then', 'throw', 'time', 'timeMultiplier', 'titleCut', 'titleFadeOut', 'titleObj', 'titleRsc', 'titleText', 'to', 'toArray', 'toLower', 'toString', 'toUpper', 'triggerActivated', 'triggerActivation', 'triggerArea', 'triggerAttachedVehicle', 'triggerAttachObject', 'triggerAttachVehicle', 'triggerStatements', 'triggerText', 'triggerTimeout', 'triggerTimeoutCurrent', 'triggerType', 'true', 'try', 'turretLocal', 'turretOwner', 'turretUnit', 'tvAdd', 'tvClear', 'tvCollapse', 'tvCount', 'tvCurSel', 'tvData', 'tvDelete', 'tvExpand', 'tvPicture', 'tvSetCurSel', 'tvSetData', 'tvSetPicture', 'tvSetPictureColor', 'tvSetTooltip', 'tvSetValue', 'tvSort', 'tvSortByValue', 'tvText', 'tvValue', 'type', 'typeName', 'typeOf', 'UAVControl', 'uiNamespace', 'uiSleep', 'unassignCurator', 'unassignItem', 'unassignTeam', 'unassignVehicle', 'underwater', 'uniform', 'uniformContainer', 'uniformItems', 'uniformMagazines', 'unitAddons', 'unitBackpack', 'unitPos', 'unitReady', 'unitRecoilCoefficient', 'units', 'unitsBelowHeight', 'unlinkItem', 'unlockAchievement', 'unregisterTask', 'updateDrawIcon', 'updateMenuItem', 'updateObjectTree', 'useAudioTimeForMoves', 'vectorAdd', 'vectorCos', 'vectorCrossProduct', 'vectorDiff', 'vectorDir', 'vectorDirVisual', 'vectorDistance', 'vectorDistanceSqr', 'vectorDotProduct', 'vectorFromTo', 'vectorMagnitude', 'vectorMagnitudeSqr', 'vectorMultiply', 'vectorNormalized', 'vectorUp', 'vectorUpVisual', 'vehicle', 'vehicleChat', 'vehicleRadio', 'vehicles', 'vehicleVarName', 'velocity', 'velocityModelSpace', 'verifySignature', 'vest', 'vestContainer', 'vestItems', 'vestMagazines', 'viewDistance', 'visibleCompass', 'visibleGPS', 'visibleMap', 'visiblePosition', 'visiblePositionASL', 'visibleWatch', 'waitUntil', 'waves', 'waypointAttachedObject', 'waypointAttachedVehicle', 'waypointAttachObject', 'waypointAttachVehicle', 'waypointBehaviour', 'waypointCombatMode', 'waypointCompletionRadius', 'waypointDescription', 'waypointFormation', 'waypointHousePosition', 'waypointLoiterRadius', 'waypointLoiterType', 'waypointName', 'waypointPosition', 'waypoints', 'waypointScript', 'waypointsEnabledUAV', 'waypointShow', 'waypointSpeed', 'waypointStatements', 'waypointTimeout', 'waypointTimeoutCurrent', 'waypointType', 'waypointVisible', 'weaponAccessories', 'weaponCargo', 'weaponDirection', 'weaponLowered', 'weapons', 'weaponsItems', 'weaponsItemsCargo', 'weaponState', 'weaponsTurret', 'weightRTD', 'west', 'WFSideText', 'while', 'wind', 'windDir', 'windStr', 'wingsForcesRTD', 'with', 'worldName', 'worldSize', 'worldToModel', 'worldToModelVisual', 'worldToScreen'];
	  var control = ['case', 'catch', 'default', 'do', 'else', 'exit', 'exitWith|5', 'for', 'forEach', 'from', 'if', 'switch', 'then', 'throw', 'to', 'try', 'while', 'with'];
	  var operators = ['!', '-', '+', '!=', '%', '&&', '*', '/', '=', '==', '>', '>=', '<', '<=', '^', ':', '>>'];
	  var specials = ['_forEachIndex|10', '_this|10', '_x|10'];
	  var literals = ['true', 'false', 'nil'];
	  var builtins = allCommands.filter(function (command) {
	    return control.indexOf(command) == -1 &&
	        literals.indexOf(command) == -1 &&
	        operators.indexOf(command) == -1;
	  });
	  //Note: operators will not be treated as builtins due to the lexeme rules
	  builtins = builtins.concat(specials);

	  // In SQF strings, quotes matching the start are escaped by adding a consecutive.
	  // Example of single escaped quotes: " "" " and  ' '' '.
	  var STRINGS = {
	    className: 'string',
	    relevance: 0,
	    variants: [
	      {
	        begin: '"',
	        end: '"',
	        contains: [{begin: '""'}]
	      },
	      {
	        begin: '\'',
	        end: '\'',
	        contains: [{begin: '\'\''}]
	      }
	    ]
	  };

	  var NUMBERS = {
	    className: 'number',
	    begin: hljs.NUMBER_RE,
	    relevance: 0
	  };

	  // Preprocessor definitions borrowed from C++
	  var PREPROCESSOR_STRINGS = {
	    className: 'string',
	    variants: [
	      hljs.QUOTE_STRING_MODE,
	      {
	        begin: '\'\\\\?.', end: '\'',
	        illegal: '.'
	      }
	    ]
	  };

	  var PREPROCESSOR =       {
	    className: 'preprocessor',
	    begin: '#', end: '$',
	    keywords: 'if else elif endif define undef warning error line ' +
	              'pragma ifdef ifndef',
	    contains: [
	      {
	        begin: /\\\n/, relevance: 0
	      },
	      {
	        beginKeywords: 'include', end: '$',
	        contains: [
	          PREPROCESSOR_STRINGS,
	          {
	            className: 'string',
	            begin: '<', end: '>',
	            illegal: '\\n',
	          }
	        ]
	      },
	      PREPROCESSOR_STRINGS,
	      NUMBERS,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE
	    ]
	  };

	  return {
	    aliases: ['sqf'],
	    case_insensitive: true,
	    keywords: {
	      keyword: control.join(' '),
	      built_in: builtins.join(' '),
	      literal: literals.join(' ')
	    },
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      NUMBERS,
	      STRINGS,
	      PREPROCESSOR
	    ]
	  };
	};

/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMENT_MODE = hljs.COMMENT('--', '$');
	  return {
	    case_insensitive: true,
	    illegal: /[<>{}*]/,
	    contains: [
	      {
	        className: 'operator',
	        beginKeywords:
	          'begin end start commit rollback savepoint lock alter create drop rename call ' +
	          'delete do handler insert load replace select truncate update set show pragma grant ' +
	          'merge describe use explain help declare prepare execute deallocate release ' +
	          'unlock purge reset change stop analyze cache flush optimize repair kill ' +
	          'install uninstall checksum restore check backup revoke',
	        end: /;/, endsWithParent: true,
	        keywords: {
	          keyword:
	            'abort abs absolute acc acce accep accept access accessed accessible account acos action activate add ' +
	            'addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias ' +
	            'allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply ' +
	            'archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan ' +
	            'atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid ' +
	            'authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile ' +
	            'before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float ' +
	            'binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound ' +
	            'buffer_cache buffer_pool build bulk by byte byteordermark bytes c cache caching call calling cancel ' +
	            'capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base ' +
	            'char_length character_length characters characterset charindex charset charsetform charsetid check ' +
	            'checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close ' +
	            'cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation ' +
	            'collect colu colum column column_value columns columns_updated comment commit compact compatibility ' +
	            'compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn ' +
	            'connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection ' +
	            'consider consistent constant constraint constraints constructor container content contents context ' +
	            'contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost ' +
	            'count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation ' +
	            'critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user ' +
	            'cursor curtime customdatum cycle d data database databases datafile datafiles datalength date_add ' +
	            'date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts ' +
	            'day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate ' +
	            'declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults ' +
	            'deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank ' +
	            'depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor ' +
	            'deterministic diagnostics difference dimension direct_load directory disable disable_all ' +
	            'disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div ' +
	            'do document domain dotnet double downgrade drop dumpfile duplicate duration e each edition editionable ' +
	            'editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt ' +
	            'end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors ' +
	            'escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding ' +
	            'execu execut execute exempt exists exit exp expire explain export export_set extended extent external ' +
	            'external_1 external_2 externally extract f failed failed_login_attempts failover failure far fast ' +
	            'feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final ' +
	            'finish first first_value fixed flash_cache flashback floor flush following follows for forall force ' +
	            'form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ' +
	            'ftp full function g general generated get get_format get_lock getdate getutcdate global global_name ' +
	            'globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups ' +
	            'gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex ' +
	            'hierarchy high high_priority hosts hour http i id ident_current ident_incr ident_seed identified ' +
	            'identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment ' +
	            'index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile ' +
	            'initial initialized initially initrans inmemory inner innodb input insert install instance instantiable ' +
	            'instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat ' +
	            'is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists ' +
	            'k keep keep_duplicates key keys kill l language large last last_day last_insert_id last_value lax lcase ' +
	            'lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit ' +
	            'lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate ' +
	            'locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call ' +
	            'logoff logon logs long loop low low_priority lower lpad lrtrim ltrim m main make_set makedate maketime ' +
	            'managed management manual map mapping mask master master_pos_wait match matched materialized max ' +
	            'maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans ' +
	            'md5 measures median medium member memcompress memory merge microsecond mid migration min minextents ' +
	            'minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month ' +
	            'months mount move movement multiset mutex n name name_const names nan national native natural nav nchar ' +
	            'nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile ' +
	            'nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile ' +
	            'nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder ' +
	            'nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck ' +
	            'noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe ' +
	            'nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ' +
	            'ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old ' +
	            'on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date ' +
	            'oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary ' +
	            'out outer outfile outline output over overflow overriding p package pad parallel parallel_enable ' +
	            'parameters parent parse partial partition partitions pascal passing password password_grace_time ' +
	            'password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex ' +
	            'pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc ' +
	            'performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin ' +
	            'policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction ' +
	            'prediction_cost prediction_details prediction_probability prediction_set prepare present preserve ' +
	            'prior priority private private_sga privileges procedural procedure procedure_analyze processlist ' +
	            'profiles project prompt protection public publishingservername purge quarter query quick quiesce quota ' +
	            'quotename radians raise rand range rank raw read reads readsize rebuild record records ' +
	            'recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh ' +
	            'regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy ' +
	            'reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename ' +
	            'repair repeat replace replicate replication required reset resetlogs resize resource respect restore ' +
	            'restricted result result_cache resumable resume retention return returning returns reuse reverse revoke ' +
	            'right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows ' +
	            'rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll ' +
	            'sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment select ' +
	            'self sequence sequential serializable server servererror session session_user sessions_per_user set ' +
	            'sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor ' +
	            'si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin ' +
	            'size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex ' +
	            'source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows ' +
	            'sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone ' +
	            'standby start starting startup statement static statistics stats_binomial_test stats_crosstab ' +
	            'stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep ' +
	            'stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev ' +
	            'stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate ' +
	            'subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum ' +
	            'suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate ' +
	            'sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime t table tables tablespace tan tdo ' +
	            'template temporary terminated tertiary_weights test than then thread through tier ties time time_format ' +
	            'time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr ' +
	            'timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking ' +
	            'transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate ' +
	            'try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress ' +
	            'under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot ' +
	            'unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert ' +
	            'url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date ' +
	            'utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var ' +
	            'var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray ' +
	            'verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear ' +
	            'wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped ' +
	            'xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces ' +
	            'xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek',
	          literal:
	            'true false null',
	          built_in:
	            'array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number ' +
	            'numeric real record serial serial8 smallint text varchar varying void'
	        },
	        contains: [
	          {
	            className: 'string',
	            begin: '\'', end: '\'',
	            contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}]
	          },
	          {
	            className: 'string',
	            begin: '"', end: '"',
	            contains: [hljs.BACKSLASH_ESCAPE, {begin: '""'}]
	          },
	          {
	            className: 'string',
	            begin: '`', end: '`',
	            contains: [hljs.BACKSLASH_ESCAPE]
	          },
	          hljs.C_NUMBER_MODE,
	          hljs.C_BLOCK_COMMENT_MODE,
	          COMMENT_MODE
	        ]
	      },
	      hljs.C_BLOCK_COMMENT_MODE,
	      COMMENT_MODE
	    ]
	  };
	};

/***/ },
/* 155 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['do', 'ado'],
	    case_insensitive: true,
	    keywords: 'if else in foreach for forv forva forval forvalu forvalue forvalues by bys bysort xi quietly qui capture about ac ac_7 acprplot acprplot_7 adjust ado adopath adoupdate alpha ameans an ano anov anova anova_estat anova_terms anovadef aorder ap app appe appen append arch arch_dr arch_estat arch_p archlm areg areg_p args arima arima_dr arima_estat arima_p as asmprobit asmprobit_estat asmprobit_lf asmprobit_mfx__dlg asmprobit_p ass asse asser assert avplot avplot_7 avplots avplots_7 bcskew0 bgodfrey binreg bip0_lf biplot bipp_lf bipr_lf bipr_p biprobit bitest bitesti bitowt blogit bmemsize boot bootsamp bootstrap bootstrap_8 boxco_l boxco_p boxcox boxcox_6 boxcox_p bprobit br break brier bro brow brows browse brr brrstat bs bs_7 bsampl_w bsample bsample_7 bsqreg bstat bstat_7 bstat_8 bstrap bstrap_7 ca ca_estat ca_p cabiplot camat canon canon_8 canon_8_p canon_estat canon_p cap caprojection capt captu captur capture cat cc cchart cchart_7 cci cd censobs_table centile cf char chdir checkdlgfiles checkestimationsample checkhlpfiles checksum chelp ci cii cl class classutil clear cli clis clist clo clog clog_lf clog_p clogi clogi_sw clogit clogit_lf clogit_p clogitp clogl_sw cloglog clonevar clslistarray cluster cluster_measures cluster_stop cluster_tree cluster_tree_8 clustermat cmdlog cnr cnre cnreg cnreg_p cnreg_sw cnsreg codebook collaps4 collapse colormult_nb colormult_nw compare compress conf confi confir confirm conren cons const constr constra constrai constrain constraint continue contract copy copyright copysource cor corc corr corr2data corr_anti corr_kmo corr_smc corre correl correla correlat correlate corrgram cou coun count cox cox_p cox_sw coxbase coxhaz coxvar cprplot cprplot_7 crc cret cretu cretur creturn cross cs cscript cscript_log csi ct ct_is ctset ctst_5 ctst_st cttost cumsp cumsp_7 cumul cusum cusum_7 cutil d datasig datasign datasigna datasignat datasignatu datasignatur datasignature datetof db dbeta de dec deco decod decode deff des desc descr descri describ describe destring dfbeta dfgls dfuller di di_g dir dirstats dis discard disp disp_res disp_s displ displa display distinct do doe doed doedi doedit dotplot dotplot_7 dprobit drawnorm drop ds ds_util dstdize duplicates durbina dwstat dydx e ed edi edit egen eivreg emdef en enc enco encod encode eq erase ereg ereg_lf ereg_p ereg_sw ereghet ereghet_glf ereghet_glf_sh ereghet_gp ereghet_ilf ereghet_ilf_sh ereghet_ip eret eretu eretur ereturn err erro error est est_cfexist est_cfname est_clickable est_expand est_hold est_table est_unhold est_unholdok estat estat_default estat_summ estat_vce_only esti estimates etodow etof etomdy ex exi exit expand expandcl fac fact facto factor factor_estat factor_p factor_pca_rotated factor_rotate factormat fcast fcast_compute fcast_graph fdades fdadesc fdadescr fdadescri fdadescrib fdadescribe fdasav fdasave fdause fh_st file open file read file close file filefilter fillin find_hlp_file findfile findit findit_7 fit fl fli flis flist for5_0 form forma format fpredict frac_154 frac_adj frac_chk frac_cox frac_ddp frac_dis frac_dv frac_in frac_mun frac_pp frac_pq frac_pv frac_wgt frac_xo fracgen fracplot fracplot_7 fracpoly fracpred fron_ex fron_hn fron_p fron_tn fron_tn2 frontier ftodate ftoe ftomdy ftowdate g gamhet_glf gamhet_gp gamhet_ilf gamhet_ip gamma gamma_d2 gamma_p gamma_sw gammahet gdi_hexagon gdi_spokes ge gen gene gener genera generat generate genrank genstd genvmean gettoken gl gladder gladder_7 glim_l01 glim_l02 glim_l03 glim_l04 glim_l05 glim_l06 glim_l07 glim_l08 glim_l09 glim_l10 glim_l11 glim_l12 glim_lf glim_mu glim_nw1 glim_nw2 glim_nw3 glim_p glim_v1 glim_v2 glim_v3 glim_v4 glim_v5 glim_v6 glim_v7 glm glm_6 glm_p glm_sw glmpred glo glob globa global glogit glogit_8 glogit_p gmeans gnbre_lf gnbreg gnbreg_5 gnbreg_p gomp_lf gompe_sw gomper_p gompertz gompertzhet gomphet_glf gomphet_glf_sh gomphet_gp gomphet_ilf gomphet_ilf_sh gomphet_ip gphdot gphpen gphprint gprefs gprobi_p gprobit gprobit_8 gr gr7 gr_copy gr_current gr_db gr_describe gr_dir gr_draw gr_draw_replay gr_drop gr_edit gr_editviewopts gr_example gr_example2 gr_export gr_print gr_qscheme gr_query gr_read gr_rename gr_replay gr_save gr_set gr_setscheme gr_table gr_undo gr_use graph graph7 grebar greigen greigen_7 greigen_8 grmeanby grmeanby_7 gs_fileinfo gs_filetype gs_graphinfo gs_stat gsort gwood h hadimvo hareg hausman haver he heck_d2 heckma_p heckman heckp_lf heckpr_p heckprob hel help hereg hetpr_lf hetpr_p hetprob hettest hexdump hilite hist hist_7 histogram hlogit hlu hmeans hotel hotelling hprobit hreg hsearch icd9 icd9_ff icd9p iis impute imtest inbase include inf infi infil infile infix inp inpu input ins insheet insp inspe inspec inspect integ inten intreg intreg_7 intreg_p intrg2_ll intrg_ll intrg_ll2 ipolate iqreg ir irf irf_create irfm iri is_svy is_svysum isid istdize ivprob_1_lf ivprob_lf ivprobit ivprobit_p ivreg ivreg_footnote ivtob_1_lf ivtob_lf ivtobit ivtobit_p jackknife jacknife jknife jknife_6 jknife_8 jkstat joinby kalarma1 kap kap_3 kapmeier kappa kapwgt kdensity kdensity_7 keep ksm ksmirnov ktau kwallis l la lab labe label labelbook ladder levels levelsof leverage lfit lfit_p li lincom line linktest lis list lloghet_glf lloghet_glf_sh lloghet_gp lloghet_ilf lloghet_ilf_sh lloghet_ip llogi_sw llogis_p llogist llogistic llogistichet lnorm_lf lnorm_sw lnorma_p lnormal lnormalhet lnormhet_glf lnormhet_glf_sh lnormhet_gp lnormhet_ilf lnormhet_ilf_sh lnormhet_ip lnskew0 loadingplot loc loca local log logi logis_lf logistic logistic_p logit logit_estat logit_p loglogs logrank loneway lookfor lookup lowess lowess_7 lpredict lrecomp lroc lroc_7 lrtest ls lsens lsens_7 lsens_x lstat ltable ltable_7 ltriang lv lvr2plot lvr2plot_7 m ma mac macr macro makecns man manova manova_estat manova_p manovatest mantel mark markin markout marksample mat mat_capp mat_order mat_put_rr mat_rapp mata mata_clear mata_describe mata_drop mata_matdescribe mata_matsave mata_matuse mata_memory mata_mlib mata_mosave mata_rename mata_which matalabel matcproc matlist matname matr matri matrix matrix_input__dlg matstrik mcc mcci md0_ md1_ md1debug_ md2_ md2debug_ mds mds_estat mds_p mdsconfig mdslong mdsmat mdsshepard mdytoe mdytof me_derd mean means median memory memsize meqparse mer merg merge mfp mfx mhelp mhodds minbound mixed_ll mixed_ll_reparm mkassert mkdir mkmat mkspline ml ml_5 ml_adjs ml_bhhhs ml_c_d ml_check ml_clear ml_cnt ml_debug ml_defd ml_e0 ml_e0_bfgs ml_e0_cycle ml_e0_dfp ml_e0i ml_e1 ml_e1_bfgs ml_e1_bhhh ml_e1_cycle ml_e1_dfp ml_e2 ml_e2_cycle ml_ebfg0 ml_ebfr0 ml_ebfr1 ml_ebh0q ml_ebhh0 ml_ebhr0 ml_ebr0i ml_ecr0i ml_edfp0 ml_edfr0 ml_edfr1 ml_edr0i ml_eds ml_eer0i ml_egr0i ml_elf ml_elf_bfgs ml_elf_bhhh ml_elf_cycle ml_elf_dfp ml_elfi ml_elfs ml_enr0i ml_enrr0 ml_erdu0 ml_erdu0_bfgs ml_erdu0_bhhh ml_erdu0_bhhhq ml_erdu0_cycle ml_erdu0_dfp ml_erdu0_nrbfgs ml_exde ml_footnote ml_geqnr ml_grad0 ml_graph ml_hbhhh ml_hd0 ml_hold ml_init ml_inv ml_log ml_max ml_mlout ml_mlout_8 ml_model ml_nb0 ml_opt ml_p ml_plot ml_query ml_rdgrd ml_repor ml_s_e ml_score ml_searc ml_technique ml_unhold mleval mlf_ mlmatbysum mlmatsum mlog mlogi mlogit mlogit_footnote mlogit_p mlopts mlsum mlvecsum mnl0_ mor more mov move mprobit mprobit_lf mprobit_p mrdu0_ mrdu1_ mvdecode mvencode mvreg mvreg_estat n nbreg nbreg_al nbreg_lf nbreg_p nbreg_sw nestreg net newey newey_7 newey_p news nl nl_7 nl_9 nl_9_p nl_p nl_p_7 nlcom nlcom_p nlexp2 nlexp2_7 nlexp2a nlexp2a_7 nlexp3 nlexp3_7 nlgom3 nlgom3_7 nlgom4 nlgom4_7 nlinit nllog3 nllog3_7 nllog4 nllog4_7 nlog_rd nlogit nlogit_p nlogitgen nlogittree nlpred no nobreak noi nois noisi noisil noisily note notes notes_dlg nptrend numlabel numlist odbc old_ver olo olog ologi ologi_sw ologit ologit_p ologitp on one onew onewa oneway op_colnm op_comp op_diff op_inv op_str opr opro oprob oprob_sw oprobi oprobi_p oprobit oprobitp opts_exclusive order orthog orthpoly ou out outf outfi outfil outfile outs outsh outshe outshee outsheet ovtest pac pac_7 palette parse parse_dissim pause pca pca_8 pca_display pca_estat pca_p pca_rotate pcamat pchart pchart_7 pchi pchi_7 pcorr pctile pentium pergram pergram_7 permute permute_8 personal peto_st pkcollapse pkcross pkequiv pkexamine pkexamine_7 pkshape pksumm pksumm_7 pl plo plot plugin pnorm pnorm_7 poisgof poiss_lf poiss_sw poisso_p poisson poisson_estat post postclose postfile postutil pperron pr prais prais_e prais_e2 prais_p predict predictnl preserve print pro prob probi probit probit_estat probit_p proc_time procoverlay procrustes procrustes_estat procrustes_p profiler prog progr progra program prop proportion prtest prtesti pwcorr pwd q\\s qby qbys qchi qchi_7 qladder qladder_7 qnorm qnorm_7 qqplot qqplot_7 qreg qreg_c qreg_p qreg_sw qu quadchk quantile quantile_7 que quer query range ranksum ratio rchart rchart_7 rcof recast reclink recode reg reg3 reg3_p regdw regr regre regre_p2 regres regres_p regress regress_estat regriv_p remap ren rena renam rename renpfix repeat replace report reshape restore ret retu retur return rm rmdir robvar roccomp roccomp_7 roccomp_8 rocf_lf rocfit rocfit_8 rocgold rocplot rocplot_7 roctab roctab_7 rolling rologit rologit_p rot rota rotat rotate rotatemat rreg rreg_p ru run runtest rvfplot rvfplot_7 rvpplot rvpplot_7 sa safesum sample sampsi sav save savedresults saveold sc sca scal scala scalar scatter scm_mine sco scob_lf scob_p scobi_sw scobit scor score scoreplot scoreplot_help scree screeplot screeplot_help sdtest sdtesti se search separate seperate serrbar serrbar_7 serset set set_defaults sfrancia sh she shel shell shewhart shewhart_7 signestimationsample signrank signtest simul simul_7 simulate simulate_8 sktest sleep slogit slogit_d2 slogit_p smooth snapspan so sor sort spearman spikeplot spikeplot_7 spikeplt spline_x split sqreg sqreg_p sret sretu sretur sreturn ssc st st_ct st_hc st_hcd st_hcd_sh st_is st_issys st_note st_promo st_set st_show st_smpl st_subid stack statsby statsby_8 stbase stci stci_7 stcox stcox_estat stcox_fr stcox_fr_ll stcox_p stcox_sw stcoxkm stcoxkm_7 stcstat stcurv stcurve stcurve_7 stdes stem stepwise stereg stfill stgen stir stjoin stmc stmh stphplot stphplot_7 stphtest stphtest_7 stptime strate strate_7 streg streg_sw streset sts sts_7 stset stsplit stsum sttocc sttoct stvary stweib su suest suest_8 sum summ summa summar summari summariz summarize sunflower sureg survcurv survsum svar svar_p svmat svy svy_disp svy_dreg svy_est svy_est_7 svy_estat svy_get svy_gnbreg_p svy_head svy_header svy_heckman_p svy_heckprob_p svy_intreg_p svy_ivreg_p svy_logistic_p svy_logit_p svy_mlogit_p svy_nbreg_p svy_ologit_p svy_oprobit_p svy_poisson_p svy_probit_p svy_regress_p svy_sub svy_sub_7 svy_x svy_x_7 svy_x_p svydes svydes_8 svygen svygnbreg svyheckman svyheckprob svyintreg svyintreg_7 svyintrg svyivreg svylc svylog_p svylogit svymarkout svymarkout_8 svymean svymlog svymlogit svynbreg svyolog svyologit svyoprob svyoprobit svyopts svypois svypois_7 svypoisson svyprobit svyprobt svyprop svyprop_7 svyratio svyreg svyreg_p svyregress svyset svyset_7 svyset_8 svytab svytab_7 svytest svytotal sw sw_8 swcnreg swcox swereg swilk swlogis swlogit swologit swoprbt swpois swprobit swqreg swtobit swweib symmetry symmi symplot symplot_7 syntax sysdescribe sysdir sysuse szroeter ta tab tab1 tab2 tab_or tabd tabdi tabdis tabdisp tabi table tabodds tabodds_7 tabstat tabu tabul tabula tabulat tabulate te tempfile tempname tempvar tes test testnl testparm teststd tetrachoric time_it timer tis tob tobi tobit tobit_p tobit_sw token tokeni tokeniz tokenize tostring total translate translator transmap treat_ll treatr_p treatreg trim trnb_cons trnb_mean trpoiss_d2 trunc_ll truncr_p truncreg tsappend tset tsfill tsline tsline_ex tsreport tsrevar tsrline tsset tssmooth tsunab ttest ttesti tut_chk tut_wait tutorial tw tware_st two twoway twoway__fpfit_serset twoway__function_gen twoway__histogram_gen twoway__ipoint_serset twoway__ipoints_serset twoway__kdensity_gen twoway__lfit_serset twoway__normgen_gen twoway__pci_serset twoway__qfit_serset twoway__scatteri_serset twoway__sunflower_gen twoway_ksm_serset ty typ type typeof u unab unabbrev unabcmd update us use uselabel var var_mkcompanion var_p varbasic varfcast vargranger varirf varirf_add varirf_cgraph varirf_create varirf_ctable varirf_describe varirf_dir varirf_drop varirf_erase varirf_graph varirf_ograph varirf_rename varirf_set varirf_table varlist varlmar varnorm varsoc varstable varstable_w varstable_w2 varwle vce vec vec_fevd vec_mkphi vec_p vec_p_w vecirf_create veclmar veclmar_w vecnorm vecnorm_w vecrank vecstable verinst vers versi versio version view viewsource vif vwls wdatetof webdescribe webseek webuse weib1_lf weib2_lf weib_lf weib_lf0 weibhet_glf weibhet_glf_sh weibhet_glfa weibhet_glfa_sh weibhet_gp weibhet_ilf weibhet_ilf_sh weibhet_ilfa weibhet_ilfa_sh weibhet_ip weibu_sw weibul_p weibull weibull_c weibull_s weibullhet wh whelp whi which whil while wilc_st wilcoxon win wind windo window winexec wntestb wntestb_7 wntestq xchart xchart_7 xcorr xcorr_7 xi xi_6 xmlsav xmlsave xmluse xpose xsh xshe xshel xshell xt_iis xt_tis xtab_p xtabond xtbin_p xtclog xtcloglog xtcloglog_8 xtcloglog_d2 xtcloglog_pa_p xtcloglog_re_p xtcnt_p xtcorr xtdata xtdes xtfront_p xtfrontier xtgee xtgee_elink xtgee_estat xtgee_makeivar xtgee_p xtgee_plink xtgls xtgls_p xthaus xthausman xtht_p xthtaylor xtile xtint_p xtintreg xtintreg_8 xtintreg_d2 xtintreg_p xtivp_1 xtivp_2 xtivreg xtline xtline_ex xtlogit xtlogit_8 xtlogit_d2 xtlogit_fe_p xtlogit_pa_p xtlogit_re_p xtmixed xtmixed_estat xtmixed_p xtnb_fe xtnb_lf xtnbreg xtnbreg_pa_p xtnbreg_refe_p xtpcse xtpcse_p xtpois xtpoisson xtpoisson_d2 xtpoisson_pa_p xtpoisson_refe_p xtpred xtprobit xtprobit_8 xtprobit_d2 xtprobit_re_p xtps_fe xtps_lf xtps_ren xtps_ren_8 xtrar_p xtrc xtrc_p xtrchh xtrefe_p xtreg xtreg_be xtreg_fe xtreg_ml xtreg_pa_p xtreg_re xtregar xtrere_p xtset xtsf_ll xtsf_llti xtsum xttab xttest0 xttobit xttobit_8 xttobit_p xttrans yx yxview__barlike_draw yxview_area_draw yxview_bar_draw yxview_dot_draw yxview_dropline_draw yxview_function_draw yxview_iarrow_draw yxview_ilabels_draw yxview_normal_draw yxview_pcarrow_draw yxview_pcbarrow_draw yxview_pccapsym_draw yxview_pcscatter_draw yxview_pcspike_draw yxview_rarea_draw yxview_rbar_draw yxview_rbarm_draw yxview_rcap_draw yxview_rcapsym_draw yxview_rconnected_draw yxview_rline_draw yxview_rscatter_draw yxview_rspike_draw yxview_spike_draw yxview_sunflower_draw zap_s zinb zinb_llf zinb_plf zip zip_llf zip_p zip_plf zt_ct_5 zt_hc_5 zt_hcd_5 zt_is_5 zt_iss_5 zt_sho_5 zt_smp_5 ztbase_5 ztcox_5 ztdes_5 ztereg_5 ztfill_5 ztgen_5 ztir_5 ztjoin_5 ztnb ztnb_p ztp ztp_p zts_5 ztset_5 ztspli_5 ztsum_5 zttoct_5 ztvary_5 ztweib_5',
	        contains: [
	      {
	        className: 'label',
	        variants: [
	          {begin: "\\$\\{?[a-zA-Z0-9_]+\\}?"},
	          {begin: "`[a-zA-Z0-9_]+'"}

	        ]
	      },
	      {
	        className: 'string',
	        variants: [
	          {begin: '`"[^\r\n]*?"\''},
	          {begin: '"[^\r\n"]*"'}
	        ]
	      },

	      {
	        className: 'literal',
	        variants: [
	          {
	            begin: '\\b(abs|acos|asin|atan|atan2|atanh|ceil|cloglog|comb|cos|digamma|exp|floor|invcloglog|invlogit|ln|lnfact|lnfactorial|lngamma|log|log10|max|min|mod|reldif|round|sign|sin|sqrt|sum|tan|tanh|trigamma|trunc|betaden|Binomial|binorm|binormal|chi2|chi2tail|dgammapda|dgammapdada|dgammapdadx|dgammapdx|dgammapdxdx|F|Fden|Ftail|gammaden|gammap|ibeta|invbinomial|invchi2|invchi2tail|invF|invFtail|invgammap|invibeta|invnchi2|invnFtail|invnibeta|invnorm|invnormal|invttail|nbetaden|nchi2|nFden|nFtail|nibeta|norm|normal|normalden|normd|npnchi2|tden|ttail|uniform|abbrev|char|index|indexnot|length|lower|ltrim|match|plural|proper|real|regexm|regexr|regexs|reverse|rtrim|string|strlen|strlower|strltrim|strmatch|strofreal|strpos|strproper|strreverse|strrtrim|strtrim|strupper|subinstr|subinword|substr|trim|upper|word|wordcount|_caller|autocode|byteorder|chop|clip|cond|e|epsdouble|epsfloat|group|inlist|inrange|irecode|matrix|maxbyte|maxdouble|maxfloat|maxint|maxlong|mi|minbyte|mindouble|minfloat|minint|minlong|missing|r|recode|replay|return|s|scalar|d|date|day|dow|doy|halfyear|mdy|month|quarter|week|year|d|daily|dofd|dofh|dofm|dofq|dofw|dofy|h|halfyearly|hofd|m|mofd|monthly|q|qofd|quarterly|tin|twithin|w|weekly|wofd|y|yearly|yh|ym|yofd|yq|yw|cholesky|colnumb|colsof|corr|det|diag|diag0cnt|el|get|hadamard|I|inv|invsym|issym|issymmetric|J|matmissing|matuniform|mreldif|nullmat|rownumb|rowsof|sweep|syminv|trace|vec|vecdiag)(?=\\(|$)'
	          }
	        ]
	      },

	      hljs.COMMENT('^[ \t]*\\*.*$', false),
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE
	    ]
	  };
	};

/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var STEP21_IDENT_RE = '[A-Z_][A-Z0-9_.]*';
	  var STEP21_CLOSE_RE = 'END-ISO-10303-21;';
	  var STEP21_KEYWORDS = {
	    literal: '',
	    built_in: '',
	    keyword:
	    'HEADER ENDSEC DATA'
	  };
	  var STEP21_START = {
	    className: 'preprocessor',
	    begin: 'ISO-10303-21;',
	    relevance: 10
	  };
	  var STEP21_CODE = [
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    hljs.COMMENT('/\\*\\*!', '\\*/'),
	    hljs.C_NUMBER_MODE,
	    hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	    hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
	    {
	      className: 'string',
	      begin: "'", end: "'"
	    },
	    {
	      className: 'label',
	      variants: [
	        {
	          begin: '#', end: '\\d+',
	          illegal: '\\W'
	        }
	      ]
	    }
	  ];

	  return {
	    aliases: ['p21', 'step', 'stp'],
	    case_insensitive: true, // STEP 21 is case insensitive in theory, in practice all non-comments are capitalized.
	    lexemes: STEP21_IDENT_RE,
	    keywords: STEP21_KEYWORDS,
	    contains: [
	      {
	        className: 'preprocessor',
	        begin: STEP21_CLOSE_RE,
	        relevance: 10
	      },
	      STEP21_START
	    ].concat(STEP21_CODE)
	  };
	};

/***/ },
/* 157 */
/***/ function(module, exports) {

	module.exports = function(hljs) {

	  var VARIABLE = {
	    className: 'variable',
	    begin: '\\$' + hljs.IDENT_RE
	  };

	  var HEX_COLOR = {
	    className: 'hexcolor',
	    begin: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})',
	    relevance: 10
	  };

	  var AT_KEYWORDS = [
	    'charset',
	    'css',
	    'debug',
	    'extend',
	    'font-face',
	    'for',
	    'import',
	    'include',
	    'media',
	    'mixin',
	    'page',
	    'warn',
	    'while'
	  ];

	  var PSEUDO_SELECTORS = [
	    'after',
	    'before',
	    'first-letter',
	    'first-line',
	    'active',
	    'first-child',
	    'focus',
	    'hover',
	    'lang',
	    'link',
	    'visited'
	  ];

	  var TAGS = [
	    'a',
	    'abbr',
	    'address',
	    'article',
	    'aside',
	    'audio',
	    'b',
	    'blockquote',
	    'body',
	    'button',
	    'canvas',
	    'caption',
	    'cite',
	    'code',
	    'dd',
	    'del',
	    'details',
	    'dfn',
	    'div',
	    'dl',
	    'dt',
	    'em',
	    'fieldset',
	    'figcaption',
	    'figure',
	    'footer',
	    'form',
	    'h1',
	    'h2',
	    'h3',
	    'h4',
	    'h5',
	    'h6',
	    'header',
	    'hgroup',
	    'html',
	    'i',
	    'iframe',
	    'img',
	    'input',
	    'ins',
	    'kbd',
	    'label',
	    'legend',
	    'li',
	    'mark',
	    'menu',
	    'nav',
	    'object',
	    'ol',
	    'p',
	    'q',
	    'quote',
	    'samp',
	    'section',
	    'span',
	    'strong',
	    'summary',
	    'sup',
	    'table',
	    'tbody',
	    'td',
	    'textarea',
	    'tfoot',
	    'th',
	    'thead',
	    'time',
	    'tr',
	    'ul',
	    'var',
	    'video'
	  ];

	  var TAG_END = '[\\.\\s\\n\\[\\:,]';

	  var ATTRIBUTES = [
	    'align-content',
	    'align-items',
	    'align-self',
	    'animation',
	    'animation-delay',
	    'animation-direction',
	    'animation-duration',
	    'animation-fill-mode',
	    'animation-iteration-count',
	    'animation-name',
	    'animation-play-state',
	    'animation-timing-function',
	    'auto',
	    'backface-visibility',
	    'background',
	    'background-attachment',
	    'background-clip',
	    'background-color',
	    'background-image',
	    'background-origin',
	    'background-position',
	    'background-repeat',
	    'background-size',
	    'border',
	    'border-bottom',
	    'border-bottom-color',
	    'border-bottom-left-radius',
	    'border-bottom-right-radius',
	    'border-bottom-style',
	    'border-bottom-width',
	    'border-collapse',
	    'border-color',
	    'border-image',
	    'border-image-outset',
	    'border-image-repeat',
	    'border-image-slice',
	    'border-image-source',
	    'border-image-width',
	    'border-left',
	    'border-left-color',
	    'border-left-style',
	    'border-left-width',
	    'border-radius',
	    'border-right',
	    'border-right-color',
	    'border-right-style',
	    'border-right-width',
	    'border-spacing',
	    'border-style',
	    'border-top',
	    'border-top-color',
	    'border-top-left-radius',
	    'border-top-right-radius',
	    'border-top-style',
	    'border-top-width',
	    'border-width',
	    'bottom',
	    'box-decoration-break',
	    'box-shadow',
	    'box-sizing',
	    'break-after',
	    'break-before',
	    'break-inside',
	    'caption-side',
	    'clear',
	    'clip',
	    'clip-path',
	    'color',
	    'column-count',
	    'column-fill',
	    'column-gap',
	    'column-rule',
	    'column-rule-color',
	    'column-rule-style',
	    'column-rule-width',
	    'column-span',
	    'column-width',
	    'columns',
	    'content',
	    'counter-increment',
	    'counter-reset',
	    'cursor',
	    'direction',
	    'display',
	    'empty-cells',
	    'filter',
	    'flex',
	    'flex-basis',
	    'flex-direction',
	    'flex-flow',
	    'flex-grow',
	    'flex-shrink',
	    'flex-wrap',
	    'float',
	    'font',
	    'font-family',
	    'font-feature-settings',
	    'font-kerning',
	    'font-language-override',
	    'font-size',
	    'font-size-adjust',
	    'font-stretch',
	    'font-style',
	    'font-variant',
	    'font-variant-ligatures',
	    'font-weight',
	    'height',
	    'hyphens',
	    'icon',
	    'image-orientation',
	    'image-rendering',
	    'image-resolution',
	    'ime-mode',
	    'inherit',
	    'initial',
	    'justify-content',
	    'left',
	    'letter-spacing',
	    'line-height',
	    'list-style',
	    'list-style-image',
	    'list-style-position',
	    'list-style-type',
	    'margin',
	    'margin-bottom',
	    'margin-left',
	    'margin-right',
	    'margin-top',
	    'marks',
	    'mask',
	    'max-height',
	    'max-width',
	    'min-height',
	    'min-width',
	    'nav-down',
	    'nav-index',
	    'nav-left',
	    'nav-right',
	    'nav-up',
	    'none',
	    'normal',
	    'object-fit',
	    'object-position',
	    'opacity',
	    'order',
	    'orphans',
	    'outline',
	    'outline-color',
	    'outline-offset',
	    'outline-style',
	    'outline-width',
	    'overflow',
	    'overflow-wrap',
	    'overflow-x',
	    'overflow-y',
	    'padding',
	    'padding-bottom',
	    'padding-left',
	    'padding-right',
	    'padding-top',
	    'page-break-after',
	    'page-break-before',
	    'page-break-inside',
	    'perspective',
	    'perspective-origin',
	    'pointer-events',
	    'position',
	    'quotes',
	    'resize',
	    'right',
	    'tab-size',
	    'table-layout',
	    'text-align',
	    'text-align-last',
	    'text-decoration',
	    'text-decoration-color',
	    'text-decoration-line',
	    'text-decoration-style',
	    'text-indent',
	    'text-overflow',
	    'text-rendering',
	    'text-shadow',
	    'text-transform',
	    'text-underline-position',
	    'top',
	    'transform',
	    'transform-origin',
	    'transform-style',
	    'transition',
	    'transition-delay',
	    'transition-duration',
	    'transition-property',
	    'transition-timing-function',
	    'unicode-bidi',
	    'vertical-align',
	    'visibility',
	    'white-space',
	    'widows',
	    'width',
	    'word-break',
	    'word-spacing',
	    'word-wrap',
	    'z-index'
	  ];

	  // illegals
	  var ILLEGAL = [
	    '\\{',
	    '\\}',
	    '\\?',
	    '(\\bReturn\\b)', // monkey
	    '(\\bEnd\\b)', // monkey
	    '(\\bend\\b)', // vbscript
	    ';', // sql
	    '#\\s', // markdown
	    '\\*\\s', // markdown
	    '===\\s', // markdown
	    '\\|',
	    '%', // prolog
	  ];

	  return {
	    aliases: ['styl'],
	    case_insensitive: false,
	    illegal: '(' + ILLEGAL.join('|') + ')',
	    keywords: 'if else for in',
	    contains: [

	      // strings
	      hljs.QUOTE_STRING_MODE,
	      hljs.APOS_STRING_MODE,

	      // comments
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,

	      // hex colors
	      HEX_COLOR,

	      // class tag
	      {
	        begin: '\\.[a-zA-Z][a-zA-Z0-9_-]*' + TAG_END,
	        returnBegin: true,
	        contains: [
	          {className: 'class', begin: '\\.[a-zA-Z][a-zA-Z0-9_-]*'}
	        ]
	      },

	      // id tag
	      {
	        begin: '\\#[a-zA-Z][a-zA-Z0-9_-]*' + TAG_END,
	        returnBegin: true,
	        contains: [
	          {className: 'id', begin: '\\#[a-zA-Z][a-zA-Z0-9_-]*'}
	        ]
	      },

	      // tags
	      {
	        begin: '\\b(' + TAGS.join('|') + ')' + TAG_END,
	        returnBegin: true,
	        contains: [
	          {className: 'tag', begin: '\\b[a-zA-Z][a-zA-Z0-9_-]*'}
	        ]
	      },

	      // psuedo selectors
	      {
	        className: 'pseudo',
	        begin: '&?:?:\\b(' + PSEUDO_SELECTORS.join('|') + ')' + TAG_END
	      },

	      // @ keywords
	      {
	        className: 'at_rule',
	        begin: '\@(' + AT_KEYWORDS.join('|') + ')\\b'
	      },

	      // variables
	      VARIABLE,

	      // dimension
	      hljs.CSS_NUMBER_MODE,

	      // number
	      hljs.NUMBER_MODE,

	      // functions
	      //  - only from beginning of line + whitespace
	      {
	        className: 'function',
	        begin: '\\b[a-zA-Z][a-zA-Z0-9_\-]*\\(.*\\)',
	        illegal: '[\\n]',
	        returnBegin: true,
	        contains: [
	          {className: 'title', begin: '\\b[a-zA-Z][a-zA-Z0-9_\-]*'},
	          {
	            className: 'params',
	            begin: /\(/,
	            end: /\)/,
	            contains: [
	              HEX_COLOR,
	              VARIABLE,
	              hljs.APOS_STRING_MODE,
	              hljs.CSS_NUMBER_MODE,
	              hljs.NUMBER_MODE,
	              hljs.QUOTE_STRING_MODE
	            ]
	          }
	        ]
	      },

	      // attributes
	      //  - only from beginning of line + whitespace
	      //  - must have whitespace after it
	      {
	        className: 'attribute',
	        begin: '\\b(' + ATTRIBUTES.reverse().join('|') + ')\\b'
	      }
	    ]
	  };
	};

/***/ },
/* 158 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var SWIFT_KEYWORDS = {
	      keyword: '__COLUMN__ __FILE__ __FUNCTION__ __LINE__ as as! as? associativity ' +
	        'break case catch class continue convenience default defer deinit didSet do ' +
	        'dynamic dynamicType else enum extension fallthrough false final for func ' +
	        'get guard if import in indirect infix init inout internal is lazy left let ' +
	        'mutating nil none nonmutating operator optional override postfix precedence ' +
	        'prefix private protocol Protocol public repeat required rethrows return ' +
	        'right self Self set static struct subscript super switch throw throws true ' +
	        'try try! try? Type typealias unowned var weak where while willSet',
	      literal: 'true false nil',
	      built_in: 'abs advance alignof alignofValue anyGenerator assert assertionFailure ' +
	        'bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC ' +
	        'bridgeToObjectiveCUnconditional c contains count countElements countLeadingZeros ' +
	        'debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords ' +
	        'enumerate equal fatalError filter find getBridgedObjectiveCType getVaList ' +
	        'indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC ' +
	        'isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare ' +
	        'map max maxElement min minElement numericCast overlaps partition posix ' +
	        'precondition preconditionFailure print println quickSort readLine reduce reflect ' +
	        'reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split ' +
	        'startsWith stride strideof strideofValue swap toString transcode ' +
	        'underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap ' +
	        'unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer ' +
	        'withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers ' +
	        'withUnsafePointer withUnsafePointers withVaList zip'
	    };

	  var TYPE = {
	    className: 'type',
	    begin: '\\b[A-Z][\\w\']*',
	    relevance: 0
	  };
	  var BLOCK_COMMENT = hljs.COMMENT(
	    '/\\*',
	    '\\*/',
	    {
	      contains: ['self']
	    }
	  );
	  var SUBST = {
	    className: 'subst',
	    begin: /\\\(/, end: '\\)',
	    keywords: SWIFT_KEYWORDS,
	    contains: [] // assigned later
	  };
	  var NUMBERS = {
	      className: 'number',
	      begin: '\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b',
	      relevance: 0
	  };
	  var QUOTE_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, {
	    contains: [SUBST, hljs.BACKSLASH_ESCAPE]
	  });
	  SUBST.contains = [NUMBERS];

	  return {
	    keywords: SWIFT_KEYWORDS,
	    contains: [
	      QUOTE_STRING_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      BLOCK_COMMENT,
	      TYPE,
	      NUMBERS,
	      {
	        className: 'func',
	        beginKeywords: 'func', end: '{', excludeEnd: true,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {
	            begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
	            illegal: /\(/
	          }),
	          {
	            className: 'generics',
	            begin: /</, end: />/,
	            illegal: />/
	          },
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/, endsParent: true,
	            keywords: SWIFT_KEYWORDS,
	            contains: [
	              'self',
	              NUMBERS,
	              QUOTE_STRING_MODE,
	              hljs.C_BLOCK_COMMENT_MODE,
	              {begin: ':'} // relevance booster
	            ],
	            illegal: /["']/
	          }
	        ],
	        illegal: /\[|%/
	      },
	      {
	        className: 'class',
	        beginKeywords: 'struct protocol class extension enum',
	        keywords: SWIFT_KEYWORDS,
	        end: '\\{',
	        excludeEnd: true,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/})
	        ]
	      },
	      {
	        className: 'preprocessor', // @attributes
	        begin: '(@warn_unused_result|@exported|@lazy|@noescape|' +
	                  '@NSCopying|@NSManaged|@objc|@convention|@required|' +
	                  '@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|' +
	                  '@infix|@prefix|@postfix|@autoclosure|@testable|@available|' +
	                  '@nonobjc|@NSApplicationMain|@UIApplicationMain)'

	      },
	      {
	        beginKeywords: 'import', end: /$/,
	        contains: [hljs.C_LINE_COMMENT_MODE, BLOCK_COMMENT]
	      }
	    ]
	  };
	};

/***/ },
/* 159 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['tk'],
	    keywords: 'after append apply array auto_execok auto_import auto_load auto_mkindex ' +
	      'auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd chan clock ' +
	      'close concat continue dde dict encoding eof error eval exec exit expr fblocked ' +
	      'fconfigure fcopy file fileevent filename flush for foreach format gets glob global ' +
	      'history http if incr info interp join lappend|10 lassign|10 lindex|10 linsert|10 list ' +
	      'llength|10 load lrange|10 lrepeat|10 lreplace|10 lreverse|10 lsearch|10 lset|10 lsort|10 '+
	      'mathfunc mathop memory msgcat namespace open package parray pid pkg::create pkg_mkIndex '+
	      'platform platform::shell proc puts pwd read refchan regexp registry regsub|10 rename '+
	      'return safe scan seek set socket source split string subst switch tcl_endOfWord '+
	      'tcl_findLibrary tcl_startOfNextWord tcl_startOfPreviousWord tcl_wordBreakAfter '+
	      'tcl_wordBreakBefore tcltest tclvars tell time tm trace unknown unload unset update '+
	      'uplevel upvar variable vwait while',
	    contains: [
	      hljs.COMMENT(';[ \\t]*#', '$'),
	      hljs.COMMENT('^[ \\t]*#', '$'),
	      {
	        beginKeywords: 'proc',
	        end: '[\\{]',
	        excludeEnd: true,
	        contains: [
	          {
	            className: 'symbol',
	            begin: '[ \\t\\n\\r]+(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*',
	            end: '[ \\t\\n\\r]',
	            endsWithParent: true,
	            excludeEnd: true
	          }
	        ]
	      },
	      {
	        className: 'variable',
	        excludeEnd: true,
	        variants: [
	          {
	            begin: '\\$(\\{)?(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*\\(([a-zA-Z0-9_])*\\)',
	            end: '[^a-zA-Z0-9_\\}\\$]'
	          },
	          {
	            begin: '\\$(\\{)?(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*',
	            end: '(\\))?[^a-zA-Z0-9_\\}\\$]'
	          }
	        ]
	      },
	      {
	        className: 'string',
	        contains: [hljs.BACKSLASH_ESCAPE],
	        variants: [
	          hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	          hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null})
	        ]
	      },
	      {
	        className: 'number',
	        variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]
	      }
	    ]
	  }
	};

/***/ },
/* 160 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var COMMAND1 = {
	    className: 'command',
	    begin: '\\\\[a-zA-Zа-яА-я]+[\\*]?'
	  };
	  var COMMAND2 = {
	    className: 'command',
	    begin: '\\\\[^a-zA-Zа-яА-я0-9]'
	  };
	  var SPECIAL = {
	    className: 'special',
	    begin: '[{}\\[\\]\\&#~]',
	    relevance: 0
	  };

	  return {
	    contains: [
	      { // parameter
	        begin: '\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
	        returnBegin: true,
	        contains: [
	          COMMAND1, COMMAND2,
	          {
	            className: 'number',
	            begin: ' *=', end: '-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
	            excludeBegin: true
	          }
	        ],
	        relevance: 10
	      },
	      COMMAND1, COMMAND2,
	      SPECIAL,
	      {
	        className: 'formula',
	        begin: '\\$\\$', end: '\\$\\$',
	        contains: [COMMAND1, COMMAND2, SPECIAL],
	        relevance: 0
	      },
	      {
	        className: 'formula',
	        begin: '\\$', end: '\\$',
	        contains: [COMMAND1, COMMAND2, SPECIAL],
	        relevance: 0
	      },
	      hljs.COMMENT(
	        '%',
	        '$',
	        {
	          relevance: 0
	        }
	      )
	    ]
	  };
	};

/***/ },
/* 161 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var BUILT_IN_TYPES = 'bool byte i16 i32 i64 double string binary';
	  return {
	    keywords: {
	      keyword:
	        'namespace const typedef struct enum service exception void oneway set list map required optional',
	      built_in:
	        BUILT_IN_TYPES,
	      literal:
	        'true false'
	    },
	    contains: [
	      hljs.QUOTE_STRING_MODE,
	      hljs.NUMBER_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'class',
	        beginKeywords: 'struct enum service exception', end: /\{/,
	        illegal: /\n/,
	        contains: [
	          hljs.inherit(hljs.TITLE_MODE, {
	            starts: {endsWithParent: true, excludeEnd: true} // hack: eating everything after the first title
	          })
	        ]
	      },
	      {
	        begin: '\\b(set|list|map)\\s*<', end: '>',
	        keywords: BUILT_IN_TYPES,
	        contains: ['self']
	      }
	    ]
	  };
	};

/***/ },
/* 162 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var TPID = {
	    className: 'number',
	    begin: '[1-9][0-9]*', /* no leading zeros */
	    relevance: 0
	  };
	  var TPLABEL = {
	    className: 'comment',
	    begin: ':[^\\]]+'
	  };
	  var TPDATA = {
	    className: 'built_in',
	    begin: '(AR|P|PAYLOAD|PR|R|SR|RSR|LBL|VR|UALM|MESSAGE|UTOOL|UFRAME|TIMER|\
	    TIMER_OVERFLOW|JOINT_MAX_SPEED|RESUME_PROG|DIAG_REC)\\[', end: '\\]',
	    contains: [
	      'self',
	      TPID,
	      TPLABEL
	    ]
	  };
	  var TPIO = {
	    className: 'built_in',
	    begin: '(AI|AO|DI|DO|F|RI|RO|UI|UO|GI|GO|SI|SO)\\[', end: '\\]',
	    contains: [
	      'self',
	      TPID,
	      hljs.QUOTE_STRING_MODE, /* for pos section at bottom */
	      TPLABEL
	    ]
	  };

	  return {
	    keywords: {
	      keyword:
	        'ABORT ACC ADJUST AND AP_LD BREAK CALL CNT COL CONDITION CONFIG DA DB ' +
	        'DIV DETECT ELSE END ENDFOR ERR_NUM ERROR_PROG FINE FOR GP GUARD INC ' +
	        'IF JMP LINEAR_MAX_SPEED LOCK MOD MONITOR OFFSET Offset OR OVERRIDE ' +
	        'PAUSE PREG PTH RT_LD RUN SELECT SKIP Skip TA TB TO TOOL_OFFSET ' +
	        'Tool_Offset UF UT UFRAME_NUM UTOOL_NUM UNLOCK WAIT X Y Z W P R STRLEN ' +
	        'SUBSTR FINDSTR VOFFSET',
	      constant:
	        'ON OFF max_speed LPOS JPOS ENABLE DISABLE START STOP RESET'
	    },
	    contains: [
	      TPDATA,
	      TPIO,
	      {
	        className: 'keyword',
	        begin: '/(PROG|ATTR|MN|POS|END)\\b'
	      },
	      {
	        /* this is for cases like ,CALL */
	        className: 'keyword',
	        begin: '(CALL|RUN|POINT_LOGIC|LBL)\\b'
	      },
	      {
	        /* this is for cases like CNT100 where the default lexemes do not
	         * separate the keyword and the number */
	        className: 'keyword',
	        begin: '\\b(ACC|CNT|Skip|Offset|PSPD|RT_LD|AP_LD|Tool_Offset)'
	      },
	      {
	        /* to catch numbers that do not have a word boundary on the left */
	        className: 'number',
	        begin: '\\d+(sec|msec|mm/sec|cm/min|inch/min|deg/sec|mm|in|cm)?\\b',
	        relevance: 0
	      },
	      hljs.COMMENT('//', '[;$]'),
	      hljs.COMMENT('!', '[;$]'),
	      hljs.COMMENT('--eg:', '$'),
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        begin: '\'', end: '\''
	      },
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'variable',
	        begin: '\\$[A-Za-z0-9_]+'
	      }
	    ]
	  };
	};

/***/ },
/* 163 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var PARAMS = {
	    className: 'params',
	    begin: '\\(', end: '\\)'
	  };

	  var FUNCTION_NAMES = 'attribute block constant cycle date dump include ' +
	                  'max min parent random range source template_from_string';

	  var FUNCTIONS = {
	    className: 'function',
	    beginKeywords: FUNCTION_NAMES,
	    relevance: 0,
	    contains: [
	      PARAMS
	    ]
	  };

	  var FILTER = {
	    className: 'filter',
	    begin: /\|[A-Za-z_]+:?/,
	    keywords:
	      'abs batch capitalize convert_encoding date date_modify default ' +
	      'escape first format join json_encode keys last length lower ' +
	      'merge nl2br number_format raw replace reverse round slice sort split ' +
	      'striptags title trim upper url_encode',
	    contains: [
	      FUNCTIONS
	    ]
	  };

	  var TAGS = 'autoescape block do embed extends filter flush for ' +
	    'if import include macro sandbox set spaceless use verbatim';

	  TAGS = TAGS + ' ' + TAGS.split(' ').map(function(t){return 'end' + t}).join(' ');

	  return {
	    aliases: ['craftcms'],
	    case_insensitive: true,
	    subLanguage: 'xml',
	    contains: [
	      hljs.COMMENT(/\{#/, /#}/),
	      {
	        className: 'template_tag',
	        begin: /\{%/, end: /%}/,
	        keywords: TAGS,
	        contains: [FILTER, FUNCTIONS]
	      },
	      {
	        className: 'variable',
	        begin: /\{\{/, end: /}}/,
	        contains: [FILTER, FUNCTIONS]
	      }
	    ]
	  };
	};

/***/ },
/* 164 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS = {
	    keyword:
	      'in if for while finally var new function|0 do return void else break catch ' +
	      'instanceof with throw case default try this switch continue typeof delete ' +
	      'let yield const class public private protected get set super ' +
	      'static implements enum export import declare type namespace abstract',
	    literal:
	      'true false null undefined NaN Infinity',
	    built_in:
	      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
	      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
	      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
	      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
	      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
	      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
	      'module console window document any number boolean string void'
	  };

	  return {
	    aliases: ['ts'],
	    keywords: KEYWORDS,
	    contains: [
	      {
	        className: 'pi',
	        begin: /^\s*['"]use strict['"]/,
	        relevance: 0
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'number',
	        variants: [
	          { begin: '\\b(0[bB][01]+)' },
	          { begin: '\\b(0[oO][0-7]+)' },
	          { begin: hljs.C_NUMBER_RE }
	        ],
	        relevance: 0
	      },
	      { // "value" container
	        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
	        keywords: 'return throw case',
	        contains: [
	          hljs.C_LINE_COMMENT_MODE,
	          hljs.C_BLOCK_COMMENT_MODE,
	          hljs.REGEXP_MODE
	        ],
	        relevance: 0
	      },
	      {
	        className: 'function',
	        begin: 'function', end: /[\{;]/, excludeEnd: true,
	        keywords: KEYWORDS,
	        contains: [
	          'self',
	          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
	          {
	            className: 'params',
	            begin: /\(/, end: /\)/,
	            excludeBegin: true,
	            excludeEnd: true,
	            keywords: KEYWORDS,
	            contains: [
	              hljs.C_LINE_COMMENT_MODE,
	              hljs.C_BLOCK_COMMENT_MODE
	            ],
	            illegal: /["'\(]/
	          }
	        ],
	        illegal: /\[|%/,
	        relevance: 0 // () => {} is more typical in TypeScript
	      },
	      {
	        className: 'constructor',
	        beginKeywords: 'constructor', end: /\{/, excludeEnd: true,
	        relevance: 10
	      },
	      {
	        className: 'module',
	        beginKeywords: 'module', end: /\{/, excludeEnd: true
	      },
	      {
	        className: 'interface',
	        beginKeywords: 'interface', end: /\{/, excludeEnd: true,
	        keywords: 'interface extends'
	      },
	      {
	        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
	      },
	      {
	        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
	      }
	    ]
	  };
	};

/***/ },
/* 165 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    keywords: {
	      keyword:
	        // Value types
	        'char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 ' +
	        'uint16 uint32 uint64 float double bool struct enum string void ' +
	        // Reference types
	        'weak unowned owned ' +
	        // Modifiers
	        'async signal static abstract interface override ' +
	        // Control Structures
	        'while do for foreach else switch case break default return try catch ' +
	        // Visibility
	        'public private protected internal ' +
	        // Other
	        'using new this get set const stdout stdin stderr var',
	      built_in:
	        'DBus GLib CCode Gee Object',
	      literal:
	        'false true null'
	    },
	    contains: [
	      {
	        className: 'class',
	        beginKeywords: 'class interface delegate namespace', end: '{', excludeEnd: true,
	        illegal: '[^,:\\n\\s\\.]',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.C_BLOCK_COMMENT_MODE,
	      {
	        className: 'string',
	        begin: '"""', end: '"""',
	        relevance: 5
	      },
	      hljs.APOS_STRING_MODE,
	      hljs.QUOTE_STRING_MODE,
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'preprocessor',
	        begin: '^#', end: '$',
	        relevance: 2
	      },
	      {
	        className: 'constant',
	        begin: ' [A-Z_]+ ',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 166 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['vb'],
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'addhandler addressof alias and andalso aggregate ansi as assembly auto binary by byref byval ' + /* a-b */
	        'call case catch class compare const continue custom declare default delegate dim distinct do ' + /* c-d */
	        'each equals else elseif end enum erase error event exit explicit finally for friend from function ' + /* e-f */
	        'get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue ' + /* g-i */
	        'join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass ' + /* j-m */
	        'namespace narrowing new next not notinheritable notoverridable ' + /* n */
	        'of off on operator option optional or order orelse overloads overridable overrides ' + /* o */
	        'paramarray partial preserve private property protected public ' + /* p */
	        'raiseevent readonly redim rem removehandler resume return ' + /* r */
	        'select set shadows shared skip static step stop structure strict sub synclock ' + /* s */
	        'take text then throw to try unicode until using when where while widening with withevents writeonly xor', /* t-x */
	      built_in:
	        'boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype ' +  /* b-c */
	        'date decimal directcast double gettype getxmlnamespace iif integer long object ' + /* d-o */
	        'sbyte short single string trycast typeof uinteger ulong ushort', /* s-u */
	      literal:
	        'true false nothing'
	    },
	    illegal: '//|{|}|endif|gosub|variant|wend', /* reserved deprecated keywords */
	    contains: [
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {contains: [{begin: '""'}]}),
	      hljs.COMMENT(
	        '\'',
	        '$',
	        {
	          returnBegin: true,
	          contains: [
	            {
	              className: 'xmlDocTag',
	              begin: '\'\'\'|<!--|-->',
	              contains: [hljs.PHRASAL_WORDS_MODE]
	            },
	            {
	              className: 'xmlDocTag',
	              begin: '</?', end: '>',
	              contains: [hljs.PHRASAL_WORDS_MODE]
	            }
	          ]
	        }
	      ),
	      hljs.C_NUMBER_MODE,
	      {
	        className: 'preprocessor',
	        begin: '#', end: '$',
	        keywords: 'if else elseif end region externalsource'
	      }
	    ]
	  };
	};

/***/ },
/* 167 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['vbs'],
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'call class const dim do loop erase execute executeglobal exit for each next function ' +
	        'if then else on error option explicit new private property let get public randomize ' +
	        'redim rem select case set stop sub while wend with end to elseif is or xor and not ' +
	        'class_initialize class_terminate default preserve in me byval byref step resume goto',
	      built_in:
	        'lcase month vartype instrrev ubound setlocale getobject rgb getref string ' +
	        'weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency ' +
	        'conversions csng timevalue second year space abs clng timeserial fixs len asc ' +
	        'isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate ' +
	        'instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex ' +
	        'chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim ' +
	        'strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion ' +
	        'scriptengine split scriptengineminorversion cint sin datepart ltrim sqr ' +
	        'scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw ' +
	        'chrw regexp server response request cstr err',
	      literal:
	        'true false null nothing empty'
	    },
	    illegal: '//',
	    contains: [
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {contains: [{begin: '""'}]}),
	      hljs.COMMENT(
	        /'/,
	        /$/,
	        {
	          relevance: 0
	        }
	      ),
	      hljs.C_NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 168 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    subLanguage: 'xml',
	    contains: [
	      {
	        begin: '<%', end: '%>',
	        subLanguage: 'vbscript'
	      }
	    ]
	  };
	};

/***/ },
/* 169 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    aliases: ['v'],
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'always and assign begin buf bufif0 bufif1 case casex casez cmos deassign ' +
	        'default defparam disable edge else end endcase endfunction endmodule ' +
	        'endprimitive endspecify endtable endtask event for force forever fork ' +
	        'function if ifnone initial inout input join macromodule module nand ' +
	        'negedge nmos nor not notif0 notif1 or output parameter pmos posedge ' +
	        'primitive pulldown pullup rcmos release repeat rnmos rpmos rtran ' +
	        'rtranif0 rtranif1 specify specparam table task timescale tran ' +
	        'tranif0 tranif1 wait while xnor xor',
	      typename:
	        'highz0 highz1 integer large medium pull0 pull1 real realtime reg ' +
	        'scalared signed small strong0 strong1 supply0 supply0 supply1 supply1 ' +
	        'time tri tri0 tri1 triand trior trireg vectored wand weak0 weak1 wire wor'
	    },
	    contains: [
	      hljs.C_BLOCK_COMMENT_MODE,
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'number',
	        begin: '\\b(\\d+\'(b|h|o|d|B|H|O|D))?[0-9xzXZ]+',
	        contains: [hljs.BACKSLASH_ESCAPE],
	        relevance: 0
	      },
	      /* ports in instances */
	      {
	        className: 'typename',
	        begin: '\\.\\w+',
	        relevance: 0
	      },
	      /* parameters to instances */
	      {
	        className: 'value',
	        begin: '#\\((?!parameter).+\\)'
	      },
	      /* operators */
	      {
	        className: 'keyword',
	        begin: '\\+|-|\\*|/|%|<|>|=|#|`|\\!|&|\\||@|:|\\^|~|\\{|\\}',
	        relevance: 0
	      }
	    ]
	  }; // return
	};

/***/ },
/* 170 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  // Regular expression for VHDL numeric literals.

	  // Decimal literal:
	  var INTEGER_RE = '\\d(_|\\d)*';
	  var EXPONENT_RE = '[eE][-+]?' + INTEGER_RE;
	  var DECIMAL_LITERAL_RE = INTEGER_RE + '(\\.' + INTEGER_RE + ')?' + '(' + EXPONENT_RE + ')?';
	  // Based literal:
	  var BASED_INTEGER_RE = '\\w+';
	  var BASED_LITERAL_RE = INTEGER_RE + '#' + BASED_INTEGER_RE + '(\\.' + BASED_INTEGER_RE + ')?' + '#' + '(' + EXPONENT_RE + ')?';

	  var NUMBER_RE = '\\b(' + BASED_LITERAL_RE + '|' + DECIMAL_LITERAL_RE + ')';

	  return {
	    case_insensitive: true,
	    keywords: {
	      keyword:
	        'abs access after alias all and architecture array assert attribute begin block ' +
	        'body buffer bus case component configuration constant context cover disconnect ' +
	        'downto default else elsif end entity exit fairness file for force function generate ' +
	        'generic group guarded if impure in inertial inout is label library linkage literal ' +
	        'loop map mod nand new next nor not null of on open or others out package port ' +
	        'postponed procedure process property protected pure range record register reject ' +
	        'release rem report restrict restrict_guarantee return rol ror select sequence ' +
	        'severity shared signal sla sll sra srl strong subtype then to transport type ' +
	        'unaffected units until use variable vmode vprop vunit wait when while with xnor xor',
	      typename:
	        'boolean bit character severity_level integer time delay_length natural positive ' +
	        'string bit_vector file_open_kind file_open_status std_ulogic std_ulogic_vector ' +
	        'std_logic std_logic_vector unsigned signed boolean_vector integer_vector ' +
	        'real_vector time_vector'
	    },
	    illegal: '{',
	    contains: [
	      hljs.C_BLOCK_COMMENT_MODE,        // VHDL-2008 block commenting.
	      hljs.COMMENT('--', '$'),
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'number',
	        begin: NUMBER_RE,
	        relevance: 0
	      },
	      {
	        className: 'literal',
	        begin: '\'(U|X|0|1|Z|W|L|H|-)\'',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      },
	      {
	        className: 'attribute',
	        begin: '\'[A-Za-z](_?[A-Za-z0-9])*',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      }
	    ]
	  };
	};

/***/ },
/* 171 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    lexemes: /[!#@\w]+/,
	    keywords: {
	      keyword: //ex command
	        // express version except: ! & * < = > !! # @ @@
	        'N|0 P|0 X|0 a|0 ab abc abo al am an|0 ar arga argd arge argdo argg argl argu as au aug aun b|0 bN ba bad bd be bel bf bl bm bn bo bp br brea breaka breakd breakl bro bufdo buffers bun bw c|0 cN cNf ca cabc caddb cad caddf cal cat cb cc ccl cd ce cex cf cfir cgetb cgete cg changes chd che checkt cl cla clo cm cmapc cme cn cnew cnf cno cnorea cnoreme co col colo com comc comp con conf cope '+
	        'cp cpf cq cr cs cst cu cuna cunme cw d|0 delm deb debugg delc delf dif diffg diffo diffp diffpu diffs diffthis dig di dl dell dj dli do doautoa dp dr ds dsp e|0 ea ec echoe echoh echom echon el elsei em en endfo endf endt endw ene ex exe exi exu f|0 files filet fin fina fini fir fix fo foldc foldd folddoc foldo for fu g|0 go gr grepa gu gv ha h|0 helpf helpg helpt hi hid his i|0 ia iabc if ij il im imapc '+
	        'ime ino inorea inoreme int is isp iu iuna iunme j|0 ju k|0 keepa kee keepj lN lNf l|0 lad laddb laddf la lan lat lb lc lch lcl lcs le lefta let lex lf lfir lgetb lgete lg lgr lgrepa lh ll lla lli lmak lm lmapc lne lnew lnf ln loadk lo loc lockv lol lope lp lpf lr ls lt lu lua luad luaf lv lvimgrepa lw m|0 ma mak map mapc marks mat me menut mes mk mks mksp mkv mkvie mod mz mzf nbc nb nbs n|0 new nm nmapc nme nn nnoreme noa no noh norea noreme norm nu nun nunme ol o|0 om omapc ome on ono onoreme opt ou ounme ow p|0 '+
	        'profd prof pro promptr pc ped pe perld po popu pp pre prev ps pt ptN ptf ptj ptl ptn ptp ptr pts pu pw py3 python3 py3d py3f py pyd pyf q|0 quita qa r|0 rec red redi redr redraws reg res ret retu rew ri rightb rub rubyd rubyf rund ru rv s|0 sN san sa sal sav sb sbN sba sbf sbl sbm sbn sbp sbr scrip scripte scs se setf setg setl sf sfir sh sim sig sil sl sla sm smap smapc sme sn sni sno snor snoreme sor '+
	        'so spelld spe spelli spellr spellu spellw sp spr sre st sta startg startr star stopi stj sts sun sunm sunme sus sv sw sy synti sync t|0 tN tabN tabc tabdo tabe tabf tabfir tabl tabm tabnew '+
	        'tabn tabo tabp tabr tabs tab ta tags tc tcld tclf te tf th tj tl tm tn to tp tr try ts tu u|0 undoj undol una unh unl unlo unm unme uns up v|0 ve verb vert vim vimgrepa vi viu vie vm vmapc vme vne vn vnoreme vs vu vunme windo w|0 wN wa wh wi winc winp wn wp wq wqa ws wu wv x|0 xa xmapc xm xme xn xnoreme xu xunme y|0 z|0 ~ '+
	        // full version
	        'Next Print append abbreviate abclear aboveleft all amenu anoremenu args argadd argdelete argedit argglobal arglocal argument ascii autocmd augroup aunmenu buffer bNext ball badd bdelete behave belowright bfirst blast bmodified bnext botright bprevious brewind break breakadd breakdel breaklist browse bunload '+
	        'bwipeout change cNext cNfile cabbrev cabclear caddbuffer caddexpr caddfile call catch cbuffer cclose center cexpr cfile cfirst cgetbuffer cgetexpr cgetfile chdir checkpath checktime clist clast close cmap cmapclear cmenu cnext cnewer cnfile cnoremap cnoreabbrev cnoremenu copy colder colorscheme command comclear compiler continue confirm copen cprevious cpfile cquit crewind cscope cstag cunmap '+
	        'cunabbrev cunmenu cwindow delete delmarks debug debuggreedy delcommand delfunction diffupdate diffget diffoff diffpatch diffput diffsplit digraphs display deletel djump dlist doautocmd doautoall deletep drop dsearch dsplit edit earlier echo echoerr echohl echomsg else elseif emenu endif endfor '+
	        'endfunction endtry endwhile enew execute exit exusage file filetype find finally finish first fixdel fold foldclose folddoopen folddoclosed foldopen function global goto grep grepadd gui gvim hardcopy help helpfind helpgrep helptags highlight hide history insert iabbrev iabclear ijump ilist imap '+
	        'imapclear imenu inoremap inoreabbrev inoremenu intro isearch isplit iunmap iunabbrev iunmenu join jumps keepalt keepmarks keepjumps lNext lNfile list laddexpr laddbuffer laddfile last language later lbuffer lcd lchdir lclose lcscope left leftabove lexpr lfile lfirst lgetbuffer lgetexpr lgetfile lgrep lgrepadd lhelpgrep llast llist lmake lmap lmapclear lnext lnewer lnfile lnoremap loadkeymap loadview '+
	        'lockmarks lockvar lolder lopen lprevious lpfile lrewind ltag lunmap luado luafile lvimgrep lvimgrepadd lwindow move mark make mapclear match menu menutranslate messages mkexrc mksession mkspell mkvimrc mkview mode mzscheme mzfile nbclose nbkey nbsart next nmap nmapclear nmenu nnoremap '+
	        'nnoremenu noautocmd noremap nohlsearch noreabbrev noremenu normal number nunmap nunmenu oldfiles open omap omapclear omenu only onoremap onoremenu options ounmap ounmenu ownsyntax print profdel profile promptfind promptrepl pclose pedit perl perldo pop popup ppop preserve previous psearch ptag ptNext '+
	        'ptfirst ptjump ptlast ptnext ptprevious ptrewind ptselect put pwd py3do py3file python pydo pyfile quit quitall qall read recover redo redir redraw redrawstatus registers resize retab return rewind right rightbelow ruby rubydo rubyfile rundo runtime rviminfo substitute sNext sandbox sargument sall saveas sbuffer sbNext sball sbfirst sblast sbmodified sbnext sbprevious sbrewind scriptnames scriptencoding '+
	        'scscope set setfiletype setglobal setlocal sfind sfirst shell simalt sign silent sleep slast smagic smapclear smenu snext sniff snomagic snoremap snoremenu sort source spelldump spellgood spellinfo spellrepall spellundo spellwrong split sprevious srewind stop stag startgreplace startreplace '+
	        'startinsert stopinsert stjump stselect sunhide sunmap sunmenu suspend sview swapname syntax syntime syncbind tNext tabNext tabclose tabedit tabfind tabfirst tablast tabmove tabnext tabonly tabprevious tabrewind tag tcl tcldo tclfile tearoff tfirst throw tjump tlast tmenu tnext topleft tprevious '+'trewind tselect tunmenu undo undojoin undolist unabbreviate unhide unlet unlockvar unmap unmenu unsilent update vglobal version verbose vertical vimgrep vimgrepadd visual viusage view vmap vmapclear vmenu vnew '+
	        'vnoremap vnoremenu vsplit vunmap vunmenu write wNext wall while winsize wincmd winpos wnext wprevious wqall wsverb wundo wviminfo xit xall xmapclear xmap xmenu xnoremap xnoremenu xunmap xunmenu yank',
	      built_in: //built in func
	        'abs acos add and append argc argidx argv asin atan atan2 browse browsedir bufexists buflisted bufloaded bufname bufnr bufwinnr byte2line byteidx call ceil changenr char2nr cindent clearmatches col complete complete_add complete_check confirm copy cos cosh count cscope_connection cursor '+
	        'deepcopy delete did_filetype diff_filler diff_hlID empty escape eval eventhandler executable exists exp expand extend feedkeys filereadable filewritable filter finddir findfile float2nr floor fmod fnameescape fnamemodify foldclosed foldclosedend foldlevel foldtext foldtextresult foreground function '+
	        'garbagecollect get getbufline getbufvar getchar getcharmod getcmdline getcmdpos getcmdtype getcwd getfontname getfperm getfsize getftime getftype getline getloclist getmatches getpid getpos getqflist getreg getregtype gettabvar gettabwinvar getwinposx getwinposy getwinvar glob globpath has has_key '+
	        'haslocaldir hasmapto histadd histdel histget histnr hlexists hlID hostname iconv indent index input inputdialog inputlist inputrestore inputsave inputsecret insert invert isdirectory islocked items join keys len libcall libcallnr line line2byte lispindent localtime log log10 luaeval map maparg mapcheck '+
	        'match matchadd matcharg matchdelete matchend matchlist matchstr max min mkdir mode mzeval nextnonblank nr2char or pathshorten pow prevnonblank printf pumvisible py3eval pyeval range readfile reltime reltimestr remote_expr remote_foreground remote_peek remote_read remote_send remove rename repeat '+
	        'resolve reverse round screenattr screenchar screencol screenrow search searchdecl searchpair searchpairpos searchpos server2client serverlist setbufvar setcmdpos setline setloclist setmatches setpos setqflist setreg settabvar settabwinvar setwinvar sha256 shellescape shiftwidth simplify sin '+
	        'sinh sort soundfold spellbadword spellsuggest split sqrt str2float str2nr strchars strdisplaywidth strftime stridx string strlen strpart strridx strtrans strwidth submatch substitute synconcealed synID synIDattr '+
	        'synIDtrans synstack system tabpagebuflist tabpagenr tabpagewinnr tagfiles taglist tan tanh tempname tolower toupper tr trunc type undofile undotree values virtcol visualmode wildmenumode winbufnr wincol winheight winline winnr winrestcmd winrestview winsaveview winwidth writefile xor'
	    },
	    illegal: /[{:]/,
	    contains: [
	      hljs.NUMBER_MODE,
	      hljs.APOS_STRING_MODE,
	      {
	        className: 'string',
	        // quote with escape, comment as quote
	        begin: /"((\\")|[^"\n])*("|\n)/
	      },
	      {
	        className: 'variable',
	        begin: /[bwtglsav]:[\w\d_]*/
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function function!', end: '$',
	        relevance: 0,
	        contains: [
	          hljs.TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)'
	          }
	        ]
	      }
	    ]
	  };
	};

/***/ },
/* 172 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  return {
	    case_insensitive: true,
	    lexemes: '\\.?' + hljs.IDENT_RE,
	    keywords: {
	      keyword:
	        'lock rep repe repz repne repnz xaquire xrelease bnd nobnd ' +
	        'aaa aad aam aas adc add and arpl bb0_reset bb1_reset bound bsf bsr bswap bt btc btr bts call cbw cdq cdqe clc cld cli clts cmc cmp cmpsb cmpsd cmpsq cmpsw cmpxchg cmpxchg486 cmpxchg8b cmpxchg16b cpuid cpu_read cpu_write cqo cwd cwde daa das dec div dmint emms enter equ f2xm1 fabs fadd faddp fbld fbstp fchs fclex fcmovb fcmovbe fcmove fcmovnb fcmovnbe fcmovne fcmovnu fcmovu fcom fcomi fcomip fcomp fcompp fcos fdecstp fdisi fdiv fdivp fdivr fdivrp femms feni ffree ffreep fiadd ficom ficomp fidiv fidivr fild fimul fincstp finit fist fistp fisttp fisub fisubr fld fld1 fldcw fldenv fldl2e fldl2t fldlg2 fldln2 fldpi fldz fmul fmulp fnclex fndisi fneni fninit fnop fnsave fnstcw fnstenv fnstsw fpatan fprem fprem1 fptan frndint frstor fsave fscale fsetpm fsin fsincos fsqrt fst fstcw fstenv fstp fstsw fsub fsubp fsubr fsubrp ftst fucom fucomi fucomip fucomp fucompp fxam fxch fxtract fyl2x fyl2xp1 hlt ibts icebp idiv imul in inc incbin insb insd insw int int01 int1 int03 int3 into invd invpcid invlpg invlpga iret iretd iretq iretw jcxz jecxz jrcxz jmp jmpe lahf lar lds lea leave les lfence lfs lgdt lgs lidt lldt lmsw loadall loadall286 lodsb lodsd lodsq lodsw loop loope loopne loopnz loopz lsl lss ltr mfence monitor mov movd movq movsb movsd movsq movsw movsx movsxd movzx mul mwait neg nop not or out outsb outsd outsw packssdw packsswb packuswb paddb paddd paddsb paddsiw paddsw paddusb paddusw paddw pand pandn pause paveb pavgusb pcmpeqb pcmpeqd pcmpeqw pcmpgtb pcmpgtd pcmpgtw pdistib pf2id pfacc pfadd pfcmpeq pfcmpge pfcmpgt pfmax pfmin pfmul pfrcp pfrcpit1 pfrcpit2 pfrsqit1 pfrsqrt pfsub pfsubr pi2fd pmachriw pmaddwd pmagw pmulhriw pmulhrwa pmulhrwc pmulhw pmullw pmvgezb pmvlzb pmvnzb pmvzb pop popa popad popaw popf popfd popfq popfw por prefetch prefetchw pslld psllq psllw psrad psraw psrld psrlq psrlw psubb psubd psubsb psubsiw psubsw psubusb psubusw psubw punpckhbw punpckhdq punpckhwd punpcklbw punpckldq punpcklwd push pusha pushad pushaw pushf pushfd pushfq pushfw pxor rcl rcr rdshr rdmsr rdpmc rdtsc rdtscp ret retf retn rol ror rdm rsdc rsldt rsm rsts sahf sal salc sar sbb scasb scasd scasq scasw sfence sgdt shl shld shr shrd sidt sldt skinit smi smint smintold smsw stc std sti stosb stosd stosq stosw str sub svdc svldt svts swapgs syscall sysenter sysexit sysret test ud0 ud1 ud2b ud2 ud2a umov verr verw fwait wbinvd wrshr wrmsr xadd xbts xchg xlatb xlat xor cmove cmovz cmovne cmovnz cmova cmovnbe cmovae cmovnb cmovb cmovnae cmovbe cmovna cmovg cmovnle cmovge cmovnl cmovl cmovnge cmovle cmovng cmovc cmovnc cmovo cmovno cmovs cmovns cmovp cmovpe cmovnp cmovpo je jz jne jnz ja jnbe jae jnb jb jnae jbe jna jg jnle jge jnl jl jnge jle jng jc jnc jo jno js jns jpo jnp jpe jp sete setz setne setnz seta setnbe setae setnb setnc setb setnae setcset setbe setna setg setnle setge setnl setl setnge setle setng sets setns seto setno setpe setp setpo setnp addps addss andnps andps cmpeqps cmpeqss cmpleps cmpless cmpltps cmpltss cmpneqps cmpneqss cmpnleps cmpnless cmpnltps cmpnltss cmpordps cmpordss cmpunordps cmpunordss cmpps cmpss comiss cvtpi2ps cvtps2pi cvtsi2ss cvtss2si cvttps2pi cvttss2si divps divss ldmxcsr maxps maxss minps minss movaps movhps movlhps movlps movhlps movmskps movntps movss movups mulps mulss orps rcpps rcpss rsqrtps rsqrtss shufps sqrtps sqrtss stmxcsr subps subss ucomiss unpckhps unpcklps xorps fxrstor fxrstor64 fxsave fxsave64 xgetbv xsetbv xsave xsave64 xsaveopt xsaveopt64 xrstor xrstor64 prefetchnta prefetcht0 prefetcht1 prefetcht2 maskmovq movntq pavgb pavgw pextrw pinsrw pmaxsw pmaxub pminsw pminub pmovmskb pmulhuw psadbw pshufw pf2iw pfnacc pfpnacc pi2fw pswapd maskmovdqu clflush movntdq movnti movntpd movdqa movdqu movdq2q movq2dq paddq pmuludq pshufd pshufhw pshuflw pslldq psrldq psubq punpckhqdq punpcklqdq addpd addsd andnpd andpd cmpeqpd cmpeqsd cmplepd cmplesd cmpltpd cmpltsd cmpneqpd cmpneqsd cmpnlepd cmpnlesd cmpnltpd cmpnltsd cmpordpd cmpordsd cmpunordpd cmpunordsd cmppd comisd cvtdq2pd cvtdq2ps cvtpd2dq cvtpd2pi cvtpd2ps cvtpi2pd cvtps2dq cvtps2pd cvtsd2si cvtsd2ss cvtsi2sd cvtss2sd cvttpd2pi cvttpd2dq cvttps2dq cvttsd2si divpd divsd maxpd maxsd minpd minsd movapd movhpd movlpd movmskpd movupd mulpd mulsd orpd shufpd sqrtpd sqrtsd subpd subsd ucomisd unpckhpd unpcklpd xorpd addsubpd addsubps haddpd haddps hsubpd hsubps lddqu movddup movshdup movsldup clgi stgi vmcall vmclear vmfunc vmlaunch vmload vmmcall vmptrld vmptrst vmread vmresume vmrun vmsave vmwrite vmxoff vmxon invept invvpid pabsb pabsw pabsd palignr phaddw phaddd phaddsw phsubw phsubd phsubsw pmaddubsw pmulhrsw pshufb psignb psignw psignd extrq insertq movntsd movntss lzcnt blendpd blendps blendvpd blendvps dppd dpps extractps insertps movntdqa mpsadbw packusdw pblendvb pblendw pcmpeqq pextrb pextrd pextrq phminposuw pinsrb pinsrd pinsrq pmaxsb pmaxsd pmaxud pmaxuw pminsb pminsd pminud pminuw pmovsxbw pmovsxbd pmovsxbq pmovsxwd pmovsxwq pmovsxdq pmovzxbw pmovzxbd pmovzxbq pmovzxwd pmovzxwq pmovzxdq pmuldq pmulld ptest roundpd roundps roundsd roundss crc32 pcmpestri pcmpestrm pcmpistri pcmpistrm pcmpgtq popcnt getsec pfrcpv pfrsqrtv movbe aesenc aesenclast aesdec aesdeclast aesimc aeskeygenassist vaesenc vaesenclast vaesdec vaesdeclast vaesimc vaeskeygenassist vaddpd vaddps vaddsd vaddss vaddsubpd vaddsubps vandpd vandps vandnpd vandnps vblendpd vblendps vblendvpd vblendvps vbroadcastss vbroadcastsd vbroadcastf128 vcmpeq_ospd vcmpeqpd vcmplt_ospd vcmpltpd vcmple_ospd vcmplepd vcmpunord_qpd vcmpunordpd vcmpneq_uqpd vcmpneqpd vcmpnlt_uspd vcmpnltpd vcmpnle_uspd vcmpnlepd vcmpord_qpd vcmpordpd vcmpeq_uqpd vcmpnge_uspd vcmpngepd vcmpngt_uspd vcmpngtpd vcmpfalse_oqpd vcmpfalsepd vcmpneq_oqpd vcmpge_ospd vcmpgepd vcmpgt_ospd vcmpgtpd vcmptrue_uqpd vcmptruepd vcmplt_oqpd vcmple_oqpd vcmpunord_spd vcmpneq_uspd vcmpnlt_uqpd vcmpnle_uqpd vcmpord_spd vcmpeq_uspd vcmpnge_uqpd vcmpngt_uqpd vcmpfalse_ospd vcmpneq_ospd vcmpge_oqpd vcmpgt_oqpd vcmptrue_uspd vcmppd vcmpeq_osps vcmpeqps vcmplt_osps vcmpltps vcmple_osps vcmpleps vcmpunord_qps vcmpunordps vcmpneq_uqps vcmpneqps vcmpnlt_usps vcmpnltps vcmpnle_usps vcmpnleps vcmpord_qps vcmpordps vcmpeq_uqps vcmpnge_usps vcmpngeps vcmpngt_usps vcmpngtps vcmpfalse_oqps vcmpfalseps vcmpneq_oqps vcmpge_osps vcmpgeps vcmpgt_osps vcmpgtps vcmptrue_uqps vcmptrueps vcmplt_oqps vcmple_oqps vcmpunord_sps vcmpneq_usps vcmpnlt_uqps vcmpnle_uqps vcmpord_sps vcmpeq_usps vcmpnge_uqps vcmpngt_uqps vcmpfalse_osps vcmpneq_osps vcmpge_oqps vcmpgt_oqps vcmptrue_usps vcmpps vcmpeq_ossd vcmpeqsd vcmplt_ossd vcmpltsd vcmple_ossd vcmplesd vcmpunord_qsd vcmpunordsd vcmpneq_uqsd vcmpneqsd vcmpnlt_ussd vcmpnltsd vcmpnle_ussd vcmpnlesd vcmpord_qsd vcmpordsd vcmpeq_uqsd vcmpnge_ussd vcmpngesd vcmpngt_ussd vcmpngtsd vcmpfalse_oqsd vcmpfalsesd vcmpneq_oqsd vcmpge_ossd vcmpgesd vcmpgt_ossd vcmpgtsd vcmptrue_uqsd vcmptruesd vcmplt_oqsd vcmple_oqsd vcmpunord_ssd vcmpneq_ussd vcmpnlt_uqsd vcmpnle_uqsd vcmpord_ssd vcmpeq_ussd vcmpnge_uqsd vcmpngt_uqsd vcmpfalse_ossd vcmpneq_ossd vcmpge_oqsd vcmpgt_oqsd vcmptrue_ussd vcmpsd vcmpeq_osss vcmpeqss vcmplt_osss vcmpltss vcmple_osss vcmpless vcmpunord_qss vcmpunordss vcmpneq_uqss vcmpneqss vcmpnlt_usss vcmpnltss vcmpnle_usss vcmpnless vcmpord_qss vcmpordss vcmpeq_uqss vcmpnge_usss vcmpngess vcmpngt_usss vcmpngtss vcmpfalse_oqss vcmpfalsess vcmpneq_oqss vcmpge_osss vcmpgess vcmpgt_osss vcmpgtss vcmptrue_uqss vcmptruess vcmplt_oqss vcmple_oqss vcmpunord_sss vcmpneq_usss vcmpnlt_uqss vcmpnle_uqss vcmpord_sss vcmpeq_usss vcmpnge_uqss vcmpngt_uqss vcmpfalse_osss vcmpneq_osss vcmpge_oqss vcmpgt_oqss vcmptrue_usss vcmpss vcomisd vcomiss vcvtdq2pd vcvtdq2ps vcvtpd2dq vcvtpd2ps vcvtps2dq vcvtps2pd vcvtsd2si vcvtsd2ss vcvtsi2sd vcvtsi2ss vcvtss2sd vcvtss2si vcvttpd2dq vcvttps2dq vcvttsd2si vcvttss2si vdivpd vdivps vdivsd vdivss vdppd vdpps vextractf128 vextractps vhaddpd vhaddps vhsubpd vhsubps vinsertf128 vinsertps vlddqu vldqqu vldmxcsr vmaskmovdqu vmaskmovps vmaskmovpd vmaxpd vmaxps vmaxsd vmaxss vminpd vminps vminsd vminss vmovapd vmovaps vmovd vmovq vmovddup vmovdqa vmovqqa vmovdqu vmovqqu vmovhlps vmovhpd vmovhps vmovlhps vmovlpd vmovlps vmovmskpd vmovmskps vmovntdq vmovntqq vmovntdqa vmovntpd vmovntps vmovsd vmovshdup vmovsldup vmovss vmovupd vmovups vmpsadbw vmulpd vmulps vmulsd vmulss vorpd vorps vpabsb vpabsw vpabsd vpacksswb vpackssdw vpackuswb vpackusdw vpaddb vpaddw vpaddd vpaddq vpaddsb vpaddsw vpaddusb vpaddusw vpalignr vpand vpandn vpavgb vpavgw vpblendvb vpblendw vpcmpestri vpcmpestrm vpcmpistri vpcmpistrm vpcmpeqb vpcmpeqw vpcmpeqd vpcmpeqq vpcmpgtb vpcmpgtw vpcmpgtd vpcmpgtq vpermilpd vpermilps vperm2f128 vpextrb vpextrw vpextrd vpextrq vphaddw vphaddd vphaddsw vphminposuw vphsubw vphsubd vphsubsw vpinsrb vpinsrw vpinsrd vpinsrq vpmaddwd vpmaddubsw vpmaxsb vpmaxsw vpmaxsd vpmaxub vpmaxuw vpmaxud vpminsb vpminsw vpminsd vpminub vpminuw vpminud vpmovmskb vpmovsxbw vpmovsxbd vpmovsxbq vpmovsxwd vpmovsxwq vpmovsxdq vpmovzxbw vpmovzxbd vpmovzxbq vpmovzxwd vpmovzxwq vpmovzxdq vpmulhuw vpmulhrsw vpmulhw vpmullw vpmulld vpmuludq vpmuldq vpor vpsadbw vpshufb vpshufd vpshufhw vpshuflw vpsignb vpsignw vpsignd vpslldq vpsrldq vpsllw vpslld vpsllq vpsraw vpsrad vpsrlw vpsrld vpsrlq vptest vpsubb vpsubw vpsubd vpsubq vpsubsb vpsubsw vpsubusb vpsubusw vpunpckhbw vpunpckhwd vpunpckhdq vpunpckhqdq vpunpcklbw vpunpcklwd vpunpckldq vpunpcklqdq vpxor vrcpps vrcpss vrsqrtps vrsqrtss vroundpd vroundps vroundsd vroundss vshufpd vshufps vsqrtpd vsqrtps vsqrtsd vsqrtss vstmxcsr vsubpd vsubps vsubsd vsubss vtestps vtestpd vucomisd vucomiss vunpckhpd vunpckhps vunpcklpd vunpcklps vxorpd vxorps vzeroall vzeroupper pclmullqlqdq pclmulhqlqdq pclmullqhqdq pclmulhqhqdq pclmulqdq vpclmullqlqdq vpclmulhqlqdq vpclmullqhqdq vpclmulhqhqdq vpclmulqdq vfmadd132ps vfmadd132pd vfmadd312ps vfmadd312pd vfmadd213ps vfmadd213pd vfmadd123ps vfmadd123pd vfmadd231ps vfmadd231pd vfmadd321ps vfmadd321pd vfmaddsub132ps vfmaddsub132pd vfmaddsub312ps vfmaddsub312pd vfmaddsub213ps vfmaddsub213pd vfmaddsub123ps vfmaddsub123pd vfmaddsub231ps vfmaddsub231pd vfmaddsub321ps vfmaddsub321pd vfmsub132ps vfmsub132pd vfmsub312ps vfmsub312pd vfmsub213ps vfmsub213pd vfmsub123ps vfmsub123pd vfmsub231ps vfmsub231pd vfmsub321ps vfmsub321pd vfmsubadd132ps vfmsubadd132pd vfmsubadd312ps vfmsubadd312pd vfmsubadd213ps vfmsubadd213pd vfmsubadd123ps vfmsubadd123pd vfmsubadd231ps vfmsubadd231pd vfmsubadd321ps vfmsubadd321pd vfnmadd132ps vfnmadd132pd vfnmadd312ps vfnmadd312pd vfnmadd213ps vfnmadd213pd vfnmadd123ps vfnmadd123pd vfnmadd231ps vfnmadd231pd vfnmadd321ps vfnmadd321pd vfnmsub132ps vfnmsub132pd vfnmsub312ps vfnmsub312pd vfnmsub213ps vfnmsub213pd vfnmsub123ps vfnmsub123pd vfnmsub231ps vfnmsub231pd vfnmsub321ps vfnmsub321pd vfmadd132ss vfmadd132sd vfmadd312ss vfmadd312sd vfmadd213ss vfmadd213sd vfmadd123ss vfmadd123sd vfmadd231ss vfmadd231sd vfmadd321ss vfmadd321sd vfmsub132ss vfmsub132sd vfmsub312ss vfmsub312sd vfmsub213ss vfmsub213sd vfmsub123ss vfmsub123sd vfmsub231ss vfmsub231sd vfmsub321ss vfmsub321sd vfnmadd132ss vfnmadd132sd vfnmadd312ss vfnmadd312sd vfnmadd213ss vfnmadd213sd vfnmadd123ss vfnmadd123sd vfnmadd231ss vfnmadd231sd vfnmadd321ss vfnmadd321sd vfnmsub132ss vfnmsub132sd vfnmsub312ss vfnmsub312sd vfnmsub213ss vfnmsub213sd vfnmsub123ss vfnmsub123sd vfnmsub231ss vfnmsub231sd vfnmsub321ss vfnmsub321sd rdfsbase rdgsbase rdrand wrfsbase wrgsbase vcvtph2ps vcvtps2ph adcx adox rdseed clac stac xstore xcryptecb xcryptcbc xcryptctr xcryptcfb xcryptofb montmul xsha1 xsha256 llwpcb slwpcb lwpval lwpins vfmaddpd vfmaddps vfmaddsd vfmaddss vfmaddsubpd vfmaddsubps vfmsubaddpd vfmsubaddps vfmsubpd vfmsubps vfmsubsd vfmsubss vfnmaddpd vfnmaddps vfnmaddsd vfnmaddss vfnmsubpd vfnmsubps vfnmsubsd vfnmsubss vfrczpd vfrczps vfrczsd vfrczss vpcmov vpcomb vpcomd vpcomq vpcomub vpcomud vpcomuq vpcomuw vpcomw vphaddbd vphaddbq vphaddbw vphadddq vphaddubd vphaddubq vphaddubw vphaddudq vphadduwd vphadduwq vphaddwd vphaddwq vphsubbw vphsubdq vphsubwd vpmacsdd vpmacsdqh vpmacsdql vpmacssdd vpmacssdqh vpmacssdql vpmacsswd vpmacssww vpmacswd vpmacsww vpmadcsswd vpmadcswd vpperm vprotb vprotd vprotq vprotw vpshab vpshad vpshaq vpshaw vpshlb vpshld vpshlq vpshlw vbroadcasti128 vpblendd vpbroadcastb vpbroadcastw vpbroadcastd vpbroadcastq vpermd vpermpd vpermps vpermq vperm2i128 vextracti128 vinserti128 vpmaskmovd vpmaskmovq vpsllvd vpsllvq vpsravd vpsrlvd vpsrlvq vgatherdpd vgatherqpd vgatherdps vgatherqps vpgatherdd vpgatherqd vpgatherdq vpgatherqq xabort xbegin xend xtest andn bextr blci blcic blsi blsic blcfill blsfill blcmsk blsmsk blsr blcs bzhi mulx pdep pext rorx sarx shlx shrx tzcnt tzmsk t1mskc valignd valignq vblendmpd vblendmps vbroadcastf32x4 vbroadcastf64x4 vbroadcasti32x4 vbroadcasti64x4 vcompresspd vcompressps vcvtpd2udq vcvtps2udq vcvtsd2usi vcvtss2usi vcvttpd2udq vcvttps2udq vcvttsd2usi vcvttss2usi vcvtudq2pd vcvtudq2ps vcvtusi2sd vcvtusi2ss vexpandpd vexpandps vextractf32x4 vextractf64x4 vextracti32x4 vextracti64x4 vfixupimmpd vfixupimmps vfixupimmsd vfixupimmss vgetexppd vgetexpps vgetexpsd vgetexpss vgetmantpd vgetmantps vgetmantsd vgetmantss vinsertf32x4 vinsertf64x4 vinserti32x4 vinserti64x4 vmovdqa32 vmovdqa64 vmovdqu32 vmovdqu64 vpabsq vpandd vpandnd vpandnq vpandq vpblendmd vpblendmq vpcmpltd vpcmpled vpcmpneqd vpcmpnltd vpcmpnled vpcmpd vpcmpltq vpcmpleq vpcmpneqq vpcmpnltq vpcmpnleq vpcmpq vpcmpequd vpcmpltud vpcmpleud vpcmpnequd vpcmpnltud vpcmpnleud vpcmpud vpcmpequq vpcmpltuq vpcmpleuq vpcmpnequq vpcmpnltuq vpcmpnleuq vpcmpuq vpcompressd vpcompressq vpermi2d vpermi2pd vpermi2ps vpermi2q vpermt2d vpermt2pd vpermt2ps vpermt2q vpexpandd vpexpandq vpmaxsq vpmaxuq vpminsq vpminuq vpmovdb vpmovdw vpmovqb vpmovqd vpmovqw vpmovsdb vpmovsdw vpmovsqb vpmovsqd vpmovsqw vpmovusdb vpmovusdw vpmovusqb vpmovusqd vpmovusqw vpord vporq vprold vprolq vprolvd vprolvq vprord vprorq vprorvd vprorvq vpscatterdd vpscatterdq vpscatterqd vpscatterqq vpsraq vpsravq vpternlogd vpternlogq vptestmd vptestmq vptestnmd vptestnmq vpxord vpxorq vrcp14pd vrcp14ps vrcp14sd vrcp14ss vrndscalepd vrndscaleps vrndscalesd vrndscaless vrsqrt14pd vrsqrt14ps vrsqrt14sd vrsqrt14ss vscalefpd vscalefps vscalefsd vscalefss vscatterdpd vscatterdps vscatterqpd vscatterqps vshuff32x4 vshuff64x2 vshufi32x4 vshufi64x2 kandnw kandw kmovw knotw kortestw korw kshiftlw kshiftrw kunpckbw kxnorw kxorw vpbroadcastmb2q vpbroadcastmw2d vpconflictd vpconflictq vplzcntd vplzcntq vexp2pd vexp2ps vrcp28pd vrcp28ps vrcp28sd vrcp28ss vrsqrt28pd vrsqrt28ps vrsqrt28sd vrsqrt28ss vgatherpf0dpd vgatherpf0dps vgatherpf0qpd vgatherpf0qps vgatherpf1dpd vgatherpf1dps vgatherpf1qpd vgatherpf1qps vscatterpf0dpd vscatterpf0dps vscatterpf0qpd vscatterpf0qps vscatterpf1dpd vscatterpf1dps vscatterpf1qpd vscatterpf1qps prefetchwt1 bndmk bndcl bndcu bndcn bndmov bndldx bndstx sha1rnds4 sha1nexte sha1msg1 sha1msg2 sha256rnds2 sha256msg1 sha256msg2 hint_nop0 hint_nop1 hint_nop2 hint_nop3 hint_nop4 hint_nop5 hint_nop6 hint_nop7 hint_nop8 hint_nop9 hint_nop10 hint_nop11 hint_nop12 hint_nop13 hint_nop14 hint_nop15 hint_nop16 hint_nop17 hint_nop18 hint_nop19 hint_nop20 hint_nop21 hint_nop22 hint_nop23 hint_nop24 hint_nop25 hint_nop26 hint_nop27 hint_nop28 hint_nop29 hint_nop30 hint_nop31 hint_nop32 hint_nop33 hint_nop34 hint_nop35 hint_nop36 hint_nop37 hint_nop38 hint_nop39 hint_nop40 hint_nop41 hint_nop42 hint_nop43 hint_nop44 hint_nop45 hint_nop46 hint_nop47 hint_nop48 hint_nop49 hint_nop50 hint_nop51 hint_nop52 hint_nop53 hint_nop54 hint_nop55 hint_nop56 hint_nop57 hint_nop58 hint_nop59 hint_nop60 hint_nop61 hint_nop62 hint_nop63',
	      literal:
	        // Instruction pointer
	        'ip eip rip ' +
	        // 8-bit registers
	        'al ah bl bh cl ch dl dh sil dil bpl spl r8b r9b r10b r11b r12b r13b r14b r15b ' +
	        // 16-bit registers
	        'ax bx cx dx si di bp sp r8w r9w r10w r11w r12w r13w r14w r15w ' +
	        // 32-bit registers
	        'eax ebx ecx edx esi edi ebp esp eip r8d r9d r10d r11d r12d r13d r14d r15d ' +
	        // 64-bit registers
	        'rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15 ' +
	        // Segment registers
	        'cs ds es fs gs ss ' +
	        // Floating point stack registers
	        'st st0 st1 st2 st3 st4 st5 st6 st7 ' +
	        // MMX Registers
	        'mm0 mm1 mm2 mm3 mm4 mm5 mm6 mm7 ' +
	        // SSE registers
	        'xmm0  xmm1  xmm2  xmm3  xmm4  xmm5  xmm6  xmm7  xmm8  xmm9 xmm10  xmm11 xmm12 xmm13 xmm14 xmm15 ' +
	        'xmm16 xmm17 xmm18 xmm19 xmm20 xmm21 xmm22 xmm23 xmm24 xmm25 xmm26 xmm27 xmm28 xmm29 xmm30 xmm31 ' +
	        // AVX registers
	        'ymm0  ymm1  ymm2  ymm3  ymm4  ymm5  ymm6  ymm7  ymm8  ymm9 ymm10  ymm11 ymm12 ymm13 ymm14 ymm15 ' +
	        'ymm16 ymm17 ymm18 ymm19 ymm20 ymm21 ymm22 ymm23 ymm24 ymm25 ymm26 ymm27 ymm28 ymm29 ymm30 ymm31 ' +
	        // AVX-512F registers
	        'zmm0  zmm1  zmm2  zmm3  zmm4  zmm5  zmm6  zmm7  zmm8  zmm9 zmm10  zmm11 zmm12 zmm13 zmm14 zmm15 ' +
	        'zmm16 zmm17 zmm18 zmm19 zmm20 zmm21 zmm22 zmm23 zmm24 zmm25 zmm26 zmm27 zmm28 zmm29 zmm30 zmm31 ' +
	        // AVX-512F mask registers
	        'k0 k1 k2 k3 k4 k5 k6 k7 ' +
	        // Bound (MPX) register
	        'bnd0 bnd1 bnd2 bnd3 ' +
	        // Special register
	        'cr0 cr1 cr2 cr3 cr4 cr8 dr0 dr1 dr2 dr3 dr8 tr3 tr4 tr5 tr6 tr7 ' +
	        // NASM altreg package
	        'r0 r1 r2 r3 r4 r5 r6 r7 r0b r1b r2b r3b r4b r5b r6b r7b ' +
	        'r0w r1w r2w r3w r4w r5w r6w r7w r0d r1d r2d r3d r4d r5d r6d r7d ' +
	        'r0h r1h r2h r3h ' +
	        'r0l r1l r2l r3l r4l r5l r6l r7l r8l r9l r10l r11l r12l r13l r14l r15l',

	      pseudo:
	        'db dw dd dq dt ddq do dy dz ' +
	        'resb resw resd resq rest resdq reso resy resz ' +
	        'incbin equ times',

	      preprocessor:
	        '%define %xdefine %+ %undef %defstr %deftok %assign %strcat %strlen %substr %rotate %elif %else %endif ' +
	        '%ifmacro %ifctx %ifidn %ifidni %ifid %ifnum %ifstr %iftoken %ifempty %ifenv %error %warning %fatal %rep ' +
	        '%endrep %include %push %pop %repl %pathsearch %depend %use %arg %stacksize %local %line %comment %endcomment ' +
	        '.nolist ' +
	        'byte word dword qword nosplit rel abs seg wrt strict near far a32 ptr ' +
	        '__FILE__ __LINE__ __SECT__  __BITS__ __OUTPUT_FORMAT__ __DATE__ __TIME__ __DATE_NUM__ __TIME_NUM__ ' +
	        '__UTC_DATE__ __UTC_TIME__ __UTC_DATE_NUM__ __UTC_TIME_NUM__  __PASS__ struc endstruc istruc at iend ' +
	        'align alignb sectalign daz nodaz up down zero default option assume public ',

	      built_in:
	        'bits use16 use32 use64 default section segment absolute extern global common cpu float ' +
	        '__utf16__ __utf16le__ __utf16be__ __utf32__ __utf32le__ __utf32be__ ' +
	        '__float8__ __float16__ __float32__ __float64__ __float80m__ __float80e__ __float128l__ __float128h__ ' +
	        '__Infinity__ __QNaN__ __SNaN__ Inf NaN QNaN SNaN float8 float16 float32 float64 float80m float80e ' +
	        'float128l float128h __FLOAT_DAZ__ __FLOAT_ROUND__ __FLOAT__'
	    },
	    contains: [
	      hljs.COMMENT(
	        ';',
	        '$',
	        {
	          relevance: 0
	        }
	      ),
	      {
	        className: 'number',
	        variants: [
	          // Float number and x87 BCD
	          {
	            begin: '\\b(?:([0-9][0-9_]*)?\\.[0-9_]*(?:[eE][+-]?[0-9_]+)?|' +
	                   '(0[Xx])?[0-9][0-9_]*\\.?[0-9_]*(?:[pP](?:[+-]?[0-9_]+)?)?)\\b',
	            relevance: 0
	          },

	          // Hex number in $
	          { begin: '\\$[0-9][0-9A-Fa-f]*', relevance: 0 },

	          // Number in H,D,T,Q,O,B,Y suffix
	          { begin: '\\b(?:[0-9A-Fa-f][0-9A-Fa-f_]*[Hh]|[0-9][0-9_]*[DdTt]?|[0-7][0-7_]*[QqOo]|[0-1][0-1_]*[BbYy])\\b' },

	          // Number in X,D,T,Q,O,B,Y prefix
	          { begin: '\\b(?:0[Xx][0-9A-Fa-f_]+|0[DdTt][0-9_]+|0[QqOo][0-7_]+|0[BbYy][0-1_]+)\\b'}
	        ]
	      },
	      // Double quote string
	      hljs.QUOTE_STRING_MODE,
	      {
	        className: 'string',
	        variants: [
	          // Single-quoted string
	          { begin: '\'', end: '[^\\\\]\'' },
	          // Backquoted string
	          { begin: '`', end: '[^\\\\]`' },
	          // Section name
	          { begin: '\\.[A-Za-z0-9]+' }
	        ],
	        relevance: 0
	      },
	      {
	        className: 'label',
	        variants: [
	          // Global label and local label
	          { begin: '^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)' },
	          // Macro-local label
	          { begin: '^\\s*%%[A-Za-z0-9_$#@~.?]*:' }
	        ],
	        relevance: 0
	      },
	      // Macro parameter
	      {
	        className: 'argument',
	        begin: '%[0-9]+',
	        relevance: 0
	      },
	      // Macro parameter
	      {
	        className: 'built_in',
	        begin: '%!\S+',
	        relevance: 0
	      }
	    ]
	  };
	};

/***/ },
/* 173 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var BUILTIN_MODULES =
	    'ObjectLoader Animate MovieCredits Slides Filters Shading Materials LensFlare Mapping VLCAudioVideo ' +
	    'StereoDecoder PointCloud NetworkAccess RemoteControl RegExp ChromaKey Snowfall NodeJS Speech Charts';

	  var XL_KEYWORDS = {
	    keyword: 'if then else do while until for loop import with is as where when by data constant',
	    literal: 'true false nil',
	    type: 'integer real text name boolean symbol infix prefix postfix block tree',
	    built_in: 'in mod rem and or xor not abs sign floor ceil sqrt sin cos tan asin acos atan exp expm1 log log2 log10 log1p pi at',
	    module: BUILTIN_MODULES,
	    id:
	      'text_length text_range text_find text_replace contains page slide basic_slide title_slide title subtitle ' +
	      'fade_in fade_out fade_at clear_color color line_color line_width texture_wrap texture_transform texture ' +
	      'scale_?x scale_?y scale_?z? translate_?x translate_?y translate_?z? rotate_?x rotate_?y rotate_?z? rectangle ' +
	      'circle ellipse sphere path line_to move_to quad_to curve_to theme background contents locally time mouse_?x ' +
	      'mouse_?y mouse_buttons'
	  };

	  var XL_CONSTANT = {
	    className: 'constant',
	    begin: '[A-Z][A-Z_0-9]+',
	    relevance: 0
	  };
	  var XL_VARIABLE = {
	    className: 'variable',
	    begin: '([A-Z][a-z_0-9]+)+',
	    relevance: 0
	  };
	  var XL_ID = {
	    className: 'id',
	    begin: '[a-z][a-z_0-9]+',
	    relevance: 0
	  };

	  var DOUBLE_QUOTE_TEXT = {
	    className: 'string',
	    begin: '"', end: '"', illegal: '\\n'
	  };
	  var SINGLE_QUOTE_TEXT = {
	    className: 'string',
	    begin: '\'', end: '\'', illegal: '\\n'
	  };
	  var LONG_TEXT = {
	    className: 'string',
	    begin: '<<', end: '>>'
	  };
	  var BASED_NUMBER = {
	    className: 'number',
	    begin: '[0-9]+#[0-9A-Z_]+(\\.[0-9-A-Z_]+)?#?([Ee][+-]?[0-9]+)?',
	    relevance: 10
	  };
	  var IMPORT = {
	    className: 'import',
	    beginKeywords: 'import', end: '$',
	    keywords: {
	      keyword: 'import',
	      module: BUILTIN_MODULES
	    },
	    relevance: 0,
	    contains: [DOUBLE_QUOTE_TEXT]
	  };
	  var FUNCTION_DEFINITION = {
	    className: 'function',
	    begin: '[a-z].*->'
	  };
	  return {
	    aliases: ['tao'],
	    lexemes: /[a-zA-Z][a-zA-Z0-9_?]*/,
	    keywords: XL_KEYWORDS,
	    contains: [
	    hljs.C_LINE_COMMENT_MODE,
	    hljs.C_BLOCK_COMMENT_MODE,
	    DOUBLE_QUOTE_TEXT,
	    SINGLE_QUOTE_TEXT,
	    LONG_TEXT,
	    FUNCTION_DEFINITION,
	    IMPORT,
	    XL_CONSTANT,
	    XL_VARIABLE,
	    XL_ID,
	    BASED_NUMBER,
	    hljs.NUMBER_MODE
	    ]
	  };
	};

/***/ },
/* 174 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var KEYWORDS = 'for let if while then else return where group by xquery encoding version' +
	    'module namespace boundary-space preserve strip default collation base-uri ordering' +
	    'copy-namespaces order declare import schema namespace function option in allowing empty' +
	    'at tumbling window sliding window start when only end when previous next stable ascending' +
	    'descending empty greatest least some every satisfies switch case typeswitch try catch and' +
	    'or to union intersect instance of treat as castable cast map array delete insert into' +
	    'replace value rename copy modify update';
	  var LITERAL = 'false true xs:string xs:integer element item xs:date xs:datetime xs:float xs:double xs:decimal QName xs:anyURI xs:long xs:int xs:short xs:byte attribute';
	  var VAR = {
	    className: 'variable',
	    begin: /\$[a-zA-Z0-9\-]+/,
	    relevance: 5
	  };

	  var NUMBER = {
	    className: 'number',
	    begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
	    relevance: 0
	  };

	  var STRING = {
	    className: 'string',
	    variants: [
	      {begin: /"/, end: /"/, contains: [{begin: /""/, relevance: 0}]},
	      {begin: /'/, end: /'/, contains: [{begin: /''/, relevance: 0}]}
	    ]
	  };

	  var ANNOTATION = {
	    className: 'decorator',
	    begin: '%\\w+'
	  };

	  var COMMENT = {
	    className: 'comment',
	    begin: '\\(:', end: ':\\)',
	    relevance: 10,
	    contains: [
	      {
	        className: 'doc', begin: '@\\w+'
	      }
	    ]
	  };

	  var METHOD = {
	    begin: '{', end: '}'
	  };

	  var CONTAINS = [
	    VAR,
	    STRING,
	    NUMBER,
	    COMMENT,
	    ANNOTATION,
	    METHOD
	  ];
	  METHOD.contains = CONTAINS;


	  return {
	    aliases: ['xpath', 'xq'],
	    case_insensitive: false,
	    lexemes: /[a-zA-Z\$][a-zA-Z0-9_:\-]*/,
	    illegal: /(proc)|(abstract)|(extends)|(until)|(#)/,
	    keywords: {
	      keyword: KEYWORDS,
	      literal: LITERAL
	    },
	    contains: CONTAINS
	  };
	};

/***/ },
/* 175 */
/***/ function(module, exports) {

	module.exports = function(hljs) {
	  var STRING = {
	    className: 'string',
	    contains: [hljs.BACKSLASH_ESCAPE],
	    variants: [
	      {
	        begin: 'b"', end: '"'
	      },
	      {
	        begin: 'b\'', end: '\''
	      },
	      hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
	      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null})
	    ]
	  };
	  var NUMBER = {variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]};
	  return {
	    aliases: ['zep'],
	    case_insensitive: true,
	    keywords:
	    'and include_once list abstract global private echo interface as static endswitch ' +
	    'array null if endwhile or const for endforeach self var let while isset public ' +
	    'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
	    'return parent clone use __CLASS__ __LINE__ else break print eval new ' +
	    'catch __METHOD__ case exception default die require __FUNCTION__ ' +
	    'enddeclare final try switch continue endfor endif declare unset true false ' +
	    'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' +
	    'yield finally int uint long ulong char uchar double float bool boolean string' +
	    'likely unlikely',
	    contains: [
	      hljs.C_LINE_COMMENT_MODE,
	      hljs.HASH_COMMENT_MODE,
	      hljs.COMMENT(
	        '/\\*',
	        '\\*/',
	        {
	          contains: [
	            {
	              className: 'doctag',
	              begin: '@[A-Za-z]+'
	            }
	          ]
	        }
	      ),
	      hljs.COMMENT(
	        '__halt_compiler.+?;',
	        false,
	        {
	          endsWithParent: true,
	          keywords: '__halt_compiler',
	          lexemes: hljs.UNDERSCORE_IDENT_RE
	        }
	      ),
	      {
	        className: 'string',
	        begin: '<<<[\'"]?\\w+[\'"]?$', end: '^\\w+;',
	        contains: [hljs.BACKSLASH_ESCAPE]
	      },
	      {
	        // swallow composed identifiers to avoid parsing them as keywords
	        begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
	      },
	      {
	        className: 'function',
	        beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
	        illegal: '\\$|\\[|%',
	        contains: [
	          hljs.UNDERSCORE_TITLE_MODE,
	          {
	            className: 'params',
	            begin: '\\(', end: '\\)',
	            contains: [
	              'self',
	              hljs.C_BLOCK_COMMENT_MODE,
	              STRING,
	              NUMBER
	            ]
	          }
	        ]
	      },
	      {
	        className: 'class',
	        beginKeywords: 'class interface', end: '{', excludeEnd: true,
	        illegal: /[:\(\$"]/,
	        contains: [
	          {beginKeywords: 'extends implements'},
	          hljs.UNDERSCORE_TITLE_MODE
	        ]
	      },
	      {
	        beginKeywords: 'namespace', end: ';',
	        illegal: /[\.']/,
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      {
	        beginKeywords: 'use', end: ';',
	        contains: [hljs.UNDERSCORE_TITLE_MODE]
	      },
	      {
	        begin: '=>' // No markup, just a relevance booster
	      },
	      STRING,
	      NUMBER
	    ]
	  };
	};

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag('not-found', '<div>Page is not found.</div>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(15);
	riot.tag('buttons', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Button</div> <div class="material-card-content"> <material-button class="ui"> <div class="text">BUTTON</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Rounded Button</div> <div class="material-card-content"> <material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137"> <i class="material-icons">add</i> </material-button> </div> <riotmui-code style="margin-top: 29px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom Button</div> <div class="material-card-content"> <material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px"> <div class="text">CREATE</div> <i class="material-icons">create</i> </material-button> </div> <riotmui-code code="{{this.parent.parent.example3}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Disabled button</div> <div class="material-card-content"> <material-button class="ui" disabled="true"> <div class="text">Disabled</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example4}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component generate MUI button. It has two sets of options - button options and waves options (material-waves it is sub component providing material ripple). All of waves options have "waves" prefix, for example: waves-color. </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option>  </div> </riotmui-desc>', function (opts) {
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
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make button rounded.'
	    }, {
	        title: 'shady',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will add to the button box-shadow property.'
	    }, {
	        title: 'disabled',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" user won\'t be able to click on it. Also it will change button color.'
	    }, {
	        title: 'link',
	        type: 'String',
	        'default': '',
	        desc: 'If will be set link attribute then material button will behave it like a "a" tag.'
	    }, {
	        title: 'waves-center',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" waves will start animation from center of button.'
	    }, {
	        title: 'waves-opacity',
	        type: 'Number [0<x<1]',
	        'default': '0.4',
	        desc: 'Using this option it\'s possible to setup wave opacity.'
	    }, {
	        title: 'waves-duration',
	        type: 'Number [ms]',
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
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(179);
	__webpack_require__(14);
	__webpack_require__(181);
	__webpack_require__(11);
	__webpack_require__(15);
	riot.tag('riotmui-desc', '<div class="content"> <div class="title">Examples</div> <content select=".riotmui-desc-examples"></content> <div class="title">Description</div> <content select=".riotmui-desc-description"></content> <yield></yield> </div>', 'role="toolbar"', function (opts) {
	  this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(180);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(180, function() {
				var newContent = __webpack_require__(180);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "riotmui-desc > .content {\n  padding: 0 20px; }\n  riotmui-desc > .content > .title {\n    padding: 10px 0;\n    font-size: 28px;\n    color: #1c3b53; }\n  riotmui-desc > .content material-card {\n    margin-top: 20px;\n    position: relative; }\n    riotmui-desc > .content material-card:first-child {\n      margin-top: 0; }\n    riotmui-desc > .content material-card .title {\n      padding: 10px 20px;\n      font-size: 18px;\n      color: #61bdcc;\n      box-shadow: none; }\n    riotmui-desc > .content material-card .material-card-content {\n      padding: 10px 20px 20px 20px; }\n      riotmui-desc > .content material-card .material-card-content .button-container {\n        display: inline-block;\n        position: relative; }\n        riotmui-desc > .content material-card .material-card-content .button-container material-dropdown p {\n          padding: 20px 51px; }\n  riotmui-desc > .content .riotmui-desc-description p {\n    display: block;\n    padding: 5px 5px; }\n  riotmui-desc > .content .riotmui-desc-description .description-title {\n    padding: 10px 0px;\n    font-size: 20px;\n    color: #61bdcc;\n    box-shadow: none; }\n\n@media only screen and (min-width: 768px) and (max-width: 1024px) {\n  riotmui-desc > .content {\n    padding: 0 5px; }\n    riotmui-desc > .content .col-flex {\n      margin-top: 20px; }\n      riotmui-desc > .content .col-flex:first-child {\n        margin-top: 0px; } }\n\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  riotmui-desc > .content {\n    padding: 0 5px; }\n    riotmui-desc > .content .col-flex {\n      margin-top: 20px; }\n      riotmui-desc > .content .col-flex:first-child {\n        margin-top: 0px; } }\n\n@media only screen and (min-width: 480px) and (max-width: 768px) {\n  riotmui-desc > .content .col-flex {\n    margin-top: 20px; }\n    riotmui-desc > .content .col-flex:first-child {\n      margin-top: 0px; } }\n", ""]);

	// exports


/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(182);
	__webpack_require__(14);
	riot.tag('material-card', '<div class="title" if="{{titleExist}}"> <content select=".material-card-title"></content> </div> <yield></yield>', function (opts) {
	    var _this = this;

	    this.titleExist = false;
	    this.on('mount', function () {
	        _this.update({ titleExist: !!_this.root.querySelector('.material-card-title') });
	    });
	    this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(183);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(183, function() {
				var newContent = __webpack_require__(183);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-card {\n  display: block;\n  background-color: #fff;\n  margin: 0;\n  overflow-y: auto;\n  will-change: width, height;\n  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  transform: translateY(0px);\n  opacity: 1;\n  -webkit-transition: transform .2s ease-in,opacity .2s;\n  -ms-transition: transform .2s ease-in,opacity .2s;\n  -moz-transition: transform .2s ease-in,opacity .2s;\n  -o-transition: transform .2s ease-in,opacity .2s;\n  transition: transform .2s ease-in,opacity .2s; }\n  material-card .title {\n    padding: 20px 10px;\n    font-size: 22px;\n    color: #25313b;\n    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -ms-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -o-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02); }\n  material-card .material-card-content {\n    padding: 20px; }\n", ""]);

	// exports


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(185);
	riot.tag('riotmui-option', '<div class="option row" each="{{option,key in opts.data}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(186);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(186, function() {
				var newContent = __webpack_require__(186);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "riotmui-option .option {\n  padding: 10px 0; }\n  riotmui-option .option-title {\n    font-weight: 700; }\n  riotmui-option .option .type {\n    color: #8d9899;\n    text-transform: capitalize; }\n  riotmui-option .option .default {\n    color: #414546;\n    margin-left: 20px; }\n", ""]);

	// exports


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(188);
	riot.tag('checkbox', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Checkbox</div> <div class="material-card-content"> <material-checkbox name="checker">Label</material-checkbox> </div> <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Disabled Checkbox</div> <div class="material-card-content"> <material-checkbox disabled="true">Disabled</material-checkbox> </div> <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This is component can replace usual checkbox. To add label you can write some text into it. </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option>  </div> </riotmui-desc>', function (opts) {
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

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(189);
	riot.tag('material-checkbox', '<div class="{{checkbox:true,checked:checked}}" onclick="{{toggle}}"> <div class="checkmark"></div> </div> <div class="label" onclick="{{toggle}}"><yield></yield></div> <input type="hidden" name="{{opts.name}}" value="{{checked}}">', function (opts) {
	    var _this = this;

	    this.checked = opts.checked || false;
	    // Attributes
	    this.disabled = opts.disabled || false;
	    /**
	     * Toggle checkbox
	     */
	    this.toggle = function () {
	        if (_this.disabled) return false;
	        _this.update({ checked: !_this.checked });
	        _this.trigger('toggle', _this.checked);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(190);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(190, function() {
				var newContent = __webpack_require__(190);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-checkbox {\n  background-color: transparent;\n  display: block;\n  position: relative;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -moz-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  /** CheckBox **/\n  /** Label **/\n  /** Disabled **/ }\n  material-checkbox .checkbox {\n    display: inline-block;\n    position: relative;\n    box-sizing: border-box;\n    height: 100%;\n    border: solid 2px;\n    border-color: #25313b;\n    background-color: transparent;\n    border-radius: 2px;\n    width: 18px;\n    height: 18px;\n    cursor: pointer;\n    vertical-align: middle;\n    -webkit-transition: background-color 140ms, border-color 140ms;\n    -ms-transition: background-color 140ms, border-color 140ms;\n    -moz-transition: background-color 140ms, border-color 140ms;\n    -o-transition: background-color 140ms, border-color 140ms;\n    transition: background-color 140ms, border-color 140ms; }\n    material-checkbox .checkbox .checkmark {\n      -webkit-transform: rotate(0deg) scale(0.5);\n      -ms-transform: rotate(0deg) scale(0.5);\n      -moz-transform: rotate(0deg) scale(0.5);\n      -o-transform: rotate(0deg) scale(0.5);\n      transform: rotate(0deg) scale(0.5);\n      position: absolute;\n      top: -1px;\n      left: 3px;\n      width: 6px;\n      height: 10px;\n      border-style: solid;\n      border-top: none;\n      border-left: none;\n      border-right-width: 2px;\n      border-bottom-width: 2px;\n      border-color: transparent;\n      cursor: pointer; }\n    material-checkbox .checkbox.checked {\n      background-color: #25313b;\n      -webkit-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -ms-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -moz-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      -o-transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n      transition: background-color 140ms, border-color 140ms, transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1); }\n      material-checkbox .checkbox.checked .checkmark {\n        border-color: #fff;\n        -webkit-transform: rotate(45deg) scale(1);\n        -ms-transform: rotate(45deg) scale(1);\n        -moz-transform: rotate(45deg) scale(1);\n        -o-transform: rotate(45deg) scale(1);\n        transform: rotate(45deg) scale(1);\n        -webkit-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -ms-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -moz-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        -o-transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1);\n        transition: background-color 140ms, border-color 140ms,transform 140ms 50ms cubic-bezier(0.23, 1, 0.32, 1); }\n  material-checkbox .label {\n    display: inline-block;\n    color: #25313b;\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: 8px;\n    white-space: normal;\n    cursor: pointer; }\n  material-checkbox[disabled=\"true\"] .checkbox {\n    border-color: #ccc; }\n  material-checkbox[disabled=\"true\"] .label {\n    color: #ccc; }\n", ""]);

	// exports


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(192);
	riot.tag('combobox', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default ComboBox</div> <div class="material-card-content"> <material-combo defaultText="Select one"> <option value="1">One</option> <option value="2">Two</option> </material-combo> </div> <riotmui-code style="margin-top: 26px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Items Like An Attribute</div> <div class="material-card-content"> <material-combo items="[{title:\'One\'},{title:\'Two\'}]"></material-combo> </div> <riotmui-code style="margin-top: 83px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material ComboBox is component which can replace standard select component. Also it provides searching by items. It save all possible methods and behaviors of its sub components - material-input and material-dropdown-list. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-combo  defaultText="Select one">\n      <option value="1">One</option>\n      <option value="2">Two</option>\n  </material-combo>';
	    this.example2 = '<material-combo items="[{title:\'One\'},{title:\'Two\'}]"></material-combo>';
	    // Children
	    this.children = [{
	        title: ' <option value="value">Title</option>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds item to material-combo. Works like a select tag.'
	    }];
	    // Options
	    this.options = [{
	        title: 'defaultText',
	        type: 'string',
	        'default': 'Choose item',
	        desc: 'Default text which no one element is chosen.'
	    }, {
	        title: 'items',
	        type: 'string',
	        'default': '[]',
	        desc: 'Sets items to dropdown-list. Look at dropdown-list docs for details.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(193);
	__webpack_require__(195);
	__webpack_require__(196);
	__webpack_require__(199);
	riot.tag('material-combo', '<material-input name="input" ></material-input> <material-dropdown-list __selected="{{opts.selected}}" name="dropdown"></material-dropdown-list> <input type="hidden" value="{{value}}" name="{{opts.name}}"> <div name="options" hidden if="{{!isParsed}}"> <yield></yield> </div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.items = [];
	    this.isParsed = true;
	    this.title = null;
	    // Yielding
	    this.getOptions = function () {
	        // Get all options if it exits
	        Array.prototype.forEach.call(_this.options.children, function (option, key) {
	            if (option.tagName.toLowerCase() == 'option') {
	                var item = { title: option.innerHTML, value: option.getAttribute('value') };
	                _this.items.push(item);
	                // Set Selected
	                if (option.getAttribute('isSelected') != null) {
	                    _this.tags.dropdown.update({ selected: key });
	                    _this.update({ value: item.value || item.title });
	                    _this.title = item.title;
	                }
	            }
	        });
	        // Submit items to the dropdown
	        _this.tags.dropdown.update({ items: _this.items });
	        // We should update value of material combo
	        if (_this.tags.dropdown.selected) {
	            _this.update({ hValue: _this.tags.dropdown.items[_this.tags.dropdown.selected].value || _this.tags.dropdown.items[_this.tags.dropdown.selected].title });
	        }
	        _this.update({ isParsed: true });
	    };
	    // Setup options
	    this.getOptions();
	    // Attributes
	    if (opts.items) {
	        try {
	            this.items = eval(opts.items) || [];
	            if (this.items.length) this.tags.dropdown.update({ items: this.items });
	        } catch (e) {
	            console.error('Something wrong with your items. For details look at it - ' + e);
	        }
	    }
	    /**
	     * Ready
	     */
	    this.on('mount', function () {
	        // Defaults
	        _this.tags.dropdown.root.style.top = _this.tags.input.root.getBoundingClientRect().height + 'px';
	        _this.tags.input.update({ value: _this.title || (opts.defaulttext || 'Choose item') });
	    });
	    /**
	     * When dropdown select event is working we
	     * update material-input and hidden
	     */
	    this.tags.dropdown.on('selectChanged', function (selected) {
	        _this.update({ value: _this.tags.dropdown.items[selected].value || _this.tags.dropdown.items[selected].title });
	        _this.tags.input.update({ value: _this.tags.dropdown.items[selected].title });
	        // After animation end
	        setTimeout(function () {
	            _this.tags.dropdown.update({ items: _this.items });
	        }, 200);
	    });
	    /**
	     * When material-input value has been changed
	     */
	    this.tags.input.on('valueChanged', function (value) {
	        _this.tags.dropdown.update({ items: _this.filter('items', { title: value }) });
	    });
	    /**
	     * If material-input focus has been changed
	     * control dropdown opening
	     */
	    this.tags.input.on('focusChanged', function (focus) {
	        if (_this.tags.input.value == (opts.defaulttext || 'Choose item') && focus) {
	            _this.tags.input.update({ value: '' });
	        }
	        if (_this.tags.input.value == '' && !focus) {
	            _this.tags.input.update({ value: opts.defaulttext || 'Choose item' });
	        }
	        focus ? _this.tags.dropdown.open() : _this.tags.dropdown.close();
	    });
	    // Manage collection
	    this.mixin('collection');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(194);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(194, function() {
				var newContent = __webpack_require__(194);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-combo {\n  display: block;\n  position: relative; }\n  material-combo *[hidden] {\n    display: none; }\n  material-combo material-input input {\n    color: #2f6975; }\n", ""]);

	// exports


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var CollectionMixin = {
	    /**
	     * Filter collection by criteria
	     * @params prop - collection name
	     * @params criteria - object (Which field should be filtred)
	     */
	    filter: function filter(prop, criteria) {
	        return this[prop].filter(function (item) {
	            var criteriaPass = false;
	            Object.keys(criteria).forEach(function (k) {
	                var v = criteria[k];
	                var regexp = new RegExp('' + v, 'i');
	                criteriaPass = regexp.test(item[k]);
	            });
	            return criteriaPass;
	        });
	    },
	    /**
	     * Find something in collection
	     * @params prop - collection name
	     * @params criteria - object (Which field should be filtred)
	     */
	    find: function find(data, criteria) {
	        var searched = {};
	        var i = 0;
	        data.forEach(function (e) {
	            Object.keys(criteria).forEach(function (k) {
	                var v = criteria[k];
	                if (e[k] == v) {
	                    searched.e = e;
	                    searched.k = i;
	                }
	            });
	            i++;
	        });
	        return searched;
	    }
	};

	riot.mixin('collection', CollectionMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(197);
	riot.tag('material-dropdown-list', '<ul class="{{dropdown-content:true,opening:opening}}" if="{{opened}}" > <li each="{{item,key in items}}" class="{{selected:parent.selected==key}}"> <span if="{{!item.link}}" onclick="{{parent.select}}">{{item.title}}</span> <a if="{{item.link}}" href="{{item.link}}" onclick="{{parent.select}}" title="{{item.title}}">{{item.title}}</a> </li> </ul> <div name="overlay" if="{{opts.extraclose && opened}}" onclick="{{close}}" class="material-dropdown-list-overlay"></div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.opened = false;
	    // Attributes
	    if (opts.items) {
	        try {
	            this.items = eval(opts.items) || [];
	        } catch (e) {
	            console.error('Something wrong with your items. For details look at it - ' + e);
	        }
	        this.update({ items: this.items });
	    }
	    // Set selected
	    if (opts.selected) {
	        this.update({ selected: opts.selected });
	    }
	    /**
	     * Select dropdown item
	     * @param e
	     */
	    this.select = function (e) {
	        _this.update({ selected: e.item.key });
	        _this.close();
	        // Trigger event. It will help you to grab selected value from outside
	        // of this component
	        _this.trigger('selectChanged', e.item.key, e.item.item);
	        return true;
	        ///if(e.item.item.link) location.href = e.item.item.link;
	    };
	    /**
	     * Open dropdown list
	     */
	    this.open = function () {
	        _this.update({ opened: true, opening: true });
	        if (_this.opts.extraclose) document.body.appendChild(_this.overlay);
	        setTimeout(function () {
	            _this.update({ opening: false });
	        }, 0);
	    };
	    /**
	     * Close dropdown list
	     */
	    this.close = function () {
	        _this.update({ opening: true });
	        setTimeout(function () {
	            _this.update({ opened: false });
	        }, 200);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(198);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(198, function() {
				var newContent = __webpack_require__(198);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-dropdown-list {\n  position: absolute;\n  z-index: 100;\n  width: 100%; }\n  material-dropdown-list ul.dropdown-content {\n    list-style: none;\n    z-index: 100;\n    background-color: #fff;\n    margin: 0;\n    padding: 0;\n    min-width: 100px;\n    max-height: 650px;\n    overflow-y: auto;\n    will-change: width, height;\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transform: translateY(0px);\n    opacity: 1;\n    -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n    transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-dropdown-list ul.dropdown-content.opening {\n      transform: translateY(-50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-dropdown-list ul.dropdown-content li {\n      clear: both;\n      cursor: pointer;\n      line-height: 1.5rem;\n      width: 100%;\n      text-align: left;\n      text-transform: none;\n      background-color: #fff;\n      -webkit-transition: background-color .2s ease-in;\n      -ms-transition: background-color .2s ease-in;\n      -moz-transition: background-color .2s ease-in;\n      -o-transition: background-color .2s ease-in;\n      transition: background-color .2s ease-in; }\n      material-dropdown-list ul.dropdown-content li span, material-dropdown-list ul.dropdown-content li a {\n        font-size: 1.2rem;\n        color: #25313b;\n        display: block;\n        padding: 1rem 1rem; }\n      material-dropdown-list ul.dropdown-content li:hover {\n        background-color: #ededed;\n        -webkit-transition: background-color .2s ease-out;\n        -ms-transition: background-color .2s ease-out;\n        -moz-transition: background-color .2s ease-out;\n        -o-transition: background-color .2s ease-out;\n        transition: background-color .2s ease-out; }\n      material-dropdown-list ul.dropdown-content li a {\n        text-decoration: none;\n        color: #25313b; }\n      material-dropdown-list ul.dropdown-content li.selected {\n        background-color: #394b5a;\n        -webkit-transition: background-color .2s ease-out;\n        -ms-transition: background-color .2s ease-out;\n        -moz-transition: background-color .2s ease-out;\n        -o-transition: background-color .2s ease-out;\n        transition: background-color .2s ease-out; }\n        material-dropdown-list ul.dropdown-content li.selected span {\n          color: #fff; }\n\n/** OVERLAY **/\n.material-dropdown-list-overlay {\n  z-index: 99;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  position: fixed;\n  background: transparent; }\n", ""]);

	// exports


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(200);
	__webpack_require__(202);
	riot.tag('material-input', '<div class="label-placeholder"></div> <div class="{{input-content:true,not-empty:value,error:error}}"> <label for="input" name="label" if="{{opts.label}}">{{opts.label}}</label> <input type="{{opts.type || \'text\'}}" __disabled="{{disabled}}" placeholder="{{opts.placeholder}}" onkeyup="{{changeValue}}" value="{{value}}" autocomplete="off" name="{{this.name}}"> <div class="iconWrapper" name="iconWrapper" if="{{opts.icon}}" > <material-button name="iconButton" center="true" waves-center="true" waves-color="{{opts[\'waves-color\']||\'#fff\'}}" rounded="true" waves-opacity="{{opts[\'waves-opacity\']||\'0.6\'}}" waves-duration="{{opts[\'waves-duration\']||\'600\'}}"> <yield></yield> </material-button> </div> </div> <div class="{{underline:true,focused:focused,error:error}}"> <div class="unfocused-line"></div> <div class="focused-line"></div> </div>', function (opts) {
	    var _this = this;

	    // Attributes
	    this.update({ value: opts.value || '' });
	    // For Validation Mixin
	    this.opts = opts;
	    // From options
	    this.disabled = opts.disabled || false;
	    this.name = opts.name || 'input';
	    // Not supported types
	    this.notSupportedTypes = ['date', 'color', 'datetime', 'month', 'range', 'time'];
	    if (this.notSupportedTypes.indexOf(opts.type) != -1) throw new Error('Sorry but we not support ' + date + ' type yet!');
	    // Icons
	    this.update({ showIcon: false });
	    /**
	     * When element focus changed update expressions.
	     */
	    this.changeFocus = function (e) {
	        if (_this.disabled) return false;
	        _this.update({ focused: _this['{{this.name}}'] == document.activeElement });
	        _this.trigger('focusChanged', _this.focused, e);
	    };
	    /**
	     * Change input value should change tag behavior.
	     * @param e
	     */
	    this.changeValue = function (e) {
	        _this.update({ value: _this['{{this.name}}'].value });
	        _this.trigger('valueChanged', _this['{{this.name}}'].value, e);
	    };
	    // Add event listeners to input. It is wat which will help us
	    // to provide focus\blur on material-input
	    this['{{this.name}}'].addEventListener('focus', this.changeFocus);
	    this['{{this.name}}'].addEventListener('blur', this.changeFocus);
	    // Validation
	    this.on('update', function (updated) {
	        if (updated && updated.value != undefined) {
	            if (_this.validationType) {
	                _this.isValid(_this.validate(updated.value));
	            }
	        }
	    });
	    /**
	     * Behevior after validation
	     * @param isValid - (true/false)
	     */
	    this.isValid = function (isValid) {
	        _this.update({ error: !isValid });
	    };
	    this.mixin('validate');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(201);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(201, function() {
				var newContent = __webpack_require__(201);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-input {\n  display: block;\n  padding: 8px 0;\n  position: relative;\n  /** LABEL PLACEHOLDER **/\n  /** UNDERLINE **/\n  /** Disabled **/ }\n  material-input .label-placeholder {\n    height: 15px;\n    width: 100%; }\n  material-input .input-content {\n    font-size: 16px;\n    color: #17242e;\n    position: relative;\n    /** LABEL **/\n    /** INPUT **/\n    /** ICON **/ }\n    material-input .input-content label {\n      position: absolute;\n      top: 0;\n      right: 0;\n      left: 0;\n      font: inherit;\n      color: #2f6975;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-size: 16px;\n      font-weight: 400;\n      line-height: 24px;\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-input .input-content.not-empty label {\n      -webkit-transform: translate3d(0, -70%, 0) scale(0.70);\n      -ms-transform: translate3d(0, -70%, 0) scale(0.70);\n      -moz-transform: translate3d(0, -70%, 0) scale(0.70);\n      -o-transform: translate3d(0, -70%, 0) scale(0.70);\n      transform: translate3d(0, -70%, 0) scale(0.70);\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-input .input-content input {\n      position: relative;\n      outline: none;\n      box-shadow: none;\n      padding: 0;\n      width: 100%;\n      background: transparent;\n      border: none;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-weight: 400;\n      line-height: 24px;\n      height: 24px; }\n    material-input .input-content .iconWrapper {\n      display: inline-block;\n      position: absolute;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      width: 40px;\n      height: 40px;\n      margin-left: -33px;\n      left: 100%;\n      margin-top: -7px; }\n      material-input .input-content .iconWrapper material-button {\n        background: transparent; }\n        material-input .input-content .iconWrapper material-button .content .material-icons {\n          color: #2f6975; }\n  material-input .underline {\n    position: relative;\n    display: block;\n    /** Focused behavior **/\n    /** Error **/ }\n    material-input .underline .unfocused-line {\n      height: 1px;\n      background: #2f6975; }\n    material-input .underline .focused-line {\n      height: 2px;\n      background: #2f6975;\n      -webkit-transform: scale3d(0, 1, 1);\n      -ms-transform: scale3d(0, 1, 1);\n      -moz-transform: scale3d(0, 1, 1);\n      -o-transform: scale3d(0, 1, 1);\n      transform: scale3d(0, 1, 1);\n      -webkit-transition: transform .2s ease-in;\n      -ms-transition: transform .2s ease-in;\n      -moz-transition: transform .2s ease-in;\n      -o-transition: transform .2s ease-in;\n      transition: transform .2s ease-in; }\n    material-input .underline.focused .focused-line {\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s ease-out;\n      -ms-transition: transform .2s ease-out;\n      -moz-transition: transform .2s ease-out;\n      -o-transition: transform .2s ease-out;\n      transition: transform .2s ease-out; }\n    material-input .underline.error .unfocused-line, material-input .underline.error .focused-line {\n      background: #941212;\n      -webkit-transition: background .2s ease-out;\n      -ms-transition: background .2s ease-out;\n      -moz-transition: background .2s ease-out;\n      -o-transition: background .2s ease-out;\n      transition: background .2s ease-out; }\n  material-input[disabled=\"true\"] label {\n    color: #ccc; }\n  material-input[disabled=\"true\"] .underline .unfocused-line {\n    background: #ccc; }\n", ""]);

	// exports


/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var ValidateMixin = Object.defineProperties({
	    init: function init() {
	        if (!this.opts) console.debug('Sorry, but for using validate mixin you should add following code in your component: this.opts = opts;');
	        if (this.opts && this.opts.valid) {
	            this.validationType = typeof this[this.opts.valid] == 'function' ? 'Function' : 'Regexp';
	            if (this.validationType === 'Regexp') {
	                try {
	                    this.validationRegexp = eval(this.opts.valid);
	                } catch (e) {
	                    throw new Error('Something wrong with your regular expression!. Checkout --- ' + e);
	                }
	            }
	            if (this.validationType === 'Function') {
	                this.validationFunction = this[this.opts.valid] || false;
	            }
	        } else if (this.opts && Object.keys(this.base).indexOf(this.opts.type) != -1) {
	            this.validationType = 'Type';
	        }
	    },
	    validate: function validate(value) {
	        if (this.validationType) {
	            return this['validateBy' + this.validationType](value);
	        }
	        return null;
	    },
	    validateByFunction: function validateByFunction(value) {
	        if (this.validationFunction) {
	            return this.validationFunction(value);
	        }
	    },
	    validateByRegexp: function validateByRegexp(value) {
	        if (this.validationRegexp) {
	            return this.validationRegexp.test(value);
	        }
	    },
	    validateByType: function validateByType(value) {
	        return this.base[this.opts.type].test(value);
	    }
	}, {
	    base: {
	        get: function get() {
	            return {
	                'email': /^(([\w\.\-_]+)@[\w\-\_]+(\.\w+){1,}|)$/i,
	                'number': /^(\d+|)$/i,
	                'tel': /^((\+|\d)?([\d\-\(\)\#])|)+$/i,
	                'url': /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/i
	            };
	        },
	        configurable: true,
	        enumerable: true
	    }
	});

	riot.mixin('validate', ValidateMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(199);
	riot.tag('m-input', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Input</div> <div class="material-card-content"> <material-input placeholder="Just input" ></material-input> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Validation by type</div> <div class="material-card-content"> <material-input type="email" label="Email"></material-input> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Icon Input</div> <div class="material-card-content"> <material-input icon="true" waves-color="#2f6975" label="Icon input"> <i class="material-icons">search</i> </material-input> </div> <riotmui-code style="margin-top: 28px" code="{{this.parent.parent.example3}}"></riotmui-code> </material-card> <material-card> <div class="material-card-title">Custom validation</div> <div class="material-card-content"> <material-input type="text" valid="/^\\d+$/" label="Numbers only"></material-input> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example4}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material input is a wrapper for standard input according base concepts of material ui. Also it provides floating label, type validation and icons. </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-input placeholder="Just input"></material-input>';
	    this.example2 = '<material-input type="email" label="Email"></material-input>';
	    this.example3 = '<material-input icon="true" waves-color="#2f6975" label="Icon input">\n      <i class="material-icons">search</i>\n  </material-input>';
	    this.example4 = '<material-input valid="/^\\d+$/" label="Numbers only"></material-input>';
	    // Children
	    this.children = [{
	        title: '<i class="material-icons">search</i>',
	        type: 'tag',
	        'default': '',
	        desc: 'Can add icon to material-input if already was set icon option.'
	    }, {
	        title: '<div class="icon"><svg>...</svg></div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Can add icon to material-input if already was set icon option.'
	    }];
	    // Options
	    this.options = [{
	        title: 'label',
	        type: 'string',
	        'default': '',
	        desc: 'Adds floating label to material-input.'
	    }, {
	        title: 'icon',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will add icon to material-input. Icon content will be got from children.'
	    }, {
	        title: 'type',
	        type: 'string',
	        'default': 'text',
	        desc: 'Type of input. Also can provide standard validation. Currently supported types: email,number,tel,url'
	    }, {
	        title: 'valid',
	        type: 'Regexp | Function',
	        'default': '',
	        desc: 'It can be both function and regular expression. Regular expression must be a string. For example valid="/^\\d+$/". Also pay attention ' + 'on escaping special symbols of regular expression. In this case d should be written like \\d. Also valid option can be a function. You should link' + ' it with any function inside your component. For example: valid="{{checkout}}". this.checkout - must return true or false. Also if your component was validated it' + ' will contain error property regarding finished validation - true or false. (this.error)'
	    }, {
	        title: 'disabled',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will disable material input.'
	    }, {
	        title: 'waves-opacity',
	        type: 'Number [0<x<1]',
	        'default': '0.4',
	        desc: 'Using this option it\'s possible to setup wave opacity. For icon button. If was set icon="true"'
	    }, {
	        title: 'waves-duration',
	        type: 'Number [ms]',
	        'default': '400',
	        desc: 'Speed of waves animation. For icon button. If was set icon="true"'
	    }, {
	        title: 'waves-color',
	        type: 'color [RGB]',
	        'default': '#fff',
	        desc: 'Allows to setup waves\'s color. For icon button. If was set icon="true"'
	    }];
	    // Mehods
	    this.methods = [{
	        title: 'valueChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be invoked when will happen changing of input value. For example: this.on("valueChanged",function(){});'
	    }, {
	        title: 'focusChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be invoked after input focus changing. For example: this.on("focusChanged",function(){});'
	    }, {
	        title: 'error',
	        type: 'property',
	        'default': '',
	        desc: 'Contains current state of validation. If current value is correct will contain true in another case - false. For instance: this.error'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(15);
	__webpack_require__(205);
	riot.tag('dropdown', '<riotmui-desc name="desc"> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Default Dropdown</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonOne" onclick="{{parent.parent.openDropDownOne}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown name="dropDownOne"> <p>DropDown content</p> </material-dropdown> </div> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardTwo"> <div class="material-card-title">Changed animation</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonTwo" onclick="{{parent.parent.openDropDownTwo}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown animation="bottom" name="dropDownOne"> <p>DropDown content</p> </material-dropdown> </div> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> This component provides functionality of dropown. It has two common methods - open() and close(). </p> <div class="description-title">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
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
	    this.methods = [{
	        title: 'open',
	        type: 'method',
	        'default': '',
	        desc: 'Will open dropdown. For example: this.dropdown.open();'
	    }, {
	        title: 'close',
	        type: 'method',
	        'default': '',
	        desc: 'Will close dropdown. For example: this.dropdown.close();'
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

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(206);
	riot.tag('material-dropdown', '<div name="dropdown" class="{{dropdown:true,opening:opening}}" if="{{opened}}"> <yield></yield> </div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.opened = opts.opened || false;
	    // Attributes
	    this.dropdown.classList.add(opts.animation || 'top');
	    /**
	     * Open dropdown
	     */
	    this.open = function () {
	        _this.update({ opened: true, opening: true });
	        setTimeout(function () {
	            _this.update({ opening: false });
	        }, 0);
	    };
	    /**
	     * Close dropdown
	     */
	    this.close = function () {
	        _this.update({ opening: true });
	        setTimeout(function () {
	            _this.update({ opened: false });
	        }, 200);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(207);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(207, function() {
				var newContent = __webpack_require__(207);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-dropdown {\n  position: absolute;\n  z-index: 100;\n  width: 100%; }\n  material-dropdown .dropdown {\n    background-color: #fff;\n    margin: 0;\n    min-width: 100px;\n    max-height: 650px;\n    overflow-y: auto;\n    will-change: width, height;\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transform: translateY(0px);\n    opacity: 1;\n    -webkit-transition: transform .2s ease-in,opacity .2s;\n    -ms-transition: transform .2s ease-in,opacity .2s;\n    -moz-transition: transform .2s ease-in,opacity .2s;\n    -o-transition: transform .2s ease-in,opacity .2s;\n    transition: transform .2s ease-in,opacity .2s;\n    /** OPENING **/ }\n    material-dropdown .dropdown.opening.top {\n      transform: translateY(-50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-dropdown .dropdown.opening.bottom {\n      transform: translateY(50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n", ""]);

	// exports


/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(15);
	__webpack_require__(196);
	riot.tag('dropdown-list', '<riotmui-desc name="desc"> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Default Dropdown List</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonOne" onclick="{{parent.parent.openDropDownOne}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown-list items="[{title:\'One\'},{title:\'Two\'}]" name="dropDownOne"></material-dropdown-list> </div> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardTwo"> <div class="material-card-title">Link items</div> <div class="material-card-content"> <div class="button-container"> <material-button name="buttonTwo" onclick="{{parent.parent.openDropDownTwo}}"> <div class="text">Toggle Dropdown</div> </material-button> <material-dropdown-list items="[{title:\'One\',link:\'#one\'},{title:\'Two\',link:\'#two\'}]" animation="bottom" name="dropDownOne"></material-dropdown-list> </div> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Component may provide possibility of creating drop down with some items. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    var _this = this;

	    // Examples
	    this.example1 = '<material-dropdown-list items="[{title:\'One\'},{title:\'Two\'}]"></material-dropdown-list>';
	    this.example2 = '<material-dropdown-list items="[{title:\'One\',link:\'#one\'},{title:\'Two\',link:\'#two\'}]"></material-dropdown-list>';
	    // Options
	    this.options = [{
	        title: 'items',
	        type: 'string',
	        'default': '[]',
	        desc: 'Sets items to list. Item must contain at list one of following properties: title - title of item, link - any link. If will be set link property the item' + 'will be made using <a></a>'
	    }];
	    // Styling
	    this.methods = [{
	        title: 'open',
	        type: 'method',
	        'default': '',
	        desc: 'Will open dropdown.'
	    }, {
	        title: 'close',
	        type: 'method',
	        'default': '',
	        desc: 'Will close dropdown.'
	    }, {
	        title: 'selected',
	        type: 'number',
	        'default': '-',
	        desc: 'Current selected item key.'
	    }, {
	        title: 'selectChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be invoked when selected item will be changed.'
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

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(8);
	riot.tag('navbar', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Navbar</div> <div class="material-card-content"> <material-navbar> <div class="logo"><a href="#">Logo</a></div> </material-navbar> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom styling</div> <div class="material-card-content"> <material-navbar style="background: #ccc;"> <div class="logo"><a href="#">Logo</a></div> </material-navbar> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material Navbar can be used like a header or some another ui element of your web page. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-navbar>\n        <div class="logo"><a href="#">Logo</a></div>\n  </material-navbar>';
	    this.example2 = '<material-navbar style="background: #ccc;" >\n      <div class="logo"><a href="#">Logo</a></div>\n  </material-navbar>';
	    this.children = [{
	        title: '<div class="logo">Logo</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds logotype element to material navbar.'
	    }];
	    // Options
	    this.options = [{
	        title: 'fixed',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make navbar stuck to current position.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(11);
	__webpack_require__(15);
	riot.tag('pane', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default</div> <div class="material-card-content"> <material-pane> <div class="material-pane-left-bar"> <material-button rounded="true"> <i class="material-icons">arrow_back</i> </material-button> </div> <div class="material-pane-title">TITLE</div> <div class="material-pane-right-bar"> <material-button rounded="true"> <i class="material-icons">more_vert</i> </material-button> </div> <div class="material-pane-content"> CONTENT </div> </material-pane> </div> <riotmui-code style="margin-top: 0" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material pane it is more complicated element than material navbar. It includes special section to configure child elements properly. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-pane>\n    <div class="material-pane-left-bar">\n        <material-button rounded="true">\n            <i class="material-icons">arrow_back</i>\n        </material-button>\n    </div>\n    <div class="material-pane-title">TITLE</div>\n    <div class="material-pane-right-bar">\n        <material-button rounded="true">\n            <i class="material-icons">more_vert</i>\n        </material-button>\n    </div>\n    <div class="material-pane-content">\n        CONTENT\n    </div>\n  </material-pane>';
	    this.children = [{
	        title: '<div class="material-pane-left-bar">...</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds elements to the left part of material pane.'
	    }, {
	        title: '<div class="material-pane-right-bar">...</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds elements to the right part of material pane.'
	    }, {
	        title: '<div class="material-pane-title">Title</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Sets title of material pane.'
	    }, {
	        title: '<div class="material-pane-content">...</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Can adds any elements into content section of material pane.'
	    }];
	    // Options
	    this.options = [{
	        title: 'material-navbar-color',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Changes default color of sub navbar component.'
	    }, {
	        title: 'material-navbar-height',
	        type: 'px',
	        'default': '60',
	        desc: 'Changes default height of sub navbar component.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(212);
	__webpack_require__(15);
	riot.tag('popup', '<riotmui-desc name="desc"> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Default Popup</div> <div class="material-card-content"> <material-button onclick="{{this.parent.parent.openPopupOne}}"> <div class="text">Open</div> </material-button> <material-popup name="popupOne"> <p>Accerso alius sententia ut mihi, phasmatis of interregnum ego dico, solvo meus mens mei, ego dico phasmatis audite meus placitum meus mens quod iacio (Nombre de la persona)</p> </material-popup> </div> <riotmui-code style="margin-top: 65px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardTwo"> <div class="material-card-title">Popup With Title</div> <div class="material-card-content"> <material-button onclick="{{this.parent.parent.openPopupTwo}}"> <div class="text">Open</div> </material-button> <material-popup name="popupTwo"> <div class="material-popup-title">Title</div> <p>Accerso alius sententia ut mihi, phasmatis of interregnum ego dico, solvo meus mens mei, ego dico phasmatis audite meus placitum meus mens quod iacio (Nombre de la persona)</p> </material-popup> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> If you need popup just add this component to your project. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    var _this = this;

	    // Examples
	    this.example1 = '<material-popup>\n    <p>Content</p>\n  </material-popup>';
	    this.example2 = '<material-popup>\n    <div class="material-popup-title">Title</div>\n    <p>Content</p>\n  </material-popup>';
	    this.children = [{
	        title: '<div>...</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Any content can be placed into material popup.'
	    }, {
	        title: '<div class="material-popup-title">Title</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds title to material popup.'
	    }];

	    // Methods
	    this.methods = [{
	        title: 'open',
	        type: 'method',
	        'default': '',
	        desc: 'Opens popup.'
	    }, {
	        title: 'close',
	        type: 'method',
	        'default': '',
	        desc: 'Closes popup.'
	    }];
	    this.openPopupOne = function () {
	        var popup = _this.tags.desc.tags.cardOne.tags.popupOne;
	        !popup.opened ? popup.open() : popup.close();
	    };
	    this.openPopupTwo = function () {
	        var popup = _this.tags.desc.tags.cardTwo.tags.popupTwo;
	        !popup.opened ? popup.open() : popup.close();
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(213);
	__webpack_require__(14);
	riot.tag('material-popup', '<div name="popup" class="{{popup:true,opening:opening}}" if="{{opened}}"> <div class="content"> <content select=".material-popup-title"></content> <div class="close" onclick="{{close}}"> <i class="material-icons">close</i> </div> <yield></yield> </div> </div> <div class="overlay" onclick="{{close}}" if="{{opened}}"></div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.opened = opts.opened || false;
	    // Attributes
	    this.popup.classList.add(opts.animation || 'top');
	    /**
	     * Ready
	     */
	    this.on('mount', function () {
	        // Transfer a root node to body
	        document.body.appendChild(_this.root);
	    });
	    /**
	     * Open dropdown
	     */
	    this.open = function () {
	        _this.update({ opened: true, opening: true });
	        setTimeout(function () {
	            _this.update({ opening: false });
	        }, 0);
	    };
	    /**
	     * Close dropdown
	     */
	    this.close = function () {
	        _this.update({ opening: true });
	        setTimeout(function () {
	            _this.update({ opened: false });
	        }, 200);
	    };
	    this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(214);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(214, function() {
				var newContent = __webpack_require__(214);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-popup {\n  /** POPUP **/\n  /** OVERLAY **/ }\n  material-popup .popup {\n    z-index: 100;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    margin-top: -200px;\n    width: 50%;\n    margin-left: -25%;\n    min-height: 400px;\n    background-color: #fff;\n    overflow-y: auto;\n    will-change: width, height;\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transform: translateY(0px);\n    opacity: 1;\n    -webkit-transition: transform .2s ease-in,opacity .2s;\n    -ms-transition: transform .2s ease-in,opacity .2s;\n    -moz-transition: transform .2s ease-in,opacity .2s;\n    -o-transition: transform .2s ease-in,opacity .2s;\n    transition: transform .2s ease-in,opacity .2s;\n    /** OPENING **/\n    /** CLOSE **/\n    /** CONTENT STYLING **/ }\n    material-popup .popup.opening.top {\n      transform: translateY(-50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-popup .popup.opening.bottom {\n      transform: translateY(50px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-popup .popup .close {\n      cursor: pointer;\n      width: 24px;\n      height: 24px;\n      position: absolute;\n      left: 100%;\n      margin-left: -29px;\n      top: 3px; }\n    material-popup .popup .content {\n      padding: 10px;\n      color: #25313b; }\n      material-popup .popup .content .material-popup-title {\n        font-size: 20px;\n        padding: 0px 0px 10px 0;\n        text-align: center;\n        border-bottom: 1px solid #3b4e5e;\n        text-transform: uppercase; }\n  material-popup .overlay {\n    z-index: 99;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    position: fixed;\n    background: rgba(0, 0, 0, 0.2); }\n", ""]);

	// exports


/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(216);
	__webpack_require__(15);
	riot.tag('snackbar', '<riotmui-desc name="desc"> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Default Toast</div> <div class="material-card-content"> <material-button onclick="{{parent.parent.launchToastOne}}"> <div class="text">Launch</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card name="cardOne"> <div class="material-card-title">Error Toast</div> <div class="material-card-content"> <material-button onclick="{{parent.parent.launchToastTwo}}"> <div class="text">Launch</div> </material-button> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material snackbar is great way to notify user of your web site about whatever you want. By default it has two states - message and error. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc> <material-snackbar name="snackbar"></material-snackbar>', function (opts) {
	    var _this = this;

	    // Examples
	    this.example1 = '<material-snackbar></material-snackbar>';
	    // Options
	    this.options = [{
	        title: 'duration',
	        type: 'number',
	        'default': '4000',
	        desc: 'Changes default duration of toast. Duration it is time during which toast will be displayed on the screen.'
	    }];
	    // Methods
	    this.methods = [{
	        title: 'addToast',
	        type: 'method',
	        'default': 'args: {message:"...",isError:false}',
	        desc: 'Message will display into toast. isError - style of toast. If isError sets like "true" toast will be red.'
	    }, {
	        title: 'removeToast',
	        type: 'method',
	        'default': 'args: toastID - number of toast in snackbar',
	        desc: 'Removes toast from snackbar by ID.'
	    }];
	    this.launchToastOne = function () {
	        var snackbar = _this.tags.snackbar;
	        snackbar.addToast({ message: 'Toast was fired. To close it just click on it!' });
	    };
	    this.launchToastTwo = function () {
	        var snackbar = _this.tags.snackbar;
	        snackbar.addToast({ message: 'Error! This toast will be displayed during 10 sec.', isError: true }, 10000);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(217);
	riot.tag('material-snackbar', '<div class="{{toast:true,error:toast.isError,opening:toast.opening}}" onclick="{{parent.removeToastByClick}}" each="{{toast,key in toasts}}" > {{toast.message}} </div>', function (opts) {
	    var _this = this;

	    // Basics
	    this.toasts = [];
	    this.intervals = {};
	    /**
	     * Add new toast in collection
	     * @param toast
	     */
	    this.addToast = function (toast, duration) {
	        // Generate uniqe ID
	        var toastID = _this.toastID = Math.random().toString(36).substring(7);
	        // Create new toast and open it
	        _this.toasts.push(Object.assign(toast, { opening: true, _id: toastID }));
	        _this.update({ toasts: _this.toasts });
	        // Opening
	        setTimeout(function () {
	            _this.toasts[_this.findToastKeyByID(toastID)].opening = false;
	            _this.update({ toasts: _this.toasts });
	        }, 50);
	        // Close after ending of duration time
	        _this.intervals[toastID] = setTimeout(function () {
	            _this.removeToast(toastID);
	        }, opts.duration || duration || 5000);
	    };
	    /**
	     * Remove toast after
	     * @param toastID
	     */
	    this.removeToastAfterDurationEnding = function (toastID) {
	        _this.removeToast(toastID);
	    };
	    /**
	     * Helper. Allow to get key of toast (in toast array) by id
	     * @param ID
	     * @returns {*}
	     */
	    this.findToastKeyByID = function (ID) {
	        var toastKey = null;
	        _this.toasts.forEach(function (toast, key) {
	            if (toast._id == ID) toastKey = key;
	        });
	        return toastKey;
	    };
	    /**
	     * Remove toast by click
	     * @param e - event
	     */
	    this.removeToastByClick = function (e) {
	        var toastID = e.item.toast._id;
	        clearInterval(_this.intervals[toastID]);
	        _this.removeToast(toastID);
	    };
	    /**
	     * Remove toast from snackbar
	     * @param toastID
	     */
	    this.removeToast = function (toastID) {
	        // First we should make sure that a requested toast is exist
	        if (_this.findToastKeyByID(toastID) != null) {
	            _this.toasts[_this.findToastKeyByID(toastID)].opening = true;
	            _this.update({ toasts: _this.toasts });
	            // Wait a some time animation will end
	            setTimeout(function () {
	                _this.toasts.splice(_this.findToastKeyByID(toastID), 1);
	                _this.update({ toasts: _this.toasts });
	            }, 200);
	        }
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(218);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(218, function() {
				var newContent = __webpack_require__(218);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-snackbar {\n  display: block;\n  position: fixed;\n  bottom: 10%;\n  right: 7%;\n  z-index: 1001; }\n  material-snackbar .toast {\n    -webkit-border-radius: 3px;\n    -ms-border-radius: 3px;\n    -moz-border-radius: 3px;\n    -o-border-radius: 3px;\n    border-radius: 3px;\n    top: 0;\n    width: auto;\n    clear: both;\n    margin-top: 10px;\n    position: relative;\n    height: 40px;\n    line-height: 40px;\n    background-color: #25313b;\n    padding: 0 25px;\n    font-size: 1.1rem;\n    font-weight: 300;\n    color: #fff;\n    z-index: 1001;\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    display: -webkit-box;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-flex-align: center;\n    -ms-flex-align: center;\n    -webkit-align-items: center;\n    align-items: center;\n    -webkit-justify-content: space-between;\n    -ms-justify-content: space-between;\n    -moz-justify-content: space-between;\n    -o-justify-content: space-between;\n    justify-content: space-between;\n    transform: translateY(0px);\n    opacity: 1;\n    -webkit-transition: transform .2s ease-in,opacity .2s;\n    -ms-transition: transform .2s ease-in,opacity .2s;\n    -moz-transition: transform .2s ease-in,opacity .2s;\n    -o-transition: transform .2s ease-in,opacity .2s;\n    transition: transform .2s ease-in,opacity .2s; }\n    material-snackbar .toast.opening {\n      transform: translateY(-15px);\n      opacity: 0;\n      -webkit-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -ms-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -moz-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      -o-transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s;\n      transition: transform .2s cubic-bezier(0.23, 1, 0.32, 1),opacity .2s; }\n    material-snackbar .toast.error {\n      background-color: #ab173e; }\n", ""]);

	// exports


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(220);
	riot.tag('tabs', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Tabs</div> <div class="material-card-content"> <material-tabs tabs="[{title:\'ONE\'},{title:\'TWO\'}]"></material-tabs> </div> <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Using Underline</div> <div class="material-card-content"> <material-tabs useLine="true" tabs="[{title:\'ONE\'},{title:\'TWO\'}]"></material-tabs> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material tabs may be used like UI interface for choosing or for sub screens. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-tabs tabs="[{title:\'ONE\'},{title:\'TWO\'}]"></material-tabs>';
	    this.example2 = '<material-tabs useLine="true" tabs="[{title:\'ONE\'},{title:\'TWO\'}}]"></material-tabs>';
	    // Options
	    this.options = [{
	        title: 'tabs',
	        type: 'array',
	        'default': '[]',
	        desc: 'Each of tab object should contain title property. {title:"ONE"}'
	    }, {
	        title: 'cut',
	        type: 'number',
	        'default': '',
	        desc: 'Can cut titles of tab\'s buttons. For example: cut="10" - all of tabs will contain no more than 10 symbols rest will be cut.'
	    }];
	    // Mehods
	    this.methods = [{
	        title: 'changeTab',
	        type: 'method',
	        'default': 'args: index - number of tags which should be selected',
	        desc: 'Can setup new selected tab by its index.'
	    }, {
	        title: 'tabChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be fired when selected tab is changed.'
	    }, {
	        title: 'selected',
	        type: 'property',
	        'default': '0',
	        desc: 'Current selected tab index.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(221);
	riot.tag('material-tabs', '<material-button each="{{tab,k in tabs}}" onclick="{{parent.onChangeTab}}" class="{{selected:parent.selected==k}}" waves-opacity="{{parent.opts[\'waves-opacity\']}}" waves-duration="{{parent.opts[\'waves-duration\']}}" waves-center="{{parent.opts[\'waves-center\']}}" waves-color="{{parent.opts[\'waves-color\']}}" > <div class="text" title="{{tab.title}}">{{parent.opts.cut ? parent.cut(tab.title) : tab.title}}</div> </material-button> <div class="line-wrapper" if="{{opts.useline}}"> <div class="line" name="line"></div> </div> <yield></yield>', function (opts) {
	    var _this = this;

	    // Basics
	    this.selected = 0;
	    this.tabs = [];
	    // Attributes
	    if (opts.tabs) {
	        var tabs = [];
	        try {
	            tabs = opts.tabs ? eval(opts.tabs) : [];
	            this.tabs = tabs;
	        } catch (e) {}
	    }
	    /**
	     * Ready
	     */
	    this.on('mount', function () {
	        _this.setWidth();
	        _this.setLinePosition();
	    });
	    /**
	     * Set width on tab buttons and line
	     * @param
	     */
	    this.setWidth = function () {
	        [].forEach.call(_this.root.querySelectorAll('material-button'), function (node) {
	            node.style.width = _this.line.style.width = (100 / _this.tabs.length).toFixed(2) + '%';
	        });
	    };
	    /**
	     * Change selected tab by click on it.
	     * @param e
	     */
	    this.onChangeTab = function (e) {
	        var selected = _this.tabs.indexOf(e.item.tab);
	        _this.changeTab(selected);
	    };
	    /**
	     * Change tab handler. Change selected and line position.
	     * @param index
	     */
	    this.changeTab = function (index) {
	        _this.update({ selected: index });
	        _this.setLinePosition();
	        // Fire
	        _this.trigger('tabChanged', _this.tabs[index], index);
	    };
	    /**
	     * Set line left style.
	     */
	    this.setLinePosition = function () {
	        _this.line.style.left = _this.line.getBoundingClientRect().width * _this.selected + 'px';
	    };
	    /**
	     * Cut symbols
	     * @param title
	     * @returns {string}
	     */
	    this.cut = function (title) {
	        return title.length > opts.cut ? title.substr(0, opts.cut) + '...' : title;
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(222);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(222, function() {
				var newContent = __webpack_require__(222);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-tabs {\n  display: inline-block;\n  line-height: 0;\n  position: relative;\n  width: 100%;\n  /** BUTTONS **/\n  /** LINE **/ }\n  material-tabs material-button {\n    background: #070731;\n    border-radius: 0px;\n    text-align: center;\n    padding: 0px; }\n    material-tabs material-button .content {\n      position: relative; }\n      material-tabs material-button .content .text {\n        font-size: 0.8vw; }\n    material-tabs material-button.selected .content .text {\n      color: #61bdcc;\n      -webkit-transition: color 0.3s;\n      -ms-transition: color 0.3s;\n      -moz-transition: color 0.3s;\n      -o-transition: color 0.3s;\n      transition: color 0.3s; }\n  material-tabs .line-wrapper {\n    width: 100%;\n    height: 3px;\n    background: #c2c7b6;\n    position: relative; }\n    material-tabs .line-wrapper .line {\n      height: 100%;\n      background: #61bdcc;\n      position: absolute;\n      -webkit-transition: left 0.4s;\n      -ms-transition: left 0.4s;\n      -moz-transition: left 0.4s;\n      -o-transition: left 0.4s;\n      transition: left 0.4s; }\n", ""]);

	// exports


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(178);
	__webpack_require__(34);
	__webpack_require__(184);
	__webpack_require__(181);

	__webpack_require__(224);
	riot.tag('m-textarea', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Textarea</div> <div class="material-card-content"> <material-textarea label="Textarea"></material-textarea> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Max rows count is 2</div> <div class="material-card-content"> <material-textarea max-rows="2" label="Max rows count is 2"></material-textarea> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material textarea is a wrapper for standard textarea according base concepts of material ui. </p> <div class="description-title">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', function (opts) {
	    // Examples
	    this.example1 = '<material-textarea label="Textarea" ></material-textarea>';
	    this.example2 = '<material-textarea max-rows="2" label="Max rows count is 2"></material-textarea>';
	    // Options
	    this.options = [{
	        title: 'label',
	        type: 'string',
	        'default': '',
	        desc: 'Adds floating label to material-input.'
	    }, {
	        title: 'max-rows',
	        type: 'number',
	        'default': '-',
	        desc: 'Sets maximum possible count of rows.If it wasn\'t set - we have no limit on rows.'
	    }, {
	        title: 'valid',
	        type: 'Regexp | Function',
	        'default': '',
	        desc: 'It can be both function and regular expression. Regular expression must be a string. For example valid="/^\\d+$/". Also pay attention ' + 'on escaping special symbols of regular expression. In this case d should be written like \\d. Also valid option can be a function. You should link' + ' it with any function inside your component. For example: valid="{{checkout}}". this.checkout - must return true or false. Also if your component was validated it' + ' will contain error property regarding finished validation - true or false. (this.error)'
	    }, {
	        title: 'disabled',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will disable material input.'
	    }];
	    // Mehods
	    this.methods = [{
	        title: 'valueChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be invoked when will happen changing of input value. For example: this.on("valueChanged",function(){});'
	    }, {
	        title: 'focusChanged',
	        type: 'listener',
	        'default': '',
	        desc: 'Will be invoked after input focus changing. For example: this.on("focusChanged",function(){});'
	    }, {
	        title: 'error',
	        type: 'property',
	        'default': '',
	        desc: 'Contains current state of validation. If current value is correct will contain true in another case - false. For instance: this.error'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(225);
	__webpack_require__(202);
	riot.tag('material-textarea', '<div class="label-placeholder"></div> <div class="{{textarea-content:true,not-empty:value,error:error}}"> <label for="{{opts.name}}" name="label" if="{{opts.label}}">{{opts.label}}</label> <div class="mirror" name="mirror"></div> <div class="textarea-container"> <textarea __disabled="{{disabled}}" name="{{opts.name}}" value="{{value}}"></textarea> </div> </div> <div class="{{underline:true,focused:focused,error:error}}"> <div class="unfocused-line"></div> <div class="focused-line"></div> </div>', function (opts) {
	    var _this = this;

	    // Defaults
	    this["{{opts.name}}"].scrollTop = this["{{opts.name}}"].scrollHeight;
	    // For Validation Mixin
	    this.opts = opts;
	    // From options
	    this.disabled = opts.disabled || false;
	    // Ready
	    this.on('mount', function () {
	        // Set max height to mirror, if we have max-rows option.
	        if (opts['max-rows']) _this.mirror.style.maxHeight = opts['max-rows'] * _this["{{opts.name}}"].getBoundingClientRect().height + 'px';
	    });
	    /**
	     * When element focus changed update expressions.
	     */
	    this.changeFocus = function (e) {
	        if (_this.disabled) return false;
	        var focused = _this["{{opts.name}}"] == document.activeElement;
	        _this.update({ focused: focused });
	        _this.trigger('focusChanged', focused);
	    };
	    /**
	     * Change input value should change tag behavior.
	     * @param e
	     */
	    this.inputHandler = function (e) {
	        var value = _this["{{opts.name}}"].value;
	        _this.mirror.innerHTML = _this.format(value);
	        _this.update({ value: value });
	        _this.trigger('valueChanged', value);
	    };
	    // Add event listeners to input. It is wat which will help us
	    // to provide focus\blur on material-input
	    this["{{opts.name}}"].addEventListener('focus', this.changeFocus);
	    this["{{opts.name}}"].addEventListener('blur', this.changeFocus);
	    this["{{opts.name}}"].addEventListener('input', this.inputHandler);
	    // Validation
	    this.on('update', function (updated) {
	        if (updated && updated.value != undefined) {
	            if (_this.validationType) {
	                _this.isValid(_this.validate(updated.value));
	            }
	        }
	    });
	    /**
	     * Behevior after validation
	     * @param isValid - (true/false)
	     */
	    this.isValid = function (isValid) {
	        _this.update({ error: !isValid });
	    };
	    /**
	     * Format the value of textarea
	     */
	    this.format = function (value) {
	        return value.replace(/\n/g, '<br/>&nbsp;');
	    };
	    this.mixin('validate');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(226);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(226, function() {
				var newContent = __webpack_require__(226);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "material-textarea {\n  display: block;\n  padding: 8px 0;\n  /** LABEL PLACEHOLDER **/\n  /** UNDERLINE **/\n  /** Disabled **/ }\n  material-textarea .label-placeholder {\n    height: 15px;\n    width: 100%; }\n  material-textarea .textarea-content {\n    font-size: 16px;\n    color: #17242e;\n    position: relative;\n    /** LABEL **/\n    /** textarea **/\n    /** MIRROR **/ }\n    material-textarea .textarea-content label {\n      position: absolute;\n      top: 0;\n      right: 0;\n      left: 0;\n      font: inherit;\n      color: #2f6975;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-size: 16px;\n      font-weight: 400;\n      line-height: 24px;\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-textarea .textarea-content.not-empty label {\n      -webkit-transform: translate3d(0, -70%, 0) scale(0.70);\n      -ms-transform: translate3d(0, -70%, 0) scale(0.70);\n      -moz-transform: translate3d(0, -70%, 0) scale(0.70);\n      -o-transform: translate3d(0, -70%, 0) scale(0.70);\n      transform: translate3d(0, -70%, 0) scale(0.70);\n      -webkit-transition: transform .2s;\n      -ms-transition: transform .2s;\n      -moz-transition: transform .2s;\n      -o-transition: transform .2s;\n      transition: transform .2s;\n      -webkit-transform-origin: left top;\n      -ms-transform-origin: left top;\n      -moz-transform-origin: left top;\n      -o-transform-origin: left top;\n      transform-origin: left top; }\n    material-textarea .textarea-content .textarea-container {\n      position: absolute;\n      top: 0;\n      right: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      overflow: hidden; }\n      material-textarea .textarea-content .textarea-container textarea {\n        position: relative;\n        outline: none;\n        box-shadow: none;\n        padding: 0;\n        width: 100%;\n        height: 100%;\n        background: transparent;\n        border: none;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;\n        font-weight: 400;\n        line-height: 24px;\n        resize: none;\n        overflow: hidden; }\n    material-textarea .textarea-content .mirror {\n      visibility: hidden;\n      word-wrap: break-word;\n      width: 100%;\n      height: auto;\n      -webkit-font-smoothing: antialiased;\n      text-rendering: optimizeLegibility;\n      font-weight: 400;\n      line-height: 24px;\n      outline: none;\n      min-height: 24px; }\n  material-textarea .underline {\n    position: relative;\n    display: block;\n    /** Focused behavior **/\n    /** Error **/ }\n    material-textarea .underline .unfocused-line {\n      height: 1px;\n      background: #2f6975; }\n    material-textarea .underline .focused-line {\n      height: 2px;\n      background: #2f6975;\n      -webkit-transform: scale3d(0, 1, 1);\n      -ms-transform: scale3d(0, 1, 1);\n      -moz-transform: scale3d(0, 1, 1);\n      -o-transform: scale3d(0, 1, 1);\n      transform: scale3d(0, 1, 1);\n      -webkit-transition: transform .2s ease-in;\n      -ms-transition: transform .2s ease-in;\n      -moz-transition: transform .2s ease-in;\n      -o-transition: transform .2s ease-in;\n      transition: transform .2s ease-in; }\n    material-textarea .underline.focused .focused-line {\n      -webkit-transform: none;\n      -ms-transform: none;\n      -moz-transform: none;\n      -o-transform: none;\n      transform: none;\n      -webkit-transition: transform .2s ease-out;\n      -ms-transition: transform .2s ease-out;\n      -moz-transition: transform .2s ease-out;\n      -o-transition: transform .2s ease-out;\n      transition: transform .2s ease-out; }\n    material-textarea .underline.error .unfocused-line, material-textarea .underline.error .focused-line {\n      background: #941212;\n      -webkit-transition: background .2s ease-out;\n      -ms-transition: background .2s ease-out;\n      -moz-transition: background .2s ease-out;\n      -o-transition: background .2s ease-out;\n      transition: background .2s ease-out; }\n  material-textarea[disabled=\"true\"] label {\n    color: #ccc; }\n  material-textarea[disabled=\"true\"] .underline .unfocused-line {\n    background: #ccc; }\n", ""]);

	// exports


/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(228);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(228, function() {
				var newContent = __webpack_require__(228);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "html {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\r\n * Remove default margin.\r\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\r\n   ========================================================================== */\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\r\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\r\n   ========================================================================== */\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\na {\n  background-color: transparent; }\n\n/**\r\n * Improve readability when focused and also mouse hovered in all browsers.\r\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\r\n   ========================================================================== */\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\ndfn {\n  font-style: italic; }\n\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\r\n * Address styling not present in IE 8/9.\r\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\nsmall {\n  font-size: 80%; }\n\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\r\n   ========================================================================== */\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\nimg {\n  border: 0; }\n\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\r\n   ========================================================================== */\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0; }\n\n/**\r\n * Contain overflow in all browsers.\r\n */\npre {\n  overflow: auto; }\n\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\r\n   ========================================================================== */\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\nbutton {\n  overflow: visible; }\n\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\n/* 1 */\nhtml input[type=\"button\"],\nbutton,\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\ninput {\n  line-height: normal; }\n\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\r\n *    (include `-moz` to future-proof).\r\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  /* 2 */\n  box-sizing: content-box; }\n\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\r\n * Define consistent border, margin, and padding.\r\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\ntextarea {\n  overflow: auto; }\n\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\r\n   ========================================================================== */\n/**\r\n * Remove most spacing between table cells.\r\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n", ""]);

	// exports


/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(230);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(230, function() {
				var newContent = __webpack_require__(230);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "/**\r\n * Flex Grid -\r\n * Version: 0.2.1\r\n *\r\n * Simple grid built with flex box and sass.\r\n *\r\n * Matthew Simo - matthew.a.simo@gmail.com\r\n */\n/**\r\n * Grid setup\r\n *\r\n * The grid will calculate dimensions based on these two variables\r\n * $fg-columns will inform the grid loops how many columns there should be.\r\n * $fg-gutter will inform the grid loops how big eac column's gutters should be.\r\n */\n/**\r\n * Break point namespace object\r\n *\r\n * Set the default namespace object with these defaults with the\r\n * understanding that you can pass in whatever you might require for your site.\r\n *\r\n * $fg-breakpoints is a Sass list with nested lists inside. Each sub list defines two things.\r\n * 1. The namespace for that breakpoint. (Required) (i.e. xs, sm, md, lg)\r\n * 2. The min-width measurement for the breakpoint for that namespace. (i.e. 48em, 62em, 75em)\r\n *\r\n * Note: These should be in the proper order (at least till libsass handles map keys properly).\r\n *\r\n * Note: If the measurement is left out then it will be skipped when generating\r\n * the grid and applied to global styles.\r\n *\r\n */\n/**\r\n * Calculate column size percentage\r\n */\n/**\r\n * Spacing mixin to create uniform margin/padding\r\n */\n/**\r\n * Row wrapper class, flex box parent.\r\n */\n.row {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  margin-left: -0.5rem;\n  margin-right: -0.5rem; }\n\n.col-xs, .col-sm, .col-md, .col-lg, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0;\n  flex-shrink: 0;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n\n.col-xs, .col-sm, .col-md, .col-lg {\n  flex-grow: 1;\n  flex-basis: 0;\n  max-width: 100%; }\n\n/**\r\n * Generate a set of grid column classes using a namespace\r\n *\r\n * .col-[namespace] for intelligent column division\r\n * .col-[namespace]-[number] for a column that covers a specific number of columns (e.g. 1-12 by default)\r\n * .off-[namespace]-[number] for pushing a col a specific number of columns (e.g. 1-11 by default)\r\n */\n/**\r\n * Build the grid in two steps, to help minimize file size\r\n * Step 1, for each namespace, create the grid-base\r\n * Step 2, for each namespace, wrap the col width/offset measurements in their breakpoint media query\r\n */\n.col-xs-1 {\n  flex-basis: 8.33333%;\n  max-width: 8.33333%; }\n\n.col-xs-2 {\n  flex-basis: 16.66667%;\n  max-width: 16.66667%; }\n\n.col-xs-3 {\n  flex-basis: 25%;\n  max-width: 25%; }\n\n.col-xs-4 {\n  flex-basis: 33.33333%;\n  max-width: 33.33333%; }\n\n.col-xs-5 {\n  flex-basis: 41.66667%;\n  max-width: 41.66667%; }\n\n.col-xs-6 {\n  flex-basis: 50%;\n  max-width: 50%; }\n\n.col-xs-7 {\n  flex-basis: 58.33333%;\n  max-width: 58.33333%; }\n\n.col-xs-8 {\n  flex-basis: 66.66667%;\n  max-width: 66.66667%; }\n\n.col-xs-9 {\n  flex-basis: 75%;\n  max-width: 75%; }\n\n.col-xs-10 {\n  flex-basis: 83.33333%;\n  max-width: 83.33333%; }\n\n.col-xs-11 {\n  flex-basis: 91.66667%;\n  max-width: 91.66667%; }\n\n.col-xs-12 {\n  flex-basis: 100%;\n  max-width: 100%; }\n\n.off-xs-1 {\n  margin-left: 8.33333%; }\n\n.off-xs-2 {\n  margin-left: 16.66667%; }\n\n.off-xs-3 {\n  margin-left: 25%; }\n\n.off-xs-4 {\n  margin-left: 33.33333%; }\n\n.off-xs-5 {\n  margin-left: 41.66667%; }\n\n.off-xs-6 {\n  margin-left: 50%; }\n\n.off-xs-7 {\n  margin-left: 58.33333%; }\n\n.off-xs-8 {\n  margin-left: 66.66667%; }\n\n.off-xs-9 {\n  margin-left: 75%; }\n\n.off-xs-10 {\n  margin-left: 83.33333%; }\n\n.off-xs-11 {\n  margin-left: 91.66667%; }\n\n@media only screen and (min-width: 768px) {\n  .col-sm-1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%; }\n  .col-sm-2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%; }\n  .col-sm-3 {\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%; }\n  .col-sm-5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%; }\n  .col-sm-6 {\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%; }\n  .col-sm-8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%; }\n  .col-sm-9 {\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%; }\n  .col-sm-11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%; }\n  .col-sm-12 {\n    flex-basis: 100%;\n    max-width: 100%; }\n  .off-sm-1 {\n    margin-left: 8.33333%; }\n  .off-sm-2 {\n    margin-left: 16.66667%; }\n  .off-sm-3 {\n    margin-left: 25%; }\n  .off-sm-4 {\n    margin-left: 33.33333%; }\n  .off-sm-5 {\n    margin-left: 41.66667%; }\n  .off-sm-6 {\n    margin-left: 50%; }\n  .off-sm-7 {\n    margin-left: 58.33333%; }\n  .off-sm-8 {\n    margin-left: 66.66667%; }\n  .off-sm-9 {\n    margin-left: 75%; }\n  .off-sm-10 {\n    margin-left: 83.33333%; }\n  .off-sm-11 {\n    margin-left: 91.66667%; } }\n\n@media only screen and (min-width: 992px) {\n  .col-md-1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%; }\n  .col-md-2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%; }\n  .col-md-3 {\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%; }\n  .col-md-5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%; }\n  .col-md-6 {\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%; }\n  .col-md-8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%; }\n  .col-md-9 {\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%; }\n  .col-md-11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%; }\n  .col-md-12 {\n    flex-basis: 100%;\n    max-width: 100%; }\n  .off-md-1 {\n    margin-left: 8.33333%; }\n  .off-md-2 {\n    margin-left: 16.66667%; }\n  .off-md-3 {\n    margin-left: 25%; }\n  .off-md-4 {\n    margin-left: 33.33333%; }\n  .off-md-5 {\n    margin-left: 41.66667%; }\n  .off-md-6 {\n    margin-left: 50%; }\n  .off-md-7 {\n    margin-left: 58.33333%; }\n  .off-md-8 {\n    margin-left: 66.66667%; }\n  .off-md-9 {\n    margin-left: 75%; }\n  .off-md-10 {\n    margin-left: 83.33333%; }\n  .off-md-11 {\n    margin-left: 91.66667%; } }\n\n@media only screen and (min-width: 1200px) {\n  .col-lg-1 {\n    flex-basis: 8.33333%;\n    max-width: 8.33333%; }\n  .col-lg-2 {\n    flex-basis: 16.66667%;\n    max-width: 16.66667%; }\n  .col-lg-3 {\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    flex-basis: 33.33333%;\n    max-width: 33.33333%; }\n  .col-lg-5 {\n    flex-basis: 41.66667%;\n    max-width: 41.66667%; }\n  .col-lg-6 {\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    flex-basis: 58.33333%;\n    max-width: 58.33333%; }\n  .col-lg-8 {\n    flex-basis: 66.66667%;\n    max-width: 66.66667%; }\n  .col-lg-9 {\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    flex-basis: 83.33333%;\n    max-width: 83.33333%; }\n  .col-lg-11 {\n    flex-basis: 91.66667%;\n    max-width: 91.66667%; }\n  .col-lg-12 {\n    flex-basis: 100%;\n    max-width: 100%; }\n  .off-lg-1 {\n    margin-left: 8.33333%; }\n  .off-lg-2 {\n    margin-left: 16.66667%; }\n  .off-lg-3 {\n    margin-left: 25%; }\n  .off-lg-4 {\n    margin-left: 33.33333%; }\n  .off-lg-5 {\n    margin-left: 41.66667%; }\n  .off-lg-6 {\n    margin-left: 50%; }\n  .off-lg-7 {\n    margin-left: 58.33333%; }\n  .off-lg-8 {\n    margin-left: 66.66667%; }\n  .off-lg-9 {\n    margin-left: 75%; }\n  .off-lg-10 {\n    margin-left: 83.33333%; }\n  .off-lg-11 {\n    margin-left: 91.66667%; } }\n", ""]);

	// exports


/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(232);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(232, function() {
				var newContent = __webpack_require__(232);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "/*\n\nOriginal style from softwaremaniacs.org (c) Ivan Sagalaev <Maniac@SoftwareManiacs.Org>\n\n*/\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  background: #f0f0f0;\n  -webkit-text-size-adjust: none; }\n\n.hljs,\n.hljs-subst,\n.hljs-tag .hljs-title,\n.nginx .hljs-title {\n  color: black; }\n\n.hljs-string,\n.hljs-title,\n.hljs-constant,\n.hljs-parent,\n.hljs-tag .hljs-value,\n.hljs-rule .hljs-value,\n.hljs-preprocessor,\n.hljs-pragma,\n.hljs-name,\n.haml .hljs-symbol,\n.ruby .hljs-symbol,\n.ruby .hljs-symbol .hljs-string,\n.hljs-template_tag,\n.django .hljs-variable,\n.smalltalk .hljs-class,\n.hljs-addition,\n.hljs-flow,\n.hljs-stream,\n.bash .hljs-variable,\n.pf .hljs-variable,\n.apache .hljs-tag,\n.apache .hljs-cbracket,\n.tex .hljs-command,\n.tex .hljs-special,\n.erlang_repl .hljs-function_or_atom,\n.asciidoc .hljs-header,\n.markdown .hljs-header,\n.coffeescript .hljs-attribute,\n.tp .hljs-variable {\n  color: #800; }\n\n.smartquote,\n.hljs-comment,\n.hljs-annotation,\n.diff .hljs-header,\n.hljs-chunk,\n.asciidoc .hljs-blockquote,\n.markdown .hljs-blockquote {\n  color: #888; }\n\n.hljs-number,\n.hljs-date,\n.hljs-regexp,\n.hljs-literal,\n.hljs-hexcolor,\n.smalltalk .hljs-symbol,\n.smalltalk .hljs-char,\n.go .hljs-constant,\n.hljs-change,\n.lasso .hljs-variable,\n.makefile .hljs-variable,\n.asciidoc .hljs-bullet,\n.markdown .hljs-bullet,\n.asciidoc .hljs-link_url,\n.markdown .hljs-link_url {\n  color: #080; }\n\n.hljs-label,\n.ruby .hljs-string,\n.hljs-decorator,\n.hljs-filter .hljs-argument,\n.hljs-localvars,\n.hljs-array,\n.hljs-attr_selector,\n.hljs-important,\n.hljs-pseudo,\n.hljs-pi,\n.haml .hljs-bullet,\n.hljs-doctype,\n.hljs-deletion,\n.hljs-envvar,\n.hljs-shebang,\n.apache .hljs-sqbracket,\n.nginx .hljs-built_in,\n.tex .hljs-formula,\n.erlang_repl .hljs-reserved,\n.hljs-prompt,\n.asciidoc .hljs-link_label,\n.markdown .hljs-link_label,\n.vhdl .hljs-attribute,\n.clojure .hljs-attribute,\n.asciidoc .hljs-attribute,\n.lasso .hljs-attribute,\n.coffeescript .hljs-property,\n.hljs-phony {\n  color: #88f; }\n\n.hljs-keyword,\n.hljs-id,\n.hljs-title,\n.hljs-built_in,\n.css .hljs-tag,\n.hljs-doctag,\n.smalltalk .hljs-class,\n.hljs-winutils,\n.bash .hljs-variable,\n.pf .hljs-variable,\n.apache .hljs-tag,\n.hljs-type,\n.hljs-typename,\n.tex .hljs-command,\n.asciidoc .hljs-strong,\n.markdown .hljs-strong,\n.hljs-request,\n.hljs-status,\n.tp .hljs-data,\n.tp .hljs-io {\n  font-weight: bold; }\n\n.asciidoc .hljs-emphasis,\n.markdown .hljs-emphasis,\n.tp .hljs-units {\n  font-style: italic; }\n\n.nginx .hljs-built_in {\n  font-weight: normal; }\n\n.coffeescript .javascript,\n.javascript .xml,\n.lasso .markup,\n.tex .hljs-formula,\n.xml .javascript,\n.xml .vbscript,\n.xml .css,\n.xml .hljs-cdata {\n  opacity: 0.5; }\n", ""]);

	// exports


/***/ }
/******/ ]);