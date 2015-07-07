'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _soundcloudWaveform = require('soundcloud-waveform');

var _soundcloudWaveform2 = _interopRequireDefault(_soundcloudWaveform);

var CanvasWaveform = (function () {
    function CanvasWaveform(options) {
        _classCallCheck(this, CanvasWaveform);

        this.container = options.container;
        this.clientId = options.clientId;
        this.track = options.track;

        this.element = this.createCanvas(options);
        this.context = this.element.getContext('2d');
        this.width = parseInt(this.context.canvas.width, 10);
        this.height = parseInt(this.context.canvas.height, 10);

        this.innerColor = options.innerColor || 'seagreen';
        this.backgroundColor = options.backgroundColor || '#d9d9d9';
        this.outerColor = options.outerColor || '#fff';
        this.playing = false;

        this.getWaveform();
    }

    _createClass(CanvasWaveform, [{
        key: 'createCanvas',
        value: function createCanvas(options) {
            var canvas = document.createElement('canvas');
            canvas.width = options.width || this.container.clientWidth;
            canvas.height = options.height || this.container.clientHeight;

            return canvas;
        }
    }, {
        key: 'getWaveform',
        value: function getWaveform() {
            var waveform = this;

            return (0, _soundcloudWaveform2['default'])(this.clientId, this.track.uri, function (err, data) {
                waveform.data = data;
                waveform.draw();
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.context.fillStyle = this.outerColor;
            this.context.clearRect(0, 0, this.width, this.height);
            return this.context.fillRect(0, 0, this.width, this.height);
        }
    }, {
        key: 'linearInterpolate',
        value: function linearInterpolate(before, after, atPoint) {
            return before + (after - before) * atPoint;
        }
    }, {
        key: 'interpolate',
        value: function interpolate(data, fitCount) {
            var newData = [];
            var springFactor = (data.length - 1) / (fitCount - 1);
            var i = 1;

            newData[0] = data[0];

            while (i < fitCount - 1) {
                var tmp = i * springFactor;
                var before = Math.floor(tmp).toFixed();
                var after = Math.ceil(tmp).toFixed();
                var atPoint = tmp - before;
                newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
                i++;
            }
            newData[fitCount - 1] = data[data.length - 1];
            return newData;
        }
    }, {
        key: 'whileplaying',
        value: function whileplaying(soundObj) {
            this.playing = true;
            this.draw(soundObj);
        }
    }, {
        key: 'draw',
        value: function draw(soundObj) {
            var middle = this.height / 2;
            var data = this.interpolate(this.data, this.width);
            var interval = this.width / data.length;
            var results = [];

            if (!this.playing) {
                this.context.fillStyle = this.backgroundColor;
            }

            for (var i = 0; i < data.length; i++) {
                var datum = data[i];
                var xStrokeWidth = interval * 2;
                var yStrokeWidth = middle * datum * 2;

                if (this.playing) {
                    if (i / this.width < soundObj.position / soundObj.durationEstimate) {
                        this.context.fillStyle = this.innerColor;
                        this.context.clearRect(interval * i, middle - middle * datum, xStrokeWidth, yStrokeWidth);
                        this.context.fillRect(interval * i, middle - middle * datum, xStrokeWidth, yStrokeWidth);
                        i++;
                    }
                } else {

                    this.context.clearRect(interval * i, middle - middle * datum, xStrokeWidth, yStrokeWidth);
                    this.context.fillRect(interval * i, middle - middle * datum, xStrokeWidth, yStrokeWidth);
                    results.push(i++);
                }
            }

            return results;
        }
    }]);

    return CanvasWaveform;
})();

exports['default'] = CanvasWaveform;
module.exports = exports['default'];