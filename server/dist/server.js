/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "7b012b77f17c7b455d69";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
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
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/graph-ql/DateScalars.ts":
/*!*************************************!*\
  !*** ./src/graph-ql/DateScalars.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeScalar = exports.DateTimeScalar = exports.DateScalar = exports.formatDate = void 0;
const graphql_1 = __webpack_require__(/*! graphql */ "graphql");
const moment_1 = __importDefault(__webpack_require__(/*! moment */ "moment"));
const EPOCH_MAX = 9999999999;
const DATE_REGEXP = /(\d\d\d\d)[-]?(\d\d)[-]?(\d\d)/;
function formatDate(date) {
    if (typeof date === 'string') {
        return [...(date.match(DATE_REGEXP) || [])].slice(1).join('-');
    }
    return date;
}
exports.formatDate = formatDate;
exports.DateScalar = new graphql_1.GraphQLScalarType({
    description: 'Date in ISO 8601 format, i.e. YYYY-MM-DD',
    name: 'Date',
    parseValue(value) {
        return moment_1.default(formatDate(value)).toDate();
    },
    serialize(value) {
        return moment_1.default(formatDate(value)).format('YYYY-MM-DD');
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return moment_1.default(formatDate(ast.value)).toDate();
        }
        return null;
    },
});
exports.DateTimeScalar = new graphql_1.GraphQLScalarType({
    description: 'Date and time in ISO 8601 format, i.e. YYYY-MM-DDTHH:mm:ss.sssZ',
    name: 'ISODateTime',
    parseValue(value) {
        return moment_1.default(value).toDate();
    },
    serialize(value) {
        if (value) {
            return moment_1.default(typeof value === 'string'
                ? new Date(value)
                : typeof value === 'number'
                    ? value < EPOCH_MAX
                        ? value / 1000
                        : value
                    : value)
                .utc()
                .toISOString();
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return moment_1.default(ast.value).toDate();
        }
        return null;
    },
});
exports.TimeScalar = new graphql_1.GraphQLScalarType({
    description: 'Hours and minutes in ISO 8601 format HH:mm',
    name: 'Time',
    parseValue(value) {
        return moment_1.default(value, 'HH:mm').format('HH:mm');
    },
    serialize(value) {
        return moment_1.default(value, 'HH:mm').format('HH:mm');
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return moment_1.default(ast.value, 'HH:mm').format('HH:mm');
        }
        return null;
    },
});


/***/ }),

/***/ "./src/graph-ql/RootResolver.ts":
/*!**************************************!*\
  !*** ./src/graph-ql/RootResolver.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateScalars_1 = __webpack_require__(/*! ./DateScalars */ "./src/graph-ql/DateScalars.ts");
const Company_resolver_1 = __importDefault(__webpack_require__(/*! ./company/Company.resolver */ "./src/graph-ql/company/Company.resolver.ts"));
const Fx_resolver_1 = __importDefault(__webpack_require__(/*! ./fx/Fx.resolver */ "./src/graph-ql/fx/Fx.resolver.ts"));
const News_resolver_1 = __importDefault(__webpack_require__(/*! ./news/News.resolver */ "./src/graph-ql/news/News.resolver.ts"));
const Quote_resolver_1 = __importDefault(__webpack_require__(/*! ./quote/Quote.resolver */ "./src/graph-ql/quote/Quote.resolver.ts"));
const RefData_resolver_1 = __importDefault(__webpack_require__(/*! ./ref-data/RefData.resolver */ "./src/graph-ql/ref-data/RefData.resolver.ts"));
const Stock_resolver_1 = __importDefault(__webpack_require__(/*! ./stock/Stock.resolver */ "./src/graph-ql/stock/Stock.resolver.ts"));
const Tick_resolver_1 = __importDefault(__webpack_require__(/*! ./tick/Tick.resolver */ "./src/graph-ql/tick/Tick.resolver.ts"));
const Stats_resolver_1 = __importDefault(__webpack_require__(/*! ./stats/Stats.resolver */ "./src/graph-ql/stats/Stats.resolver.ts"));
const mergeResolvers_1 = __importDefault(__webpack_require__(/*! ./mergeResolvers */ "./src/graph-ql/mergeResolvers.ts"));
const rootResolver = {
    Date: DateScalars_1.DateScalar,
    DateTime: DateScalars_1.DateTimeScalar,
    Time: DateScalars_1.TimeScalar,
};
exports.default = mergeResolvers_1.default([Fx_resolver_1.default, Company_resolver_1.default, News_resolver_1.default, Quote_resolver_1.default, RefData_resolver_1.default, Stock_resolver_1.default, Tick_resolver_1.default, Stats_resolver_1.default], rootResolver);


/***/ }),

/***/ "./src/graph-ql/RootTypedef.ts":
/*!*************************************!*\
  !*** ./src/graph-ql/RootTypedef.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
const Company_schema_1 = __importDefault(__webpack_require__(/*! ./company/Company.schema */ "./src/graph-ql/company/Company.schema.ts"));
const Fx_schema_1 = __importDefault(__webpack_require__(/*! ./fx/Fx.schema */ "./src/graph-ql/fx/Fx.schema.ts"));
const News_schema_1 = __importDefault(__webpack_require__(/*! ./news/News.schema */ "./src/graph-ql/news/News.schema.ts"));
const Quote_schema_1 = __importDefault(__webpack_require__(/*! ./quote/Quote.schema */ "./src/graph-ql/quote/Quote.schema.ts"));
const RefData_schema_1 = __importDefault(__webpack_require__(/*! ./ref-data/RefData.schema */ "./src/graph-ql/ref-data/RefData.schema.ts"));
const Tick_schema_1 = __importDefault(__webpack_require__(/*! ./tick/Tick.schema */ "./src/graph-ql/tick/Tick.schema.ts"));
const Stock_schema_1 = __importDefault(__webpack_require__(/*! ./stock/Stock.schema */ "./src/graph-ql/stock/Stock.schema.ts"));
const Stats_schema_1 = __importDefault(__webpack_require__(/*! ./stats/Stats.schema */ "./src/graph-ql/stats/Stats.schema.ts"));
const baseSchema = apollo_server_1.gql `
  scalar Time
  scalar Date
  scalar DateTime
  scalar ISODateTime

  type Query {
    company(id: String!): Company!
    quote(id: ID = ""): Quote!
    markets: [Quote!]!
    getPriceHistory(id: String!): [FxPricing!]!
    news(id: ID = "", last: Int = 0): [News!]!
    symbol(market: String!, id: String!): SearchResult!
    symbols(text: String!, marketSegment: MarketSegment!): [SearchResult!]!
    stats(id: String!): Stats!
    stock(id: ID = ""): Stock!
    search(text: String!): [SearchResult!]!
  }

  type Subscription {
    getQuotes(symbols: [String!]!): Quote!
    getIntradayPrices(symbol: String!): [Intraday!]!
    getFXPriceUpdates(id: String!): FxRate!
  }
`;
exports.default = [
    baseSchema,
    Company_schema_1.default,
    Fx_schema_1.default,
    News_schema_1.default,
    Quote_schema_1.default,
    RefData_schema_1.default,
    Tick_schema_1.default,
    Stock_schema_1.default,
    Stats_schema_1.default,
];


/***/ }),

/***/ "./src/graph-ql/company/Company.resolver.ts":
/*!**************************************************!*\
  !*** ./src/graph-ql/company/Company.resolver.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Company_service_1 = __importDefault(__webpack_require__(/*! ./Company.service */ "./src/graph-ql/company/Company.service.ts"));
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const companyService = typedi_1.Container.get(Company_service_1.default);
const resolvers = {
    Query: {
        company: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return companyService.getCompany(args.id);
        }),
    },
    Company: {
        id: parent => {
            return parent.symbol;
        },
        name: parent => {
            return parent.companyName;
        },
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/company/Company.schema.ts":
/*!************************************************!*\
  !*** ./src/graph-ql/company/Company.schema.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
    type Company {
        id: ID!
        name: String
        symbol: String!
        exchange: String
        industry: String
        website: String
        description: String
        CEO: String
        issueType: String
        sector: String
    }
 `;


/***/ }),

/***/ "./src/graph-ql/company/Company.service.ts":
/*!*************************************************!*\
  !*** ./src/graph-ql/company/Company.service.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
let default_1 = class {
    getCompany(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.company(symbol));
        });
    }
};
default_1 = __decorate([
    typedi_1.Service()
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/fx/Fx.resolver.ts":
/*!****************************************!*\
  !*** ./src/graph-ql/fx/Fx.resolver.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fx_service_1 = __importDefault(__webpack_require__(/*! ./Fx.service */ "./src/graph-ql/fx/Fx.service.ts"));
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const pubsub_1 = __webpack_require__(/*! ../../pubsub */ "./src/pubsub.ts");
const logger_1 = __importDefault(__webpack_require__(/*! ../../services/logger */ "./src/services/logger.ts"));
const asyncIteratorUtils_1 = __webpack_require__(/*! ../../utils/asyncIteratorUtils */ "./src/utils/asyncIteratorUtils.ts");
const fxService = typedi_1.Container.get(Fx_service_1.default);
const resolvers = {
    Query: {
        getPriceHistory: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield fxService.getPriceHistory(args.id);
        }),
    },
    Subscription: {
        getFXPriceUpdates: {
            subscribe: (_, args) => {
                logger_1.default.debug(`Subscribe FX updates for ${args.id}`);
                fxService.subscribePriceUpdates(args.id);
                const result = pubsub_1.pubsub.asyncIterator(`FX_CURRENT_PRICING.${args.id}`);
                return asyncIteratorUtils_1.withCancel(result, () => {
                    logger_1.default.debug(`Unsubscribe FX updates for ${args.id}`);
                    fxService.unsubscribePriceUpdates();
                });
            },
        },
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/fx/Fx.schema.ts":
/*!**************************************!*\
  !*** ./src/graph-ql/fx/Fx.schema.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
  type FxCurrencies {
    code: ID!
    name: String!
  }

  type FxSymbol {
    id: String!
  }

  type FxPricing {
    Pair: FxSymbol!
    ask: Float!
    bid: Float!
    creationTimestamp: Float!
    mid: Float!
    valueDate: ISODateTime!
  }

  type FxRate {
    Symbol: FxSymbol!
    Bid: Float
    Ask: Float
    Mid: Float
    ValueDate: ISODateTime
    CreationTimestamp: Float
  }

  type FxSymbols {
    currencies: [FxCurrencies!]!
    pairs: [FxSymbol!]!
  }
`;


/***/ }),

/***/ "./src/graph-ql/fx/Fx.service.ts":
/*!***************************************!*\
  !*** ./src/graph-ql/fx/Fx.service.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rx_stomp_1 = __webpack_require__(/*! @stomp/rx-stomp */ "@stomp/rx-stomp");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const currencySymbols_json_1 = __importDefault(__webpack_require__(/*! ../../mock-data/currencySymbols.json */ "./src/mock-data/currencySymbols.json"));
const pubsub_1 = __webpack_require__(/*! ../../pubsub */ "./src/pubsub.ts");
const logger_1 = __importDefault(__webpack_require__(/*! ../../services/logger */ "./src/services/logger.ts"));
const RefData_schema_1 = __webpack_require__(/*! ../ref-data/RefData.schema */ "./src/graph-ql/ref-data/RefData.schema.ts");
let default_1 = class {
    constructor() {
        this.rxStomp = new rx_stomp_1.RxStomp();
        this.fxSubscription = null;
        this.rxStompRPC = new rx_stomp_1.RxStompRPC(this.rxStomp);
        this.rxStomp.configure({
            brokerURL: `ws://web-demo.adaptivecluster.com:80/ws`,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        this.rxStomp.activate();
    }
    getSymbol(id) {
        const symbolData = currencySymbols_json_1.default;
        return Object.assign({ id, marketSegment: RefData_schema_1.MarketSegments.FX }, symbolData[id]);
    }
    getSymbols(filterText) {
        const symbolData = currencySymbols_json_1.default;
        return Object.keys(symbolData)
            .filter(key => key.includes(filterText) || symbolData[key].name.includes(filterText))
            .map(key => (Object.assign({ id: key, marketSegment: RefData_schema_1.MarketSegments.FX }, symbolData[key])));
    }
    getPriceHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rxStompRPC
                .rpc({
                destination: '/amq/queue/priceHistory.getPriceHistory',
                body: JSON.stringify({ payload: `${id}`, Username: 'HHA' }),
            })
                .pipe(operators_1.map(message => {
                return JSON.parse(message.body);
            }))
                .toPromise();
        });
    }
    subscribePriceUpdates(id) {
        this.fxSubscription = this.rxStompRPC
            .stream({
            destination: '/amq/queue/pricing.getPriceUpdates',
            body: JSON.stringify({ payload: { symbol: `${id}` }, Username: 'HHA' }),
        })
            .pipe(operators_1.map(message => {
            return JSON.parse(message.body);
        }), operators_1.tap(() => logger_1.default.info(`price update FX_CURRENT_PRICING.${id}`)))
            .subscribe((value) => {
            pubsub_1.pubsub.publish(`FX_CURRENT_PRICING.${id}`, {
                getFXPriceUpdates: {
                    Bid: value.Bid,
                    Ask: value.Ask,
                    Mid: value.Mid,
                    ValueDate: value.ValueDate,
                    CreationTimestamp: value.CreationTimestamp,
                },
            });
        });
    }
    unsubscribePriceUpdates() {
        var _a;
        (_a = this.fxSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
};
default_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/fx/index.ts":
/*!**********************************!*\
  !*** ./src/graph-ql/fx/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Fx_service_1 = __webpack_require__(/*! ./Fx.service */ "./src/graph-ql/fx/Fx.service.ts");
Object.defineProperty(exports, "FxService", { enumerable: true, get: function () { return Fx_service_1.default; } });
var Fx_resolver_1 = __webpack_require__(/*! ./Fx.resolver */ "./src/graph-ql/fx/Fx.resolver.ts");
Object.defineProperty(exports, "FxResolver", { enumerable: true, get: function () { return Fx_resolver_1.default; } });


/***/ }),

/***/ "./src/graph-ql/mergeResolvers.ts":
/*!****************************************!*\
  !*** ./src/graph-ql/mergeResolvers.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (customResolver, rootResolver = {}) => {
    const mergedResolver = rootResolver;
    let key;
    if (Array.isArray(customResolver)) {
        customResolver.forEach((resolver) => {
            for (key in resolver) {
                if ({}.hasOwnProperty.call(resolver, key)) {
                    mergedResolver[key] = Object.assign(Object.assign({}, mergedResolver[key]), resolver[key]);
                }
            }
        });
    }
    else {
        for (key in customResolver) {
            if ({}.hasOwnProperty.call(customResolver, key)) {
                mergedResolver[key] = Object.assign(Object.assign({}, mergedResolver[key]), customResolver[key]);
            }
        }
    }
    return mergedResolver;
};


/***/ }),

/***/ "./src/graph-ql/news/News.resolver.ts":
/*!********************************************!*\
  !*** ./src/graph-ql/news/News.resolver.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const News_service_1 = __importDefault(__webpack_require__(/*! ./News.service */ "./src/graph-ql/news/News.service.ts"));
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const newsService = typedi_1.Container.get(News_service_1.default);
const resolvers = {
    News: {
        id: parent => {
            return parent.url;
        },
    },
    Query: {
        news: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.last) {
                return newsService.getLatestNews(args.id, args.last);
            }
            else {
                return newsService.getNews(args.id);
            }
        }),
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/news/News.schema.ts":
/*!******************************************!*\
  !*** ./src/graph-ql/news/News.schema.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
    type News {
        id: ID!
        datetime: ISODateTime!
        headline: String!
        source: String!
        url: String!
        summary: String!
        related: String!
    }
 `;


/***/ }),

/***/ "./src/graph-ql/news/News.service.ts":
/*!*******************************************!*\
  !*** ./src/graph-ql/news/News.service.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
let default_1 = class {
    getNews(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return iex.news(symbol);
        });
    }
    getLatestNews(symbol, last) {
        return __awaiter(this, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.news(symbol, last));
        });
    }
};
default_1 = __decorate([
    typedi_1.Service()
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/quote/Quote.resolver.ts":
/*!**********************************************!*\
  !*** ./src/graph-ql/quote/Quote.resolver.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(__webpack_require__(/*! ../../services/logger */ "./src/services/logger.ts"));
