import getWaveform from 'soundcloud-waveform';

var svgNS = 'http://www.w3.org/2000/svg';

var optimizedResize = (function() {

    var callbacks = [],
        running = false;

    // fired on resize event
    function resize() {

        if (!running) {
            running = true;

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }

    }

    // run the actual callbacks
    function runCallbacks() {

        callbacks.forEach(function(callback) {
            callback();
        });

        running = false;
    }

    // adds callback to loop
    function addCallback(callback) {

        if (callback) {
            callbacks.push(callback);
        }

    }

    return {
        // public method to add additional callback
        add: function(callback) {
            if (!callbacks.length) {
                window.addEventListener('resize', resize);
            }
            addCallback(callback);
        }
    }
}());

export class Waveform {
    constructor (options) {

        this.element = document.createElementNS(svgNS, 'svg');
        this.element.setAttribute('width', '100%');
        this.element.setAttribute('height', '100%');

        this.container = options.container;

        this.track = options.track;
        this.clientId = options.clientId;
        this.draw();

        this.setupElements();
        this.bindEvents();
    }

    bindEvents() {
        optimizedResize.add(this.redraw.bind(this));

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

    redraw() {
        let data = this.data;
        let self = this;

        if (!data) { return; }

        let width = this.container.getBoundingClientRect().width;
        let height = this.container.getBoundingClientRect().height;
        let path = this.clipPath.children[0];

        path.setAttribute('d', '');

        let pointData = data.slice(1);
        let start = `M0,${data[0] * height}`;
        let zeroPnt = data[0] * height;
        let last = `L0,${data[data.length - 1] * height}`;


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
    }

    draw () {
        let self = this;
        let track = this.track;
        let path = document.createElementNS(svgNS, 'path');
        let width = this.container.getBoundingClientRect().width;
        let height = this.container.getBoundingClientRect().height;
        let _height = height;

        //self.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        //self.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        getWaveform(this.clientId, track.uri, function(err, data) {

            self.data = data;

            let pointData = data.slice(1);
            let start = `M0,${data[0] * _height}`;
            let zeroPnt = data[0] * _height;
            let last = `L0,${data[data.length - 1] * _height}`;
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
                let y = `${_height - (zeroPnt - (datum * zeroPnt))}`;

                if (index === 0) {
                    return `L${width},${y} `;
                } else {
                    return `L${width - ((index + 1) * interval)},${y} `;
                }
            }).join('');

            firstHalf = firstHalf.replace(/,$/, '');
            secondHalf = secondHalf.replace(/,$/, '');

            path.setAttribute('d', `${start} ${firstHalf} ${secondHalf} `);

            self.clipPath.appendChild(path);
        });
    }
}
