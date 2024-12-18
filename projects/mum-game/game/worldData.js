const Levels = Array(121);

function createWorld(code) {
  if (code === undefined || code === null) {
    Level.size = 5;
    Level.data = Array(25).fill(0);
    return;
  }

  Level.plates = [];
  if ("plates" in code)
    Level.plates = code.plates;
  Level.size = code.size;
  Level.data = Array(code.size ** 2).fill(0);
  for (const i in code.data) {

    switch(code.data[i]) {
      case "w":
        new Box(GtoP(i), false, "wall");
        break;
      case "d":
        new Box(GtoP(i), true, "dirt");
        break;
      case "c":
        new Box(GtoP(i), true, "copper");
        break;
      case "P":
        Player.pos = GtoP(i);
        break;
      default:
        break;
    }
    
  }
}



Levels[115] = {"size":6,"data":"wwwwwww0w00ww0wd0ww00d0ww000Pwwwwwww0000000000000000000000000000","plates":{"16":[1,false],"20":[7,false]}};
Levels[104] = {size: 5, data: "wwwwww000ww000ww0P0ww0www"};