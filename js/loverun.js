/* =========================
   RUNNER SELECTION
========================= */
let selectedRunner = "him";

function choose(type){

  selectedRunner = type;

  document.getElementById("himCard").classList.remove("selected");
  document.getElementById("herCard").classList.remove("selected");

  document
    .getElementById(type === "him" ? "himCard" : "herCard")
    .classList.add("selected");
}

/* =========================
   CANVAS
========================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* =========================
   IMAGES
========================= */
const himImg = new Image();
himImg.src = "images/HimRunner.png";

const herImg = new Image();
herImg.src = "images/HerRunner.png";

const bgImg = new Image();
bgImg.src = "images/wedding-bg.png";

const heartImg = new Image();
heartImg.src = "images/heart.png";

/* =========================
   GAME STATE
========================= */
let score = 0;
let running = false;

/* =========================
   PLAYER
========================= */
const player = {
  x: 80,
  y: 240,
  vy: 0,
  jumping: false
};

/* =========================
   OBSTACLES
========================= */
let obstacles = [];
let timer = 0;
let speed = 7;

/* =========================
   START GAME
========================= */
function startGame(){

  document
    .getElementById("selectScreen")
    .classList.add("hidden");

  document
    .getElementById("gameScreen")
    .classList.remove("hidden");

  score = 0;
  running = true;
  obstacles = [];
  timer = 0;
  speed = 7;

  player.y = 240;
  player.vy = 0;
  player.jumping = false;
}

/* =========================
   JUMP
========================= */
function jump(){

  if(!player.jumping){

    player.vy = -18;
    player.jumping = true;
  }
}

document.addEventListener("keydown", e=>{

  if(e.code === "Space"){
    e.preventDefault();
    jump();
  }

});

/* =========================
   SPAWN OBSTACLE
========================= */
function spawnObstacle(){

  obstacles.push({
    x: canvas.width,
    y: 260
  });

}

/* =========================
   UPDATE
========================= */
function update(){

  if(!running) return;

  /* PLAYER PHYSICS */
  player.y += player.vy;
  player.vy += 1;

  if(player.y >= 240){

    player.y = 240;
    player.vy = 0;
    player.jumping = false;

  }

  /* OBSTACLE SPAWN */
  timer++;

  if(timer > 80){

    spawnObstacle();
    timer = 0;

  }

  /* MOVE OBSTACLES */
  for(let i = obstacles.length - 1; i >= 0; i--){

    obstacles[i].x -= speed;

    /* COLLISION */
    if(
      player.x < obstacles[i].x + 50 &&
      player.x + 50 > obstacles[i].x &&
      player.y < obstacles[i].y + 50 &&
      player.y + 50 > obstacles[i].y
    ){
      gameOver();
    }

    /* REMOVE OFF SCREEN */
    if(obstacles[i].x < -100){
      obstacles.splice(i,1);
    }
  }

  score++;

  document.getElementById("score").textContent =
    Math.floor(score / 10);
}

/* =========================
   DRAW
========================= */
function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* BACKGROUND */
  if(bgImg.complete){

    ctx.drawImage(
      bgImg,
      0,
      0,
      canvas.width,
      canvas.height
    );

  } else {

    ctx.fillStyle = "#ffd6f5";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  /* PLAYER */
  if(selectedRunner === "him" && himImg.complete){

    ctx.drawImage(
      himImg,
      player.x,
      player.y,
      70,
      70
    );

  } else if(
    selectedRunner === "her" &&
    herImg.complete
  ){

    ctx.drawImage(
      herImg,
      player.x,
      player.y,
      70,
      70
    );

  } else {

    ctx.fillStyle = "#ff1493";

    ctx.fillRect(
      player.x,
      player.y,
      50,
      50
    );
  }

  /* HEART OBSTACLES */
  for(let o of obstacles){

    if(heartImg.complete){

      ctx.drawImage(
        heartImg,
        o.x,
        o.y,
        50,
        50
      );

    } else {

      ctx.fillStyle = "red";

      ctx.fillRect(
        o.x,
        o.y,
        50,
        50
      );
    }
  }
}

/* =========================
   GAME LOOP
========================= */
function loop(){

  update();
  draw();

  requestAnimationFrame(loop);
}

loop();

/* =========================
   GAME OVER
========================= */
function gameOver(){

  running = false;

  document
    .getElementById("gameScreen")
    .classList.add("hidden");

  document
    .getElementById("gameOverScreen")
    .classList.remove("hidden");

  document
    .getElementById("finalScore")
    .innerText =
      "Score: " + Math.floor(score / 10);
}

/* =========================
   PLAY AGAIN
========================= */
function playAgain(){

  document
    .getElementById("gameOverScreen")
    .classList.add("hidden");

  document
    .getElementById("gameScreen")
    .classList.remove("hidden");

  score = 0;
  running = true;

  obstacles = [];
  timer = 0;

  player.y = 240;
  player.vy = 0;
  player.jumping = false;
}

/* =========================
   CHANGE RUNNER
========================= */
function changeRunner(){

  document
    .getElementById("gameOverScreen")
    .classList.add("hidden");

  document
    .getElementById("selectScreen")
    .classList.remove("hidden");
}