const pubsub_1 = __webpack_require__(/*! ../../pubsub */ "./src/pubsub.ts");
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const Quote_service_1 = __importDefault(__webpack_require__(/*! ./Quote.service */ "./src/graph-ql/quote/Quote.service.ts"));
const asyncIteratorUtils_1 = __webpack_require__(/*! ../../utils/asyncIteratorUtils */ "./src/utils/asyncIteratorUtils.ts");
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
const quoteService = typedi_1.Container.get(Quote_service_1.default);
const resolvers = {
    Query: {
        markets: () => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => quoteService.getQuotes(['SPY', 'DIA', 'IWM']));
        }),
    },
    Quote: {
        id: parent => parent.symbol,
    },
    Subscription: {
        getQuotes: {
            resolve: payload => {
                return Object.assign({ id: payload.symbol }, payload);
            },
            subscribe: (_, args) => {
                logger_1.default.debug(`Subscribe quote updates for ${args.symbols}`);
                quoteService.subscribeQuotes(args.symbols);
                const result = pubsub_1.pubsub.asyncIterator(args.symbols.map(symbol => quoteService.getQuoteTopic(symbol)));
                return asyncIteratorUtils_1.withCancel(result, () => {
                    logger_1.default.debug(`Unsubscribe quote updates for ${args.symbols}`);
                    quoteService.unsubscribeQuotes(args.symbols);
                });
            },
        },
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/quote/Quote.schema.ts":
/*!********************************************!*\
  !*** ./src/graph-ql/quote/Quote.schema.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
 type Quote {
    id: ID!
    symbol: String!
    company: Company
    companyName: String
    calculationPrice: String
    open: Float
    openTime: ISODateTime
    close: Float
    closeTime: ISODateTime
    high: Float
    low: Float
    latestPrice: Float
    latestSource: String
    latestTime: Time
    latestUpdate: ISODateTime
    latestVolume: Float
    iexRealtimePrice: Float
    iexRealtimeSize: Int
    iexLastUpdated: ISODateTime
    delayedPrice: Float
    delayedPriceTime: ISODateTime
    previousClose: Float
    change: Float
    changePercent: Float
    iexMarketPercent: Float
    iexVolume: Int
    avgTotalVolume: Int
    iexBidPrice: Float
    iexBidSize: Int
    iexAskPrice: Float
    iexAskSize: Int
    marketCap: Float
    peRatio: Float
    week52High: Float
    week52Low: Float
    ytdChange: Float
  }
 `;


/***/ }),

/***/ "./src/graph-ql/quote/Quote.service.ts":
/*!*********************************************!*\
  !*** ./src/graph-ql/quote/Quote.service.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const pubsub_1 = __webpack_require__(/*! ../../pubsub */ "./src/pubsub.ts");
const logger_1 = __importDefault(__webpack_require__(/*! ../../services/logger */ "./src/services/logger.ts"));
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
let default_1 = class {
    constructor() {
        this.currentSymbols = {};
        this.subject = new rxjs_1.Subject();
        this.getQuoteTopic = (symbol) => `MARKET_UPDATE.${symbol}`;
        this.subject
            .pipe(operators_1.switchMap(symbols => (symbols.length > 0 ? rxjs_1.timer(500, 3000) : rxjs_1.NEVER), (symbols, _) => symbols), operators_1.tap(symbols => logger_1.default.debug(`Get quotes from IEX Cloud for ${symbols}`)), operators_1.flatMap(symbols => this.getQuotes(symbols)), operators_1.flatMap(quotes => quotes))
            .subscribe({
            next: quote => {
                logger_1.default.debug(`Publishing quote for ${this.getQuoteTopic(quote.symbol)}: ${quote.latestPrice}`);
                pubsub_1.pubsub.publish(this.getQuoteTopic(quote.symbol), quote);
            },
            error: err => logger_1.default.error(`Get quotes error: ${err}`),
        });
    }
    getQuote(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield iex.quote(symbol));
        });
    }
    getQuotes(symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchQuotes = yield queryResolver_1.queryResolver(() => iex.iexApiRequest(`/stock/market/batch?symbols=${symbols.join(',')}&types=quote`));
            return symbols.map(symbol => batchQuotes[symbol].quote);
        });
    }
    unsubscribeQuotes(symbols) {
        symbols.forEach(symbol => {
            if (this.currentSymbols[symbol]) {
                this.currentSymbols[symbol].listenerCount--;
                if (!this.currentSymbols[symbol].listenerCount) {
                    delete this.currentSymbols[symbol];
                }
            }
        });
        this.subject.next(Object.keys(this.currentSymbols));
    }
    subscribeQuotes(symbols) {
        symbols.forEach(symbol => {
            if (this.currentSymbols[symbol]) {
                this.currentSymbols[symbol].listenerCount++;
            }
            else {
                this.currentSymbols[symbol] = {
                    listenerCount: 1,
                };
            }
        });
        this.subject.next(Object.keys(this.currentSymbols));
    }
};
default_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/quote/index.ts":
/*!*************************************!*\
  !*** ./src/graph-ql/quote/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Quote_service_1 = __webpack_require__(/*! ./Quote.service */ "./src/graph-ql/quote/Quote.service.ts");
Object.defineProperty(exports, "QuoteService", { enumerable: true, get: function () { return Quote_service_1.default; } });
var Quote_schema_1 = __webpack_require__(/*! ./Quote.schema */ "./src/graph-ql/quote/Quote.schema.ts");
Object.defineProperty(exports, "QuoteSchema", { enumerable: true, get: function () { return Quote_schema_1.default; } });
var Quote_resolver_1 = __webpack_require__(/*! ./Quote.resolver */ "./src/graph-ql/quote/Quote.resolver.ts");
Object.defineProperty(exports, "QuoteResolver", { enumerable: true, get: function () { return Quote_resolver_1.default; } });


/***/ }),

/***/ "./src/graph-ql/ref-data/RefData.resolver.ts":
/*!***************************************************!*\
  !*** ./src/graph-ql/ref-data/RefData.resolver.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fx_1 = __webpack_require__(/*! ../fx */ "./src/graph-ql/fx/index.ts");
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const RefData_schema_1 = __webpack_require__(/*! ./RefData.schema */ "./src/graph-ql/ref-data/RefData.schema.ts");
const fxService = typedi_1.Container.get(fx_1.FxService);
const resolvers = {
    Query: {
        symbol: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            switch (args.market.toLowerCase()) {
                case RefData_schema_1.MarketSegments.STOCK: {
                    const results = [{ id: "test1" }, { id: "test2" }, { id: "test3" }];
                    return results.find(s => s.id == args.id) || results[0];
                }
                case RefData_schema_1.MarketSegments.FX: {
                    return fxService.getSymbol(args.id);
                }
                default: {
                    throw new Error(`unsupported`);
                }
            }
        }),
        symbols: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            switch (args.marketSegment.toLowerCase()) {
                case RefData_schema_1.MarketSegments.STOCK: {
                    return "ITEMS SEARCH DEBUGGER";
                }
                case RefData_schema_1.MarketSegments.FX: {
                    return fxService.getSymbols(args.text);
                }
                default: {
                    throw new Error(`Unsupported`);
                }
            }
        }),
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/ref-data/RefData.schema.ts":
/*!*************************************************!*\
  !*** ./src/graph-ql/ref-data/RefData.schema.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSegments = void 0;
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
var MarketSegments;
(function (MarketSegments) {
    MarketSegments["FX"] = "fx";
    MarketSegments["STOCK"] = "stock";
    MarketSegments["INDEX"] = "index";
    MarketSegments["FUTURE"] = "future";
    MarketSegments["BOND"] = "bond";
})(MarketSegments = exports.MarketSegments || (exports.MarketSegments = {}));
exports.default = apollo_server_1.gql `
  enum MarketSegment {
    FX
    STOCK
    INDEX
    FUTURE
    BOND
  }
`;


/***/ }),

/***/ "./src/graph-ql/stats/Stats.resolver.ts":
/*!**********************************************!*\
  !*** ./src/graph-ql/stats/Stats.resolver.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stats_service_1 = __importDefault(__webpack_require__(/*! ./Stats.service */ "./src/graph-ql/stats/Stats.service.ts"));
const Company_service_1 = __importDefault(__webpack_require__(/*! ../company/Company.service */ "./src/graph-ql/company/Company.service.ts"));
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const companyService = typedi_1.Container.get(Company_service_1.default);
const statsService = typedi_1.Container.get(Stats_service_1.default);
const resolvers = {
    Query: {
        stats: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            return statsService.getStats(args.id);
        })
    },
    Stats: {
        id: (parent) => {
            return parent.symbol;
        },
        company: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return companyService.getCompany(parent.id);
        })
    }
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/stats/Stats.schema.ts":
/*!********************************************!*\
  !*** ./src/graph-ql/stats/Stats.schema.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
    type Stats {
        id: ID!
        symbol: String!
        company: Company
        companyName: String
        marketcap: Float
        week52high: Float
        week52low: Float
        week52change: Float
        sharesOutstanding: Float
        float: Float
        avg10Volume: Int
        avg30Volume: Int
        day200MovingAvg: Float
        day50MovingAvg: Float
        employees: Int
        ttmEPS: Float
        ttmDividendRate: Float
        dividendYield: Float
        nextDividendDate: Date
        exDividendDate: Date
        nextEarningsDate: Date
        peRatio: Float
        beta: Float
        maxChangePercent: Float
        year5ChangePercent: Float
        year2ChangePercent: Float
        year1ChangePercent: Float
        ytdChangePercent: Float
        month6ChangePercent: Float
        month3ChangePercent: Float
        month1ChangePercent: Float
        day30ChangePercent: Float
        day5ChangePercent: Float
    }
 `;


/***/ }),

/***/ "./src/graph-ql/stats/Stats.service.ts":
/*!*********************************************!*\
  !*** ./src/graph-ql/stats/Stats.service.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
let default_1 = class {
    getStats(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.keyStats(symbol));
        });
    }
};
default_1 = __decorate([
    typedi_1.Service()
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/stock/Stock.resolver.ts":
/*!**********************************************!*\
  !*** ./src/graph-ql/stock/Stock.resolver.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stats_service_1 = __importDefault(__webpack_require__(/*! ../stats/Stats.service */ "./src/graph-ql/stats/Stats.service.ts"));
const Company_service_1 = __importDefault(__webpack_require__(/*! ../company/Company.service */ "./src/graph-ql/company/Company.service.ts"));
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const tick_1 = __webpack_require__(/*! ../tick */ "./src/graph-ql/tick/index.ts");
const quote_1 = __webpack_require__(/*! ../quote */ "./src/graph-ql/quote/index.ts");
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
const companyService = typedi_1.Container.get(Company_service_1.default);
const statsService = typedi_1.Container.get(Stats_service_1.default);
const tickService = typedi_1.Container.get(tick_1.TickService);
const quoteService = typedi_1.Container.get(quote_1.QuoteService);
const resolvers = {
    Query: {
        stock: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                id: args.id.toUpperCase(),
                symbol: args.id,
            };
        }),
    },
    Stock: {
        chart: (parent) => {
            return queryResolver_1.queryResolver(() => tickService.getChart(parent.id));
        },
        company: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => companyService.getCompany(parent.id));
        }),
        stats: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => statsService.getStats(parent.id));
        }),
        peers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.peers(parent.id));
        }),
        quote: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => quoteService.getQuote(parent.id));
        }),
        price: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.price(parent.id));
        }),
        previous: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.previousDay(parent.id));
        }),
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/stock/Stock.schema.ts":
/*!********************************************!*\
  !*** ./src/graph-ql/stock/Stock.schema.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
  type Previous {
    symbol: ID!
    date: Date!
    open: Float!
    high: Float!
    low: Float!
    close: Float!
    volume: Int!
    unadjustedVolume: Int!
    change: Float!
    changePercent: Float!
    vwap: Float!
  }

  type SearchResult {
    id: ID!
    name: String!
    marketSegment: String!
  }

  type Stock {
    id: ID!
    symbol: String!
    price: Float!
    stats: Stats!
    peers: [String!]!
    chart: [Tick!]!
    company: Company!
    quote: Quote!
    news(last: Float!): [News!]!
    previous: Previous!
  }
`;


/***/ }),

/***/ "./src/graph-ql/tick/Tick.resolver.ts":
/*!********************************************!*\
  !*** ./src/graph-ql/tick/Tick.resolver.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DateScalars_1 = __webpack_require__(/*! ../DateScalars */ "./src/graph-ql/DateScalars.ts");
const resolvers = {
    Tick: {
        datetime: parent => {
            return `${DateScalars_1.formatDate(parent.date) || ''}${parent.minute ? `T${parent.minute}` : ''}`;
        },
    },
};
exports.default = resolvers;


/***/ }),

/***/ "./src/graph-ql/tick/Tick.schema.ts":
/*!******************************************!*\
  !*** ./src/graph-ql/tick/Tick.schema.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
 type Intraday {
    date: Date
    minute: Time
    datetime: ISODateTime
    high: Float
    low: Float
    average: Float
    open: Float
    close: Float
    volume: Float
    notional: Float
    numberOfTrades: Int
  }

  type Tick {
    date: Date!
    minute: Time!
    datetime: ISODateTime!
    label: String!
    high: Float
    low: Float
    average: Float
    open: Float
    close: Float
    volume: Float!
    notional: Float!
    numberOfTrades: Float!
    changeOverTime: Float!
    marketHigh: Float!
    marketLow: Float!
    marketAverage: Float!
    marketVolume: Float!
    marketNotional: Float!
    marketNumberOfTrades: Float!
    marketChangeOverTime: Float!
  }
  
 `;


/***/ }),

/***/ "./src/graph-ql/tick/Tick.service.ts":
/*!*******************************************!*\
  !*** ./src/graph-ql/tick/Tick.service.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __webpack_require__(/*! typedi */ "typedi");
const iex = __importStar(__webpack_require__(/*! iexcloud_api_wrapper */ "iexcloud_api_wrapper"));
const queryResolver_1 = __webpack_require__(/*! ../../utils/queryResolver */ "./src/utils/queryResolver.ts");
let default_1 = class {
    getChart(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return queryResolver_1.queryResolver(() => iex.history(symbol, { period: '1d' }));
        });
    }
};
default_1 = __decorate([
    typedi_1.Service()
], default_1);
exports.default = default_1;


/***/ }),

/***/ "./src/graph-ql/tick/index.ts":
/*!************************************!*\
  !*** ./src/graph-ql/tick/index.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tick_service_1 = __webpack_require__(/*! ./Tick.service */ "./src/graph-ql/tick/Tick.service.ts");
Object.defineProperty(exports, "TickService", { enumerable: true, get: function () { return Tick_service_1.default; } });
var Tick_schema_1 = __webpack_require__(/*! ./Tick.schema */ "./src/graph-ql/tick/Tick.schema.ts");
Object.defineProperty(exports, "TickSchema", { enumerable: true, get: function () { return Tick_schema_1.default; } });
var Tick_resolver_1 = __webpack_require__(/*! ./Tick.resolver */ "./src/graph-ql/tick/Tick.resolver.ts");
Object.defineProperty(exports, "TickResolver", { enumerable: true, get: function () { return Tick_resolver_1.default; } });


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const logger_1 = __importDefault(__webpack_require__(/*! ./services/logger */ "./src/services/logger.ts"));
const RootTypedef_1 = __importDefault(__webpack_require__(/*! ./graph-ql/RootTypedef */ "./src/graph-ql/RootTypedef.ts"));
const RootResolver_1 = __importDefault(__webpack_require__(/*! ./graph-ql/RootResolver */ "./src/graph-ql/RootResolver.ts"));
Object.assign(global, { WebSocket: __webpack_require__(/*! websocket */ "websocket").w3cwebsocket });
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.IEXCLOUD_API_VERSION || !process.env.IEXCLOUD_PUBLIC_KEY) {
            logger_1.default.error('iex-cloud API key must be set');
        }
        const server = new apollo_server_1.ApolloServer({
            typeDefs: RootTypedef_1.default,
            resolvers: RootResolver_1.default,
        });
        server.listen().then(({ url, subscriptionsUrl }) => {
            logger_1.default.info(`Server ready at ${url}`);
            logger_1.default.info(`Subscriptions ready at ${subscriptionsUrl}`);
            if (true) {
                module.hot.accept();
                module.hot.dispose(() => console.log('Module disposed. '));
            }
        });
    });
}
bootstrap();


/***/ }),

/***/ "./src/mock-data/currencySymbols.json":
/*!********************************************!*\
  !*** ./src/mock-data/currencySymbols.json ***!
  \********************************************/
