import objectAssign from 'object-assign';
import { toMilliseconds, toTimecode } from '../utils/timecode';
import { stream as scStream } from '../sc';

function stream(player, track, options = {}) {

    let opts = objectAssign({
        onload: function() {
            var subs = player.subscriptions[track.id];
            let sound = this;

            if (subs.length) {
                subs.forEach(function(sub) {
                    sound.onPosition(sub.time, sub.fn);
                });
            }

            if (player.waveform && player.waveform.onload) {
                player.waveform.onload(this);
            }
        },
        whileplaying: function() {
            var relative = this.position / this.duration;
            var timecode = toTimecode(this.position);
            var duration = toTimecode(this.duration);

            player.timeEl.textContent = `${timecode} / ${duration}`;

            if (player.waveform && player.waveform.whileplaying) {
                player.waveform.whileplaying(this);
            } else {
                player.played.style.width = (100 * relative) + '%';
            }
        }
    }, options);

    scStream(track.uri, opts, function(sound) {
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

        let waveform = player.waveform = player.onWaveformCreate(track);

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

        let base = document.createElement('div');
        let img = document.createElement('img');
        base.classList.add('sc-waveform');
        img.src = track.waveform_url;
        base.appendChild(img);

        player.scrubberEl.appendChild(base);
    }

    player.scrubberEl.addEventListener('click', function(e) {
        player.scrub(e.pageX);
    });
}

export function play(player, trackIndex = 0) {
    if (player.playing) {
        stop(player);
    }

    if (player.busy) {
        setTimeout(function() {
            play(player, trackIndex);
        }, 0);
        return;
    }

    if (!player.tracks.length) {
        throw new Error("There are no tracks in the player!");
    }

    let track = player.tracks[trackIndex];

    if (!track) {
        return;
    }

    let opts = player.trackOptions[track.id];

    prepareScrubber(player, track);
    //self.removeActiveTrackLinks();
    //self.makeTrackActive(trackNo || 0);

    return stream(player, track, opts);
}

export function stop(player) {
    return player.currentSoundObject.stop();
}

export function pause(player) {
    player.paused = true;
    player.playing = false;
    document.body.classList.remove('sc--playing');
    document.body.classList.add('sc--paused');
    player.currentSoundObject.pause();
}

export function resume(player) {
    player.paused = false;
    player.playing = true;
    document.body.classList.remove('sc--paused');
    document.body.classList.add('sc--playing');
    player.currentSoundObject.resume();
}

