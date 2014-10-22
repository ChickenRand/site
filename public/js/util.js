function requestFullscreen(el){
	if (el.requestFullscreen) {
    	el.requestFullscreen();
	} else if (el.webkitRequestFullscreen) {
	    el.webkitRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
	    el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
	    el.msRequestFullscreen();
	}
}

function exitFullscreen(){
	if (document.exitFullscreen) {
	    document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
	    document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
	    document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
	    document.msExitFullscreen();
	}
}