/*! exports provided: EURUSD, USDJPY, GBPJPY, GBPUSD, EURJPY, EURCAD, AUDUSD, NZDUSD, EURAUD, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"EURUSD\":{\"name\":\"Euro to United States Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"EUR\",\"terms\":\"USD\"},\"USDJPY\":{\"name\":\"US dollar to Japanese Yen\",\"ratePrecision\":3,\"pipsPosition\":2,\"base\":\"USD\",\"terms\":\"JPY\"},\"GBPJPY\":{\"name\":\"Pound sterling to Japanese Yen\",\"ratePrecision\":3,\"pipsPosition\":2,\"base\":\"GBP\",\"terms\":\"JPY\"},\"GBPUSD\":{\"name\":\"Pound Sterling to United States Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"GBP\",\"terms\":\"USD\"},\"EURJPY\":{\"name\":\"Euro to Japanese Yen\",\"ratePrecision\":3,\"pipsPosition\":2,\"base\":\"EUR\",\"terms\":\"JPY\"},\"EURCAD\":{\"name\":\"Euro to Canadian Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"EUR\",\"terms\":\"CAD\"},\"AUDUSD\":{\"name\":\"Australian dollar to United States Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"AUD\",\"terms\":\"USD\"},\"NZDUSD\":{\"name\":\"New Zealand dollar to United States Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"NZD\",\"terms\":\"USD\"},\"EURAUD\":{\"name\":\"Euro to Australian Dollar\",\"ratePrecision\":5,\"pipsPosition\":4,\"base\":\"EUR\",\"terms\":\"AUD\"}}");

/***/ }),

/***/ "./src/pubsub.ts":
/*!***********************!*\
  !*** ./src/pubsub.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const graphql_subscriptions_1 = __webpack_require__(/*! graphql-subscriptions */ "graphql-subscriptions");
exports.pubsub = new graphql_subscriptions_1.PubSub();


/***/ }),

/***/ "./src/services/logger.ts":
/*!********************************!*\
  !*** ./src/services/logger.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(__webpack_require__(/*! winston */ "winston"));
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.json(),
    level: 'debug',
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error', maxFiles: 2, maxsize: 10000 }),
        new winston_1.default.transports.File({ filename: 'combine.log', maxFiles: 2, maxsize: 10000 }),
    ],
});
if (true) {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
exports.default = logger;


/***/ }),

/***/ "./src/utils/asyncIteratorUtils.ts":
/*!*****************************************!*\
  !*** ./src/utils/asyncIteratorUtils.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.withCancel = void 0;
function withCancel(asyncIterator, onCancel) {
    const asyncReturn = asyncIterator.return;
    asyncIterator.return = () => {
        onCancel();
        return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({ value: undefined, done: true });
    };
    return asyncIterator;
}
exports.withCancel = withCancel;


/***/ }),

/***/ "./src/utils/queryResolver.ts":
/*!************************************!*\
  !*** ./src/utils/queryResolver.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryResolver = void 0;
const logger_1 = __importDefault(__webpack_require__(/*! ../services/logger */ "./src/services/logger.ts"));
const ERROR_MESSAGE = 'Max retries hit for query to IEX cloud';
const MIN_INTERVAL = 500;
const MAX_INTERVAL = 1200;
const MAX_RETRIES = 5;
const randomInterval = (min, max) => {
    return Math.floor(Math.random() * max) + min;
};
function queryResolver(fn, retries = MAX_RETRIES, interval = randomInterval(MIN_INTERVAL, MAX_INTERVAL)) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (error) {
            if (retries) {
                yield new Promise(res => setTimeout(res, interval));
                return queryResolver(fn, retries - 1, interval * 2);
            }
            else {
                logger_1.default.error(ERROR_MESSAGE);
                throw new Error(ERROR_MESSAGE);
            }
        }
    });
}
exports.queryResolver = queryResolver;


/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/main.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! /Users/adesemoyeolusola/webprojects/react-rails/market-analytics-graphql/server/src/main.ts */"./src/main.ts");


/***/ }),

/***/ "@stomp/rx-stomp":
/*!**********************************!*\
  !*** external "@stomp/rx-stomp" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@stomp/rx-stomp");

/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-subscriptions":
/*!****************************************!*\
  !*** external "graphql-subscriptions" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-subscriptions");

/***/ }),

/***/ "iexcloud_api_wrapper":
/*!***************************************!*\
  !*** external "iexcloud_api_wrapper" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("iexcloud_api_wrapper");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "typedi":
/*!*************************!*\
  !*** external "typedi" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("typedi");

/***/ }),

