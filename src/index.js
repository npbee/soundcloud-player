import { toMilliseconds, toTimecode } from './timecode';

export class Player {
    constructor(options) {

        if (typeof SC !== 'object') {
            throw new Error('No "SC" Soundcloud object found.  You need to first load the ' +
                'Soundcloud SDK before loading the player.');
        }

        if (!options) {
            throw new Error('Please provide an options object to the constructor.');
        }

        if (!options.clientId) {
            throw new Error('Please provide a "clientId" parameter to the constructor');
        }

        this.clientId = options.clientId;

        // Provided DOM elements
        this.scrubberEl = options.scrubberEl || undefined;;
        this.timeEl = options.timeEl || undefined;;
        this.tracksEl = options.tracksEl || undefined;;
        this.controlsEl = options.controlsEl || undefined;

        // Props
        this.tracks = [];
        this.subscriptions = {};
        this.trackOptions = {};
        this.currentTrackIndex = 0;

        // State
        this.busy = false;
        this.playing = false;
        this.paused = false;

        this.initializeSoundcloud(this.clientId);

        if (typeof window === 'object') {
            this.bindKeys();
        }
    }

    initializeSoundcloud (clientId) {
        return SC.initialize({
            client_id: clientId
        });
    }

    /**
     * If a `controlsEl` param is provided, this function will append a basic
     * DOM fragment to control the player
     */
    appendControls () {
        let controlsEl = this.controlsEl;
        let frag = document.createDocumentFragment();

        let prev = document.createElement('a');
        prev.textContent = 'Previous';
        prev.className = 'sc-prev';
        frag.appendChild(prev);

        let play = document.createElement('a');
        play.textContent = 'Play';
        play.className = 'sc-play';
        frag.appendChild(play);

        let pause = document.createElement('a');
        pause.textContent = 'Pause';
        pause.className = 'sc-pause';
        frag.appendChild(pause);

        let next = document.createElement('a');
        next.textContent = 'Next';
        next.className = 'sc-next';
        frag.appendChild(next);

        controlsEl.appendChild(frag);

        this.bindControlEvents();
    }

    /**
     * If a `tracksEl` param is provided, this function will append a DOM
     * fragment for each track in the player.  It will also bind events to each
     * track to control the player
     */
    appendTrackLinks () {
        let tracks = this.tracks;
        let tracksEl = this.tracksEl;
        let frag = document.createDocumentFragment();

        tracks.forEach(function(track, index) {
            let name = track.title;
            let link = document.createElement('a');

            link.textContent = name;
            link.setAttribute('data-track-index', index);
            link.className = 'sc-track';

            frag.appendChild(link);
        });

        tracksEl.appendChild(frag);

        this.bindTrackEvents();
    }

    /**
     * Removes the active class from all of the track links
     */
    removeActiveTrackLinks (nodes) {
        nodes = Array.from(nodes);

        nodes.forEach(function(node) {
            node.classList.remove('sc-track--active');
        });
    }

    /***********
     * DOM STUFF
     **********/
    bindKeys () {
        let player = this;

        document.body.addEventListener('keydown', player.onKeyboardEvent.bind(player));
    }

