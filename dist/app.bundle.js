/******/ (function(modules) { // webpackBootstrap
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
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

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
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(false) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_hash__) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {abort: 1, fail: 1}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				require("./log-apply-result")(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function (eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(34)['default'];

	var _classCallCheck = __webpack_require__(37)['default'];

	var _Array$from = __webpack_require__(38)['default'];

	var _Promise = __webpack_require__(3)['default'];

	var _Object$assign = __webpack_require__(41)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _timecode = __webpack_require__(46);

	var Player = (function () {
	    function Player(options) {
	        _classCallCheck(this, Player);

	        if (typeof SC !== 'object') {
	            throw new Error('No "SC" Soundcloud object found.  You need to first load the ' + 'Soundcloud SDK before loading the player.');
	        }

	        if (!options) {
	            throw new Error('Please provide an options object to the constructor.');
	        }

	        if (!options.clientId) {
	            throw new Error('Please provide a "clientId" parameter to the constructor');
	        }

	        this.clientId = options.clientId;

	        // Provided DOM elements
	        this.scrubberEl = options.scrubberEl || undefined;
	        this.timeEl = options.timeEl || undefined;
	        this.tracksEl = options.tracksEl || undefined;
	        this.controlsEl = options.controlsEl || undefined;

	        // Props
	        this.tracks = [];
	        this.subscriptions = {};
	        this.trackOptions = {};
	        this.currentTrackIndex = 0;
	        this.onWaveformCreate = options.onWaveformCreate || undefined;
	        this.showWaveform = options.showWaveform !== undefined ? options.showWaveform : true;

	        // State
	        this.busy = false;
	        this.playing = false;
	        this.paused = false;

	        this.initializeSoundcloud(this.clientId);

	        if (typeof window === 'object') {
	            this.bindKeys();
	        }
	    }

	    _createClass(Player, [{
	        key: 'initializeSoundcloud',
	        value: function initializeSoundcloud(clientId) {
	            return SC.initialize({
	                client_id: clientId
	            });
	        }
	    }, {
	        key: 'appendControls',

	        /**
	         * If a `controlsEl` param is provided, this function will append a basic
	         * DOM fragment to control the player
	         */
	        value: function appendControls() {
	            var controlsEl = this.controlsEl;
	            var frag = document.createDocumentFragment();

	            var prev = document.createElement('a');
	            var prevSpan = document.createElement('span');
	            prevSpan.textContent = 'Previous';
	            prev.className = 'sc-prev';
	            prev.appendChild(prevSpan);
	            frag.appendChild(prev);

	            var play = document.createElement('a');
	            var playSpan = document.createElement('span');
	            playSpan.textContent = 'Play';
	            play.className = 'sc-play';
	            play.appendChild(playSpan);
	            frag.appendChild(play);

	            var pause = document.createElement('a');
	            var pauseSpan = document.createElement('span');
	            pauseSpan.textContent = 'Play';
	            pause.className = 'sc-pause';
	            pause.appendChild(pauseSpan);
	            frag.appendChild(pause);

	            var next = document.createElement('a');
	            var nextSpan = document.createElement('span');
	            nextSpan.textContent = 'Play';
	            next.className = 'sc-next';
	            next.appendChild(nextSpan);
	            frag.appendChild(next);

	            controlsEl.appendChild(frag);

	            this.bindControlEvents();
	        }
	    }, {
	        key: 'appendTrackLinks',

	        /**
	         * If a `tracksEl` param is provided, this function will append a DOM
	         * fragment for each track in the player.  It will also bind events to each
	         * track to control the player
	         */
	        value: function appendTrackLinks() {
	            var tracks = this.tracks;
	            var tracksEl = this.tracksEl;
	            var frag = document.createDocumentFragment();

	            tracks.forEach(function (track, index) {
	                var name = track.title;
	                var link = document.createElement('a');

	                link.textContent = name;
	                link.setAttribute('data-track-index', index);
	                link.className = 'sc-track';

	                frag.appendChild(link);
	            });

	            tracksEl.appendChild(frag);

	            this.bindTrackEvents();
	        }
	    }, {
	        key: 'removeActiveTrackLinks',

	        /**
	         * Removes the active class from all of the track links
	         */
	        value: function removeActiveTrackLinks() {
	            var nodes = _Array$from(this.tracksEl.children);

	            nodes.forEach(function (node) {
	                node.classList.remove('sc-track--active');
	            });
	        }
	    }, {
	        key: 'bindKeys',

	        /***********
	         * DOM STUFF
	         **********/
	        value: function bindKeys() {
	            var player = this;

	            document.body.addEventListener('keydown', player.onKeyboardEvent.bind(player));
	        }
	    }, {
	        key: 'onKeyboardEvent',

	        /**
	         * Takes a `keydown` event and performs logic to control the player
	         *
	         */
	        value: function onKeyboardEvent(event) {
	            var key = event.keyCode || event.which;
	            var player = this;

	            // Space
	            if (key === 32) {
	                if (player.playing) {
	                    player.pause();
	                } else if (player.paused) {
	                    player.resume();
	                } else {
	                    player.play();
	                }
	            }

	            // right arrow
	            if (key === 39) {
	                player.next();
	            }

	            if (key === 37) {
	                player.prev();
	            }
	        }
	    }, {
	        key: 'bindControlEvents',
	        value: function bindControlEvents() {
	            var controlsEl = this.controlsEl;
	            var player = this;

	            controlsEl.addEventListener('click', function (e) {
	                if (e.target && e.target.nodeName === 'A') {
	                    var target = e.target;

	                    if (target.classList.contains('sc-prev')) {
	                        player.prev();
	                    }

	                    if (target.classList.contains('sc-next')) {
	                        player.next();
	                    }

	                    if (target.classList.contains('sc-play')) {
	                        if (document.body.classList.contains('sc--paused')) {
	                            player.resume();
	                        } else {
	                            player.play();
	                        }
	                        document.body.classList.add('sc--playing');
	                        document.body.classList.remove('sc--paused');
	                    }

	                    if (target.classList.contains('sc-pause')) {
	                        document.body.classList.add('sc--paused');
	                        document.body.classList.remove('sc--playing');
	                        player.pause();
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'bindTrackEvents',
	        value: function bindTrackEvents() {
	            var tracksEl = this.tracksEl;
	            var player = this;

	            tracksEl.addEventListener('click', function (e) {
	                if (e.target && e.target.nodeName === 'A') {
	                    var target = e.target;
	                    var index = target.getAttribute('data-track-index');

	                    player.play(index);
	                }
	            });
	        }
	    }, {
	        key: 'addSets',
	        value: function addSets(setIds, options) {
	            var _this = this;

	            var self = this;
	            self.busy = true;

	            if (typeof setIds === 'string') {
	                setIds = [setIds];
	            }

	            if (!Array.isArray(options)) {
	                options = [options];
	            }

	            var promises = setIds.map(function (setId, index) {
	                return _this.get('/playlists/' + setId);
	            });

	            return _Promise.all(promises).then(function (sets) {

	                sets.forEach(function (set) {
	                    set.tracks.forEach(function (track, index) {
	                        var opts = options.length > 1 ? options[index] : options[0];

	                        if (!self.trackOptions[track.id]) {
	                            self.trackOptions[track.id] = opts;
	                        }

	                        self.tracks.push(track);
	                    });
	                });

	                self.appendTrackLinks();
	                self.appendControls();
	                self.busy = false;
	                return sets;
	            });
	        }
	    }, {
	        key: 'addTracks',
	        value: function addTracks(trackIds, options) {
	            var _this2 = this;

	            var self = this;
	            self.busy = true;

	            if (typeof trackIds === 'string') {
	                trackIds = [trackIds];
	            }

	            if (!Array.isArray(options)) {
	                options = [options];
	            }

	            var promises = trackIds.map(function (trackId, index) {
	                return _this2.get('/tracks/' + trackId);
	            });

	            return _Promise.all(promises).then(function (tracks) {

	                tracks.forEach(function (track, index) {
	                    var opts = options.length > 1 ? options[index] : options[0];

	                    if (!self.trackOptions[track.id]) {
	                        self.trackOptions[track.id] = opts;
	                    }

	                    self.tracks.push(track);
	                });

	                self.busy = false;
	                return tracks;
	            });
	        }
	    }, {
	        key: 'at',
	        value: function at(trackId, time, fn) {
	            if (!this.subscriptions[trackId]) {
	                this.subscriptions[trackId] = [];
	            }

	            if (typeof time === 'string') {
	                time = (0, _timecode.toMilliseconds)(time);
	            }

	            this.subscriptions[trackId].push({
	                time: time,
	                fn: fn
	            });
	        }
	    }, {
	        key: 'get',
	        value: function get(uri, options) {
	            return new _Promise(function (resolve, reject) {
	                SC.get(uri, options, function (thing, err) {
	                    if (err) {
	                        return reject(err);
	                    }

	                    resolve(thing);
	                });
	            });
	        }
	    }, {
	        key: 'stream',
	        value: function stream(track) {
	            var options = arguments[1] === undefined ? {} : arguments[1];

	            var player = this;
	            var trackOptions = player.trackOptions[track.id] || {};
	            var opts = _Object$assign({
	                onload: function onload() {
	                    var subs = player.subscriptions[track.id];
	                    var sound = this;

	                    if (subs.length) {
	                        subs.forEach(function (sub) {
	                            sound.onPosition(sub.time, sub.fn);
	                        });
	                    }

	                    if (player.waveform && player.waveform.onload) {
	                        player.waveform.onload(this);
	                    }
	                },
	                whileplaying: options.whileplaying || function () {
	                    var relative = this.position / this.duration;
	                    var timecode = (0, _timecode.toTimecode)(this.position);
	                    var duration = (0, _timecode.toTimecode)(this.duration);

	                    player.timeEl.textContent = timecode + ' / ' + duration;

	                    if (player.waveform && player.waveform.whileplaying) {
	                        player.waveform.whileplaying(this);
	                    } else {
	                        player.played.style.width = 100 * relative + '%';
	                    }
	                }
	            }, trackOptions, options);

	            SC.stream(track.uri, opts, function (sound) {
	                player.currentSoundObject = sound;
	                sound.play();
	                player.playing = true;
	                player.paused = false;

	                if (typeof window === 'object') {
	                    document.body.classList.add('sc--playing');
	                }
	            });
	        }
	    }, {
	        key: 'next',
	        value: function next() {
	            this.play(++this.currentTrackIndex);
	        }
	    }, {
	        key: 'prev',
	        value: function prev() {
	            this.play(--this.currentTrackIndex);
	        }
	    }, {
	        key: 'play',
	        value: function play(trackNo) {
	            var self = this;

	            if (self.playing) {
	                self.stop();
	            }

	            if (this.busy) {
	                setTimeout(function () {
	                    self.play(trackNo);
	                }, 0);
	                return;
	            }

	            if (!this.tracks.length) {
	                throw new Error('There are no tracks in the player!');
	            }

	            var track = this.tracks[trackNo || 0];

	            if (!track) {
	                return;
	            }

	            this.prepareScrubber(track);

	            var opts = this.trackOptions[track.id];

	            self.removeActiveTrackLinks();
	            self.makeTrackActive(trackNo || 0);

	            return this.stream(track, opts || {});
	        }
	    }, {
	        key: 'makeTrackActive',
	        value: function makeTrackActive(trackIndex) {
	            var tracksEl = this.tracksEl;
	            var track = _Array$from(tracksEl.children).filter(function (el) {
	                return parseInt(el.getAttribute('data-track-index'), 10) === parseInt(trackIndex, 10);
	            });

	            track[0].classList.add('sc-track--active');
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.currentSoundObject.stop();
	            document.body.classList.remove('sc--playing');
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            this.paused = true;
	            this.playing = false;
	            document.body.classList.remove('sc--playing');
	            document.body.classList.add('sc--paused');
	            this.currentSoundObject.pause();
	        }
	    }, {
	        key: 'resume',
	        value: function resume() {
	            this.paused = false;
	            this.playing = true;
	            document.body.classList.remove('sc--paused');
	            document.body.classList.add('sc--playing');
	            this.currentSoundObject.resume();
	        }
	    }, {
	        key: 'push',
	        value: function push(track, options) {
	            var self = this;

	            self.busy = true;

	            this.get('/tracks/' + track.uri, options).then(function (scTrack) {
	                track = _Object$assign(track, scTrack);

	                self.tracks.push(track);

	                self.busy = false;
	            });
	        }
	    }, {
	        key: 'scrub',
	        value: function scrub(position) {
	            var rect = this.scrubberEl.getBoundingClientRect();
	            var left = rect.left;
	            var width = this.scrubberEl.offsetWidth;
	            var relative = (position - left) / width;

	            this.seek(relative);
	        }
	    }, {
	        key: 'seek',
	        value: function seek(relative) {
	            var track = this.currentSoundObject;
	            var duration = track.duration;
	            var newTime = duration * relative;

	            track.setPosition(newTime);
	        }
	    }, {
	        key: 'prepareScrubber',
	        value: function prepareScrubber(track) {
	            var self = this;

	            console.log(self);

	            if (this.onWaveformCreate) {
	                this.scrubberEl.innerHTML = '';

	                var waveform = this.waveform = this.onWaveformCreate(track);

	                if (waveform.element) {
	                    this.scrubberEl.appendChild(waveform.element);
	                } else {
	                    this.scrubberEl.appendChild(waveform);
	                }
	            } else if (this.showWaveform) {

	                if (!this.played) {
	                    this.played = document.createElement('div');
	                    this.played.classList.add('sc-played');
	                    this.scrubberEl.appendChild(this.played);
	                }

	                var base = document.createElement('div');
	                var img = document.createElement('img');
	                base.classList.add('sc-waveform');
	                img.src = track.waveform_url;
	                base.appendChild(img);

	                this.scrubberEl.appendChild(base);
	            }

	            this.scrubberEl.addEventListener('click', function (e) {
	                self.scrub(e.pageX);
	            });
	        }
	    }]);

	    return Player;
	})();

	exports.Player = Player;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(13);
	__webpack_require__(19);
	__webpack_require__(22);
	module.exports = __webpack_require__(7).core.Promise;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(6)
	  , tmp = {};
	tmp[__webpack_require__(9)('toStringTag')] = 'z';
	if(__webpack_require__(7).FW && cof(tmp) != 'z'){
	  __webpack_require__(12)(Object.prototype, 'toString', function toString(){
	    return '[object ' + cof.classof(this) + ']';
	  }, true);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(7)
	  , TAG      = __webpack_require__(9)('toStringTag')
	  , toString = {}.toString;
	function cof(it){
	  return toString.call(it).slice(8, -1);
	}
	cof.classof = function(it){
	  var O, T;
	  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
	};
	cof.set = function(it, tag, stat){
	  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
	};
	module.exports = cof;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}

	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}

	var $ = module.exports = __webpack_require__(8)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function($){
	  $.FW   = false;
	  $.path = $.core;
	  return $;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7).g
	  , store  = __webpack_require__(10)('wks');
	module.exports = function(name){
	  return store[name] || (store[name] =
	    global.Symbol && global.Symbol[name] || __webpack_require__(11).safe('Symbol.' + name));
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var $      = __webpack_require__(7)
	  , SHARED = '__core-js_shared__'
	  , store  = $.g[SHARED] || ($.g[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var sid = 0;
	function uid(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
	}
	uid.safe = __webpack_require__(7).g.Symbol || uid;
	module.exports = uid;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7).hide;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var set   = __webpack_require__(7).set
	  , $at   = __webpack_require__(14)(true)
	  , ITER  = __webpack_require__(11).safe('iter')
	  , $iter = __webpack_require__(15)
	  , step  = $iter.step;

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(17)(String, 'String', function(iterated){
	  set(this, ITER, {o: String(iterated), i: 0});
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , index = iter.i
	    , point;
	  if(index >= O.length)return step(1);
	  point = $at(O, index);
	  iter.i += point.length;
	  return step(0, point);
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var $ = __webpack_require__(7);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String($.assertDefined(that))
	      , i = $.toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $                 = __webpack_require__(7)
	  , cof               = __webpack_require__(6)
	  , classof           = cof.classof
	  , assert            = __webpack_require__(16)
	  , assertObject      = assert.obj
	  , SYMBOL_ITERATOR   = __webpack_require__(9)('iterator')
	  , FF_ITERATOR       = '@@iterator'
	  , Iterators         = __webpack_require__(10)('iterators')
	  , IteratorPrototype = {};
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	setIterator(IteratorPrototype, $.that);
	function setIterator(O, value){
	  $.hide(O, SYMBOL_ITERATOR, value);
	  // Add iterator for FF iterator protocol
	  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
	}

	module.exports = {
	  // Safari has buggy iterators w/o `next`
	  BUGGY: 'keys' in [] && !('next' in [].keys()),
	  Iterators: Iterators,
	  step: function(done, value){
	    return {value: value, done: !!done};
	  },
	  is: function(it){
	    var O      = Object(it)
	      , Symbol = $.g.Symbol;
	    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
	      || SYMBOL_ITERATOR in O
	      || $.has(Iterators, classof(O));
	  },
	  get: function(it){
	    var Symbol = $.g.Symbol
	      , getIter;
	    if(it != undefined){
	      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
	        || it[SYMBOL_ITERATOR]
	        || Iterators[classof(it)];
	    }
	    assert($.isFunction(getIter), it, ' is not iterable!');
	    return assertObject(getIter.call(it));
	  },
	  set: setIterator,
	  create: function(Constructor, NAME, next, proto){
	    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
	    cof.set(Constructor, NAME + ' Iterator');
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	function assert(condition, msg1, msg2){
	  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
	}
	assert.def = $.assertDefined;
	assert.fn = function(it){
	  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
	  return it;
	};
	assert.obj = function(it){
	  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};
	assert.inst = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};
	module.exports = assert;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var $def            = __webpack_require__(18)
	  , $redef          = __webpack_require__(12)
	  , $               = __webpack_require__(7)
	  , cof             = __webpack_require__(6)
	  , $iter           = __webpack_require__(15)
	  , SYMBOL_ITERATOR = __webpack_require__(9)('iterator')
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values'
	  , Iterators       = $iter.Iterators;
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  $iter.create(Constructor, NAME, next);
	  function createMethod(kind){
	    function $$(that){
	      return new Constructor(that, kind);
	    }
	    switch(kind){
	      case KEYS: return function keys(){ return $$(this); };
	      case VALUES: return function values(){ return $$(this); };
	    } return function entries(){ return $$(this); };
	  }
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = $.getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    cof.set(IteratorPrototype, TAG, true);
	    // FF fix
	    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
	  }
	  // Define iterator
	  if($.FW || FORCE)$iter.set(proto, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = $.that;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(7)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && !isFunction(target[key]))exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp.prototype = C.prototype;
	    }(out);
	    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
	  }
	}
	module.exports = $def;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(20);
	var $           = __webpack_require__(7)
	  , Iterators   = __webpack_require__(15).Iterators
	  , ITERATOR    = __webpack_require__(9)('iterator')
	  , ArrayValues = Iterators.Array
	  , NL          = $.g.NodeList
	  , HTC         = $.g.HTMLCollection
	  , NLProto     = NL && NL.prototype
	  , HTCProto    = HTC && HTC.prototype;
	if($.FW){
	  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
	  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
	}
	Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(7)
	  , setUnscope = __webpack_require__(21)
	  , ITER       = __webpack_require__(11).safe('iter')
	  , $iter      = __webpack_require__(15)
	  , step       = $iter.step
	  , Iterators  = $iter.Iterators;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(17)(Array, 'Array', function(iterated, kind){
	  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , kind  = iter.k
	    , index = iter.i++;
	  if(!O || index >= O.length){
	    iter.o = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $        = __webpack_require__(7)
	  , ctx      = __webpack_require__(24)
	  , cof      = __webpack_require__(6)
	  , $def     = __webpack_require__(18)
	  , assert   = __webpack_require__(16)
	  , forOf    = __webpack_require__(25)
	  , setProto = __webpack_require__(27).set
	  , same     = __webpack_require__(23)
	  , species  = __webpack_require__(28)
	  , SPECIES  = __webpack_require__(9)('species')
	  , RECORD   = __webpack_require__(11).safe('record')
	  , PROMISE  = 'Promise'
	  , global   = $.g
	  , process  = global.process
	  , isNode   = cof(process) == 'process'
	  , asap     = process && process.nextTick || __webpack_require__(29).set
	  , P        = global[PROMISE]
	  , isFunction     = $.isFunction
	  , isObject       = $.isObject
	  , assertFunction = assert.fn
	  , assertObject   = assert.obj
	  , Wrapper;

	function testResolve(sub){
	  var test = new P(function(){});
	  if(sub)test.constructor = Object;
	  return P.resolve(test) === test;
	}

	var useNative = function(){
	  var works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = isFunction(P) && isFunction(P.resolve) && testResolve();
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
	    if(works && $.DESC){
	      var thenableThenGotten = false;
	      P.resolve($.setDesc({}, 'then', {
	        get: function(){ thenableThenGotten = true; }
	      }));
	      works = thenableThenGotten;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();

	// helpers
	function isPromise(it){
	  return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
	}
	function sameConstructor(a, b){
	  // library wrapper special case
	  if(!$.FW && a === P && b === Wrapper)return true;
	  return same(a, b);
	}
	function getConstructor(C){
	  var S = assertObject(C)[SPECIES];
	  return S != undefined ? S : C;
	}
	function isThenable(it){
	  var then;
	  if(isObject(it))then = it.then;
	  return isFunction(then) ? then : false;
	}
	function notify(record){
	  var chain = record.c;
	  // strange IE + webpack dev server bug - use .call(global)
	  if(chain.length)asap.call(global, function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    function run(react){
	      var cb = ok ? react.ok : react.fail
	        , ret, then;
	      try {
	        if(cb){
	          if(!ok)record.h = true;
	          ret = cb === true ? value : cb(value);
	          if(ret === react.P){
	            react.rej(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(ret)){
	            then.call(ret, react.res, react.rej);
	          } else react.res(ret);
	        } else react.rej(value);
	      } catch(err){
	        react.rej(err);
	      }
	    }
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	  });
	}
	function isUnhandled(promise){
	  var record = promise[RECORD]
	    , chain  = record.a || record.c
	    , i      = 0
	    , react;
	  if(record.h)return false;
	  while(chain.length > i){
	    react = chain[i++];
	    if(react.fail || !isUnhandled(react.P))return false;
	  } return true;
	}
	function $reject(value){
	  var record = this
	    , promise;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  setTimeout(function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    asap.call(global, function(){
	      if(isUnhandled(promise = record.p)){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(global.console && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      }
	      record.a = undefined;
	    });
	  }, 1);
	  notify(record);
	}
	function $resolve(value){
	  var record = this
	    , then;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(then = isThenable(value)){
	      // strange IE + webpack dev server bug - use .call(global)
	      asap.call(global, function(){
	        var wrapper = {r: record, d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record);
	    }
	  } catch(e){
	    $reject.call({r: record, d: false}, e); // wrap
	  }
	}

	// constructor polyfill
	if(!useNative){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    assertFunction(executor);
	    var record = {
	      p: assert.inst(this, P, PROMISE),       // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false                                // <- handled rejection
	    };
	    $.hide(this, RECORD, record);
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(32)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var S = assertObject(assertObject(this).constructor)[SPECIES];
	      var react = {
	        ok:   isFunction(onFulfilled) ? onFulfilled : true,
	        fail: isFunction(onRejected)  ? onRejected  : false
	      };
	      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
	        react.res = assertFunction(res);
	        react.rej = assertFunction(rej);
	      });
	      var record = this[RECORD];
	      record.c.push(react);
	      if(record.a)record.a.push(react);
	      if(record.s)notify(record);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	// export
	$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
	cof.set(P, PROMISE);
	species(P);
	species(Wrapper = $.core[PROMISE]);

	// statics
	$def($def.S + $def.F * !useNative, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    return new (getConstructor(this))(function(res, rej){ rej(r); });
	  }
	});
	$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    return isPromise(x) && sameConstructor(x.constructor, this)
	      ? x : new this(function(res){ res(x); });
	  }
	});
	$def($def.S + $def.F * !(useNative && __webpack_require__(33)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C      = getConstructor(this)
	      , values = [];
	    return new C(function(res, rej){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        C.resolve(promise).then(function(value){
	          results[index] = value;
	          --remaining || res(results);
	        }, rej);
	      });
	      else res(results);
	    });
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C = getConstructor(this);
	    return new C(function(res, rej){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(res, rej);
	      });
	    });
	  }
	});

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// Optional / simple context binding
	var assertFunction = __webpack_require__(16).fn;
	module.exports = function(fn, that, length){
	  assertFunction(fn);
	  if(~length && that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var ctx  = __webpack_require__(24)
	  , get  = __webpack_require__(15).get
	  , call = __webpack_require__(26);
	module.exports = function(iterable, entries, fn, that){
	  var iterator = get(iterable)
	    , f        = ctx(fn, that, entries ? 2 : 1)
	    , step;
	  while(!(step = iterator.next()).done){
	    if(call(iterator, f, step.value, entries) === false){
	      return call.close(iterator);
	    }
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var assertObject = __webpack_require__(16).obj;
	function close(iterator){
	  var ret = iterator['return'];
	  if(ret !== undefined)assertObject(ret.call(iterator));
	}
	function call(iterator, fn, value, entries){
	  try {
	    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
	  } catch(e){
	    close(iterator);
	    throw e;
	  }
	}
	call.close = close;
	module.exports = call;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var $      = __webpack_require__(7)
	  , assert = __webpack_require__(16);
	function check(O, proto){
	  assert.obj(O);
	  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
	}
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	    ? function(buggy, set){
	        try {
	          set = __webpack_require__(24)(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
	          set({}, []);
	        } catch(e){ buggy = true; }
	        return function setPrototypeOf(O, proto){
	          check(O, proto);
	          if(buggy)O.__proto__ = proto;
	          else set(O, proto);
	          return O;
	        };
	      }()
	    : undefined),
	  check: check
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(7)
	  , SPECIES = __webpack_require__(9)('species');
	module.exports = function(C){
	  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: $.that
	  });
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $      = __webpack_require__(7)
	  , ctx    = __webpack_require__(24)
	  , cof    = __webpack_require__(6)
	  , invoke = __webpack_require__(30)
	  , cel    = __webpack_require__(31)
	  , global             = $.g
	  , isFunction         = $.isFunction
	  , html               = $.html
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	function run(){
	  var id = +this;
	  if($.has(queue, id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	}
	function listner(event){
	  run.call(event.data);
	}
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!isFunction(setTask) || !isFunction(clearTask)){
	  setTask = function(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(isFunction(fn) ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(cof(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Modern browsers, skip implementation for WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is object
	  } else if(global.addEventListener && isFunction(global.postMessage) && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id, '*');
	    };
	    global.addEventListener('message', listner, false);
	  // WebWorkers
	  } else if(isFunction(MessageChannel)){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	// Fast apply
	// http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
	                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(7)
	  , document = $.g.document
	  , isObject = $.isObject
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var $redef = __webpack_require__(12);
	module.exports = function(target, src){
	  for(var key in src)$redef(target, key, src[key]);
	  return target;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(9)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(35)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(36), __esModule: true };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(39), __esModule: true };

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(13);
	__webpack_require__(40);
	module.exports = __webpack_require__(7).core.Array.from;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(7)
	  , ctx   = __webpack_require__(24)
	  , $def  = __webpack_require__(18)
	  , $iter = __webpack_require__(15)
	  , call  = __webpack_require__(26);
	$def($def.S + $def.F * !__webpack_require__(33)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = Object($.assertDefined(arrayLike))
	      , mapfn   = arguments[1]
	      , mapping = mapfn !== undefined
	      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
	      , index   = 0
	      , length, result, step, iterator;
	    if($iter.is(O)){
	      iterator = $iter.get(O);
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result   = new (typeof this == 'function' ? this : Array);
	      for(; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
	      }
	    } else {
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
	      for(; length > index; index++){
	        result[index] = mapping ? f(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(42), __esModule: true };

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(43);
	module.exports = __webpack_require__(7).core.Object.assign;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(18);
	$def($def.S, 'Object', {assign: __webpack_require__(44)});

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(7)
	  , enumKeys = __webpack_require__(45);
	// 19.1.2.1 Object.assign(target, source, ...)
	/* eslint-disable no-unused-vars */
	module.exports = Object.assign || function assign(target, source){
	/* eslint-enable no-unused-vars */
	  var T = Object($.assertDefined(target))
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = $.ES5Object(arguments[i++])
	      , keys   = enumKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getDesc    = $.getDesc
	    , getSymbols = $.getSymbols;
	  if(getSymbols)$.each.call(getSymbols(it), function(key){
	    if(getDesc(it, key).enumerable)keys.push(key);
	  });
	  return keys;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.toMilliseconds = toMilliseconds;
	exports.toTimecode = toTimecode;

	function toMilliseconds(str) {
	    var regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

	    var match = str.match(regex);

	    if (match) {
	        var hours = parseInt(match[1], 10) || 0;
	        var minutes = parseInt(match[2], 10) || 0;
	        var seconds = parseInt(match[3], 10) || 0;

	        return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
	    } else {
	        throw new Error('Timecode could not be parsed.');
	    }
	}

	function padWithZero(num) {
	    return num < 10 ? '0' + num : '' + num;
	}

	function toTimecode(ms) {
	    var hours = Math.floor(ms / (60 * 60 * 1000));
	    var minutes = Math.floor(ms / 60000 % 60);
	    var seconds = Math.floor(ms / 1000 % 60);

	    var hourString = padWithZero(hours);
	    var minuteString = padWithZero(minutes);
	    var secondString = padWithZero(seconds);

	    if (hours) {
	        return hourString + ':' + minuteString + ':' + secondString;
	    } else {
	        return minuteString + ':' + secondString;
	    }
	}

/***/ }
/******/ ]);