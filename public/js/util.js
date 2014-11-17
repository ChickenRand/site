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
	$(document).unbind("webkitfullscreenchange mozfullscreenchange fullscreenchange");
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

function displayAlert(type, message){
	typeMessages = {success: "Cool", danger: "Dommage", info: "Information", warning: "Attention"};
	var html = '<div class="alert alert-block alert-' + type + ' fade in" role="alert">';
	html += '<a class="close" data-dismiss="alert" href="#">×</a>';
	html += '<p><strong>' + typeMessages[type] + ' ! </strong>' + message + '</p></div>';
	$('#alert_placeholder').html(html);
}

$(function(){
	//Display a disclamer if we are not under a recent firefox or webkit browser
	if(!(document.requestFullscreen || document.mozRequestFullScreen || document.webkitFullscreenEnabled)){
		$('#disclamer_modal').modal({show: true})
	}
});