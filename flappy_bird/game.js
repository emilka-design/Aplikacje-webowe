const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.3;
const JUMP = -5;
const SPEED = 2;
const GROUND_H = 112;

const bgImg = new Image();
bgImg.src = "assets/Flappy Bird/background-day.png";

const groundImg = new Image();
groundImg.src = "assets/Flappy Bird/base.png";

const pipeImg = new Image();
pipeImg.src = "assets/Flappy Bird/pipe-green.png";

const birdImgs = [new Image(), new Image(), new Image()];
birdImgs[0].src = "assets/Flappy Bird/yellowbird-upflap.png";
birdImgs[1].src = "assets/Flappy Bird/yellowbird-midflap.png";
birdImgs[2].src = "assets/Flappy Bird/yellowbird-downflap.png";

const flapSound = new Audio("assets/Sound Efects/wing.wav");
const pointSound = new Audio("assets/Sound Efects/point.wav");
const hitSound = new Audio("assets/Sound Efects/hit.wav");
const dieSound = new Audio("assets/Sound Efects/die.wav");

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

let state = "start";
let bird;
let pipes;
let score;
let frames;
let groundX;
let speed = SPEED;
let boosts = [];
let ghostTime = 0;
let fastTarget = 0;

function resetGame() {
  bird = { x: 60, y: 200, width: 34, height: 24, speed: 0, img: 0 };
  pipes = [];
  score = 0;
  frames = 0;
  groundX = 0;
  speed = SPEED;
  boosts = [];
  ghostTime = 0;
  fastTarget = 0;
}

function updateBird() {
  bird.speed += GRAVITY;
  bird.y += bird.speed;
}

function animateBird() {
  if (frames % 6 === 0) {
    bird.img = (bird.img + 1) % 3;
  }
}

function drawBird() {
  let angle = bird.speed * 0.1;
  if (angle < -0.5) angle = -0.5;
  if (angle > 1.57) angle = 1.57;
  if (state === "record") angle = frames * 0.2;

  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(angle);
  ctx.drawImage(birdImgs[bird.img], -bird.width / 2, -bird.height / 2);
  ctx.restore();
}

function addPipe() {
  const gap = 85 + Math.random() * 30;
  const top = 50 + Math.random() * (canvas.height - GROUND_H - gap - 100);
  pipes.push({
    x: canvas.width,
    width: 52,
    top: top,
    bottom: top + gap,
    passed: false,
  });
  if (Math.random() < 0.3) {
    boosts.push({
      x: canvas.width + 26,
      y: top + gap / 2,
      type: Math.random() < 0.5 ? "ghost" : "fast",
    });
  }
}

function updatePipes() {
  const last = pipes[pipes.length - 1];
  if (!last || last.x < canvas.width - 180) {
    addPipe();
  }
  pipes.forEach((pipe) => {
    pipe.x -= speed;

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
      playSound(pointSound);
    }
  });

  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

function drawPipes() {
  if (ghostTime > 0) ctx.globalAlpha = 0.4;
  pipes.forEach((pipe) => {
    ctx.save();
    ctx.translate(pipe.x, pipe.top);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, 0, 0);
    ctx.restore();

    ctx.drawImage(pipeImg, pipe.x, pipe.bottom);
  });
  ctx.globalAlpha = 1;
}

function updateBoosts() {
  boosts.forEach((boost) => {
    boost.x -= speed;

    const dx = bird.x + bird.width / 2 - boost.x;
    const dy = bird.y + bird.height / 2 - boost.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      boost.taken = true;
      if (boost.type === "ghost") ghostTime = 300;
      if (boost.type === "fast") fastTarget = score + 3;
    }
  });

  boosts = boosts.filter((boost) => !boost.taken && boost.x > -20);
}

