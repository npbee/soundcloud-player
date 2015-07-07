'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.toMilliseconds = toMilliseconds;
exports.toTimecode = toTimecode;

function toMilliseconds(str) {
    var regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

    var match = str.match(regex);

    if (match) {
        var hours = parseInt(match[1], 10) || 0;
        var minutes = parseInt(match[2], 10) || 0;
        var seconds = parseInt(match[3], 10) || 0;

        return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    } else {
        throw new Error('Timecode could not be parsed.');
    }
}

function padWithZero(num) {
    return num < 10 ? '0' + num : '' + num;
}

function toTimecode(ms) {
    var hours = Math.floor(ms / (60 * 60 * 1000));
    var minutes = Math.floor(ms / 60000 % 60);
    var seconds = Math.floor(ms / 1000 % 60);

    var hourString = padWithZero(hours);
    var minuteString = padWithZero(minutes);
    var secondString = padWithZero(seconds);

    if (hours) {
        return hourString + ':' + minuteString + ':' + secondString;
    } else {
        return minuteString + ':' + secondString;
    }
}