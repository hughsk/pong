module.exports = function(port) {
	var io = require('socket.io').listen(port, { log: false }),
		socketQueue = [],
		pong = require('./game.js'),
		games = [],
		createGame;

	console.log('Created a Pong server on port ' + port + '. Now people can play Pong together!');

	io.sockets.on('connection', function(socket) {
		var matchedSocket = socketQueue[0];


		console.log('Player', socket.id, 'connected to the server');

		if (matchedSocket) {
			createGame(socket, socketQueue.shift());
		} else {
			socketQueue.push(socket);
		}

		socket.once('disconnect', function() {
			if (socket.partner) {
				socket.partner.emit('disconnect');
			}

			console.log('Player', socket.id, 'disconnected. Players remaining:', socketQueue.length);
		});
	});

	createGame = function(socket1, socket2) {
		var game = pong(process.stdin, process.stdout, { independent: false });

		console.log('Matched up two players:', socket1.id, socket2.id);
		console.log('Current amount of players waiting:', socketQueue.length);

		socket1.partner = socket2;
		socket2.partner = socket1;
		socket1.emit('ready');
		socket2.emit('ready');

		// Paddle Movement
		socket1.on('up', function(fast) { game.ourPaddle.y -= !!fast ? 2: 1; });
		socket2.on('up', function(fast) { game.theirPaddle.y -= !!fast ? 2: 1; });
		socket1.on('down', function(fast) { game.ourPaddle.y += !!fast ? 2: 1; });
		socket2.on('down', function(fast) { game.theirPaddle.y += !!fast ? 2: 1; });

		// Game tick. Essentially, move the ball and 
		// update the positions of the paddle. Not really great network programming
		// but I somehow doubt Pong will have any scalability issues.
		setInterval(function() {
			game.tick();
			socket1.emit('tick', {
				theirY: game.theirPaddle.y,
				ourY: game.ourPaddle.y,
				ballX: game.ball.x,
				ballY: game.ball.y,
				ourScore: game.ourScore,
				theirScore: game.theirScore
			});
			socket2.emit('tick', {
				theirY: game.ourPaddle.y,
				ourY: game.theirPaddle.y,
				ballX: game.options.width - game.ball.x,
				ballY: game.ball.y,
				ourScore: game.theirScore,
				theirScore: game.ourScore
			});
		}, 120);
	};
};