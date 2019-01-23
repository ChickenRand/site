"use strict";
$(window).on("questionnaire", () => {
  let isDirty = true;
  let userXpIp = null;

  function sendResults() {
    //Doesn't send the datas if there was no AVAILABLE_RNG
    if (window.AVAILABLE_RNG !== null) {
      const data = [
        {
          name: "results",
          value: JSON.stringify(window.AVAILABLE_RNG.results)
        },
        { name: "rng_id", value: window.AVAILABLE_RNG.id }
      ];
      $.post(`/xp/send_results/${window.getXpId()}`, data, data => {
        isDirty = false;
        userXpIp = data;
        // We need to remove from queue only when the RNG close the connection
        // And not before.
        window.AVAILABLE_RNG.setCloseCb(() => {
          window.removeFromQueue();
        });
        window.AVAILABLE_RNG.sendUserXpId(userXpIp);
        $("#submit_results_button").removeClass("disabled");
        $("#submit_results_button").text("Envoyer les résultats");
      });
    } else {
      window.location.replace("/xp/end_xp_problem");
    }
  }

  function manageSpecialInput(name) {
    $(`input[type=radio][name=${name}-radio]`).change(e => {
      const input = $(`input[type=text][name=${name}]`);
      if (e.target.value === "true") {
        input.val("");
        input.show();
      } else {
        input.val("nothing");
        input.hide();
      }
    });
  }

  // @hack, don't understand why I need the timeout
  // Try to trigger the questionnaire event after
  // To wait for the ready event, but the change event on radio
  // button was never trigger
  // The timeout does the tricks...
  window.setTimeout(() => {
    manageSpecialInput("drug");
    manageSpecialInput("music");
  }, 100);

  $("#xp_container").removeClass("outer");
  $("#results_form").submit(e => {
    const formData = $("#results_form").serializeArray();

    e.preventDefault();

    if (userXpIp) {
      $("#xp_container").html(
        '<img src="/images/ajax-loader.gif"> Envoi des données en cours, merci de ne pas fermer la page.'
      );
      $.post(`/xp/send_questionnaire_results/${userXpIp}`, formData, () => {
        $.get("/xp/end_xp", html => {
          $("#xp_container").html(html);
        });
      });
    }
  });

  window.onbeforeunload = function(e) {
    if (e.stopPropagation && isDirty) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Fix a weird chrome bug
  const form = $("#results_form").html();
  $("#results_form").html("");
  const MIN_TIMEOUT_MS = 1;
  window.setTimeout(() => $("#results_form").html(form), MIN_TIMEOUT_MS);

  // We send results right after the questionnaire is loaded
  // This way answers to the questionnaire can wait or can even be skipped by the user
  sendResults();
});
