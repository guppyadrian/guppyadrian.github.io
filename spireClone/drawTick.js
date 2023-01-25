function DrawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  //bottom bar
  draw(Lib.add("wood"), {x: 0, y: 520}, {w: 640, h: 720});
  draw(Lib.add("wood"), {x: 640, y: 150}, {w: 640, h: 720});
  
  draw(Lib.add("forest"), {x: -50 + xOffsetOld, y: -100}, {w: 1280 + 200, h: 720});

  //bottom line
  ctx.fillStyle = "SaddleBrown";
  ctx.fillRect(0, 615, 1280, 10);

  //entitites
  draw(playerImg, {x: 50 + xOffsetOld / 2, y: 375});

  
  
  
  ctx.fillStyle = "white";
  ctx.font = "45px Arial";
  ctx.fillText("Playing a card takes " + (3 + 2 * CardsUsedThisTurn) + " Sleep", 250, 50);
  
  ctx.fillStyle = "darkBlue";
  ctx.fillRect(175 + xOffsetOld / 2, 565, 100, 15);
  ctx.font = "25px Arial";
  
  if (GamePlayer.shield > 0)
    ctx.fillText(GamePlayer.hp + " + " + GamePlayer.shield + " Sleep", 285 + xOffsetOld / 2, 580);
  else
    ctx.fillText(GamePlayer.hp + " Sleep", 285 + xOffsetOld / 2, 580);
  
  ctx.fillStyle = "dodgerBlue";
  ctx.fillRect(175 + xOffsetOld / 2, 565, GamePlayer.hp * 2, 15);
  if (GamePlayer.shield > 0) {
    ctx.fillStyle = "Chartreuse";
    ctx.fillRect(175 + xOffsetOld / 2 + GamePlayer.hp * 2, 565, GamePlayer.shield * 2, 15);
  }
  draw(Lib.add("slime"), {x: slimeXDraw + xOffsetOld / 2, y: 275});
  
  ctx.fillStyle = "red";
  ctx.fillRect(952 + xOffsetOld / 2, 565, 100, 15);
  ctx.fillText(GameEnemy.hp + " HP", 880 + xOffsetOld / 2, 580);
  ctx.fillStyle = "green";
  ctx.fillRect(952 + xOffsetOld / 2, 565, GameEnemy.hp * 2, 15);

  for (const card in Hand) {
    draw(Hand[card].img, Hand[card].draw, {w: 169, h: 218}, Hand[card].rot);
  }

  for (const ticPos in lifespanArray) {
    const tic = lifespanArray[ticPos];
    ctx.font = "75px Arial";
    ctx.globalAlpha = Math.max(((tic.lifespan * 2) - 50) / 100, 0);
    if (typeof tic.amt == "number" && tic.amt >= 0) {
      ctx.fillStyle = 'green';
      ctx.fillText("+" + tic.amt, tic.pos.x, tic.pos.y);
    } else {
      ctx.fillStyle = 'red';
      ctx.fillText(tic.amt, tic.pos.x, tic.pos.y);
    }
    ctx.globalAlpha = 1;
    tic.pos.y -= 1 - (100 - tic.lifespan) / 70;
    if (tic.lifespan-- === 0) {
      lifespanArray.shift();
    }
  }
  
  //draw(strike.img, strike.draw, {w: 169, h: 218});
}