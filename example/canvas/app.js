import { Player } from '../../src/index';
import { Waveform } from '../../src/waveform/canvas';

let player = new Player({
    clientId: 'aa97dc0ebed982bfcd02ef939f2149cc',
    scrubberEl: document.getElementById('scrubber'),
    timeEl: document.getElementById('time'),
    tracksEl: document.getElementById('tracks'),
    controlsEl: document.getElementById('controls'),
    onWaveformCreate: function(track) {
        var waveform = new Waveform({
            container: document.getElementById('scrubber'),
            clientId: 'aa97dc0ebed982bfcd02ef939f2149cc',
            track: track
        });

        return waveform;
    }
});

player.at('6743445','01:00', function() {
    console.log('hello');
});

player.addSets('34714944')
    .then(function(sets) {
        console.log(sets);
    });

