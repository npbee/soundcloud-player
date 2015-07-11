'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _slice = Array.prototype.slice;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsTimecode = require('./utils/timecode');

var _controls = require('./controls');

var _subscriptions = require('./subscriptions');

var _actions = require('./actions');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _dom = require('./dom');

var _sc = require('./sc');

var Player = {

    init: function init(options) {

        var defaults = {
            showWaveform: true
        };

        if (typeof SC !== 'object') {
            throw new Error('No "SC" Soundcloud object found.  You need to first load the ' + 'Soundcloud SDK before loading the player.');
        }

        if (!options) {
            throw new Error('Please provide an options object to the constructor.');
        }

        if (!options.clientId) {
            throw new Error('Please provide a "clientId" parameter to the constructor');
        }

        (0, _objectAssign2['default'])(this, defaults, options);

        // Props
        this.tracks = [];
        this.subscriptions = {};
        this.trackOptions = {};
        this.currentTrackIndex = 0;

        // State
        this.busy = false;
        this.playing = false;
        this.paused = false;

        (0, _sc.init)(this.clientId);

        if (typeof window === 'object') {
            (0, _dom.bindKeys)(this);
        }
    },

    // Player controls API
    play: function play(trackNo) {
        return (0, _controls.play)(this, trackNo);
    },

    stop: function stop() {
        return (0, _controls.stop)(this);
    },

    next: function next() {
        return (0, _controls.play)(this, ++this.currentTrackIndex);
    },

    prev: function prev() {
        return (0, _controls.play)(this, --this.currentTrackIndex);
    },

    pause: function pause() {
        return (0, _controls.pause)(this);
    },

    resume: function resume() {
        return (0, _controls.resume)(this);
    },

    // Subscriptions
    at: function at(trackId, time, fn) {
        return _subscriptions.at.apply(null, [this].concat(_slice.call(arguments)));
    },

    // Set/track addition
    addSets: function addSets(setIds, options) {
        return _actions.addSets.apply(null, [this].concat(_slice.call(arguments)));
    },

    addTracks: function addTracks(trackIds, options) {
        return _actions.addTracks.apply(null, [this].concat(_slice.call(arguments)));
    }

};

exports['default'] = Player;
module.exports = exports['default'];