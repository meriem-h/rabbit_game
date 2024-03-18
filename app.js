var config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 900,
    scene: [
        Menu,
        Game,
        Win,
        GameOver,
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
        }
    }
};

var game = new Phaser.Game(config);
