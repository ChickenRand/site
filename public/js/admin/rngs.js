$(function(){
	function onNumbers(data, rng){
		//If we are here, it means the rng state is available
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		setRngStatus(rng.id, "Disponible", "success");
	}

	function onErrors(message, rng){
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		setRngStatus(rng.id, "Non connecté", "danger");
	}

	function setRngStatus(id, status, label){
		var span = $("#rng_status_" + id);
		span.html(status);
		span.removeClass('label-default');
		span.addClass('label-' + label);		
	}

	var rng_list = [];
	$(".rng-url").each(function(i, e){
		var url = $(e).html();
		var rngId = $(e).attr("id").split('_')[2];
		var rng = new Rng(url, "8080", rngId, onNumbers, onErrors);
		rng_list.push(rng);
	});

	var timeoutId = window.setTimeout(function(){
		rng_list.forEach(function(rng, i){
			if(rng != null && rng.socket.readyState === 0){
				rng.stop();
				rng_list.splice(i, 1);
				setRngStatus(rng.id, "Occupé", "warning");
			}
		});
		window.clearTimeout(timeoutId);
	}, 5000);
});