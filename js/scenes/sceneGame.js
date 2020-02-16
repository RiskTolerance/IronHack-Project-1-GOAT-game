let map;
let bg;
let structures;
let terrain;
let player;
let player2;
let demon;
let structuresLayer;
let terrainLayer;
let lastDirectionCult = 1; //track last movement direction to set idle animations
let lastDirectionGoat = 0;
let Cee;
let Emm;
let playerState = 1; //alive = 1, dead = 0
let player2State = 1;
let playerWin = 0; //win =1
let player2Win = 0;
let i = 0.04;
let demonSpeed = -1;
let p1BlinkCooldown = 1;
let p2BlinkCooldown = 1;
let keyboard;
let cultistBlinkNotReady;
let cultistBlinkReady;
let goatBlinkNotReady;
let goatBlinkReady;
let cultistDead;
let goatDead;

class SceneGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'SceneGame',
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

        //tilemaps and tilesets
        this.load.tilemapTiledJSON('map','images/Environment/mapv3.json');
        this.load.image('structuresPNG', 'images/Environment/Structures.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('terrainPNG', 'images/Environment/Terrain.png', {frameWidth: 32, frameHeight: 32});
        //images
        this.load.image('overworldbg','images/Backgrounds/overworld-wgrad.png');
        //blink status indiccators
        this.load.image('CultistBlinkNotReady','images/Characters/status/CultistBlinkNotReady-8.png');
        this.load.image('CultistBlinkReady','images/Characters/status/CultistBlinkReady-8.png');
        this.load.image('GoatBlinkNotReady','images/Characters/status/GoatBlinkNotReady-8.png');
        this.load.image('GoatBlinkReady','images/Characters/status/GoatBlinkReady-8.png');
        this.load.image('CultistDead','images/Characters/status/CultistDead-8.png');
        this.load.image('GoatDead','images/Characters/status/GoatDead-8.png');
        //sprites
        this.load.spritesheet('cultistRun', 'images/Characters/cultist/cultist run_animation 12frames 40px.png', {frameWidth: 40, frameHeight: 40});
        this.load.spritesheet('cultistIdle', 'images/Characters/cultist/rogue like idle_animation 6frames 40px.png', {frameWidth: 40, frameHeight: 40});
        this.load.spritesheet('goatRun', 'images/Characters/goat/goat walk 6frames 40px.png', {frameWidth: 40, frameHeight: 40});
        this.load.spritesheet('goatIdle', 'images/Characters/goat/goat idle 4frames 40px.png', {frameWidth: 40, frameHeight: 40});
        this.load.spritesheet('demon', 'images/Characters/demon/fleshwall 1280x382 12frames.png', {frameWidth: 1280, frameHeight: 382});
        this.load.spritesheet('evilOrb', 'images/Projectiles/evilProjectile 7frames 25px.png', {frameWidth: 25, frameHeight:25});
        this.load.spritesheet('blinkA', 'images/Projectiles/BlinkA 8frames 40px.png', {frameWidth: 40, frameHeight:40});
        this.load.spritesheet('blinkB', 'images/Projectiles/BlinkB 8frames 40px.png', {frameWidth: 40, frameHeight:40});
        //music
        this.load.audio('menuMusic', 'audio/Background Music/ES_The Dominion - Bonnie Grace.mp3');
        this.load.audio('gameMusic', 'audio/Background Music/StageTrackMP3.mp3');
        //sound effects
        this.load.audio('introSound', 'audio/Sound Effects/ES_Rise Of The Goats - Rannar Sillard.mp3');
        this.load.audio('blinkSound', 'audio/Sound Effects/Blink.mp3');
        this.load.audio('playerJumpSound', 'audio/Sound Effects/CultistJump.mp3');
        this.load.audio('player2JumpSound', 'audio/Sound Effects/GoatJump.mp3');
        this.load.audio('playerDeathSound', 'audio/Sound Effects/CultistDeath.mp3');
        this.load.audio('player2DeathSound', 'audio/Sound Effects/GoatDeath.mp3');
        this.load.audio('death', '/audio/Sound Effects/Death.mp3');
    }
    
    create() {
        //define objects
  
        this.map = this.make.tilemap({key:'map'});

        structures = this.map.addTilesetImage('TiledStructuresTileset','structuresPNG');
        terrain = this.map.addTilesetImage('TiledTerrainTileset','terrainPNG');
        
        //add the bg
        //bg = this.add.image(this.map.widthInPixels/2, this.map.heightInPixels/4, 'background');
        this.add.image(640, 480, 'overworldbg');

        //add the Tiled layers
        structuresLayer = this.map.createDynamicLayer('TiledStructuresLayer', structures, 0, 0);
        terrainLayer = this.map.createDynamicLayer('TiledTerrainLayer', terrain, 0, 0);
        
        //set the world bounds to the edge of the Tiled map
        this.physics.world.bounds.width = terrainLayer.width;
        this.physics.world.bounds.height = structuresLayer.height;

        //add the player
        player = this.physics.add.sprite(this.map.widthInPixels/1.5, this.map.heightInPixels - 300, 'cultistIdle');
        player.setCollideWorldBounds(true); 

        //add second player
        player2 = this.physics.add.sprite(this.map.widthInPixels/3, this.map.heightInPixels - 300, 'goatRun');
        player2.setCollideWorldBounds(true); 

        //add the demon wall
        demon = this.physics.add.sprite(this.map.widthInPixels/2, this.map.heightInPixels, 'demon');
        demon.body.setSize(this.map.widthInPixels,300);
        demon.body.setOffset(0,100);
        demon.body.setAllowGravity(false);

        //add player status indicators

        cultistBlinkNotReady = this.add.image(1205, 75, 'CultistBlinkNotReady').setScrollFactor(0).setVisible(false);
        cultistBlinkReady = this.add.image(1205, 75, 'CultistBlinkReady').setScrollFactor(0);
        goatBlinkNotReady = this.add.image(75, 75, 'GoatBlinkNotReady').setScrollFactor(0).setVisible(false);
        goatBlinkReady = this.add.image(75, 75, 'GoatBlinkReady').setScrollFactor(0);
        cultistDead = this.add.image(1205, 75, 'CultistDead').setScrollFactor(0).setVisible(false);
        goatDead = this.add.image(75, 75, 'GoatDead').setScrollFactor(0).setVisible(false);

        //Tiled colliders
        terrainLayer.setCollisionByProperty({ collides: true });
        structuresLayer.setCollisionByProperty({ collides: true });

        //functions 

        //wall kills player
        function nom () {
            this.playerDeathSound.play();
            player.disableBody(true, true);
            playerState = 0;
            cultistBlinkNotReady.setVisible(false);
            cultistBlinkReady.setVisible(false);
            cultistDead.setVisible(true);
        };

        //wall kills player2
        function chomp () {
            this.player2DeathSound.play();
            player2.disableBody(true, true);
            player2State = 0;
            goatBlinkNotReady.setVisible(false);
            goatBlinkReady.setVisible(false);
            goatDead.setVisible(true);
        };
        
        //add collisions 
        this.physics.add.collider(terrainLayer, player); 
        this.physics.add.collider(structuresLayer, player);
        this.physics.add.collider(terrainLayer, player2); 
        this.physics.add.collider(structuresLayer, player2);
        this.physics.add.collider(player, player2);
        this.physics.add.collider(demon, player, nom, null, this); //add functions here 
        this.physics.add.collider(demon, player2, chomp, null, this);

        //keyboard = this.input.keyboard.createCursorKeys();
        keyboard = this.input.keyboard.addKeys('RIGHT,LEFT,DOWN,UP,A,W,S,D');
        Cee = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        Emm = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        
        //animations

            this.anims.create({
                key: 'blinkExit',
                frames: this.anims.generateFrameNumbers('blinkA', { start: 0, end: 7}),
                frameRate: 20,
                repeat: 0
            });

            this.anims.create({
                key: 'blinkEnter',
                frames: this.anims.generateFrameNumbers('blinkB', { start: 0, end: 7}),
                frameRate: 20,
                repeat: 0
            });
        
            //cultist
        
            this.anims.create({
                key: 'leftRun',
                frames: this.anims.generateFrameNumbers('cultistRun', { start: 0, end: 5}),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'rightRun',
                frames: this.anims.generateFrameNumbers('cultistRun', { start: 6, end: 11}),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'leftIdle',
                frames: this.anims.generateFrameNumbers('cultistIdle', { start: 0, end: 2}),
                frameRate: 5,
                repeat: -1
            });

            this.anims.create({
                key: 'rightIdle',
                frames: this.anims.generateFrameNumbers('cultistIdle', { start: 3, end: 5}),
                frameRate: 5,
                repeat: -1
            });

            //goat

            this.anims.create({
                key: 'goatLeftRun',
                frames: this.anims.generateFrameNumbers('goatRun', { start: 0, end: 2}),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'goatRightRun',
                frames: this.anims.generateFrameNumbers('goatRun', { start: 3, end: 5}),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'goatLeftIdle',
                frames: this.anims.generateFrameNumbers('goatIdle', { start: 0, end: 1}),
                frameRate: 5,
                repeat: -1
            });

            this.anims.create({
                key: 'goatRightIdle',
                frames: this.anims.generateFrameNumbers('goatIdle', { start: 2, end: 4}),
                frameRate: 5,
                repeat: -1,
            });

            //demon

            this.anims.create({
                key: 'demonWall',
                frames: this.anims.generateFrameNumbers('demon', { start: 0, end: 11 }),
                frameRate: 5,
                repeat: -1
            });
        
        //set background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#15161E");
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(player, false, 1, 0.1);
        //add music and sounds
        this.gameMusic = this.sound.add('gameMusic') 
        this.musicConfig = {
            mute: false,
            volume: 0.4,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        //play game music
        this.gameMusic.play(this.musicConfig);
        
        //add sound effects
        this.playerJumpSound = this.sound.add('playerJumpSound');
        this.player2JumpSound = this.sound.add('player2JumpSound'); 
        this.blinkSound = this.sound.add('blinkSound'); 
        this.playerDeathSound = this.sound.add('playerDeathSound'); 
        this.player2DeathSound = this.sound.add('player2DeathSound'); 
    }
    update() {
        //game loop

        this.events.on('wake', function(){
            console.log('start over');
        })

        let px = player.body.position.x;
        let py = player.body.position.y;
        let p2x = player2.body.position.x;
        let p2y = player2.body.position.y;

        //bg.y = this.cameras.main.scrollY + 300;
        //bg.setScrollFactor(0) // this might work better?
        
        if(player2.body.position.y > player.body.position.y) {
            this.cameras.main.stopFollow();
            this.cameras.main.startFollow(player);
        } else {
            this.cameras.main.stopFollow();
            this.cameras.main.startFollow(player2);
        }

        if (keyboard.LEFT.isDown)
        {
            lastDirectionCult = 0;
            player.body.setVelocityX(-300);
            player.anims.play('leftRun', true); 
        }
        else if (keyboard.RIGHT.isDown)
        {
            lastDirectionCult = 1;
            player.body.setVelocityX(300);
            player.anims.play('rightRun', true); 
        } else if (lastDirectionCult === 1)
        {
            player.body.setVelocityX(0);
            player.anims.play('rightIdle', true); 
        } else 
        {
            player.body.setVelocityX(0);
            player.anims.play('leftIdle', true); 
        }
        // jump 
        if (keyboard.UP.isDown && player.body.onFloor())
        {
            this.playerJumpSound.play();
            player.body.setVelocityY(-500);
        }
        //goat controls

        if (keyboard.A.isDown)
        {
            lastDirectionGoat = 0;
            player2.body.setVelocityX(-300);
            player2.anims.play('goatLeftRun', true); 
        }
        else if (keyboard.D.isDown)
        {
            lastDirectionGoat = 1;
            player2.body.setVelocityX(300);
            player2.anims.play('goatRightRun', true); 
        } else if (lastDirectionGoat === 1)
        {
            player2.body.setVelocityX(0);
            player2.anims.play('goatRightIdle', true); 
        } else 
        {
            player2.body.setVelocityX(0);
            player2.anims.play('goatLeftIdle', true); 
        }
        // jump 
        if (keyboard.W.isDown && player2.body.onFloor())
        {
            this.player2JumpSound.play();
            player2.body.setVelocityY(-500);
        }


        //track player position for use in blink operations
        //RSA in 'blink RSA' stands for 'Right Short A' where 'A' is the starting position. blinkRSA would corrospond to RSB.
        //set the blink animations 
        
        //blink up
        const blink2UA = this.add.sprite(px + 20, py, 'blinkA', 0);
        const blink2UB = this.add.sprite(px + 20, py - 100, 'blinkB', 0);
        const blink2USA = this.add.sprite(px + 20, py, 'blinkA', 0);
        const blink2USB = this.add.sprite(px + 20, py - 50, 'blinkB', 0);
        // //blink right
        // const blink2RA = this.add.sprite(px + 20, py, 'blinkA', 0);
        // const blink2RB = this.add.sprite(px + 20 + 100, py, 'blinkB', 0);
        // const blink2RSA = this.add.sprite(px + 20, py, 'blinkA', 0);
        // const blink2RSB = this.add.sprite(px + 20 + 50, py, 'blinkB', 0);
        // //blink left
        // const blink2LA = this.add.sprite(px + 20, py, 'blinkA', 0);
        // const blink2LB = this.add.sprite(px + 20 - 100, py, 'blinkB', 0);
        // const blink2LSA = this.add.sprite(px + 20, py, 'blinkA', 0);
        // const blink2LSB = this.add.sprite(px + 20 - 50, py, 'blinkB', 0);

        //blink coodlown functions
        function p1Cooldown() {setTimeout(function(){
            p1BlinkCooldown = 1;
            cultistBlinkNotReady.setVisible(false);
            cultistBlinkReady.setVisible(true);
            }, 3000)};
        function p2Cooldown() {setTimeout(function(){
            p2BlinkCooldown = 1;
            goatBlinkNotReady.setVisible(false);
            goatBlinkReady.setVisible(true);
            }, 3000)};

        // Player blink Up
        if (Phaser.Input.Keyboard.JustDown(Emm) && (p1BlinkCooldown === 1)) 
        {
            if(!terrainLayer.getTileAtWorldXY(px + 20, py - 100)){
                this.blinkSound.play();
                blink2UA.anims.play('blinkEnter');
                blink2UB.anims.play('blinkExit');
                player.setPosition(px + 20, py - 100);
                p1BlinkCooldown = 0;
                cultistBlinkReady.setVisible(false);
                cultistBlinkNotReady.setVisible(true);
                p1Cooldown();
            } else if(!terrainLayer.getTileAtWorldXY(px + 20, py - 50)){
                this.blinkSound.play();
                blink2USA.anims.play('blinkEnter');
                blink2USB.anims.play('blinkExit');
                player.setPosition(px + 20, py - 50);
                p1BlinkCooldown = 0;
                cultistBlinkReady.setVisible(false);
                cultistBlinkNotReady.setVisible(true);
                p1Cooldown();
            }
        }

        // Player blink Right
        // if (keyboard.RIGHT.isDown && Phaser.Input.Keyboard.JustDown(Emm))
        // {
        //     if(!terrainLayer.getTileAtWorldXY(px + 20 + 100, py)){
        //         this.blinkSound.play();
        //         blink2RA.anims.play('blinkEnter');
        //         blink2RB.anims.play('blinkExit');
        //         player.setPosition(px + 20 + 100, py);
        //     } else if(!terrainLayer.getTileAtWorldXY(px + 20 + 50, py)){
        //         this.blinkSound.play();
        //         blink2RSA.anims.play('blinkEnter');
        //         blink2RSB.anims.play('blinkExit');
        //         player.setPosition(px + 20 + 50, py);
        //     }
        // }

        // // Player blink Left
        // if (keyboard.LEFT.isDown && Phaser.Input.Keyboard.JustDown(Emm))
        // {
        //     if(!terrainLayer.getTileAtWorldXY(px + 20 - 100, py)){
        //         this.blinkSound.play();
        //         blink2LA.anims.play('blinkEnter');
        //         blink2LB.anims.play('blinkExit');
        //         player.setPosition(px + 20 - 100, py);
        //     } else if(!terrainLayer.getTileAtWorldXY(px + 20 - 50, py)){
        //         this.blinkSound.play();
        //         blink2LSA.anims.play('blinkEnter');
        //         blink2LSB.anims.play('blinkExit');
        //         player.setPosition(px + 20 - 50, py);
        //     }
        // }

        ////////////////////////////////////////////////////////////////////////////////////////
        const blinkUA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        const blinkUB = this.add.sprite(p2x + 20, p2y - 100, 'blinkB', 0);
        const blinkUSA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        const blinkUSB = this.add.sprite(p2x + 20, p2y - 50, 'blinkB', 0);
        // //blink right
        // const blinkRA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        // const blinkRB = this.add.sprite(p2x + 20 + 100, p2y, 'blinkB', 0);
        // const blinkRSA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        // const blinkRSB = this.add.sprite(p2x + 20 + 50, p2y, 'blinkB', 0);
        // //blink left
        // const blinkLA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        // const blinkLB = this.add.sprite(p2x + 20 - 100, p2y, 'blinkB', 0);
        // const blinkLSA = this.add.sprite(p2x + 20, p2y, 'blinkA', 0);
        // const blinkLSB = this.add.sprite(p2x + 20 - 50, p2y, 'blinkB', 0);

        // Player2 blink Up
        if (Phaser.Input.Keyboard.JustDown(Cee) && p2BlinkCooldown === 1) //keyboard.W.isDown && 
        {
            if(!terrainLayer.getTileAtWorldXY(p2x + 20, p2y - 100)){
                this.blinkSound.play();
                blinkUA.anims.play('blinkEnter');
                blinkUB.anims.play('blinkExit');
                player2.setPosition(p2x + 20, p2y - 100);
                p2BlinkCooldown = 0;
                goatBlinkReady.setVisible(false);
                goatBlinkNotReady.setVisible(true);
                p2Cooldown();
            } else if(!terrainLayer.getTileAtWorldXY(p2x + 20, p2y - 50)){
                this.blinkSound.play();
                blinkUSA.anims.play('blinkEnter');
                blinkUSB.anims.play('blinkExit');
                player2.setPosition(p2x + 20, p2y - 50);
                p2BlinkCooldown = 0;
                goatBlinkReady.setVisible(false);
                goatBlinkNotReady.setVisible(true);
                p2Cooldown();
            }
        }

        // // Player2 blink Right
        // if (keyboard.D.isDown && Phaser.Input.Keyboard.JustDown(Cee))
        // {
        //     if(!terrainLayer.getTileAtWorldXY(p2x + 20 + 100, p2y)){
        //         this.blinkSound.play();
        //         blinkRA.anims.play('blinkEnter');
        //         blinkRB.anims.play('blinkExit');
        //         player2.setPosition(p2x + 20 + 100, p2y);
        //     } else if(!terrainLayer.getTileAtWorldXY(p2x + 20 + 50, p2y)){
        //         this.blinkSound.play();
        //         blinkRSA.anims.play('blinkEnter');
        //         blinkRSB.anims.play('blinkExit');
        //         player2.setPosition(p2x + 20 + 50, p2y);
        //     }
        // }

        // // Player2 blink Left
        // if (keyboard.A.isDown && Phaser.Input.Keyboard.JustDown(Cee))
        // {
        //     if(!terrainLayer.getTileAtWorldXY(p2x + 20 - 100, p2y)){
        //         this.blinkSound.play();
        //         blinkLA.anims.play('blinkEnter');
        //         blinkLB.anims.play('blinkExit');
        //         player2.setPosition(p2x + 20 - 100, p2y);
        //     } else if(!terrainLayer.getTileAtWorldXY(p2x + 20 - 50, p2y)){
        //         this.blinkSound.play();
        //         blinkLSA.anims.play('blinkEnter');
        //         blinkLSB.anims.play('blinkExit');
        //         player2.setPosition(p2x + 20 - 50, p2y);
        //     }
        // }

        // demon movement
        demonSpeed -= i;
        demon.anims.play('demonWall', true);
        demon.body.setVelocityY(demonSpeed);

        //add win state

        if (py < 351){
            playerWin = 1;
        } else if (p2y < 351){
            player2Win = 1;
        }

        //check for win

        if (py < 350 || p2y < 350){
            if (playerWin === 1 && player2Win === 1) {
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:3 }), this;
                this.scene.stop('SceneGame'), this;
            } else if (playerState === 0){
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:2 }), this;
                this.scene.stop('SceneGame'), this;
            } else if (player2State === 0){
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:1 }), this;
                this.scene.stop('SceneGame'), this;
            } else {
                console.log('the game continues!');
            };
        };

        if (playerState === 0 && player2State === 0) {
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:0 }), this;
                this.scene.stop('SceneGame'), this;
            } else if (playerWin === 1){
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:1 }), this;
                this.scene.stop('SceneGame'), this;
            } else if (player2Win === 1){
                // this.gameMusic.stop(this.musicConfig);
                this.scene.start('ScenePost', { id:2 }), this;
                this.scene.stop('SceneGame'), this;
            } else {
                console.log('the game continues!');
        };
    }
}