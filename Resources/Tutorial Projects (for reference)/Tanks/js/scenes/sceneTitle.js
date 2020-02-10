class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    }
    preload() {
        //load images or sounds
        //this.load.image('variable','path');
        this.load.image('start','/images/UI/buttonStart.png');
        this.load.image('title', '/images/UI/title.png');
    }
    create() {
        //define objects
        console.log('Ready!')

        let start = this.add.image(screenWidth/2, screenHeight/1.6, 'start');
        start.setInteractive();
        start.on('pointerdown', this.startGame, this);

        let title = this.add.image(screenWidth/2, screenHeight/4, 'title')
    }

    startGame() {
        this.scene.start('SceneMain');
    }

    update() {
        //game loop
    }
}