"use strict";

$(() => {
  const LIMIT_Z_SCORE = 2.326348; // Correspond to p=0.01
  const NB_BITS_PER_TRIAL = 32000;

  function findXValueGivenZScore(z, nbSamples) {
    const mean = nbSamples / 2;
    const sd = Math.sqrt(nbSamples / 4);

    return z * sd + mean;
  }

  function roundFloat(f) {
    return Math.round(f * 1000) / 1000;
  }

  function calculateZScore(nbSamples, cumulativeDiff, proba) {
    const mean = nbSamples / 2;
    const sd = Math.sqrt(nbSamples / 4);
    const x = mean + cumulativeDiff;
    return proba
      ? window.jStat.ztest(x, mean, sd, 1)
      : window.jStat.zscore(x, mean, sd);
  }

  function createCumulativeGraph(chartId, resultData) {
    const graphDataActive = [0];
    const graphDataControl = [0];
    const highMaxChance = [0];
    const lowMaxChance = [0];

    let bitsPerTrial = 0;
    resultData.forEach(data => {
      const res = JSON.parse(data.results);
      const currentData = res.rng_control ? graphDataControl : graphDataActive;
      res.trials.forEach(trial => {
        if (bitsPerTrial === 0) {
          bitsPerTrial = trial.nbOnes + trial.nbZeros;
        }

        const diff = (trial.nbOnes + trial.nbZeros) / 2 - trial.nbZeros;
        const cumulativeDiff = currentData[currentData.length - 1] + diff;
        currentData.push(cumulativeDiff);
      });
    });

    const label = [];
    const dataToUseForLabel =
      graphDataControl.length > graphDataActive.length
        ? graphDataControl
        : graphDataActive;
    let count = 0;
    dataToUseForLabel.forEach(() => {
      label.push(count++);
      // Also create limit line
      const totalSamples = count * NB_BITS_PER_TRIAL;
      const limitNbSample =
        findXValueGivenZScore(LIMIT_Z_SCORE, totalSamples) - totalSamples / 2;
      highMaxChance.push(limitNbSample);
      lowMaxChance.push(-limitNbSample);
    });

    const data = {
      labels: label,
      datasets: [
        {
          label:
            "Données utilisateur - Cumul du nombre de 1 (si effet doit augmenter avec le temps)",
          data: graphDataActive,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          pointRadius: 0,
          lineTension: 0
        },
        {
          label: "Données contrôle - Cumul du nombre de 1 (doit tendre vers 0)",
          data: graphDataControl,
          backgroundColor: "rgb(99, 132, 255)",
          borderColor: "rgb(99, 132, 255)",
          pointRadius: 0,
          lineTension: 0
        },
        {
          label: "Cumul 'limite' supérieur (p < 0.1)",
          data: highMaxChance,
          backgroundColor: "rgb(125, 125, 125)",
          borderColor: "rgb(125, 125, 125)",
          pointRadius: 0
        },
        {
          label: "Cumul 'limite' inférieur (p < 0.1)",
          data: lowMaxChance,
          backgroundColor: "rgb(125, 125, 125)",
          borderColor: "rgb(125, 125, 125)",
          pointRadius: 0
        }
      ]
    };
    const config = {
      type: "line",
      data,
      options: {
        title: {
          display: true,
          text: "Déviation cumulée des 1 par rapport à la moyenne."
        },
        elements: {
          line: {
            fill: false,
            borderWidth: 1
          }
        },
        //Disable animation to limit CPU usage
        animation: {
          duration: 0 // general animation time
        },
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            title: tooltipItems => {
              return `Lancé ${tooltipItems[0].index}`;
            },
            label: (tooltipItem, data) => {
              const cumulativeDiff =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              const totalSamples = tooltipItem.index * NB_BITS_PER_TRIAL;
              const z = calculateZScore(totalSamples, cumulativeDiff);
              const pz = calculateZScore(totalSamples, cumulativeDiff, true);
              return `Nb. 1 cumulés : ${Math.round(
                cumulativeDiff
              )} (z=${roundFloat(z)} p=${roundFloat(pz)})`;
            }
          }
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: `Nombre de "lancés" (${bitsPerTrial} bits par lancés et 100 lancés par expérimentation.)`
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Cumul des 1 par rapport à la moyenne"
              }
            }
          ]
        }
      }
    };
    const ctx = $(chartId)
      .get(0)
      .getContext("2d");
    const chart = new Chart(ctx, config);

    // Return last p for active data
    const nbSamples = (graphDataActive.length - 1) * NB_BITS_PER_TRIAL;
    const lastCumul = graphDataActive[graphDataActive.length - 1];
    return {
      activeZScore: calculateZScore(nbSamples, lastCumul, true),
      controlPending: graphDataActive.length > graphDataControl.length
    };
  }

  // TEMP : GLOBAL
  window.createCumulativeGraph = createCumulativeGraph;
});
