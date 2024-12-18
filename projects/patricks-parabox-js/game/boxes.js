'use strict';
const patrickImg = new Image();
patrickImg.src = 'patrick.png';
const yellowImg = new Image();
yellowImg.src = 'yellow.png';
const unknownImg = new Image();
unknownImg.src = 'unknown.png';
const goalPImg = new Image();
goalPImg.src = 'goalP.png';
const goalBImg = new Image();
goalBImg.src = 'goalB.png';
const lBlueImg = new Image();
lBlueImg.src = 'light_blue.png';
const blueImg = new Image();
blueImg.src = 'blue.png';
const winnerImg = new Image();
winnerImg.src = 'winner.png';
const controlsImg = new Image();
controlsImg.src = 'controls.png';
const guideImg = new Image();
guideImg.src = 'guide.png';
const titleImg = new Image();
titleImg.src = 'title.png';
const overlayImg = new Image();
overlayImg.src = 'whiteoverlay.png';

myCanvas.style.background = 'black';

var Snapshots = [];

var Levels = {};
var Player;
var moveQueue = [];

var LobbyWorld = false;
var CurrentWorld = 'Intro';

class BoxObject {
  constructor({x = 0, y = 0, pushable = false, loc = 0, enterable = false}) {
    this.x = x;
    this.y = y;
    this.loc = loc;
    this.pushable = pushable;
    this.enterable = enterable;
    this.moved = false;
    this.exited = {times: 0, lastLoc: {x:0,y:0,loc:0}};
    this.paraDisabled = false;
    this.clone = false;
  }
                              
  isEmpty(plyr = {x: 0, y: 0, type: 'plyr'}, lvl = {data: [], size: 2}, dir = {x: 0, y: 0}) {
    if (plyr.type === undefined) plyr.type = 'plyr';
    let locX = dir.x;
    if (locX === undefined) locX = 0;
    let locY = dir.y;
    if (locY === undefined) locY = 0
    var loc = plyr.x + locX + (plyr.y + locY) * lvl.size;
    if (
      (plyr.x + locX < 0 || plyr.x + locX >= lvl.size ||
      plyr.y + locY < 0 || plyr.y + locY >= lvl.size)
    ) {
      const l = Levels[lvl.id];
      if (this.exited.times > 50) {
        if (this.isEmpty({x: 2, y: 2, type: this}, Levels[0], dir)) {
          if (this.moved)
            return {move: true};
          this.moved = true;
          this.paraDisabled = true;
          if (plyr.type === 'plyr') {
            this.loc = 0;
            this.x = 2;
            this.y = 2;
            console.log('player to INFINITY')
          } else {
            this.moveBlock(l, Math.floor(Levels[0].size * Levels[0].size / 2) + locX + locY * Levels[0].size, Levels[0]);
          }
          
          return {move: true};
        } else {
          return {move: false};
        }
        
      }
      this.exited.times += 1;
      if (this.loc !== 0 && this.isEmpty({x: l.x, y: l.y, type: plyr.type}, Levels[l.loc], dir).move) {
        if (l.loc === 0) {
          console.log('uh oh')
          this.isEmpty(plyr, lvl, dir);
        }
        if (this.moved)
          return {move: true, tp: false};
        this.moved = true;
        
        if (plyr.type === 'plyr') {
          this.x = l.x;
          this.y = l.y;
          this.loc = l.loc;
        } else {
          this.moveBlock(Levels[this.loc], (l.x + locX) + (l.y + locY) * Levels[l.loc].size, Levels[l.loc]);
        }
        return {move: true, tp: false};
      } else {
        return {move: false, tp: false};
      }
    }
    
    
    if (lvl.data[loc] === undefined) {
      return {move: true};
    }

    if (lvl.data[loc].enterable && 'level' in lvl.data[loc]) {
      CurrentLevel = lvl.data[loc].level;
      SetUpLevel(LevelBank[CurrentWorld][CurrentLevel]);
      return {move: false}
    }

    if (lvl.data[loc].pushable) {
      const i = lvl.data[loc];
      const e = i.isEmpty({x: loc % lvl.size, y: Math.floor(loc / lvl.size), type: 'box'}, lvl, dir);
      if (e.move) {
        if (i.moved) 
          return {move: true};
        i.moved = true;
        i.pushBlock(lvl, dir);
        return {move: true, tp: true};
      }
    }

    
    
    if (lvl.data[loc] !== undefined && lvl.data[loc].enterable && !lvl.data[loc].paraDisabled) {
      const lvlD = (lvl.data[loc].clone) ? lvl.data[loc].cloneOf : lvl.data[loc];
      
      const dest = Math.floor(lvlD.size / 2) * (lvlD.size + 1 - locY * lvlD.size - locX);
      
      if (this.isEmpty({x: dest % lvlD.size - locX, y: Math.floor(dest / lvlD.size) - locY, type: plyr.type}, lvlD, dir).move) {
        
        
        if (this.moved)
          return {move: true, tp: true};
        this.moved = true;
      
        if (plyr.type === 'plyr') {
          this.loc = lvlD.id;
          this.x = dest % lvlD.size - locX;
          this.y = Math.floor(dest / lvlD.size) - locY;
          console.log(`(${this.x}, ${this.y})`)
        } else {
          this.moveBlock(Levels[this.loc], dest, lvlD);
        }
        return {move: true, tp: false};
      }
    }

    
    if (lvl.data[loc] !== undefined && lvl.data[loc].pushable && this.enterable && !this.paraDisabled) {
      const i = lvl.data[loc];
      const dest = Math.floor(this.size / 2) * (this.size + 1 + locY * this.size + locX);
      if (lvl.data[loc].isEmpty({x: dest % this.size + locX, y: Math.floor(dest / this.size) + locY, type: plyr.type}, this, {x: -locX, y: -locY}).move) {
      
        if (!i.moved)
          i.moveBlock(Levels[i.loc], dest, this);
        i.moved = true;
        
        if (this.moved)
          return {move: true, tp: true};
        this.moved = true;
      
        if (plyr.type === 'plyr') {
          this.x = loc % lvl.data[loc].size + locX;
          this.y = Math.floor(dest / lvl.data[loc].size) + locY;
        } else {
          this.moveBlock(Levels[this.loc], loc, Levels[this.loc]);
        }
        return {move: true, tp: false};
      }
    }
    console.log(this)
    return {move: false, tp: false};
  }

