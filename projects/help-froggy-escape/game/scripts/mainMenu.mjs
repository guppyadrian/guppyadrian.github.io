import { Scene } from 'phaser';

class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('BackgroundForest', './assets/textures/BackgroundForest.png');
        this.load.image('StartButton', './assets/textures/StartButton.png');
        this.load.image('Title', './assets/textures/Title.png');
    }

    create() {
        this.add.image(0, 0, 'BackgroundForest').setOrigin(0, 0);
        this.add.image(160, 30, 'Title');
        const startButton = this.add.image(160, 120, 'StartButton').setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
        });
        startButton.on('pointerout', () => {
            startButton.setScale(1.0);
        });
    }
}

export default MainMenu