/***/ "websocket":
/*!****************************!*\
  !*** external "websocket" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("websocket");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvRGF0ZVNjYWxhcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL1Jvb3RSZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvUm9vdFR5cGVkZWYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL2NvbXBhbnkvQ29tcGFueS5yZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvY29tcGFueS9Db21wYW55LnNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvY29tcGFueS9Db21wYW55LnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL2Z4L0Z4LnJlc29sdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9meC9GeC5zY2hlbWEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL2Z4L0Z4LnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL2Z4L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9tZXJnZVJlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvbmV3cy9OZXdzLnJlc29sdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9uZXdzL05ld3Muc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9uZXdzL05ld3Muc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvcXVvdGUvUXVvdGUucmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL3F1b3RlL1F1b3RlLnNjaGVtYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvcXVvdGUvUXVvdGUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvcXVvdGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL3JlZi1kYXRhL1JlZkRhdGEucmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL3JlZi1kYXRhL1JlZkRhdGEuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9zdGF0cy9TdGF0cy5yZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvc3RhdHMvU3RhdHMuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9zdGF0cy9TdGF0cy5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC9zdG9jay9TdG9jay5yZXNvbHZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGgtcWwvc3RvY2svU3RvY2suc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC90aWNrL1RpY2sucmVzb2x2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL3RpY2svVGljay5zY2hlbWEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLXFsL3RpY2svVGljay5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmFwaC1xbC90aWNrL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIiwid2VicGFjazovLy8uL3NyYy9wdWJzdWIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2xvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvYXN5bmNJdGVyYXRvclV0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9xdWVyeVJlc29sdmVyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBzdG9tcC9yeC1zdG9tcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncmFwaHFsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JhcGhxbC1zdWJzY3JpcHRpb25zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaWV4Y2xvdWRfYXBpX3dyYXBwZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb21lbnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWZsZWN0LW1ldGFkYXRhXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicnhqc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJ4anMvb3BlcmF0b3JzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHlwZWRpXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwid2Vic29ja2V0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwid2luc3RvblwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQSw2QkFBNkI7UUFDN0IsNkJBQTZCO1FBQzdCO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHFCQUFxQixnQkFBZ0I7UUFDckM7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0Esa0JBQWtCLDhCQUE4QjtRQUNoRDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0EsT0FBTztRQUNQO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxvQkFBb0IsMkJBQTJCO1FBQy9DO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLG1CQUFtQixjQUFjO1FBQ2pDO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxnQkFBZ0IsS0FBSztRQUNyQjtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQixZQUFZO1FBQzVCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0EsY0FBYyw0QkFBNEI7UUFDMUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJOztRQUVKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTs7UUFFQTtRQUNBO1FBQ0EsZUFBZSw0QkFBNEI7UUFDM0M7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsaUJBQWlCLHVDQUF1QztRQUN4RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGlCQUFpQix1Q0FBdUM7UUFDeEQ7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxpQkFBaUIsc0JBQXNCO1FBQ3ZDO1FBQ0E7UUFDQTtRQUNBLFFBQVE7UUFDUjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxVQUFVO1FBQ1Y7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0EsY0FBYyx3Q0FBd0M7UUFDdEQ7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsU0FBUztRQUNUO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsUUFBUTtRQUNSO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZUFBZTtRQUNmO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOztRQUVBO1FBQ0Esc0NBQXNDLHVCQUF1Qjs7O1FBRzdEO1FBQ0E7Ozs7Ozs7Ozs7OztBQy91QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsV0FBVyxtQkFBTyxDQUFDLGdEQUFPOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0NBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBVTtBQUNkO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLGdEQUFPOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLG1CQUFPLENBQUMsMEVBQW9CO0FBQ2pDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUMsTUFBTSxFQUVOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BDRCxnRUFBaUQ7QUFDakQsOEVBQTJCO0FBRTNCLE1BQU0sU0FBUyxHQUFHLFVBQVU7QUFDNUIsTUFBTSxXQUFXLEdBQUcsZ0NBQWdDO0FBRXBELFNBQWdCLFVBQVUsQ0FBQyxJQUFrQjtJQUN6QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNqRTtJQUVELE9BQU8sSUFBSTtBQUNmLENBQUM7QUFORCxnQ0FNQztBQU1ZLGtCQUFVLEdBQUcsSUFBSSwyQkFBaUIsQ0FBQztJQUM1QyxXQUFXLEVBQUUsMENBQTBDO0lBQ3ZELElBQUksRUFBRSxNQUFNO0lBQ1osVUFBVSxDQUFDLEtBQVU7UUFDakIsT0FBTyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtJQUM3QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQVU7UUFDaEIsT0FBTyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDekQsQ0FBQztJQUNELFlBQVksQ0FBQyxHQUFRO1FBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxjQUFJLENBQUMsTUFBTSxFQUFFO1lBQzFCLE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJO0lBQ2YsQ0FBQztDQUNKLENBQUM7QUFFVyxzQkFBYyxHQUFHLElBQUksMkJBQWlCLENBQUM7SUFDaEQsV0FBVyxFQUFFLGlFQUFpRTtJQUM5RSxJQUFJLEVBQUUsYUFBYTtJQUNuQixVQUFVLENBQUMsS0FBVTtRQUNqQixPQUFPLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2pDLENBQUM7SUFDRCxTQUFTLENBQUMsS0FBVTtRQUNoQixJQUFJLEtBQUssRUFBRTtZQUNQLE9BQU8sZ0JBQU0sQ0FDVCxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUNyQixDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNqQixDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUTtvQkFDdkIsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTO3dCQUNmLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSTt3QkFDZCxDQUFDLENBQUMsS0FBSztvQkFDWCxDQUFDLENBQUMsS0FBSyxDQUNsQjtpQkFDSSxHQUFHLEVBQUU7aUJBQ0wsV0FBVyxFQUFFO1NBQ3JCO0lBQ0wsQ0FBQztJQUNELFlBQVksQ0FBQyxHQUFRO1FBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxjQUFJLENBQUMsTUFBTSxFQUFFO1lBQzFCLE9BQU8sZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO1NBQ3BDO1FBQ0QsT0FBTyxJQUFJO0lBQ2YsQ0FBQztDQUNKLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksMkJBQWlCLENBQUM7SUFDNUMsV0FBVyxFQUFFLDRDQUE0QztJQUN6RCxJQUFJLEVBQUUsTUFBTTtJQUNaLFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLE9BQU8sZ0JBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqRCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQVU7UUFDaEIsT0FBTyxnQkFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pELENBQUM7SUFDRCxZQUFZLENBQUMsR0FBUTtRQUNqQixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssY0FBSSxDQUFDLE1BQU0sRUFBRTtZQUMxQixPQUFPLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ3BEO1FBQ0QsT0FBTyxJQUFJO0lBQ2YsQ0FBQztDQUNKLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlFRixnR0FBc0U7QUFDdEUsZ0pBQXdEO0FBQ3hELHVIQUF5QztBQUN6QyxpSUFBOEM7QUFDOUMsc0lBQWtEO0FBQ2xELGtKQUFxRDtBQUNyRCxzSUFBa0Q7QUFDbEQsaUlBQStDO0FBQy9DLHNJQUFrRDtBQUNsRCwwSEFBNkM7QUFFN0MsTUFBTSxZQUFZLEdBQWU7SUFDN0IsSUFBSSxFQUFFLHdCQUFVO0lBQ2hCLFFBQVEsRUFBRSw0QkFBYztJQUN4QixJQUFJLEVBQUUsd0JBQVU7Q0FDbkI7QUFFRCxrQkFBZSx3QkFBYyxDQUN6QixDQUFDLHFCQUFVLEVBQUUsMEJBQWUsRUFBRSx1QkFBVyxFQUFFLHdCQUFhLEVBQUUsMEJBQVcsRUFBRSx3QkFBYSxFQUFFLHVCQUFZLEVBQUUsd0JBQWEsQ0FBQyxFQUNsSCxZQUFZLENBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCZixrRkFBbUM7QUFDbkMsMElBQW9EO0FBQ3BELGlIQUFxQztBQUNyQywySEFBMkM7QUFDM0MsZ0lBQThDO0FBQzlDLDRJQUFpRDtBQUNqRCwySEFBMkM7QUFDM0MsZ0lBQThDO0FBQzlDLGdJQUE4QztBQUU5QyxNQUFNLFVBQVUsR0FBRyxtQkFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JyQjtBQUVELGtCQUFlO0lBQ1gsVUFBVTtJQUNWLHdCQUFhO0lBQ2IsbUJBQVE7SUFDUixxQkFBVTtJQUNWLHNCQUFXO0lBQ1gsd0JBQVM7SUFDVCxxQkFBVTtJQUNWLHNCQUFXO0lBQ1gsc0JBQVc7Q0FDZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNELHFJQUE4QztBQUU5Qyw2REFBa0M7QUFFbEMsTUFBTSxjQUFjLEdBQUcsa0JBQVMsQ0FBQyxHQUFHLENBQUMseUJBQWMsQ0FBQztBQUVwRCxNQUFNLFNBQVMsR0FBZTtJQUMxQixLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsQ0FBTyxDQUFDLEVBQUUsSUFBb0IsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzdDLENBQUM7S0FDSjtJQUNELE9BQU8sRUFBRTtRQUNMLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNULE9BQU8sTUFBTSxDQUFDLE1BQU07UUFDeEIsQ0FBQztRQUNELElBQUksRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNYLE9BQU8sTUFBTSxDQUFDLFdBQVc7UUFDN0IsQ0FBQztLQUNKO0NBQ0o7QUFFRCxrQkFBZSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7QUN0QnhCLGtGQUFtQztBQUNuQyxrQkFBZSxtQkFBRzs7Ozs7Ozs7Ozs7OztFQWFoQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZEgsNkRBQWdDO0FBQ2hDLGtHQUEyQztBQUMzQyw2R0FBeUQ7QUFHekQ7SUFDaUIsVUFBVSxDQUFDLE1BQWM7O1lBQ2xDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FBQTtDQUNKO0FBSkQ7SUFEQyxnQkFBTyxFQUFFO2FBS1Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSRCxpSEFBb0M7QUFDcEMsNkRBQWtDO0FBQ2xDLDRFQUFxQztBQUNyQywrR0FBMEM7QUFDMUMsNEhBQTJEO0FBRTNELE1BQU0sU0FBUyxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFTLENBQUM7QUFFMUMsTUFBTSxTQUFTLEdBQWU7SUFDMUIsS0FBSyxFQUFFO1FBQ0gsZUFBZSxFQUFFLENBQU8sQ0FBQyxFQUFFLElBQW9CLEVBQUUsRUFBRTtZQUMvQyxPQUFPLE1BQU0sU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25ELENBQUM7S0FDSjtJQUNELFlBQVksRUFBRTtRQUNWLGlCQUFpQixFQUFFO1lBQ2YsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQW9CLEVBQUUsRUFBRTtnQkFDbkMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFFbkQsU0FBUyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3hDLE1BQU0sTUFBTSxHQUFHLGVBQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFFcEUsT0FBTywrQkFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7b0JBQzNCLGdCQUFNLENBQUMsS0FBSyxDQUFDLDhCQUE4QixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3JELFNBQVMsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDdkMsQ0FBQyxDQUFDO1lBQ04sQ0FBQztTQUNKO0tBQ0o7Q0FDSjtBQUVELGtCQUFlLFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQ2hDeEIsa0ZBQW1DO0FBQ25DLGtCQUFlLG1CQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWdDakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDRCxpRkFBcUQ7QUFFckQsZ0ZBQXlDO0FBQ3pDLDZEQUFnQztBQUNoQyx3SkFBdUQ7QUFDdkQsNEVBQXFDO0FBQ3JDLCtHQUEwQztBQUMxQyw0SEFBMkQ7QUFnQzNEO0lBSUk7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRTtRQUU1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUk7UUFFMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHFCQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNuQixTQUFTLEVBQUUseUNBQXlDO1lBQ3BELGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDM0IsQ0FBQztJQUVNLFNBQVMsQ0FBQyxFQUFVO1FBQ3ZCLE1BQU0sVUFBVSxHQUFHLDhCQUFtQjtRQUN0Qyx1QkFBUyxFQUFFLEVBQUUsYUFBYSxFQUFFLCtCQUFjLENBQUMsRUFBRSxJQUFLLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN0RSxDQUFDO0lBRU0sVUFBVSxDQUFDLFVBQWtCO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLDhCQUFtQjtRQUN0QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDcEYsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsaUJBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsK0JBQWMsQ0FBQyxFQUFFLElBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFHLENBQUM7SUFDeEYsQ0FBQztJQUVZLGVBQWUsQ0FBQyxFQUFVOztZQUNuQyxPQUFPLElBQUksQ0FBQyxVQUFVO2lCQUNqQixHQUFHLENBQUM7Z0JBQ0QsV0FBVyxFQUFFLHlDQUF5QztnQkFDdEQsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7YUFDOUQsQ0FBQztpQkFDRCxJQUFJLENBQ0QsZUFBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUNMO2lCQUNBLFNBQVMsRUFBRTtRQUNwQixDQUFDO0tBQUE7SUFFTSxxQkFBcUIsQ0FBQyxFQUFVO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVU7YUFDaEMsTUFBTSxDQUFDO1lBQ0osV0FBVyxFQUFFLG9DQUFvQztZQUNqRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQzFFLENBQUM7YUFDRCxJQUFJLENBQ0QsZUFBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbkMsQ0FBQyxDQUFDLEVBQ0YsZUFBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQ2xFO2FBQ0EsU0FBUyxDQUFDLENBQUMsS0FBbUIsRUFBRSxFQUFFO1lBQy9CLGVBQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxFQUFFO2dCQUN2QyxpQkFBaUIsRUFBRTtvQkFDZixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7b0JBQ2QsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO29CQUNkLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztvQkFDZCxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7b0JBQzFCLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7aUJBQzdDO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQztJQUNWLENBQUM7SUFFTSx1QkFBdUI7O1FBQzFCLFVBQUksQ0FBQyxjQUFjLDBDQUFHLFdBQVcsR0FBRTtJQUN6QyxDQUFDO0NBQ0Y7QUEzRUQ7SUFEQyxnQkFBTyxFQUFFOzthQTRFVDs7Ozs7Ozs7Ozs7Ozs7OztBQ2xIRCw4RkFBbUQ7QUFBMUMsOEdBQU8sT0FBYTtBQUM3QixpR0FBcUQ7QUFBNUMsZ0hBQU8sT0FBYzs7Ozs7Ozs7Ozs7Ozs7O0FDRDlCLGtCQUFlLENBQUMsY0FBbUIsRUFBRSxZQUFZLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDdEQsTUFBTSxjQUFjLEdBQUcsWUFBbUIsQ0FBQztJQUMzQyxJQUFJLEdBQUcsQ0FBQztJQUVSLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUMvQixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDaEMsS0FBSyxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUNsQixJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDdkMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxtQ0FBUSxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7aUJBQ3RFO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztLQUNOO1NBQU07UUFDSCxLQUFLLEdBQUcsSUFBSSxjQUFjLEVBQUU7WUFDeEIsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQzdDLGNBQWMsQ0FBQyxHQUFHLENBQUMsbUNBQVEsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO2FBQzVFO1NBQ0o7S0FDSjtJQUVELE9BQU8sY0FBYyxDQUFDO0FBQzFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCRCx5SEFBd0M7QUFDeEMsNkRBQWtDO0FBRWxDLE1BQU0sV0FBVyxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFXLENBQUM7QUFFOUMsTUFBTSxTQUFTLEdBQWU7SUFDMUIsSUFBSSxFQUFFO1FBQ0YsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ1QsT0FBTyxNQUFNLENBQUMsR0FBRztRQUNyQixDQUFDO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxJQUFJLEVBQUUsQ0FBTyxDQUFDLEVBQUUsSUFBa0MsRUFBRSxFQUFFO1lBQ2xELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDWCxPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ3ZEO2lCQUFNO2dCQUNILE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQ3RDO1FBQ0wsQ0FBQztLQUNKO0NBQ0o7QUFFRCxrQkFBZSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7QUN2QnhCLGtGQUFtQztBQUNuQyxrQkFBZSxtQkFBRzs7Ozs7Ozs7OztFQVVoQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWEgsNkRBQWdDO0FBQ2hDLGtHQUEyQztBQUMzQyw2R0FBeUQ7QUFHekQ7SUFDaUIsT0FBTyxDQUFDLE1BQWM7O1lBQy9CLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBQ1ksYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFZOztZQUNuRCxPQUFPLDZCQUFhLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0NBQ0o7QUFQRDtJQURDLGdCQUFPLEVBQUU7YUFRVDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hELCtHQUEwQztBQUMxQyw0RUFBcUM7QUFDckMsNkRBQWtDO0FBQ2xDLDZIQUEwQztBQUMxQyw0SEFBMkQ7QUFDM0QsNkdBQXlEO0FBRXpELE1BQU0sWUFBWSxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLHVCQUFZLENBQUM7QUFFaEQsTUFBTSxTQUFTLEdBQWU7SUFDMUIsS0FBSyxFQUFFO1FBQ0gsT0FBTyxFQUFFLEdBQVMsRUFBRTtZQUNoQixPQUFPLDZCQUFhLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxDQUFDO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTTtLQUM5QjtJQUNELFlBQVksRUFBRTtRQUNWLFNBQVMsRUFBRTtZQUNQLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDZix1QkFDSSxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFDZixPQUFPLEVBQ2I7WUFDTCxDQUFDO1lBQ0QsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQTJCLEVBQUUsRUFBRTtnQkFDMUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDM0QsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUUxQyxNQUFNLE1BQU0sR0FBRyxlQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUVuRyxPQUFPLCtCQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtvQkFDM0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0QsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELENBQUMsQ0FBQztZQUNOLENBQUM7U0FDSjtLQUNKO0NBQ0o7QUFFRCxrQkFBZSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7QUMxQ3hCLGtGQUFtQztBQUNuQyxrQkFBZSxtQkFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBdUNoQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNILDZEQUFnQztBQUNoQyxrR0FBMkM7QUFFM0MsdURBQTRDO0FBQzVDLGdGQUF3RDtBQUN4RCw0RUFBcUM7QUFDckMsK0dBQTBDO0FBQzFDLDZHQUF5RDtBQVN6RDtJQUlJO1FBSFEsbUJBQWMsR0FBd0IsRUFBRTtRQUN4QyxZQUFPLEdBQUcsSUFBSSxjQUFPLEVBQVk7UUFrQ2xDLGtCQUFhLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixNQUFNLEVBQUU7UUEvQmhFLElBQUksQ0FBQyxPQUFPO2FBQ1AsSUFBSSxDQUNELHFCQUFTLENBQ0wsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFLLENBQUMsRUFDMUQsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQzFCLEVBQ0QsZUFBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFDeEUsbUJBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDM0MsbUJBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUM1QjthQUNBLFNBQVMsQ0FBQztZQUNQLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDVixnQkFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUM5RixlQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUMzRCxDQUFDO1lBQ0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO1NBQ3pELENBQUM7SUFDVixDQUFDO0lBRVksUUFBUSxDQUFDLE1BQWM7O1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQVU7UUFDN0MsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE9BQWlCOztZQUNwQyxNQUFNLFdBQVcsR0FBbUIsTUFBTSw2QkFBYSxDQUFDLEdBQUcsRUFBRSxDQUN6RCxHQUFHLENBQUMsYUFBYSxDQUFDLCtCQUErQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FDcEY7WUFFRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUlNLGlCQUFpQixDQUFDLE9BQWlCO1FBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFO29CQUM1QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO2lCQUNyQzthQUNKO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLGVBQWUsQ0FBQyxPQUFpQjtRQUNwQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUU7YUFDOUM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDMUIsYUFBYSxFQUFFLENBQUM7aUJBQ25CO2FBQ0o7UUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7QUFoRUQ7SUFEQyxnQkFBTyxFQUFFOzthQWlFVDs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGRCwwR0FBeUQ7QUFBaEQsb0hBQU8sT0FBZ0I7QUFDaEMsdUdBQXVEO0FBQTlDLGtIQUFPLE9BQWU7QUFDL0IsNkdBQTJEO0FBQWxELHNIQUFPLE9BQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBakMsNEVBQWtDO0FBRWxDLDZEQUFtQztBQUNuQyxrSEFBa0Q7QUFHbEQsTUFBTSxTQUFTLEdBQUcsa0JBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUyxDQUFDLENBQUM7QUFFM0MsTUFBTSxTQUFTLEdBQWU7SUFDMUIsS0FBSyxFQUFFO1FBQ0gsTUFBTSxFQUFFLENBQU8sQ0FBQyxFQUFFLElBQTRDLEVBQUUsRUFBRTtZQUM5RCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQy9CLEtBQUssK0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFHdkIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUMsQ0FBQztvQkFDN0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDMUQ7Z0JBQ0QsS0FBSywrQkFBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwQixPQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztpQkFDdEM7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7b0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUM7aUJBQ2pDO2FBQ0o7UUFDTCxDQUFDO1FBRUQsT0FBTyxFQUFFLENBQU8sQ0FBQyxFQUFFLElBQXFELEVBQUUsRUFBRTtZQUN4RSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3RDLEtBQUssK0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFdkIsT0FBTyx1QkFBdUI7aUJBQ2pDO2dCQUNELEtBQUssK0JBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEIsT0FBTyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sQ0FBQyxDQUFDO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO2lCQUNqQzthQUNKO1FBQ0wsQ0FBQztLQUNKO0NBQ0o7QUFFRCxrQkFBZSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FDOUN4QixrRkFBbUM7QUFFbkMsSUFBWSxjQU1YO0FBTkQsV0FBWSxjQUFjO0lBQ3hCLDJCQUFTO0lBQ1QsaUNBQWU7SUFDZixpQ0FBZTtJQUNmLG1DQUFpQjtJQUNqQiwrQkFBYTtBQUNmLENBQUMsRUFOVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQU16QjtBQUVELGtCQUFlLG1CQUFHOzs7Ozs7OztDQVFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJELDZIQUEwQztBQUMxQyw4SUFBdUQ7QUFDdkQsNkRBQWtDO0FBRWxDLE1BQU0sY0FBYyxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLHlCQUFjLENBQUMsQ0FBQztBQUNyRCxNQUFNLFlBQVksR0FBRyxrQkFBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBWSxDQUFDLENBQUM7QUFFakQsTUFBTSxTQUFTLEdBQWU7SUFDMUIsS0FBSyxFQUFFO1FBQ0gsS0FBSyxFQUFFLENBQU8sTUFBTSxFQUFFLElBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDL0MsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNYLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN6QixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQU8sTUFBTSxFQUFFLEVBQUU7WUFDdEIsT0FBTyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDL0MsQ0FBQztLQUNKO0NBQ0o7QUFFRCxrQkFBZSxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3hCekIsa0ZBQW1DO0FBQ25DLGtCQUFlLG1CQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQ2hCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ0gsNkRBQWdDO0FBQ2hDLGtHQUEyQztBQUMzQyw2R0FBeUQ7QUFHekQ7SUFDaUIsUUFBUSxDQUFDLE1BQWM7O1lBQ2hDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtDQUNKO0FBSkQ7SUFEQyxnQkFBTyxFQUFFO2FBS1Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUkQsb0lBQWlEO0FBQ2pELDhJQUF1RDtBQUN2RCxrR0FBMkM7QUFDM0Msa0ZBQXFDO0FBQ3JDLHFGQUF1QztBQUN2Qyw2REFBa0M7QUFDbEMsNkdBQXlEO0FBRXpELE1BQU0sY0FBYyxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLHlCQUFjLENBQUM7QUFDcEQsTUFBTSxZQUFZLEdBQUcsa0JBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVksQ0FBQztBQUNoRCxNQUFNLFdBQVcsR0FBRyxrQkFBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBVyxDQUFDO0FBQzlDLE1BQU0sWUFBWSxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFZLENBQUM7QUFFaEQsTUFBTSxTQUFTLEdBQWU7SUFDMUIsS0FBSyxFQUFFO1FBQ0gsS0FBSyxFQUFFLENBQU8sQ0FBQyxFQUFFLElBQW9CLEVBQUUsRUFBRTtZQUNyQyxPQUFPO2dCQUNILEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRTtnQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2FBQ2xCO1FBQ0wsQ0FBQztLQUNKO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsS0FBSyxFQUFFLENBQUMsTUFBc0IsRUFBRSxFQUFFO1lBQzlCLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3RDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQU8sTUFBc0IsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sNkJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQ0o7Q0FDSjtBQUVELGtCQUFlLFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQ2hEeEIsa0ZBQW1DO0FBU25DLGtCQUFlLG1CQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQ2pCOzs7Ozs7Ozs7Ozs7Ozs7QUN6Q0QsaUdBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFlO0lBQzFCLElBQUksRUFBRTtRQUNGLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNmLE9BQU8sR0FBRyx3QkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUN4RixDQUFDO0tBQ0o7Q0FDSjtBQUVELGtCQUFlLFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQ1h4QixrRkFBbUM7QUFDbkMsa0JBQWUsbUJBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBc0NoQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNILDZEQUFnQztBQUNoQyxrR0FBMkM7QUFDM0MsNkdBQXlEO0FBR3pEO0lBQ2lCLFFBQVEsQ0FBQyxNQUFjOztZQUNoQyxPQUFPLDZCQUFhLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7Q0FDSjtBQUpEO0lBREMsZ0JBQU8sRUFBRTthQUtUOzs7Ozs7Ozs7Ozs7Ozs7O0FDVEQsc0dBQXdEO0FBQS9DLGtIQUFPLE9BQWU7QUFDL0IsbUdBQXNEO0FBQTdDLGdIQUFPLE9BQWM7QUFDOUIseUdBQTBEO0FBQWpELG9IQUFPLE9BQWdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGaEMsa0ZBQTZDO0FBSzdDLGdFQUF5QjtBQUN6QiwyR0FBc0M7QUFDdEMsMEhBQStDO0FBQy9DLDZIQUFrRDtBQUtsRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxtQkFBTyxDQUFDLDRCQUFXLENBQUMsQ0FBQyxZQUFZLEVBQUMsQ0FBQztBQUV0RSxTQUFlLFNBQVM7O1FBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtZQUd2RSxnQkFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQztTQUVoRDtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksNEJBQVksQ0FBQztZQUM1QixRQUFRLEVBQUUscUJBQVU7WUFDcEIsU0FBUyxFQUFFLHNCQUFZO1NBQzFCLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1lBQy9DLGdCQUFNLENBQUMsSUFBSSxDQUFFLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLGdCQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFFMUQsSUFBRyxJQUFVLEVBQUU7Z0JBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7YUFDOUQ7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FBQTtBQUVELFNBQVMsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q1osMEdBQThDO0FBRWpDLGNBQU0sR0FBRyxJQUFJLDhCQUFNLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZsQyxpRkFBNkI7QUFFN0IsTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxZQUFZLENBQUM7SUFDaEMsTUFBTSxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtJQUM3QixLQUFLLEVBQUUsT0FBTztJQUNkLFVBQVUsRUFBRTtRQUNSLElBQUksaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ2xHLElBQUksaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQztLQUN2RjtDQUNKLENBQUM7QUFFRixJQUFJLElBQXFDLEVBQUU7SUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FDTixJQUFJLGlCQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUMzQixNQUFNLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0tBQ2xDLENBQUMsQ0FDTDtDQUNKO0FBRUQsa0JBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7OztBQ25CckIsU0FBZ0IsVUFBVSxDQUFDLGFBQXFELEVBQUUsUUFBb0I7SUFDbEcsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUV6QyxhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUN4QixRQUFRLEVBQUUsQ0FBQztRQUNYLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM3RyxDQUFDLENBQUM7SUFFRixPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBVEQsZ0NBU0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNURCw0R0FBdUM7QUFFdkMsTUFBTSxhQUFhLEdBQUcsd0NBQXdDO0FBQzlELE1BQU0sWUFBWSxHQUFHLEdBQUc7QUFDeEIsTUFBTSxZQUFZLEdBQUcsSUFBSTtBQUN6QixNQUFNLFdBQVcsR0FBRyxDQUFDO0FBRXJCLE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBVyxFQUFFLEdBQVcsRUFBRSxFQUFFO0lBQ2hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRztBQUNoRCxDQUFDO0FBRUQsU0FBc0IsYUFBYSxDQUMvQixFQUFvQixFQUNwQixVQUFrQixXQUFXLEVBQzdCLFdBQW1CLGNBQWMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDOztRQUU3RCxJQUFJO1lBQ0EsT0FBTyxNQUFNLEVBQUUsRUFBRTtTQUNwQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25ELE9BQU8sYUFBYSxDQUFDLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDdEQ7aUJBQU07Z0JBQ0gsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQzthQUNqQztTQUNKO0lBQ0wsQ0FBQztDQUFBO0FBaEJELHNDQWdCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNCRCw0Qzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSxpRDs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSwyQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxzQzs7Ozs7Ozs7Ozs7QUNBQSxvQyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiN2IwMTJiNzdmMTdjN2I0NTVkNjlcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0XCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCJcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdFx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRcdGxvZ0ZuKG1zZyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRpZiAobGV2ZWwgPT09IFwiaW5mb1wiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwid2FybmluZ1wiKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuLyogZXNsaW50LWVuYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cblxubW9kdWxlLmV4cG9ydHMuZ3JvdXAgPSBsb2dHcm91cChncm91cCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwQ29sbGFwc2VkID0gbG9nR3JvdXAoZ3JvdXBDb2xsYXBzZWQpO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cEVuZCA9IGxvZ0dyb3VwKGdyb3VwRW5kKTtcblxubW9kdWxlLmV4cG9ydHMuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbihsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc3RhY2s7XG5cdH1cbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsImltcG9ydCB7IEdyYXBoUUxTY2FsYXJUeXBlLCBLaW5kIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50J1xuXG5jb25zdCBFUE9DSF9NQVggPSA5OTk5OTk5OTk5XG5jb25zdCBEQVRFX1JFR0VYUCA9IC8oXFxkXFxkXFxkXFxkKVstXT8oXFxkXFxkKVstXT8oXFxkXFxkKS9cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZTogc3RyaW5nIHwgYW55KSB7XG4gICAgaWYgKHR5cGVvZiBkYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gWy4uLihkYXRlLm1hdGNoKERBVEVfUkVHRVhQKSB8fCBbXSldLnNsaWNlKDEpLmpvaW4oJy0nKVxuICAgIH1cblxuICAgIHJldHVybiBkYXRlXG59XG5cbmV4cG9ydCB0eXBlIERhdGVUaW1lID0gYW55XG5leHBvcnQgdHlwZSBEYXRlID0gYW55XG5leHBvcnQgdHlwZSBUaW1lID0gYW55XG5cbmV4cG9ydCBjb25zdCBEYXRlU2NhbGFyID0gbmV3IEdyYXBoUUxTY2FsYXJUeXBlKHtcbiAgICBkZXNjcmlwdGlvbjogJ0RhdGUgaW4gSVNPIDg2MDEgZm9ybWF0LCBpLmUuIFlZWVktTU0tREQnLFxuICAgIG5hbWU6ICdEYXRlJyxcbiAgICBwYXJzZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChmb3JtYXREYXRlKHZhbHVlKSkudG9EYXRlKClcbiAgICB9LFxuICAgIHNlcmlhbGl6ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQoZm9ybWF0RGF0ZSh2YWx1ZSkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4gICAgfSxcbiAgICBwYXJzZUxpdGVyYWwoYXN0OiBhbnkpIHtcbiAgICAgICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudChmb3JtYXREYXRlKGFzdC52YWx1ZSkpLnRvRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxufSlcblxuZXhwb3J0IGNvbnN0IERhdGVUaW1lU2NhbGFyID0gbmV3IEdyYXBoUUxTY2FsYXJUeXBlKHtcbiAgICBkZXNjcmlwdGlvbjogJ0RhdGUgYW5kIHRpbWUgaW4gSVNPIDg2MDEgZm9ybWF0LCBpLmUuIFlZWVktTU0tRERUSEg6bW06c3Muc3NzWicsXG4gICAgbmFtZTogJ0lTT0RhdGVUaW1lJyxcbiAgICBwYXJzZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudG9EYXRlKClcbiAgICB9LFxuICAgIHNlcmlhbGl6ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIDogdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWx1ZSA8IEVQT0NIX01BWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsdWUgLyAxMDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAudXRjKClcbiAgICAgICAgICAgICAgICAudG9JU09TdHJpbmcoKVxuICAgICAgICB9XG4gICAgfSxcbiAgICBwYXJzZUxpdGVyYWwoYXN0OiBhbnkpIHtcbiAgICAgICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudChhc3QudmFsdWUpLnRvRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxufSlcblxuZXhwb3J0IGNvbnN0IFRpbWVTY2FsYXIgPSBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICAgIGRlc2NyaXB0aW9uOiAnSG91cnMgYW5kIG1pbnV0ZXMgaW4gSVNPIDg2MDEgZm9ybWF0IEhIOm1tJyxcbiAgICBuYW1lOiAnVGltZScsXG4gICAgcGFyc2VWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQodmFsdWUsICdISDptbScpLmZvcm1hdCgnSEg6bW0nKVxuICAgIH0sXG4gICAgc2VyaWFsaXplKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSwgJ0hIOm1tJykuZm9ybWF0KCdISDptbScpXG4gICAgfSxcbiAgICBwYXJzZUxpdGVyYWwoYXN0OiBhbnkpIHtcbiAgICAgICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudChhc3QudmFsdWUsICdISDptbScpLmZvcm1hdCgnSEg6bW0nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSxcbn0pXG4iLCJpbXBvcnQgeyBJUmVzb2x2ZXJzIH0gZnJvbSAnZ3JhcGhxbC10b29scydcbmltcG9ydCB7IERhdGVTY2FsYXIsIERhdGVUaW1lU2NhbGFyLCBUaW1lU2NhbGFyIH0gZnJvbSAnLi9EYXRlU2NhbGFycydcbmltcG9ydCBjb21wYW55UmVzb2x2ZXIgZnJvbSAnLi9jb21wYW55L0NvbXBhbnkucmVzb2x2ZXInXG5pbXBvcnQgZnhSZXNvbHZlciBmcm9tICcuL2Z4L0Z4LnJlc29sdmVyJ1xuaW1wb3J0IG5ld1Jlc29sdmVyIGZyb20gJy4vbmV3cy9OZXdzLnJlc29sdmVyJ1xuaW1wb3J0IHF1b3RlUmVzb2x2ZXIgZnJvbSAnLi9xdW90ZS9RdW90ZS5yZXNvbHZlcidcbmltcG9ydCByZWZSZXNvbHZlciBmcm9tICcuL3JlZi1kYXRhL1JlZkRhdGEucmVzb2x2ZXInXG5pbXBvcnQgc3RvY2tSZXNvbHZlciBmcm9tICcuL3N0b2NrL1N0b2NrLnJlc29sdmVyJ1xuaW1wb3J0IHRpY2tSZXNvbHZlciBmcm9tICcuL3RpY2svVGljay5yZXNvbHZlcidcbmltcG9ydCBzdGF0c1Jlc29sdmVyIGZyb20gJy4vc3RhdHMvU3RhdHMucmVzb2x2ZXInXG5pbXBvcnQgbWVyZ2VSZXNvbHZlcnMgZnJvbSAnLi9tZXJnZVJlc29sdmVycydcblxuY29uc3Qgcm9vdFJlc29sdmVyOiBJUmVzb2x2ZXJzID0ge1xuICAgIERhdGU6IERhdGVTY2FsYXIsXG4gICAgRGF0ZVRpbWU6IERhdGVUaW1lU2NhbGFyLFxuICAgIFRpbWU6IFRpbWVTY2FsYXIsXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlUmVzb2x2ZXJzKFxuICAgIFtmeFJlc29sdmVyLCBjb21wYW55UmVzb2x2ZXIsIG5ld1Jlc29sdmVyLCBxdW90ZVJlc29sdmVyLCByZWZSZXNvbHZlciwgc3RvY2tSZXNvbHZlciwgdGlja1Jlc29sdmVyLCBzdGF0c1Jlc29sdmVyXSxcbiAgICByb290UmVzb2x2ZXIsXG4pIGFzIElSZXNvbHZlcnNcbiIsImltcG9ydCB7IGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXInXG5pbXBvcnQgY29tcGFueVNjaGVtYSBmcm9tICcuL2NvbXBhbnkvQ29tcGFueS5zY2hlbWEnXG5pbXBvcnQgZnhTY2hlbWEgZnJvbSAnLi9meC9GeC5zY2hlbWEnXG5pbXBvcnQgbmV3c1NjaGVtYSBmcm9tICcuL25ld3MvTmV3cy5zY2hlbWEnXG5pbXBvcnQgcXVvdGVTY2hlbWEgZnJvbSAnLi9xdW90ZS9RdW90ZS5zY2hlbWEnXG5pbXBvcnQgcmVmU2NoZW1hIGZyb20gJy4vcmVmLWRhdGEvUmVmRGF0YS5zY2hlbWEnXG5pbXBvcnQgdGlja1NjaGVtYSBmcm9tICcuL3RpY2svVGljay5zY2hlbWEnXG5pbXBvcnQgc3RvY2tTY2hlbWEgZnJvbSAnLi9zdG9jay9TdG9jay5zY2hlbWEnXG5pbXBvcnQgc3RhdHNTY2hlbWEgZnJvbSAnLi9zdGF0cy9TdGF0cy5zY2hlbWEnXG5cbmNvbnN0IGJhc2VTY2hlbWEgPSBncWxgXG4gIHNjYWxhciBUaW1lXG4gIHNjYWxhciBEYXRlXG4gIHNjYWxhciBEYXRlVGltZVxuICBzY2FsYXIgSVNPRGF0ZVRpbWVcblxuICB0eXBlIFF1ZXJ5IHtcbiAgICBjb21wYW55KGlkOiBTdHJpbmchKTogQ29tcGFueSFcbiAgICBxdW90ZShpZDogSUQgPSBcIlwiKTogUXVvdGUhXG4gICAgbWFya2V0czogW1F1b3RlIV0hXG4gICAgZ2V0UHJpY2VIaXN0b3J5KGlkOiBTdHJpbmchKTogW0Z4UHJpY2luZyFdIVxuICAgIG5ld3MoaWQ6IElEID0gXCJcIiwgbGFzdDogSW50ID0gMCk6IFtOZXdzIV0hXG4gICAgc3ltYm9sKG1hcmtldDogU3RyaW5nISwgaWQ6IFN0cmluZyEpOiBTZWFyY2hSZXN1bHQhXG4gICAgc3ltYm9scyh0ZXh0OiBTdHJpbmchLCBtYXJrZXRTZWdtZW50OiBNYXJrZXRTZWdtZW50ISk6IFtTZWFyY2hSZXN1bHQhXSFcbiAgICBzdGF0cyhpZDogU3RyaW5nISk6IFN0YXRzIVxuICAgIHN0b2NrKGlkOiBJRCA9IFwiXCIpOiBTdG9jayFcbiAgICBzZWFyY2godGV4dDogU3RyaW5nISk6IFtTZWFyY2hSZXN1bHQhXSFcbiAgfVxuXG4gIHR5cGUgU3Vic2NyaXB0aW9uIHtcbiAgICBnZXRRdW90ZXMoc3ltYm9sczogW1N0cmluZyFdISk6IFF1b3RlIVxuICAgIGdldEludHJhZGF5UHJpY2VzKHN5bWJvbDogU3RyaW5nISk6IFtJbnRyYWRheSFdIVxuICAgIGdldEZYUHJpY2VVcGRhdGVzKGlkOiBTdHJpbmchKTogRnhSYXRlIVxuICB9XG5gXG5cbmV4cG9ydCBkZWZhdWx0IFtcbiAgICBiYXNlU2NoZW1hLFxuICAgIGNvbXBhbnlTY2hlbWEsXG4gICAgZnhTY2hlbWEsXG4gICAgbmV3c1NjaGVtYSxcbiAgICBxdW90ZVNjaGVtYSxcbiAgICByZWZTY2hlbWEsXG4gICAgdGlja1NjaGVtYSxcbiAgICBzdG9ja1NjaGVtYSxcbiAgICBzdGF0c1NjaGVtYSxcbl1cbiIsImltcG9ydCBDb21wYW55U2VydmljZSBmcm9tICcuL0NvbXBhbnkuc2VydmljZSdcbmltcG9ydCB7IElSZXNvbHZlcnMgfSBmcm9tICdncmFwaHFsLXRvb2xzJ1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAndHlwZWRpJ1xuXG5jb25zdCBjb21wYW55U2VydmljZSA9IENvbnRhaW5lci5nZXQoQ29tcGFueVNlcnZpY2UpXG5cbmNvbnN0IHJlc29sdmVyczogSVJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBjb21wYW55OiBhc3luYyAoXywgYXJnczogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb21wYW55U2VydmljZS5nZXRDb21wYW55KGFyZ3MuaWQpXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBDb21wYW55OiB7XG4gICAgICAgIGlkOiBwYXJlbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5zeW1ib2xcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogcGFyZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuY29tcGFueU5hbWVcbiAgICAgICAgfSxcbiAgICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCByZXNvbHZlcnNcbiIsImltcG9ydCB7IGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXInXG5leHBvcnQgZGVmYXVsdCBncWxgXG4gICAgdHlwZSBDb21wYW55IHtcbiAgICAgICAgaWQ6IElEIVxuICAgICAgICBuYW1lOiBTdHJpbmdcbiAgICAgICAgc3ltYm9sOiBTdHJpbmchXG4gICAgICAgIGV4Y2hhbmdlOiBTdHJpbmdcbiAgICAgICAgaW5kdXN0cnk6IFN0cmluZ1xuICAgICAgICB3ZWJzaXRlOiBTdHJpbmdcbiAgICAgICAgZGVzY3JpcHRpb246IFN0cmluZ1xuICAgICAgICBDRU86IFN0cmluZ1xuICAgICAgICBpc3N1ZVR5cGU6IFN0cmluZ1xuICAgICAgICBzZWN0b3I6IFN0cmluZ1xuICAgIH1cbiBgOyIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICd0eXBlZGknXG5pbXBvcnQgKiBhcyBpZXggZnJvbSAnaWV4Y2xvdWRfYXBpX3dyYXBwZXInXG5pbXBvcnQgeyBxdWVyeVJlc29sdmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcXVlcnlSZXNvbHZlcidcblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHB1YmxpYyBhc3luYyBnZXRDb21wYW55KHN5bWJvbDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IGlleC5jb21wYW55KHN5bWJvbCkpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVJlc29sdmVycyB9IGZyb20gJ2dyYXBocWwtdG9vbHMnXG5pbXBvcnQgRnhTZXJ2aWNlIGZyb20gJy4vRnguc2VydmljZSdcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJ3R5cGVkaSdcbmltcG9ydCB7IHB1YnN1YiB9IGZyb20gJy4uLy4uL3B1YnN1YidcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vLi4vc2VydmljZXMvbG9nZ2VyJ1xuaW1wb3J0IHsgd2l0aENhbmNlbCB9IGZyb20gJy4uLy4uL3V0aWxzL2FzeW5jSXRlcmF0b3JVdGlscydcblxuY29uc3QgZnhTZXJ2aWNlID0gQ29udGFpbmVyLmdldChGeFNlcnZpY2UpXG5cbmNvbnN0IHJlc29sdmVyczogSVJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBnZXRQcmljZUhpc3Rvcnk6IGFzeW5jIChfLCBhcmdzOiB7IGlkOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZ4U2VydmljZS5nZXRQcmljZUhpc3RvcnkoYXJncy5pZClcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFN1YnNjcmlwdGlvbjoge1xuICAgICAgICBnZXRGWFByaWNlVXBkYXRlczoge1xuICAgICAgICAgICAgc3Vic2NyaWJlOiAoXywgYXJnczogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFN1YnNjcmliZSBGWCB1cGRhdGVzIGZvciAke2FyZ3MuaWR9YClcblxuICAgICAgICAgICAgICAgIGZ4U2VydmljZS5zdWJzY3JpYmVQcmljZVVwZGF0ZXMoYXJncy5pZClcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwdWJzdWIuYXN5bmNJdGVyYXRvcihgRlhfQ1VSUkVOVF9QUklDSU5HLiR7YXJncy5pZH1gKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpdGhDYW5jZWwocmVzdWx0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgVW5zdWJzY3JpYmUgRlggdXBkYXRlcyBmb3IgJHthcmdzLmlkfWApXG4gICAgICAgICAgICAgICAgICAgIGZ4U2VydmljZS51bnN1YnNjcmliZVByaWNlVXBkYXRlcygpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVzb2x2ZXJzXG4iLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyJ1xuZXhwb3J0IGRlZmF1bHQgZ3FsYFxuICB0eXBlIEZ4Q3VycmVuY2llcyB7XG4gICAgY29kZTogSUQhXG4gICAgbmFtZTogU3RyaW5nIVxuICB9XG5cbiAgdHlwZSBGeFN5bWJvbCB7XG4gICAgaWQ6IFN0cmluZyFcbiAgfVxuXG4gIHR5cGUgRnhQcmljaW5nIHtcbiAgICBQYWlyOiBGeFN5bWJvbCFcbiAgICBhc2s6IEZsb2F0IVxuICAgIGJpZDogRmxvYXQhXG4gICAgY3JlYXRpb25UaW1lc3RhbXA6IEZsb2F0IVxuICAgIG1pZDogRmxvYXQhXG4gICAgdmFsdWVEYXRlOiBJU09EYXRlVGltZSFcbiAgfVxuXG4gIHR5cGUgRnhSYXRlIHtcbiAgICBTeW1ib2w6IEZ4U3ltYm9sIVxuICAgIEJpZDogRmxvYXRcbiAgICBBc2s6IEZsb2F0XG4gICAgTWlkOiBGbG9hdFxuICAgIFZhbHVlRGF0ZTogSVNPRGF0ZVRpbWVcbiAgICBDcmVhdGlvblRpbWVzdGFtcDogRmxvYXRcbiAgfVxuXG4gIHR5cGUgRnhTeW1ib2xzIHtcbiAgICBjdXJyZW5jaWVzOiBbRnhDdXJyZW5jaWVzIV0hXG4gICAgcGFpcnM6IFtGeFN5bWJvbCFdIVxuICB9XG5gXG4iLCJpbXBvcnQgeyBSeFN0b21wLCBSeFN0b21wUlBDIH0gZnJvbSAnQHN0b21wL3J4LXN0b21wJ1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IG1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAndHlwZWRpJ1xuaW1wb3J0IGRhdGEgZnJvbSAnLi4vLi4vbW9jay1kYXRhL2N1cnJlbmN5U3ltYm9scy5qc29uJ1xuaW1wb3J0IHsgcHVic3ViIH0gZnJvbSAnLi4vLi4vcHVic3ViJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2dnZXInXG5pbXBvcnQgeyBNYXJrZXRTZWdtZW50cyB9IGZyb20gJy4uL3JlZi1kYXRhL1JlZkRhdGEuc2NoZW1hJ1xuaW1wb3J0IHsgU2VhcmNoUmVzdWx0U2NoZW1hIGFzIFNlYXJjaFJlc3VsdCB9IGZyb20gJy4uL3N0b2NrL1N0b2NrLnNjaGVtYSdcblxuaW50ZXJmYWNlIElTeW1ib2xEYXRhIHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgICByYXRlUHJlY2lzaW9uPzogbnVtYmVyXG4gICAgICAgIHBpcHNQb3NpdGlvbj86IG51bWJlclxuICAgICAgICBiYXNlPzogc3RyaW5nXG4gICAgICAgIHRlcm1zPzogc3RyaW5nXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSVByaWNlSGlzdG9yeSB7XG4gICAgYXNrOiBudW1iZXJcbiAgICBiaWQ6IG51bWJlclxuICAgIG1pZDogbnVtYmVyXG4gICAgY3JlYXRpb25UaW1lc3RhbXA6IG51bWJlclxuICAgIHN5bWJvbDogc3RyaW5nXG4gICAgdmFsdWVEYXRlOiBhbnlcbn1cblxuaW50ZXJmYWNlIFByaWNlVXBkYXRlcyB7XG4gICAgU3ltYm9sOiBzdHJpbmdcbiAgICBCaWQ6IG51bWJlclxuICAgIEFzazogbnVtYmVyXG4gICAgTWlkOiBudW1iZXJcbiAgICBWYWx1ZURhdGU6IGFueVxuICAgIENyZWF0aW9uVGltZXN0YW1wOiBudW1iZXJcbn1cblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHByaXZhdGUgcnhTdG9tcDogUnhTdG9tcFxuICAgIHByaXZhdGUgcnhTdG9tcFJQQzogUnhTdG9tcFJQQ1xuICAgIHByaXZhdGUgZnhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGxcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yeFN0b21wID0gbmV3IFJ4U3RvbXAoKVxuXG4gICAgICAgIHRoaXMuZnhTdWJzY3JpcHRpb24gPSBudWxsXG5cbiAgICAgICAgdGhpcy5yeFN0b21wUlBDID0gbmV3IFJ4U3RvbXBSUEModGhpcy5yeFN0b21wKVxuXG4gICAgICAgIHRoaXMucnhTdG9tcC5jb25maWd1cmUoe1xuICAgICAgICAgICAgYnJva2VyVVJMOiBgd3M6Ly93ZWItZGVtby5hZGFwdGl2ZWNsdXN0ZXIuY29tOjgwL3dzYCxcbiAgICAgICAgICAgIHJlY29ubmVjdERlbGF5OiA1MDAwLFxuICAgICAgICAgICAgaGVhcnRiZWF0SW5jb21pbmc6IDQwMDAsXG4gICAgICAgICAgICBoZWFydGJlYXRPdXRnb2luZzogNDAwMCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLnJ4U3RvbXAuYWN0aXZhdGUoKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTeW1ib2woaWQ6IHN0cmluZyk6IFNlYXJjaFJlc3VsdCB7XG4gICAgICAgIGNvbnN0IHN5bWJvbERhdGEgPSBkYXRhIGFzIElTeW1ib2xEYXRhXG4gICAgICAgIHJldHVybiB7IGlkLCBtYXJrZXRTZWdtZW50OiBNYXJrZXRTZWdtZW50cy5GWCwgLi4uc3ltYm9sRGF0YVtpZF0gfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTeW1ib2xzKGZpbHRlclRleHQ6IHN0cmluZyk6IFNlYXJjaFJlc3VsdFtdIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sRGF0YSA9IGRhdGEgYXMgSVN5bWJvbERhdGFcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN5bWJvbERhdGEpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiBrZXkuaW5jbHVkZXMoZmlsdGVyVGV4dCkgfHwgc3ltYm9sRGF0YVtrZXldLm5hbWUuaW5jbHVkZXMoZmlsdGVyVGV4dCkpXG4gICAgICAgICAgICAubWFwKGtleSA9PiAoeyBpZDoga2V5LCBtYXJrZXRTZWdtZW50OiBNYXJrZXRTZWdtZW50cy5GWCwgLi4uc3ltYm9sRGF0YVtrZXldIH0pKVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRQcmljZUhpc3RvcnkoaWQ6IHN0cmluZyk6IFByb21pc2U8SVByaWNlSGlzdG9yeVtdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ4U3RvbXBSUENcbiAgICAgICAgICAgIC5ycGMoe1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAnL2FtcS9xdWV1ZS9wcmljZUhpc3RvcnkuZ2V0UHJpY2VIaXN0b3J5JyxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBheWxvYWQ6IGAke2lkfWAsIFVzZXJuYW1lOiAnSEhBJyB9KSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAobWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKG1lc3NhZ2UuYm9keSlcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgIH1cblxuICAgIHB1YmxpYyBzdWJzY3JpYmVQcmljZVVwZGF0ZXMoaWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZ4U3Vic2NyaXB0aW9uID0gdGhpcy5yeFN0b21wUlBDXG4gICAgICAgICAgICAuc3RyZWFtKHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJy9hbXEvcXVldWUvcHJpY2luZy5nZXRQcmljZVVwZGF0ZXMnLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF5bG9hZDogeyBzeW1ib2w6IGAke2lkfWAgfSwgVXNlcm5hbWU6ICdISEEnIH0pLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcChtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobWVzc2FnZS5ib2R5KVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHRhcCgoKSA9PiBsb2dnZXIuaW5mbyhgcHJpY2UgdXBkYXRlIEZYX0NVUlJFTlRfUFJJQ0lORy4ke2lkfWApKSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHZhbHVlOiBQcmljZVVwZGF0ZXMpID0+IHtcbiAgICAgICAgICAgICAgICBwdWJzdWIucHVibGlzaChgRlhfQ1VSUkVOVF9QUklDSU5HLiR7aWR9YCwge1xuICAgICAgICAgICAgICAgICAgICBnZXRGWFByaWNlVXBkYXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmlkOiB2YWx1ZS5CaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBBc2s6IHZhbHVlLkFzayxcbiAgICAgICAgICAgICAgICAgICAgICAgIE1pZDogdmFsdWUuTWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWVEYXRlOiB2YWx1ZS5WYWx1ZURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGlvblRpbWVzdGFtcDogdmFsdWUuQ3JlYXRpb25UaW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIHVuc3Vic2NyaWJlUHJpY2VVcGRhdGVzKCkge1xuICAgICAgICB0aGlzLmZ4U3Vic2NyaXB0aW9uID8udW5zdWJzY3JpYmUoKVxuICB9XG59XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIEZ4U2VydmljZSB9IGZyb20gJy4vRnguc2VydmljZSdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRnhSZXNvbHZlciB9IGZyb20gJy4vRngucmVzb2x2ZXInXG4iLCJleHBvcnQgZGVmYXVsdCAoY3VzdG9tUmVzb2x2ZXI6IGFueSwgcm9vdFJlc29sdmVyID0ge30pID0+IHtcbiAgICBjb25zdCBtZXJnZWRSZXNvbHZlciA9IHJvb3RSZXNvbHZlciBhcyBhbnk7XG4gICAgbGV0IGtleTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGN1c3RvbVJlc29sdmVyKSkge1xuICAgICAgICBjdXN0b21SZXNvbHZlci5mb3JFYWNoKChyZXNvbHZlcikgPT4ge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gcmVzb2x2ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChyZXNvbHZlciwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZXNvbHZlcltrZXldID0geyAuLi5tZXJnZWRSZXNvbHZlcltrZXldLCAuLi5yZXNvbHZlcltrZXldIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiBjdXN0b21SZXNvbHZlcikge1xuICAgICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoY3VzdG9tUmVzb2x2ZXIsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRSZXNvbHZlcltrZXldID0geyAuLi5tZXJnZWRSZXNvbHZlcltrZXldLCAuLi5jdXN0b21SZXNvbHZlcltrZXldIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkUmVzb2x2ZXI7XG59IiwiaW1wb3J0IHsgSVJlc29sdmVycyB9IGZyb20gJ2dyYXBocWwtdG9vbHMnXG5pbXBvcnQgTmV3c1NlcnZpY2UgZnJvbSAnLi9OZXdzLnNlcnZpY2UnXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICd0eXBlZGknXG5cbmNvbnN0IG5ld3NTZXJ2aWNlID0gQ29udGFpbmVyLmdldChOZXdzU2VydmljZSlcblxuY29uc3QgcmVzb2x2ZXJzOiBJUmVzb2x2ZXJzID0ge1xuICAgIE5ld3M6IHtcbiAgICAgICAgaWQ6IHBhcmVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LnVybFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgUXVlcnk6IHtcbiAgICAgICAgbmV3czogYXN5bmMgKF8sIGFyZ3M6IHsgaWQ6IHN0cmluZzsgbGFzdDogbnVtYmVyIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChhcmdzLmxhc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3c1NlcnZpY2UuZ2V0TGF0ZXN0TmV3cyhhcmdzLmlkLCBhcmdzLmxhc3QpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdzU2VydmljZS5nZXROZXdzKGFyZ3MuaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVzb2x2ZXJzXG4iLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyJ1xuZXhwb3J0IGRlZmF1bHQgZ3FsYFxuICAgIHR5cGUgTmV3cyB7XG4gICAgICAgIGlkOiBJRCFcbiAgICAgICAgZGF0ZXRpbWU6IElTT0RhdGVUaW1lIVxuICAgICAgICBoZWFkbGluZTogU3RyaW5nIVxuICAgICAgICBzb3VyY2U6IFN0cmluZyFcbiAgICAgICAgdXJsOiBTdHJpbmchXG4gICAgICAgIHN1bW1hcnk6IFN0cmluZyFcbiAgICAgICAgcmVsYXRlZDogU3RyaW5nIVxuICAgIH1cbiBgOyIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICd0eXBlZGknXG5pbXBvcnQgKiBhcyBpZXggZnJvbSAnaWV4Y2xvdWRfYXBpX3dyYXBwZXInXG5pbXBvcnQgeyBxdWVyeVJlc29sdmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcXVlcnlSZXNvbHZlcidcblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHB1YmxpYyBhc3luYyBnZXROZXdzKHN5bWJvbDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBpZXgubmV3cyhzeW1ib2wpXG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBnZXRMYXRlc3ROZXdzKHN5bWJvbDogc3RyaW5nLCBsYXN0OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5UmVzb2x2ZXIoKCkgPT4gaWV4Lm5ld3Moc3ltYm9sLCBsYXN0KSlcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJUmVzb2x2ZXJzIH0gZnJvbSAnZ3JhcGhxbC10b29scydcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vLi4vc2VydmljZXMvbG9nZ2VyJ1xuaW1wb3J0IHsgcHVic3ViIH0gZnJvbSAnLi4vLi4vcHVic3ViJ1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAndHlwZWRpJ1xuaW1wb3J0IFF1b3RlU2VydmljZSBmcm9tICcuL1F1b3RlLnNlcnZpY2UnXG5pbXBvcnQgeyB3aXRoQ2FuY2VsIH0gZnJvbSAnLi4vLi4vdXRpbHMvYXN5bmNJdGVyYXRvclV0aWxzJ1xuaW1wb3J0IHsgcXVlcnlSZXNvbHZlciB9IGZyb20gJy4uLy4uL3V0aWxzL3F1ZXJ5UmVzb2x2ZXInXG5cbmNvbnN0IHF1b3RlU2VydmljZSA9IENvbnRhaW5lci5nZXQoUXVvdGVTZXJ2aWNlKVxuXG5jb25zdCByZXNvbHZlcnM6IElSZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgbWFya2V0czogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5UmVzb2x2ZXIoKCkgPT4gcXVvdGVTZXJ2aWNlLmdldFF1b3RlcyhbJ1NQWScsICdESUEnLCAnSVdNJ10pKVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgUXVvdGU6IHtcbiAgICAgICAgaWQ6IHBhcmVudCA9PiBwYXJlbnQuc3ltYm9sLFxuICAgIH0sXG4gICAgU3Vic2NyaXB0aW9uOiB7XG4gICAgICAgIGdldFF1b3Rlczoge1xuICAgICAgICAgICAgcmVzb2x2ZTogcGF5bG9hZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBheWxvYWQuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJzY3JpYmU6IChfLCBhcmdzOiB7IHN5bWJvbHM6IFtzdHJpbmddIH0pID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFN1YnNjcmliZSBxdW90ZSB1cGRhdGVzIGZvciAke2FyZ3Muc3ltYm9sc31gKVxuICAgICAgICAgICAgICAgIHF1b3RlU2VydmljZS5zdWJzY3JpYmVRdW90ZXMoYXJncy5zeW1ib2xzKVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHVic3ViLmFzeW5jSXRlcmF0b3IoYXJncy5zeW1ib2xzLm1hcChzeW1ib2wgPT4gcXVvdGVTZXJ2aWNlLmdldFF1b3RlVG9waWMoc3ltYm9sKSkpXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gd2l0aENhbmNlbChyZXN1bHQsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBVbnN1YnNjcmliZSBxdW90ZSB1cGRhdGVzIGZvciAke2FyZ3Muc3ltYm9sc31gKVxuICAgICAgICAgICAgICAgICAgICBxdW90ZVNlcnZpY2UudW5zdWJzY3JpYmVRdW90ZXMoYXJncy5zeW1ib2xzKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVyc1xuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcbmV4cG9ydCBkZWZhdWx0IGdxbGBcbiB0eXBlIFF1b3RlIHtcbiAgICBpZDogSUQhXG4gICAgc3ltYm9sOiBTdHJpbmchXG4gICAgY29tcGFueTogQ29tcGFueVxuICAgIGNvbXBhbnlOYW1lOiBTdHJpbmdcbiAgICBjYWxjdWxhdGlvblByaWNlOiBTdHJpbmdcbiAgICBvcGVuOiBGbG9hdFxuICAgIG9wZW5UaW1lOiBJU09EYXRlVGltZVxuICAgIGNsb3NlOiBGbG9hdFxuICAgIGNsb3NlVGltZTogSVNPRGF0ZVRpbWVcbiAgICBoaWdoOiBGbG9hdFxuICAgIGxvdzogRmxvYXRcbiAgICBsYXRlc3RQcmljZTogRmxvYXRcbiAgICBsYXRlc3RTb3VyY2U6IFN0cmluZ1xuICAgIGxhdGVzdFRpbWU6IFRpbWVcbiAgICBsYXRlc3RVcGRhdGU6IElTT0RhdGVUaW1lXG4gICAgbGF0ZXN0Vm9sdW1lOiBGbG9hdFxuICAgIGlleFJlYWx0aW1lUHJpY2U6IEZsb2F0XG4gICAgaWV4UmVhbHRpbWVTaXplOiBJbnRcbiAgICBpZXhMYXN0VXBkYXRlZDogSVNPRGF0ZVRpbWVcbiAgICBkZWxheWVkUHJpY2U6IEZsb2F0XG4gICAgZGVsYXllZFByaWNlVGltZTogSVNPRGF0ZVRpbWVcbiAgICBwcmV2aW91c0Nsb3NlOiBGbG9hdFxuICAgIGNoYW5nZTogRmxvYXRcbiAgICBjaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgIGlleE1hcmtldFBlcmNlbnQ6IEZsb2F0XG4gICAgaWV4Vm9sdW1lOiBJbnRcbiAgICBhdmdUb3RhbFZvbHVtZTogSW50XG4gICAgaWV4QmlkUHJpY2U6IEZsb2F0XG4gICAgaWV4QmlkU2l6ZTogSW50XG4gICAgaWV4QXNrUHJpY2U6IEZsb2F0XG4gICAgaWV4QXNrU2l6ZTogSW50XG4gICAgbWFya2V0Q2FwOiBGbG9hdFxuICAgIHBlUmF0aW86IEZsb2F0XG4gICAgd2VlazUySGlnaDogRmxvYXRcbiAgICB3ZWVrNTJMb3c6IEZsb2F0XG4gICAgeXRkQ2hhbmdlOiBGbG9hdFxuICB9XG4gYDsiLCJpbXBvcnQgeyBRdW90ZSB9IGZyb20gJ2lleGNsb3VkX2FwaV93cmFwcGVyJ1xuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJ3R5cGVkaSdcbmltcG9ydCAqIGFzIGlleCBmcm9tICdpZXhjbG91ZF9hcGlfd3JhcHBlcidcbmltcG9ydCB7IElJZXhCYXRjaFF1b3RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBTdWJqZWN0LCBORVZFUiwgdGltZXIgfSBmcm9tICdyeGpzJ1xuaW1wb3J0IHsgc3dpdGNoTWFwLCBmbGF0TWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcbmltcG9ydCB7IHB1YnN1YiB9IGZyb20gJy4uLy4uL3B1YnN1YidcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi4vLi4vc2VydmljZXMvbG9nZ2VyJ1xuaW1wb3J0IHsgcXVlcnlSZXNvbHZlciB9IGZyb20gJy4uLy4uL3V0aWxzL3F1ZXJ5UmVzb2x2ZXInXG5cbmludGVyZmFjZSBJTWFya2V0U3Vic2NyaXB0aW9uIHtcbiAgICBbc3ltYm9sOiBzdHJpbmddOiB7XG4gICAgICAgIGxpc3RlbmVyQ291bnQ6IG51bWJlclxuICAgIH1cbn1cblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHByaXZhdGUgY3VycmVudFN5bWJvbHM6IElNYXJrZXRTdWJzY3JpcHRpb24gPSB7fVxuICAgIHByaXZhdGUgc3ViamVjdCA9IG5ldyBTdWJqZWN0PHN0cmluZ1tdPigpXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdWJqZWN0XG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbHMgPT4gKHN5bWJvbHMubGVuZ3RoID4gMCA/IHRpbWVyKDUwMCwgMzAwMCkgOiBORVZFUiksXG4gICAgICAgICAgICAgICAgICAgIChzeW1ib2xzLCBfKSA9PiBzeW1ib2xzLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgdGFwKHN5bWJvbHMgPT4gbG9nZ2VyLmRlYnVnKGBHZXQgcXVvdGVzIGZyb20gSUVYIENsb3VkIGZvciAke3N5bWJvbHN9YCkpLFxuICAgICAgICAgICAgICAgIGZsYXRNYXAoc3ltYm9scyA9PiB0aGlzLmdldFF1b3RlcyhzeW1ib2xzKSksXG4gICAgICAgICAgICAgICAgZmxhdE1hcChxdW90ZXMgPT4gcXVvdGVzKSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgICAgIG5leHQ6IHF1b3RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBQdWJsaXNoaW5nIHF1b3RlIGZvciAke3RoaXMuZ2V0UXVvdGVUb3BpYyhxdW90ZS5zeW1ib2wpfTogJHtxdW90ZS5sYXRlc3RQcmljZX1gKVxuICAgICAgICAgICAgICAgICAgICBwdWJzdWIucHVibGlzaCh0aGlzLmdldFF1b3RlVG9waWMocXVvdGUuc3ltYm9sKSwgcXVvdGUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyID0+IGxvZ2dlci5lcnJvcihgR2V0IHF1b3RlcyBlcnJvcjogJHtlcnJ9YCksXG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRRdW90ZShzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8UXVvdGU+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBpZXgucXVvdGUoc3ltYm9sKSkgYXMgUXVvdGVcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0UXVvdGVzKHN5bWJvbHM6IHN0cmluZ1tdKTogUHJvbWlzZTxRdW90ZVtdPiB7XG4gICAgICAgIGNvbnN0IGJhdGNoUXVvdGVzOiBJSWV4QmF0Y2hRdW90ZSA9IGF3YWl0IHF1ZXJ5UmVzb2x2ZXIoKCkgPT5cbiAgICAgICAgICAgIGlleC5pZXhBcGlSZXF1ZXN0KGAvc3RvY2svbWFya2V0L2JhdGNoP3N5bWJvbHM9JHtzeW1ib2xzLmpvaW4oJywnKX0mdHlwZXM9cXVvdGVgKSxcbiAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiBzeW1ib2xzLm1hcChzeW1ib2wgPT4gYmF0Y2hRdW90ZXNbc3ltYm9sXS5xdW90ZSlcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UXVvdGVUb3BpYyA9IChzeW1ib2w6IHN0cmluZykgPT4gYE1BUktFVF9VUERBVEUuJHtzeW1ib2x9YFxuXG4gICAgcHVibGljIHVuc3Vic2NyaWJlUXVvdGVzKHN5bWJvbHM6IHN0cmluZ1tdKSB7XG4gICAgICAgIHN5bWJvbHMuZm9yRWFjaChzeW1ib2wgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFN5bWJvbHNbc3ltYm9sXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN5bWJvbHNbc3ltYm9sXS5saXN0ZW5lckNvdW50LS1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFN5bWJvbHNbc3ltYm9sXS5saXN0ZW5lckNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRTeW1ib2xzW3N5bWJvbF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoT2JqZWN0LmtleXModGhpcy5jdXJyZW50U3ltYm9scykpXG4gICAgfVxuXG4gICAgcHVibGljIHN1YnNjcmliZVF1b3RlcyhzeW1ib2xzOiBzdHJpbmdbXSkge1xuICAgICAgICBzeW1ib2xzLmZvckVhY2goc3ltYm9sID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTeW1ib2xzW3N5bWJvbF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTeW1ib2xzW3N5bWJvbF0ubGlzdGVuZXJDb3VudCsrXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN5bWJvbHNbc3ltYm9sXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJDb3VudDogMSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoT2JqZWN0LmtleXModGhpcy5jdXJyZW50U3ltYm9scykpXG4gICAgfVxufVxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBRdW90ZVNlcnZpY2UgfSBmcm9tICcuL1F1b3RlLnNlcnZpY2UnXG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1b3RlU2NoZW1hIH0gZnJvbSAnLi9RdW90ZS5zY2hlbWEnXG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1b3RlUmVzb2x2ZXIgfSBmcm9tICcuL1F1b3RlLnJlc29sdmVyJ1xuIiwiaW1wb3J0IHsgSVJlc29sdmVycyB9IGZyb20gJ2dyYXBocWwtdG9vbHMnXG4vL2ltcG9ydCBzZWFyY2ggZnJvbSAnLi4vLi4vc2VydmljZXMvc2VhcmNoSW5kZXgnO1xuaW1wb3J0IHsgRnhTZXJ2aWNlIH0gZnJvbSAnLi4vZngnO1xuXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICd0eXBlZGknO1xuaW1wb3J0IHsgTWFya2V0U2VnbWVudHMgfSBmcm9tICcuL1JlZkRhdGEuc2NoZW1hJztcblxuXG5jb25zdCBmeFNlcnZpY2UgPSBDb250YWluZXIuZ2V0KEZ4U2VydmljZSk7XG5cbmNvbnN0IHJlc29sdmVyczogSVJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBzeW1ib2w6IGFzeW5jIChfLCBhcmdzOiB7IGlkOiBzdHJpbmc7IG1hcmtldDogTWFya2V0U2VnbWVudHMgfSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChhcmdzLm1hcmtldC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBNYXJrZXRTZWdtZW50cy5TVE9DSzoge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnN0IHJlc3VsdHMgPSBzZWFyY2goYXJncy5pZClcbiAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBmb3IgZGVidWdnaW5nIGFsb25lXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbe2lkOiBcInRlc3QxXCJ9LCB7aWQ6IFwidGVzdDJcIn0sIHtpZDogXCJ0ZXN0M1wifV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMuZmluZChzID0+IHMuaWQgPT0gYXJncy5pZCkgfHwgcmVzdWx0c1swXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIE1hcmtldFNlZ21lbnRzLkZYOiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmeFNlcnZpY2UuZ2V0U3ltYm9sKGFyZ3MuaWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZGApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN5bWJvbHM6IGFzeW5jIChfLCBhcmdzOiB7IHRleHQ6IHN0cmluZzsgbWFya2V0U2VnbWVudDogTWFya2V0U2VnbWVudHMgfSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChhcmdzLm1hcmtldFNlZ21lbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTWFya2V0U2VnbWVudHMuU1RPQ0s6IHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gc2VhcmNoKGFyZ3MudGV4dClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSVRFTVMgU0VBUkNIIERFQlVHR0VSXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBNYXJrZXRTZWdtZW50cy5GWDoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnhTZXJ2aWNlLmdldFN5bWJvbHMoYXJncy50ZXh0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWRgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCByZXNvbHZlcnMgIFxuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcblxuZXhwb3J0IGVudW0gTWFya2V0U2VnbWVudHMge1xuICBGWCA9ICdmeCcsXG4gIFNUT0NLID0gJ3N0b2NrJyxcbiAgSU5ERVggPSAnaW5kZXgnLFxuICBGVVRVUkUgPSAnZnV0dXJlJyxcbiAgQk9ORCA9ICdib25kJyxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ3FsYFxuICBlbnVtIE1hcmtldFNlZ21lbnQge1xuICAgIEZYXG4gICAgU1RPQ0tcbiAgICBJTkRFWFxuICAgIEZVVFVSRVxuICAgIEJPTkRcbiAgfVxuYFxuIiwiaW1wb3J0IHsgSVJlc29sdmVycyB9IGZyb20gJ2dyYXBocWwtdG9vbHMnO1xuaW1wb3J0IFN0YXRzU2VydmljZSBmcm9tICcuL1N0YXRzLnNlcnZpY2UnXG5pbXBvcnQgQ29tcGFueVNlcnZpY2UgZnJvbSAnLi4vY29tcGFueS9Db21wYW55LnNlcnZpY2UnXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICd0eXBlZGknXG5cbmNvbnN0IGNvbXBhbnlTZXJ2aWNlID0gQ29udGFpbmVyLmdldChDb21wYW55U2VydmljZSk7XG5jb25zdCBzdGF0c1NlcnZpY2UgPSBDb250YWluZXIuZ2V0KFN0YXRzU2VydmljZSk7XG5cbmNvbnN0IHJlc29sdmVyczogSVJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBzdGF0czogYXN5bmMgKHBhcmVudCwgYXJnczogeyBpZDogc3RyaW5nIH0sIGN0eCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRzU2VydmljZS5nZXRTdGF0cyhhcmdzLmlkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgU3RhdHM6IHtcbiAgICAgICAgaWQ6IChwYXJlbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuc3ltYm9sO1xuICAgICAgICB9LFxuICAgICAgICBjb21wYW55OiBhc3luYyAocGFyZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29tcGFueVNlcnZpY2UuZ2V0Q29tcGFueShwYXJlbnQuaWQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVyczsiLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyJ1xuZXhwb3J0IGRlZmF1bHQgZ3FsYFxuICAgIHR5cGUgU3RhdHMge1xuICAgICAgICBpZDogSUQhXG4gICAgICAgIHN5bWJvbDogU3RyaW5nIVxuICAgICAgICBjb21wYW55OiBDb21wYW55XG4gICAgICAgIGNvbXBhbnlOYW1lOiBTdHJpbmdcbiAgICAgICAgbWFya2V0Y2FwOiBGbG9hdFxuICAgICAgICB3ZWVrNTJoaWdoOiBGbG9hdFxuICAgICAgICB3ZWVrNTJsb3c6IEZsb2F0XG4gICAgICAgIHdlZWs1MmNoYW5nZTogRmxvYXRcbiAgICAgICAgc2hhcmVzT3V0c3RhbmRpbmc6IEZsb2F0XG4gICAgICAgIGZsb2F0OiBGbG9hdFxuICAgICAgICBhdmcxMFZvbHVtZTogSW50XG4gICAgICAgIGF2ZzMwVm9sdW1lOiBJbnRcbiAgICAgICAgZGF5MjAwTW92aW5nQXZnOiBGbG9hdFxuICAgICAgICBkYXk1ME1vdmluZ0F2ZzogRmxvYXRcbiAgICAgICAgZW1wbG95ZWVzOiBJbnRcbiAgICAgICAgdHRtRVBTOiBGbG9hdFxuICAgICAgICB0dG1EaXZpZGVuZFJhdGU6IEZsb2F0XG4gICAgICAgIGRpdmlkZW5kWWllbGQ6IEZsb2F0XG4gICAgICAgIG5leHREaXZpZGVuZERhdGU6IERhdGVcbiAgICAgICAgZXhEaXZpZGVuZERhdGU6IERhdGVcbiAgICAgICAgbmV4dEVhcm5pbmdzRGF0ZTogRGF0ZVxuICAgICAgICBwZVJhdGlvOiBGbG9hdFxuICAgICAgICBiZXRhOiBGbG9hdFxuICAgICAgICBtYXhDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICB5ZWFyNUNoYW5nZVBlcmNlbnQ6IEZsb2F0XG4gICAgICAgIHllYXIyQ2hhbmdlUGVyY2VudDogRmxvYXRcbiAgICAgICAgeWVhcjFDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICB5dGRDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICBtb250aDZDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICBtb250aDNDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICBtb250aDFDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgICAgICBkYXkzMENoYW5nZVBlcmNlbnQ6IEZsb2F0XG4gICAgICAgIGRheTVDaGFuZ2VQZXJjZW50OiBGbG9hdFxuICAgIH1cbiBgOyIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICd0eXBlZGknXG5pbXBvcnQgKiBhcyBpZXggZnJvbSAnaWV4Y2xvdWRfYXBpX3dyYXBwZXInXG5pbXBvcnQgeyBxdWVyeVJlc29sdmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcXVlcnlSZXNvbHZlcidcblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHB1YmxpYyBhc3luYyBnZXRTdGF0cyhzeW1ib2w6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gcXVlcnlSZXNvbHZlcigoKSA9PiBpZXgua2V5U3RhdHMoc3ltYm9sKSlcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJUmVzb2x2ZXJzIH0gZnJvbSAnZ3JhcGhxbC10b29scydcbmltcG9ydCBTdGF0c1NlcnZpY2UgZnJvbSAnLi4vc3RhdHMvU3RhdHMuc2VydmljZSdcbmltcG9ydCBDb21wYW55U2VydmljZSBmcm9tICcuLi9jb21wYW55L0NvbXBhbnkuc2VydmljZSdcbmltcG9ydCAqIGFzIGlleCBmcm9tICdpZXhjbG91ZF9hcGlfd3JhcHBlcidcbmltcG9ydCB7IFRpY2tTZXJ2aWNlIH0gZnJvbSAnLi4vdGljaydcbmltcG9ydCB7IFF1b3RlU2VydmljZSB9IGZyb20gJy4uL3F1b3RlJ1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAndHlwZWRpJ1xuaW1wb3J0IHsgcXVlcnlSZXNvbHZlciB9IGZyb20gJy4uLy4uL3V0aWxzL3F1ZXJ5UmVzb2x2ZXInXG5cbmNvbnN0IGNvbXBhbnlTZXJ2aWNlID0gQ29udGFpbmVyLmdldChDb21wYW55U2VydmljZSlcbmNvbnN0IHN0YXRzU2VydmljZSA9IENvbnRhaW5lci5nZXQoU3RhdHNTZXJ2aWNlKVxuY29uc3QgdGlja1NlcnZpY2UgPSBDb250YWluZXIuZ2V0KFRpY2tTZXJ2aWNlKVxuY29uc3QgcXVvdGVTZXJ2aWNlID0gQ29udGFpbmVyLmdldChRdW90ZVNlcnZpY2UpXG5cbmNvbnN0IHJlc29sdmVyczogSVJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICBzdG9jazogYXN5bmMgKF8sIGFyZ3M6IHsgaWQ6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiBhcmdzLmlkLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgc3ltYm9sOiBhcmdzLmlkLFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgU3RvY2s6IHtcbiAgICAgICAgY2hhcnQ6IChwYXJlbnQ6IHsgaWQ6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnlSZXNvbHZlcigoKSA9PiB0aWNrU2VydmljZS5nZXRDaGFydChwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBjb21wYW55OiBhc3luYyAocGFyZW50OiB7IGlkOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5UmVzb2x2ZXIoKCkgPT4gY29tcGFueVNlcnZpY2UuZ2V0Q29tcGFueShwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBzdGF0czogYXN5bmMgKHBhcmVudDogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IHN0YXRzU2VydmljZS5nZXRTdGF0cyhwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBwZWVyczogYXN5bmMgKHBhcmVudDogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IGlleC5wZWVycyhwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBxdW90ZTogYXN5bmMgKHBhcmVudDogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IHF1b3RlU2VydmljZS5nZXRRdW90ZShwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBwcmljZTogYXN5bmMgKHBhcmVudDogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IGlleC5wcmljZShwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgICAgICBwcmV2aW91czogYXN5bmMgKHBhcmVudDogeyBpZDogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc29sdmVyKCgpID0+IGlleC5wcmV2aW91c0RheShwYXJlbnQuaWQpKVxuICAgICAgICB9LFxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVyc1xuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcbmltcG9ydCB7IE1hcmtldFNlZ21lbnRzIH0gZnJvbSAnLi4vcmVmLWRhdGEvUmVmRGF0YS5zY2hlbWEnXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VhcmNoUmVzdWx0U2NoZW1hIHtcbiAgaWQ6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgbWFya2V0U2VnbWVudDogTWFya2V0U2VnbWVudHNcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ3FsYFxuICB0eXBlIFByZXZpb3VzIHtcbiAgICBzeW1ib2w6IElEIVxuICAgIGRhdGU6IERhdGUhXG4gICAgb3BlbjogRmxvYXQhXG4gICAgaGlnaDogRmxvYXQhXG4gICAgbG93OiBGbG9hdCFcbiAgICBjbG9zZTogRmxvYXQhXG4gICAgdm9sdW1lOiBJbnQhXG4gICAgdW5hZGp1c3RlZFZvbHVtZTogSW50IVxuICAgIGNoYW5nZTogRmxvYXQhXG4gICAgY2hhbmdlUGVyY2VudDogRmxvYXQhXG4gICAgdndhcDogRmxvYXQhXG4gIH1cblxuICB0eXBlIFNlYXJjaFJlc3VsdCB7XG4gICAgaWQ6IElEIVxuICAgIG5hbWU6IFN0cmluZyFcbiAgICBtYXJrZXRTZWdtZW50OiBTdHJpbmchXG4gIH1cblxuICB0eXBlIFN0b2NrIHtcbiAgICBpZDogSUQhXG4gICAgc3ltYm9sOiBTdHJpbmchXG4gICAgcHJpY2U6IEZsb2F0IVxuICAgIHN0YXRzOiBTdGF0cyFcbiAgICBwZWVyczogW1N0cmluZyFdIVxuICAgIGNoYXJ0OiBbVGljayFdIVxuICAgIGNvbXBhbnk6IENvbXBhbnkhXG4gICAgcXVvdGU6IFF1b3RlIVxuICAgIG5ld3MobGFzdDogRmxvYXQhKTogW05ld3MhXSFcbiAgICBwcmV2aW91czogUHJldmlvdXMhXG4gIH1cbmBcbiIsImltcG9ydCB7IElSZXNvbHZlcnMgfSBmcm9tICdncmFwaHFsLXRvb2xzJ1xuaW1wb3J0IHsgZm9ybWF0RGF0ZSB9IGZyb20gJy4uL0RhdGVTY2FsYXJzJ1xuXG5jb25zdCByZXNvbHZlcnM6IElSZXNvbHZlcnMgPSB7XG4gICAgVGljazoge1xuICAgICAgICBkYXRldGltZTogcGFyZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgJHtmb3JtYXREYXRlKHBhcmVudC5kYXRlKSB8fCAnJ30ke3BhcmVudC5taW51dGUgPyBgVCR7cGFyZW50Lm1pbnV0ZX1gIDogJyd9YFxuICAgICAgICB9LFxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVyc1xuIiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcbmV4cG9ydCBkZWZhdWx0IGdxbGBcbiB0eXBlIEludHJhZGF5IHtcbiAgICBkYXRlOiBEYXRlXG4gICAgbWludXRlOiBUaW1lXG4gICAgZGF0ZXRpbWU6IElTT0RhdGVUaW1lXG4gICAgaGlnaDogRmxvYXRcbiAgICBsb3c6IEZsb2F0XG4gICAgYXZlcmFnZTogRmxvYXRcbiAgICBvcGVuOiBGbG9hdFxuICAgIGNsb3NlOiBGbG9hdFxuICAgIHZvbHVtZTogRmxvYXRcbiAgICBub3Rpb25hbDogRmxvYXRcbiAgICBudW1iZXJPZlRyYWRlczogSW50XG4gIH1cblxuICB0eXBlIFRpY2sge1xuICAgIGRhdGU6IERhdGUhXG4gICAgbWludXRlOiBUaW1lIVxuICAgIGRhdGV0aW1lOiBJU09EYXRlVGltZSFcbiAgICBsYWJlbDogU3RyaW5nIVxuICAgIGhpZ2g6IEZsb2F0XG4gICAgbG93OiBGbG9hdFxuICAgIGF2ZXJhZ2U6IEZsb2F0XG4gICAgb3BlbjogRmxvYXRcbiAgICBjbG9zZTogRmxvYXRcbiAgICB2b2x1bWU6IEZsb2F0IVxuICAgIG5vdGlvbmFsOiBGbG9hdCFcbiAgICBudW1iZXJPZlRyYWRlczogRmxvYXQhXG4gICAgY2hhbmdlT3ZlclRpbWU6IEZsb2F0IVxuICAgIG1hcmtldEhpZ2g6IEZsb2F0IVxuICAgIG1hcmtldExvdzogRmxvYXQhXG4gICAgbWFya2V0QXZlcmFnZTogRmxvYXQhXG4gICAgbWFya2V0Vm9sdW1lOiBGbG9hdCFcbiAgICBtYXJrZXROb3Rpb25hbDogRmxvYXQhXG4gICAgbWFya2V0TnVtYmVyT2ZUcmFkZXM6IEZsb2F0IVxuICAgIG1hcmtldENoYW5nZU92ZXJUaW1lOiBGbG9hdCFcbiAgfVxuICBcbiBgOyIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICd0eXBlZGknXG5pbXBvcnQgKiBhcyBpZXggZnJvbSAnaWV4Y2xvdWRfYXBpX3dyYXBwZXInXG5pbXBvcnQgeyBxdWVyeVJlc29sdmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcXVlcnlSZXNvbHZlcidcblxuQFNlcnZpY2UoKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIHB1YmxpYyBhc3luYyBnZXRDaGFydChzeW1ib2w6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gcXVlcnlSZXNvbHZlcigoKSA9PiBpZXguaGlzdG9yeShzeW1ib2wsIHsgcGVyaW9kOiAnMWQnIH0pKVxuICAgIH1cbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgVGlja1NlcnZpY2UgfSBmcm9tICcuL1RpY2suc2VydmljZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFRpY2tTY2hlbWEgfSBmcm9tICcuL1RpY2suc2NoZW1hJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVGlja1Jlc29sdmVyIH0gZnJvbSAnLi9UaWNrLnJlc29sdmVyJztcbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXInO1xuXG4vLyBpbXBvcnQgcmVzb2x2ZXJzIGZyb20gJy4vcmVzb2x2ZXJzJztcbi8vIGltcG9ydCB0eXBlRGVmcyBmcm9tICcuL3R5cGUtZGVmcyc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL3NlcnZpY2VzL2xvZ2dlcidcbmltcG9ydCBSb290U2NoZW1hIGZyb20gJy4vZ3JhcGgtcWwvUm9vdFR5cGVkZWYnXG5pbXBvcnQgUm9vdFJlc29sdmVyIGZyb20gJy4vZ3JhcGgtcWwvUm9vdFJlc29sdmVyJ1xuLy8gaW1wb3J0IHsgYXN5bmMgfSBmcm9tICdyeGpzJztcbi8vIGNvbnN0IGlleCA9IHJlcXVpcmUoJ2lleGNsb3VkX2FwaV93cmFwcGVyJylcblxuXG5PYmplY3QuYXNzaWduKGdsb2JhbCwgeyBXZWJTb2NrZXQ6IHJlcXVpcmUoJ3dlYnNvY2tldCcpLnczY3dlYnNvY2tldH0pXG5cbmFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcbiAgICBpZiAoIXByb2Nlc3MuZW52LklFWENMT1VEX0FQSV9WRVJTSU9OIHx8ICFwcm9jZXNzLmVudi5JRVhDTE9VRF9QVUJMSUNfS0VZKSB7XG5cbiAgICAgICAgLy8gVE9ETzogU2VuZCBhIGZyaWVuZGx5IGVycm9yIHRvIHRoZSBjbGllbnQgcmF0aGVyIHRoYW4ganVzdCBnaXZpbmcgdXBcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdpZXgtY2xvdWQgQVBJIGtleSBtdXN0IGJlIHNldCcpXG5cbiAgICB9XG5cbiAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcbiAgICAgICAgdHlwZURlZnM6IFJvb3RTY2hlbWEsXG4gICAgICAgIHJlc29sdmVyczogUm9vdFJlc29sdmVyLFxuICAgIH0pXG5cbiAgICBzZXJ2ZXIubGlzdGVuKCkudGhlbigoeyB1cmwsIHN1YnNjcmlwdGlvbnNVcmwgfSkgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyggYFNlcnZlciByZWFkeSBhdCAke3VybH1gKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oYFN1YnNjcmlwdGlvbnMgcmVhZHkgYXQgJHtzdWJzY3JpcHRpb25zVXJsfWApO1xuXG4gICAgICAgIGlmKG1vZHVsZS5ob3QpIHtcbiAgICAgICAgICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgICAgICAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4gY29uc29sZS5sb2coJ01vZHVsZSBkaXNwb3NlZC4gJykpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmJvb3RzdHJhcCgpO1xuXG4vLyBjb25zdCBxdW90ZSA9IGFzeW5jICAoc3ltYm9sOiBhbnkpID0+IHtcbi8vICAgICBjb25zdCBxdW90ZURhdGEgPSBhd2FpdCBpZXgucXVvdGUoc3ltYm9sKTtcbi8vICAgICBjb25zb2xlLmxvZyhxdW90ZURhdGEpXG4vLyB9O1xuXG4vLyBxdW90ZShcIldEQ1wiKTtcblxuLy8gY29uc3QgcXVvdGUxID0gYXN5bmMgKHN5bSkgPT4ge1xuLy8gICAgIGNvbnN0IHF1b3RlRGF0YSA9IGF3YWl0IGlleC5xdW90ZShzeW0pO1xuLy8gICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHJldHVybmVkIHF1b3RlIGRhdGFcbi8vICAgICBjb25zb2xlLmxvZyhxdW90ZURhdGEpXG4vLyB9O1xuXG4vLyBxdW90ZShcIldEQ1wiKTtcblxuLy8gY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlciAoe1xuLy8gICAgIHJlc29sdmVycywgdHlwZURlZnMsXG4vLyAgICAgaW50cm9zcGVjdGlvbjogZW52aXJvbm1lbnQuYXBvbGxvLmludHJvc3BlY3Rpb24sXG4vLyAgICAgcGxheWdyb3VuZDogZW52aXJvbm1lbnQuYXBvbGxvLnBsYXlncm91bmRcbi8vIH0pO1xuXG4vLyAvLyBjb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcyB9KTtcblxuLy8gc2VydmVyLmxpc3RlbihlbnZpcm9ubWVudC5wb3J0KVxuLy8gICAgIC50aGVuKCh7IHVybCB9KSA9PiBjb25zb2xlLmxvZyhgU2VydmVyIHJlYWR5IGF0ICR7dXJsfS4gYCkpO1xuXG5cblxuXG4vLyAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4vLyBpZiAobW9kdWxlLmhvdCkge1xuLy8gICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4vLyAgICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IGNvbnNvbGUubG9nKCdNb2R1bGUgZGlzcG9zZWQuICcpKTtcblxuLy8gfSIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gJ2dyYXBocWwtc3Vic2NyaXB0aW9ucydcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuIiwiaW1wb3J0IHdpbnN0b24gZnJvbSAnd2luc3RvbidcblxuY29uc3QgbG9nZ2VyID0gd2luc3Rvbi5jcmVhdGVMb2dnZXIoe1xuICAgIGZvcm1hdDogd2luc3Rvbi5mb3JtYXQuanNvbigpLFxuICAgIGxldmVsOiAnZGVidWcnLFxuICAgIHRyYW5zcG9ydHM6IFtcbiAgICAgICAgbmV3IHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKHsgZmlsZW5hbWU6ICdlcnJvci5sb2cnLCBsZXZlbDogJ2Vycm9yJywgbWF4RmlsZXM6IDIsIG1heHNpemU6IDEwMDAwfSksXG4gICAgICAgIG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSh7IGZpbGVuYW1lOiAnY29tYmluZS5sb2cnLCBtYXhGaWxlczogMiwgbWF4c2l6ZTogMTAwMDB9KSxcbiAgICBdLFxufSlcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZXIuYWRkKFxuICAgICAgICBuZXcgd2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUoe1xuICAgICAgICAgICAgZm9ybWF0OiB3aW5zdG9uLmZvcm1hdC5zaW1wbGUoKSxcbiAgICAgICAgfSksXG4gICAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXIgIiwiZXhwb3J0IGZ1bmN0aW9uIHdpdGhDYW5jZWwoYXN5bmNJdGVyYXRvcjogQXN5bmNJdGVyYXRvcjx1bmtub3duLCBhbnksIHVuZGVmaW5lZD4sIG9uQ2FuY2VsOiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgYXN5bmNSZXR1cm4gPSBhc3luY0l0ZXJhdG9yLnJldHVybjtcblxuICAgIGFzeW5jSXRlcmF0b3IucmV0dXJuID0gKCkgPT4ge1xuICAgICAgICBvbkNhbmNlbCgpO1xuICAgICAgICByZXR1cm4gYXN5bmNSZXR1cm4gPyBhc3luY1JldHVybi5jYWxsKGFzeW5jSXRlcmF0b3IpIDogUHJvbWlzZS5yZXNvbHZlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFzeW5jSXRlcmF0b3I7XG59IiwiaW1wb3J0IGxvZ2dlciBmcm9tICcuLi9zZXJ2aWNlcy9sb2dnZXInXG5cbmNvbnN0IEVSUk9SX01FU1NBR0UgPSAnTWF4IHJldHJpZXMgaGl0IGZvciBxdWVyeSB0byBJRVggY2xvdWQnXG5jb25zdCBNSU5fSU5URVJWQUwgPSA1MDBcbmNvbnN0IE1BWF9JTlRFUlZBTCA9IDEyMDBcbmNvbnN0IE1BWF9SRVRSSUVTID0gNVxuXG5jb25zdCByYW5kb21JbnRlcnZhbCA9IChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KSArIG1pblxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcXVlcnlSZXNvbHZlcjxUPihcbiAgICBmbjogKCkgPT4gUHJvbWlzZTxUPixcbiAgICByZXRyaWVzOiBudW1iZXIgPSBNQVhfUkVUUklFUyxcbiAgICBpbnRlcnZhbDogbnVtYmVyID0gcmFuZG9tSW50ZXJ2YWwoTUlOX0lOVEVSVkFMLCBNQVhfSU5URVJWQUwpLFxuKTogUHJvbWlzZTxUPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZuKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAocmV0cmllcykge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBpbnRlcnZhbCkpXG4gICAgICAgICAgICByZXR1cm4gcXVlcnlSZXNvbHZlcihmbiwgcmV0cmllcyAtIDEsIGludGVydmFsICogMilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihFUlJPUl9NRVNTQUdFKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0UpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAc3RvbXAvcngtc3RvbXBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtc3Vic2NyaXB0aW9uc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpZXhjbG91ZF9hcGlfd3JhcHBlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb21lbnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVmbGVjdC1tZXRhZGF0YVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyeGpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJ4anMvb3BlcmF0b3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGVkaVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3ZWJzb2NrZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwid2luc3RvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9