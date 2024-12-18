let Level = {size: 4, data: ["w","w","w","w","w",0,0,"w","w",0,"P","w","w","w","w","w"],plates:{}};
var rect = canvas.getBoundingClientRect();

const Cursor = {x: 0, y: 0};

const boxBar = [
  {l: "w", i: "wall"},
  {l: 0, i: "old/tile"},
  {l: "P", i: "player"},
  {l: "c", i: "copper"},
  {l: "d", i: "dirt"},
  {l: "p", i: "old/pplate"}
];

var boxSelected = boxBar[0];

function changeSize() {
  const size = parseInt(prompt("Level Size?", 10));
  if (typeof size !== "number") return;
  if (size <= 0) return;
  if (Level.size === size) return;

  function toPos(g, s) {
    return {x: g % s, y: Math.floor(g / s)};
  }
  function toGrid(p, s) {
    return p.x + p.y * s;
  }

  
  const newLevelData = new Array(size ** 2).fill(0);
  for (let i = 0; i < Level.size ** 2; i++) {

    newLevelData[toGrid(toPos(i, Level.size), size)] = Level.data[i];
  }

  Level.size = size;
  Level.data = newLevelData;
}

function letterToTexture(letter) {
  switch(letter) {
    case "w":
      return "old/wall";
    case 0:
      return "old/tile";
    case "d":
      return "old/dirt";
    case "c":
      return "old/copper";
    case "P":
      return "old/player";
    case "p":
      return "old/pplate";
    default:
      return "old/wall";
  }
}

function tick() {
  rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const i in Level.data) {
    const tex = Lib.add(letterToTexture(Level.data[i]));
    draw(tex, {x: (i % Level.size) * 32, y: Math.floor(i / Level.size) * 32});
  }

  for (const i in Level.plates) {
    const tex = Lib.add("old/pplate");
    draw(tex, {x: (i % Level.size) * 32, y: Math.floor(i / Level.size) * 32});
  }

  draw(Lib.add("cursor"), Cursor);

  ctx.clearRect(Level.size * 32, 0, canvas.width, canvas.height);
  ctx.clearRect(0, Level.size * 32, canvas.width, canvas.height);
  
  for (const i in boxBar) {
    draw(Lib.add(boxBar[i].i), {x: i * 32, y: canvas.height - 32});
  }
}

setInterval(tick, 16.67);

addEventListener("mousemove", Event => {
  const x = Event.clientX - rect.left;
  const y = Event.clientY - rect.top;

  Cursor.x = Math.floor(x / 32) * 32;
  Cursor.y = Math.floor(y / 32) * 32;
});

addEventListener("mousedown", Event => {
  const x = Math.floor((Event.clientX - rect.left) / 32);
  const y = Math.floor((Event.clientY - rect.top) / 32);

  if (y === 19 && x < boxBar.length) {
    console.log(x)
    boxSelected = boxBar[x];
  }
  
  if (x < 0 || x >= Level.size) return;
  if (y < 0 || y >= Level.size) return;

  if (boxSelected.l === "p") {

    Level.plates[x + y * Level.size] = [0,false];
    
  } else if (boxSelected.l !== "p" && (x + y * Level.size) in Level.plates) {

    delete Level.plates[x + y * Level.size];

  } else {
    
    const replacedPos = x + y * Level.size;
    Level.data[replacedPos] = boxSelected.l;
    
  }
});

function exportLevel() {
  const levelCode = {size: Level.size, data: Level.data.join(""), plates: Level.plates};

    //navigator.clipboard.writeText(JSON.stringify(levelCode));
   // alert("Copied to clipboard!");

    var newWindow = window.open();
    newWindow.document.write(JSON.stringify(levelCode));
  
}