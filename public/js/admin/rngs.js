$(function(){
	var rng_list = [];
	var rngTest = null;
	function onNumbers(data, rng){
		//If we are here, it means the rng state is available
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		$("#rng_test_"+rng.id).removeClass("disabled");
		setRngStatus(rng.id, "Disponible", "success");
	}

	function onErrors(message, rng){
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		$("#rng_test_"+rng.id).addClass("disabled");
		setRngStatus(rng.id, "Non connecté", "danger");
	}

	function onTest(data, rng){
		//Limite at 4 decimals
		var ratio = Math.floor(rng.getRatio() * 10000) / 10000;
		setRngLabel(rng.id, "Ratio : " + ratio, "success");
	}

	function setRngLabel(id, status, label){
		var span = $("#rng_status_" + id);
		span.html(status);
		span.removeClass('label-default');
		span.addClass('label-' + label);
	}

	function setRngStatus(id, status, label){
		setRngLabel(id, status, label);
		var ok = label === "danger" ? false : true;
		$.post('/admin/set_rng_status/' + id + '.json', {status:ok}, function(data){
		});
	}

	$(".rng-url").each(function(i, e){
		var url = $(e).html();
		var rngId = $(e).attr("id").split('_')[2];
		rng = new Rng(url, rngId, onNumbers, onErrors);
		rng_list.push(rng);
	});

	$(".rng-test").click(function(e, el){
		var rngId = $(this).attr("id").split('_')[2];
		var url = $("#rng_url_"+rngId).html();
		if(rngTest != null){
			rngTest.stop();
		}
		rngTest = new Rng(url, rngId, onTest);
	});

	var timeoutId = window.setTimeout(function(){
		rng_list.forEach(function(rng, i){
			if(rng != null && rng.socket.readyState === 0){
				rng.stop();
				rng_list.splice(i, 1);
				$("#rng_test_"+rng.id).addClass("disabled");
				setRngStatus(rng.id, "Occupé", "warning");
			}
		});
		window.clearTimeout(timeoutId);
	}, 5000);
});