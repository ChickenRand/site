"use strict";
$(window).on('questionnaire', function(){
	var isDirty = true;
	var userXpIp = null;

	function sendResults() {
		//Doesn't send the datas if there was no AVAILABLE_RNG
		if(AVAILABLE_RNG != null){
			const data = [
				{name: 'results', value: JSON.stringify(AVAILABLE_RNG.results)},
				{name: 'rng_id', value: AVAILABLE_RNG.id}
			];
			$.post("/xp/send_results/" + getXpId(), data, function(data){
				isDirty = false;
				userXpIp = data;
				// We need to remove from queue only when the RNG close the connection
				// And not before.
				AVAILABLE_RNG.setCloseCb(function () {
					removeFromQueue();
				});
				AVAILABLE_RNG.sendUserXpId(userXpIp);
				$('#submit_results_button').removeClass('disabled');
				$('#submit_results_button').text('Envoyer les résultats');
			});
		} else {
			window.location.replace("/xp/end_xp_problem");
		}
	}

	function manageSpecialInput(name) {
		$('input[type=radio][name=' + name + '-radio]').change(function(e) {
			const input = $('input[type=text][name=' + name + ']');
			if(e.target.value === 'true') {
				input.val('');
				input.removeClass('hide');
			} else {
				input.val('nothing');
				input.addClass('hide');
			}
		});
	}
	// Manage text input display
	manageSpecialInput('drug');
	manageSpecialInput('music');

	$('#xp_container').removeClass('outer');
	$("#results_form").submit(function(e){
		var formData = $("#results_form").serializeArray();

		e.preventDefault();

		if(userXpIp) {
			$('#xp_container').html('<img src="/images/ajax-loader.gif">Envoi des données en cours, merci de ne pas fermer la page.')
			$.post('/xp/send_questionnaire_results/' + userXpIp, formData, function(data){
				$.get('/xp/end_xp', function(html){
					$("#xp_container").html(html);
				});
			});
		}
	});

	window.onbeforeunload = function (e) {
		if (e.stopPropagation && isDirty) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	// We send results right after the questionnaire is loaded
	// This way answers to the questionnaire can wait or can even be skipped by the user
	sendResults();
});
