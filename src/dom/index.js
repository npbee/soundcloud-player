import { play, prev, next, pause, resume, seek } from '../controls';

let slice = Array.prototype.slice;

function bindControlEvents(player) {
    let controlsEl = player.controlsEl;

    controlsEl.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'A') {
            let target = e.target;

            if (target.classList.contains('sc-prev')) {
                prev(player);
            }

            if (target.classList.contains('sc-next')) {
                next(player);
            }

            if (target.classList.contains('sc-play')) {
                if (document.body.classList.contains('sc--paused')) {
                    resume(player);
                } else {
                    play(player);
                }
                document.body.classList.add('sc--playing');
                document.body.classList.remove('sc--paused');
            }

            if (target.classList.contains('sc-pause')) {
                document.body.classList.add('sc--paused');
                document.body.classList.remove('sc--playing');
                pause(player);
            }
        }
    });
}

function bindTrackEvents(player) {
    let tracksEl = player.tracksEl;

    tracksEl.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'A') {
            let target = e.target;
            let index = target.getAttribute('data-track-index');

            play(player, index);
        }
    });
}

export function bindScrubberEvents(player) {
    player.scrubberEl.addEventListener('click', function(e) {
        seek(player, e.pageX);
    });
};

export function appendTrackLinks(player) {
    let tracks = player.tracks;
    let tracksEl = player.tracksEl;
    let frag = document.createDocumentFragment();

    tracks.forEach(function(track, index) {
        let name = track.title;
        let link = document.createElement('a');

        link.textContent = name;
        link.setAttribute('data-track-index', index);
        link.className = 'sc-track';

        frag.appendChild(link);
    });

    tracksEl.appendChild(frag);

    bindTrackEvents(player);
};

export function appendControls(player) {
    let controlsEl = player.controlsEl;
    let frag = document.createDocumentFragment();

    let prev = document.createElement('a');
    let prevSpan = document.createElement('span');
    prevSpan.textContent = 'Previous';
    prev.className = 'sc-prev';
    prev.appendChild(prevSpan);
    frag.appendChild(prev);

    let play = document.createElement('a');
    let playSpan = document.createElement('span');
    playSpan.textContent = 'Play';
    play.className = 'sc-play';
    play.appendChild(playSpan);
    frag.appendChild(play);

    let pause = document.createElement('a');
    let pauseSpan = document.createElement('span');
    pauseSpan.textContent = 'Play';
    pause.className = 'sc-pause';
    pause.appendChild(pauseSpan);
    frag.appendChild(pause);

    let next = document.createElement('a');
    let nextSpan = document.createElement('span');
    nextSpan.textContent = 'Play';
    next.className = 'sc-next';
    next.appendChild(nextSpan);
    frag.appendChild(next);

    controlsEl.appendChild(frag);

    bindControlEvents(player);
};

export function removeActiveTrackLinks(player) {
    let nodes = slice.call(player.tracksEl.children);

    nodes.forEach(function(node) {
        node.classList.remove('sc-track--active');
    });
};

export function makeTrackActive(player, trackIndex) {
    let tracksEl = player.tracksEl;
    let track = slice.call(tracksEl.children).filter((el) => {
        return parseInt(el.getAttribute('data-track-index'), 10) === parseInt(trackIndex, 10);
    });

    track[0].classList.add('sc-track--active');
};

export function bindKeys(player) {
    document.body.addEventListener('keydown', function(event) {
        var key = event.keyCode || event.which;

        // Space
        if (key === 32) {
            if (player.playing) {
                pause(player);
            } else if (player.paused) {
                resume(player);
            } else {
                play(player);
            }
        }

        // right arrow
        if (key === 39) {
            player.next();
        }

        if (key === 37) {
            player.prev();
        }
    });
};
