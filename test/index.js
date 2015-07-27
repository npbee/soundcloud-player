import Player from '../src';
import test from 'tape';
import * as sinon from 'sinon';
import objectAssign from 'object-assign';

let baseParams = {
    clientId: '1'
};

let noop = function() {};

const setup = () => {
    const fixtures = {};

    fixtures.player = Object.create(Player);
    fixtures.globalSC = global.SC;

    global.SC = { initialize: noop };

    return fixtures;
};

const teardown = (fixtures) => {
    global.SC = fixtures.globalSC;
};

test('Player initialization - Error Checking', function(t) {
    const fixtures = setup();
    const player = fixtures.player;

    t.plan(3);

    global.SC = void 0;

    t.throws(player.init, /SC/, 'An error should be thrown when no global SC object is found.');

    global.SC = {};

    t.throws(player.init, /options/, 'An error should be thrown when no options object is found.');

    t.throws(player.init.bind(player, {}), /clientId/, 'An error should be thrown when no clientId option is provided.');

    teardown(fixtures);
});

test('Player initialization - options', t => {
    const fixtures = setup();
    const player = fixtures.player;

    t.plan(2);

    player.init(objectAssign(baseParams, { someOption: true }));

    t.ok(player.someOption, 'The provided options object should be assigned to the player.');

    player.init(objectAssign(baseParams, { showWaveform: false }));

    t.notOk(player.showWaveform, 'The provided options should take precendent over the defaults.');
});
