'use strict';
Camera.zoom = 2;
var zCooldown = false;
//https://youtube.com/watch?v=oHhOlVLhJfM
const introOneNested = {data: [1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1], size: 5, id: 2};
const emptyOneNested = {data: [0], size: 1, id: 2};
var CurrentLevel = 'lobby';
//var nestedLevel = new BoxLevel({data: [1,1,1,1,0,0,1,1,1], size: 3, id: 2});

var skipLevel = false;


const introOneWin = [{x: 6, y: 1, loc: 1, type: 'box'}, {x: 4, y: 6, loc: 1, type: 'plyr'}];
const recursiveOne = [
  1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,0,0,0,1,
  1,0,0,0,1,1,0,1,1,
  1,0,0,0,1,1,0,1,1,
  0,0,0,0,1,1,0,1,1,
  1,0,0,0,'self',0,0,1,1,
  1,0,0,0,1,1,0,1,1,
  1,0,0,0,0,1,1,1,1,
  1,1,1,1,0,1,1,1,1
];
const recursiveHard = [
  1,1,1,1,1,1,1,1,1,
  1,0,0,0,2,0,0,'self',1,
  1,0,0,0,0,0,0,0,1,
  1,0,0,0,0,1,1,0,1,
  0,0,0,0,0,1,0,0,1,
  1,1,0,1,1,1,0,0,1,
  1,1,0,1,0,1,0,0,1,
  1,1,0,0,0,0,1,1,1,
  1,1,1,1,0,1,1,1,1
];
const recursiveHardWin = [
  {x: 5, y: 7, loc: 1, type: 'box'},
  {x: 4, y: 6, loc: 1, type: 'plyr'}
];
const recursiveOneWin = [{x: 7, y: 1, loc: 1, type: 'box'}, {x: 3, y: 2, loc: 1, type: 'plyr'}];

const emptyOneWin = [{x: 3, y: 1, loc: 1, type: 'box'}, {x: 1, y: 2, loc: 1, type: 'plyr'}];



var lvlWonTicker = 0;

//SetUpLevel(LevelOrder[CurrentLevel]);
SetUpLevel(LevelBank.lobby);

const winnerSprite = new Sprite({
  x: myCanvas.width / 2 - 128, 
  y: myCanvas.height / 2 - 64, 
  img: winnerImg,
});

