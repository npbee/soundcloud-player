import getWaveform from 'soundcloud-waveform';

var svgNS = 'http://www.w3.org/2000/svg';

const debouncedAnimationFrame = function(fn, wait = 200) {
    var req;
    var timeout;

    return function debounced() {
        let obj = this;
        let args = arguments;

        function delayed() {
            fn.apply(obj, args);
            timeout = null;
        }

        clearTimeout(timeout);
        cancelAnimationFrame(delayed);

        timeout = setTimeout(function() {
            requestAnimationFrame(delayed);
        }, wait);

    };
};

export default class SvgWaveform {
    constructor (options) {

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

    bindEvents() {
        var redraw = debouncedAnimationFrame(this.draw.bind(this));
        window.addEventListener('resize', redraw);
    }

    createRect (type) {
        let rect = document.createElementNS(svgNS, 'rect');
        rect.style.height = '100%';

        if (type !== 'played') {
            rect.style.width = '100%';
        }

        rect.classList.add(`rect-${type}`);

        return rect;
    }

    getWaveform () {
        let waveform = this;

        return getWaveform(this.clientId, this.track.uri, function(err, data) {
            waveform.data = data;
            waveform.draw();
        });
    }

    setupElements () {
        let clipPath = this.clipPath = document.createElementNS(svgNS, 'clipPath');
        clipPath.id = `area-${this.track.id}`;

        let rectsContainer = document.createElementNS(svgNS, 'g');
        rectsContainer.classList.add('rects-container');
        rectsContainer.setAttribute('clip-path', `url(#${clipPath.id})`);

        let backgroundRect = this.createRect('background');
        rectsContainer.appendChild(backgroundRect);

        let playedRect = this.playedRect = this.createRect('played');
        rectsContainer.appendChild(playedRect);

        this.element.appendChild(clipPath);
        this.element.appendChild(rectsContainer);
    }

    whileplaying (soundObj) {
        var relative = soundObj.position / soundObj.duration;
        this.playedRect.style.width = (100 * relative) + '%';
    }

    draw () {
        let data = this.data;
        let track = this.track;
        var path;

        if (this.clipPath.children.length) {
            path = this.clipPath.children[0];
            path.setAttribute('d', '');
        } else {
            path = document.createElementNS(svgNS, 'path');
        }

        let width = this.container.getBoundingClientRect().width;
        let height = this.container.getBoundingClientRect().height;

        let pointData = data.slice(1);
        let start = `M0,${data[0] * height}`;
        let zeroPnt = data[0] * height;
        let last = `L0,${data[data.length - 1] * height}`;
        let magnifier = .2;

        let firstHalf = pointData.map(function(datum, index, arr) {
            let interval = width / arr.length;
            let y = `${zeroPnt - (datum * zeroPnt)}`;

            if (index === 0) {
                return `L${interval},${y} `;
            } else {
                return `L${(index + 1) * interval},${y} `;
            }
        }).join('');

        let secondHalf = pointData.slice().reverse().map(function(datum, index, arr) {
            let interval = width / arr.length;
            let y = `${height - (zeroPnt - (datum * zeroPnt))}`;

            if (index === 0) {
                return `L${width},${y} `;
            } else {
                return `L${width - ((index + 1) * interval)},${y} `;
            }
        }).join('');

        firstHalf = firstHalf.replace(/,$/, '');
        secondHalf = secondHalf.replace(/,$/, '');

        path.setAttribute('d', `${start} ${firstHalf} ${secondHalf} `);

        this.clipPath.appendChild(path);
    }
}
