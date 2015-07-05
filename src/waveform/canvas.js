import getWaveform from 'soundcloud-waveform';

export class Waveform {
    constructor (options) {

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

    createCanvas (options) {
        let canvas = document.createElement('canvas');
        canvas.width = options.width || this.container.clientWidth;
        canvas.height = options.height || this.container.clientHeight;

        return canvas;
    }

    getWaveform () {
        let waveform = this;

        return getWaveform(this.clientId, this.track.uri, function(err, data) {
            waveform.data = data;
            waveform.draw();
        });
    }

    clear() {
        this.context.fillStyle = this.outerColor;
        this.context.clearRect(0, 0, this.width, this.height);
        return this.context.fillRect(0, 0, this.width, this.height);
    }

    linearInterpolate (before, after, atPoint) {
        return before + (after - before) * atPoint;
    }

    interpolate (data, fitCount) {
        let newData = [];
        let springFactor = (data.length - 1) / (fitCount - 1);
        let i = 1;

        newData[0] = data[0];

        while (i < fitCount - 1) {
            let tmp = i * springFactor;
            let before = Math.floor(tmp).toFixed();
            let after = Math.ceil(tmp).toFixed();
            let atPoint = tmp - before;
            newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
            i++;
        }
        newData[fitCount - 1] = data[data.length - 1];
        return newData;
    }

    whileplaying (soundObj) {
        this.playing = true;
        this.draw(soundObj);
    }

    draw (soundObj) {
        let middle = this.height / 2;
        let data = this.interpolate(this.data, this.width);
        let interval = this.width / data.length;
        let results = [];

        if (!this.playing) {
            this.context.fillStyle = this.backgroundColor;
        }

        for (let i = 0; i < data.length; i++) {
            let datum = data[i];
            let xStrokeWidth = interval * 2;
            let yStrokeWidth = middle * datum * 2;

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
}
