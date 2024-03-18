
class Game extends Phaser.Scene {

    constructor() {
        super("game")
    }
    init() {
        this.cursor = this.input.keyboard.createCursorKeys()
        this.direction = "right"
        this.bullet = true
        this.foxDirection = true
        this.pinguinFlyDirection = true
        this.pinguinSlideDirection = true
        this.bossPaterneStatus = 0
    }
    preload() {
        this.load.spritesheet('rabbit', '../assets/mouvement.png', { frameWidth: 42, frameHeight: 47 });
        this.load.spritesheet('boss', '../assets/boss.png', { frameWidth: 65, frameHeight: 68 });
        this.load.spritesheet('bossBiss', '../assets/shopkeeper.png', { frameWidth: 130, frameHeight: 126 });
        this.load.spritesheet('foxRun', '../assets/foxRun.png', { frameWidth: 38, frameHeight: 48 });
        this.load.spritesheet('foxShoot', '../assets/fox.png', { frameWidth: 42, frameHeight: 48 });
        this.load.spritesheet('pinguinSlide', '../assets/penguin_glisse.png', { frameWidth: 50, frameHeight: 30 });
        this.load.spritesheet('pinguinFly', '../assets/penguin_vol.png', { frameWidth: 49.5, frameHeight: 50 });
        this.load.spritesheet('bullet', '../assets/mobAmo.png', { frameWidth: 20, frameHeight: 20 });
        // this.load.spritesheet('bullet', '../assets/star.png', { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet('carrot', '../assets/carrot.png', { frameWidth: 20, frameHeight: 20 });

        this.load.image('HP', '../assets/HP.png', { frameWidth: 42, frameHeight: 47 });
        this.load.image('wall', '../assets/wallpapper2.png');
        this.load.image('wall2', '../assets/wall2.png');
        this.load.image('poutre', '../assets/wallPoutre.png');
        this.load.image('laddertop', '../assets/ladderTop.png');
        this.load.image('ladderbottom', '../assets/ladderBottom.png');
        this.load.image('laddermiddle', '../assets/ladderMiddle.png');

        this.load.image('floorTop', '../assets/floor2.png');
        this.load.image('floorBottom', '../assets/floor3.png');
        this.load.image('floorEnd', '../assets/floorEnd.png');

        this.load.image('table', '../assets/table.png');
        this.load.image('caisse', '../assets/caisse.png');
        this.load.image('piege', '../assets/piege.png');
        this.load.image('porte', '../assets/porte.png');
        this.load.image('porteOuverte', '../assets/porteOuverte.png');
        this.load.image('key', '../assets/key.png');
    }
    create() {
        this.cameras.main.setBounds(0, 0, 3000, 900);
        this.physics.world.setBounds(0, 0, 3000, 900);
        this.add.image(25, 25, 'HP').setScrollFactor(0)

        this.map()
        this.mob()
        this.animation()
        this.bulletVertical()



        // ==================================== //
        //             character               //
        // ================================== //


        this.rabbit = this.physics.add.sprite(100, 850, "rabbit")  // position de depart
        // this.rabbit = this.physics.add.sprite(2500, 100, "rabbit")

        this.rabbit.setCollideWorldBounds(true);
        this.rabbit.hp = 3
        this.rabbit.immunity = false
        this.rabbit.carrot = false
        this.rabbit.key = false
        this.hpText = this.add.text(50, 5, this.rabbit.hp).setScale(2).setScrollFactor(0)

        this.rabbitColiderListe()

        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers("rabbit", {
                start: 0,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers("rabbit", {
                start: 9,
                end: 12
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers("rabbit", {
                start: 14,
                end: 18
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers("rabbit", {
                start: 12,
                end: 13
            }),
            frameRate: 10,
            repeat: 0
        });
    }
    update() {
        this.cameras.main.startFollow(this.rabbit)


        this.rabit_move()

        if (this.rabbit.carrot) {
            this.rabbit_shoot()
        }

        if (this.foxRun.hp > 0) {
            this.foxRun_move()
        }

        if (this.pinguinFly.hp > 0) {
            this.pinguinFly_move()
        }

        if (this.pinguinSlide.hp > 0) {
            this.pinguin_move()
        }

        if (this.boss.hp > 0) {

            this.bossPaterne()
        }



        if (this.rabbit.x > 2000 && this.bossPaterneStatus == 0) {
            this.bossPaterneStatus = 1
        }

        if (this.rabbit.hp == -1) {
            this.scene.start('gameover')
        }

        if (this.boss.hp == 0) {
            setTimeout(() => {
                this.scene.start('win')
            }, 4000);
        }
    }

    // ================================================== //
    //                   game setting                     //
    // ================================================== //

    map() {
        // console.log("MAP", this)
        this.platforms = this.physics.add.staticGroup();
        this.trap = this.physics.add.staticGroup();
        // this.platforms = this.physics.add.staticGroup();
        this.ladder = this.physics.add.staticGroup();
        // table = this.physics.add.staticGroup();
        this.porte = this.physics.add.staticGroup();
        this.items = this.physics.add.image(30, 120, "carrot").setScale(2);
        this.key = this.physics.add.image(30, 613, "key").setScale(0.5);

        this.hp = this.physics.add.image(1100, 200, "HP").setScale(0.5);

        this.table = this.platforms.create(30, 166, 'table');
        this.platforms.create(30, 660, 'table');
        this.physics.add.collider(this.table, this.items)

        this.physics.add.collider(this.platforms, this.key)
        this.physics.add.collider(this.platforms, this.hp)
        // this.physics.add.collider(table, this.platforms)

        // test
        // for (let index = 100; index <= 900; index = index + 100) {
        //     this.platforms.create(1200, index, 'floorBottom').setScale(1).refreshBody();
        // }


        // plateform principal tout en bas
        for (let index = 0; index < 3100; index = index + 100) {
            this.platforms.create(index, 900, 'floorBottom').setScale(1).refreshBody();
        }



        // =================================================================== //
        //               toutes les plateform ligne 1 x=100                    //
        // =================================================================== //



        // =================================================================== //
        //               toutes les plateform ligne 2 x=200                    //
        // =================================================================== //
        for (let index = -50; index < 750; index = index + 100) {
            this.platforms.create(index, 200, 'floorTop').setScale(1).refreshBody();
        }

        // this.add.image(700, 192, 'floorEnd').flipX = true;
        this.platforms.create(700, 192, 'floorEnd').flipX = true;



        //  echelle
        this.ladder.create(740, 170, 'laddertop')
        for (let index = 190; index < 370; index = index + 19) {
            this.ladder.create(740, index, 'laddermiddle')

        }
        this.ladder.create(740, 373, 'ladderbottom')
        // =================================================================== //
        //               toutes les plateform ligne 3 x=300                    //
        // =================================================================== //

        // =================================================================== //
        //               toutes les plateform ligne 4 x=400                    //
        // =================================================================== //
        // plateform 1
        for (let index = 500; index < 900; index = index + 100) {
            this.platforms.create(index, 400, 'floorTop').setScale(1).refreshBody();
        }
        this.platforms.create(435, 392, 'floorEnd')
        this.platforms.create(840, 392, 'floorEnd').flipX = true;
        // this.add.image(900, 392, 'floorEnd').flipX = true;

        //  echelle
        this.ladder.create(400, 390, 'laddertop')
        for (let index = 410; index < 575; index = index + 19) {
            this.ladder.create(400, index, 'laddermiddle')
        }
        this.ladder.create(400, 576, 'ladderbottom')


        // le bonus de PV  ==================================================================================

        for (let index = 1100; index < 1700; index = index + 100) {
            if (index > 1300) {
                this.platforms.create(index, 400, 'floorTop').setScale(1).refreshBody().flipX = true
            }
            else {
                this.platforms.create(index, 400, 'floorTop').setScale(1).refreshBody();
            }
        }

        for (let i = 1100; i < 1600; i = i + 15) {
            if (i < 1300 || i > 1400) {
                this.trap.create(i, 370, 'piege').setScale(1).refreshBody();
            }
        }


        for (let i = 330; i > 100; i = i - 100) {
            this.platforms.create(1065, i, 'wall2').setScale(1).refreshBody().flipX = true;
            this.platforms.create(1635, i, 'wall2').setScale(1).refreshBody();
        }
        this.platforms.create(1635, 90, 'poutre').rotation = 1.55;



        this.platforms.create(1040, 130, 'floorBottom').setScale(1).refreshBody().rotation = 5.5;
        this.platforms.create(970, 200, 'floorBottom').setScale(1).refreshBody().rotation = 5.5;

        //  a l'interiur

        this.platforms.create(1100, 250, 'poutre').rotation = 1.55;
        this.platforms.create(1200, 300, 'poutre').rotation = 1.55;

        this.platforms.create(1350, 362, 'poutre').rotation = 1.55;

        this.platforms.create(1500, 300, 'poutre').rotation = 1.55;
        this.platforms.create(1600, 250, 'poutre').rotation = 1.55;

        this.platforms.create(1430, 200, 'poutre').rotation = 1.55;
        this.platforms.create(1600, 150, 'poutre').rotation = 1.55;




        for (let index = 160; index > -50; index = index - 35) {
            this.platforms.create(1380, index, 'poutre')
        }

        for (let index = 1065; index < 1300; index = index + 36) {
            this.platforms.create(index, 90, 'poutre').rotation = 1.55;
        }

        this.platforms.create(1030, 120, 'poutre').rotation = 1.55;
        this.platforms.create(995, 155, 'poutre').rotation = 1.55;
        this.platforms.create(960, 190, 'poutre').rotation = 1.55;
        this.platforms.create(925, 225, 'poutre').rotation = 1.55;
        // this.platforms.create(890, 260, 'poutre').rotation = 1.55;

        // ============================================================================================================



        // =================================================================== //
        //               toutes les plateform ligne 5 x=500                    //
        // =================================================================== //



        // =================================================================== //
        //               toutes les plateform ligne 6 x=600                    //
        // =================================================================== //

        this.platforms.create(550, 582, 'floorEnd').flipX = true;
        for (let index = 400; index < 600; index = index + 100) {
            this.platforms.create(index, 590, 'floorTop').setScale(1).refreshBody();
        }

        for (let index = 750; index < 1300; index = index + 250) {
            this.platforms.create(index, 590, 'floorTop')
            this.platforms.create(index + 50, 590, 'floorTop').flipX = true


            // les piege sous la plateform
            for (let i = index + 90; i < index + 250; i = i + 35) {
                this.platforms.create(i, 871, 'poutre').rotation = 1.55;
            }
            for (let i = index + 120; i < index + 220; i = i + 15) {
                this.trap.create(i, 846, 'piege').setScale(1).refreshBody();
            }
        }


        this.platforms.create(1500, 582, 'floorEnd')
        for (let index = 1550; index < 1700; index = index + 100) {
            this.platforms.create(index, 590, 'floorTop').setScale(1).refreshBody();
        }

        //  echelle
        this.ladder.create(1725, 575, 'laddertop')
        for (let index = 596; index < 870; index = index + 19) {
            this.ladder.create(1725, index, 'laddermiddle')
        }
        this.ladder.create(1725, 880, 'ladderbottom')



        // =================================================================== //
        //               toutes les plateform ligne 7 x=700                    //
        // =================================================================== //
        this.platforms.create(250, 692, 'floorEnd').flipX = true;

        for (let index = 0; index < 250; index = index + 100) {
            this.platforms.create(index, 700, 'floorTop').setScale(1).refreshBody();
        }

        // this.trap.create(1700, 700, 'piege').setScale(1).refreshBody();


        // =================================================================== //
        //                       plateform coté boss                           //
        // =================================================================== //


        // porte pour le boss
        this.porte.create(1770, 845, 'porte')


        //  echelle
        this.ladder.create(2075, 600, 'laddertop')
        for (let index = 619; index < 880; index = index + 19) {
            this.ladder.create(2075, index, 'laddermiddle')
        }
        this.ladder.create(2075, 880, 'ladderbottom')


        this.ladder.create(2725, 600, 'laddertop')
        for (let index = 619; index < 880; index = index + 19) {
            this.ladder.create(2725, index, 'laddermiddle')
        }
        this.ladder.create(2725, 880, 'ladderbottom')

        // for (let index = 2200; index < 2700; index = index + 100) {
        //     this.platforms.create(index, 600, 'floorTop').setScale(1).refreshBody();
        // }

        for (let index = 2150; index < 2700; index = index + 100) {
            if (index > 2375) {
                this.platforms.create(index, 600, 'floorTop').setScale(1).refreshBody().flipX = true
            }
            else {
                this.platforms.create(index, 600, 'floorTop').setScale(1).refreshBody();
            }
        }







        for (let index = 785; index > -50; index = index - 35) {
            this.platforms.create(1770, index, 'poutre')
        }

    }

    mob() {
        // fox

        this.foxRun = this.physics.add.sprite(746.5, 329, "foxRun")
        this.foxRun.setCollideWorldBounds(true);
        this.foxRun.hp = 3
        this.foxRun.flipX = true
        this.physics.add.collider(this.foxRun, this.platforms);



        // foxShoot = this.physics.add.sprite(500, 300, "foxShoot")
        // foxShoot.setCollideWorldBounds(true);
        // foxShoot.hp = 3
        // this.physics.add.collider(foxShoot, this.platforms);



        // pinguin

        this.pinguinFly = this.physics.add.sprite(500, 0, "pinguinFly")
        this.pinguinFly.setCollideWorldBounds(true);
        this.pinguinFly.hp = 3
        this.physics.add.collider(this.pinguinFly, this.platforms);







        this.pinguinSlide = this.physics.add.sprite(300, 850, "pinguinSlide")
        this.pinguinSlide.setCollideWorldBounds(true);
        this.pinguinSlide.hp = 3
        this.physics.add.collider(this.pinguinSlide, this.platforms);





        // boss

        this.boss = this.physics.add.sprite(2935, 820, "bossBiss").setScale(1)
        this.boss.setCollideWorldBounds(true);
        this.boss.hp = 20
        this.boss.status = 1
        this.physics.add.collider(this.boss, this.platforms);
    }

    animation() {

        // fox
        this.anims.create({
            key: 'FOXmove',
            frames: this.anims.generateFrameNumbers("foxRun", {
                start: 0,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'FOXShoot',
            frames: this.anims.generateFrameNumbers("foxShoot", {
                start: 0,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        // pinguin
        this.anims.create({
            key: 'pinguinFly',
            frames: this.anims.generateFrameNumbers("pinguinFly", {
                start: 0,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'pinguinSlide',
            frames: this.anims.generateFrameNumbers("pinguinSlide", {
                start: 0,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        // boss

        // this.anims.create({
        //     key: 'bossShoot',
        //     frames: this.anims.generateFrameNumbers("boss", {
        //         start: 0,
        //         end: 1
        //     }),
        //     frameRate: 1,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'bossDead',
        //     frames: this.anims.generateFrameNumbers("boss", {
        //         start: 2,
        //         end: 2
        //     }),
        //     frameRate: 10,
        // });

        this.anims.create({
            key: 'bossShoot',
            frames: this.anims.generateFrameNumbers("bossBiss", {
                start: 1,
                end: 2
            }),
            frameRate: 2,
        });

        this.anims.create({
            key: 'bossDead',
            frames: this.anims.generateFrameNumbers("bossBiss", {
                start: 18,
                end: 18
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'bossWalk',
            frames: this.anims.generateFrameNumbers("bossBiss", {
                start: 2,
                end: 8
            }),
            frameRate: 10,
        });

        // this.anims.create({
        //     key: 'bossBissShoot',
        //     frames: this.anims.generateFrameNumbers("bossBiss", {
        //         start: 1,
        //         end: 2
        //     }),
        //     frameRate: 2,
        // });

        // this.anims.create({
        //     key: 'bossBissDead',
        //     frames: this.anims.generateFrameNumbers("bossBiss", {
        //         start: 18,
        //         end: 18
        //     }),
        //     frameRate: 10,
        // });

        // this.anims.create({
        //     key: 'bossWalk',
        //     frames: this.anims.generateFrameNumbers("bossBiss", {
        //         start: 2,
        //         end: 8
        //     }),
        //     frameRate: 10,
        // });
    }




    // ================================================== //
    //             character fonctionality                //
    // ================================================== //

    rabit_move() {

        if (this.cursor.up.isDown && this.rabbit.body.touching.down) {
            this.rabbit.play('jump', true);
            this.rabbit.setVelocityY(-300)
            this.rabbit.setVelocityX(0)
        }

        // else if (this.cursor.space.isDown && this.rabbit.body.touching.down) {
        //     this.rabbit.play('climb', true);
        //     this.rabbit.setVelocityY(-200)
        // }
        else if (!this.rabbit.body.touching.down && this.cursor.right.isDown) {
            this.rabbit.flipX = false
            this.rabbit.setVelocityX(200)
            this.direction = "right"
        }
        else if (!this.rabbit.body.touching.down && this.cursor.left.isDown) {
            this.rabbit.flipX = true
            this.rabbit.setVelocityX(-200)
            this.direction = "left"
        }
        // else if (!this.rabbit.body.touching.down && !this.rabbitLaderOverlap) {
        //     this.rabbit.play('jump', true);
        // }
        else if (this.cursor.right.isDown) {
            this.rabbit.flipX = false
            this.rabbit.setVelocityX(200)
            this.rabbit.play('move', true);
            this.direction = "right"

        }
        else if (this.cursor.left.isDown) {
            this.rabbit.flipX = true
            this.rabbit.setVelocityX(-200)
            this.rabbit.play('move', true);
            this.direction = "left"

        }
        else if (!this.rabbit.body.touching.down && !this.cursor.up.isDown) {
            // this.rabbit.play('fall', true);
        }
        else {
            this.rabbit.setVelocityX(0)
            this.rabbit.play('move', false);
        }
    }

    rabbit_shoot() {
        let x = this.rabbit.x;
        let y = this.rabbit.y;

        if (this.cursor.space.isDown) {
            if (this.bullet) {
                this.bullet = false
                setTimeout(() => {
                    this.bullet = true
                }, 200);
                var projectile = this.physics.add.image(x, y, "carrot")
                projectile.body.allowGravity = false
                // this.physics.add.overlap(projectile, foxRun, foxRunOverlap);
                this.physics.add.overlap(projectile, this.foxRun, this.mobOverlap, null, this);
                // this.physics.add.overlap(projectile, this.pinguinFly, this.mobOverlap, null, this);
                this.physics.add.overlap(projectile, this.pinguinSlide, this.mobOverlap, null, this);
                this.physics.add.overlap(projectile, this.boss, this.mobOverlap, null, this);
                this.physics.add.collider(projectile, this.platforms, this.bulletDistroy, null, this);


                if (this.direction == "right") {
                    setInterval(() => {
                        if (projectile.x < x + 500) {
                            projectile.x = projectile.x + 5
                        }
                        else {
                            this.bulletDistroy(projectile)
                        }
                    }, 15)

                }
                else if (this.direction == "left") {
                    setInterval(() => {
                        if (projectile.x > x - 500) {
                            projectile.x = projectile.x - 5
                        }
                        else {
                            this.bulletDistroy(projectile)
                        }
                    }, 15)
                }
            }
        }


    }

    rabbitOverlap() {

        if (!this.rabbit.immunity) {
            this.rabbit.immunity = true
            this.rabbit.hp = this.rabbit.hp - 1
            this.hpText.setText(this.rabbit.hp)
            setTimeout(() => {
                this.rabbit.immunity = false
                this.rabbit.alpha = 1;

            }, 2000);
        }
        else {
            this.rabbit.alpha = 0.8;
        }

    }

    ladderOverlap() {
        console.log(this)
        if (this.cursor.up.isDown) {
            this.rabbit.play('move', true);
            this.rabbit.setVelocityY(-200)
        }
    }


    openDoor() {
        if (this.rabbit.key) {
            this.porte.getChildren()[0].destroy()
            // porte.destroy()
            this.ladder.create(1800, 845, 'porteOuverte')
        }
    }

    rabbitColiderListe() {
        this.physics.add.collider(this.rabbit, this.platforms);
        this.physics.add.collider(this.rabbit, this.platforms);
        this.physics.add.collider(this.rabbit, this.table);

        this.physics.add.overlap(this.rabbit, this.ladder, this.ladderOverlap, null, this);
        this.physics.add.overlap(this.rabbit, this.trap, this.rabbitOverlap, null, this);
        this.physics.add.collider(this.rabbit, this.porte, this.openDoor, null, this);
        this.physics.add.overlap(this.items, this.rabbit, this.getCarrot, null, this);
        this.physics.add.overlap(this.key, this.rabbit, this.getKey, null, this);
        this.physics.add.overlap(this.hp, this.rabbit, this.getHeart, null, this);



        this.physics.add.overlap(this.rabbit, this.pinguinSlide, this.rabbitOverlap, null, this);


        this.physics.add.overlap(this.rabbit, this.foxRun, this.rabbitOverlap, null, this);
        this.physics.add.overlap(this.rabbit, this.foxRun2, this.rabbitOverlap, null, this);
        this.physics.add.overlap(this.rabbit, this.foxRun3, this.rabbitOverlap, null, this);
        this.physics.add.overlap(this.rabbit, this.foxRun4, this.rabbitOverlap, null, this);

        this.physics.add.overlap(this.rabbit, this.boss, this.rabbitOverlap, null, this);
        // this.physics.add.overlap(this.rabbit, this.boss, this.rabbitOverlap, null, this);

    }

    getCarrot() {
        this.rabbit.carrot = true
        this.items.destroy()
    }

    getKey() {
        this.rabbit.key = true
        this.key.destroy()
    }

    getHeart() {
        this.rabbit.hp = this.rabbit.hp + 10
        this.hpText.setText(this.rabbit.hp)

        this.hp.destroy()
    }



    // ================================================== //
    //                MOB fonctionality                   //
    // ================================================== //


    foxRun_move() {
        this.foxRun.play('FOXmove', true);

        // vert la droite
        if (this.foxDirection) {
            this.foxRun.setVelocityX(165)
            this.foxRun.flipX = false
        }
        //  vers la gauche
        else {
            this.foxRun.setVelocityX(-165)
            this.foxRun.flipX = true
        }
        if (this.foxRun.body.position.x >= 740) {
            this.foxDirection = false
        }
        else if (this.foxRun.body.position.x <= 475) {
            this.foxDirection = true
        }
    }

    pinguin_move() {

        // this.pinguinSlide = this.physics.add.sprite(300, 850, "pinguinSlide")


        // vert la droite
        if (this.pinguinSlideDirection) {
            this.pinguinSlide.setVelocityX(165)
            this.pinguinSlide.flipX = false
        }
        //  vers la gauche
        else {
            this.pinguinSlide.setVelocityX(-165)
            this.pinguinSlide.flipX = true
        }
        if (this.pinguinSlide.body.position.x >= 740) {
            this.pinguinSlideDirection = false
        }
        else if (this.pinguinSlide.body.position.x <= 300) {
            this.pinguinSlideDirection = true
        }
    }

    // foxRunOverlap(projectile) {
    //     this.foxRun.hp = foxRun.hp - 1
    //     projectile.destroy()
    //     // console.log(foxRun);
    //     // console.log("================ CA MARCHE !!! ===============");
    // }

    mobOverlap(projectile, mob) {
        mob.hp = mob.hp - 1
        projectile.destroy()

        console.log("mob", mob);

        if (mob.hp == 0 && mob.texture.key !== "bossBiss") {
            mob.destroy()
        }

        else if (mob.texture.key == "bossBiss" && mob.hp == 0) {
            // this.boss.play('bossDead', true);
            // this.boss.status = 0
            this.boss.play('bossDead', true);
            this.boss.status = 0
        }

    }

    bossPaterne() {

        if (this.boss.hp > 0) {

            let x = this.boss.x;
            let y = this.boss.y;

            switch (this.bossPaterneStatus) {
                case 1:

                    this.boss.play('bossShoot', true).flipX = true


                    x = this.boss.x;
                    y = this.boss.y;
                    var projectile = this.physics.add.image(x, y + 30, "bullet")
                    projectile.body.allowGravity = false

                    this.physics.add.collider(projectile, this.platforms, this.bulletDistroy, null, this);
                    this.physics.add.overlap(this.rabbit, projectile, this.rabbitOverlap, null, this);
                    this.physics.add.collider(projectile, this.rabbit, this.bulletDistroy, null, this);


                    setInterval(() => {
                        projectile.x = projectile.x - 30
                    }, 70)



                    setTimeout(() => {
                        this.bossPaterneStatus = 2
                    }, 4000);

                    break;

                case 2:

                    this.boss.play('bossWalk', true);
                    this.boss.setVelocityX(-200)
                    setTimeout(() => {
                        this.bossPaterneStatus = 3
                    }, 5300);

                    break;

                case 3:

                    this.boss.play('bossShoot', true).flipX = false


                    x = this.boss.x;
                    y = this.boss.y;
                    var projectile = this.physics.add.image(x, y + 30, "bullet")
                    projectile.body.allowGravity = false

                    this.physics.add.collider(projectile, this.platforms, this.bulletDistroy, null, this);
                    this.physics.add.overlap(this.rabbit, projectile, this.rabbitOverlap, null, this);
                    this.physics.add.collider(projectile, this.rabbit, this.bulletDistroy, null, this);

                    setInterval(() => {
                        projectile.x = projectile.x + 30
                    }, 70)

                    setTimeout(() => {
                        this.bossPaterneStatus = 4
                    }, 4000);

                    break;

                case 4:

                    this.boss.play('bossWalk', true);
                    this.boss.setVelocityX(200)
                    this.boss.setVelocityY(-100)

                    if (this.boss.body.touching.down) {
                        this.boss.setVelocityY(-200)
                    }
                    else {
                        setTimeout(() => {
                            this.boss.setVelocityY(300)
                        }, 1000);

                    }



                    setTimeout(() => {
                        this.bossPaterneStatus = 1
                    }, 5300);

                    break;
            }

        }
        else {
            this.boss.play('bossDead', true);
        }

    }

    pinguinFly_move() {
        this.pinguinFly.play('pinguinFly', true);

        // vert la droite
        if (this.pinguinFlyDirection) {
            this.pinguinFly.setVelocityX(160)
            this.pinguinFly.setVelocityY(-165)
            this.pinguinFly.flipX = false
        }
        //  vers la gauche
        else {
            this.pinguinFly.setVelocityX(-160)
            this.pinguinFly.setVelocityY(-165)

            this.pinguinFly.flipX = true
        }
        if (this.pinguinFly.body.position.x >= 660) {
            this.pinguinFlyDirection = false
        }
        else if (this.pinguinFly.body.position.x <= 50) {
            this.pinguinFlyDirection = true
        }
    }

    boss_move() {
        this.boss.play('bossDead', true);
        // boss.play('bossShoot', true);
    }

    pinguinSlide_move() {
        this.pinguinSlide.play('pinguinSlide', true);
    }

    foxShoot_move() {
        this.foxShoot.play('FOXShoot', true);
    }


    bulletVertical() {



        setInterval(() => {
            let x = this.pinguinFly.x;
            let y = this.pinguinFly.y;
            let projectile = this.add.image(x, y, "bullet")
            this.physics.add.collider(projectile, this.platforms, this.bulletDistroy, null, this);
            this.physics.add.overlap(this.rabbit, projectile, this.rabbitOverlap, null, this);

            this.physics.world.enableBody(projectile)
        }, 1000);

        

    }

    // bulletHorizontal(mob) {
    //     let x = mob.x;
    //     let y = mob.y;

    //     setInterval(() => {
    //         var projectile = this.physics.add.image(x, y, "bullet")
    //         projectile.body.allowGravity = false
    //         this.physics.add.overlap(projectile, this.rabbit, this.rabbitOverlap);

    //         if (projectile.x < x + 500) {
    //             projectile.x = projectile.x + 5
    //         }
    //         else {
    //             this.bulletDistroy(projectile)
    //         }

    //     }, 1000);

    // }



    bulletDistroy(projectile) {
        projectile.destroy()
    }

}