"use strict";
$(function(){
	const BROWSER_SUPPORT_NOTIFICATION = "Notification" in window;
	//WARNING GLOBAL
	window.AVAILABLE_RNG = null;
	var item_id = null;
	var update_interval = null;
	var inQueue = false;
	var firstFullScreen = true;
	//Set moment to french
	moment.locale('fr');

	if(document.fullscreenEnabled){
		$("#no_full_screen").show();
		$("#full_screen").hide();
	}

	$("#full_screen").click(function(e){
		requestFullscreen($("#xp_container").get(0));
		$("#full_screen").hide();
		$("#load_xp").show();
		$('#xp_container').addClass('outer');
		$('#xp_middle').addClass('middle');
		$('#xp_text').addClass('inner');
	});

	$("#load_xp").click(function(e){
		$("#load_xp").hide();
		$("#connect_rng").show();
		startExperiment();
	});

	$("#add_queue").click(function(e){
		askForNotification();
		if(item_id == null){
			addToQueue(false);
			$("#queue_message").show();
			$("#add_queue").html("Me retirer de la file d'attente");
		}
		else{
			removeFromQueue();
			item_id = null;
			$("#add_queue").html("Me mettre dans la file d'attente");
		}
	});

	$("#start_xp").click(function(e){
		showStart();
	});

	function askForNotification() {
		if(BROWSER_SUPPORT_NOTIFICATION) {
			if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
				Notification.requestPermission();
			}
		}
	}

	function notifyUser() {
		if (BROWSER_SUPPORT_NOTIFICATION && Notification.permission === 'granted' && (document.hidden || !document.hasFocus())) {
			let notification = new Notification('Chickenrand', {
				body: "Vous pouvez particper à l'expérience !",
				lang: 'FR'
			});
			// if document is visible again then close it
			$(document).on('visibilitychange blur', function(){
				if(!document.hidden) {
					notification.close();
				}
			});
		}
	}

	function showQueue(estimated_time, showMessage){
		inQueue = true;
		if(showMessage) {
			$("#queue_message").show();
			$("#add_queue").html("Me retirer de la file d'attente");
		}
		$("#queue_container").show();
		$("#before_container").hide();
		$("#xp_container").hide();
		updateDisplayedTime(estimated_time);
	}

	function showStart(){
		if(item_id == null){
			addToQueue(true);
		}
		else{
			showXp();
		}
	}

	function showXp(){
		// If we were waiting for the queue then notify user
		if($('#before_container').hasClass('hide')) {
			notifyUser();
		}
		$('#xp_desc').fadeOut(1000, function () {
			$("#queue_container").hide();
			$("#before_container").hide();
			$("#xp_container").show();
		});
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
			if(item_id && data.item_on_top == item_id){
				if(inQueue){
					inQueue = false;
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
			if(data.message) {
				console.error(data.message);
				window.location.replace('/xp/already_in_queue');
				return;
			}

			item_id = data.item.id;
			//Call the update method each 3 seconds
			update_interval = window.setInterval(update, 3000);

			//directly start if there is nobody
			if(start_directly){
				//Someone can have started the experiment before the user clicked
				if(data.state.length > 1){
					askForNotification();
					showQueue(data.estimated_time, true);
				}
				else{
					showXp();
				}
			}
		});
	}

	function removeFromQueue(callback){
		if(item_id != null){
			$.post("/queue/remove/" + item_id + ".json", function(data){
				if(callback) {
					callback();
				}
			});
		}
		//Also stop the RNG if there was one
		if(AVAILABLE_RNG != null){
			AVAILABLE_RNG.stop();
		}
		//We do not need to check if the user is leaving anymore
		$(window).unbind('beforeunload');
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
					//Add a check if the user is leaving the page in order to properly stop the RNG
					$(window).on('beforeunload', function(){
						removeFromQueue();
						return "Stopping Rng";
					});
					var timeoutId = window.setTimeout(function(){
						if(!AVAILABLE_RNG.isConnected()){
							console.error('RNG not connected');
							onRngError();
						}
						else {
							$(".xp-desc-text").hide();
							$("#xp_container").html(html);
							//TEMP : use hardcoded name
							$('#fountain_container').ready( function () {
								$('#fountain_container').imagesLoaded()
									.done(function () {
										$('#load_img').hide();
										$(window).trigger('the_fountain');
									})
									.fail(function () {
										console.error('Unable to load images');
										onRngError();
									});
							});
						}
						window.clearTimeout(timeoutId);
					}, 2000);
				});
			}
		});
	}
	function displayNoRng() {
		window.location.replace("/xp/no_rng");
	}

	function displayNoFullscreen() {
		window.location.replace("/xp/no_fullscreen");
	}

	function onRngError(){
		removeFromQueue(displayNoRng);
		exitFullscreen();
	}

	function onLeaveDuringXp() {
		removeFromQueue(displayNoFullscreen);
	}
	//Add a check if user remove FullScreen
	//And re-ask for fullscreen
	function onFullscreenChange(){
		if(document.fullscreenElement == null){
			if(firstFullScreen){
				firstFullScreen = false;
			}
			else{
				onLeaveDuringXp();
			}
		}
	}

	$(document).on('webkitfullscreenchange mozfullscreenchange msfullscreenchange fullscreenchange', onFullscreenChange);
	$(document).on('blur', function (){
		if(!firstFullScreen) {
			onLeaveDuringXp();
		}
	});

	$(window).on('rng-error', function () {
		onRngError();
	});
	getState();
});
