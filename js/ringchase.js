let selectedCharacter = "him";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 15;
const cols = 14;

let score = 0;
let rings = 0;
let lives = 3;

let gameRunning = false;

let player = {
  x: 1,
  y: 1
};

const goal = {
  x: 12,
  y: 13
};

const hearts = [];
const ringPowerups = [];

for(let i=0;i<20;i++){
  hearts.push({
    x: Math.floor(Math.random()*12)+1,
    y: Math.floor(Math.random()*13)+1
  });
}

for(let i=0;i<3;i++){
  ringPowerups.push({
    x: Math.floor(Math.random()*12)+1,
    y: Math.floor(Math.random()*13)+1
  });
}

function choose(type){

  selectedCharacter = type;

  document.getElementById("himCard").classList.remove("selected");
  document.getElementById("herCard").classList.remove("selected");

  document.getElementById(
    type === "him" ? "himCard" : "herCard"
  ).classList.add("selected");
}

function startGame(){

  document
    .getElementById("selectScreen")
    .classList.add("hidden");

  document
    .getElementById("gameScreen")
    .classList.remove("hidden");

  gameRunning = true;

  draw();
}

function restartGame(){

  location.reload();
}

function movePlayer(dx,dy){

  if(!gameRunning) return;

  player.x += dx;
  player.y += dy;

  if(player.x < 0) player.x = 0;
  if(player.y < 0) player.y = 0;

  if(player.x > cols-1) player.x = cols-1;
  if(player.y > rows-1) player.y = rows-1;

  collectItems();
  checkWin();

  draw();
}

function moveUp(){
  movePlayer(0,-1);
}

function moveDown(){
  movePlayer(0,1);
}

function moveLeft(){
  movePlayer(-1,0);
}

function moveRight(){
  movePlayer(1,0);
}

document.addEventListener("keydown",(e)=>{

  if(e.key==="ArrowUp") moveUp();

  if(e.key==="ArrowDown") moveDown();

  if(e.key==="ArrowLeft") moveLeft();

  if(e.key==="ArrowRight") moveRight();

});

function collectItems(){

  for(let i=hearts.length-1;i>=0;i--){

    if(
      hearts[i].x===player.x &&
      hearts[i].y===player.y
    ){

      hearts.splice(i,1);

      score += 10;

      document.getElementById("score").textContent = score;
    }
  }

  for(let i=ringPowerups.length-1;i>=0;i--){

    if(
      ringPowerups[i].x===player.x &&
      ringPowerups[i].y===player.y
    ){

      ringPowerups.splice(i,1);

      rings++;

      score += 50;

      document.getElementById("rings").textContent = rings;
      document.getElementById("score").textContent = score;

      updateLovePower();
    }
  }
}

function updateLovePower(){

  const bar = document.getElementById("powerBar");

  const width = Math.min(rings*25,100);

  bar.style.width = width + "%";
}

function checkWin(){

  if(
    player.x===goal.x &&
    player.y===goal.y
  ){

    gameRunning = false;

    document
      .getElementById("winScreen")
      .classList.remove("hidden");

    document
      .getElementById("winScore")
      .textContent = score;
  }
}

function drawTile(x,y,emoji,size=28){

  ctx.font = `${size}px Arial`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    emoji,
    x*tileSize + tileSize/2,
    y*tileSize + tileSize/2
  );
}

function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for(let r=0;r<rows;r++){

    for(let c=0;c<cols;c++){

      ctx.fillStyle =
        (r+c)%2===0
          ? "#fff8cc"
          : "#fff2a8";

      ctx.fillRect(
        c*tileSize,
        r*tileSize,
        tileSize,
        tileSize
      );
    }
  }

  hearts.forEach(h=>{
    drawTile(h.x,h.y,"❤️");
  });

  ringPowerups.forEach(r=>{
    drawTile(r.x,r.y,"💍");
  });

  drawTile(
    goal.x,
    goal.y,
    "💒",
    30
  );

  drawTile(
    player.x,
    player.y,
    selectedCharacter==="him"
      ? "🕺"
      : "💃",
    30
  );
}