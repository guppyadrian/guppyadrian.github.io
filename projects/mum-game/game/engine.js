var oldTextures = false;

var Lib = {
  imgLib: {},
  add: function(name) {
    if (!(name in this.imgLib)) {
      this.imgLib[name] = new Image();
      this.imgLib[name].src = "./textures/" + (oldTextures?"old/":"") + name + ".png";
    }
    return this.imgLib[name];
  },

  update: function() {
    oldTextures = !oldTextures;
    for (const tex in this.imgLib) {
      this.imgLib[tex].src = "./textures/" + (oldTextures?"old/":"") + tex + ".png";
    }
  }

};

const Keys = {};


const Cam = {x: 0, y: 0, z: 1};
const camXCenter = (canvas.width - canvas.height) / 2;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
function draw(img, pos) {
  ctx.drawImage(img, Math.floor((pos.x - Cam.x) * Cam.z) + camXCenter, Math.floor((pos.y - Cam.y) * Cam.z), Math.ceil(img.width * Cam.z), 2 + Math.ceil(img.height * Cam.z));
}

addEventListener("keydown", key => {
  Keys[key.key] = true;
  if (key.key == "p")
    ctx.imageSmoothingEnabled = !ctx.imageSmoothingEnabled;
});

addEventListener("keyup", key => {
  Keys[key.key] = false;
});