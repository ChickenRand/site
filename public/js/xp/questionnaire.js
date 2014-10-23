$(function(){
	$("#results_form").submit(function(e){
		e.preventDefault();
		//Doesn't the datas if there was no AVAILABLE_RNG
		if(AVAILABLE_RNG != null){
			var formData = $("#results_form").serializeArray();
			formData.push({name: 'results', value: JSON.stringify(AVAILABLE_RNG.results)});
			formData.push({name: 'rng_id', value: AVAILABLE_RNG.id});
			$.post("/xp/send_results/" + getXpId(), formData, function(data){
				window.location.replace("/xp/end_xp");
			});
		}
		else{
			window.location.replace("/xp/end_xp_problem");
		}
	});
	//If we are here, we can remove ourself from the queue and stop the Rng
	removeFromQueue();
});