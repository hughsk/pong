# Pong

In Node, with your terminal. Thanks go to [TooTallNate](//github.com/TooTallNate)'s [ansi](http://search.npmjs.org/#/ansi) module for terminal trickery.

## Installation

``` bash
npm install -g pong
```

## Usage

Pretty straight-forward, once it's installed just type `pong` into your terminal to get started. There's a couple of options too:

``` bash
Usage: pong [-b|-h|-s|-W <width>|-H <height>|-S <port>|-c <host>]

Options:
  -W, --width    Set the width of the playing field           [default: 80]
  -H, --height   Set the height of the playing field          [default: 24]
  -b, --beep     Enable beeping                               [boolean]  [default: false]
  -h, --help     Help!                                        [boolean]
  -s, --safer    Safer output for running over SSH/Mosh/etc.  [boolean]  [default: false]
  -S, --server   Host a Pong server instead of playing Pong.
  -c, --connect  Connect to another Pong server 
```

## Multiplayer

It wouldn't be a Node clone without some async-realtime-multiplayer features, so that's built-in too. To start a new game with a random stranger, just type:

``` bash
pong --connect
```

And wait. Someone else might join eventually, and you'll get matched up automatically.

You can host your own pong server like so:

``` bash
pong --server 80
```

Where `80` is the port your want to run it on. Then connecting it you just need to supply the new server's address and port after the `connect` flag:

``` bash
pong --connect http://192.0.0.12:80
```