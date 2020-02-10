let game;
window.onload = function(){
    let config = {
        type: Phaser.AUTO,
        width: 720,
        height: 480,
        parent: 'phaser-game',
        scene: [ SceneTitle, SceneMain ]
        };
        game = new Phaser.Game(config);
}

    game = new Phaser.Game(config);