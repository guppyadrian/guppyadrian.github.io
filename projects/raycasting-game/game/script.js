const ctx = myCanvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctxView = viewport.getContext('2d');
ctxView.imageSmoothingEnabled = false;
const wallHeight = 256;

var tempvx = 0;
var tempvy = 0;

var pressLeft = false;
var pressRight = false;
var pressW = false;
var pressS = false;
var pressA = false;
var pressD = false;
var pressDebug = false;
var fov = 60;
var quality = 0.25;

const wallImg = new Image();
wallImg.src = 'wall.png';
const barsWallImg = new Image();
barsWallImg.src = 'barswall.png';
const dabSFX = new Audio('dabmeupreverb.ogg');
const dabImg = new Image();
dabImg.src = 'dabmeupguyteeth.png';

const gridW = 20;
const gridH = 20;
const gridS = 32;

const playerS = 10;
var playerR = 0;
var playerX = 50 // gridS + playerS / 2;
var playerY = 50 // gridS + playerS / 2;

const grid = [
 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1
,1,0,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1
,1,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1
,1,0,1,0,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1
,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1
,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1
,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1
,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1
,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1
,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1
,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1
,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,1
,1,1,1,0,0,0,0,0,0,0,0,2,2,0,0,1,1,0,0,1
,1,1,1,0,0,0,0,0,0,0,0,2,2,0,0,1,1,0,0,1
,1,1,1,0,0,1,1,0,0,2,2,0,0,0,0,0,0,0,0,1
,1,1,1,0,0,1,1,0,0,2,2,0,0,0,0,0,0,0,0,1
,1,2,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1
,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1
,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

var DV = (fov / 2) / Math.tan((fov / 2) * (Math.PI / 180));

addEventListener('keydown', Key => {
  if (Key.key === 'ArrowRight') {
    pressRight = true;
  } else
  if (Key.key === 'ArrowLeft') {
    pressLeft = true;
  } else
  if (Key.key === 'w') {
    pressW = true;
  } else
  if (Key.key === 's') {
    pressS = true;
  }
  if (Key.key === 'a') {
    pressA = true;
  }
  if (Key.key === 'd') {
    pressD = true;
  }
  if (Key.key === ' ') {
    pressDebug = true;
  }
});
addEventListener('keyup', Key => {
  switch(Key.key) {
    case 'ArrowRight':
      pressRight = false;
      break;
    case 'ArrowLeft':
      pressLeft = false;
      break;
    case 'w':
      pressW = false;
      break;
    case 's':
      pressS = false;
      break;
    case 'a':
      pressA = false;
      break;
    case 'd':
      pressD = false;
      break;
  }
});

class DabMeUp {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hOffset = 25;
    this.vx = 0;
    this.vy = 0;
    this.distance = 0;
    this.dabTimer = 0;
    this.dabSounds = [];
  }
}
const dabMonster = new DabMeUp(50, 310, 400);

function collide(x1, w1, y1, h1, x2, w2, y2, h2) {
  if (x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1) {
    return true;
  }else 
    return false;
}

function gridToXY(pos) {
  return [pos % gridW, Math.floor(pos / gridH)];
}

const times = [];
let fps;

function refreshLoop() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
}

function rotateXY(x, y, r) {
  const COS = Math.cos(r * Math.PI / 180);
  const SIN = Math.sin(r * Math.PI / 180);
  return [
    (x * COS) - (y * SIN),
    (x * SIN) + (y * COS)
  ];
}

function fullTurnR() {
  playerR += 90;
}
function fullTurnL() {
  playerR -= 90; 
}



function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? 1 : -1;
    }
}

