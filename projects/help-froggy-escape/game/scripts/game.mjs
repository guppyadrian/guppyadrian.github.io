import { Scene, GameObjects, Input, Geom } from 'phaser';


// TODO: Should this be here idk! put it back in the world.mjs file if u can.
const WATER_CHANCE = 0.6;

function isColliding(rectA, rectB) {
    return (
        rectA.right > rectB.left &&
        rectA.left < rectB.right &&
        rectA.bottom > rectB.top &&
        rectA.top < rectB.bottom
    );
}

class Player extends GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key || 'Player');

        this.curTile = 1;
        this.curLog = null;
        this.scene = scene;
        this.setDepth(1);

        scene.add.existing(this);
    }

    update(cursors) {
        if (Input.Keyboard.JustDown(cursors.up)) {
            this.curTile++;
            this.y -= 16; // Move up by one row
            this.scene.addRow(); // Add a new row at the top
            if (this.curLog !== null) {
                this.curLog.player = null;
                this.curLog = null;
            }
        }  
        if (Input.Keyboard.JustDown(cursors.left)) {
            this.x -= 16; // Move left by one tile
        }
        if (Input.Keyboard.JustDown(cursors.right)) {
            this.x += 16; // Move right by one tile
        }
        const tile = this.scene.world[this.curTile];
        if (tile.type === 'WaterRow') {
            this.curLog = this.getCurLog(tile);
            if (this.curLog !== null) {
                this.curLog.player = this;
            }
        }
    }

    getCurLog(tile) {
        for (const log of tile.logs) {
            if (isColliding(this.getBounds(), log.getBounds())) {
                return log;
            }
        }
        this.scene.scene.start('MainMenu');
        return null;
    }
}

class Tile extends GameObjects.Sprite {
    constructor(scene, y, key) {
        super(scene, 0, 180 - y * 16, key);

        this.type = key;
        this.scene = scene;
        this.setOrigin(0, 1);
        this.direction = (y % 2 === 0) ? 1 : -1; // Alternate direction for each row
        this.speed = 250 + Math.random() * 500;

        scene.add.existing(this);

        this.logs = [];
        if (key === 'WaterRow') {
            this.createLog();
            scene.intervals.push(
                setInterval(() => {
                    this.createLog();
                }, this.speed * 8)
            );
        }
    }
    createLog() {
        const log = new Log(this.scene, this.direction, this.y, this.speed, this);
        this.logs.push(log);
    }
}

// needs to come from either right or left, don't have x as input have direction. Tile needs to make a log every so often. Tile has info on log direction
class Log extends GameObjects.Sprite {
    constructor(scene, dir, y, speed, tile) {
        super(scene, (dir === 1 ? -72 : 328), y, 'Log');

        this.scene = scene;
        this.player = null;

        this.setOrigin(0, 1);
        this.setDepth(0);

        scene.add.existing(this);

        scene.intervals.push(
            setInterval(() => {
                this.x += dir * 16;
                if (this.player) {
                    this.player.x += dir * 16;
                }
                if (this.x < -72 || this.x > 328) {
                    this.destroy();
                    tile.logs = tile.logs.filter(log => log !== this);
                }
            }, speed)
        );
    }
}

class GameScene extends Scene {

    cursors;
    player;

    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image('WaterRow', './assets/textures/waterTile.png');
        this.load.image('LandRow', './assets/textures/landTile.png');
        this.load.image('Player', './assets/textures/sprite.png');
        this.load.image('Frog', './assets/textures/Frog.png');
        this.load.image('Log', './assets/textures/Log.png');
        
    }

    create() {
        this.world = [];
        this.intervals = [];

        this.addRow('LandRow'); // Start with a land row at the bottom
        this.addRow('LandRow'); // Add another land row for the player to start on
        for (let i = 0; i < 10; i++) {
            this.addRow();
        }

        this.player = new Player(this, 160, 180 - 16, 'Frog').setOrigin(0.5, 1);
        this.cameras.main.startFollow(this.player, true, 0, 1, 0, 90 - 16);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.events.on('shutdown', this.stopAllIntervals, this);
    }

    update() {
        this.player.update(this.cursors);
        console.log(this.world.length)
    }

    stopAllIntervals() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }

    addRow(rowType) {
        if (rowType === undefined) {
            rowType = Math.random() < WATER_CHANCE ? 'WaterRow' : 'LandRow';
        }

        this.world.push(new Tile(this, this.world.length, rowType));
    }
}

export default GameScene;