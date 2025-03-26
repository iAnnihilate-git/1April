const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,  // Fit to screen width
    height: window.innerHeight, // Fit to screen height
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player, heartsCollected = 0, restartButton;

const PLAYER_SIZE = 50;  // Adjustable player size
const HEART_SIZE = 30;   // Adjustable heart size

function preload() {
    this.load.image('bg', 'assets/bg.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('heart', 'assets/heart.png');
}

function create() {
    // Add background and scale it to fit the game window
    let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    // Create player and set adjustable size
    player = this.add.image(100, 100, 'player');
    player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE);

    // Create heart and set adjustable size
    let heart = this.add.image(300, 300, 'heart');
    heart.setDisplaySize(HEART_SIZE, HEART_SIZE);
    
    this.heartsText = this.add.text(20, 20, 'Hearts: 0', { fontSize: '24px', fill: '#fff' });

    // Reset everything when game restarts
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