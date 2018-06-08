"use strict";
$(function(){
	var rng_list = [];
	var rngTest = null;
	var rngChart  = null;
	var numbersChartInterval = null;
	var ratioChartInterval = null;
	var cumulChartInterval = null;
	var graphStartTime = null;

	function onOpen(rng) {
		//If we are here, it means the rng state is available
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		$("#rng_test_"+rng.id).removeClass("disabled");
		$("#rng_graph_"+rng.id).removeClass("disabled");
		setRngStatus(rng.id, "Disponible", "success");
	}

	function onNumbers(data, rng){
		// Numbers are not sended automatically anymore
	}

	function onErrors(message, rng){
		rng.stop();
		rng_list.splice(rng_list.indexOf(rng), 1);
		$("#rng_test_"+rng.id).addClass("disabled");
		$("#rng_graph_"+rng.id).addClass("disabled");
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
		var rng = new Rng(url, rngId, onNumbers, onErrors, onOpen);
		rng_list.push(rng);
	});

	function getRngId(el){
		return $(el).attr("id").split('_')[2];
	}

	function getUrl(rngId){
		return $("#rng_url_"+rngId).html();
	}

	$(".rng-test").click(function(e, el){
		if($(this).html() === "Tester nombres"){
			$(this).html("Arrêter le test")
			var rngId = getRngId(this);
			var url = getUrl(rngId);
			if(rngTest != null){
				rngTest.stop();
			}
			rngTest = new Rng(url, rngId, onTest);
		}
		else{
			if(rngTest != null){
				rngTest.stop();
			}
			$(this).html("Tester nombres");
		}
	});

	function createNumChart(){
		//Init numbers repartition tabs
		var numbersRepartition = [];
		var numbersLabels = [];
		for(var i = 0; i < 256 ; i++){
			numbersRepartition.push(0);
			i % 8 == 0 ? numbersLabels.push(i) : numbersLabels.push("");
		}

		var data = {
			labels: numbersLabels,
			datasets: [
				{
					label: "Numbers repartition",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: numbersRepartition
				}
			]
		};
		var options = {
			//Disable animation to limit CPU usage
			animation: false,
			datasetFill: false,
			datasetStroke: false,
			scaleShowLabels: true,
			pointDot: false,
			bezierCurve: false
		};
		var ctx_num = $("#num_chart").get(0).getContext("2d");
		var numbersChart = new Chart(ctx_num).Line(data, options);


		rngChart.addNumbersCb(function(data, rng){
			for(var i = 0; i < data.numbers.length; i++){
				var num = data.numbers[i];
				numbersRepartition[num]++;
			}
		});
		//Update the graph each two seconds
		numbersChartInterval = window.setInterval(function(){
			for(var i = 0 ; i < numbersRepartition.length ; i++){
				numbersChart.datasets[0].points[i].value = numbersRepartition[i];
			}
			numbersChart.update();
		}, 2000);
	};

	function createRatioChart(){
		var bitRate = 0;
		var instantRatios = [];
		var cumulRatios = [];
		var label = [];
		for(var i = 0; i < 50; i++){
			instantRatios.push(0.5);
			cumulRatios.push(0.5);
			label.push("");
		}
		var data = {
			labels: label,
			datasets: [
				{
					label: "Ratio instantané ",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: instantRatios
				},
				{
					label: "Ratio cumulatif",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(100,220,100,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: cumulRatios
				}
			]
		};
		var options = {
			//Disable animation to limit CPU usage
			animation: false,
			datasetFill: false,
			datasetStroke: false,
			scaleShowLabels: true,
			pointDot: false,
			bezierCurve: false
		};
		var ctx_ratio = $("#ratio_chart").get(0).getContext("2d");
		var ratioChart = new Chart(ctx_ratio).Line(data, options);

		rngChart.addNumbersCb(function(data, rng){
			var elapsedTime = (Date.now() - graphStartTime) / 1000;
			bitRate = (rng.totalOnes + rng.totalZeros) / elapsedTime;
			$('#bit_rate').html('Bitrate : ' + Math.floor(bitRate / 1000) + 'kbits/s');

			var cumulRatio = rng.totalOnes / (rng.totalOnes + rng.totalZeros);
			cumulRatios.shift();
			cumulRatios.push(cumulRatio);
			var instantRatio = data.nbOnes / (data.nbOnes + data.nbZeros);
			instantRatios.shift();
			instantRatios.push(instantRatio);
		});
		ratioChartInterval = window.setInterval(function(){
			for(var i = 0 ; i < instantRatios.length ; i++){
				ratioChart.datasets[0].points[i].value = instantRatios[i];
				ratioChart.datasets[1].points[i].value = cumulRatios[i];
			}
			ratioChart.update();
		}, 1000);
	};

	function createCumulativChart(){
		var diffOnesTab = [];
		var label = [];
		for(var i = 0; i < 50; i++){
			diffOnesTab.push(0);
			label.push("");
		}
		var data = {
			labels: label,
			datasets: [
				{
					label: "Cumulative NbOnes-NbZeros",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: diffOnesTab
				}
			]
		};
		var options = {
			//Disable animation to limit CPU usage
			animation: false,
			datasetFill: false,
			datasetStroke: false,
			scaleShowLabels: true,
			pointDot: false,
			bezierCurve: false
		};
		var ctx_cumul = $("#diff_ones_chart").get(0).getContext("2d");
		var cumulChart = new Chart(ctx_cumul).Line(data, options);
		rngChart.addNumbersCb(function(data, rng){
			var diffOnes = rng.totalOnes - rng.totalZeros;
			diffOnesTab.shift();
			diffOnesTab.push(diffOnes);
		});
		cumulChartInterval = window.setInterval(function(){
			for(var i = 0; i < diffOnesTab.length; i++){
				cumulChart.datasets[0].points[i].value = diffOnesTab[i];
			}
			cumulChart.update();
		}, 2000);
	}

	//Stop the RNG when the modal is closed
	$('#graph_modal').on('hidden.bs.modal', function (e) {
		rngChart.stop();
		rngChart = null;
		window.clearInterval(numbersChartInterval);
		window.clearInterval(ratioChartInterval);
		window.clearInterval(cumulChartInterval);
		numbersChartInterval = null;
		ratioChartInterval = null;
		cumulChartInterval = null;
		graphStartTime = null;
	});

	$(".rng-graph").click(function(e, el){
		var rngId = getRngId(this);
		var url = getUrl(rngId);
		rngChart = new Rng(url, rngId);

		graphStartTime = Date.now();

		createCumulativChart();
		createRatioChart();
		createNumChart();


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
