'use strict';
console.log('hi')

var regenBlocks = false;



class Character {
  constructor(img, x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.yAccel = 0;
    this.xAccel = 0;
    this.wallJump = 0;
    this.canJump = false;
    this.speed = 5;
    this.jump = 12;
    this.pressLeft = false;
    this.pressUp = false;
    this.pressRight = false;
    this.pressDown = false;
    this.pressJump = false;
    //this.canDash = false;
    this.dashes = 0;
    this.maxDashes = 1;
    this.dashFrame = 0;
    this.partInc = 0;
    this.disableGravity = false;
    this.disableTouch = false;
    this.noClip = false;
    this.width = 30;
    this.height = 30;
  }



  tick() {
    var nJump = false;
    var bounce = false;
    var newlvl = false;
    function touch(plyr) {

      if (plyr.disableTouch) return false;

      for (let i of world) {
        if (i.type === 'orange' && Ticker % 80 < 40) continue;
        if ((!i.tags.includes('nc') || i.type === 'music') && colliding(plyr.x, plyr.y, plyr.width, plyr.height, i.x, i.y, i.width, i.height)) {
          switch (i.type) {
            case 'music':
              if (i.tags[0] !== curSong) {
                prevSong = curSong;
                if (i.tags[0] === 'shop') {
                  ShopEnter();
                }
                if (i.tags[0] === 'main') {
                  ShopLeave();
                }
                curSong = i.tags[0];
              }
              break;
            case 'block':
              
              return true;
            case 'win':
              LevelWon = true;
              break;
            case 'portal':
              newlvl = i.tags[0];
              break;
            case 'key':
              if (levelFormat === 1) {
                if (!perLevel.includes(i.tags[0].slice(3))) {
                  perLevel.push(i.tags[0].slice(3));

                }
              } else {
                if (!perLevel.includes(i.tags[0]))
                  perLevel.push(i.tags[0]);
              }
              break;
            case 'door':
              if (levelFormat === 1) {
                if (!perLevel.includes(i.tags[0].slice(4)))
                  return true;
              } else {
                if (!perLevel.includes(i.tags[0]))
                  return true;
              }

              break;
            case 'bounce':
              bounce = 1;
              break;
            case 'dbounce':
              bounce = 2;
              break;
            case 'check':
              CheckPoint = [i.x, i.y];
              break;
            case 'die':
              
              Player = new Character(playerImg);
              Player.x = CheckPoint[0];
              Player.y = CheckPoint[1];
              regenBlocks = true;

              return false;
            case 'njump':
              if (!i.tags.includes('tt') || (plyr.y+28 <= i.y)) {
                i.gone = true;
                if (i.lifespan <= 0)
                break;
                if (i.tags.includes('tt')) {
                  console.log('tutorial dashing')
                  DashTutorial = true;
                  Player.maxDashes = 1;
                  return false;
                }
              }
              return true;
            default:
              return true;
          }
        }
      }
    }

    //xAccel slowdown
    if (!this.pressRight && !this.pressLeft && (this.dashFrame <= 0))
      this.xAccel -= Math.sign(this.xAccel);

    //fly yAccel slowdown
    if (!this.pressJump && !this.pressDown && this.gravityDisabled)
      this.yAccel -= Math.sign(this.yAccel);

    //gravity go down
    if (!this.gravityDisabled || this.pressDown) {
      if (this.dashFrame <= 0)
      this.yAccel += 1;
    }

    //limit gravity
    if (this.yAccel > 18) this.yAccel -= 1;
    if (Math.abs(this.yAccel) > this.speed && this.gravityDisabled) this.yAccel = this.speed * Math.sign(this.yAccel);

    //for bounce blocks
    touch(this);
    if (bounce === 1)
      this.yAccel = -20;

    if (bounce === 2)
      this.yAccel = 20;


    //set y position
    this.y += this.yAccel;

    //if touch floor move up
    /*
    if (this.y > myCanvas.height - this.img.height) {
      this.y = myCanvas.height - this.img.height;
      this.yAccel = 0;
      this.canJump = true;
    }
    */



    if (touch(this) && !this.noClip) {
      if (this.yAccel > 0) {
        this.canJump = true;
        this.dashes = this.maxDashes
        if (this.dashFrame <= -10)
          this.img = playerImg;
        for (let o = 0; o < 19; o++) {
          if (!touch(this)) break;
          this.y -= 1;
          if (o === 18) {
            this.y += 19;
            while (touch(this))
              this.y += 1;
          }
        }
        if (this.yAccel > 13) {
          shakeX = (6 - Math.random() * 3) * Math.sign(Math.random() - 0.5);
          shakeY = (6 - Math.random() * 3) * Math.sign(Math.random() - 0.5);
          //for (let i = 0; i < 7; i++) {
          //  worldParticle.push(new Particle(this.x + 10, this.y + 10, (Math.random() - 0.5) * 10, -Math.random() * 2 - 3, true, 40, 0.1));
          //}
        }

      } else {
        for (let i = 0; i < 3; i++) {
          if (!touch(this)) break;
          this.x -= 1;
          if (i === 2) this.x += 3;
        }

        for (let i = 0; i < 3; i++) {
          if (!touch(this)) break;
          this.x += 1;
          if (i === 2) this.x -= 3;
        }

        while (touch(this)) this.y += 1;
      }
      this.yAccel = 0;
    } //(touch(this, i))




    //no jump if fall
    if (this.yAccel > 3)
      this.canJump = false;

    //when key down move left/right + walljump
    if (this.wallJump === 0 || this.disableTouch) {
      this.xAccel += this.pressRight - this.pressLeft;
    }
    else
      this.wallJump--;

    //limit xAccel
    if (Math.abs(this.xAccel) > this.speed && this.wallJump === 0) {
      this.xAccel -= Math.sign(this.xAccel);
    }

    //change x position based on Accel
    this.x += this.xAccel;
    if (!this.noClip && !this.disableTouch) {
      for (let i = 0; i < 14; i++) {
        if (!touch(this))
          break;
        this.y -= 1;
        if (i === 13) {
          this.y += 14;
          while (touch(this)) {
            this.x -= Math.sign(this.xAccel);
          }
          if (this.pressJump && Math.abs(this.xAccel) > 2) {
            if (this.wallJump < 3 && !nJump && false) {
              this.xAccel *= -1.2;
              this.xAccel = Math.round(this.xAccel);
              this.yAccel = this.jump / -1.5;
              this.wallJump = 7;
            }
          } else
            this.xAccel = 0;
        }
      }

    }


    //particleStuff
    /*
    this.partInc++;
    if (Math.abs(this.xAccel) > 0 && this.canJump && this.partInc > (Math.random() * 10) + 42 - (8 * Math.abs(this.xAccel))) {
      this.partInc = 0;
      worldParticle.push(new Particle(this.x + 10, this.y + 25, -this.xAccel, Math.random() * -3 - 2, true, 25, 0.2, 5));
    }
    */


    //jump
    if (!this.gravityDisabled) {

      if (this.pressJump && this.canJump) {
        this.yAccel = -this.jump;
        this.canJump = false;
      }
    if (this.dashFrame > -10) {
      this.dashFrame--;
    }
    } else if (this.pressJump)
      this.yAccel -= 1;
    if (this.y > 500) {
      CreateWorld(WorldId);
    }
    if (newlvl !== false) {
        CreateWorld(newlvl);
      }
    }
  }


