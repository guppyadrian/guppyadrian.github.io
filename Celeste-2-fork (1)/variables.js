//variables
var world = [];
var worldP = [];
var worldT = [];
var ctx = myCanvas.getContext('2d');
var images = {};
var drawQueue = [];
var drawTextQueue = [];
const playerImg = 'textures/player.png';
const redPlayerImg = 'textures/redplayer.png';
var Timer = 0;
var WorldId = 0;
var CheckPoint = [150, 60];
var DashTutorial = false;


var curSong = 'grass1';
var prevSong = 'none';
var songList = {};
var LevelWon = false;
var bg = new Image();
bg.src = 'textures/sky.png';

//draw
var shakeX = 0;
var shakeY = 0;
var camX = 0;
var camY = 0;
var camZ = 1;

function colliding(x, y, w, h, x2, y2, w2, h2) {
  if (x < x2 + w2 && x + w > x2) {
    if (y < y2 + h2 && y + h > y2) {
      return true;
    }
  }
  return false;
}