$(() => {
function requestFullscreen(el) {
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

function exitFullscreen() {
  $(document).unbind(
    "webkitfullscreenchange mozfullscreenchange msfullscreenchange fullscreenchange"
  );
  $(document).unbind("blur");
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

function displayAlert(type, message) {
   const typeMessages = {
    success: "Cool",
    danger: "Dommage",
    info: "Information",
    warning: "Attention"
  };
  let html = `<div class="alert alert-block alert-${type} fade in" role="alert">`;
  html += '<a class="close" data-dismiss="alert" href="#">×</a>';
  html += `<p><strong>${
    typeMessages[type]
  } ! </strong>${message}</p></div>`;
  $("#alert_placeholder").html(html);
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();


  //Display a disclamer if we are not under a recent firefox or webkit browser
  const [body] = document.getElementsByTagName("body");
  const hasFullScreenApi =
    body.webkitRequestFullscreen ||
    body.mozRequestFullScreen ||
    body.msRequestFullscreen ||
    body.requestFullscreen;  
  if (!hasFullScreenApi) {
    $("#disclamer_modal").modal({ show: true });
  }
  window.requestFullscreen = requestFullscreen;
  window.exitFullscreen = exitFullscreen;
  window.displayAlert = displayAlert;
});
