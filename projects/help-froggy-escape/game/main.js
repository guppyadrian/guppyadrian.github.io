import { Scene, AUTO, Scale, Game } from 'phaser';
import MainMenu from './scripts/mainMenu.mjs';
import GameScene from './scripts/game.mjs';

class MyScene extends Scene {
    constructor() {
        super("MyScene");
    }

    preload() {
        this.load.image('BackgroundForest', './assets/textures/BackgroundForest.png');
    }

    create() {
        this.add.image(0, 0, 'BackgroundForest').setOrigin(0, 0);
    }
}

var config = {
    type: AUTO,
    width: 320,
    height: 180,
    scene: [MainMenu, GameScene],
    pixelArt: true,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    }
};

var game = new Game(config);