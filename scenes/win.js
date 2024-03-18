class Win extends Phaser.Scene {

    constructor() {
        super("win")
    }
    init() {
        this.cursor = this.input.keyboard.createCursorKeys()
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    }
    preload() {
        this.load.image('win', './assets/win.jpg');
    }
    create() {
        this.add.image(650, 450, 'win')
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.start('menu')
        }
    }
}