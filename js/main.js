let game;
window.onload = function(){
    let config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        pixelArt: true,
        fps: 30,
        parent: 'phaser-game',
        scene: [ SceneMenu, SceneGame, ScenePost ],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 700 },
                debug: false,
            }
        },
        };
        game = new Phaser.Game(config);
};