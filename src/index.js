import { toMilliseconds, toTimecode } from './utils/timecode';
import { play, stop, next, prev, pause, resume } from './controls';
import { at } from './subscriptions';
import { addSets } from './actions';
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

    pause() {
        return pause(this);
    },

    resume() {
        return resume(this);
    },

    // Subscriptions
    at(trackId, time, fn) {
        return at.apply(null, [this, ...arguments]);
    },

    // Set/track addition
    addSets(setIds, options) {
        return addSets.apply(null, [this, ...arguments]);
    }


}

Player.initializeSoundcloud = function(clientId) {
    return SC.initialize({
        client_id: clientId
    });
}


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

Player.makeTrackActive = function(trackIndex) {
    let tracksEl = this.tracksEl;
    let track = Array.from(tracksEl.children).filter((el) => {
        return parseInt(el.getAttribute('data-track-index'), 10) === parseInt(trackIndex, 10);
    });

    track[0].classList.add('sc-track--active');

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
