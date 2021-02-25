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


class MyScene extends Phaser.Scene {
    bouncy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    direction: null | "left" | "right";
    rightWind: Phaser.GameObjects.Image;
    leftWind: Phaser.GameObjects.Image;
    pirates: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[];
    gameOver: boolean;
    text: Phaser.GameObjects.Text;
    gameTime: number;
    timer: Phaser.GameObjects.Text;

    constructor() {
        super(null);
        
        this.bouncy = null;
        this.direction = null;
        this.pirates = [];
        this.gameOver = false;
        this.gameTime = 0;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        // this.load.image( 'rocket', 'assets/rocket.png' );
        this.load.image('map', 'assets/map.png');
        this.load.image('pirate', 'assets/pirate.png');
        this.load.image('wind', 'assets/wind.png');
    }
    
    create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        // this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'rocket' );
        
        const map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.5);


        // Make it bounce off of the world bounds.
        //@ts-ignore
        // this.bouncy.body.collideWorldBounds = true;
        
        // Make the camera shake when clicking/tapping on it.
        // this.bouncy.setInteractive();
        // this.bouncy.on( 'pointerdown', function() {
        //     this.scene.cameras.main.shake(500);
        //     });

        this.leftWind = this.add.image(370, 400, 'wind');
        this.leftWind.flipX = true;

        this.rightWind = this.add.image(950, 400, 'wind');

        this.rightWind.visible = false;
        this.leftWind.visible = false;


        // this.rightWind = this.add.image()
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.direction = "right"
            this.leftWind.visible = false;
            this.rightWind.visible = true;
        });
        this.input.keyboard.on('keydown-LEFT', () => {
            this.direction = "left"
            this.leftWind.visible = true;
            this.rightWind.visible = false;
        });

        // this.physics.add.sprite(100, 400, 'pirate').setFlipX(true).setVelocityX(40)

        setInterval(() => {
            if(this.gameOver) return;
            let left = Math.random() > .5
            this.pirates.push(this.physics.add.sprite(left ? 100 : 1200, 400, 'pirate').setFlipX(left).setVelocityX(left ? 40: -40));

        }, 4000)
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#FFFFFF", align: "center" };

        this.text = this.add.text( this.cameras.main.centerX, 15, "Protect your treasure from the pirates! \n Direct the mystical wind using your arrow keys", style );
        this.text.setOrigin( 0.5, 0.0 );


        setTimeout(() => {this.winGame()}, 60000);
        setInterval(() => this.updateTimer(), 100);

        this.timer = this.add.text(1050, 30, "Timer: 0.0", {fontSize:"20px"});


    }
    updateTimer(){
        if(this.gameOver) return;
        this.gameTime += .1
        this.timer.text = `Timer: ${this.gameTime.toFixed(1)}`

    }

    loseGame(){
        this.gameOver = true;
        this.text.setText("The pirates got your treasure!\n Try again next time!")
        this.pirates.forEach(pirate => {
            pirate.setVelocity(0,0)
        });
    }

    winGame(){
        this.gameOver = true;
        this.text.setText("The pirates have been scared off!\n Congratulations!")
        this.pirates.forEach(pirate => {
            pirate.setVelocity(0,0)
        });
    }

    update() {
        this.pirates.forEach((pirateship, i) => {
            if(pirateship.x > 600 && pirateship.x < 800){
                // pirateship.destroy()
                // delete this.pirates[i];
                this.loseGame();
                // delete pirateship
            }
        });

        if(this.direction == "left"){
            this.pirates.forEach((pirateship, i) => {
                if(pirateship.x > 300 && pirateship.x < 700){
                    //@ts-ignore
                    if(pirateship.dead) return;
                    //@ts-ignore
                    pirateship.dead = true;
                    const velo = pirateship.body.velocity.x;
                    pirateship.setVelocityX(velo * -2);
                    setTimeout(()=> { 
                        pirateship.destroy()
                        delete this.pirates[i];
                    }, 1000)
                    // pirateship.destroy()
                    // delete this.pirates[i];
                    // delete pirateship
                }
            });
        } else {
            this.pirates.forEach((pirateship, i) => {
                console.warn(pirateship.x)
                if(pirateship.x > 700 && pirateship.x < 1000){
                    //@ts-ignore
                    if(pirateship.dead) return;
                    //@ts-ignore
                    pirateship.dead = true;
                    const velo = pirateship.body.velocity.x;
                    pirateship.setVelocityX(velo * -2);
                    setTimeout(()=> { 
                        pirateship.destroy()
                        delete this.pirates[i];
                    }, 1000)
                    // pirateship.destroy()
                    // delete this.pirates[i];
                    // delete pirateship
                }
            });
        }

        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //@ts-ignore
        // this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1240,
    height: 847,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
