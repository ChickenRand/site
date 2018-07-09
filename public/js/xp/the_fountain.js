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
  let score = 0;

  let previousTime = Date.now();
  let totalXpTime = 0;
  let timeStart = null;

  let trialCount = 0;
  const xpScores = [];

  const NUMBER_IMAGE = 7;
  const SPEED_DECOR = 1.5;
  const IMAGE_SIZE = 600;
  let imageX = 0;
  let imageY = NUMBER_IMAGE * -IMAGE_SIZE;
  let animateDecor = false;
  let background = false;
  let totalYAnimation = 0;
  let diffOne = 0;

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
    const ARROW_UP = 38;
    const SPACE = 32;
    //Key up or space
    if (key === ARROW_UP || key === SPACE) {
      let BonusAdd = Math.min(Math.max(diffOne, -40), 40);
      fountainHeight += heightToAdd + BonusAdd * 0.1;
      score += heightToAdd;
      if (fountainHeight >= 500) {
        fountainHeight = 0;
        level++;
        animateDecor = true;
        heightToAdd -= 2;
        totalYAnimation = 0;
      }
    }
  };
  function update() {
    const currentTime = Date.now();
    const delta = currentTime - previousTime;
    previousTime = currentTime;
    const totalTime = currentTime - timeStart;
    const animationHeight = SPEED_DECOR * delta;
    const HEIGHT_TO_REMOVED = 0.125;
    const decrease = HEIGHT_TO_REMOVED * delta;
    if (animateDecor) {
      imageY = imageY + animationHeight;
      totalYAnimation = totalYAnimation + animationHeight;
    }
    if (totalYAnimation > IMAGE_SIZE) {
      animateDecor = false;
    }
    // Stop xp if no number are recieved at the end
    if (xpStarted && totalTime > MAX_XP_DURATION * 1000) {
      running = false;
      $(window).trigger("rng-error");
    }
    ctx.clearRect(0, 0, width, height);
    ctx.font = "16pt Arial Black, Gadget, sans-serif";
    ctx.textAlign = "center";
    image = document.getElementById("the_final_fountain");
    ctx.drawImage(image, imageX, imageY);
    jet = document.getElementById("jet");
    ctx.drawImage(jet, 80, 500 - fountainHeight);
    fond_rouge = document.getElementById("fond_rouge");
    ctx.globalAlpha = 0;
    ctx.drawImage(fond_rouge, imageX, imageY);
    ctx.globalAlpha = 1;
    fond_vert = document.getElementById("fond_vert");
    ctx.globalAlpha = 0;
    ctx.drawImage(fond_vert, imageX, imageY);
    ctx.globalAlpha = 1;

    if (diffOne > 0) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(fond_rouge, imageX, imageY);
      ctx.globalAlpha = 0.2;
      ctx.drawImage(fond_vert, imageX, imageY);
      ctx.globalAlpha = 0.7;
      ctx.drawImage(image, imageX, imageY);
      ctx.globalAlpha = 1;
      ctx.drawImage(jet, 80, 500 - fountainHeight);
    } else {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(fond_vert, imageX, imageY);
      ctx.globalAlpha = 0.2;
      ctx.drawImage(fond_rouge, imageX, imageY);
      ctx.globalAlpha = 0.7;
      ctx.drawImage(image, imageX, imageY);
      ctx.globalAlpha = 1;
      ctx.drawImage(jet, 80, 500 - fountainHeight);
    }

    if (!xpStarted) {
      ctx.font = "11pt press_start_2pregular";
      ctx.fillText("Appuyez sur haut ou espace", width / 2, height / 2);
      ctx.fillText(
        "pour faire grandir la fontaine",
        width / 2,
        height / 2 + 50
      );
    }

    if (xpStarted) {
      ctx.font = "11pt press_start_2pregular";
      ctx.fillText(`Niveau : ${level}`, 60, 50);
      ctx.fillText(`Temps : ${parseInt(totalTime / 1000, 10)}s`, 280, 50);
      ctx.fillText(`Score : ${parseInt(level * score)}`, 65, 20);
      ctx.fillText(`FPS : ${parseInt(1000 / delta)}`, 280, 20);
    }
    if (fountainHeight >= decrease) {
      fountainHeight = fountainHeight - decrease;
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
      totalXpTime = Date.now() - timeStart;
    }

    trialCount++;
    diffOne = trialRes.nbOnes - trialRes.nbZeros;
    if (trialRes.nbOnes > trialRes.nbZeros) {
    } else {
    }
    // Find the corresponding score with the numbers
    // It's not 100% accurate but I think it'll be enough
    trialRes.gameScore = fountainHeight;
    trialRes.level = level;
    // Rewrite the time

    // We recieve the numbers each 100ms
    if (trialCount === XP_TOTAL_TRIALS) {
      endXp();
      displayQuestionnaire();
    }
  }

  //Set up everything for the RNG and results collecting
  if (window.AVAILABLE_RNG !== undefined) {
    window.AVAILABLE_RNG.addNumbersCb(onNumbers);
  }

  animloop();
});
