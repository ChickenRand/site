"use strict";
$(() => {
  const __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };
  function Rng(url, id, onNumbersCb, onErrorCb, onOpenCb, onCloseCb) {
    this.id = id;
    this.onNumbers = __bind(this.onNumbers, this);
    this.onError = __bind(this.onError, this);
    this.onOpen = __bind(this.onOpen, this);
    this.onClose = __bind(this.onClose, this);
    this.url = url;
    this.socket = new WebSocket(`ws://${this.url}`);
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = this.onOpen;
    this.setOpenCb(onOpenCb);
    this.socket.onclose = this.onClose;
    this.setCloseCb(onCloseCb);
    this.socket.onmessage = this.onNumbers;
    this.numbersCbs = [];
    if (onNumbersCb !== undefined) {
      this.addNumbersCb(onNumbersCb);
    }
    this.socket.onerror = this.onError;
    this.setErrorCb(onErrorCb);
    this.reset();
  }

  Rng.prototype.reset = function() {
    this.totalZeros = 0;
    this.totalOnes = 0;
    this.results = {
      date: Date.now(),
      trials: []
    };
  };

  Rng.prototype.getRatio = function() {
    return this.totalOnes / (this.totalOnes + this.totalZeros);
  };

  Rng.prototype.isConnected = function() {
    return this.socket.readyState === 1;
  };

  Rng.prototype.addNumbersCb = function(callback) {
    this.numbersCbs.push(callback);
  };

  Rng.prototype.setErrorCb = function(callback) {
    this.errorCb = callback;
  };

  Rng.prototype.setOpenCb = function(callback) {
    this.openCb = callback;
  };

  Rng.prototype.setCloseCb = function(callback) {
    this.closeCb = callback;
  };

  Rng.prototype.onOpen = function() {
    if (this.openCb) {
      this.openCb(this);
    }
  };

  Rng.prototype.onClose = function() {
    if (this.closeCb) {
      this.closeCb(this);
    }
  };

  Rng.prototype.ui8ArrayToBase64 = function(array) {
    // Taken from https://stackoverflow.com/a/11562550
    // Is this method safe ?
    // @todo further testing cause Javascript String are UTF-16
    // https://stackoverflow.com/a/36378903
    return window.btoa(String.fromCharCode(...array));
  };

  Rng.prototype.onNumbers = function(message) {
    const u8aNumbers = new Uint8Array(message.data);
    const numbers = Array.from(u8aNumbers);
    const trialRes = {
      nbOnes: 0,
      nbZeros: 0,
      ms: Date.now() - this.results.date,
      rawDataBase64: this.ui8ArrayToBase64(u8aNumbers)
    };

    for (let i = 0; i < numbers.length; i++) {
      for (let pos = 0; pos < 8; pos++) {
        const isOne = this.bitAt(numbers[i], pos);
        if (isOne) {
          trialRes.nbOnes++;
        } else {
          trialRes.nbZeros++;
        }
      }
    }

    this.totalOnes += trialRes.nbOnes;
    this.totalZeros += trialRes.nbZeros;
    for (let i = 0; i < this.numbersCbs.length; i++) {
      //We need the Rng object itself for the admin panel
      this.numbersCbs[i](trialRes, this);
    }
    this.results.trials.push(trialRes);
  };

  Rng.prototype.onError = function(message) {
    if (this.errorCb !== undefined) {
      this.errorCb(message, this);
    }
  };

  Rng.prototype.bitAt = function(byte, pos) {
    return (byte & (1 << pos)) !== 0;
  };

  Rng.prototype.stop = function() {
    this.socket.close();
  };

  Rng.prototype.sendStartMessage = function() {
    if (this.isConnected) {
      this.socket.send("start");
    }
  };

  window.Rng = Rng;
});
