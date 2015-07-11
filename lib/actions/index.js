'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.addSets = addSets;

var _sc = require('../sc');

var _dom = require('../dom');

function addSets(player, setIds) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    player.busy = true;

    if (typeof setIds === 'string') {
        setIds = [setIds];
    }

    if (!Array.isArray(options)) {
        options = [options];
    }

    var promises = setIds.map(function (setId, index) {
        return (0, _sc.get)('/playlists/' + setId);
    });

    return Promise.all(promises).then(function (sets) {

        sets.forEach(function (set) {
            set.tracks.forEach(function (track, index) {
                var opts = options.length > 1 ? options[index] : options[0];

                if (!player.trackOptions[track.id]) {
                    player.trackOptions[track.id] = opts;
                }

                player.tracks.push(track);
            });
        });

        (0, _dom.appendTrackLinks)(player);
        (0, _dom.appendControls)(player);
        player.busy = false;
        return sets;
    });
}