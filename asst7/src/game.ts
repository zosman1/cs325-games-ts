// import "./phaser.js";

import * as Phaser from "phaser";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class


function degreesToRadians(degrees:number){
 return degrees * (Math.PI/180);
}
class MyScene extends Phaser.Scene {
    bouncy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    music: Phaser.Sound.BaseSound;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    score: number
    ScoreText: Phaser.GameObjects.Text;
    gameOver: any;
     
    constructor() {
        super(null);
        
        this.bouncy = null;
        this.score = 0;
        // this.scoreText = 
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'map', 'assets/map.png' );
        this.load.image('player', 'assets/rock.png');
        this.load.image('wallv', 'assets/wallv.png');
        this.load.image('wallh', 'assets/wallh.png');
        this.load.image('apple', 'assets/apple.png')
        this.load.image('tree', 'assets/tree.png')
        this.load.image('oasis', 'assets/oasis.png')
        // this.image
        this.load.audio('mk6', 'assets/mk6.1.mp3')
    }
    
    create() {
        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);
        this.player = this.physics.add.image(850, 600, 'player').setCollideWorldBounds(true).setScale(.3).setDepth(1);
        this.player.name = "player"
        // this.physics.add.image(800, 600, 'player').setCollideWorldBounds(true);



        this.cameras.main.setZoom(3)
        this.cameras.main.startFollow(this.player, false, .3, .3)
        this.cameras.main.setBackgroundColor("#003200");

        this.music = this.sound.add('mk6', {loop: true, volume: .02});

        this.music.play();


        this.cursors = this.input.keyboard.createCursorKeys();


        // physics stuff

        const walls = this.physics.add.group({immovable: true});

        // //hardcoded wall creating
        // this.createPhysicsObject(walls, 'wallv', 700, 400, .3)
        // this.createPhysicsObject(walls, 'wallv', 700, 300, .3)
        // this.createPhysicsObject(walls, 'wallv', 700, 200, .3)
        // this.createPhysicsObject(walls, 'wallv', 700, 500, .3)





        const trees = this.physics.add.group({immovable: true});

        //hardcoded tree creating
        this.createPhysicsObject(trees, 'tree', 300, 400, .5)
        this.createPhysicsObject(trees, 'tree', 500, 500, .5)
        this.createPhysicsObject(trees, 'tree', 200, 400, .5)
        this.createPhysicsObject(trees, 'tree', 300, 550, .5)
        this.createPhysicsObject(trees, 'tree', 500, 200, .5)
        this.createPhysicsObject(trees, 'tree', 700, 80, .5)
        this.createPhysicsObject(trees, 'tree', 100, 100, .5)
        this.createPhysicsObject(trees, 'tree', 200, 200, .5)

        this.createPhysicsObject(trees, 'tree', 700, 300, .5)
        this.createPhysicsObject(trees, 'tree', 700, 530, .5)
        // this.createPhysicsObject(trees, 'tree', 700, 200, .5)
        // this.createPhysicsObject(trees, 'tree', 700, 200, .5)
        // this.createPhysicsObject(trees, 'tree', 700, 200, .5)

        

        // this.create
        const special = this.physics.add.group({immovable: true});

        // this.createPhysicsObject(special, 'oasis', 100, 550, .3);
        




        this.physics.add.collider(this.player, [walls, trees, special])



        const apple = this.physics.add.group({immovable: true});

        //hardcoded apple creating
        this.createPhysicsObject(apple, 'apple', 400, 400, .3)
        this.createPhysicsObject(apple, 'apple', 600, 500, .3)
        this.createPhysicsObject(apple, 'apple', 100, 400, .3)
        this.createPhysicsObject(apple, 'apple', 400, 600, .3)
        this.createPhysicsObject(apple, 'apple', 600, 200, .3)
        this.createPhysicsObject(apple, 'apple', 800, 100, .3)
        this.createPhysicsObject(apple, 'apple', 100, 200, .3)
        this.createPhysicsObject(apple, 'apple', 200, 100, .3)

        this.physics.add.collider(this.player, apple, (obj1, obj2) => {
            // alert(obj1.name + " : " + obj2.name);
            obj2.destroy()
            // apple.
            this.score += 1;
            // alert(this.score)
            // alert(obj1.name)
            // this.add.follower()
            //@ts-ignore
            // apple.follow = true;
        })



        this.ScoreText = this.add.text(600, 200, `Score: ${this.score}`, {fontSize: "20px"})

    }
    createPhysicsObject(group: Phaser.Physics.Arcade.Group, sprite: string, x: number, y: number, scale: number){
        const newObject = group.create(x, y, sprite).setScale(scale);

        this.physics.add.existing(newObject);
        // newObject.body.setImmovable();
    }

    update() {
        this.handleMovement();

        if(this.gameOver) return;
        if(this.score == 8 && !this.gameOver){
            this.cameras.main.setZoom(1);
            this.cameras.main.centerOn(874 /2 , 620 /2 );
            const endText = this.add.text(this.player.x, this.player.y, "You Won!\n Now find your oasis", {fontSize: "20px"})
            setTimeout(() => {
                endText.destroy();
            },1000)
            this.ScoreText.destroy();
            // this.music.stop();
            this.gameOver = true;
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            const endings = this.physics.add.group({immovable: true});
            this.createPhysicsObject(endings, 'oasis', 100, 550, .3);
            this.createPhysicsObject(endings, 'oasis', 400, 100, .3);
            this.physics.add.collider(this.player, endings, (obj1, obj2) => {
                this.music.stop();
                const endText = this.add.text(this.player.x, this.player.y, "Good Job!", {fontSize: "20px"})
                setTimeout(() => {
                    endText.destroy();
                },1000)
                
            })
            // this.physics.add.image(100, 550, 'oasis').setScale(.3).setDepth(0);
            // this.physics.add.image(400, 100, 'oasis').setScale(.3).setDepth(0).setRotation(degreesToRadians(180));
            this.cameras.main.setZoom(1.5);

            return;

        }

        this.handleScoreMove();


        // this.handleFollow();

    }

    // handleFollow(){

    // }

    handleScoreMove(){
        // this.ScoreText = this.add.text(600, 200, "Score:", {fontSize: "20px"})
        const x = this.player.x;
        const y = this.player.y;

        this.ScoreText.x = x+30;
        this.ScoreText.y = y-100;

        this.ScoreText.text = `Score: ${this.score}`
    }


    handleMovement(){
        //handleMovement
        const speed = 100
        if(this.cursors.up.isDown || this.cursors.down.isDown){
            this.player.setVelocityY(this.cursors.up.isDown? -speed: speed);
        }
        else{
            this.player.setVelocityY(0)
        }
        if(this.cursors.right.isDown || this.cursors.left.isDown){
            this.player.setVelocityX(this.cursors.left.isDown? -speed: speed);
        }
        else{
            this.player.setVelocityX(0);
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 874,
    height: 620,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
