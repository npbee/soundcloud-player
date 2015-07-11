import { toMilliseconds, toTimecode } from '../utils/timecode';

export function at(player, trackId, time, fn) {
    if (!player.subscriptions[trackId]) {
        player.subscriptions[trackId] = [];
    }

    if (typeof time === 'string') {
        time = toMilliseconds(time);
    }

    player.subscriptions[trackId].push({
        time: time,
        fn: fn
    });
};
