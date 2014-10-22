$(function(){
	$("#results_form").submit(function(e){
		e.preventDefault();
		var formData = $("#results_form").serializeArray();
		formData.push({name: 'results', value: JSON.stringify(results)});
		console.log("sending", formData);
		$.post("/xp/send_results/" + getXpId(), formData, function(data){
			//window.location.replace("/xp/end_xp");
		});
	});
});