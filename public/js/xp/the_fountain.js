$(window).on("the_fountain", () => {
  const XP_TOTAL_TRIALS = 100;
  const MAX_XP_DURATION = 60; // In seconds (RNG may sometime be slower)
  const MAX_NUMBER_RECIEVE_DURATION = 5000; // In ms
  let running = true;
  let xpStarted = false;

  $("#xp_container").addClass("fountain-container");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const width = 362,
    height = 600;

  canvas.width = width;
  canvas.height = height;

  let fountainHeight = 0;
  let level = 1;
  let heightToAdd = 30;

  let previousTime = Date.now();
  let totalXpTime = 0;
  let timeStart = null;

  let trialCount = 0;
  const xpScores = [];

  //Adding keyboard controls
  document.onkeyup = function(e) {
    // Start counting numbers on the first keyup
    if (!xpStarted) {
      window.AVAILABLE_RNG.reset();
      xpStarted = true;
      timeStart = Date.now();
      window.AVAILABLE_RNG.sendStartMessage();
    }
    //Incrémenter la taille de la fontaine
    const key = e.keyCode;
    //Key up or space
    if (key === 38 || key === 32) {
      fountainHeight += heightToAdd;
      if (fountainHeight >= 500) {
        fountainHeight = 0;
        level++;
        heightToAdd -= 2;
      }
    }
  };

  function update() {
    const currentTime = Date.now();
    const deltaTime = currentTime - previousTime;
    const totalTime = currentTime - timeStart;

    // Stop xp if no number are recieved at the end
    if (xpStarted && totalTime > MAX_XP_DURATION * 1000) {
      running = false;
      $(window).trigger("rng-error");
    }

    ctx.clearRect(0, 0, width, height);
    ctx.font = "16pt Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";

    image = document.getElementById("the_fountain");
    ctx.drawImage(image, 0, 0);
    jet = document.getElementById("jet");
    ctx.drawImage(jet, 80, 500 - fountainHeight);

    if (!xpStarted) {
      ctx.fillText("Appuyez sur haut ou espace", width / 2, height / 2);
      ctx.fillText(
        "pour faire grandir la fontaine",
        width / 2,
        height / 2 + 50
      );
    }

    if (xpStarted) {
      ctx.fillText(`Niveau : ${level}`, 60, 50);
      ctx.fillText(`Temps : ${parseInt(totalTime / 1000, 10)} s`, 240, 50);
    }

    if (deltaTime >= 50) {
      const decrease = Math.ceil(deltaTime / 10.0);
      if (fountainHeight > 0) {
        fountainHeight -= decrease;
        fountainHeight = Math.max(fountainHeight, 0);
      }
      previousTime = currentTime;
    }

    // Store the score each tick, this way we can precisely interpolate with numbers
    // from RNG
    if (xpStarted) {
      xpScores.push({
        level,
        gameScore: fountainHeight,
        time: totalTime
      });
    }
  }

  function animloop() {
    if (running) {
      update();
      window.requestAnimId = window.requestAnimFrame(animloop);
    }
  }

  function endXp() {
    running = false;
    window.cancelAnimationFrame(window.requestAnimId);
    document.onkeydown = null;
    ctx.fillText("FIN DE L'EXPERIENCE", width / 2, height / 2);
    ctx.fillText("VEUILLEZ PATIENTEZ...", width / 2, height / 2 + 50);
  }

  function displayQuestionnaire() {
    //We do not need to check if the user is leaving anymore
    $(window).unbind("beforeunload");
    //Changing container content to display questionnaire which will send xp results
    $.get("/xp/questionnaire", html => {
      $("#xp_container").removeClass("fountain-container");
      window.exitFullscreen();
      $("#xp_container").hide();
      $("#xp_container").html(html);
      $(window).trigger("questionnaire");
      $("#xp_container").fadeToggle(2000);
    });
  }

  function onNumbers(trialRes) {
    if (trialCount === 0) {
      endXp();
      totalXpTime = Date.now() - timeStart;
      // Stop XP if not enough number recieved
      window.setTimeout(() => {
        if (trialCount < XP_TOTAL_TRIALS) {
          $(window).trigger("rng-error");
        }
      }, MAX_NUMBER_RECIEVE_DURATION);
    }

    trialCount++;
    // Interpolate time when numbers where generated
    const trialTime = totalXpTime / XP_TOTAL_TRIALS * trialCount;
    // Find the corresponding score with the numbers
    // It's not 100% accurate but I think it'll be enough
    const score = xpScores.find(el => el.time >= trialTime);
    if (score) {
      trialRes.gameScore = score.gameScore;
      trialRes.level = score.level;
      // Rewrite the time
      trialRes.ms = score.time;
    }

    // We recieve the numbers each 100ms
    if (trialCount === XP_TOTAL_TRIALS) {
      displayQuestionnaire();
    }
  }

  //Set up everything for the RNG and results collecting
  if (window.AVAILABLE_RNG !== undefined) {
    window.AVAILABLE_RNG.addNumbersCb(onNumbers);
  }

  animloop();
});
