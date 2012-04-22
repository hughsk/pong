#!/usr/bin/env node

var ansi = require('ansi'),
	tty = require('tty'),
	pong = require('./game.js'),
	output = ansi(process.stdout);

var clearScreen = function(output) {
	output.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(function(){return '\n'}).join(''))
		.eraseData(2)
		.goto(0, 0)
};

clearScreen(output);

process.openStdin();
tty.setRawMode(true);

output.hide();

var game = pong(process.stdout, process.stdin)
	.start();

process.on('exit', function(status) {
	clearScreen(output);
	output.show();
});
