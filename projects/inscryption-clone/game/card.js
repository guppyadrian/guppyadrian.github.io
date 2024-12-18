'use strict';


var curLvl = 0;
var inControl = true;
var drawingCard = false;
document.getElementById("atkB").style.backgroundColor = 'green';
var attemptPlace = null;
var atkQueue = [];
var snpQueue = [];
var tutText = '';
var tut = 0;
var botEng = 0;
var attacking = 0;
var Rows = 5;

var Slots = [];
for (let i = 0; i < 3; i++) {
  Slots[i] = [];
  for (let o = 0; o < Rows; o++) {
    Slots[i][o] = null;
  }
}
var Deck = [];
var PermDeck = [];
var Hand = [];
var Vessels = 5;
var Energy = 0;
var Bones = 0;
var Scale = 0;
var MaxEnergy = 1;
const CardPool = {
  L33pBot: {
    dis: 'L33pBot',
    hp: 2,
    atk: 0,
    eng: 1,
    spc: ['atb']
  },
  Automation: {
    dis: 'Automation',
    hp: 1,
    atk: 1,
    eng: 3,
    spc: []
  },
  DroneBot: {
    dis: 'DroneBot',
    hp: 1,
    atk: 1,
    eng: 3,
    spc: ['fly']
  },
  Hovde: {
    dis: 'ExoSkeleton',
    hp: 2,
    atk: 2,
    eng: 2,
    spc: ['btl']
  },
  Stronk: {
    dis: 'Big Man 2000',
    hp: 4,
    atk: 1,
    eng: 6,
    spc: []
  },
  Shield: {
    dis: 'ShieldBot',
    hp: 1,
    atk: 1,
    eng: 3,
    spc: ['sld']
  },
  Double: {
    dis: 'DoubleGunner',
    hp: 1,
    atk: 2,
    eng: 6,
    spc: ['dba']
  },
  MoveBoat: {
    dis: '49er',
    hp: 1,
    atk: 1,
    eng: 2,
    spc: ['mor']
  },
  Energy: {
    dis: 'EnergyBot',
    hp: 1,
    atk: 0,
    eng: 2,
    spc: ['eng']
  },
  Sniper: {
    dis: 'Sniper',
    hp: 1,
    atk: 1,
    eng: 3,
    spc: ['snp']
  }
};
const tagName = {
  'btl': 'Brittle',
  'fly': 'Air Attack',
  'atb': 'Air Block',
  'sld': 'Shield',
  'dba': 'Double Strike',
  'mor': 'Moving Right',
  'mol': 'Moving Left',
  'eng': '+Energy',
  'snp': 'Sniper'
};
for (let i = 0; i < 8; i++) {
  //PermDeck.push(CardPool[Object.keys(CardPool)[Math.floor(Math.random() * Object.keys(CardPool).length, 1)]])
}
PermDeck.push(Object.assign({}, CardPool.Automation));
PermDeck.push(Object.assign({}, CardPool.Double));
PermDeck.push(Object.assign({}, CardPool.Shield));
PermDeck.push(Object.assign({}, CardPool.Energy));
PermDeck.push(Object.assign({}, CardPool.Sniper));


