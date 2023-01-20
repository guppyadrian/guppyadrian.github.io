var Lib = {
  imgLib: {},
  add: function(name) {
    if (!(name in this.imgLib)) {
      this.imgLib[name] = new Image();
      this.imgLib[name].src = "/textures/" + name + ".webp";
    }
    return this.imgLib[name];
  },

};

var MousePos = {x: 0, y: 0};

canvas.addEventListener("mousemove", Event => {
  const rect = canvas.getBoundingClientRect();
  MousePos.x = Event.clientX - rect.left;
  MousePos.y = Event.clientY - rect.top;
});
canvas.addEventListener("mousedown", Event => {
  const rect = canvas.getBoundingClientRect();
  MousePos.x = Event.clientX - rect.left;
  MousePos.y = Event.clientY - rect.top;

  for (const cardPos in Hand) {
    const card = Hand[cardPos];


    
    if (!card.used && MousePos.x > card.pos.x && MousePos.x < card.pos.x + 169 && MousePos.y > 615) {
      if (GamePlayer.hp > 3 + CardsUsedThisTurn * 2) {
        GamePlayer.hp -= 3 + CardsUsedThisTurn * 2;
        CardsUsedThisTurn++;
      } else {
        lifespanArray.push(new DamageTick("Not Enough Sleep", {x: 200, y: 450}));
        return false;
      }
      card.pos = {x: canvas.width / 2 - 85, y: canvas.height / 2 - 100};
      card.used = true;
      
      setTimeout(() => {
        Damage(card.dmg, 1);
        card.startRot = true;
        card.ticker += 1;
      }, 500);
    }
  }
});

function cardFling() {
  
}


const Cam = {x: 0, y: 0, z: 1};
const ctx = canvas.getContext('2d');
function draw(img, pos = {x: 0, y: 0}, sizeR, rotation = 0) {
  var size = sizeR;
  if (size === undefined)
    size = {w: img.width, h: img.height};
  ctx.translate(pos.x + size.w / 2, pos.y + size.h / 2);
  ctx.rotate(rotation * Math.PI / 180);
  if (size == undefined)
    ctx.drawImage(img, -size.w / 2 - Cam.x * Cam.z, -size.h / 2 - Cam.y * Cam.z);
  else
    ctx.drawImage(img, -size.w / 2 - Cam.x * Cam.z, -size.h / 2 - Cam.y * Cam.z, size.w, size.h);
  ctx.resetTransform();
}
