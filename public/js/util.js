function requestFullscreen(el){
	console.log("Request!!!", el);
	if (el.requestFullscreen) {
    	el.requestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		console.log("Fullscreen!!!");
	    el.webkitRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
	    el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
	    el.msRequestFullscreen();
	}
}