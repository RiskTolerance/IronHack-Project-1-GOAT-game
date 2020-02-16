let endScreen;
let noSurvivors;
let playAgain;
let mainMenu;
let cultistSurvived;
let goatSurvived;
let cultist;
let goat;
let outcome;
let sorry;
let duoWinMusic;
let soloWinMusic;
let lossMusic;

class ScenePost extends Phaser.Scene {
    constructor() {
        super({
            key: 'ScenePost',
            pack: {
                files: [
                    {
                        type: 'image',
                        key: 'loadingOverlay',
                        url: 'images/UI/Loading Screen/LoadingScreen.png'
                    }
                ]
            }
        });
    }

    init(data){
        outcome = data.id;
    }

    preload() {
        //loading bar

        loadingBar = this.add.graphics();
        overlay = this.add.image(640, 360, 'loadingOverlay');

        this.load.on('progress', function (value) {
            console.log(value);
            loadingBar.clear();
            loadingBar.fillStyle(0xff0000);
            loadingBar.fillRect(200,100,900 * value,420);
        });
                    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
            
        this.load.on('complete', function () {
            console.log('complete');
            loadingBar.destroy();
            overlay.destroy();
        });

        //assets
        this.load.image('endScreen', 'images/UI/Post Screen/PostScreen.png')
        this.load.image('noSurvivors', 'images/UI/Post Screen/NoSurvivors.png')
        this.load.image('cultistSurvived', 'images/UI/Post Screen/CultistSurvived.png')
        this.load.image('goatSurvived', 'images/UI/Post Screen/GoatSurvived.png')
        this.load.image('mainMenu', 'images/UI/Post Screen/MainMenu.png')
        this.load.image('playAgain', 'images/UI/Post Screen/PlayAgain.png')
        this.load.image('sorry', 'images/UI/Post Screen/tempText.png')
        this.load.spritesheet('cultistRun', 'images/Characters/cultist/cultist run_animation 12frames 40px.png', {frameWidth: 40, frameHeight: 40});
        this.load.spritesheet('goatRun', 'images/Characters/goat/goat walk 6frames 40px.png', {frameWidth: 40, frameHeight: 40});

        //music
        this.load.audio('duoWinMusic', 'audio/Background Music/ES_The Adventure Begins - Philip Ayers.mp3');
        this.load.audio('soloWinMusic', 'audio/Background Music/ES_Blind Faith - Phoenix Tail.mp3');
        this.load.audio('lossMusic', 'audio/Background Music/ES_Barrel - Christian Andersen.mp3');
    }
    create() {
        //define objects
        endScreen = this.add.image(640, 360, 'endScreen');
        // playAgain = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'playAgain').setInteractive().setTint(0xff0000);
        // mainMenu = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 75, 'mainMenu').setInteractive().setTint(0xff0000);
        sorry = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 75, 'sorry').setInteractive().setTint(0xffffff);
        noSurvivors = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'noSurvivors').setVisible(false);
        goatSurvived = this.add.image(this.cameras.main.centerX + 300, this.cameras.main.centerY - 150, 'goatSurvived').setVisible(false);
        cultistSurvived = this.add.image(this.cameras.main.centerX - 300, this.cameras.main.centerY - 150, 'cultistSurvived').setVisible(false);
        soloWinMusic = this.sound.add('soloWinMusic');
        duoWinMusic = this.sound.add('duoWinMusic');
        lossMusic = this.sound.add('lossMusic');
        
        this.anims.create({
            key: 'rightRun',
            frames: this.anims.generateFrameNumbers('cultistRun', { start: 6, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'goatRightRun',
            frames: this.anims.generateFrameNumbers('goatRun', { start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        goat = this.add.sprite(this.cameras.main.centerX + 300, this.cameras.main.centerY + 180, 'goatRun', 3).setVisible(false);
        cultist = this.add.sprite(this.cameras.main.centerX - 300, this.cameras.main.centerY + 180, 'cultistRun', 6).setVisible(false);

        //play button actions

    //     playAgain.on('pointerout', ()=>{
    //         playAgain.setTint(0xff0000);
    //     })

    //     playAgain.on('pointerover', ()=>{
    //         playAgain.setTint(0xffffff);
    //     })

    //     playAgain.on('pointerup', ()=>{
    //         //this.menuMusic.pause(musicConfig);
    //         this.scene.start('SceneGame'),
    //         this.scene.stop('ScenePost')
    //     }, this);
        
    //     //story button actions

    //     //main menu button actions
    //     mainMenu.on('pointerout', ()=>{
    //         mainMenu.setTint(0xff0000);
    //     })

    //     mainMenu.on('pointerover', ()=>{
    //         mainMenu.setTint(0xffffff);
    //     })

    //     mainMenu.on('pointerup', ()=>{
    //         //this.menuMusic.pause(musicConfig);
    //         this.scene.start('SceneMenu'),
    //         this.scene.stop('ScenePost')
    //     }, this);
    
    if (outcome === 3) {
        //both win
        goatSurvived.setVisible(true);
        cultistSurvived.setVisible(true);
        goat.anims.play('goatRightRun', true);
        cultist.anims.play('rightRun', true);
        duoWinMusic.play();
    } else if (outcome === 2) {
        //goat wins
        goatSurvived.setVisible(true);
        goat.anims.play('goatRightRun', true);
        soloWinMusic.play();
    } else if (outcome === 1) {
        //cultist wins
        cultistSurvived.setVisible(true);
        cultist.anims.play('rightRun', true);
        soloWinMusic.play();
    } else {
        noSurvivors.setVisible(true);
        lossMusic.play();
    }

    }

    update() {
        //game loop
    }
}