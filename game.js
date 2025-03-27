const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container', // This tells Phaser to use your div as the container
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player, heartsCollected = 0, heartsText, restartButton, heartGroup;
let cursors;

const PLAYER_SIZE = 100;  // Adjustable player size
const HEART_SIZE = 80;   // Adjustable heart size

function preload() {
    this.load.image('bg', 'assets/bg.jpg'); 
    this.load.image('player', 'assets/player.png');
    this.load.image('heart', 'assets/heart.png');
}

function create() {
    // Set background to dynamically scale with game window
    let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.displayWidth = this.cameras.main.width;
    bg.displayHeight = this.cameras.main.height;
    
    this.scale.on('resize', (gameSize) => {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        bg.displayWidth = gameSize.width;
        bg.displayHeight = gameSize.height;
    });

    // Create player with physics
    player = this.physics.add.sprite(100, 100, 'player');
    player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);
    player.setCollideWorldBounds(true);

    // Create heart group with physics
    heartGroup = this.physics.add.group();
    for (let i = 0; i < 14; i++) {
        let heart = heartGroup.create(
            Phaser.Math.Between(50, this.cameras.main.width - 50), 
            Phaser.Math.Between(50, this.cameras.main.height - 50), 
            'heart'
        );
        heart.setDisplaySize(HEART_SIZE, HEART_SIZE);
    }

    // Add collision between player and hearts
    this.physics.add.overlap(player, heartGroup, collectHeart, null, this);

    // Hearts counter
    heartsText = this.add.text(20, 20, 'Hearts: 0', { fontSize: '42px', fill: '#000000' });

    // Restart button (hidden initially)
    restartButton = this.add.text(
        this.cameras.main.width / 2, 
        this.cameras.main.height / 2 + 50, 
        'Restart', 
        { fontSize: '24px', fill: '#fff', backgroundColor: '#ff0000' }
    )
    .setPadding(10)
    .setOrigin(0.5)
    .setInteractive()
    .setVisible(false)
    .on('pointerdown', () => restartGame(this));

    // Set up cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Player movement
    const speed = 400;
    
    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
    } else {
        player.setVelocityY(0);
    }
}

function collectHeart(player, heart) {
    heart.disableBody(true, true);
    heartsCollected++;
    heartsText.setText('Hearts: ' + heartsCollected);

    if (heartsCollected >= 14) {
        showFinalMessage(this);
    }
}

function showFinalMessage(scene) {
    // Darken background
    const overlay = scene.add.rectangle(
        0, 0, 
        scene.cameras.main.width, 
        scene.cameras.main.height, 
        0x000000, 0.7
    ).setOrigin(0);

    // Birthday message
    const message = scene.add.text(
        scene.cameras.main.width / 2, 
        scene.cameras.main.height / 2 - 50, 
        'Happy Birthday, My Love ❤️!', 
        { fontSize: '32px', fill: '#fff' }
    ).setOrigin(0.5);

    // Add some animation to the message
    scene.tweens.add({
        targets: message,
        scale: { from: 0.5, to: 1 },
        duration: 1000,
        ease: 'Bounce'
    });

    restartButton.setVisible(true);
}

function restartGame(scene) {
    heartsCollected = 0;
    restartButton.setVisible(false);
    scene.scene.restart();
}
