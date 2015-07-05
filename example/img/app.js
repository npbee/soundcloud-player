import { Player } from '../../src/index';
import { svgWaveform } from '../../src/waveform/svg';

let player = new Player({
    clientId: 'aa97dc0ebed982bfcd02ef939f2149cc',
    scrubberEl: document.getElementById('scrubber'),
    timeEl: document.getElementById('time'),
    tracksEl: document.getElementById('tracks'),
    controlsEl: document.getElementById('controls'),
    waveform: svgWaveform,
    waveformOpts: {}
});

console.log('hi');
player.at('6743445','01:00', function() {
    console.log('hello');
});

player.addSets('34714944')
    .then(function(sets) {
        console.log(sets);
    });
