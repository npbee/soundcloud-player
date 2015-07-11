'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.bindScrubberEvents = bindScrubberEvents;
exports.appendTrackLinks = appendTrackLinks;
exports.appendControls = appendControls;
exports.removeActiveTrackLinks = removeActiveTrackLinks;
exports.makeTrackActive = makeTrackActive;
exports.bindKeys = bindKeys;

var _controls = require('../controls');

var slice = Array.prototype.slice;

function bindControlEvents(player) {
    var controlsEl = player.controlsEl;

    controlsEl.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'A') {
            var target = e.target;

            if (target.classList.contains('sc-prev')) {
                (0, _controls.prev)(player);
            }

            if (target.classList.contains('sc-next')) {
                (0, _controls.next)(player);
            }

            if (target.classList.contains('sc-play')) {
                if (document.body.classList.contains('sc--paused')) {
                    (0, _controls.resume)(player);
                } else {
                    (0, _controls.play)(player);
                }
                document.body.classList.add('sc--playing');
                document.body.classList.remove('sc--paused');
            }

            if (target.classList.contains('sc-pause')) {
                document.body.classList.add('sc--paused');
                document.body.classList.remove('sc--playing');
                (0, _controls.pause)(player);
            }
        }
    });
}

function bindTrackEvents(player) {
    var tracksEl = player.tracksEl;

    tracksEl.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'A') {
            var target = e.target;
            var index = target.getAttribute('data-track-index');

            (0, _controls.play)(player, index);
        }
    });
}

function bindScrubberEvents(player) {
    player.scrubberEl.addEventListener('click', function (e) {
        (0, _controls.seek)(player, e.pageX);
    });
}

;

function appendTrackLinks(player) {
    var tracks = player.tracks;
    var tracksEl = player.tracksEl;
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

    bindTrackEvents(player);
}

;

function appendControls(player) {
    var controlsEl = player.controlsEl;
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

    bindControlEvents(player);
}

;

function removeActiveTrackLinks(player) {
    var nodes = slice.call(player.tracksEl.children);

    nodes.forEach(function (node) {
        node.classList.remove('sc-track--active');
    });
}

;

function makeTrackActive(player, trackIndex) {
    var tracksEl = player.tracksEl;
    var track = slice.call(tracksEl.children).filter(function (el) {
        return parseInt(el.getAttribute('data-track-index'), 10) === parseInt(trackIndex, 10);
    });

    track[0].classList.add('sc-track--active');
}

;

function bindKeys(player) {
    document.body.addEventListener('keydown', function (event) {
        var key = event.keyCode || event.which;

        // Space
        if (key === 32) {
            if (player.playing) {
                (0, _controls.pause)(player);
            } else if (player.paused) {
                (0, _controls.resume)(player);
            } else {
                (0, _controls.play)(player);
            }
        }

        // right arrow
        if (key === 39) {
            player.next();
        }

        if (key === 37) {
            player.prev();
        }
    });
}

;