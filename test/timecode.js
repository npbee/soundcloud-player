import { toMilliseconds, toTimecode} from '../src/utils/timecode';
import { expect } from 'chai';
import test from 'tape';

test('Timecode#toMilliseconds', t => {
    t.plan(3);

    t.equal(toMilliseconds('00:01'), 1000);
    t.equal(toMilliseconds('01:01'), 61000);
    t.equal(toMilliseconds('01:01:01'), 3661000);
});

test('Timecode#toTimecode', t => {
    t.plan(5);

    t.equal(toTimecode(1000), '00:01', 'Timecode should be returned when given a number in millisecond');

    t.equal(toTimecode(3599999), '59:59', 'Hours should only be returned when there are hours matched.');
    t.equal(toTimecode(3600000), '01:00:00', 'Hours should only be returned when there are hours matched.');

    t.equal(toTimecode(1000), '00:01', 'Zeroes should be padded.');
    t.equal(toTimecode(10000), '00:10', 'Zeroes should be padded.');
});
