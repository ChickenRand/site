"use strict";
$(() => {
  const rng_list = [];
  let rngTest = null;
  let rngChart = null;
  let numbersChartInterval = null;
  let ratioChartInterval = null;
  let cumulChartInterval = null;
  let graphStartTime = null;

  function onOpen(rng) {
    //If we are here, it means the rng state is available
    rng.stop();
    rng_list.splice(rng_list.indexOf(rng), 1);
    $(`#rng_test_${rng.id}`).removeClass("disabled");
    $(`#rng_graph_${rng.id}`).removeClass("disabled");
    setRngStatus(rng.id, "Disponible", "success");
  }

  function onNumbers() {
    // Numbers are not sended automatically anymore
  }

  function onErrors(message, rng) {
    rng.stop();
    rng_list.splice(rng_list.indexOf(rng), 1);
    $(`#rng_test_${rng.id}`).addClass("disabled");
    $(`#rng_graph_${rng.id}`).addClass("disabled");
    setRngStatus(rng.id, "Non connecté", "danger");
  }

  function onTest(data, rng) {
    //Limite at 4 decimals
    const ratio = Math.floor(rng.getRatio() * 10000) / 10000;
    setRngLabel(rng.id, `Ratio : ${ratio}`, "success");
  }

  function setRngLabel(id, status, label) {
    const span = $(`#rng_status_${id}`);
    span.html(status);
    span.removeClass("label-default");
    span.addClass(`label-${label}`);
  }

  function setRngStatus(id, status, label) {
    setRngLabel(id, status, label);
    const ok = label === "danger" ? false : true;
    $.post(`/admin/set_rng_status/${id}.json`, { status: ok }, () => {
      //do-nothing
    });
  }

  $(".rng-url").each((i, e) => {
    const url = $(e).html();
    const rngId = $(e)
      .attr("id")
      .split("_")
      .pop();
    const rng = new window.Rng(url, rngId, onNumbers, onErrors, onOpen);
    rng_list.push(rng);
  });

  function getRngId(el) {
    return $(el)
      .attr("id")
      .split("_")[2];
  }

  function getUrl(rngId) {
    return $(`#rng_url_${rngId}`).html();
  }

  $(".rng-test").click(e => {
    if ($(e.target).html() === "Tester nombres") {
      $(e.target).html("Arrêter le test");
      const rngId = getRngId(e.target);
      const url = getUrl(rngId);
      if (rngTest !== undefined) {
        rngTest.stop();
      }
      rngTest = new window.Rng(url, rngId, onTest);
    } else {
      if (rngTest !== undefined) {
        rngTest.stop();
      }
      $(e.target).html("Tester nombres");
    }
  });

  function createNumChart() {
    //Init numbers repartition tabs
    const numbersRepartition = [];
    const numbersLabels = [];
    for (let i = 0; i < 256; i++) {
      numbersRepartition.push(0);
      i % 8 === 0 ? numbersLabels.push(i) : numbersLabels.push("");
    }

    const data = {
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
    const options = {
      //Disable animation to limit CPU usage
      animation: false,
      datasetFill: false,
      datasetStroke: false,
      scaleShowLabels: true,
      pointDot: false,
      bezierCurve: false
    };
    const ctx_num = $("#num_chart")
      .get(0)
      .getContext("2d");
    const numbersChart = new Chart(ctx_num).Line(data, options);

    rngChart.addNumbersCb(data => {
      for (let i = 0; i < data.numbers.length; i++) {
        const num = data.numbers[i];
        numbersRepartition[num]++;
      }
    });
    //Update the graph each two seconds
    numbersChartInterval = window.setInterval(() => {
      for (let i = 0; i < numbersRepartition.length; i++) {
        numbersChart.datasets[0].points[i].value = numbersRepartition[i];
      }
      numbersChart.update();
    }, 2000);
  }

  function createRatioChart() {
    let bitRate = 0;
    const instantRatios = [];
    const cumulRatios = [];
    const label = [];
    for (let i = 0; i < 50; i++) {
      instantRatios.push(0.5);
      cumulRatios.push(0.5);
      label.push("");
    }
    const data = {
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
    const options = {
      //Disable animation to limit CPU usage
      animation: false,
      datasetFill: false,
      datasetStroke: false,
      scaleShowLabels: true,
      pointDot: false,
      bezierCurve: false
    };
    const ctx_ratio = $("#ratio_chart")
      .get(0)
      .getContext("2d");
    const ratioChart = new Chart(ctx_ratio).Line(data, options);

    rngChart.addNumbersCb((data, rng) => {
      const elapsedTime = (Date.now() - graphStartTime) / 1000;
      bitRate = (rng.totalOnes + rng.totalZeros) / elapsedTime;
      $("#bit_rate").html(`Bitrate : ${Math.floor(bitRate / 1000)}kbits/s`);

      const cumulRatio = rng.totalOnes / (rng.totalOnes + rng.totalZeros);
      cumulRatios.shift();
      cumulRatios.push(cumulRatio);
      const instantRatio = data.nbOnes / (data.nbOnes + data.nbZeros);
      instantRatios.shift();
      instantRatios.push(instantRatio);
    });
    ratioChartInterval = window.setInterval(() => {
      for (let i = 0; i < instantRatios.length; i++) {
        ratioChart.datasets[0].points[i].value = instantRatios[i];
        ratioChart.datasets[1].points[i].value = cumulRatios[i];
      }
      ratioChart.update();
    }, 1000);
  }

  function createCumulativChart() {
    const diffOnesTab = [];
    const label = [];
    for (let i = 0; i < 50; i++) {
      diffOnesTab.push(0);
      label.push("");
    }
    const data = {
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
    const options = {
      //Disable animation to limit CPU usage
      animation: false,
      datasetFill: false,
      datasetStroke: false,
      scaleShowLabels: true,
      pointDot: false,
      bezierCurve: false
    };
    const ctx_cumul = $("#diff_ones_chart")
      .get(0)
      .getContext("2d");
    const cumulChart = new Chart(ctx_cumul).Line(data, options);
    rngChart.addNumbersCb((data, rng) => {
      const diffOnes = rng.totalOnes - rng.totalZeros;
      diffOnesTab.shift();
      diffOnesTab.push(diffOnes);
    });
    cumulChartInterval = window.setInterval(() => {
      for (let i = 0; i < diffOnesTab.length; i++) {
        cumulChart.datasets[0].points[i].value = diffOnesTab[i];
      }
      cumulChart.update();
    }, 2000);
  }

  //Stop the RNG when the modal is closed
  $("#graph_modal").on("hidden.bs.modal", () => {
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

  $(".rng-graph").click(e => {
    const rngId = getRngId(e.target);
    const url = getUrl(rngId);
    rngChart = new window.Rng(url, rngId);

    graphStartTime = Date.now();

    createCumulativChart();
    createRatioChart();
    createNumChart();
  });

  const timeoutId = window.setTimeout(() => {
    rng_list.forEach((rng, i) => {
      if (rng !== undefined && rng.socket.readyState === 0) {
        rng.stop();
        rng_list.splice(i, 1);
        $(`#rng_test_${rng.id}`).addClass("disabled");
        setRngStatus(rng.id, "Occupé", "warning");
      }
    });
    window.clearTimeout(timeoutId);
  }, 5000);
});
