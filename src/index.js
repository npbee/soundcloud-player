import { toMilliseconds, toTimecode } from './utils/timecode';
import { play, stop } from './controls';
import { at } from './subscriptions';
import objectAssign from 'object-assign';

let Player = {

    init(options) {
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

        objectAssign(this, options);

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
    },

    // Player controls API
    play(trackNo) {
        return play(this, trackNo);
    },

    stop() {
        return stop(this);
    },

    next() {
        return play(this, ++this.currentTrackIndex);
    },

    prev() {
        return play(this, --this.currentTrackIndex);
    },

    // Subscriptions
    at(trackId, time, fn) {
        return at.apply(null, [this, ...arguments]);
    }

}

Player.initializeSoundcloud = function(clientId) {
    return SC.initialize({
        client_id: clientId
    });
}

//Player.at = function(trackId, time, fn) {
    //if (!this.subscriptions[trackId]) {
        //this.subscriptions[trackId] = [];
    //}

    //if (typeof time === 'string') {
        //time = toMilliseconds(time);
    //}

    //this.subscriptions[trackId].push({
        //time: time,
        //fn: fn
    //});
//}

Player.addSets = function(setIds, options) {
    let self = this;

    self.busy = true;

    if (typeof setIds === 'string') {
        setIds = [setIds];
    }

    if (!Array.isArray(options)) {
        options = [options];
    }

    let promises = setIds.map((setId, index) => {
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

Player.get = function(uri, options) {
    return new Promise(function(resolve, reject) {
        SC.get(uri, options, function(thing, err) {
            if (err) { return reject(err); }

            resolve(thing);
        });
    });
}

//Player.stream = function(track, options = {}) {
    //let player = this;
    //let trackOptions = player.trackOptions[track.id] || {};
    //let opts = Object.assign({
        //onload: function() {
            //var subs = player.subscriptions[track.id];
            //let sound = this;

            //if (subs.length) {
                //subs.forEach(function(sub) {
                    //sound.onPosition(sub.time, sub.fn);
                //});
            //}

            //if (player.waveform && player.waveform.onload) {
                //player.waveform.onload(this);
            //}
        //},
        //whileplaying: options.whileplaying || function() {
            //var relative = this.position / this.duration;
            //var timecode = toTimecode(this.position);
            //var duration = toTimecode(this.duration);

            //console.log("value");

            //player.timeEl.textContent = `${timecode} / ${duration}`;

            //if (player.waveform && player.waveform.whileplaying) {
                //player.waveform.whileplaying(this);
            //} else {
                //player.played.style.width = (100 * relative) + '%';
            //}
        //}
    //}, trackOptions, options);

    //SC.stream(track.uri, opts, function(sound) {
        //player.currentSoundObject = sound;
        //sound.play();
        //player.playing = true;
        //player.paused = false;

        //if (typeof window === 'object') {
            //document.body.classList.add('sc--playing');
        //}
    //});
//}

Player.appendTrackLinks = function() {
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

Player.bindTrackEvents = function() {
    let tracksEl = this.tracksEl;
    let player = this;

    tracksEl.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'A') {
            let target = e.target;
            let index = target.getAttribute('data-track-index');

            player.play(index);
        }
    });
}

Player.appendControls = function() {
    let controlsEl = this.controlsEl;
    let frag = document.createDocumentFragment();

    let prev = document.createElement('a');
    let prevSpan = document.createElement('span');
    prevSpan.textContent = 'Previous';
    prev.className = 'sc-prev';
    prev.appendChild(prevSpan);
    frag.appendChild(prev);

    let play = document.createElement('a');
    let playSpan = document.createElement('span');
    playSpan.textContent = 'Play';
    play.className = 'sc-play';
    play.appendChild(playSpan);
    frag.appendChild(play);

    let pause = document.createElement('a');
    let pauseSpan = document.createElement('span');
    pauseSpan.textContent = 'Play';
    pause.className = 'sc-pause';
    pause.appendChild(pauseSpan);
    frag.appendChild(pause);

    let next = document.createElement('a');
    let nextSpan = document.createElement('span');
    nextSpan.textContent = 'Play';
    next.className = 'sc-next';
    next.appendChild(nextSpan);
    frag.appendChild(next);

    controlsEl.appendChild(frag);

    this.bindControlEvents();
}

Player.bindControlEvents = function() {
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

//Player.next = function() {
    //this.play(++this.currentTrackIndex);
//}

//Player.prev = function() {
    //this.play(--this.currentTrackIndex);
//}

//Player.play = function(trackNo) {
    //var self = this;

    //if (self.playing) {
        //self.stop();
    //}

    //if (this.busy) {
        //setTimeout(function() {
            //self.play(trackNo);
        //}, 0);
        //return;
    //}

    //if (!this.tracks.length) {
        //throw new Error("There are no tracks in the player!");
    //}

    //let track = this.tracks[trackNo || 0];

    //if (!track) {
        //return;
    //}

    //this.prepareScrubber(track);

    //let opts = this.trackOptions[track.id];

    //self.removeActiveTrackLinks();
    //self.makeTrackActive(trackNo || 0);

    //return this.stream(track, opts || {});
//}

Player.makeTrackActive = function(trackIndex) {
    let tracksEl = this.tracksEl;
    let track = Array.from(tracksEl.children).filter((el) => {
        return parseInt(el.getAttribute('data-track-index'), 10) === parseInt(trackIndex, 10);
    });

    track[0].classList.add('sc-track--active');

}

//Player.stop = function() {
    //this.currentSoundObject.stop();
    //document.body.classList.remove('sc--playing');
//}

Player.pause = function() {
    this.paused = true;
    this.playing = false;
    document.body.classList.remove('sc--playing');
    document.body.classList.add('sc--paused');
    this.currentSoundObject.pause();
}

Player.resume = function() {
    this.paused = false;
    this.playing = true;
    document.body.classList.remove('sc--paused');
    document.body.classList.add('sc--playing');
    this.currentSoundObject.resume();
}

Player.push = function(track, options) {
    var self = this;

    self.busy = true;

    this.get(`/tracks/${track.uri}`, options)
        .then(function(scTrack) {
            track = Object.assign(track, scTrack);

            self.tracks.push(track);

            self.busy = false;
        });
}

Player.scrub = function(position) {
    var rect = this.scrubberEl.getBoundingClientRect();
    var left = rect.left;
    var width = this.scrubberEl.offsetWidth;
    var relative = (position - left) / width;

    this.seek(relative);
}

Player.seek = function(relative) {
    var track = this.currentSoundObject;
    var duration = track.duration;
    var newTime = duration * relative;

    track.setPosition(newTime);
}

Player.prepareScrubber = function(track) {
    let self = this;

    if (this.onWaveformCreate) {
        this.scrubberEl.innerHTML = '';

        let waveform = this.waveform = this.onWaveformCreate(track);

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

        let base = document.createElement('div');
        let img = document.createElement('img');
        base.classList.add('sc-waveform');
        img.src = track.waveform_url;
        base.appendChild(img);

        this.scrubberEl.appendChild(base);
    }

    this.scrubberEl.addEventListener('click', function(e) {
        self.scrub(e.pageX);
    });

}

Player.removeActiveTrackLinks = function() {
    let nodes = Array.from(this.tracksEl.children);

    nodes.forEach(function(node) {
        node.classList.remove('sc-track--active');
    });
}

Player.bindKeys = function() {
    let player = this;

    document.body.addEventListener('keydown', player.onKeyboardEvent.bind(player));
}

Player.onKeyboardEvent = function(event) {
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

export default Player;
