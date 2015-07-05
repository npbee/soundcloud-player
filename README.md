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
import { Player } from 'soundcloud-player';

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

## Todo
- More tests :)
- Separate modules out more
- API docs
