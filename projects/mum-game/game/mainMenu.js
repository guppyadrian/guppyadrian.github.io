var MousePos = {x: 0, y: 0};
const menuDrawList = [
  ["Sky", 0],
  ["BGMountainsLayer3", 2],
  ["BGMountainsLayer2", 3],
  ["BGMountainsLayer1", 4],
  ["Fog", 8],
  ["Sun", 0.5],
  ["Clouds", 2.5],
  ["Grass", 7],
  ["Mountain", 6],
  ["Trees", 7],
  ["BigTree", 15]
]

var menuIntervalID;
const playButton = {
  img: Lib.add("menu/PlayMUM"),
  pos: {x: 750, y: 25}
};
const aboutButton = {
  img: Lib.add("menu/AboutMUM"),
  pos: {x: 750, y: 300}
};


var panX = 0;
function MainMenuTick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const leMouse = (MousePos.x - canvas.width / 2) / 200;
  panX += (leMouse - panX) / 25;

  ctx.drawImage(Lib.add("menu/JermaMum"), 0, -150, canvas.width, canvas.height - 300);
  
  for (const imgPath of menuDrawList) {
    ctx.drawImage(Lib.add("menu/" + imgPath[0] + "Mum"), panX * imgPath[1] - 75, -75, canvas.width * 1.1, canvas.height * 1.1);
  }
  ctx.drawImage(Lib.add("menu/Mum"), 0, 0, canvas.width, canvas.height);

  ctx.drawImage(playButton.img, playButton.pos.x, playButton.pos.y);
  ctx.drawImage(aboutButton.img, aboutButton.pos.x, aboutButton.pos.y);
}

addEventListener("mousemove", mouse => {
  const rect = canvas.getBoundingClientRect();
  MousePos.x = mouse.clientX - rect.left;
  MousePos.y = mouse.clientY - rect.top;
});
addEventListener("mousedown", menuMouseDownEvent);

function menuMouseDownEvent() {
  if (MousePos.x > playButton.pos.x && MousePos.x < playButton.pos.x + playButton.img.width) {
    if (MousePos.y > playButton.pos.y && MousePos.y < playButton.pos.y + playButton.img.height) {
      clearInterval(menuIntervalID);
      removeEventListener("mousedown", menuMouseDownEvent);
      setInterval(Tick, 16.67);
    }
  }
  
}

menuIntervalID = setInterval(MainMenuTick, 16.67);