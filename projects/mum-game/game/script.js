

// Player: {f: 30, x: -1, y: 0, end: {x: 0, 0}}
// f--, pos.x += x, pos.y += y, pos = end

function Tick() {
  
  if (Keys.s) {
    if (Player.move(0, 1)) {
      Player.draw.y -= 32;
      Animations.player = {f: 4, x: 0, y: 8};
    }
    Keys.s = false;
  } else if (Keys.d) {
    if (Player.move(1, 0)) {
      Player.draw.x -= 32;
      Animations.player = {f: 4, x: 8, y: 0};
    }
    Keys.d = false;
  } else if (Keys.w) {
    if (Player.move(0, -1)) {
      Player.draw.y += 32;
      Animations.player = {f: 4, x: 0, y: -8};
    }
    Keys.w = false;
  } else if (Keys.a) {
    if (Player.move(-1, 0)) {
      Player.draw.x += 32;
      Animations.player = {f: 4, x: -8, y: 0};
    }
    Keys.a = false;
  }

  for (const plate in Level.plates) {
    const pressed = (Level.data[plate] !== 0) || (PtoG(Player.pos) === parseInt(plate));
    const blockAffected = Level.plates[plate][0];

    if (pressed) {
      if (Level.data[blockAffected] === 0 || Level.data[blockAffected].pushable === false)
        Level.data[blockAffected] = 0;
    } else {
      if (Level.data[blockAffected] === 0 && PtoG(Player.pos) !== blockAffected)
        new Box(GtoP(blockAffected), false, "wall");
    }
  }

  if (Keys.i) {
    const ret = JSON.parse(prompt("Enter Level Code"));
    Keys.i = false;
    if (typeof ret === "object")
      createWorld(ret);
    else
      console.log("Failed loading level, Not a object")
  }

  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Cam.z = 768 / (32 * Level.size);
  
  if ("player" in Animations) {
    Player.draw.x += Animations.player.x;
    Player.draw.y += Animations.player.y;
    if (--Animations.player.f === 0) {
      //Player.pos = Animations.player.end;
      Player.draw = {x: 0, y: 0};
      delete Animations.player;
    }
  }

  for (const id in Animations.box) {
    const box = Boxes[id];

    box.draw.x += Animations.box[id].x;
    box.draw.y += Animations.box[id].y;
    if (--Animations.box[id].f === 0) {
      box.draw = {x: 0, y: 0};
      delete Animations.box[id];
    }
  }

  
  const tileImg = Lib.add("tile");
  for (let i = 0; i < Level.size ** 2; i++) {
    draw(tileImg, {x: GtoP(i).x * 32, y: GtoP(i).y * 32});
    
    if (i in Level.plates && PtoG(Player.pos) !== i) {
      draw(Lib.add("pplate"), {x: (i % Level.size) * 32, y: Math.floor(i / Level.size) * 32 });
    }  
  }
  
  for (const pos in Level.data) {


    
    
    //draw player
    if (PtoG(Player.pos) === parseInt(pos)) {
      draw(Player.img,  {x: Player.pos.x * 32 + Player.draw.x, y: Player.pos.y * 32 + Player.draw.y});
    }
    if (Level.data[pos] === 0)
      continue;
    
    //draw if box
    let img = Level.data[pos].type;
    let boxDraw = Level.data[pos].draw;
    draw(Lib.add(img), {x: (pos % Level.size) * 32 + boxDraw.x, y: Math.floor(pos / Level.size) * 32 + boxDraw.y});
  }
  
}

//setInterval(Tick, 16.67)





createWorld(Levels[WorldPosition]);





/* 

OPxyO

P checks x
x checks y
y is good
y moves and returns true
x is good



*/