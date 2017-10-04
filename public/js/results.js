"use strict";

$(() => {
	$('#diff_ones_fountain').before('<div id="loader"><img src="/images/ajax-loader.gif">  Fetching results...</div>');

	$.get(`/results/get_results/${window.CURRENT_USER_ID}.json`, function(data) {
		if(data.length > 0) {
			const lastP = createCumulativeGraph('#diff_ones_fountain', data);
			const chances = Math.round(1 / lastP);
			$('#result_message').html(`Il y 1 chance sur <strong>${chances}</strong> que ces résultats soient dut au hasard.`)
			$('#loader').remove();
		} else {
			$('#diff_ones_fountain').remove();
			$('#loader').html('No results.');
		}
	});
});