import { toMilliseconds, toTimecode} from '../src/utils/timecode';
import { expect } from 'chai';

describe('Timecode', function() {

    describe('#toMilliseconds', function() {

        it('Should return milliseconds given a timecode string', function() {
            expect(toMilliseconds('00:01')).to.equal(1000);
            expect(toMilliseconds('01:01')).to.equal(61000);
            expect(toMilliseconds('01:01:01')).to.equal(3661000);
        });

    });

    describe('#toTimecode', function() {

        it('Should return a string of timecodes given a number in milliseconds', function() {
            expect(toTimecode(1000)).to.equal('00:01');
        });

        it('Should only return hours if there are hours matched', function() {
            expect(toTimecode(3599999)).to.equal('59:59');
            expect(toTimecode(3600000)).to.equal('01:00:00');
        });

        it('Should pad with zeroes when less than 10', function() {
            expect(toTimecode(1000)).to.equal('00:01');
            expect(toTimecode(10000)).to.equal('00:10');
        });
    });

});
