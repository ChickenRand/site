$(window).on("the_fountain", () => {
  const XP_TOTAL_TRIALS = 100;
  const MAX_XP_DURATION = 60; // In seconds (RNG may sometime be slower)
  const TIME_BEFORE_START_XP = 2; // In seconds

  let running = true;
  let gameStarted = false;
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
  let heightToAdd = 50;
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
  let displayInfluence = false;
  const VALUE_MAX = 40;
  const VALUE_MIN = -40;

  //Adding keyboard controls
  document.onkeyup = function(e) {
    // Start counting numbers on the first keyup
    if (!gameStarted) {
      gameStarted = true;
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
        if(level < NUMBER_IMAGE) {
          animateDecor = true;
        }
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

  function startAquiringNumbers() {
    xpStarted = true;
    window.AVAILABLE_RNG.reset();
    window.AVAILABLE_RNG.addNumbersCb(onNumbers);
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
      totalYAnimation = Math.min(totalYAnimation + animationHeight, IMAGE_SIZE);

      if (totalYAnimation === IMAGE_SIZE) {
        animateDecor = false;
      }
    }

    // Stop xp if no number are recieved at the end
    if (gameStarted && totalTime > MAX_XP_DURATION * 1000) {
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

    const font = "press_start_2pregular";
    if (!gameStarted) {
      ctx.font = `14pt ${font}`;
      ctx.fillText("APPUYEZ SUR", width / 2, (height / 2) - 50);
      ctx.font = `24pt ${font}`;
      ctx.fillText("🠩", (width / 2) - 100, height / 2);
      ctx.font = `14pt ${font}`;
      ctx.fillText("OU ESPACE", (width / 2) + 20, height / 2);
      ctx.font = `16pt ${font}`;
      ctx.fillText(
        "FRENETIQUEMENT !",
        width / 2,
        height / 2 + 50
      );
    }

    if (gameStarted) {
      if(displayInfluence) {
        const imgName = positiveInfluence
          ? "positive_influence_background"
          : "negative_influence_background";
        const img = document.getElementById(imgName);
        ctx.drawImage(img, imageX, 0);
      }

      ctx.font = `11pt ${font}`;
      ctx.fillText(`NIVEAU : ${level}`, 80, 50);
      ctx.fillText(`TEMPS : ${parseInt(totalTime / 1000, 10)}s`, 280, 50);
      ctx.fillText("SCORE :", 60, 20);
      ctx.fillText(`${parseInt(score)}`, 150, 20);
      // ctx.fillText(`FPS : ${parseInt(1000 / delta)}`, 280, 20);

      // We wait a bit before aquiring numbers because user need à little time to understand
      // how the game works and what to do. Therefore, the first seconds she is not entirely focused.
      if(!xpStarted && totalTime > TIME_BEFORE_START_XP * 1000) {
        startAquiringNumbers();
      }
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
    document.onkeyup = null;
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
    if (gameStarted && Date.now() - cumulTime >= 1000) {
      displayInfluence = true;
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
