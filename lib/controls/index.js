'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.play = play;
exports.seek = seek;
exports.stop = stop;
exports.pause = pause;
exports.resume = resume;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utilsTimecode = require('../utils/timecode');

var _sc = require('../sc');

var _dom = require('../dom');

function stream(player, track) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    var opts = (0, _objectAssign2['default'])({
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
        whileplaying: function whileplaying() {
            var relative = this.position / this.duration;
            var timecode = (0, _utilsTimecode.toTimecode)(this.position);
            var duration = (0, _utilsTimecode.toTimecode)(this.duration);

            player.timeEl.textContent = timecode + ' / ' + duration;

            if (player.waveform && player.waveform.whileplaying) {
                player.waveform.whileplaying(this);
            } else {
                player.played.style.width = 100 * relative + '%';
            }
        }
    }, options);

    (0, _sc.stream)(track.uri, opts, function (sound) {
        player.currentSoundObject = sound;
        sound.play();
        player.playing = true;
        player.paused = false;

        if (typeof window === 'object') {
            document.body.classList.add('sc--playing');
        }
    });
}

function prepareScrubber(player, track) {

    if (player.onWaveformCreate) {
        player.scrubberEl.innerHTML = '';

        var waveform = player.waveform = player.onWaveformCreate(track);

        if (waveform.element) {
            player.scrubberEl.appendChild(waveform.element);
        } else {
            player.scrubberEl.appendChild(waveform);
        }
    } else if (player.showWaveform) {

        if (!player.played) {
            player.played = document.createElement('div');
            player.played.classList.add('sc-played');
            player.scrubberEl.appendChild(player.played);
        }

        var base = document.createElement('div');
        var img = document.createElement('img');
        base.classList.add('sc-waveform');
        img.src = track.waveform_url;
        base.appendChild(img);

        player.scrubberEl.appendChild(base);
    }

    (0, _dom.bindScrubberEvents)(player);
}

function play(player) {
    var trackIndex = arguments[1] === undefined ? 0 : arguments[1];

    if (player.playing) {
        stop(player);
    }

    if (player.busy) {
        setTimeout(function () {
            play(player, trackIndex);
        }, 0);
        return;
    }

    if (!player.tracks.length) {
        throw new Error('There are no tracks in the player!');
    }

    var track = player.tracks[trackIndex];

    if (!track) {
        return;
    }

    var opts = player.trackOptions[track.id];

    prepareScrubber(player, track);
    (0, _dom.removeActiveTrackLinks)(player);
    (0, _dom.makeTrackActive)(player, trackIndex);

    return stream(player, track, opts);
}

function seek(player, xPos) {
    var rect = player.scrubberEl.getBoundingClientRect();
    var left = rect.left;
    var width = player.scrubberEl.offsetWidth;
    var relative = (xPos - left) / width;
    var track = player.currentSoundObject;
    var duration = track.duration;
    var newTime = duration * relative;

    track.setPosition(newTime);
}

;

function stop(player) {
    return player.currentSoundObject.stop();
}

function pause(player) {
    player.paused = true;
    player.playing = false;
    document.body.classList.remove('sc--playing');
    document.body.classList.add('sc--paused');
    player.currentSoundObject.pause();
}

function resume(player) {
    player.paused = false;
    player.playing = true;
    document.body.classList.remove('sc--paused');
    document.body.classList.add('sc--playing');
    player.currentSoundObject.resume();
}