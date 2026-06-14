/* IMAGES */
const himImg = new Image();
himImg.src = "images/HimRunner.png";

const herImg = new Image();
herImg.src = "images/HerRunner.png";

const bgImg = new Image();
bgImg.src = "images/wedding-bg.png";

let selectedRunner = "him";

function choose(type){

  selectedRunner = type;

  document.getElementById("himCard").classList.remove("selected");
  document.getElementById("herCard").classList.remove("selected");

  document.getElementById(type === "him" ? "himCard" : "herCard")
    .classList.add("selected");
}

/* CANVAS */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* GAME STATE */
let score = 0;
let running = false;

/* PLAYER */
const player = {
  x: 80,
  y: 240,
  vy: 0,
  jumping: false
};

/* OBSTACLES */
let obstacles = [];
let timer = 0;
let speed = 7;

/* START GAME */
function startGame(){

  document.getElementById("selectScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  score = 0;
  running = true;
  obstacles = [];
  timer = 0;
  speed = 7;
}

/* JUMP */
function jump(){
  if(!player.jumping){
    player.vy = -18;
    player.jumping = true;
  }
}

document.addEventListener("keydown", e=>{
  if(e.code === "Space") jump();
});

/* SPAWN */
function spawnObstacle(){
  obstacles.push({
    x: canvas.width,
    y: 260
  });
}

/* UPDATE */
function update(){

  if(!running) return;

  player.y += player.vy;
  player.vy += 1;

  if(player.y >= 240){
    player.y = 240;
    player.vy = 0;
    player.jumping = false;
  }

  timer++;

  if(timer > 80){
    spawnObstacle();
    timer = 0;
  }

  for(let i = obstacles.length - 1; i >= 0; i--){

    obstacles[i].x -= speed;

    // COLLISION
    if(
      player.x < obstacles[i].x + 40 &&
      player.x + 50 > obstacles[i].x &&
      player.y < obstacles[i].y + 40 &&
      player.y + 50 > obstacles[i].y
    ){
      gameOver();
    }

    if(obstacles[i].x < -100){
      obstacles.splice(i,1);
    }
  }

  score++;
  document.getElementById("score").textContent = Math.floor(score/10);
}

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

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
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  /* GROUND */
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0,300,canvas.width,50);

  /* PLAYER */
  if(selectedRunner === "him" && himImg.complete){

    ctx.drawImage(
      himImg,
      player.x,
      player.y,
      70,
      70
    );

  } else if(selectedRunner === "her" && herImg.complete){

    ctx.drawImage(
      herImg,
      player.x,
      player.y,
      70,
      70
    );

  } else {

    /* fallback if image missing */
    ctx.fillStyle = "#ff1493";
    ctx.fillRect(
      player.x,
      player.y,
      50,
      50
    );
  }

  /* OBSTACLES */
 ctx.font = "50px Arial";
ctx.shadowColor = "#000";
ctx.shadowBlur = 10;

for(let o of obstacles){
  ctx.fillText("💔", o.x, o.y + 40);
}

ctx.shadowBlur = 100;
}
/* LOOP */
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

/* GAME OVER */
function gameOver(){
  running = false;

  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.remove("hidden");

  document.getElementById("finalScore").innerText =
    "Score: " + Math.floor(score/10);
}

/* RESTART */
function playAgain(){

  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  score = 0;
  running = true;
  obstacles = [];
  timer = 0;
}

/* BACK */
function changeRunner(){

  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("selectScreen").classList.remove("hidden");
}