function drawBoosts() {
  boosts.forEach((boost) => {
    ctx.fillStyle = boost.type === "ghost" ? "lightblue" : "orange";
    ctx.beginPath();
    ctx.arc(boost.x, boost.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(boost.type === "ghost" ? "G" : "F", boost.x, boost.y + 4);
  });
}

function flyToGap() {
  const next = pipes.find((pipe) => pipe.x + pipe.width > bird.x);
  if (next) {
    const target = (next.top + next.bottom) / 2 - bird.height / 2;
    bird.y += (target - bird.y) * 0.2;
  }
  bird.speed = 0;
}

function hitPipe() {
  return pipes.some(
    (pipe) =>
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom),
  );
}

function hitGround() {
  return bird.y + bird.height >= canvas.height - GROUND_H;
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawGround() {
  ctx.drawImage(groundImg, groundX, canvas.height - GROUND_H);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "right";
  ctx.fillText(score, canvas.width - 10, 40);
  if (ghostTime > 0) {
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Duch: " + Math.ceil(ghostTime / 60) + "s", 10, 30);
  }
}

function gameLoop() {
  if (state === "start") {
    frames++;
    animateBird();
    moveGround();
  }
  if (state === "playing") {
    frames++;
    speed = fastTarget > 0 ? SPEED * 6 : SPEED;

    if (fastTarget > 0) {
      flyToGap();
    } else {
      updateBird();
    }
    animateBird();
    updatePipes();
    updateBoosts();
    moveGround();

    if (ghostTime > 0) ghostTime--;
    if (fastTarget > 0 && score >= fastTarget) fastTarget = 0;

    if (hitPipe() && ghostTime === 0 && fastTarget === 0) {
      playSound(hitSound);
      state = "falling";
      bird.speed = 0;
    } else if (hitGround()) {
      playSound(hitSound);
      gameOver();
    }
  }

  if (state === "falling") {
    updateBird();
    if (hitGround()) {
      bird.y = canvas.height - GROUND_H - bird.height;
      playSound(dieSound);
      gameOver();
    }
  }
  if (state === "record") {
    frames++;
  }
  drawBackground();
  drawPipes();
  drawBoosts();
  drawGround();
  drawBird();
  if (state !== "start") {
    drawScore();
  }

  requestAnimationFrame(gameLoop);
}

function moveGround() {
  groundX -= speed;
  if (groundX <= -24) {
    groundX = 0;
  }
}

function onKeyDown(event) {
  if (event.code !== "Space") return;
  event.preventDefault();

  if (state === "start") {
    document.getElementById("start-screen").classList.add("hidden");
    state = "playing";
  }

  if (state === "playing") {
    bird.speed = JUMP;
    playSound(flapSound);
  }
}

function saveScore(newScore) {
  const scores = JSON.parse(localStorage.getItem("top5")) || [];
  scores.push(newScore);
  scores.sort((a, b) => b - a);
  const top5 = scores.slice(0, 5);
  localStorage.setItem("top5", JSON.stringify(top5));
  return top5;
}

function gameOver() {
  document.removeEventListener("keydown", onKeyDown);

  const oldScores = JSON.parse(localStorage.getItem("top5")) || [];
  const isRecord =
    score > 0 && (oldScores.length === 0 || score > oldScores[0]);

  const top5 = saveScore(score);

  document.getElementById("last-score").textContent = score;
  document.getElementById("best-score").textContent = top5[0];

  const list = document.getElementById("top5");
  list.innerHTML = "";
  top5.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    list.appendChild(li);
  });

  if (isRecord) {
    document.getElementById("gameover-title").textContent =
      "Gratulacje! Nowy rekord!";
    state = "record";
    frames = 0;
    bird.x = canvas.width / 2 - bird.width / 2;
    bird.y = canvas.height / 2 - 60;
    setTimeout(showGameOverScreen, 3000);
  } else {
    document.getElementById("gameover-title").textContent = "Game Over";
    state = "gameover";
    showGameOverScreen();
  }
}

function showGameOverScreen() {
  state = "gameover";
  document.getElementById("gameover-screen").classList.remove("hidden");
}

function restart() {
  document.getElementById("gameover-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
  resetGame();
  state = "start";
  document.addEventListener("keydown", onKeyDown);
}

document.getElementById("restart-btn").addEventListener("click", restart);

resetGame();
document.addEventListener("keydown", onKeyDown);
gameLoop();
