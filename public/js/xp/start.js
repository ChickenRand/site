$(function(){
	//WARNING GLOBAL
	window.AVAILABLE_RNG = null;
	var item_id = null;
	var update_interval = null;
	var inQueue = false;
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
		startExperiment();
	});

	$("#add_queue").click(function(e){
		if(item_id == null){
			addToQueue(false);
			$("#add_queue").html("Me retirer de la file d'attente");
		}
		else{
			removeFromQueue();
			item_id = null;
			$("#add_queue").html("Me mettre dans la file d'attente");
		}
	});

	$("#start_xp").click(function(e){
		if(item_id == null){
			addToQueue(true);
		}
		else{
			showXp();
		}
	});

	function showQueue(estimated_time){
		inQueue = true;
		$("#queue_container").removeClass("hide");
		$("#before_container").addClass("hide");
		$("#xp_container").addClass("hide");
		updateDisplayedTime(estimated_time);
	}

	function showStart(){
		inQueue = false;
		$("#queue_container").addClass("hide");
		$("#before_container").removeClass("hide");
		$("#xp_container").addClass("hide");		
	}

	function showXp(){
		$("#queue_container").addClass("hide");
		$("#before_container").addClass("hide");
		$("#xp_container").removeClass("hide");
	}

	function updateDisplayedTime(estimated_time){
		$("#estimated_time").html(moment(moment() + estimated_time * 1000).fromNow());
	}

	function getState(){
		$.get("/queue/state.json", function(data){
			//We probably have hit F5
			if(data.item != null){
				item_id = data.item.id;
				//Call the update method each 3 seconds
				update_interval = window.setInterval(update, 3000);
			}
			if(item_id == null && data.state.length != 0){
				showQueue(data.state.estimated_time);
			}
			else if(data.state.length > 1 && data.state.item_on_top != item_id){
				$("#add_queue").html("Me retirer de la file d'attente");
				showQueue(data.state.estimated_time);	
			}
		});
	}

	function update(){
		$.post("/queue/update/" + item_id + ".json", function(data){
			if(data.item_on_top == item_id){
				if(inQueue){
					showStart();	
				}
			}
			else{
				updateDisplayedTime(data.estimated_time);	
			}
		});
	}

	function getXpId(){
		var args = window.location.pathname.split("/");
		return args[args.length - 1];
	}
	//Expose this function to others
	window.getXpId = getXpId;
		
	function addToQueue(start_directly){
		var xp_id = getXpId();
		$.post("/queue/add/" + xp_id + ".json", function(data){
			item_id = data.item.id;
			//Call the update method each 3 seconds
			update_interval = window.setInterval(update, 3000);

			//directly start if there is nobody
			if(start_directly){
				//Someone can have started the experiment before the user clicked
				if(data.state.length > 1){
					showQueue(data.estimated_time);
				}
				else{
					showXp();
				}
			}
		});		
	}

	function removeFromQueue(){
		if(item_id != null){
			$.post("/queue/remove/" + item_id + ".json", function(data){
			});
			//Also stop the RNG if there was one
			if(AVAILABLE_RNG != null){
				AVAILABLE_RNG.stop();
			}
		}
	}
	//Need to be accessible from outside when finishing the xp
	window.removeFromQueue = removeFromQueue;

	function startExperiment(){
		if(update_interval != null){
			window.clearInterval(update_interval);	
		}
		$.post("/queue/start/" + item_id + ".json", function(data){
			if(data.message != null){
				exitFullscreen();
				displayAlert('danger', data.message);
			}
			else{
				$.get("/xp/ajax_load/" + getXpId(), function(html){
					AVAILABLE_RNG = new Rng(data.url, data.id);
					$("#xp_container").html(html);
				});
			}
		});
	}
	getState();
});