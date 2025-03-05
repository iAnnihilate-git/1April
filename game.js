const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: { default: 'arcade' },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, hearts, cursors, score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/bg.png'); // Add a romantic background image
    this.load.image('heart', 'assets/heart.png');   // Heart collectible
    this.load.image('player', 'assets/player.png'); // Main character
}

function create() {
    this.add.image(400, 300, 'background');  

    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
    cursors = this.input.keyboard.createCursorKeys();

    hearts = this.physics.add.group({
        key: 'heart',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 150 }
    });

    hearts.children.iterate(heart => {
        heart.setScale(0.3);
    });

    this.physics.add.overlap(player, hearts, collectHeart, null, this);

    scoreText = this.add.text(10, 10, 'Hearts: 0', { fontSize: '24px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-200);
    else if (cursors.down.isDown) player.setVelocityY(200);
    else player.setVelocityY(0);
}

function collectHeart(player, heart) {
    heart.disableBody(true, true);
    score++;
    scoreText.setText('Hearts: ' + score);

    if (score === 6) {
        this.add.text(300, 250, 'Happy Birthday, My Love! ❤️', { fontSize: '32px', fill: '#fff' });
    }
}