'use strict';
var ctx = myCanvas.getContext('2d');
var fps = 40
var camX = 0;
var camY = 0;
var camZ = 2.67;
var Ticks = 0;
var inc1 = 0;
var inc2 = 0;
var curPhase = 'none'
var placeX = 0;
var placeY = 0;
var canRect = myCanvas.getBoundingClientRect()
var inGame = false;
var transistion = false;

var CList = {};
class circle {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.sprite = new Image();
    this.sprite.src = img;
    this.id = Math.random;
  }

  tick() {

  }

  touch() {
    for (let cir in CList) {
      if (distanceTo(this.x, this.y, CList[cir].x, CList[cir].y) <= this.r + CList[cir].r && CList[cir] !== this) {
        return cir;
      }
    }
    return false;
  }
}






myCanvas.addEventListener('mousedown', MyEvent => {

})

myCanvas.addEventListener('mouseup', MyEvent => {

})

myCanvas.addEventListener('mousemove', MyEvent => {
  placeX = Math.round((MyEvent.clientX - canRect.left) + camX)
  placeY = Math.round((MyEvent.clientY - canRect.top) + camY)
})


addEventListener('keydown', MyEvent => {
  switch (MyEvent.keyCode) {
    case 65:
      camX -= 15;
      break;
    case 68:
      camX += 15;
      break;
    case 87:
      camY -= 15;
      break;
    case 83:
      camY += 15;
      break;
  }
})




gridLine(0, 2, 5, 1)
CList.spt = new circle(0, 61, 'key3.png')

setInterval(() => {


canRect = myCanvas.getBoundingClientRect()

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
  if (inGame) {

    for (let cir in CList) {
      const spt = CList[cir]
      ctx.drawImage(spt.sprite, (spt.x - camX) * camZ, (spt.y - camY) * camZ, spt.sprite.width * camZ, spt.sprite.height * camZ)
    }

    if (transistion) {
      CList.spt.x += 1
      if (CList.spt.x % 30 == 0) {
        transistion = false;
        curLvl += 1;
        StartGame()
        setTimeout(() => inGame = false, 500) 
      }
    }

  } else gameTick();

  ctx.font = '14px Arial'
  ctx.fillText(`${placeX}, ${placeY}`, 365, 14)
}, 1000 / fps)



function gridLine(x = 0, y = 0, width = 1, height = 1) {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      CList[`${x + w} ${y + h}`] = new circle((x + w) * 30, (y + h) * 30, 'cursor.png')
    }
  }

}

function distanceTo(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.sqrt(a * a + b * b);
}

