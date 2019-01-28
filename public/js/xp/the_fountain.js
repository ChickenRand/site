$(window).on("the_fountain", () => {
  const XP_TOTAL_TRIALS = 100;
  const MAX_XP_DURATION = 60; // In seconds (RNG may sometime be slower)
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
  // We want to count the number of time player hit space or up in a trial
  let upHitCount = 0;
  let spaceHitCount = 0;

  let previousTime = Date.now();
  let cumulTime = null;
  let timeStart = null;
  let trialCount = 0;

  const NUMBER_IMAGE = 14;
  const SPEED_DECOR = 1.5;
  const IMAGE_SIZE = 600;
  const imageX = 0;
  let imageY = NUMBER_IMAGE * -IMAGE_SIZE;
  let animateDecor = false;
  let totalYAnimation = 0;
  let totalAlphaAnimation = 0;
  let diffOne = 0;
  let animateInfluenceTransition = false;
  let positiveInfluence = false;
  const VALUE_MAX = 40;
  const VALUE_MIN = -40;

  //Adding keyboard controls
  document.onkeyup = function(e) {
    // Start counting numbers on the first keyup
    if (!xpStarted) {
      window.AVAILABLE_RNG.reset();
      window.AVAILABLE_RNG.addNumbersCb(onNumbers);
      xpStarted = true;
      timeStart = Date.now();
      cumulTime = Date.now();

      document.getElementById("musicGame").play();
    }

    //Incrémenter la taille de la fontaine
    const key = e.keyCode;
    const ARROW_UP = 38;
    const SPACE = 32;
    const bonusAdd = Math.min(Math.max(diffOne, VALUE_MIN), VALUE_MAX);
    const scoreBonus = heightToAdd + bonusAdd * 0.1;
    //Key up or space
    if (key === ARROW_UP || key === SPACE) {
      // Implicite bool to int transformation
      upHitCount = upHitCount + (key === ARROW_UP);
      spaceHitCount = spaceHitCount + (key === SPACE);
      fountainHeight += heightToAdd + bonusAdd * 0.1;
      score += (heightToAdd + scoreBonus) * level;
      if (fountainHeight >= 500) {
        fountainHeight = 0;
        level++;
        document.getElementById("upLevel").play();
        animateDecor = true;
        heightToAdd -= 2;
        totalYAnimation = 0;
      }
    }
  };
  const MAX_INFLUENCE_ALPHA = 0.5;
  function animateAlphaTransition(positiveInfluence, delta) {
    const SPEED_TRANSITION = 0.003;
    totalAlphaAnimation = totalAlphaAnimation + SPEED_TRANSITION * delta;
    ctx.globalAlpha = totalAlphaAnimation;
    if (totalAlphaAnimation > MAX_INFLUENCE_ALPHA) {
      totalAlphaAnimation = 0;
      animateInfluenceTransition = false;
    }
  }

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
    const image = document.getElementById("the_final_fountain");
    ctx.globalAlpha = 1;
    ctx.drawImage(image, imageX, imageY);
    jet = document.getElementById("jet");
    ctx.drawImage(jet, 80, 500 - fountainHeight);
    //Background transition Positive and Negative influence
    if (animateInfluenceTransition) {
      animateAlphaTransition(positiveInfluence, delta);
    } else {
      ctx.globalAlpha = MAX_INFLUENCE_ALPHA;
    }
    const imgName = positiveInfluence
      ? "positive_influence_background"
      : "negative_influence_background";
    const img = document.getElementById(imgName);
    ctx.drawImage(img, imageX, 0);

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
      ctx.fillText(`Score : ${parseInt(score)}`, 65, 20);
      ctx.fillText(`FPS : ${parseInt(1000 / delta)}`, 280, 20);
    }
    if (fountainHeight >= decrease) {
      fountainHeight = fountainHeight - decrease;
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
    window.removeFromQueue();
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

  let cumulDiffOne = 0;
  function onNumbers(trialRes) {
    //Calcul time for transition Background
    diffOne = trialRes.nbOnes - trialRes.nbZeros;
    cumulDiffOne += diffOne;
    if (xpStarted && Date.now() - cumulTime >= 1000) {
      const previousInfluence = positiveInfluence;
      animateInfluenceTransition = true;
      positiveInfluence = cumulDiffOne > 0;
      cumulDiffOne = 0;
      cumulTime = Date.now();
      if (positiveInfluence === previousInfluence) {
        animateInfluenceTransition = false;
      }
    }

    trialCount++;

    trialRes.gameScore = score;
    trialRes.level = level;
    trialRes.upHitCount = upHitCount;
    trialRes.spaceHitCount = spaceHitCount;

    upHitCount = 0;
    spaceHitCount = 0;

    if (trialCount === XP_TOTAL_TRIALS) {
      endXp();
      displayQuestionnaire();
    }
  }

  animloop();
});
