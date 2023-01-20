var tickKey;
class Arena {
  constructor() {
    this.teams = [];
    this.teams[0] = {};
    this.teams[1] = {};
    this.turn = 0;
    this.attacker = 0;
  }

  init(team0) {
    this.teams[0] = team0;
    this.teams[1] = [
      new Character(1)
    ]
    this.turn = 1;
  }
}


class Character {
  constructor(team = 0) {
    this.maxHp = 50;
    this.hp = 50;
    this.shield = 0;
    this.statuses = {}; //stays
    this.effects = {}; //goes down
    this.team = team; // 0 is you :)
  }

  recoverHp(amt) {
    this.hp += amt;
    if (this.hp > this.maxHp)
      this.hp = this.maxHp;
  }

  recoverShield(amt) {
    this.shield += amt;
  }
  
  recieveDamage(amt) {
    const leftoverDmg = this.shield - amt; //leftover damage after shield
    this.shield = Math.max(leftoverDmg, 0);
    this.hp += Math.min(leftoverDmg, 0);
  }
}


const Jim = new Character(0);
const Party = [
  Jim
]

var Battle = new Arena();

Battle.init(Party);

var Hand = [];

var CardsUsedThisTurn = 0;

class Card {
  constructor(type, pos = {x:0,y:0}) {
    this.pos = {x: pos.x, y: 600};
    this.draw = {x: pos.x, y: 0};
    this.dmg = 5;
    this.shield = 0;
    this.used = false;
    this.rot = 0;
    this.startRot = false;
    this.ticker = 0;
    this.img = Lib.add("strike");
    switch (type) {
      case "strike":
        this.img = Lib.add("strike");
        this.dmg = 6;
        break;
      case "defend":
        this.img = Lib.add("defend");
        this.dmg = 0;
        this.shield = 5;
        break;
    }
  }
}

const GamePlayer = new Character(0);
const GameEnemy = new Character(1);


function Damage(amt, target = 1) {
  if (target === 1) {
    GameEnemy.recieveDamage(amt);
    if (GameEnemy.hp <= 0) {
      ctx.fillStyle = "red";
      ctx.font = "60px Arial";
      clearInterval(tickKey);
      DrawFrame();
      ctx.fillText("You Won!", 300, 350);
      ctx.fillText("Restarting...", 335, 420);
      setTimeout(() => {
        RestartGame();
      }, 4000)
    }
    lifespanArray.push(new DamageTick(-amt, {x: 975, y: 450}));
  } else {
    GamePlayer.recieveDamage(amt);
    lifespanArray.push(new DamageTick(-amt, {x: 155, y: 390}));
  }
}


const lifespanArray = [];

class DamageTick {
  constructor(amt, pos = {x: 0, y: 0}) {
    this.pos = pos;
    this.amt = amt;
    this.lifespan = 100;
  }

  tick() {
    this.lifespan--;
  }
}

var transitioning = false;

function DrawCards() {
  Hand = [];
  for (let i = 0; i < 4; i++) {
    Hand.push(new Card(["strike","defend"][Math.round(Math.random())], {x: i * 200, y: 0}));
  }
}

DrawCards();

var Turn = 0;
var slimeXPos = 825;
var slimeXDraw = 825;

function RestartGame() {
  GameEnemy.hp = 50;
  GamePlayer.hp = 50;
  Turn = 0;
  CardsUsedThisTurn = 0;
  Hand = [];
  DrawCards();
  transitioning = false;
  tickKey = setInterval(Tick, 16.67);
}