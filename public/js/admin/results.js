"use strict";
$(".see-result").click(function(e, el){
	e.preventDefault();
	var url = $(el).attr("href");
	if(url != null){
		$.get(url, function(data){
			console.log(data);
		});
	}
});