  pushBlock(lvl, dir) {
    if (dir.x === undefined) dir.x = 0;
    if (dir.y === undefined) dir.y = 0;
    lvl.data[(this.x + dir.x) + (this.y + dir.y) * lvl.size] = this;
    lvl.data[this.x + this.y * lvl.size] = undefined;
    this.x += dir.x;
    this.y += dir.y;
  }
  
  moveBlock(lvl, newPos, newLvl = lvl, remove = true) {
    newLvl.data[newPos] = this;
    if (remove)
      lvl.data[this.x + this.y * lvl.size] = undefined;
    this.x = newPos % newLvl.size;
    this.y = Math.floor(newPos / newLvl.size);
    this.loc = newLvl.id;
  }
}


class Patrick extends BoxObject {
  constructor({loc = 1, x = 0, y = 0, img = placeholderImage}) {
    super({x: x, y: y, pushable: true, loc: loc});
    this.sprite = new Sprite({x: x * 32, y: y * 32, img: img});
    this.loc = loc;
    this.maxCooldown = 12;
    this.moveCooldown = this.maxCooldown;
  }

  

  checkKeys(lvl) {
    if (!Keys.ArrowDown && !Keys.ArrowUp && !Keys.ArrowLeft && !Keys.ArrowRight)
      this.moveCooldown = 0;
    if (this.moveCooldown > 0) {
      this.moveCooldown--;
      return;
    }
    const p = {x: this.x, y: this.y, type: 'plyr', lvl:this.loc};
    
    if (Keys.ArrowLeft || Keys.ArrowRight || Keys.ArrowUp || Keys.ArrowDown) {
      var snapToSave = {};
      snapToSave.plyr = {x: this.x, y: this.y, loc: this.loc};
      snapToSave.lvls = structuredClone(Levels);
      
      Snapshots.push(snapToSave);
    }
    
    
    if (Keys.ArrowLeft) {
      this.moveCooldown = this.maxCooldown;
      const d = this.isEmpty(this, lvl, {x: -1});
      if (d.move) {
        this.x -= 1;
      }                   
    }
    if (Keys.ArrowRight) {
      this.moveCooldown = this.maxCooldown;
      if (this.isEmpty(this, lvl, {x: 1}).move) {
        this.x += 1;
      }
    }
    if (Keys.ArrowUp) {
      this.moveCooldown = this.maxCooldown;
      if (this.isEmpty(this, lvl, {y: -1}).move) {
        this.y -= 1;
      }
    }
    if (Keys.ArrowDown) {
      this.moveCooldown = this.maxCooldown;
      if (this.isEmpty(this, lvl, {y: 1}).move) {
        this.y += 1;
      }
    }


    

    
  
    
  }
  
