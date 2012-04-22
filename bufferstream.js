var util = require('util'),
	Stream = require('stream').Stream,
	EventEmitter = require('events').EventEmitter;

BufferStream = function(output, options) {
	if (!(this instanceof BufferStream)) return new BufferStream(output, options);
	EventEmitter.call(this);

	this.writeable = true;
	this.paused = false;
	this.buffer = "";
};
util.inherits(BufferStream, EventEmitter);

BufferStream.prototype.write = function(data) {
	this.buffer += data;
};

BufferStream.prototype.flush = function() {
	this.emit('data', this.buffer);
	this.buffer = "";
};

module.exports = BufferStream;