TICK = function() {
  if (Keys.r && !LobbyWorld)
    SetUpLevel(LevelBank[CurrentWorld][CurrentLevel]);
  if (Keys.e) {
    SetUpLevel(LevelBank.lobby);
    CurrentLevel = 'lobby';
    Player.loc = CurrentWorld;
    Player.x = Math.floor(Levels[Player.loc].size / 2);
  }

  if (Keys.i && !skipLevel) {
    skipLevel = true;
    CurrentLevel++;
    SetUpLevel(LevelBank[CurrentWorld][CurrentLevel]);
  }
  if (!Keys.i)
    skipLevel = false;
  
  const lvl = Levels[Player.loc];
  
  let levelWon = true;
  for (const i of Levels.win) {
    if (i.type === 'box') {
      if (Levels[i.loc].data[i.x + i.y * Levels[i.loc].size] === undefined) {
        levelWon = false;
        break;
      }
    } else {
      if (Player.x !== i.x || Player.y !== i.y || Player.loc !== i.loc) {
        levelWon = false;
        break;
      }
    }
  }
  
  if (!levelWon)
    Player.checkKeys(lvl);
  Player.updatePos();
  if (LobbyWorld)
    CurrentWorld = Player.loc;
  
  easeCameraTo({x: Player.sprite.x, y: Player.sprite.y});
  
  if (levelWon)
    console.log('beaten!');

  
  var addedStrokes = [];

  function drawLevel({l, x, y, w, h, deep = 0}) {
    if (l === undefined) return;
    if (x > myCanvas.width || x + w < 0 || y > myCanvas.height || y + h < 0) return;
    
    for (const p in l.data) {
      let i;
    if (l.data[p] === undefined) {
      if (l.id === 0) continue;
      i = blueImg;
    } else {
        if (l.data[p].enterable) {
          if (deep > 1)
            i = lBlueImg;
          else {
            drawLevel({
              l: (l.data[p].clone) ? l.data[p].cloneOf : l.data[p], 
              x: x + (p % l.size) * (w / l.size),
              y: y + Math.floor(p / l.size) * (h / l.size),
              w: w / l.size,
              h: h / l.size,
              deep: deep + 1
            });
            if (l.data[p].clone)
              addDrawQueue({
                img: overlayImg, 
                x: x + (p % l.size) * (w / l.size), 
                y: y + Math.floor(p / l.size) * (h / l.size),
                w: w / l.size,
                h: h / l.size
              });
            
            addedStrokes.push({
              x: x + (p % l.size) * (w / l.size),
              y: y + Math.floor(p / l.size) * (h / l.size),
              w: w / l.size, h: h / l.size,
              type: 'rect', stroke: true
            });
            continue;
          }
        } else
        if (!l.data[p].pushable) {
          i = lBlueImg;
        } else {
          i = yellowImg;
          addedStrokes.push({
            x: x + (p % l.size) * (w / l.size),
            y: y + Math.floor(p / l.size) * (h / l.size),
            w: w / l.size, h: h / l.size,
            type: 'rect', stroke: true
          });
        }
      }
      addDrawQueue({
        x: x + (p % l.size) * (w / l.size), 
        y: y + Math.floor(p / l.size) * (h / l.size),
        w: w / l.size,
        h: h / l.size,
        img: i
      });
    }
    if (l.id === Player.loc && !LobbyWorld)
      addDrawQueue({
        x: x + Player.x * (w / l.size),
        y: y + Player.y * (h / l.size),
        w: w / l.size,
        h: h / l.size,
        img: patrickImg
      });
    if (LobbyWorld) return;
    for (const lw of Levels.win) {
      if (l.id !== lw.loc) continue;
      addDrawQueue({x: x + lw.x * (w / l.size), y: y + lw.y * (h / l.size), w: w / l.size, h: h / l.size, img: (lw.type === 'box' ? goalBImg : goalPImg)});
    }
  }

  
  
  if (lvl.loc !== 0 || Player.loc !== 0) {
    const sz = 32 * lvl.size;
    
    const lvl2 = Levels[lvl.loc];
    if (lvl2.loc !== 0) {
      const ssz = sz * lvl2.size;


      const lvl3 = Levels[lvl2.loc];
      if (lvl3.loc !== 0) {
        const sssz = ssz * lvl3.size;
  
  
        

        drawLevel({l: Levels[lvl3.loc], x: -lvl3.x * sssz - (lvl.x * sz) - (lvl2.x * ssz), y: -lvl3.y * sssz - (lvl.y * sz) - (lvl2.y * ssz), w: sssz * Levels[lvl3.loc].size, h: sssz * Levels[lvl3.loc].size, deep: 0})
      }
      

      drawLevel({l: Levels[lvl2.loc], x: -lvl2.x * ssz - (lvl.x * sz), y: -lvl2.y * ssz - (lvl.y * sz), w: ssz * Levels[lvl2.loc].size, h: ssz * Levels[lvl2.loc].size, deep: 0})
    }

    
    drawLevel({l: Levels[lvl.loc], x: ((lvl.loc === 0) ? -2 : -lvl.x) * sz, y: ((lvl.loc === 0) ? -2 : -lvl.y) * sz, w: sz * Levels[lvl.loc].size, h: sz * Levels[lvl.loc].size, deep: 0})
    addedStrokes.push({x: 0, y: 0, w: sz, h: sz, type: 'rect', stroke: true});
  }
  
  
  for (const p in lvl.data) {
    let i;
    let addStroke = false;
    if (lvl.data[p-1] !== undefined && lvl.data[p-1].title) continue;
    if (lvl.data[p] === undefined) {
      if (lvl.id === 0 && Player.loc !== 0) continue;
      i = blueImg;
    }
    else {
      if (lvl.data[p].enterable && ((lvl.data[p].clone) ? ((lvl.data[p].cloneOf)!=undefined) : true)) {
        try {
          drawLevel({l: (lvl.data[p].clone) ? lvl.data[p].cloneOf : lvl.data[p], x: (p % lvl.size) * 32, y: Math.floor(p / lvl.size) * 32, w: 32, h: 32, deep: 0})
        }
        catch {
          console.log(lvl.data[p]);
        }
          if (lvl.data[p].clone)
          addDrawQueue({img: overlayImg, x: (p % lvl.size) * 32, y: Math.floor(p / lvl.size) * 32, w: 32, h: 32});
        const w = 0.8;
        addedStrokes.push({x: (p % lvl.size) * 32 + w, y: Math.floor(p / lvl.size) * 32 + w, w: 32 - w * 2, h: 32 - w * 2, type: 'rect', stroke: true});
        continue;
      } else
      if (!lvl.data[p].pushable)
        i = lBlueImg;
      else if (!lvl.data[p].enterable) {
        i = yellowImg;
        addStroke = true;
      }
    }
    
    addDrawQueue({x: (p % lvl.size) * 32, y: Math.floor(p / lvl.size) * 32, img: i})
    if (addStroke) {
      const w = 0.8;
      addedStrokes.push({x: (p % lvl.size) * 32 + w, y: Math.floor(p / lvl.size) * 32 + w, w: 32 - w*2, h: 32 - w*2, type: 'rect', stroke: true});
    }
  }
  addDrawQueue(Player.sprite); 

  for (const i of addedStrokes) {
  addDrawQueue(i);
  }
  
  for (const i of Levels.win) {
    if (Player.loc !== i.loc) continue;
    addDrawQueue({x: i.x * 32, y: i.y * 32, img: (i.type === 'box' ? goalBImg : goalPImg)});
  }
  Player.moved = false;
  Player.exited.times = 0;
  for (const l in Levels) {
    for (const i in Levels[l].data) {
      
      if (Levels[l].data[i] !== undefined) {
        Levels[l].data[i].moved = false;
        Levels[l].data[i].exited.times = 0;
      }
    }
  }


  //addDrawQueue({x: 256, y: 256, w: 100, h: 50, type: 'rect'});
  if (zCooldown && !Keys.z)
    zCooldown = false;
  if (!zCooldown && Keys.z && Snapshots.length > 0 && false) {
    const snap = Snapshots.pop();
    Levels = snap.lvls;

      
    Player.x = snap.plyr.x;
    Player.y = snap.plyr.y;
    Player.loc = snap.plyr.loc;
    zCooldown = true;
  }
  if (LobbyWorld && Player.loc === "Intro") {
    
    addDrawQueue({
      x: 48,
      y: -100,
      w: 256,
      h: 90,
      img: controlsImg
    });
  }
  if (CurrentWorld === "Intro" && CurrentLevel === 1) {
    addDrawQueue({
      x: -14,
      y: 240,
      w: 256,
      h: 90,
      img: guideImg
    });
  }

  
  if (levelWon) {
    addDrawQueue({
      x: myCanvas.width / 2 - 128, 
      y: myCanvas.height / 2 - 64, 
      img: winnerImg, 
      w: 256, 
      h: 128, 
      gui: true
    });
    if (++lvlWonTicker === 80) {
      SetUpLevel(LevelBank.lobby);
      for (const i in Levels[CurrentWorld].data) {
        if (Levels[CurrentWorld].data[i] !== undefined && Levels[CurrentWorld].data[i].level === CurrentLevel) {
          Player.loc = CurrentWorld;
          Player.x = i % Levels[CurrentWorld].size;
          Player.y = Math.floor(i / Levels[CurrentWorld].size) + 1;
        }
      }
      CurrentLevel = 'lobby';
      lvlWonTicker = 0;
    }

  }
}
/*
you stupid*/

if (navigator.userAgentData.mobile || true) {
  const ar = ['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','r','e']
  const arp = [[0,20],[80,20],[40,40],[40,0],[0,80],[40,80]];
  for (let i = 0; i < 6; i++) {
  let btn = document.createElement('button');
  btn.innerHTML = ar[i];
  btn.style.position = 'absolute';
  btn.style.top = arp[i][1];
  btn.style.left = arp[i][0];
  btn.onclick = () => {
    console.log('hey!')
    Keys[ar[i]] = true
    setTimeout(() => {Keys[ar[i]] = false}, 100);
  };
  document.body.appendChild(btn);
  }
}


ADDCONTROLS();
STARTCONTROLLER();

/*
Melo protecs skin from uv, is pigment for skin color
in areas with stronger uv, there is darker skin color.
Body hair is replaced with more melonin production
About a million years ago body hair was replaced
What advantage for having dark skin:
protects folin, which is for reproduction
vitamin d is needed to protect UV.
Darker skins need vitamin d supplements in areas with less UV
Ligher skins shouldn't be in UV for skin cancer.

Variations:
Lighter: pheomelanin
Darker: eumalanin

Change:
new area with different UV intensities

Advantage
High UV => eumelanin protects folate from uv
*/