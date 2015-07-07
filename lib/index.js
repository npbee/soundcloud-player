'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _timecode = require('./timecode');

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
            var nodes = Array.from(this.tracksEl.children);

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

            return Promise.all(promises).then(function (sets) {

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

            return Promise.all(promises).then(function (tracks) {

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
            return new Promise(function (resolve, reject) {
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
            var opts = Object.assign({
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
            var track = Array.from(tracksEl.children).filter(function (el) {
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
                track = Object.assign(track, scTrack);

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

exports['default'] = Player;
module.exports = exports['default'];