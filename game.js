const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    audio: {
        disableWebAudio: false,
        noAudio: false
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

// Global game variables
const PLAYER_SIZE = 100;
const HEART_SIZE = 80;
const PLAYER_SPEED = 700;

function preload() {
    // Load essential game assets
    this.load.image('bg', 'assets/bg.jpg');
    this.load.image('player', 'assets/player-1.png');
    this.load.image('heart', 'assets/heart-2.png');

    // Load cake image for the restart button
    this.load.image('cake', 'assets/cake.png');
    
    // Load sound files
    this.load.audio('collect', 'assets/collect-2.mp3');
    this.load.audio('completion', 'assets/completion-tada-funny.mp3');
}

function create() {
    console.log("Game scene created");
    
    // Set background
    let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.displayWidth = this.cameras.main.width;
    bg.displayHeight = this.cameras.main.height;
    
    this.scale.on('resize', (gameSize) => {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        bg.displayWidth = gameSize.width;
        bg.displayHeight = gameSize.height;
    });

    // Initialize only the collect sound
    this.collectSound = this.sound.add('collect');
    this.completionSound = this.sound.add('completion');
    
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
    heartsText = this.add.text(20, 20, 'Hearts: 0', { 
        fontFamily: 'Acme, sans-serif',
        fontSize: '42px', 
        fill: '#00000' 
    });

    // Create cake image (hidden initially)
    cakeImage = this.add.image(
        this.cameras.main.width / 2, 
        this.cameras.main.height / 2 + 100, 
        'cake'
    )
    .setScale(0.15) // Adjust scale as needed for your cake image
    .setInteractive()
    .setVisible(false)
    .on('pointerdown', () => restartGame(this));

    // Set up cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();
    
    // Add a debug button to test sound
    // const soundTestBtn = this.add.text(
    //     this.cameras.main.width - 150, 
    //     20, 
    //     'Test Sound', 
    //     { fontSize: '16px', fill: '#fff', backgroundColor: '#333' }
    // )
    // .setPadding(8)
    // .setInteractive()
    // .on('pointerdown', () => {
    //     console.log("Sound test button clicked");
    //     if (this.collectSound) {
    //         console.log("Attempting to play test sound");
    //         this.collectSound.play();
    //     } else {
    //         console.log("Sound object not available");
    //     }
    // });
}

function update() {
    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-PLAYER_SPEED);
    } else if (cursors.right.isDown) {
        player.setVelocityX(PLAYER_SPEED);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-PLAYER_SPEED);
    } else if (cursors.down.isDown) {
        player.setVelocityY(PLAYER_SPEED);
    } else {
        player.setVelocityY(0);
    }
}

function collectHeart(player, heart) {
    heart.disableBody(true, true);
    heartsCollected++;
    heartsText.setText('Hearts: ' + heartsCollected);
    
    // Check if hearts collected is 14
    if (heartsCollected === 14) {
        heartsText.setText('Heart: 14th January 2025');
    } else {
        heartsText.setText('Hearts: ' + heartsCollected);
    }

    // Play collect sound
    if (this.collectSound) {
        // console.log("Playing collect sound");
        this.collectSound.play();
    }

    if (heartsCollected >= 14) {
        showFinalMessage(this);
    }
}

function showFinalMessage(scene) {
    // We don't have a completion sound, so we'll just play the collect sound again
    if (scene.completionSound) {
        console.log("Playing sound for completion");
        scene.completionSound.play();
    }
    
    // Darken background
    const overlay = scene.add.rectangle(
        0, 0, 
        scene.cameras.main.width, 
        scene.cameras.main.height, 
        0x000000, 0.7
    ).setOrigin(0);

    // Show cake image behind the text
    cakeImage.setVisible(true);
    
    // Add animation to the cake
    scene.tweens.add({
        targets: cakeImage,
        scale: { from: 0.1, to: 0.15 },
        duration: 1000,
        ease: 'Bounce'
    });

    // Birthday message with Acme font
    const message = scene.add.text(
        scene.cameras.main.width / 2, 
        scene.cameras.main.height / 2 - 50, 
        'Happy Birthday, Pilluuu ❤️!', 
        { 
            fontFamily: 'Acme',
            fontSize: '62px', 
            fill: '#fff' 
        }
    ).setOrigin(0.5);

    // Add some animation to the message
    scene.tweens.add({
        targets: message,
        scale: { from: 0.5, to: 1 },
        duration: 1000,
        ease: 'Bounce'
    });

    // Add text to indicate the cake is clickable
    const clickText = scene.add.text(
        scene.cameras.main.width / 2, 
        scene.cameras.main.height / 2 + 150, 
        'Click the cake to play again!', 
        { 
            fontFamily: 'Acme, sans-serif',
            fontSize: '18px', 
            fill: '#fff' 
        }
    ).setOrigin(0.5);
}

function restartGame(scene) {
    heartsCollected = 0;
    cakeImage.setVisible(false);
    // scene.scene.restart();
    window.location.href = 'index.html';
}