var Player = new Character(playerImg, 0, 0);
function Tick() {
  myCanvas.style.width = '100%';
  myCanvas.style.height = '100%';
  myCanvas.height = window.innerHeight;
  myCanvas.width = window.innerWidth;
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  camZ = myCanvas.width / 700;

  if (DashTutorial) {
    
  } else {
    Player.tick();
    if (regenBlocks) {
      regenBlocks = false;
      const wl = world.length;
      for (let blk = 0; blk < wl; blk++) {
        if (world[blk].type !== 'njump') continue;
        if (world[blk].tags.includes('tt')) continue;
        world[blk].lifespan = 20;
        world[blk].gone = false;
        world[blk].opacity = 1;
      } 
    }
  }
  if (LevelWon)  {
    LevelWon = false;
    WorldId++;
    CreateWorld(WorldId);
    CheckPoint = [150, 60];
    if (WorldId === 1) {
      bg.src = 'textures/cave.png';
      curSong = 'cave1';
      prevSong = 'grass1';
    }
  }
  const ww = (myCanvas.width / 2) / (camZ);
  const hh = (myCanvas.height / 2) / (camZ);
  if (true) { //ease camera
    camX -= Math.round((camX - (Player.x - ww)) / 10);
    camY -= Math.round((camY - (Player.y - hh)) / 10);
    camX = Math.round(camX * myCanvas.width) / myCanvas.width;
    camY = Math.round(camY * myCanvas.height) / myCanvas.height;
  }
  for (const blk of world) {
    blk.updateSprite();
    if (blk.type === 'anim') {
      AddDrawQueue('anim', blk);
    } else {
      AddDrawQueue('block', blk);
    }
    
  }
  for (const blk of worldP) {
    blk.updateSprite();
    AddDrawQueue('block', blk);
  }
  for (const blk of worldT) {
    AddDrawQueue('text', blk);
  }
  AddDrawQueue('plyr', Player);
  DrawFrame();

  if (curSong in songList) { //if song is added
    if (songList[curSong].volume < 0.1) {
      songList[curSong].volume += 0.01;
      if (songList[curSong].paused) {
      songList[curSong].play();
      console.log('should play')
      }
    }
    if (prevSong !== 'none') {
      if (songList[prevSong].volume >= 0.01) {
        songList[prevSong].volume -= 0.01;
      } else if (!(songList[prevSong].paused)) {
        songList[prevSong].pause();
      }
    }
  } else { //if song not added add the song
    songList[curSong] = new Audio('music/' + curSong + '.mp3');
    songList[curSong].loop = true;
    songList[curSong].volume = 0;
    songList[curSong].play();
  }
}


