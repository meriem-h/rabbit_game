class GameOver extends Phaser.Scene {

    constructor() {
        super("gameover")
    }
    init() {
        this.cursor = this.input.keyboard.createCursorKeys()
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    }
    preload() {
        this.load.image('gameover', './assets/over.jpeg');
    }
    create() {
        this.add.image(650, 450, 'gameover')
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.start('menu')
        }
    }
}