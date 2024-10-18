CreateWorld(0);
var goingDown = false;
camX = 435;
camY = -60;

function IntroSequence() {
  myCanvas.style.width = '100%';
  myCanvas.style.height = '100%';
  myCanvas.height = window.innerHeight;
  myCanvas.width = window.innerWidth;
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  camZ = myCanvas.width / 700;
  startGameButton.style.top = myCanvas.height - 150;
  startGameButton.style.left = myCanvas.width / 2 - 200;
  rodrickWrapper.style.left = myCanvas.width / 2 - 300;
  rodrickWrapper.style.top = myCanvas.height / 2 - 250;

  if (goingDown) {
    camY += 1;
    camX -= 0.2;
    if (camY > -60) goingDown = false;
  } else {
    camY -= 1;
    camX += 0.2;
    if (camY < -1800) goingDown = true;
  }
  
  const ww = (myCanvas.width / 2) / (camZ);
  const hh = (myCanvas.height / 2) / (camZ);
  for (const blk of world) {
    blk.updateSprite();
    if (blk.type === 'anim') {
      AddDrawQueue('anim', blk);
    } else {
      AddDrawQueue('block', blk);
    }
    
  }
  AddDrawQueue('plyr', Player);
  DrawFrame();

  curSong = 'mainTheme';
  if (curSong in songList) { //if song is added
    if (songList[curSong].volume < 0.1) {
      songList[curSong].volume += 0.01;
    }
    if (songList[curSong].paused) {
      songList[curSong].play();
    }
    if (prevSong !== 'none') {
      if (songList[prevSong].volume >= 0.01) {
        songList[prevSong].volume -= 0.01;
      } else if (!(songList[prevSong].paused)) {
        songList[prevSong].pause();
      }
    }
  } else { //if song not added add the song
    songList[curSong] = new Audio('music/' + curSong + '.mp3');
    songList[curSong].loop = true;
    songList[curSong].volume = 0;
    songList[curSong].play();
  }

  
}
var introInterval = setInterval(IntroSequence, 25);
function StartTheGame() {
  rodrickSign.hidden = true;
  curSong = 'grass1';
  prevSong = 'mainTheme';
  startGameButton.hidden = true;
  clearInterval(introInterval);
  setInterval(Tick, 25);
  
}
addEventListener('keydown', ENTERSTART);
function ENTERSTART(EventKey) {
  if (EventKey.key === 'Enter')
    StartTheGame();
  removeEventListener('keydown', ENTERSTART);
}