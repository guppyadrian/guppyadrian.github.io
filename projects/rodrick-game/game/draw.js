function addImage(img) {
  if (img in images) return;
  images[img] = new Image();
  images[img].src = img;
}

addImage(playerImg);

function AddDrawQueue(type, obj) {
  switch(type) {
    case 'text':
      drawTextQueue.push({
        x: obj.x,
        y: obj.y,
        text: obj.text,
        size: obj.size,
        gui: obj.gui,
        top: obj.override, 
        alignl: obj.left
      });
      break;
    case 'block':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img,
        opacity: obj.opacity,
        anim: false,
        size: obj.size
        //gui: obj.tags.includes('gui')
      });
      break;
    case 'anim':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img,
        opacity: obj.opacity,
        anim: true,
        size: obj.size,
        animP: obj.getProperties(),
        gui: obj.tags.includes('gui')
      });
      break;
    case 'plyr':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img
      });
      break;
  }
}

function DrawFrame() {
  if (WorldId === 0)
    ctx.fillStyle = 'LightSkyBlue';
  else
    ctx.fillStyle = 'rgb(35, 35, 35)';
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  ctx.fillStyle = 'black';

  shakeX = Math.floor(shakeX * -8.5) / 10;
  shakeY = Math.floor(shakeY * -8.5) / 10;
  if (camZ < 0.2)
    camZ = 0.2;
  ctx.imageSmoothingEnabled = false;
  var guiQueue = [];
  var topDrawQueue = [];
  ctx.drawImage(bg, (camX / -3 - 700) * camZ, (camY / -3 - 700) * camZ, bg.width * camZ * 1.7, bg.height * camZ * 1.7);
  for (const dq of drawQueue) {
    var camXI = camX;
    var camYI = camY;
    if (!(dq.img in images)) {
      images[dq.img] = new Image();
      images[dq.img].src = dq.img;
    }
    if (dq.gui) {
      guiQueue.push(dq);
      continue;
    }
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;
    const sc = ((dq.size === undefined) ? 30 : dq.size) / 30;
    

    

    if (dq.anim) {
      ctx.drawImage(
        images[dq.img],
        dq.animP[0],
        dq.animP[1],
        dq.animP[2],
        dq.animP[3],
        (dq.x - camXI - shakeX) * camZ,
        (dq.y - camYI - shakeY) * camZ,
        dq.animP[2] * camZ * dq.size,
        dq.animP[3] * camZ * dq.size
      );
    } else {
      const is = images[dq.img];
      try {
        ctx.drawImage(is, (dq.x - camXI - shakeX) * (camZ), (dq.y - camYI - shakeY) * (camZ), is.width * camZ * sc, is.height * camZ * sc);
      }
      catch {
        console.log(dq.img)
      }
    }
    ctx.globalAlpha = 1;
  }
  
  for (const dq of drawTextQueue) {
    if (dq.top) {
      topDrawQueue.push(dq);
      continue;
    }
    if (dq.alignl) 
    ctx.textAlign = 'left';
  else
    ctx.textAlign = 'center';
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;

    if (dq.gui) {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, dq.x, dq.y);
    } else {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, (dq.x - camX - shakeX) * camZ, (dq.y - camY - shakeY) * camZ);
    }

    //ctx.globalAlpha = 1;
  }
  for (const dq of guiQueue) {

    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;
    const sc = ((dq.size === undefined) ? 30 : dq.size) / 30;
    
    const is = images[dq.img];
      try {
      ctx.drawImage(is, (dq.x - shakeX) * (camZ), (dq.y - shakeY) * (camZ), is.width * camZ * sc, is.height * camZ * sc);
      }
      catch(err) {
        console.log(`image link: ${dq.img}, image: ${is}`);
      }
  }
  
  for (const dq of topDrawQueue) {
    if (dq.alignl)
  ctx.textAlign = 'left';
  else 
  ctx.textAlign = 'center';
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;

    if (dq.gui) {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, dq.x * camZ, dq.y * camZ);
    } else {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, (dq.x - camX - shakeX) * camZ, (dq.y - camY - shakeY) * camZ);
    }
  }
  drawQueue = [];
  drawTextQueue = [];
  ctx.font = '12px MinecraftRegular';
  ctx.textAlign = 'left';
  
  //ctx.fillText(`Timer: ${Math.round(Timer / 8) / 5}`, 0, 20);
  //ctx.fillText(`X: ${Player.x} Y: ${Player.y}`, 0, 33);
  //ctx.fillText(`CX:${CheckPoint[0]} CY:${CheckPoint[1]}`, 0, 46);
}