import { Player } from './src/index';

let player = new Player({
    clientId: '287e0a470aceec7d505ab41e1892fddc',
    scrubberEl: document.getElementById('scrubber'),
    timeEl: document.getElementById('time'),
    tracksEl: document.getElementById('tracks'),
    controlsEl: document.getElementById('controls')
});

player.at('6743445','01:00', function() {
    console.log('hello');
});

player.addSets('34714944')
    .then(function(sets) {
        console.log(sets);
    });

