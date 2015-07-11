import { toMilliseconds, toTimecode } from './utils/timecode';
import { play, stop, next, prev, pause, resume } from './controls';
import { at } from './subscriptions';
import { addSets, addTracks } from './actions';
import objectAssign from 'object-assign';
import { bindKeys } from './dom';
import { init as scInit } from './sc';

let Player = {

    init(options) {

        let defaults = {
            showWaveform: true
        };

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

        objectAssign(this, defaults, options);

        // Props
        this.tracks = [];
        this.subscriptions = {};
        this.trackOptions = {};
        this.currentTrackIndex = 0;

        // State
        this.busy = false;
        this.playing = false;
        this.paused = false;

        scInit(this.clientId);

        if (typeof window === 'object') {
            bindKeys(this);
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
    },

    addTracks(trackIds, options) {
        return addTracks.apply(null, [this, ...arguments]);
    }


}

export default Player;
