import Player from '../src';
import test from 'tape';
import * as sinon from 'sinon';

let baseParams = {
    clientId: '1'
};

let noop = function() {};

const setup = () => {
    const fixtures = {};

    fixtures.player = Object.create(Player);
    fixtures.globalSC = global.SC;

    return fixtures;
};

const teardown = (fixtures) => {
    global.SC = fixtures.globalSC;
};

test('Player initialization', function(t) {
    const fixtures = setup();
    const player = fixtures.player;

    t.plan(3);

    t.throws(player.init, /SC/, 'An error should be thrown when no global SC object is found.');

    global.SC = {};

    t.throws(player.init, /options/, 'An error should be thrown when no options object is found.');

    t.throws(player.init.bind(player, {}), /clientId/, 'An error should be thrown when no clientId option is provided.');

    teardown(fixtures);
});
