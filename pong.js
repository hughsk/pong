#!/usr/bin/env node

var ansi = require('ansi'),
	tty = require('tty'),
	pong = require('./game.js'),
	argv = require('optimist').argv,
	output = ansi(process.stdout);

var clearScreen = function(output) {
	output.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(function(){return '\n'}).join(''))
		.eraseData(2)
		.goto(0, 0)
};


argv.server = argv.server || argv.S;
argv.connect = argv.connect || argv.c;

var game;
if (argv.server) { // Multiplayer server!
	require('./server.js');
} else {
	clearScreen(output);

	process.openStdin();
	tty.setRawMode(true);

	output.hide();
}

if (argv.connect) { // Multiplayer client!
	game = pong(process.stdout, process.stdin)
		.connect(argv.connect)
} else
if (!argv.server) { // Local game!
	game = pong(process.stdout, process.stdin)
		.start();
	game.setupExitKeys();
}

// Everybody does this regardless.
process.on('exit', function(status) {
	clearScreen(output);
	output.reset().show();
});
