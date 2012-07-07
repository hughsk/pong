#!/usr/bin/env node

var ansi = require('ansi'),
	tty = require('tty'),
	pong = require('./game.js'),
	optimist = require('./lib/args.js'),
	argv = optimist.argv,
	output = ansi(process.stdout);

var clearScreen = function(output) {
	if (process.stdout.getWindowSize) {
		output.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(function(){return '\n'}).join(''))
			.eraseData(2)
			.goto(0, 0)
	}
};

var game;
if (argv.server) { // Multiplayer server!
	require('./server.js')(parseInt(argv.server, 10) || 12953);
} else {
	clearScreen(output);

	process.openStdin();
	process.stdin.setRawMode(true);

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
