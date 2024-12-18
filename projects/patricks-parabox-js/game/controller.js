'use strict';
const myCanvas = document.createElement('canvas');
const ctx = myCanvas.getContext('2d');

window.onload = function() {
  if (!document.body)
    document.body = document.createElement('body');
  document.body.appendChild(myCanvas);
  document.body.style.padding = 0;
  document.body.style.margin = 0;
  
}
var drawQueue = [];
var worldScene = {};
const placeholderImage = new Image();
placeholderImage.src = 'https://platformer-basics.guppyadrian1.repl.co/player.png';

var Camera = {
  x: 0,
  y: 0,
  zoom: 1
};
var Keys = {
  left: false,
  right: false,
  up: false
};


class Sprite {
  constructor({x = 0, y = 0, img = placeholderImage}) {
    this.x = x;
    this.y = y;
    this.img = img;
  }
}

class Platformer extends Sprite {
  constructor({x = 0, y = 0, img = placeholderImage, speed = 1, maxJumps = 1, maxXAccel = 5, maxYAccel = 18, jumpHeight = 15, gravity = 1}) {
    super({x: x, y: y, img: img});
    this.yAccel = 0;
    this.xAccel = 0;
    this.prevX = 0;
    this.canJump = maxJumps;

    this.speed = speed;
    this.maxXAccel = maxXAccel;
    this.jumpHeight = jumpHeight;
    this.gravity = gravity;
    this.maxYAccel = maxYAccel;
    this.maxJumps = maxJumps;
  }

  moveL() {
   this.xAccel -= 1;
  }
  moveR() {
    this.xAccel += 1;
  }
  jump() {
    if (this.canJump > 0) {
      this.yAccel = -this.jumpHeight;
      this.canJump--;
    }
  }
  checkControls() {
    if (Keys.ArrowLeft || Keys.a)
      this.moveL();
    if (Keys.ArrowRight || Keys.d)
      this.moveR();
    if (Keys.ArrowUp || Keys.w)
      this.jump();
  }
  tick() {

    //gravity + update y
    this.yAccel++;
    if (this.yAccel > this.maxYAccel)
      this.yAccel--;
    this.y += this.yAccel;

    if (this.yAccel > 3)
      this.canJump = Math.min(this.maxJumps - 1, this.canJump);
    //xAccel stuff
    if (this.prevX === this.xAccel)
      this.xAccel -= Math.sign(this.xAccel);
    if (Math.abs(this.xAccel) > this.maxXAccel)
      this.xAccel = Math.sign(this.xAccel) * this.maxXAccel;
    this.x += this.xAccel;
    
    if (this.y > 300) {
      this.y = 300;
      this.yAccel = 0;
      this.canJump = this.maxJumps;
    }
    this.prevX = this.xAccel;
  }
}

class Enemy extends Platformer {
  constructor(x, y, img) {
    super(x, y, img);

  }
}


function keyDownHandler(key) {
  /*
  switch(key.key) {
    case 'a':
    case 'ArrowLeft':
      Keys.left = true;
      break;
    case 'w':
    case 'ArrowUp':
      Keys.up = true;
      break;
    case 'd':
    case 'ArrowRight':
      Keys.right = true;
      break;
  } */
  Keys[key.key] = true;
}
function keyUpHandler(key) {
  /*
  switch(key.key) {
    case 'a':
    case 'ArrowLeft':
      Keys.left = false;
      break;
    case 'w':
    case 'ArrowUp':
      Keys.up = false;
      break;
    case 'd':
    case 'ArrowRight':
      Keys.right = false;
      break;
  }
  */
  Keys[key.key] = false;
}


function TICK() {
  
}

function easeCameraTo({x = 0, y = 0}) {
  Camera.x -= (Camera.x - (x - (myCanvas.width / 2) / Camera.zoom)) / 10;
  Camera.y -= (Camera.y - (y - (myCanvas.height / 2) / Camera.zoom)) / 10;
}

function addDrawQueue({x, y, img, type = 'image', w = 32, h = 32, stroke = false, lineWidth = 1, gui = false}) {
  drawQueue.push({
    x: x,
    y: y,
    z: 0,
    img: img,
    type: type,
    w: w,
    h: h,
    stroke: stroke,
    lineWidth: lineWidth,
    gui: gui
  });
}
function isColliding(obj1, obj2) {
  if (obj1.x + 32 > obj2.x && obj2.x + 32 > obj1.x &&
      obj1.y + 32 > obj2.y && obj2.y + 32 > obj1.y) {
    return true;
  }
}

function DRAWCONTROLLER(clear = true) {
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;

  
  if (clear)
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (const obj of drawQueue) {

    const CamX = (obj.gui) ? 0 : Camera.x;
    const CamY = (obj.gui) ? 0 : Camera.y;
    const CamZ = (obj.gui) ? 1 : Camera.zoom;
    
    if ('type' in obj && obj.type !== 'image') {
      if (obj.type === 'rect') {
        if (!('stroke' in obj) || obj.stroke === false) {
          ctx.fillRect((obj.x - CamX) * CamZ, (obj.y - CamY) * CamZ, obj.w * CamZ, obj.h * CamZ);
        } else {
          ctx.lineWidth = ('lineWidth' in obj) ? (obj.lineWidth * CamZ) : (1 * CamZ);
          ctx.strokeRect((obj.x - CamX) * CamZ, (obj.y - CamY) * CamZ, obj.w * CamZ, obj.h * CamZ);
        }
      }
    } else
    ctx.drawImage(obj.img, (obj.x - CamX) * CamZ, (obj.y - CamY) * CamZ, obj.w * CamZ, obj.h * CamZ);
  }
  drawQueue = [];
}

function STARTCONTROLLER(clear = true) {
  setInterval(() => {
    TICK();
    DRAWCONTROLLER(clear);
  }, 16.7);
}

function ADDCONTROLS() {
  addEventListener('keydown', keyDownHandler);
  addEventListener('keyup', keyUpHandler);
}

function LOADSCENE(world) {
  const data = world.data;
  worldScene = data;
}

function WORLDCOLLISION(plyr) {
  for (var w = plyr.x - 32; w < plyr.x + 32; w++) {
    if (!(w in worldScene)) continue;
    for (var h = plyr.y - 32; h < plyr.y + 32; h++) {
      if (!(h in worldScene[w])) continue;
      return true;
    }
  }
  return false;
}

console.log('Controller Connected!');