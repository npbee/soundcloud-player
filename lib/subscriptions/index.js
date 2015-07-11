'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.at = at;

var _utilsTimecode = require('../utils/timecode');

function at(player, trackId, time, fn) {
    if (!player.subscriptions[trackId]) {
        player.subscriptions[trackId] = [];
    }

    if (typeof time === 'string') {
        time = (0, _utilsTimecode.toMilliseconds)(time);
    }

    player.subscriptions[trackId].push({
        time: time,
        fn: fn
    });
}

;