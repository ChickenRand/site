"use strict";

$(() => {
  const TIME_TO_WAIT_BEFORE_FETCHING_CONTROL = 20 * 1000; // in ms
  function refreshGraph() {
    $("#diff_ones_fountain").before(
      '<div id="loader"><img src="/images/ajax-loader.gif">  Récupération des données...</div>'
    );

    $.get(`/results/get_results/${window.CURRENT_USER_ID}.json`, data => {
      if (data.length > 0) {
        const graph = window.createCumulativeGraph("#diff_ones_fountain", data);
        if (graph.controlPending) {
          $("#diff_ones_fountain").before(
            '<p id="waiting_control">En attente des résultats contrôles...</p>'
          );
          window.setTimeout(refreshGraph, TIME_TO_WAIT_BEFORE_FETCHING_CONTROL);
        } else {
          $("#waiting_control").remove();
        }
        const chances = Math.round(1 / graph.activeZScore);
        $("#result_message").html(
          `Il y 1 chance sur <strong>${chances}</strong> que ces résultats soient dut au hasard.`
        );
        $("#loader").remove();
      } else {
        $("#diff_ones_fountain").remove();
        $("#loader").html("No results.");
      }
    });
  }

  refreshGraph();
});
