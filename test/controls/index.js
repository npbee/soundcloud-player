import test from 'tape';
import * as sinon from 'sinon';
import * as controls from '../../src/controls';

function setup(mocks) {
    const fixtures = {};

    fixtures.player = {
        playing: false,
        busy: false,
        tracks: [1],
        trackOptions: {},
        currentSoundObject: {
            stop: sinon.spy()
        }
    };

    return fixtures;
}

function teardown(fixtures) {
}

test('Controls#stop', t => {
    const fixtures = setup();
    const player = fixtures.player;

    controls.stop(player);
    t.ok(player.currentSoundObject.stop.called, 'The stop method on the sound object should be called.');

    t.end();
});