  updatePos() {
    this.sprite.x = this.x * 32;
    this.sprite.y = this.y * 32;
  }
  
}




class BoxLevel extends BoxObject{
  constructor({data = [], size = 5, id = 0, x = 2, y = 2, loc = 0}) {
    super({x: x, y: y, loc: loc, pushable: true, enterable: true});
    this.data = data;
    this.size = size;
    this.id = id;
    this.loc = loc;
  }

  init () {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === 0)
        this.data[i] = undefined;
      if (this.data[i] === 1)
        this.data[i] = new BoxObject({x: i % this.size, y: Math.floor(i / this.size), pushable: false, loc: this.id});
      if (this.data[i] === 2)
        this.data[i] = new BoxObject({x: i % this.size, y: Math.floor(i / this.size), pushable: true, loc: this.id});
      
      if (typeof this.data[i] === 'object') {
        const cloneBox = ('clone' in this.data[i]) ? this.data[i].clone : false;
        
        
        if ('ref' in this.data[i]) {
          if (this.data[i].ref === 'self') {

            if (cloneBox) {
              this.data[i] = new BoxObject({x: i % this.size, y: Math.floor(i / this.size), enterable: true, pushable: true, loc: this.id});
              this.data[i].clone = true;
              this.data[i].cloneOf = this;
            } else
              this.data[i] = this;
            
          } else if (this.data[i].ref === 'var') {
            
            this.data[i] = this.data[i].data;
            
          } else {
            
            if (cloneBox) {
              const r = Levels[this.data[i].ref];
              this.data[i] = new BoxObject({x: i % this.size, y: Math.floor(i / this.size), enterable: true, pushable: true, loc: this.id});
              this.data[i].clone = true;
              this.data[i].cloneOf = r;
            } else {
              if (LobbyWorld && !this.data[i].real) {
                const r = this.data[i].ref;
                if (typeof this.id == 'string')
                  this.data[i] = new BoxLevel({...structuredClone(LevelBank[CurrentWorld][this.data[i].ref][1]), x: i % this.size, y: Math.floor(i / this.size), loc: this.id});
                else
                  this.data[i] = new BoxLevel({data: [1,1,1,1,0,1,1,1,1], x: i % this.size, y: Math.floor(i / this.size), loc: this.id});
                this.data[i].init();
                this.data[i].level = r;
              } else
                this.data[i] = Levels[this.data[i].ref];
            }
            
          }
          this.data[i].x = i % this.size;
          this.data[i].y = Math.floor(i / this.size);
          this.data[i].loc = this.id;
        }
      }
        
    }
  }
}


function SetUpLevel(lvl) {
  Levels = structuredClone(lvl);

  Player = new Patrick({x: 3, y: 3, img: patrickImg, loc: 1});
  
  if ('setup' in Levels) {
    if ('lobby' in Levels.setup)
      LobbyWorld = true;
    else
      LobbyWorld = false;
    
    if ('spawn' in Levels.setup) {
      Player.x = Levels.setup.spawn[0];
      Player.y = Levels.setup.spawn[1];
      if (Levels.setup.spawn.length > 2)
        Player.loc = Levels.setup.spawn[2];
    }
  }
  
  for (const i in Levels) {
    if (i === 'win' || i === 'setup') continue;
    Levels[i] = new BoxLevel(Levels[i]);
  }
  
  Levels[0] = new BoxLevel({ 
    x: 2,
    y: 2,
    id: 0, 
    size: 5, 
    loc: 0, 
    data: [0,0,0,0,0, 0,0,0,0,0, 0,0,{ref: Player.loc, clone: true},0,0, 0,0,0,0,0, 0,0,0,0,0]
  });
  const tempW = CurrentWorld;
  for (const i in Levels) {
    if (i === 'win' || i === 'setup') continue;
    if (LobbyWorld && typeof i === 'string')
      CurrentWorld = i;
    Levels[i].init();
  }
  CurrentWorld = tempW;
  Levels[0].data[12].paraDisabled = true;
}