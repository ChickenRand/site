"use strict";

$(function() {
	const LIMIT_Z_SCORE = 1.645; // Correspond to p=0.05
	// TEMP : I am ashamed of this function. I created it because I couldn't solve a simple
	// equation...
	function findSpecificNumberForChiSquare(wantedChiSquareValue, nbSamples) {
		const hypothesis = nbSamples / 2;
		let nbSamplesFitChiSquare = hypothesis;
		let currentChiSquare = -1;
		while(currentChiSquare < wantedChiSquareValue - 0.01) {
			if(currentChiSquare !== -1) {
				nbSamplesFitChiSquare += 1;
			}
			currentChiSquare = Math.pow(nbSamplesFitChiSquare - hypothesis, 2) / hypothesis + Math.pow((nbSamples - nbSamplesFitChiSquare) - hypothesis, 2) / hypothesis;
		}
		return nbSamplesFitChiSquare;
	}

	function findXValueGivenZScore(z, nbSamples) {
		const mean = nbSamples / 2;
		const sd = Math.sqrt(nbSamples / 4);

		return z * sd + mean;
	}

	function roundFloat(f) {
		return Math.round(f * 1000) / 1000
	}

	function calculateChiSquare(nbSamples, cumulativeDiff) {
		const hypothesis = nbSamples / 2.0;
		return Math.pow(cumulativeDiff, 2.0) / hypothesis + Math.pow(-cumulativeDiff, 2.0) / hypothesis;
	}

	function calculateZScore(nbSamples, cumulativeDiff, proba) {
		const mean = nbSamples / 2;
		const sd = Math.sqrt(nbSamples / 4);
		const x = mean + cumulativeDiff;

		return proba ? jStat.ztest( x, mean, sd, 1) : jStat.zscore(x, mean, sd);
	}

	function createCumulativeGraph(chartId, resultData) {
		const graphDataActive = [0];
		const graphDataControl = [0];
		const highMaxChance = [0];
		const lowMaxChance = [0];

		let totalSamples = 0;
		let bitsPerTrial = 0;
		resultData.forEach(function (data, i) {
			const res = JSON.parse(data.results);
			const currentData = res.rng_control ? graphDataControl : graphDataActive;
			res.trials.forEach(function (trial) {
				if(bitsPerTrial === 0) {
					bitsPerTrial = trial.nbOnes + trial.nbZeros;
				}
				const diff = ((trial.nbOnes + trial.nbZeros) / 2) - trial.nbZeros;
				const cumulativeDiff = currentData[currentData.length - 1] + diff
				currentData.push(cumulativeDiff);
				// We just need to generate high and low limit once
				if(res.rng_control) {
					totalSamples += trial.nbOnes + trial.nbZeros;
					//const limitNbSample = findSpecificNumberForChiSquare(jStat.chisquare.inv(0.95, 1), totalSamples) - totalSamples / 2;
					const limitNbSample = findXValueGivenZScore(LIMIT_Z_SCORE, totalSamples) - totalSamples / 2;
					highMaxChance.push(limitNbSample);
					lowMaxChance.push(-limitNbSample);
				}
			});
		});

		const label = [];
		let count = 0;
		const dataToUseForLabel = graphDataControl.length > graphDataActive.length ? graphDataControl : graphDataActive;
		dataToUseForLabel.forEach(function() {
			label.push(count++);
		});

		const data = {
			labels: label,
			datasets: [{
					label: "Active line Cumulative NbOnes-NbZeros",
					data: graphDataActive,
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					pointRadius: 0,
					lineTension: 0
				}, {
					label: "Control line Cumulative NbOnes-NbZeros",
					data: graphDataControl,
					backgroundColor: 'rgb(99, 132, 255)',
					borderColor: 'rgb(99, 132, 255)',
					pointRadius: 0,
					lineTension: 0
				}, {
					label: "High limit limit (p < 0.5)",
					data: highMaxChance,
					backgroundColor: 'rgb(125, 125, 125)',
					borderColor: 'rgb(125, 125, 125)',
					pointRadius: 0
				}, {
					label: "Low limit (p < 0.5)",
					data: lowMaxChance,
					backgroundColor: 'rgb(125, 125, 125)',
					borderColor: 'rgb(125, 125, 125)',
					pointRadius: 0
				}
			]
		};
		const config = {
			type: 'line',
			data: data,
			options: {
				title: {
					display: true,
					text: 'Cumulative deviations of trial mean values'
				},
				elements: {
					line: {
						fill: false,
						borderWidth: 1
					}
				},
				//Disable animation to limit CPU usage
				animation: {
					duration: 0, // general animation time
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: function (tooltipItem, data) {
							const cumulativeDiff = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							const totalSamples = tooltipItem.index * 32000;
							// const p = 1 - jStat.chisquare.cdf(calculateChiSquare(totalSamples, cumulativeDiff), 1 );
							const z = calculateZScore(totalSamples, cumulativeDiff);
							const pz = calculateZScore(totalSamples, cumulativeDiff, true);
							return cumulativeDiff + ' (z=' + roundFloat(z) + ' and p=' + roundFloat(pz) + ')';
						}
					}
				},
				hover: {
					animationDuration: 0, // duration of animations when hovering an item
				},
				responsiveAnimationDuration: 0, // animation duration after a resize
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Number of trials (' + bitsPerTrial + ' bits per trials)'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Cumulative bits'
						}
					}]
				}
			},

			data: data
		};
		const ctx = $(chartId).get(0).getContext("2d");
		const chart = new Chart(ctx, config);
	}

	$('#diff_ones_fountain').before('<div id="loader"><img src="/images/ajax-loader.gif">  Fetching results...</div>');

	$.get('/admin/get_raw_results_fountain.json', function(data) {
		if(data.length > 0) {
			createCumulativeGraph('#diff_ones_fountain', data);
			$('#loader').remove();
		} else {
			$('#diff_ones_fountain').remove();
			$('#loader').html('No results.');
		}
	});
});
