import { get as scGet } from '../sc';
import { appendTrackLinks, appendControls } from '../dom';

export function addSets(player, setIds, options = {}) {

    player.busy = true;

    if (typeof setIds === 'string') {
        setIds = [setIds];
    }

    if (!Array.isArray(options)) {
        options = [options];
    }

    let promises = setIds.map((setId, index) => {
        return scGet(`/playlists/${setId}`);
    });

    return Promise.all(promises)
        .then(function(sets) {

            sets.forEach(function(set) {
                set.tracks.forEach(function(track, index) {
                    let opts = options.length > 1 ? options[index] : options[0];

                    if (!player.trackOptions[track.id]) {
                        player.trackOptions[track.id] = opts;
                    }

                    player.tracks.push(track);
                });

            });

            appendTrackLinks(player);
            appendControls(player);
            player.busy = false;
            return sets;
        });
}