function gameTick() {

  if (tut == 1) document.getElementById("atkB").style.backgroundColor = 'red';
  if (tut == 2) document.getElementById("atkB").style.backgroundColor = 'green';

  ctx.textAlign = 'left';
  ctx.fillText(`Points: ${Scale}`, 2, 14);
  ctx.fillText(`Energy: ${Energy}`, 2, 28);
  //ctx.fillText(`Bones: ${Bones}`, 2, 42)


  ctx.fillText(`Delete`, 50, 240);
  if (attemptPlace == 'none') ctx.fillStyle = 'red';
  else if (tut != 1) {
    ctx.fillStyle = 'green'
  } else (
    ctx.fillStyle = 'grey'
  )
  ctx.fillRect(10, 229, 30, 14);
  ctx.fillStyle = 'black';

  for (let i = 0; i < Hand.length; i++) {
    ctx.fillText(`${Hand[i].dis}: ${Hand[i].atk} atk, ${Hand[i].hp} hp, ${Hand[i].eng} cost`, 50, 260 + i * 20)
    if (attemptPlace == i) ctx.fillStyle = 'red'
    else {
      if (Hand[i].eng > Energy || (tut == 1 && Hand[i].dis != 'Vessel')) ctx.fillStyle = 'grey'
      else ctx.fillStyle = 'green'
    }
    ctx.fillRect(10, 249 + i * 20, 30, 14)
    ctx.fillStyle = 'black'
  }

  ctx.textAlign = 'center'
  for (let o = 0; o < 3; o++) {
    for (let i = 0; i < Rows; i++) {

      const oi = Slots[o][i]

      if (o == 0 && attemptPlace != null) {
        if (oi == null && attemptPlace != 'none') {
          if (tut != 1 || i == 1) {
            ctx.fillStyle = 'green'
            ctx.fillRect(0 + 100 * i, 171, 100, 55)
            ctx.fillStyle = 'black'
          }
        } else if (oi != null && attemptPlace == 'none') {
          ctx.fillStyle = 'green'
          ctx.fillRect(0 + 100 * i, 171, 100, 55)
          ctx.fillStyle = 'black'
        }
      } else if (o == 1 && snpQueue.length > 0) {
        ctx.fillStyle = 'green'
        ctx.fillRect(100 * i, 115, 100, 55)
        ctx.fillStyle = 'black'
      }

      if (oi != null) {
        ctx.fillText(`${oi.dis}`, i * 100 + 50, 185 - o * 55)
        if (oi.spc.length > 0) {
          ctx.font = '10px Arial'
          ctx.fillText(`${tagName[oi.spc[0]]}`, i * 100 + 50, 203 - o * 55)
          ctx.font = '14px Arial'
        }
        ctx.fillText(`atk: ${oi.atk} hp: ${oi.hp}`, i * 100 + 50, 220 - o * 55)
      }





    }
  }
  ctx.fillRect(0, 115, 100 * Rows, 1)
  ctx.fillRect(0, 170, 100 * Rows, 1)
  ctx.fillRect(0, 225, 100 * Rows, 3)
  ctx.fillRect(0, 60, 100 * Rows, 3)
  for (let i = 1; i < Rows; i++) {
    ctx.fillRect(100 * i, 60, 1, 165)
  }
  for (let i in atkQueue) {
    atkQueue[i][1] += 1;
    ctx.beginPath();
    ctx.moveTo((50 + 100 * atkQueue[i][0]) - atkQueue[i][1], 200 - atkQueue[i][2] * 55 + atkQueue[i][1]);
    ctx.lineTo((50 + 100 * atkQueue[i][0]) + atkQueue[i][1], 200 - atkQueue[i][2] * 55 - atkQueue[i][1]);
    ctx.stroke();
    ctx.fillStyle = 'red'
    ctx.fillText(`${atkQueue[i][3]} DMG`, atkQueue[i][0] * 100 + 50, 200 - atkQueue[i][2] * 55)
    ctx.fillStyle = 'black'
    if (atkQueue[i][1] == 25) atkQueue.splice(i, 1)
  }

  if (drawingCard) {
    ctx.font = '9px Arial'
    ctx.fillText('Draw Vessel', myCanvas.width - 35, 238)
    ctx.fillText(`Remaining: ${Vessels}`, myCanvas.width - 35, 247)
    ctx.fillRect(myCanvas.width - 60, 250, 50, 30)
    ctx.fillText('Draw Card', myCanvas.width - 35, 315)
    ctx.fillText(`Remaining: ${Deck.length}`, myCanvas.width - 35, 324)
    ctx.fillRect(myCanvas.width - 60, 325, 50, 30)
    ctx.font = '14px Arial'
  }
  ctx.font = '12px Arial';
  const tt = tutText.split('\n')
  ctx.fillStyle = 'darkgreen'
  for (let i = 0; i < tt.length; i++) ctx.fillText(tt[i], 200, 14 + 14 * i)
  if (tut == 1) {
    ctx.beginPath()
    ctx.moveTo(25, 390)
    ctx.lineTo(25, 350)
    ctx.lineTo(20, 365)
    ctx.moveTo(25, 350)
    ctx.lineTo(30, 365)
    ctx.stroke()
  }
  ctx.fillStyle = 'black'
  ctx.font = '14px Arial';
}

