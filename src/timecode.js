export function toMilliseconds (str) {
    let regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

    let match = str.match(regex);

    if (match) {
        let hours = parseInt(match[1], 10) || 0;
        let minutes = parseInt(match[2], 10) || 0;
        let seconds = parseInt(match[3], 10) || 0;

        return (hours * 60 * 60 * 1000) +
            (minutes * 60 * 1000) +
            (seconds * 1000);

    } else {
        throw new Error('Timecode could not be parsed.');
    }

}

function padWithZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}
export function toTimecode (ms) {
    let hours = Math.floor(ms / (60 * 60 * 1000));
    let minutes = Math.floor((ms / 60000) % 60);
    let seconds = Math.floor((ms / 1000) % 60);

    let hourString = padWithZero(hours);
    let minuteString = padWithZero(minutes);
    let secondString = padWithZero(seconds);

    if (hours) {
        return `${hourString}:${minuteString}:${secondString}`;
    } else {
        return `${minuteString}:${secondString}`;
    }

}
