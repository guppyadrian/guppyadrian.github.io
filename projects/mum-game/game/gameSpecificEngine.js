var Level = {
  data: Array(100).fill(0),
  size: 10,
  plates: {}
};
var WorldPosition = 115;

function GtoP(g) {
  return {x: (g % Level.size), y: Math.floor(g / Level.size)};
}

function PtoG(p) {
  try {
    return p.x + p.y * Level.size;
  }
  catch (err) {
    
  }
}

const Animations = {box: {}};
var Boxes = {};
function edgeCheck(target, vel) {
  const tx = GtoP(target).x + vel.x;
  const ty = GtoP(target).y + vel.y;
  if (tx >= 0 && tx < Level.size) {
    
    if (ty >= 0 && ty < Level.size)  {
      return false;
    } else return (ty >= Level.size) ? 2 : 4;
    
  } else return (tx >= Level.size) ? 1 : 3 ;
}

function canPush(target, vel, strength) {
  const pushedInto = target + PtoG(vel);
  
  if (Level.data[target] === undefined || strength === 0) {
    return false;
  }
  
  if (Level.data[target] === 0)
    return true;
  if (Level.data[target].getPushed(vel, strength))
    return true;
  
  return false;
}

/* BOX */
class Box {
  constructor(pos, pushable = true, type = "dirt") {
    this.pos = pos;
    this.draw = {x: 0, y: 0};
    this.pushable = pushable;
    this.type = type;
    this.id = Math.random();
    Level.data[PtoG(this.pos)] = this;
    Boxes[this.id] = this;
  }

  move(pushedInto) {
    Level.data[pushedInto] = this;
    Level.data[PtoG(this.pos)] = 0;
    const vel = {x: GtoP(pushedInto).x - this.pos.x, y: GtoP(pushedInto).y - this.pos.y};
    this.pos = GtoP(pushedInto);

    this.draw.x -= vel.x * 32;
    this.draw.y -= vel.y * 32;
    Animations.box[this.id] = {f: 4, x: vel.x * 8, y: vel.y * 8};
  }
  
  getPushed(velocity, strength) {
    if (!this.pushable)
      return false;
    let vel = velocity;
    let edgePass = true;
    if (this.type === "copper") {
      vel = {x: vel.x * 2, y: vel.y * 2};
    }

    if (edgeCheck(PtoG(this.pos), vel) || strength === 0)
      edgePass = false;
    
    const pushedInto = PtoG(this.pos) + PtoG(vel);

    if (edgePass && Level.data[pushedInto] === 0) {
      this.move(pushedInto);
      return true;
    }

    if (edgePass && Level.data[pushedInto].getPushed(velocity, strength - 1)) {
      this.move(pushedInto);
      return true;
    }

    if (Math.abs(vel.x) >= 2 || Math.abs(vel.y) >= 2) {

      const pushedIntoShort = PtoG(this.pos) + PtoG(velocity);

      if (Level.data[pushedIntoShort] === undefined) return false;
      
      if (Level.data[pushedIntoShort] === 0 || Level.data[pushedIntoShort].getPushed(velocity, strength - 1)) {
        this.move(pushedIntoShort);
        return true;
      }
    }
    return false;
  }
}

/* Player! */
const Player = {
  pos: {x: 0, y: 0},
  draw: {x: 0, y: 0},
  img: Lib.add("player"),
  move: function(x, y) {
    const vel = {x: x, y: y}
    const dest = PtoG(this.pos) + PtoG(vel);

    const edgeCheckRet = edgeCheck(PtoG(this.pos), vel);

    if (edgeCheckRet) {
      const oldSize = Level.size;
      const oldPos = structuredClone(Player.pos);

      WorldPosition += vel.x + vel.y * 11;
      
      createWorld(Levels[WorldPosition]);
      const transferMult = Level.size / oldSize;
      
      Player.pos.x = Math.floor((1/2 + oldPos.x) * transferMult);
      Player.pos.y = Math.floor((1/2 + oldPos.y) * transferMult);
      
      
      switch(edgeCheckRet) {
        case 1:
          Player.pos.x = 0;
          break;
        case 2:
          Player.pos.y = 0;
          break;
        case 3:
          Player.pos.x = Level.size - 1;
          break;
        case 4:
          Player.pos.y = Level.size - 1;
          break;
      }
      
      return true;
    }
    if (!canPush(dest, vel, 2)) {
      return false;
    }
    
    Level[dest] = this;
    Level[this.pos.x + this.pos.y * Level.size] = 0;
    this.pos.x += x;
    this.pos.y += y;
    
    return true;
  }
};