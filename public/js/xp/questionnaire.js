"use strict";
$(window).on('questionnaire', function(){
	var isDirty = true;
	$('#xp_container').removeClass('outer');
	$("#results_form").submit(function(e){
		e.preventDefault();
		//Doesn't send the datas if there was no AVAILABLE_RNG
		if(AVAILABLE_RNG != null){
			var formData = $("#results_form").serializeArray();
			formData.push({name: 'results', value: JSON.stringify(AVAILABLE_RNG.results)});
			formData.push({name: 'rng_id', value: AVAILABLE_RNG.id});
			$('#xp_container').html('<img src="/images/ajax-loader.gif"></img>Envoi des données en cours, merci de ne pas fermer la page.')
			$.post("/xp/send_results/" + getXpId(), formData, function(data){
				$.get('/xp/end_xp', function(html){
					isDirty = false;
					$("#xp_container").html(html);
				});
			});
		}
		else{
			window.location.replace("/xp/end_xp_problem");
			$.get("/xp/end_xp_problem", function(html){
				$("#xp_container").html(html);
			});
		}
	});

	window.onbeforeunload = function (e) {
		if (e.stopPropagation && isDirty) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
});
