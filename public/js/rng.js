$(function(){
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	function Rng(address, port) {
		this.onNumbers = __bind(this.onNumbers, this);
		this.address = address;
		this.port = port;
		this.socket = new WebSocket("ws://" + this.address + ":" + this.port, 'rng-protocol');
		this.socket.binaryType = 'arraybuffer';
		this.socket.onmessage = this.onNumbers;
		this.randomNumbers = [];
		this.numbersCb = false;
	};

	Rng.prototype.isConnected = function() {
		return this.socket.readyState === 1;
	};

	Rng.prototype.setNumbersCb = function(callback) {
		return this.numbersCb = callback;
	};

	Rng.prototype.onNumbers = function(message) {
		var numbers;
		numbers = new Uint8Array(message.data);
		this.randomNumbers.push(numbers);
		if (this.numbersCb != null) {
			this.numbersCb(numbers);
		}
	};

	Rng.prototype.bitAt = function(byte, pos){
		return ((byte & (1 << pos)) !== 0);	
	};

	window.Rng = Rng;
});
