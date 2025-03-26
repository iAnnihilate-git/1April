const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, // Ensures game resizes to fit screen
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player, heartsCollected = 0, heartsText, restartButton, heartGroup;

const PLAYER_SIZE = 50;  // Adjustable player size
const HEART_SIZE = 30;   // Adjustable heart size

function preload() {
    this.load.image('bg', 'assets/bg.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('heart', 'assets/heart.png');
}

function create() {
    // Set background to dynamically scale with game window
    let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.scale.on('resize', (gameSize) => {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        bg.displayWidth = gameSize.width;
        bg.displayHeight = gameSize.height;
    });

    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    // Create player and set adjustable size
    player = this.add.image(100, 100, 'player');
    player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);

    // Create heart group
    heartGroup = this.physics.add.group();
    for (let i = 0; i < 6; i++) {
        let heart = heartGroup.create(Phaser.Math.Between(50, this.sys.game.config.width - 50), Phaser.Math.Between(50, this.sys.game.config.height - 50), 'heart');
        heart.setDisplaySize(HEART_SIZE, HEART_SIZE);
    }

    heartsText = this.add.text(20, 20, 'Hearts: 0', { fontSize: '24px', fill: '#fff' });

    // Restart button (hidden initially)
    restartButton = this.add.text(this.sys.game.config.width / 2 - 50, this.sys.game.config.height / 2 + 50, 'Restart', { fontSize: '24px', fill: '#fff', backgroundColor: '#ff0000' })
        .setPadding(10)
        .setInteractive()
        .setVisible(false)
        .on('pointerdown', () => restartGame());
}

function update() {
    if (heartsCollected >= 6) {
        showFinalMessage(this);
    }
}

function showFinalMessage(scene) {
    scene.add.text(scene.sys.game.config.width / 2 - 100, scene.sys.game.config.height / 2, 'Happy Birthday, My Love!', { fontSize: '32px', fill: '#fff' });
    restartButton.setVisible(true);
}

function restartGame() {
    heartsCollected = 0;
    restartButton.setVisible(false);
    game.scene.scenes[0].scene.restart();
}