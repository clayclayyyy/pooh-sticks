let gameState = "menu";     
let startButton, playAgainButton;
let fadeAlpha = 255;

let sticks = [];
let bridgeY;
let bridgeHeight = 40;
let winner = "";

let greenStickImg, pinkStickImg, blueStickImg, yellowStickImg, purpleStickImg;
let bridgeImg, introBoxImg;
let riverVid;

// ✅ NEW: variable for sound
let winnieSound;

function preload() {
  greenStickImg  = loadImage("green stick.PNG");
  pinkStickImg   = loadImage("pink stick.PNG");
  blueStickImg   = loadImage("blue stick.PNG");
  yellowStickImg = loadImage("yellow stick.PNG");
  purpleStickImg = loadImage("purple stick.PNG");
  bridgeImg      = loadImage("bridge.PNG");
  introBoxImg    = loadImage("poohintro.png");

  // ✅ Load audio file
  winnieSound = loadSound("winniesound.mp3");
}

function setup() {
  createCanvas(1200, 800);
  bridgeY = height / 2;
  imageMode(CENTER);
  textFont("Georgia");
  textSize(20);
  fill(212, 196, 176);

  riverVid = createVideo('river22.mov', () => {
    riverVid.volume(0);
    riverVid.hide();
  });

  // ✅ Start button also starts audio
  startButton = createButton("Start Game 🌿");
  startButton.position(width / 2 - 60, height / 2.5 + 120);
  startButton.mousePressed(() => {
    gameState = "fading";
    startButton.hide();
    riverVid.play();
    riverVid.loop();

    // ✅ Play audio once the game starts
    if (winnieSound.isPlaying()) {
      winnieSound.stop();   // make sure it restarts cleanly
    }
    winnieSound.play();
  });
}

function draw() {
  if (gameState === "menu" || gameState === "fading") {
    drawMenu();
    if (gameState === "fading") fadeOutIntro();
  } else if (gameState === "play") {
    drawGame();
  }
}

function drawMenu() {
  background("#1A364D"); 
  tint(255, fadeAlpha);
  image(introBoxImg, width / 2, height / 2);
  noTint();
}

function fadeOutIntro() {
  fadeAlpha -= 5;
  if (fadeAlpha <= 0) {
    fadeAlpha = 0;
    gameState = "play";
  }
}

function drawGame() {
  image(riverVid, width/2, height/2, width, height);

  textSize(20);
  fill(212, 196, 176);
  textAlign(LEFT);
  text("Pink: Press 1 | Purple: Press 2 | Green: Press 3 | Blue: Press 4 | Yellow: Press 5", 20, 40);

  for (let s of sticks) {
    s.x += s.vx;
    s.y += s.vy;

    if (s.image) {
      let w = 150;
      let h = (s.image.height / s.image.width) * w;
      image(s.image, s.x, s.y, w, h);
    } else {
      fill(s.color);
      rect(s.x, s.y, 20, 60);
    }

    if (!s.passed &&
        s.y > bridgeY - bridgeHeight / 2 &&
        s.y < bridgeY + bridgeHeight / 2) {
      s.passed = true;
      if (winner === "") winner = s.player + " wins! 🌿";
    }
  }

  image(bridgeImg, width / 2, bridgeY);

  if (winner !== "") {
    textSize(28);
    textAlign(CENTER);
    text(winner, width / 2, height - 20);
    textAlign(LEFT);
    textSize(20);

    if (!playAgainButton) {
      playAgainButton = createButton("Play Again 🌿");
      playAgainButton.position(width / 2 - 60, height / 2 + 50);
      playAgainButton.mousePressed(() => {
        resetGame();
        playAgainButton.hide();
        playAgainButton = null;
      });
    }
  }
}

function keyPressed() {
  if (gameState === "play") {
    if (key === "1") dropStick("Pink", color(139, 94, 60), pinkStickImg);
    if (key === "2") dropStick("Purple", color(139, 94, 60), purpleStickImg);
    if (key === "3") dropStick("Green", color(139, 94, 60), greenStickImg);
    if (key === "4") dropStick("Blue", color(139, 94, 60), blueStickImg);
    if (key === "5") dropStick("Yellow", color(139, 94, 60), yellowStickImg);
  }
}

function dropStick(player, c, img = null) {
  sticks.push({
    x: random(250, width - 250),
    y: 0,
    vx: random(-0.5, 0.5),
    vy: random(0.8, 1.5),
    color: c,
    image: img,
    player: player,
    passed: false
  });
}

function resetGame() {
  sticks = [];
  winner = "";
}


