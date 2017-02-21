"use strict";
$(function(){
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	function Rng(url, id, onNumbersCb, onErrorCb) {
		this.id = id;
		this.onNumbers = __bind(this.onNumbers, this);
		this.onError = __bind(this.onError, this);
		this.url = url;
		this.socket = new WebSocket("ws://" + this.url);
		this.socket.binaryType = 'arraybuffer';
		this.socket.onmessage = this.onNumbers;
		this.numbersCbs = [];
		if(onNumbersCb != null){
			this.addNumbersCb(onNumbersCb);
		}
		this.socket.onerror = this.onError;
		if(onErrorCb != null){
			 this.setErrorCb(onErrorCb);	
		}
		this.reset();
	};

	Rng.prototype.reset = function(){
		this.totalZeros = 0;
		this.totalOnes = 0;
		this.results = {
			date : Date.now(),
			trials : []
		}
	};

	Rng.prototype.getRatio = function(){
		return this.totalOnes/(this.totalOnes+this.totalZeros);
	}

	Rng.prototype.isConnected = function() {
		return this.socket.readyState === 1;
	};

	Rng.prototype.addNumbersCb = function(callback) {
		this.numbersCbs.push(callback);
	};

	Rng.prototype.setErrorCb = function(callback) {
		this.errorCb = callback;
	};

	Rng.prototype.onNumbers = function(message) {
		var trialRes = {
			numbers: Array.from(new Uint8Array(message.data)),
			nbOnes: 0,
			nbZeros: 0,
			ms: Date.now() - this.results.date
		};
		for(var i = 0; i < trialRes.numbers.length; i++){
			for(var pos = 0; pos < 8; pos++){
        		this.bitAt(trialRes.numbers[i], pos) ? trialRes.nbOnes++ : trialRes.nbZeros++;
			}
		}
		this.totalOnes += trialRes.nbOnes;
		this.totalZeros += trialRes.nbZeros;
		for(var i = 0; i < this.numbersCbs.length ; i++){
			//We need the Rng object itself for the admin panel
			this.numbersCbs[i](trialRes, this);
		}
		this.results.trials.push(trialRes);
	};

	Rng.prototype.onError = function(message){
		if(this.errorCb != null){
			this.errorCb(message, this);
		}
	};

	Rng.prototype.bitAt = function(byte, pos){
		return ((byte & (1 << pos)) !== 0);	
	};

	Rng.prototype.stop = function(){
		this.socket.close();
	};

	window.Rng = Rng;
});
