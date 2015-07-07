'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _soundcloudWaveform = require('soundcloud-waveform');

var _soundcloudWaveform2 = _interopRequireDefault(_soundcloudWaveform);

var svgNS = 'http://www.w3.org/2000/svg';

var debouncedAnimationFrame = function debouncedAnimationFrame(fn) {
    var wait = arguments[1] === undefined ? 200 : arguments[1];

    var req;
    var timeout;

    return function debounced() {
        var obj = this;
        var args = arguments;

        function delayed() {
            fn.apply(obj, args);
            timeout = null;
        }

        clearTimeout(timeout);
        cancelAnimationFrame(delayed);

        timeout = setTimeout(function () {
            requestAnimationFrame(delayed);
        }, wait);
    };
};

var SvgWaveform = (function () {
    function SvgWaveform(options) {
        _classCallCheck(this, SvgWaveform);

        this.element = document.createElementNS(svgNS, 'svg');
        this.element.setAttribute('width', '100%');
        this.element.setAttribute('height', '100%');

        this.container = options.container;

        this.track = options.track;
        this.clientId = options.clientId;

        this.setupElements();
        this.bindEvents();
        this.getWaveform();
    }

    _createClass(SvgWaveform, [{
        key: 'bindEvents',
        value: function bindEvents() {
            var redraw = debouncedAnimationFrame(this.draw.bind(this));
            window.addEventListener('resize', redraw);
        }
    }, {
        key: 'createRect',
        value: function createRect(type) {
            var rect = document.createElementNS(svgNS, 'rect');
            rect.style.height = '100%';

            if (type !== 'played') {
                rect.style.width = '100%';
            }

            rect.classList.add('rect-' + type);

            return rect;
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
        key: 'setupElements',
        value: function setupElements() {
            var clipPath = this.clipPath = document.createElementNS(svgNS, 'clipPath');
            clipPath.id = 'area-' + this.track.id;

            var rectsContainer = document.createElementNS(svgNS, 'g');
            rectsContainer.classList.add('rects-container');
            rectsContainer.setAttribute('clip-path', 'url(#' + clipPath.id + ')');

            var backgroundRect = this.createRect('background');
            rectsContainer.appendChild(backgroundRect);

            var playedRect = this.playedRect = this.createRect('played');
            rectsContainer.appendChild(playedRect);

            this.element.appendChild(clipPath);
            this.element.appendChild(rectsContainer);
        }
    }, {
        key: 'whileplaying',
        value: function whileplaying(soundObj) {
            var relative = soundObj.position / soundObj.duration;
            this.playedRect.style.width = 100 * relative + '%';
        }
    }, {
        key: 'draw',
        value: function draw() {
            var data = this.data;
            var track = this.track;
            var path;

            if (this.clipPath.children.length) {
                path = this.clipPath.children[0];
                path.setAttribute('d', '');
            } else {
                path = document.createElementNS(svgNS, 'path');
            }

            var width = this.container.getBoundingClientRect().width;
            var height = this.container.getBoundingClientRect().height;

            var pointData = data.slice(1);
            var start = 'M0,' + data[0] * height;
            var zeroPnt = data[0] * height;
            var last = 'L0,' + data[data.length - 1] * height;
            var magnifier = .2;

            var firstHalf = pointData.map(function (datum, index, arr) {
                var interval = width / arr.length;
                var y = '' + (zeroPnt - datum * zeroPnt);

                if (index === 0) {
                    return 'L' + interval + ',' + y + ' ';
                } else {
                    return 'L' + (index + 1) * interval + ',' + y + ' ';
                }
            }).join('');

            var secondHalf = pointData.slice().reverse().map(function (datum, index, arr) {
                var interval = width / arr.length;
                var y = '' + (height - (zeroPnt - datum * zeroPnt));

                if (index === 0) {
                    return 'L' + width + ',' + y + ' ';
                } else {
                    return 'L' + (width - (index + 1) * interval) + ',' + y + ' ';
                }
            }).join('');

            firstHalf = firstHalf.replace(/,$/, '');
            secondHalf = secondHalf.replace(/,$/, '');

            path.setAttribute('d', start + ' ' + firstHalf + ' ' + secondHalf + ' ');

            this.clipPath.appendChild(path);
        }
    }]);

    return SvgWaveform;
})();

exports['default'] = SvgWaveform;
module.exports = exports['default'];