function StartGame() {
  Deck = [...PermDeck];
  MaxEnergy = 1;
  Energy = MaxEnergy;
  Bones = 0;
  botEng = 0;
  Scale = 0;
  Hand = [];
  Slots = [];
  Vessels = 5;
  atkQueue = [];
  attemptPlace = null;
  document.getElementById("atkB").style.backgroundColor = 'green';
  for (let i = 0; i < 3; i++) {
    Slots[i] = []
    for (let o = 0; o < Rows; o++) {
      Slots[i][o] = null
    }
  }
  if (curLvl == 0) {
    PlayCard(CardPool.L33pBot, 0, false);
    PlayCard(CardPool.Automation, 1, false);
  } else if (curLvl == 4) {
    const Biggest = {
      dis: 'BiggerMan3000',
      hp: 15,
      atk: 3,
      spc: ['atb', '']
    }
    for (let i = 0; i < 5; i++) {
      PlayCard(CardPool.L33pBot, i, false)
    }
    PlayCard(Biggest, 2, false);
    
  } else {
    AIPhase()
  }
  inControl = true;
  drawingCard = false;
  for (let i = 0; i < 3; i++) {
    DrawCard();
  }
  DrawVessel();

  if (tut == 0) {
    tut = 1;
    tutText = 'The bottom row is your units\npress the green button next to the bottom left card\nplace it in the hightlighed area\nplacing cards costs energy, look at the top left'
  }
}

function PlayCard(card, pos, player = true) {
  if (!inControl && player) return
  let rcard = card
  if (rcard.spc.includes('mol')) rcard.spc[rcard.spc.indexOf('mol')] = 'mor'
  if (!player) Slots[2][pos] = Object.assign({}, rcard);
  else {
    Slots[player ? 0 : 1][pos] = Object.assign({}, rcard)
    if (rcard.spc.includes('eng')) {
      if (MaxEnergy + botEng < 6) { botEng += 1; Energy++ }
    }
  }
}

function AtkPhase() {
  if (!inControl || drawingCard || tut == 1) return

  if (tut == 2) {
    tut++
    tutText = 'After the turn ends you get +1 max energy\nYour energy gets set to your max energy each turn\nnow draw either a card or vessel\ntry not to run out of cards'
  } else if (tut == 4) {
    tut++
    tutText = ''
  }

  function TeamAtk(team = 0, l) {
    const tl = Slots[team][l]
    if (tl != null && tl.atk > 0) {
      if (tl.spc.includes('dba')) {
        AtkCard(l - 1, tl.atk, !team, tl.spc);
        AtkCard(l + 1, tl.atk, !team, tl.spc);
        setTimeout(() => {
          UpdateCard(l - 1, team);
          UpdateCard(l + 1, team);

        }, 500);
      } else
        AtkCard(l, tl.atk, !team, tl.spc);
      if (tl.spc.includes('btl')) Slots[team][l] = null;
      setTimeout(() => {
        UpdateCard(l, team);

        if (tl.spc.includes('mol') || tl.spc.includes('mor')) {
          if (tl.spc.includes('mor') && (l >= Rows - 1 || Slots[team][l + 1] != null)) {
            tl.spc[tl.spc.indexOf('mor')] = 'mol';
          } else if (tl.spc.includes('mol') && (l <= 0 || Slots[team][l - 1] != null)) {
            tl.spc[tl.spc.indexOf('mol')] = 'mor';
          }
          if (tl.spc.includes('mol') && !(l <= 0 || Slots[team][l - 1] != null)) {
            Slots[team][l - 1] = tl;
            Slots[team][l] = null;
          } else if (tl.spc.includes('mor') && !((l >= Rows - 1 || Slots[team][l + 1] != null))) {
            Slots[team][l + 1] = tl;
            Slots[team][l] = null;
          }
        }



      }, 500);
    }
    if (Slots[team][l] == null || (!Slots[team][l].spc.includes('snp') || team == 1)) attacking++
  }

  attemptPlace = null;
  inControl = false;
  document.getElementById("atkB").style.backgroundColor = 'red';


  function finAtk(o) {
    if (o != attacking) {
      window.setTimeout(() => {
        finAtk(o)
      }, 500)
    } else {
      TeamAtk(0, o);
    }
  }
  attacking = 0;
  for (let i = 0; i < Rows; i++) {
    finAtk(i)
  }

  function lp() {
    if (Rows != attacking) {
      window.setTimeout(lp, 500)
    } else {

      if ((Slots[1][2] == null || Slots[1][2].dis != 'BiggerMan3000') && MaxEnergy > 1 && curLvl == 4) {
        tutText = "You have beat the game yay pogger\nAbsolutely hilarious\nFreeplay time"
        PermDeck.push(Object.assign({}, CardPool[Object.keys(CardPool)[Math.floor(Math.random() * Object.keys(CardPool).length, 1)]]))
        tut = 69;
        setTimeout(() => {
          inGame = true; transistion = true;
          tutText = ''
        }, 7000)
        return;
      }
      if (Scale > 4 && curLvl == 4) {
        tutText = "Your points won't help here.\nDefeat the boss"
      }
      if (Scale > 4 && curLvl != 4) {
        tutText = 'You won...\nA card has been added to your deck'
        PermDeck.push(Object.assign({}, CardPool[Object.keys(CardPool)[Math.floor(Math.random() * Object.keys(CardPool).length, 1)]]))
        tut = 69;
        setTimeout(() => {
          inGame = true; transistion = true;
          tutText = ''
        }, 5000)
        return;
      }
      setTimeout(() => {
        for (let i = 0; i < Rows; i++) {
          if (Slots[2][i] != null && Slots[1][i] == null) {
            Slots[1][i] = Slots[2][i];
            Slots[2][i] = null;
          }
          TeamAtk(1, i)
        }
        if (Scale < -4) {
          tutText = 'You lost...\nI will reset the board and give you another chance'
          tut = 69;
          setTimeout(() => {
            //inGame = true; transistion = true;
            StartGame()
            tutText = ''
          }, 5000)
          return;
        }
      }, 1000)

      setTimeout(() => {
        AIPhase();
        if (MaxEnergy + botEng < 6)
          MaxEnergy += 1;
        Energy = MaxEnergy + botEng;

        drawingCard = true;
        inControl = true;
      }, 2000)

    }
  }
  setTimeout(lp, 600)

}

