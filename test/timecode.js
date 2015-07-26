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
    t.plan(3);

    t.equal(toTimecode(1000), '00:01', 'Timecode should be returned when given a number in millisecond');

    t.equal(toTimecode(3599999), '59:59', 'Hours should only be returned when there are hours matched.');
});

//describe('Timecode', function() {

    //describe('#toMilliseconds', function() {

        //it('Should return milliseconds given a timecode string', function() {
            //expect(toMilliseconds('00:01')).to.equal(1000);
            //expect(toMilliseconds('01:01')).to.equal(61000);
            //expect(toMilliseconds('01:01:01')).to.equal(3661000);
        //});

    //});

    //describe('#toTimecode', function() {

        //it('Should return a string of timecodes given a number in milliseconds', function() {
            //expect(toTimecode(1000)).to.equal('00:01');
        //});

        //it('Should only return hours if there are hours matched', function() {
            //expect(toTimecode(3599999)).to.equal('59:59');
            //expect(toTimecode(3600000)).to.equal('01:00:00');
        //});

        //it('Should pad with zeroes when less than 10', function() {
            //expect(toTimecode(1000)).to.equal('00:01');
            //expect(toTimecode(10000)).to.equal('00:10');
        //});
    //});

//});
