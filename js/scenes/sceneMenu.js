let playButton;
let storyButton;
let controlsButton;
let backButton;
let menuMusic;
let musicConfig;
let storyScreen;
let controlsScreen;
let backButtonWhite;
let loadingBar;
let overlay;
//let backButtonOrange;

class SceneMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'SceneMenu',
            pack: {
                files: [
                    {
                        type: 'image',
                        key: 'loadingOverlay',
                        url: '/images/UI/Loading Screen/LoadingScreen.png'
                    }
                ]
            }
        });
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
        this.load.image('MenuBG','images/UI/Main Menu/MenuBG.png');
        this.load.image('GOAT','images/UI/Main Menu/GOAT.png');
        this.load.image('controlsBlack','images/UI/Main Menu/controlsBlack.png');
        this.load.image('controlsWhite','images/UI/Main Menu/controlsWhite.png');
        this.load.image('playBlack','images/UI/Main Menu/playBlack.png');
        this.load.image('playWhite','images/UI/Main Menu/playWhite.png');
        this.load.image('storyBlack','images/UI/Main Menu/storyBlack.png');
        this.load.image('storyWhite','images/UI/Main Menu/storyWhite.png');
        this.load.image('controlsScreen','images/UI/Controls/ControlsV2.png');
        this.load.image('storyScreen','images/UI/Story/StoryV2.png');
        this.load.image('backButtonWhite','/images/UI/Controls/BackWhite.png');
        //music
        this.load.audio('menuMusic', 'audio/Background Music/ES_The Dominion - Bonnie Grace.mp3');
    }
    create() {
        //define objects
        console.log('Ready!')
        this.add.image(640, 360, 'MenuBG');
        this.add.image(320, 180, 'GOAT');
        playButton = this.add.image(320, 380, 'playWhite').setInteractive().setTint(0x000000);
        storyButton = this.add.image(320, 480, 'storyWhite').setInteractive().setTint(0x000000);
        controlsButton = this.add.image(320, 575, 'controlsWhite').setInteractive().setTint(0x000000);
        storyScreen = this.add.image(640, 360, 'storyScreen').setVisible(false);
        controlsScreen = this.add.image(640, 360, 'controlsScreen').setVisible(false);
        backButtonWhite = this.add.image(100, 100, 'backButtonWhite').setInteractive().setActive(false).setTint(0xFF0000).setVisible(false);
        //backButtonOrange = this.add.image(100, 100, 'backButtonOrange').setInteractive().setActive(false).setVisible(false);

        //play button actions
        playButton.on('pointerout', ()=>{
            playButton.setTint(0x000000);
        })

        playButton.on('pointerover', ()=>{
            playButton.setTint(0xffffff);
        })

        playButton.on('pointerup', ()=>{
            this.menuMusic.stop(musicConfig);
            this.scene.start('SceneGame');
            this.scene.stop('SceneMenu');
        }, this);
        
        //story button actions

        storyButton.on('pointerover', ()=>{
            storyButton.setTint(0xffffff);
        });

        storyButton.on('pointerout', ()=>{
            storyButton.setTint(0x000000);
        });

        storyButton.on('pointerup', ()=>{
            storyScreen.setVisible(true);
            backButtonWhite.setActive(true).setVisible(true);
        });

        //controls button actions

        controlsButton.on('pointerover', ()=>{
            controlsButton.setTint(0xffffff);
        });

        controlsButton.on('pointerout', ()=>{
            controlsButton.setTint(0x000000);
        });

        controlsButton.on('pointerup', ()=>{
            controlsScreen.setVisible(true);
            backButtonWhite.setActive(true).setVisible(true);
            //backButtonOrange.setActive(true).setVisible(true);
        });

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

        backButtonWhite.on('pointerover', ()=>{
            backButtonWhite.setTint(0xffffff);
        })

        backButtonWhite.on('pointerout', ()=>{
            backButtonWhite.setTint(0xff0000);
        })

        backButtonWhite.on('pointerup', ()=>{
            controlsScreen.setVisible(false);
            storyScreen.setVisible(false);
            backButtonWhite.setActive(false).setVisible(false);
            //backButtonOrange.setActive(false).setVisible(false);
            
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