function AIPhase() {
  for (let i = 0; i < Math.random() * 2 + (curLvl / 4) - 0.75 - (curLvl == 0 || curLvl == 4 ? 0.5 : 0); i++) {
    let th = Math.floor(Math.random() * Object.keys(CardPool).length)
    let ct = CardPool[Object.keys(CardPool)[th]]
    while ((ct.eng / 4) + Math.random() > 2 + (curLvl / 7) * Math.random() - (curLvl == 0 || curLvl == 4 ? 0.3 : 0)) {
      th = Math.floor(Math.random() * Object.keys(CardPool).length)
      ct = CardPool[Object.keys(CardPool)[th]]
    }
    let cp;
    cp = Math.floor(Math.random() * Rows)
    while (Slots[2][cp] != null && Math.random() > 0.7 - (curLvl / 7) * Math.random()) {
      cp = Math.floor(Math.random() * Rows)
    }
    PlayCard(ct, cp, false);
  }

}

function AtkCard(pos, dmg = 1, player = true, spc = []) {
  if (pos < 0 || pos > Rows - 1) return;
  let rpos = pos;
  if (spc.includes('snp')) {
    if (player) {
      snpQueue.push([dmg, spc])
      return;
    } else {
      rpos = Math.round(Math.random() * 3)
      setTimeout(() => UpdateCard(rpos, true), 500)
    }
      

  }
  atkQueue.push([rpos, 0, player, dmg]);
  const _atkP = Slots[player ? 1 : 0][rpos]
  if (_atkP == null) {
    Scale += dmg * (player ? 1 : -1);
    return;
  }

  if (spc.includes('fly')) {
    if (_atkP.spc.includes('atb')) {
      if (_atkP.spc.includes('sld')) {
        Slots[player ? 1 : 0][rpos].spc = [..._atkP.spc]
        Slots[player ? 1 : 0][rpos].spc.splice(_atkP.spc.indexOf('sld'), 1);
        return;
      }
      if (_atkP.hp <= 0)
        Scale += dmg * (player ? 1 : -1);
      else
        _atkP.hp -= dmg;
    }
    else { Scale += dmg * (player ? 1 : -1); }
  } else {

    if (_atkP.spc.includes('sld')) {
      Slots[player ? 1 : 0][rpos].spc = [..._atkP.spc]
      Slots[player ? 1 : 0][rpos].spc.splice(_atkP.spc.indexOf('sld'), 1);
      return;
    }
    if (_atkP.hp <= 0)
      Scale += dmg * (player ? 1 : -1);
    else
      _atkP.hp -= dmg;
  }

  return;
}

function UpdateCard(pos, player = false) {
  if (Slots[player ? 0 : 1][pos] == null) return;
  if (Slots[player ? 0 : 1][pos].hp <= 0) {
    if (player) {
      Bones++;
      if (Slots[player ? 0 : 1][pos].spc.includes('eng')) botEng -= 1;
    }
    Slots[player ? 0 : 1][pos] = null;
  }
}

