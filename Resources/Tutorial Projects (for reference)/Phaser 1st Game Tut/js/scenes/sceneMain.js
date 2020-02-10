let player;
let platforms;
let cursors;
let stars;
let bombs;
let score = 0;
let gameOver = false;
let scoreText;
let camera;
let map;

class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }
    
    preload() {
        this.load.image('sky', '/images/Backgrounds/sky.png');
        this.load.image('ground', '/images/Environment/platform.png');
        this.load.image('star', '/images/Objects/star.png');
        this.load.image('bomb', '/images/Objects/bomb.png')
        this.load.spritesheet('dude', '/images/Characters/dude.png', 
        {frameWidth: 32, frameHeight: 48}
        );
    }
    
    create() {
        //define objects
        this.add.image(400,300, 'sky');

        platforms = this.physics.add.staticGroup();

        platforms.create(400,568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250., 'ground');
        platforms.create(750, 220, 'ground');

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        bombs = this.physics.add.group();

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                framerate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'turn',
                frames: [ {key: 'dude', frame: 4} ],
                framerate: 20
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                framerate: 10,
                repeat: -1
            });
        
        function collectStar (player, star) {
            star.disableBody(true, true);
            score += 10;
            scoreText.setText('Score: ' + score);

            if (stars.countActive(true) === 0) {
                stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });

                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }

        function hitBomb (player, bomb) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }
        
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(player, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }
    
    update() {
        //game loop
        if (gameOver) {
            console.log('GAME OVER!');
            return;
        }

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-400);
        }
    }
}