let playButton;
let storyButton;
let controlsButton;
let backButton;
let menuMusic;
let musicConfig;
let storyScreen;
let controlsScreen;
let backButtonWhite;
let backButtonOrange;

class SceneMenu extends Phaser.Scene {
    constructor() {
        super(SceneMenu);
    }
    preload() {
        this.load.image('MenuBG','images/UI/Main Menu/MenuBG.png');
        this.load.image('GOAT','images/UI/Main Menu/GOAT.png');
        this.load.image('controlsBlack','images/UI/Main Menu/controlsBlack.png');
        this.load.image('controlsWhite','images/UI/Main Menu/controlsWhite.png');
        this.load.image('playBlack','images/UI/Main Menu/playBlack.png');
        this.load.image('playWhite','images/UI/Main Menu/playWhite.png');
        this.load.image('storyBlack','images/UI/Main Menu/storyBlack.png');
        this.load.image('storyWhite','images/UI/Main Menu/storyWhite.png');
        this.load.image('controlsScreen','images/UI/Controls/Controls.png');
        this.load.image('storyScreen','images/UI/Story/Story.png');
        this.load.image('backButtonOrange','images/UI/Controls/BackOrange.png');
        this.load.image('backButtonWhite','images/UI/Controls/BackWhite.png');

        this.load.audio('menuMusic', 'audio/Background Music/ES_The Dominion - Bonnie Grace.mp3');
    }
    create() {
        //define objects
        console.log('Ready!')
        this.add.image(640, 360, 'MenuBG');
        this.add.image(320, 180, 'GOAT');
        this.add.image(320, 380, 'playWhite');
        this.add.image(320, 480, 'storyWhite');
        this.add.image(320, 575, 'controlsWhite');
        playButton = this.add.image(320, 380, 'playBlack');
        storyButton = this.add.image(320, 480, 'storyBlack');
        controlsButton = this.add.image(320, 575, 'controlsBlack');
        storyScreen = this.add.image(640, 360, 'storyScreen');
        controlsScreen = this.add.image(640, 360, 'controlsScreen');
        backButtonWhite = this.add.image(100, 100, 'backButtonWhite');
        backButtonOrange = this.add.image(100, 100, 'backButtonOrange');

        storyScreen.setVisible(false);
        controlsScreen.setVisible(false);
        backButtonWhite.setActive(false).setVisible(false);
        backButtonOrange.setActive(false).setVisible(false);

        //play button actions
        playButton.setInteractive();

        playButton.on('pointerover', ()=>{
            playButton.setAlpha(0);
        })

        playButton.on('pointerout', ()=>{
            playButton.setAlpha(1);
        })

        playButton.on('pointerup', ()=>{
            this.menuMusic.pause(musicConfig);
            this.scene.start('SceneGame');
        })
        
        //story button actions
        storyButton.setInteractive();

        storyButton.on('pointerover', ()=>{
            storyButton.setAlpha(0);
        })

        storyButton.on('pointerout', ()=>{
            storyButton.setAlpha(1);
        })

        storyButton.on('pointerup', ()=>{
            storyScreen.setVisible(true);
            backButtonWhite.setActive(true).setVisible(true);
            backButtonOrange.setActive(true).setVisible(true);
        })

        //controls button actions
        controlsButton.setInteractive();

        controlsButton.on('pointerover', ()=>{
            controlsButton.setAlpha(0);
        })

        controlsButton.on('pointerout', ()=>{
            controlsButton.setAlpha(1);
        })

        controlsButton.on('pointerup', ()=>{
            controlsScreen.setVisible(true);
            backButtonWhite.setActive(true).setVisible(true);
            backButtonOrange.setActive(true).setVisible(true);
            
        })

        this.menuMusic = this.sound.add('menuMusic') 
        this.musicConfig = {
            mute: false,
            volume: 0.4,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        //back button actions
        backButtonOrange.setInteractive();

        backButtonOrange.on('pointerover', ()=>{
            backButtonOrange.setAlpha(0);
        })

        backButtonOrange.on('pointerout', ()=>{
            backButtonOrange.setAlpha(1);
        })

        backButtonOrange.on('pointerup', ()=>{
            controlsScreen.setVisible(false);
            storyScreen.setVisible(false);
            backButtonWhite.setActive(false).setVisible(false);
            backButtonOrange.setActive(false).setVisible(false);
            
        })

        this.menuMusic = this.sound.add('menuMusic') 
        this.musicConfig = {
            mute: false,
            volume: 0.4,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        
        //play game music
        this.menuMusic.play(musicConfig);
    }
    update() {

    }
}