    /**
     * Takes a `keydown` event and performs logic to control the player
     *
     */
    onKeyboardEvent (event) {
        var key = event.keyCode || event.which;
        let player = this;

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

    bindControlEvents () {
        let controlsEl = this.controlsEl;
        let player = this;

        controlsEl.addEventListener('click', function(e) {
            if (e.target && e.target.nodeName === 'A') {
                let target = e.target;

                if (target.classList.contains('sc-prev')) {
                    player.prev();
                }

                if (target.classList.contains('sc-next')) {
                    player.next();
                }

                if (target.classList.contains('sc-play')) {
                    if (controlsEl.classList.contains('sc--paused')) {
                        player.resume();
                    } else {
                        player.play();
                    }
                    controlsEl.classList.add('sc--playing');
                    controlsEl.classList.remove('sc--paused');
                }

                if (target.classList.contains('sc-pause')) {
                    controlsEl.classList.add('sc--paused');
                    controlsEl.classList.remove('sc--playing');
                    player.pause();
                }
            }
        });
    }

    bindTrackEvents () {
        let tracksEl = this.tracksEl;
        let player = this;

        tracksEl.addEventListener('click', function(e) {
            if (e.target && e.target.nodeName === 'A') {
                let target = e.target;
                let index = target.getAttribute('data-track-index');

                player.removeActiveTrackLinks(tracksEl.children);
                target.classList.add('sc-track--active');

                player.play(index);
            }
        });
    }

    addSets (setIds, options) {
        var self = this;
        self.busy = true;

        if (typeof setIds === 'string') {
            setIds = [setIds];
        }

        if (!Array.isArray(options)) {
            options = [options];
        }

        var promises = setIds.map((setId, index) => {
            return this.get(`/playlists/${setId}`);
        });

        return Promise.all(promises)
            .then(function(sets) {

                sets.forEach(function(set) {
                    set.tracks.forEach(function(track, index) {
                        let opts = options.length > 1 ? options[index] : options[0];

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

    addTracks (trackIds, options) {
        var self = this;
        self.busy = true;

        if (typeof trackIds === 'string') {
            trackIds = [trackIds];
        }

        if (!Array.isArray(options)) {
            options = [options];
        }

        var promises = trackIds.map((trackId, index) => {
            return this.get(`/tracks/${trackId}`);
        });

        return Promise.all(promises)
            .then(function(tracks) {

                tracks.forEach(function(track, index) {
                    let opts = options.length > 1 ? options[index] : options[0];

                    if (!self.trackOptions[track.id]) {
                        self.trackOptions[track.id] = opts;
                    }

                    self.tracks.push(track);
                });

                self.busy = false;
                return tracks;
            });
    }

    at (trackId, time, fn) {
        if (!this.subscriptions[trackId]) {
            this.subscriptions[trackId] = [];
        }

        if (typeof time === 'string') {
            time = toMilliseconds(time);
        }

        this.subscriptions[trackId].push({
            time: time,
            fn: fn
        });
    }

    get (uri, options) {
        return new Promise(function(resolve, reject) {
            SC.get(uri, options, function(thing, err) {
                if (err) { return reject(err); }

                resolve(thing);
            });
        });
    }

    stream (track, options = {}) {
        let player = this;
        let trackOptions = player.trackOptions[track.id] || {};
        let opts = Object.assign({
            onload: function() {
                var subs = player.subscriptions[track.id];
                let sound = this;

                if (subs.length) {
                    subs.forEach(function(sub) {
                        sound.onPosition(sub.time, sub.fn);
                    });
                }
            },
            whileplaying: options.whileplaying || function() {
                var relative = this.position / this.duration;
                var timecode = toTimecode(this.position);

                player.timeEl.textContent = timecode;
                player.played.style.width = (100 * relative) + '%';
            }
        }, trackOptions, options);

        SC.stream(track.uri, opts, function(sound) {
            player.currentSoundObject = sound;
            sound.play();
            player.playing = true;
            player.paused = false;
        });
    }

    next () {
        this.play(++this.currentTrackIndex);
    }

    prev () {
        this.play(--this.currentTrackIndex);
    }

    play (trackNo) {
        var self = this;

        if (self.playing) {
            self.stop();
        }

        if (this.busy) {
            setTimeout(function() {
                self.play(trackNo);
            }, 0);
            return;
        }

        if (!this.tracks.length) {
            throw new Error("There are no tracks in the player!");
        }

        let track = this.tracks[trackNo || 0];

        if (!track) {
            return;
        }

        this.prepareScrubber(track);

        let opts = this.trackOptions[track.id];

        return this.stream(track, opts || {});
    }

    stop () {
        this.currentSoundObject.stop();
    }

    pause () {
        this.paused = true;
        this.playing = false;
        this.currentSoundObject.pause();
    }

    resume () {
        this.paused = false;
        this.playing = true;
        this.currentSoundObject.resume();
    }

    push (track, options) {
        var self = this;

        self.busy = true;

        this.get(`/tracks/${track.uri}`, options)
            .then(function(scTrack) {
                track = Object.assign(track, scTrack);

                self.tracks.push(track);

                self.busy = false;
            });
    }

    scrub (position) {
        var rect = this.scrubberEl.getBoundingClientRect();
        var left = rect.left;
        var width = this.scrubberEl.offsetWidth;
        var relative = (position - left) / width;

        this.seek(relative);
    }

    seek (relative) {
        var track = this.currentSoundObject;
        var duration = track.duration;
        var newTime = duration * relative;

        track.setPosition(newTime);
    }

    prepareScrubber (track) {
        let self = this;

        if (!this.played) {
            this.played = document.createElement('div');
            this.played.classList.add('sc-played');
            this.scrubberEl.appendChild(this.played);
        }

        this.scrubberEl.style.background = `url(${track.waveform_url}) 0 0 / cover no-repeat`;
        this.scrubberEl.addEventListener('click', function(e) {
            self.scrub(e.pageX);
        });
    }

}
