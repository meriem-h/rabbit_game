class Menu extends Phaser.Scene {

    constructor() {
        super("menu")
    }
    init() {
        this.cursor = this.input.keyboard.createCursorKeys()
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    }
    preload() {
        this.load.image('start', './assets/menu.jpg');
    }
    create() {
        this.add.image(650, 450, 'start')
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.start('game')
        }
    }
}