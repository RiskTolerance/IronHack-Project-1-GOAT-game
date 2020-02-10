let screenWidth = 480;
let screenHeight = 640;

let game;
window.onload = function(){
    let config = {
        type: Phaser.AUTO,
        width: screenWidth,
        height: screenHeight,
        parent: 'phaser-game',
        scene: [ SceneTitle, SceneMain ]
        };
        game = new Phaser.Game(config);
}

    game = new Phaser.Game(config);