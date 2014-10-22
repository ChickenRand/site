$(function(){
	var item_id = null;
	var update_timeout = null;
	if(document.fullscreenEnabled){
		$("#no_full_screen").removeClass("hide");

		$("#full_screen").addClass("hide");
	}

	$("#full_screen").click(function(e){
		requestFullscreen($("#xp_container").get(0));
		$("#full_screen").addClass("hide");
		$("#load_xp").removeClass("hide");
	});

	$("#load_xp").click(function(e){
		$.get("/xp/ajax_load/" + getXpId(), function(html){
			$("#xp_container").html(html);
		})
	});

	$("#add_queue").click(function(e){
		if(item_id == null){
			addToQueue(false);
			$("#add_queue").html("Me retirer de la file d'attente");
		}
		else{
			removeFromQueue(item_id);
			item_id = null;
			$("#add_queue").html("Me mettre dans la file d'attente");
		}
	});

	$("#start_xp").click(function(e){
		if(item_id == null){
			addToQueue(true);
		}
		else{
			startExperiment(item_id);
		}
	});

	function showQueue(estimated_time){
		$("#queue_container").removeClass("hide");
		$("#before_container").addClass("hide");
		$("#xp_container").addClass("hide");
		updateDisplayedTime(estimated_time);
	}

	function showStart(){
		$("#queue_container").addClass("hide");
		$("#before_container").removeClass("hide");
		$("#xp_container").addClass("hide");		
	}

	function showXp(){
		$("#queue_container").addClass("hide");
		$("#before_container").addClass("hide");
		$("#xp_container").removeClass("hide");
		if(update_timeout != null){
			clearTimeout(update_timeout);	
		}
	}
	function updateDisplayedTime(estimated_time){
		$("#estimated_time").html(moment(moment() + estimated_time * 1000).fromNow());
	}

	function getState(){
		$.get("/queue/state.json", function(data){
			if(data.length != 0){
				showQueue(data.estimated_time)
			}
		});
	}

	function update(){
		console.log("update");
		$.post("/queue/update/" + item_id + ".json", function(data){
			updateDisplayedTime(data.estimated_time);
		});
	}

	function getXpId(){
		var args = window.location.pathname.split("/");
		return args[args.length - 1];
	}
		
	function addToQueue(start_directly){
		var xp_id = getXpId();
		$.post("/queue/add/" + xp_id + ".json", function(data){
			item_id = data.item.id;
			//Call the update method each 3 seconds
			update_timeout = setTimeout(update, 3000);

			//directly start if there is nobody
			if(start_directly){
				//Someone can have started the experiment before the user clicked
				if(data.state.length > 1){
					showQueue(data.estimated_time);
				}
				else{
					startExperiment(item_id);
				}
			}
		});		
	}

	function removeFromQueue(id){
		$.post("/queue/remove/" + id + ".json", function(data){
			console.log(data);
		});
	}

	function startExperiment(id){
		$.post("/queue/start/" + id + ".json", function(data){
			if(data.message != null){
				alert(data.message);
			}
			else{
				console.log("Let's get Rock'n'Roll baby ! ", data);
				showXp();
			}
		});
	}
	getState();
});