window.addEventListener('keydown', (EventKey) => {
  EventKey.preventDefault();

  if (songList[curSong].paused) songList[curSong].play();

  switch (EventKey.key) {
    case 'ArrowRight':
    case 'd':
      Player.pressRight = true;
      break;
    case 'ArrowLeft':
    case 'a':
      Player.pressLeft = true;
      break;
    case 'c':
      Player.pressJump = true;
      break;
    case 'ArrowDown':
    case 's':
      Player.pressDown = true;
      break;
    case 'ArrowUp':
    case 'w':
      Player.pressUp = true;
      break;
    case 'z':
      camZ -= 0.1;
      break;
    case 'x':
      if (Player.dashes > 0 && Player.dashFrame <= 0) {
        var dashX = (Player.pressRight - Player.pressLeft) * 11;
        var dashY = (Player.pressDown - Player.pressUp) * 11;  
        if (Math.abs(dashX) > 0 && Math.abs(dashY) > 0) {
          dashX = Math.round(dashX / 1.2);
          dashY = Math.round(dashY / 1.2);
        }
        if (DashTutorial) {
          if (dashX > 0 && dashY < 0) {
            DashTutorial = false;
          } else {
            console.log('wrong');
           return;
          }
        }
        Player.img = redPlayerImg;
        Player.xAccel = dashX;
        Player.yAccel = dashY;
        Player.dashes--;
        Player.canJump = false;
        Player.dashFrame = 5;
      }
      break;
    case 'r':
      Player = new Character(playerImg);
      Player.x = CheckPoint[0];
      Player.y = CheckPoint[1];
      //console.log('do tp');
      for (const blk in world) {
        if (world[blk].type !== 'njump') continue;
        if (world[blk].gone)
          //console.log(world[blk]);
        world[blk].lifespan = 20;
        world[blk].gone = false;
        world[blk].opacity = 1;
      }
      break;
  }
});
window.addEventListener('keyup', (EventKey) => {
  switch (EventKey.key) {
    case 'ArrowRight':
    case 'd':
      Player.pressRight = false;
      break;
    case 'ArrowLeft':
    case 'a':
      Player.pressLeft = false;
      break;
    case 'c':
      Player.pressJump = false;
      break;
    case 'ArrowDown':
    case 's':
      Player.pressDown = false;
      break;
    case 'ArrowUp':
    case 'w':
      Player.pressUp = false;
      break;
    case ' ':
      if (redActive === 0)
        redActive = 1;
      if (redActive === 2)
        redActive = 3;
      break;
  }
});

//CreateWorld(0);
//setInterval(Tick, 25);