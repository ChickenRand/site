// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
	window.setTimeout(callback, 1000 / 60);
  };
})();

$(function(){
	$("#xp_container").addClass("fountain-container");
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var width = 362,
	  height = 600;

	canvas.width = width;
	canvas.height = height;

	var fountainHeight = 0;
	var level = 1;
	var heightToAdd = 30;

	var previousTime = Date.now();
	var timeStart = Date.now();

	//Adding keyboard controls
	document.onkeydown = function(e) {
		//Incrémenter la taille de la fontaine
		var key = e.keyCode;
		//Key up or space
		if (key == 38 || key == 32) {
			fountainHeight += heightToAdd;
			if(fountainHeight >= 500){
				fountainHeight = 0;
				level++;
				heightToAdd -= 2;
			}
		}
	};

	function update(){
		ctx.clearRect(0, 0, width, height);
		image = document.getElementById("the_fountain");
		ctx.drawImage(image, 0, 0);
		jet = document.getElementById("jet");
		ctx.drawImage(jet, 80, 500 - fountainHeight);
		ctx.fillText("Level : " + level, 10, 50);

		var currentTime = Date.now();
		var deltaTime = currentTime - previousTime;
		if(deltaTime >= 50){
			var decrease = Math.ceil(deltaTime / 10.0);
			if(fountainHeight > 0){
				fountainHeight -= decrease;
				fountainHeight = Math.max(fountainHeight, 0);
			}
			previousTime = currentTime;	
		}
	};

	function animloop() {
		update();
		checkXpEnd();
		requestAnimId = requestAnimFrame(animloop);
	};

	function checkXpEnd(){
		if(Date.now() - timeStart > 60 * 1000){
			//Changing container content to display questionnaire which will send xp results
			$.get("/xp/questionnaire", function(html){
				window.cancelAnimationFrame(requestAnimId);
				document.onkeydown = null;
				$("#xp_container").removeClass("fountain-container");
				exitFullscreen();
				$("#xp_container").html(html);
			});
		}
	}

	//Set up everything for the RNG and results collecting
	if(AVAILABLE_RNG != null){
	  AVAILABLE_RNG.addNumbersCb(function(trialRes){
		trialRes.gameScore = fountainHeight;
		trialRes.level = level;
	  });
	}

	animloop();
});
