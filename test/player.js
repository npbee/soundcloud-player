import { Player } from '../src/index';
import { expect } from 'chai';
import * as sinon from 'sinon';

let baseParams = {
    clientId: '1'
};

let noop = function() {};

describe('Player', function() {

    beforeEach(function() {
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

            var fn = function() {
                return new Player();
            };
            expect(fn).to.throw(/SC/);
        });

        it('Should throw an error if an options object is not supplied', function() {
            global.SC = {};

            var fn = function() {
                return new Player();
            };

            expect(fn).to.throw(/options/);
        });

        it('Should throw an error if no "clientId" parameter is passed', function() {
            global.SC = {};

            var fn = function() {
                return new Player({});
            };

            expect(fn).to.throw(/clientId/);
        });

    });

    describe('#onKeyboardEvent', function() {

        var player;

        beforeEach(function() {
            player = new Player(baseParams);
            player.playing = false;
            player.paused = false;

            player.play = sinon.spy();
            player.pause = sinon.spy();
            player.resume = sinon.spy();
            player.next = sinon.spy();
            player.prev = sinon.spy();
        });

        describe('when the key is the spacebar', function() {

            describe('and the player is not playing or paused', function() {

                it('should call the "play" function', function() {
                    player.onKeyboardEvent({keyCode: 32});
                    expect(player.play.called).to.be.true;
                    expect(player.pause.called).to.be.false;
                    expect(player.resume.called).to.be.false;
                });

            });

            describe('and the player is playing', function() {

                it('should call the "pause" function', function() {
                    player.playing = true;
                    player.onKeyboardEvent({keyCode: 32});

                    expect(player.play.called).to.be.false;
                    expect(player.pause.called).to.be.true;
                    expect(player.resume.called).to.be.false;

                });
            });

            describe('and the player is paused', function() {

                it('should call the "resume" function', function() {
                    player.paused = true;
                    player.onKeyboardEvent({keyCode: 32});

                    expect(player.play.called).to.be.false;
                    expect(player.pause.called).to.be.false;
                    expect(player.resume.called).to.be.true;

                });
            });
        });

        describe('when the key is the right arrow', function() {

            it('should call the "next" method', function() {
                player.onKeyboardEvent({keyCode: 39});

                expect(player.next.called).to.be.true;
            });
        });

        describe('when the key is the left arrow', function() {

            it('should call the "prev" method', function() {
                player.onKeyboardEvent({keyCode: 37});

                expect(player.prev.called).to.be.true;
            });
        });
    });
});
