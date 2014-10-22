$(function(){
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	function Rng(url, id, onNumbersCb, onErrorCb) {
		this.id = id;
		this.onNumbers = __bind(this.onNumbers, this);
		this.onError = __bind(this.onError, this);
		this.url = url;
		this.socket = new WebSocket("ws://" + this.url, 'rng-protocol');
		this.socket.binaryType = 'arraybuffer';
		this.socket.onmessage = this.onNumbers;
		if(onNumbersCb != null){
			this.setNumbersCb(onNumbersCb);
		}
		this.socket.onerror = this.onError;
		if(onErrorCb != null){
			 this.setErrorCb(onErrorCb);	
		}
		this.randomNumbers = [];
	};

	Rng.prototype.isConnected = function() {
		return this.socket.readyState === 1;
	};

	Rng.prototype.setNumbersCb = function(callback) {
		return this.numbersCb = callback;
	};

	Rng.prototype.setErrorCb = function(callback) {
		return this.errorCb = callback;
	};

	Rng.prototype.onNumbers = function(message) {
		var numbers;
		numbers = new Uint8Array(message.data);
		this.randomNumbers.push(numbers);
		if (this.numbersCb != null) {
			//We need the Rng object itself for the admin panel
			this.numbersCb(numbers, this);
		}
	};

	Rng.prototype.onError = function(message){
		if(this.errorCb != null){
			this.errorCb(message, this);
		}
	}

	Rng.prototype.bitAt = function(byte, pos){
		return ((byte & (1 << pos)) !== 0);	
	};

	Rng.prototype.stop = function(){
		this.socket.close();
	}

	window.Rng = Rng;
});
