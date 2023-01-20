
const playerImg = Lib.add("ironclad");



var xOffsetOld = 0;


const strike = new Card(Lib.add("strike"));
strike.pos.y = 600;

function Tick() {

  //offset for bg and players
  const xOffset = (MousePos.x - canvas.width / 2) / 25.6;
  const yOffset = (MousePos.y - canvas.height / 2) / 14.4;
  slimeXDraw += (slimeXPos - slimeXDraw) / 5;

  //easing
  xOffsetOld += (xOffset - xOffsetOld) / 8;
  strike.draw.y += (strike.pos.y - strike.draw.y) / 10;

  for (const cardPos in Hand) {
    card = Hand[cardPos];
    if (card.startRot) {
      card.ticker += 0.3;
      card.rot += card.ticker;
      card.pos.x += card.ticker * 3;
      card.pos.y += card.ticker;
    }

    card.draw.y += (card.pos.y - card.draw.y) / 7;
    card.draw.x += (card.pos.x - card.draw.x) / 7;
    if ((card.pos.y == 500 || card.pos.y == 600) && MousePos.x > card.pos.x && MousePos.x < card.pos.x + 169 && MousePos.y > 615)
      card.pos.y = 500;
    else if (card.pos.y == 500 || card.pos.y == 600)
      card.pos.y = 600;
  }

  DrawFrame();
}

tickKey = setInterval(Tick, 16.67)


function endTurn() {
  if (transitioning)
    return;
  transitioning = true;
  Hand = [];
  CardsUsedThisTurn--;
  slimeXPos = 725;
  setTimeout(() => {
    slimeXPos = 825;
    Damage(8 + Turn++, 0);
    if (GamePlayer.hp <= 0) {
      ctx.fillStyle = "red";
      ctx.font = "60px Arial";
      clearInterval(tickKey);
      DrawFrame();
      ctx.fillText("You Fell Asleep!", 300, 350);
      ctx.fillText("Restarting...", 335, 420);
      setTimeout(() => {
        RestartGame();
      }, 4000)
      return;
    }
    setTimeout(() => {
      GamePlayer.hp = Math.min(GamePlayer.maxHp, GamePlayer.hp + 10);
      lifespanArray.push(new DamageTick(10, { x: 155, y: 390 }));
      DrawCards();
      transitioning = false;
    }, 750);

  }, 300);


}