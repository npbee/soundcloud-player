import Player from '../src';
import { expect } from 'chai';
import * as sinon from 'sinon';

let baseParams = {
    clientId: '1'
};

let noop = function() {};

describe('Player', function() {

    var player;

    beforeEach(function() {
        player = Object.create(Player);

        global.SC = {
            initialize: noop
        };
    });

    afterEach(function() {
        global.SC === void 0;
    });


    describe('Initialization', function() {

        it('Should throw an error when an "SC" global object is not found', function() {
            global.SC = void 0;


            expect(player.init).to.throw(/SC/);
        });

        it('Should throw an error if an options object is not supplied', function() {
            global.SC = {};

            expect(player.init).to.throw(/options/);
        });

        it('Should throw an error if no "clientId" parameter is passed', function() {
            global.SC = {};

            expect(player.init.bind(player, {})).to.throw(/clientId/);
        });

    });

});
