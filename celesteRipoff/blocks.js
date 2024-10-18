'use strict';
class Text {
  constructor(text = '', x = 0, y = 0, size = 20, gui = false, override = false, left = false) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.text = text;
    this.size = size;
    this.gui = gui;
    this.override = override;
    this.left = left;
  }

}

class Particle {
  constructor(x = 0, y = 0, xAccel = 0, yAccel = 0, gravity = false, life = 25, friction = 0.2, size = 10) {
    this.opacity = 0.5;
    this.x = x;
    this.y = y;
    this.life = life;
    this.xAccel = xAccel;
    this.yAccel = yAccel;
    this.gravity = gravity;
    this.size = size;
    this.img = 'textures/player.png';
    this.opde = this.opacity / this.life;
    this.friction = friction;
  }
  updateSprite() {
    this.life--;
    this.opacity -= this.opde;
    this.x += this.xAccel;
    this.y += this.yAccel;
    if (this.gravity)
      this.yAccel += 0.25;
    this.xAccel -= Math.sign(this.xAccel) * this.friction;
  }
}

class Block {
  constructor(type = 'block', x = 0, y = 0, extraTags = [], oImg = '') {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.tags = extraTags;
    this.img = oImg;
    this.opacity = 1;
    this.width = 30;
    this.height = 30;


    switch (this.type) {
      case 'block':
        if (WorldId === 1)
        this.img = 'textures/stone.jpg';
        if (this.img === '')
        this.img = 'textures/block.png';
        break;
      case 'portal':
        this.img = 'textures/redblock.png';
        if (lvlData[this.tags[0]] === undefined) break;
        worldText.push(new Text(lvlData[this.tags[0]].about.name, this.x + 15, this.y - 20, 8));
        worldText.push(new Text(lvlData[this.tags[0]].about.diff, this.x + 15, this.y + 5, 16));
        if (lvlData[this.tags[0]].about.create !== '')
          worldText.push(new Text('By ' + lvlData[this.tags[0]].about.create, this.x + 15, this.y - 35, 8));
        break;
      case 'orange':
        this.img = 'textures/orangeblock.png';
        break;
      case 'bounce':
        this.img = 'textures/bounceUp.png';
        break;
      case 'dbounce':
        this.img = 'textures/bounceDown.png';
        break;
      case 'door':
        if (levelFormat === 1) {
          if (oImg === '')
            oImg = `textures/doors/door0.png`;
          this.img = oImg;
        }
        else
          this.img = `textures/doors/door${this.tags[0]}.png`;
        break;
      case 'key':
        if (levelFormat === 1) {
          if (oImg === '')
            oImg = `textures/keys/key0.png`;
          this.img = oImg;
        }
        else
          this.img = `textures/keys/key${this.tags[0]}.png`;
        break;
      case 'anim':
        this.img = `textures/animations/${oImg}`;
        break;
      case 'njump':
        this.img = 'textures/njblock.png';
        this.lifespan = 20;
        this.gone = false;
        break;
      case 'decor':
        this.img = `textures/${oImg}`;
        break;
      case 'red':
        this.type = 'check';
      case 'check':
        break;
      case 'die':
        this.img = `textures/redplayer.png`;
        break;
      case 'win':
        this.img = 'textures/yellowblock.png';
        break;
    }
  }

  updateSprite() {
    switch (this.type) {
      case 'njump':
        if (!this.gone) return;
        this.lifespan--;
        if (this.lifespan > 0)
          if (Math.random() > 0.5)
            worldP.push(new Particle(this.x + Math.random() * 30, this.y + Math.random() * 30, (Math.random() - 0.5) * 10, Math.random() * 3, true, 10, 0.2, 4));
        if (this.lifespan === 0) {
          this.opacity = 0;
          if (this.tags.includes('tt')) {
            worldT.push(new Text('Press X while Holding Up and Right', 375, -300));
            Player.dashes = 1;
          }
        }
        if (this.tags.includes('tt')) return
        if (this.lifespan === -120) {
          this.opacity = 1;
          this.lifespan = 20;
          this.gone = false;
        }
        break;
    }
  }
}

class Dialogue extends Block {
  constructor(text, charImg = null) {
    super('decor', 100, myCanvas.height / camZ, ['gui','nc'], 'dialogue/' + ((charImg === null) ? "dialogue.png" : charImg));
    this.disText = new Text(text, this.x, this.y, 12, true, true, true);
    
    this.accel = 16;
    this.dialogueTick = 0;
  }

  updateSprite() {
    if (this.dialogueTick < 18) {
      this.y -= this.accel;
      this.accel--;
    } else if (this.dialogueTick < 20) {
      this.y -= this.accel;
      this.accel++;
    }
    if (this.dialogueTick > 130) {
        world.splice(world.indexOf(this), 1);
    } else if (this.dialogueTick > 100) {
      this.y += this.accel;
      this.accel++;
    }

    this.disText.x = this.x + 110;
    this.disText.y = this.y + 30;
    const txt = this.disText;
    AddDrawQueue('text', txt);
    
    this.dialogueTick++;
  }
}

class AnimatedBlock extends Block {
  constructor(x = 0, y = 0, img, sheet, size = 1, tags = []) {
    super('anim', x, y, tags, img);
    this.animW = [sheet.init[0], sheet.init[1]];
    this.animL = sheet.init[2];
    this.sheet = sheet;
    this.curAnim = 'idle';
    this.animTick = 0;
    this.animFrame = this.sheet[this.curAnim][0];
    this.size = size;
  }

  getProperties() {
    return [
      this.animFrame % this.animL * this.animW[0],
      Math.floor(this.animFrame / this.animL) * this.animW[1],
      this.animW[0],
      this.animW[1]
    ];
  }

  setAnimation(anim) {
    this.curAnim = anim;
    this.animTick = 0;
    this.animFrame = this.sheet[this.curAnim][0];
  }

  playAnimation(anim, times) {
    
  }

  updateSprite() {
    const ca = this.sheet[this.curAnim];
    this.animTick++;
    if (this.animTick > this.sheet.init[3]) {
      this.animTick = 0;
      this.animFrame++;
      if (this.animFrame >= ca[1] + ca[0]) this.animFrame = ca[0];
    }
  }
}

const t = {
  init:[32, 32, 5, 3], //0: x width, 1: y width, 2: x length
  idle:[0, 7], //0: start pos, 1: anim length, 2: ticks for next frame
  sleep:[7, 6],
  happy:[13, 5],
  dance:[18, 8],
  gaming:[26, 4]
};
