// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
	window.setTimeout(callback, 1000 / 60);
  };
})();

$(function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var width = 480,
	  height = 640;

	canvas.width = width;
	canvas.height = height;

	var fountainHeight = 0;

	var previousTime = Date.now();

	//Adding keyboard controls
	document.onkeydown = function(e) {
		//Incrémenter la taille de la fontaine
		var key = e.keyCode;
		//Key up or space
		if (key == 38 || key == 32) {
			fountainHeight += 40;
		}
	};

	function update(){
		ctx.clearRect(0, 0, width, height);
		// image = document.getElementById("sprite");
		// ctx.drawImage(image, 100, 100, 256, 256, 100, 100, 100, 100);
		document.getElementById("score").innerHTML = "Score : " + fountainHeight;
		var currentTime = Date.now();
		var deltaTime = currentTime - previousTime;
		if(deltaTime >= 50){
			var decrease = Math.ceil(deltaTime / 5.0);
			if(fountainHeight > 0){
				fountainHeight -= decrease;
				fountainHeight = Math.max(fountainHeight, 0);
			}
			previousTime = currentTime;	
		}
	};

	function animloop() {
		update();
		requestAnimId = requestAnimFrame(animloop);
	};

	animloop();
});
