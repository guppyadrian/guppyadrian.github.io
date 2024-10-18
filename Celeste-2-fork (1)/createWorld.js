function CreateBlocks(x, y, type = 'block', length = 1, height = 1, extraTags = [], oImg = '') {
  if (type === 'block') { // type === 'block'
    if (length === 1) {
      if (height === 1) {
        world.push(new Block(type, x, y, extraTags, 'textures/grass/full.png'));
        return;
      } else {
        world.push(new Block(type, x, y, extraTags, 'textures/grass/tubetop.png'));
        for (let h = 1; h < height - 1; h++) {
          world.push(new Block(type, x, y + (h * 30), extraTags, 'textures/grass/tubeup.png'));
        }
        world.push(new Block(type, x, y + ((height-1) * 30), extraTags, 'textures/grass/tubedown.png'));
      }
    } else {
      if (height === 1) {
        world.push(new Block(type, x, y, extraTags, 'textures/grass/tubeleft.png'));
        for (let l = 1; l < length - 1; l++) {
          world.push(new Block(type, x + (l * 30), y, extraTags, 'textures/grass/tubeside.png'));
        }
        world.push(new Block(type, x + ((length-1) * 30), y, extraTags, 'textures/grass/tuberight.png'));
      } else {
        
        world.push(new Block(type, x, y, extraTags, 'textures/grass/upleft.png'));
        for (let h = 1; h < height - 1; h++) {
          world.push(new Block(type, x, y + (h * 30), extraTags, 'textures/grass/left.png'));
        }
        world.push(new Block(type, x, y + ((height-1) * 30), extraTags, 'textures/grass/downleft.png'));
        for (let w = 1; w < length - 1; w++) {
          world.push(new Block(type, x + (w * 30), y, extraTags, 'textures/grass/up.png'));
          for (let h = 1; h < height - 1; h++) {
            world.push(new Block(type, x + (w*30), y + (h*30), extraTags, 'textures/grass/none.png'));
          }
          world.push(new Block(type, x + (w*30), y + ((height-1)*30), extraTags, 'textures/grass/down.png'));
        }
        world.push(new Block(type, x + ((length-1)*30), y, extraTags, 'textures/grass/upright.png'));
        for (let h = 1; h < height - 1; h++) {
          world.push(new Block(type, x + ((length-1)*30), y + (h * 30), extraTags, 'textures/grass/right.png'));
        }
        world.push(new Block(type, x + ((length-1)*30), y + ((height-1) * 30), extraTags, 'textures/grass/downright.png'));
        
      }
    }
    
  } else {

    for (let w = 0; w < length; w++) {
      for (let h = 0; h < height; h++) {
        world.push(new Block(type, x + (w * 30), y + (h * 30), extraTags, oImg));
      }
    }
    
  }
}

function CreateWorld(id, useID = true) {
  RecentTower = WorldId;
  if (useID)
    WorldId = id;
  else
    WorldId = -1;
  
  if (useID && id < 1) {
    LobbyWorld = id;
  }

  world = [];
  worldP = [];
  worldT = [];

  let lvl;
  if (useID)
    lvl = lvlData[id];
  else {
    if (Array.isArray(id)) {
    lvl = {"format": 1, "spawn": [150, 60], "data": id};
    
    }
    else {
    lvl = id;
    }
  }
    
  if ("format" in lvl) {
    levelFormat = lvl.format;
  } else 
    levelFormat = 1;
  for (let i = 0; i < lvl.data.length; i++) {
    CreateBlocks(...lvl.data[i]);
  }
  if (WorldId === 0) {
    worldT.push(new Text('Arrow Keys to Move', 125, 0, 18));
    worldT.push(new Text('C to Jump', 125, 50, 18));
  }
  
  if ("music" in lvl) {
    setSong(lvl.music);
  }
  Player = new Character(playerImg);
  if (WorldId === 0) Player.maxDashes = 0;
  Player.x = lvl.spawn[0];
  Player.y = lvl.spawn[1];
  Checkpoint = [lvl.spawn[0],lvl.spawn[1]];
  camX = Player.x - (myCanvas.width / camZ) / 2;
  camY = Player.y;
  Player.yAccel = -3;
  Player.xAccel = 0;
  Player.canJump = true;
  Player.wallJump = 0;
  if (LobbyWorld !== WorldId)
    Timer = 0;
  Ticker = 0;
  redActive = 1;
  
}