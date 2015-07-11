# Soundcloud Player

My main motivation behind this player was to build a lightweight, modern, non-jQuery
dependent Soundcloud player.  The existing custom players I found were great and
I've taken quite a bit of inspiration from them, but these days I much prefer
not relying on jQuery and writing code that can be imported easily as an ES6
module.  

I also had a couple of other personal motivations:
- Being able to easily trigger callbacks at specific points in a track
- Practicing ES6 :)

## The Stack

I'm using a fairly modern stack and though I am using Babel to compile down to
ES5, I'm mainly targeting fairly modern browsers.  If you need to support older
browsers then I'd just use the official Soundcloud custom player https://github.com/soundcloud/soundcloud-custom-player.

The stack is:
- Webpack w/ babel loader & babel runtime
- Mocha, Chai, & Sinon for testing

## Installation

**Not yet, but eventually**

```bash
$ npm install soundcloud-player --save
```

## Usage

In your html, make sure you're loading the Soundcloud SDK __first__:

```html
<script src="http://connect.soundcloud.com/sdk.js"></script>
<script src="yourBundle.js"></script>
```

The Soundcloud SDK is not
built as a module currently, so it cannot be imported.

```bash
import Player from 'soundcloud-player';

let player = new Player({
    clientId: '12345',
    ...
});

player.addSets('thesetid')
    .then(function(sets) {
        // The sets
    });

player.play();
```

## Waveforms

Soundcloud will return an image for the waveform of the track that was
requested.  This is the default waveform used with the player.  The downside is
that it can be tough to integrate seamlessly into your site because you can't
change the background of the image, see https://developers.soundcloud.com/blog/waveforms-let-s-talk-about-them.  
That article mentions use of a service called waveform.js that analyzes that
waveform image of a track and returns an array of floating point numbers.
Waveform.js also has a client library that will generate the waveforms via
canvas automatically.  

In an attempt to decouple the waveform from the player, there is a parameter
that can be provided called `onWaveformCreate`.  This parameter is expected to
be a function and will be passed the current track.  Using this parameter, you
can create a waveform however you'd like, with the condition that your function
returns an element or a property called `.element`.  The result of this function
will be appended to your container object.  There are two waveform constructors
included:  one using SVG and the other using canvas.  

Here's an example:

```javascript
import Player from 'soundcloud-player';
import SvgWaveform from 'soundcloud-player/waveform/svg';

let scrubberEl = document.getElementById('scrubber');
let clientId = '12345';

let player = Object.create(Player);

player.init({
    clientId: clientId,
    scrubberEl: scrubberEl,
    onWaveformCreate: function(track) {
        let waveform = new SvgWaveform({
            container: scrubberEl,
            clientId: clientId,
            track: track
        });

        return waveform;
    }
});
```

The waveform returned from the `onWaveformCreate` will be appended to the
scrubber element provided.  Also, if your waveform instance contains methods for
`whileplaying` and `onload`, those methods will be called with the sound object.
You can use this to adjust the "played" elements.  

This is possibly more complicated than it's worth, but it allows you to build a
bundle that does not include all of the SVG or canvas code if you don't want it.  


## Developing

I have an `example.js` file setup with the webpack-dev-server for easy testing.
Just run: 

```bash
$ npm start
```

To run the tests, run:

```bash
$ npm test
```

Compiling to ES5:

```bash
$ npm run compile
```

## Todo
- More tests
- API docs