function Tick() {
  //fps counter
  refreshLoop();

  //make the background and clear canvas
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  ctxView.clearRect(0, 0, viewport.width, viewport.height);
  var ggradient = ctxView.createLinearGradient(0, 0, 0, viewport.height);
  ggradient.addColorStop(0, '#444444');
  ggradient.addColorStop(0.4, 'black');
  ggradient.addColorStop(0.6, 'black');
  ggradient.addColorStop(1, '#444444');
  ctxView.fillStyle = ggradient; //'#111111';
  ctxView.fillRect(0, 0, viewport.width, viewport.height);


  //render the grids on top down
  const squareLength = gridS;
  for (const obj in grid) {
    if (grid[obj] !== 0)
      ctx.fillRect((obj % gridW) * squareLength, Math.floor(obj / gridW) * squareLength, squareLength, squareLength);
  }

  //rotate when pressing left/right
  playerR += (pressRight - pressLeft) * 3;

  //big movement script
  if (pressS || pressW || pressA || pressD) {


    {
      playerX += Math.cos((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
  
      let touching = false;
      for (const obj in grid) {
        if (grid[obj] === 0) continue;
        if (!collide(playerX - (playerS / 2), playerS, playerY - (playerS / 2), playerS, gridToXY(obj)[0] * gridS, gridS, gridToXY(obj)[1] * gridS, gridS))
          continue;
        touching = true;
        ctx.fillStyle = 'red';
        ctx.fillRect(gridToXY(obj)[0] * gridS, gridToXY(obj)[1] * gridS, gridS, gridS);
        ctx.fillStyle = 'black';
        break;
      }
      if (touching) {
        playerX -= Math.cos((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
        //playerY -= Math.sin((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
      }
    }
    //other axis
    {
      playerY += Math.sin((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
      
      let touching = false;
      for (const obj in grid) {
        if (grid[obj] === 0) continue;
        if (!collide(playerX - (playerS / 2), playerS, playerY - (playerS / 2), playerS, gridToXY(obj)[0] * gridS, gridS, gridToXY(obj)[1] * gridS, gridS))
          continue;
        touching = true;
        ctx.fillStyle = 'red';
        ctx.fillRect(gridToXY(obj)[0] * gridS, gridToXY(obj)[1] * gridS, gridS, gridS);
        ctx.fillStyle = 'black';
        break;
      }
      if (touching) {
        //playerX -= Math.cos((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
        playerY -= Math.sin((playerR + 90 * (pressD - pressA)) * Math.PI / 180) * 2 * Math.max(pressW - pressS, pressA * 2 - 1, pressD * 2 - 1);
      }
    }
    
  }
  
  //draw player on top down
  ctx.fillRect(playerX - (playerS / 2), playerY - (playerS / 2), playerS, playerS);


  //begin the raycasting
  var raycastList = [];
  
  for (let offset = -fov / 2; offset < fov / 2; offset += quality) {

    //path for top down
    ctx.beginPath();       
    ctx.moveTo(playerX, playerY);
    var o = false;
    var t = 0;

    //create math consts
    const rayDir = Math.atan(offset / DV) * 180 / Math.PI;
    const SIN = Math.sin((playerR + rayDir) * Math.PI / 180);
    const COS = Math.cos((playerR + rayDir) * Math.PI / 180);
    var collideAtPos = 0;

    //shoot out ray until wall 
    while (!o && t < 1000) {
      t += quality;
      playerX + COS * t, playerY + SIN * t;
      if (grid[Math.floor((playerX + COS * t) / gridS) + Math.floor((playerY + SIN * t) / gridS) * gridW] !== 0) {
        collideAtPos = t;
        o = true;
      }
    } 
    
    //update distance
    t = t * Math.cos(rayDir * Math.PI / 180);

    //collide pos & image src
    const pxy = Math.floor((playerY + SIN * collideAtPos) + (playerX + COS * collideAtPos));
    var imageToDraw;
    if (grid[Math.floor((playerX + COS * collideAtPos) / gridS) + Math.floor((playerY + SIN * collideAtPos) / gridS) * gridW] === 1)
      imageToDraw = wallImg;
    else
      imageToDraw = barsWallImg;
    
    //save to array
    if (o)
      raycastList.push(['ray', t, offset, pxy, imageToDraw]);
    
    //finish drawing top down ray
    ctx.lineTo(playerX + COS * t, playerY + SIN * t);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    
  }

  
  //update monster positions
  dabMonster.vx = dabMonster.x - playerX;
  dabMonster.vy = dabMonster.y - playerY;
  //ctx2.fillStyle = 'black';
  tempvx = dabMonster.vx;
  tempvy = dabMonster.vy;
  
  //ctx2.fillRect(dabMonster.vx + myCanvas.width / 2 - 7.5, dabMonster.vy + myCanvas.height / 2 - 7.5, 15, 15);
  const xyOut = rotateXY(dabMonster.vx, dabMonster.vy, -playerR);
  dabMonster.vx = xyOut[1];
  dabMonster.vy = xyOut[0];

  //draw monster
  if (dabMonster.vy > 0) {
    raycastList.push(['monster', dabMonster.vy, dabMonster.vx, dabMonster.size, dabImg, dabMonster.hOffset]);
  }

  
  //sort array by distance
  raycastList.sort(sortFunction);
  for (const i of raycastList) {
    //set brightness
    ctxView.filter = `brightness(${((150 - i[1]) / 150) * 100}%)`;

    if (i[0] === 'ray') {
      
    //set world positions
    const dx = Math.floor(((viewport.width / fov)) * (i[2] + (fov/2)));
    const dy = (viewport.height - (DV / i[1]) * wallHeight) / 2;
    const wx = Math.ceil((viewport.width / fov) * quality);
    const wy = (DV / i[1]) * wallHeight;
  
    //draw wall
    ctxView.drawImage(i[4], (((i[3] / wallHeight) * 8) % 1) * gridS, 0, 1, wallImg.height, dx, dy, wx, wy);
    
    } else {
      ctxView.filter = 'brightness(100%)';
      const hm = i[3] * (DV / i[1]);
      ctxView.drawImage(i[4], 8 * i[2] * (DV / i[1]) + (viewport.width - hm) / 2, (viewport.height - hm) / 2, hm, hm);
    }
    
  }
  
  //reset brightness
  ctxView.filter = `brightness(100%)`;

  //draw fps meter
  if (fps < 62)
    ctxView.fillStyle = 'red';
  else
    ctxView.fillStyle = 'black';
  ctxView.font = "15px Arial";
  ctxView.fillText(fps, 1, 15);

  //complicated monster math
  monsterDistance = Math.sqrt(Math.pow(dabMonster.x - playerX, 2) + Math.pow(dabMonster.y - playerY, 2));
  if (monsterDistance < 325) {
    dabMonster.dabTimer++;
    if (dabMonster.dabTimer > monsterDistance * 0.25 + 15) {
      dabMonster.dabSounds.push(new Audio('dabmeupreverb.ogg'));
      dabMonster.dabSounds[dabMonster.dabSounds.length - 1].onended = () => {
        dabMonster.dabSounds.shift();
      }
      dabMonster.dabSounds[dabMonster.dabSounds.length - 1].volume = Math.max(0.05, (350 - monsterDistance) / 800);
      dabMonster.dabSounds[dabMonster.dabSounds.length - 1].play();
      dabMonster.dabTimer = 0;
    }
  } else {
    dabMonster.dabTimer = 1000;
  }


  ctx.fillStyle = 'blue';
  ctx.fillRect(dabMonster.x - 7.5, dabMonster.y - 7.5, 15, 15);
  ctx.fillStyle = 'black';


  
  //ctx2.clearRect(0, 0, myCanvas.width, myCanvas.height);



  /*
  ctx2.fillText(`(${tempvx}, ${tempvy}) R: ${playerR} Dist: ${dabMonster.vy} DV: ${DV}`, 50, 50)
  
  ctx2.fillStyle = 'red';
  ctx2.fillRect(dabMonster.vx + myCanvas.width / 2 - 7.5, dabMonster.vy + myCanvas.height / 2 - 7.5, 15, 15);
  ctx2.fillRect(298, 298, 4, 4);
  
  ctx2.beginPath();
  ctx2.moveTo(300, 300);
  ctx2.lineTo(300 + Math.cos((playerR - 30) * Math.PI / 180) * 25, 300 + Math.sin((playerR - 30) * Math.PI / 180) * 25);
  ctx2.moveTo(300, 300);
  ctx2.lineTo(300 + Math.cos((playerR + 30) * Math.PI / 180) * 25, 300 + Math.sin((playerR + 30) * Math.PI / 180) * 25);
  ctx2.strokeStyle = 'blue';
  ctx2.stroke();
  */
}
setInterval(Tick, 16);


function openGridMaker() {
  window.open('gridMaker.html', '_blank');
// tab.document.write(); // where 'html' is a variable containing your HTML
 // tab.document.close(); // to finish loading the page
}

checkmark2d.addEventListener('change', () => {
  myCanvas.hidden = !myCanvas.hidden;
});
FOVslider.addEventListener('input', () => {
  fov = FOVslider.value;
  FOVdisplay.innerHTML = fov;
  DV = 30 / Math.tan((fov / 2) * Math.PI / 180);
});
RESslider.addEventListener('input', () => {
  quality = parseFloat(RESslider.value);
  RESdisplay.innerHTML = quality;
});