function DrawCard() {
  let i = Deck.splice(Math.floor(Math.random() * Deck.length), 1)[0]
  i.spc = [...i.spc];
  Hand.push(Object.assign({}, i));
}
function DrawVessel() {
  Hand.push(
    {
      dis: 'Vessel',
      hp: 2,
      atk: 0,
      eng: 1,
      spc: []
    }
  )
  Vessels--;
}

addEventListener('mouseup', MyEvent => {
  const cx = MyEvent.clientX - canRect.left;
  const cy = MyEvent.clientY - canRect.top;
  for (let i = -1; i < Hand.length; i++) {
    if (cx >= 10 && cx <= 40) {
      if (cy >= 249 + i * 20 && cy <= 263 + i * 20) {

        if (i == -1) {
          if (inControl && !drawingCard && tut != 1) {
            if (attemptPlace == null || attemptPlace != 'none')
              attemptPlace = 'none';
            else attemptPlace = null;
          }
        } else {
          if (Hand[i].eng <= Energy && inControl && !drawingCard && (tut != 1 || Hand[i].dis == 'Vessel')) {
            if (attemptPlace == null || attemptPlace != i) attemptPlace = i;
            else attemptPlace = null;
          }
        }



      }
    }
  }
  for (let i = 0; i < Rows; i++) {
    if (cx >= 100 * i && cx <= 100 + 100 * i) {
      if (cy >= 170 && cy <= 230) {
        if (attemptPlace == 'none') {
          if (Slots[0][i].spc.includes('eng')) botEng -= 1;
          Slots[0][i] = null
          attemptPlace = null;
        } else if (Slots[0][i] == null) {
          if (tut != 1 || i == 1) {
            Energy -= Hand[attemptPlace].eng
            PlayCard(Hand.splice(attemptPlace, 1)[0], i)
            attemptPlace = null;
            if (tut == 1) {
              tut++
              tutText = 'Good, your row will attack\nthen the top row will move down and attack\nyou get points by attacking the board\npress \'Finish Turn\''
            }
          }
        }

      }
    }
  }

  if (snpQueue.length > 0) {
    for (let i = 0; i < Rows; i++) {
      if (cx >= 100 * i && cx <= 100 + 100 * i) {
        if (cy >= 115 && cy <= 170) {
          let snpPos = [...snpQueue[0][1]]
          snpPos.splice(snpQueue[0][1].indexOf('snp'), 1)
          AtkCard(i, snpQueue[0][0], true, snpPos)
          attacking++
          atkQueue.push([i, 0, true, snpQueue[0][0]]);
          snpQueue.splice(0, 1)
          setTimeout(() => {
            UpdateCard(i, false)
          }, 500)
        }
      }
    }
  }

  if (cx >= myCanvas.width - 60 && cx <= myCanvas.width - 10 && cy >= 250 && cy <= 280) {
    if (Vessels == 0 && Deck.length == 0) {
      for (let i = 0; i < 2; i++) {
        PlayCard(
          {
            dis: 'Starvation',
            hp: 9,
            atk: 6,
            eng: 1,
            spc: []
          }, Math.round(Math.random() * 3), false)
      }
      drawingCard = false;
      document.getElementById("atkB").style.backgroundColor = 'green';
    }
    if (Vessels > 0) {
      DrawVessel();
      drawingCard = false;
      document.getElementById("atkB").style.backgroundColor = 'green';
    }
    if (tut == 3) {
      tut = 4
      tutText = 'If you get 5 points you win\nif you get -5 points you lose\nSome cards have special traits\nI\'ll let you play now'
    }

  } else if (cx >= myCanvas.width - 60 && cx <= myCanvas.width - 10 && cy >= 325 && cy <= 355) {
    if (Vessels == 0 && Deck.length == 0) {
      for (let i = 0; i < 2; i++) {
        PlayCard(
          {
            dis: 'Starvation',
            hp: 9,
            atk: 6,
            eng: 1,
            spc: []
          }, Math.round(Math.random() * 3), false)
      }
      drawingCard = false;
      document.getElementById("atkB").style.backgroundColor = 'green';
    }
    if (Deck.length > 0) {
      DrawCard();
      drawingCard = false;
      document.getElementById("atkB").style.backgroundColor = 'green';
    }
    if (tut == 3) {
      tut = 4
      tutText = 'If you get 5 points you win\nif you get -5 points you lose\nSome cards have special traits\nI\'ll let you play now'
    }
  }
})

StartGame();
//PlayCard(Hand.splice(Math.floor(Math.random() * Hand.length), 1)[0], 0);


